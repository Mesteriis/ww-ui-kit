import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';

import { prefersReducedMotion } from '@ww/primitives';

import type { SignalGraphMotionMode } from '../types';

export function useSignalGraphReducedMotion(motionMode: Ref<SignalGraphMotionMode | undefined>) {
  const reducedMotion = ref(false);
  let mediaQuery: MediaQueryList | null = null;
  let removeListener: (() => void) | null = null;

  const update = () => {
    if (motionMode.value === 'full') {
      reducedMotion.value = false;
      return;
    }

    if (motionMode.value === 'reduced') {
      reducedMotion.value = true;
      return;
    }

    reducedMotion.value = prefersReducedMotion();
  };

  const bindMediaQuery = () => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => {
      if (motionMode.value === 'system' || motionMode.value === undefined) {
        update();
      }
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      removeListener = () => mediaQuery?.removeEventListener('change', handleChange);
      return;
    }

    mediaQuery.addListener(handleChange);
    removeListener = () => mediaQuery?.removeListener(handleChange);
  };

  watch(motionMode, update, { immediate: true });

  onMounted(() => {
    bindMediaQuery();
    update();
  });

  onBeforeUnmount(() => {
    removeListener?.();
    mediaQuery = null;
  });

  return {
    reducedMotion,
  };
}
