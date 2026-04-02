<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import type { Container } from '@tsparticles/engine';

import { useId } from '@ww/primitives';
import { observeThemeRuntime, readThemeRuntime } from '@ww/themes';

import { ensureTsParticlesEngine } from '../composables/useTsParticlesEngine';
import { normalizeTsParticlesOptions } from '../internal/normalize-tsparticles-options';
import { resolveCssVariableColor } from '../internal/resolve-css-variable-color';
import type { UiTsParticlesBackdropProps } from '../types';

defineOptions({ name: 'UiTsParticlesBackdrop' });

const props = withDefaults(defineProps<UiTsParticlesBackdropProps>(), {
  size: 'auto',
  disabled: false,
  particleColorVar: '--ui-border-focus',
  linkColorVar: '--ui-border-subtle',
});

const hostRef = ref<HTMLElement | null>(null);
const canvasHostRef = ref<HTMLElement | null>(null);
const backdropId = useId('tsparticles-backdrop');
const reducedMotion = ref(false);
const themeRevision = ref(0);

let particlesContainer: Container | null | undefined = null;
let stopObservingTheme: (() => void) | null = null;
let mediaQuery: MediaQueryList | null = null;
let removeReducedMotionListener: (() => void) | null = null;
let particlesLoadPromise: Promise<Container | undefined> | null = null;
let disposed = false;

const backdropOptions = computed(() => {
  void themeRevision.value;

  const hostElement = hostRef.value;
  const themeContainer = hostElement
    ? readThemeRuntime(hostElement).container || hostElement
    : null;

  return normalizeTsParticlesOptions({
    userOptions: props.options,
    particleColor: resolveCssVariableColor({
      variableName: props.particleColorVar,
      source: themeContainer,
      fallbackExpression: 'var(--ui-text-primary)',
    }),
    linkColor: resolveCssVariableColor({
      variableName: props.linkColorVar,
      source: themeContainer,
      fallbackExpression: 'var(--ui-border-subtle)',
    }),
    reducedMotion: reducedMotion.value,
  });
});

function updateReducedMotion() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    reducedMotion.value = false;
    return;
  }

  if (!mediaQuery) {
    mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  }

  reducedMotion.value = mediaQuery.matches;
}

function bindReducedMotion() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return;
  }

  updateReducedMotion();
  const activeMediaQuery = mediaQuery;

  const handleChange = () => {
    updateReducedMotion();
  };

  if (typeof activeMediaQuery?.addEventListener === 'function') {
    activeMediaQuery.addEventListener('change', handleChange);
    removeReducedMotionListener = () =>
      activeMediaQuery.removeEventListener('change', handleChange);
    return;
  }

  activeMediaQuery?.addListener(handleChange);
  removeReducedMotionListener = () => activeMediaQuery?.removeListener(handleChange);
}

function unbindReducedMotion() {
  removeReducedMotionListener?.();
  removeReducedMotionListener = null;
  mediaQuery = null;
}

function reconnectThemeObserver() {
  stopObservingTheme?.();
  stopObservingTheme = observeThemeRuntime(hostRef.value, () => {
    themeRevision.value += 1;
  });
}

function destroyParticles() {
  particlesLoadPromise = null;
  particlesContainer?.destroy();
  particlesContainer = null;
}

async function refreshParticles() {
  if (disposed || props.disabled || !canvasHostRef.value) {
    destroyParticles();
    return;
  }

  const engine = await ensureTsParticlesEngine();

  if (disposed || props.disabled || !canvasHostRef.value) {
    return;
  }

  if (!particlesContainer) {
    if (!particlesLoadPromise) {
      particlesLoadPromise = engine
        .load({
          id: backdropId.value,
          element: canvasHostRef.value,
          options: backdropOptions.value,
        })
        .finally(() => {
          particlesLoadPromise = null;
        });
    }

    particlesContainer = await particlesLoadPromise;
    return;
  }

  await particlesContainer.reset(backdropOptions.value);
}

watch(
  hostRef,
  () => {
    themeRevision.value += 1;
    reconnectThemeObserver();
  },
  { flush: 'post' }
);

watch(
  () => [canvasHostRef.value, props.disabled, backdropOptions.value] as const,
  () => {
    void refreshParticles();
  },
  { deep: true, flush: 'post', immediate: true }
);

bindReducedMotion();

onBeforeUnmount(() => {
  disposed = true;
  stopObservingTheme?.();
  stopObservingTheme = null;
  unbindReducedMotion();
  destroyParticles();
});
</script>

<template>
  <div
    ref="hostRef"
    class="ui-tsparticles-backdrop"
    :class="{
      'ui-tsparticles-backdrop--fill': props.size === 'fill',
      'ui-tsparticles-backdrop--disabled': props.disabled,
    }"
  >
    <div class="ui-tsparticles-backdrop__layer" aria-hidden="true">
      <div ref="canvasHostRef" class="ui-tsparticles-backdrop__canvas" />
    </div>
    <div class="ui-tsparticles-backdrop__content">
      <slot />
    </div>
  </div>
</template>
