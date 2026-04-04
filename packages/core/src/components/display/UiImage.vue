<script setup lang="ts">
import { computed, ref, useSlots, watch, type Slots } from 'vue';

import UiImagePreview, { type UiImagePreviewItem } from './UiImagePreview.vue';

defineOptions({ name: 'UiImage' });

export type UiImageAspect = 'auto' | 'square' | 'landscape' | 'portrait' | 'video' | number;
export type UiImageFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';

const props = withDefaults(
  defineProps<{
    src?: string | undefined;
    alt?: string | undefined;
    caption?: string | undefined;
    aspect?: UiImageAspect | undefined;
    fit?: UiImageFit | undefined;
    loading?: 'eager' | 'lazy' | undefined;
    decoding?: 'auto' | 'async' | 'sync' | undefined;
    bordered?: boolean | undefined;
    rounded?: boolean | undefined;
    previewable?: boolean | undefined;
    previewItems?: UiImagePreviewItem[] | undefined;
    previewIndex?: number | undefined;
  }>(),
  {
    alt: '',
    aspect: 'auto',
    bordered: false,
    decoding: 'async',
    fit: 'cover',
    loading: 'lazy',
    previewIndex: 0,
    previewable: false,
    rounded: true,
  }
);

const emit = defineEmits<{
  error: [event: Event];
  load: [event: Event];
}>();

const slots: Slots = useSlots();
const imageFailed = ref(false);
const previewOpen = ref(false);
const activePreviewIndex = ref(props.previewIndex ?? 0);

const hasImage = computed(() => Boolean(props.src) && !imageFailed.value);
const hasCaption = computed<boolean>(() => Boolean(props.caption) || Boolean(slots.caption));
const rootTag = computed(() => (hasCaption.value ? 'figure' : 'div'));
const aspectClass = computed(() =>
  typeof props.aspect === 'number' ? 'custom' : (props.aspect ?? 'auto')
);
const accessibleFallbackLabel = computed(() =>
  hasImage.value ? undefined : props.alt.trim() || undefined
);
const frameStyle = computed<Record<string, string> | undefined>(() =>
  typeof props.aspect === 'number' && props.aspect > 0
    ? { '--ui-image-aspect': String(props.aspect) }
    : undefined
);
const previewItems = computed<UiImagePreviewItem[]>(() => {
  if (props.previewItems && props.previewItems.length > 0) {
    return props.previewItems;
  }

  if (!props.src) {
    return [];
  }

  return [
    {
      src: props.src,
      ...(props.alt ? { alt: props.alt } : {}),
      ...(props.caption ? { caption: props.caption } : {}),
    },
  ];
});

watch(
  () => props.src,
  () => {
    imageFailed.value = false;
  }
);

watch(
  () => props.previewIndex,
  (nextIndex) => {
    activePreviewIndex.value = nextIndex ?? 0;
  }
);

const onLoad = (event: Event) => {
  emit('load', event);
};

const onError = (event: Event) => {
  imageFailed.value = true;
  emit('error', event);
};

const openPreview = () => {
  if (!props.previewable || previewItems.value.length === 0) {
    return;
  }

  previewOpen.value = true;
};
</script>

<template>
  <component
    :is="rootTag"
    class="ui-image"
    :class="[
      `ui-image--${aspectClass}`,
      {
        'ui-image--bordered': props.bordered,
        'ui-image--rounded': props.rounded,
      },
    ]"
    :role="accessibleFallbackLabel ? 'img' : undefined"
    :aria-label="accessibleFallbackLabel"
  >
    <component
      :is="props.previewable ? 'button' : 'div'"
      class="ui-image__frame"
      :class="{ 'ui-image__frame--interactive': props.previewable }"
      :style="frameStyle"
      :data-ui-image-state="hasImage ? 'loaded' : 'fallback'"
      :type="props.previewable ? 'button' : undefined"
      :aria-label="props.previewable ? `Preview ${props.alt || 'image'}` : undefined"
      @click="openPreview"
    >
      <img
        v-if="hasImage"
        class="ui-image__media"
        :src="props.src"
        :alt="props.alt"
        :loading="props.loading"
        :decoding="props.decoding"
        :style="{ objectFit: props.fit }"
        @load="onLoad"
        @error="onError"
      />
      <div v-else class="ui-image__fallback" aria-hidden="true">
        <slot name="fallback">◌</slot>
      </div>
    </component>

    <figcaption v-if="hasCaption" class="ui-image__caption">
      <slot name="caption">
        {{ props.caption }}
      </slot>
    </figcaption>

    <UiImagePreview
      v-if="props.previewable"
      v-model:open="previewOpen"
      v-model="activePreviewIndex"
      :items="previewItems"
    />
  </component>
</template>
