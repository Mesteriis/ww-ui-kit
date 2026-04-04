<script setup lang="ts">
import { computed, ref, useSlots, watch, type Slots } from 'vue';

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
  }>(),
  {
    alt: '',
    aspect: 'auto',
    bordered: false,
    decoding: 'async',
    fit: 'cover',
    loading: 'lazy',
    rounded: true,
  }
);

const emit = defineEmits<{
  error: [event: Event];
  load: [event: Event];
}>();

const slots: Slots = useSlots();
const imageFailed = ref(false);

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

watch(
  () => props.src,
  () => {
    imageFailed.value = false;
  }
);

const onLoad = (event: Event) => {
  emit('load', event);
};

const onError = (event: Event) => {
  imageFailed.value = true;
  emit('error', event);
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
    <div
      class="ui-image__frame"
      :style="frameStyle"
      :data-ui-image-state="hasImage ? 'loaded' : 'fallback'"
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
    </div>

    <figcaption v-if="hasCaption" class="ui-image__caption">
      <slot name="caption">
        {{ props.caption }}
      </slot>
    </figcaption>
  </component>
</template>
