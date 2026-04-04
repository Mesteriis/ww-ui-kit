<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import type { UiLayoutGapToken } from './layout.types';
import { resolveGapToken } from './layout.shared';
import {
  getScrollTop,
  resolveScrollTarget,
  scrollTargetTo,
  type UiScrollTarget,
} from '../shared/scroll';

defineOptions({ name: 'UiScrollTop' });

export type UiScrollTopPosition = 'bottom-end' | 'bottom-start' | 'top-end' | 'top-start';

const props = withDefaults(
  defineProps<{
    target?: UiScrollTarget;
    threshold?: number;
    behavior?: ScrollBehavior;
    position?: UiScrollTopPosition;
    offset?: UiLayoutGapToken;
    ariaLabel?: string;
    disabled?: boolean;
  }>(),
  {
    ariaLabel: 'Scroll to top',
    behavior: 'smooth',
    disabled: false,
    offset: '6',
    position: 'bottom-end',
    threshold: 160,
  }
);

const visible = ref(false);

let detachListeners: (() => void) | null = null;

const positionStyle = computed<Record<string, string>>(() => ({
  '--ui-scroll-top-offset': resolveGapToken(props.offset),
}));

const updateVisibility = () => {
  if (props.disabled) {
    visible.value = false;
    return;
  }

  const target = resolveScrollTarget(props.target);
  visible.value = getScrollTop(target) > props.threshold;
};

const bindListeners = () => {
  detachListeners?.();

  const target = resolveScrollTarget(props.target);
  if (!target) {
    visible.value = false;
    return;
  }

  const scrollHost = target === window ? window : target;
  const options = { passive: true } as const;

  scrollHost.addEventListener('scroll', updateVisibility, options);
  window.addEventListener('resize', updateVisibility, options);

  detachListeners = () => {
    scrollHost.removeEventListener('scroll', updateVisibility);
    window.removeEventListener('resize', updateVisibility);
  };

  updateVisibility();
};

const scrollToTop = () => {
  if (props.disabled) {
    return;
  }

  scrollTargetTo(resolveScrollTarget(props.target), {
    top: 0,
    behavior: props.behavior,
  });
};

watch(() => [props.target, props.threshold, props.disabled] as const, bindListeners);

onMounted(bindListeners);

onBeforeUnmount(() => {
  detachListeners?.();
});
</script>

<template>
  <div
    class="ui-scroll-top"
    :class="`ui-scroll-top--${props.position}`"
    :style="positionStyle"
    :data-visible="visible || undefined"
  >
    <button
      v-if="visible && !props.disabled"
      type="button"
      class="ui-scroll-top__button"
      :aria-label="props.ariaLabel"
      data-ui-motion="ring-focus-soft"
      @click="scrollToTop"
    >
      <slot :visible="visible">
        <span aria-hidden="true">↑</span>
      </slot>
    </button>
  </div>
</template>
