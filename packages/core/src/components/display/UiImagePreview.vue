<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';

import UiButton from '../buttons/UiButton.vue';
import UiIconButton from '../buttons/UiIconButton.vue';
import UiDialog from '../overlay/UiDialog.vue';
import UiIcon from './UiIcon.vue';

defineOptions({ name: 'UiImagePreview' });

export interface UiImagePreviewItem {
  src: string;
  alt?: string;
  caption?: string;
}

const props = withDefaults(
  defineProps<{
    open: boolean;
    modelValue?: number;
    items: UiImagePreviewItem[];
    loop?: boolean;
    portalTarget?: string | HTMLElement | null;
  }>(),
  {
    loop: true,
    modelValue: 0,
  }
);

const emit = defineEmits<{
  'update:open': [value: boolean];
  'update:modelValue': [value: number];
}>();

const zoom = ref(1);
const rotation = ref(0);
const currentIndex = computed(() => {
  if (props.items.length === 0) {
    return 0;
  }

  return Math.min(Math.max(props.modelValue ?? 0, 0), props.items.length - 1);
});
const currentItem = computed(() => props.items[currentIndex.value] ?? null);

const canGoPrevious = computed(() => props.loop || currentIndex.value > 0);
const canGoNext = computed(() => props.loop || currentIndex.value < props.items.length - 1);
const imageStyle = computed<Record<string, string>>(() => ({
  transform: `scale(${zoom.value}) rotate(${rotation.value}deg)`,
}));

const close = () => emit('update:open', false);
const setIndex = (nextIndex: number) => {
  if (props.items.length === 0) {
    return;
  }

  let resolvedIndex = nextIndex;
  if (props.loop) {
    resolvedIndex = (nextIndex + props.items.length) % props.items.length;
  } else {
    resolvedIndex = Math.min(Math.max(nextIndex, 0), props.items.length - 1);
  }

  emit('update:modelValue', resolvedIndex);
};

const goPrevious = () => {
  if (!canGoPrevious.value) {
    return;
  }
  setIndex(currentIndex.value - 1);
};

const goNext = () => {
  if (!canGoNext.value) {
    return;
  }
  setIndex(currentIndex.value + 1);
};

const resetTransform = () => {
  zoom.value = 1;
  rotation.value = 0;
};

const onKeydown = (event: KeyboardEvent) => {
  if (!props.open) {
    return;
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    goPrevious();
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    goNext();
  } else if (event.key === '+' || event.key === '=') {
    event.preventDefault();
    zoom.value = Math.min(zoom.value + 0.25, 3);
  } else if (event.key === '-') {
    event.preventDefault();
    zoom.value = Math.max(zoom.value - 0.25, 1);
  } else if (event.key.toLowerCase() === 'r') {
    event.preventDefault();
    rotation.value = (rotation.value + 90) % 360;
  }
};

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      resetTransform();
      await nextTick();
      window.addEventListener('keydown', onKeydown);
      return;
    }

    window.removeEventListener('keydown', onKeydown);
  }
);

watch(
  () => props.modelValue,
  () => {
    resetTransform();
  }
);

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <UiDialog
    :open="props.open"
    role="dialog"
    :portal-target="props.portalTarget"
    aria-label="Image preview"
    @update:open="close"
  >
    <div class="ui-image-preview">
      <header class="ui-image-preview__toolbar">
        <div class="ui-image-preview__counter">
          {{ currentIndex + 1 }} / {{ props.items.length }}
        </div>
        <div class="ui-image-preview__actions">
          <UiIconButton
            ariaLabel="Zoom out"
            :disabled="zoom <= 1"
            @click="zoom = Math.max(zoom - 0.25, 1)"
          >
            <UiIcon name="zoomOut" />
          </UiIconButton>
          <UiIconButton
            ariaLabel="Zoom in"
            :disabled="zoom >= 3"
            @click="zoom = Math.min(zoom + 0.25, 3)"
          >
            <UiIcon name="zoomIn" />
          </UiIconButton>
          <UiIconButton ariaLabel="Rotate image" @click="rotation = (rotation + 90) % 360">
            <UiIcon name="rotateCw" />
          </UiIconButton>
        </div>
      </header>

      <div class="ui-image-preview__viewport">
        <UiButton
          variant="ghost"
          size="sm"
          class="ui-image-preview__nav ui-image-preview__nav--previous"
          :disabled="!canGoPrevious"
          @click="goPrevious"
        >
          <template #leftIcon>
            <UiIcon name="chevronLeft" />
          </template>
          Prev
        </UiButton>

        <figure v-if="currentItem" class="ui-image-preview__figure">
          <img
            class="ui-image-preview__image"
            :src="currentItem.src"
            :alt="currentItem.alt ?? ''"
            :style="imageStyle"
          />
          <figcaption v-if="currentItem.caption" class="ui-image-preview__caption">
            {{ currentItem.caption }}
          </figcaption>
        </figure>

        <UiButton
          variant="ghost"
          size="sm"
          class="ui-image-preview__nav ui-image-preview__nav--next"
          :disabled="!canGoNext"
          @click="goNext"
        >
          Next
          <template #rightIcon>
            <UiIcon name="chevronRight" />
          </template>
        </UiButton>
      </div>

      <footer
        v-if="props.items.length > 1"
        class="ui-image-preview__thumbs"
        aria-label="Preview images"
      >
        <button
          v-for="(item, index) in props.items"
          :key="`${item.src}-${index}`"
          type="button"
          class="ui-image-preview__thumb"
          :class="{ 'is-active': index === currentIndex }"
          :aria-label="`Open image ${index + 1}`"
          @click="setIndex(index)"
        >
          <img :src="item.src" :alt="item.alt ?? ''" />
        </button>
      </footer>
    </div>
  </UiDialog>
</template>
