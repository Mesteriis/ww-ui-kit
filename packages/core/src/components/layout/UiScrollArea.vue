<script setup lang="ts">
import { computed, ref } from 'vue';

import { useId } from '@ww/primitives';

import { resolveLength } from '../shared/scroll';

defineOptions({ name: 'UiScrollArea' });

export type UiScrollAreaOrientation = 'vertical' | 'horizontal' | 'both';
export type UiScrollAreaVisibility = 'auto' | 'always' | 'hover';

const props = withDefaults(
  defineProps<{
    id?: string;
    orientation?: UiScrollAreaOrientation;
    visibility?: UiScrollAreaVisibility;
    width?: number | string;
    height?: number | string;
    maxWidth?: number | string;
    maxHeight?: number | string;
    ariaLabel?: string;
    ariaLabelledby?: string;
    tabindex?: number;
  }>(),
  {
    orientation: 'vertical',
    tabindex: 0,
    visibility: 'auto',
  }
);

const fallbackId = useId('scroll-area');
const viewportRef = ref<HTMLElement | null>(null);

const viewportId = computed(() => props.id ?? fallbackId.value);
const fallbackAriaLabel = computed(() => {
  if (props.ariaLabel || props.ariaLabelledby) {
    return undefined;
  }

  return 'Scrollable content';
});

const viewportStyle = computed<Record<string, string>>(() => ({
  overflowX: props.orientation === 'vertical' ? 'hidden' : 'auto',
  overflowY: props.orientation === 'horizontal' ? 'hidden' : 'auto',
  ...(resolveLength(props.width) ? { width: resolveLength(props.width) as string } : {}),
  ...(resolveLength(props.height) ? { height: resolveLength(props.height) as string } : {}),
  ...(resolveLength(props.maxWidth) ? { maxWidth: resolveLength(props.maxWidth) as string } : {}),
  ...(resolveLength(props.maxHeight)
    ? { maxHeight: resolveLength(props.maxHeight) as string }
    : {}),
}));

const scrollTo = (options: number | ScrollToOptions) => {
  if (!viewportRef.value) {
    return;
  }

  if (typeof options === 'number') {
    viewportRef.value.scrollTo({ top: options, behavior: 'auto' });
    return;
  }

  viewportRef.value.scrollTo(options);
};

const scrollBy = (options: number | ScrollToOptions) => {
  if (!viewportRef.value) {
    return;
  }

  if (typeof options === 'number') {
    viewportRef.value.scrollBy({ top: options, behavior: 'auto' });
    return;
  }

  viewportRef.value.scrollBy(options);
};

const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
  viewportRef.value?.scrollTo({ top: 0, behavior });
};

const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
  if (!viewportRef.value) {
    return;
  }

  viewportRef.value.scrollTo({
    top: viewportRef.value.scrollHeight,
    behavior,
  });
};

defineExpose({
  scrollBy,
  scrollTo,
  scrollToBottom,
  scrollToTop,
  viewportEl: viewportRef,
});
</script>

<template>
  <div
    class="ui-scroll-area"
    :class="[`ui-scroll-area--${props.orientation}`, `ui-scroll-area--${props.visibility}`]"
  >
    <div
      :id="viewportId"
      ref="viewportRef"
      class="ui-scroll-area__viewport"
      :style="viewportStyle"
      role="region"
      :tabindex="props.tabindex"
      :aria-label="props.ariaLabel ?? fallbackAriaLabel"
      :aria-labelledby="props.ariaLabelledby"
      data-ui-motion="ring-focus-soft"
    >
      <slot />
    </div>
  </div>
</template>
