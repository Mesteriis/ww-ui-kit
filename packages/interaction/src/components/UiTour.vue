<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';

import { UiButton, UiIcon } from '@ww/core';
import { PrimitivePortal, useControllable, useId } from '@ww/primitives';
import type { UiTourStep } from '../types';

defineOptions({ name: 'UiTour' });

const props = withDefaults(
  defineProps<{
    open?: boolean;
    modelValue?: number;
    steps: UiTourStep[];
    portalTarget?: string | HTMLElement | null;
  }>(),
  {}
);

const emit = defineEmits<{
  'update:open': [value: boolean];
  'update:modelValue': [value: number];
  finish: [];
  skip: [];
}>();

const panelRef = ref<HTMLElement | null>(null);
const spotlightRect = ref<DOMRect | null>(null);
const titleId = useId('tour-title');
const descriptionId = useId('tour-description');

const openState = useControllable<boolean>({
  defaultValue: false,
  onChange: (value) => emit('update:open', value),
  value: computed(() => props.open),
});
const stepState = useControllable<number>({
  defaultValue: 0,
  onChange: (value) => emit('update:modelValue', value),
  value: computed(() => props.modelValue),
});

const currentStep = computed(() => props.steps[stepState.currentValue.value] ?? null);

const resolveTarget = () => {
  const target = currentStep.value?.target;
  if (!target) {
    return null;
  }

  if (typeof target === 'string') {
    return document.querySelector<HTMLElement>(target);
  }

  if (typeof target === 'function') {
    return target();
  }

  return target;
};

const updateSpotlight = async () => {
  if (!openState.currentValue.value) {
    spotlightRect.value = null;
    return;
  }

  await nextTick();
  const target = resolveTarget();
  spotlightRect.value = target?.getBoundingClientRect() ?? null;

  if (target) {
    const prefersReducedMotion =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;
    if (typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  }
};

watch([() => props.steps, openState.currentValue, stepState.currentValue], () => {
  void updateSpotlight();
});

const onViewportChange = () => {
  void updateSpotlight();
};

watch(
  openState.currentValue,
  (isOpen) => {
    if (isOpen) {
      window.addEventListener('resize', onViewportChange);
      window.addEventListener('scroll', onViewportChange, true);
      window.addEventListener('keydown', onKeydown);
      void updateSpotlight();
      return;
    }

    window.removeEventListener('resize', onViewportChange);
    window.removeEventListener('scroll', onViewportChange, true);
    window.removeEventListener('keydown', onKeydown);
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  window.removeEventListener('resize', onViewportChange);
  window.removeEventListener('scroll', onViewportChange, true);
  window.removeEventListener('keydown', onKeydown);
});

const closeTour = () => {
  openState.setValue(false);
};

const nextStep = () => {
  if (stepState.currentValue.value >= props.steps.length - 1) {
    emit('finish');
    closeTour();
    return;
  }

  stepState.setValue(stepState.currentValue.value + 1);
};

const previousStep = () => {
  stepState.setValue(Math.max(stepState.currentValue.value - 1, 0));
};

const skipTour = () => {
  emit('skip');
  closeTour();
};

function onKeydown(event: KeyboardEvent) {
  if (!openState.currentValue.value) {
    return;
  }

  if (event.key === 'Escape') {
    event.preventDefault();
    skipTour();
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    nextStep();
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    previousStep();
  }
}

const spotlightStyle = computed<Record<string, string> | undefined>(() => {
  if (!spotlightRect.value) {
    return undefined;
  }

  return {
    height: `${spotlightRect.value.height}px`,
    left: `${spotlightRect.value.left}px`,
    top: `${spotlightRect.value.top}px`,
    width: `${spotlightRect.value.width}px`,
  };
});

const panelStyle = computed<Record<string, string>>(() => {
  const rect = spotlightRect.value;
  const placement = currentStep.value?.placement ?? 'bottom';

  if (!rect || placement === 'center') {
    return {
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    };
  }

  if (placement === 'top') {
    return {
      left: `${rect.left + rect.width / 2}px`,
      top: `${Math.max(rect.top - 20, 20)}px`,
      transform: 'translate(-50%, -100%)',
    };
  }

  if (placement === 'left') {
    return {
      left: `${Math.max(rect.left - 20, 20)}px`,
      top: `${rect.top + rect.height / 2}px`,
      transform: 'translate(-100%, -50%)',
    };
  }

  if (placement === 'right') {
    return {
      left: `${rect.right + 20}px`,
      top: `${rect.top + rect.height / 2}px`,
      transform: 'translate(0, -50%)',
    };
  }

  return {
    left: `${rect.left + rect.width / 2}px`,
    top: `${rect.bottom + 20}px`,
    transform: 'translate(-50%, 0)',
  };
});
</script>

<template>
  <PrimitivePortal v-bind="props.portalTarget !== undefined ? { to: props.portalTarget } : {}">
    <div v-if="openState.currentValue.value && currentStep" class="ui-tour">
      <div class="ui-tour__backdrop" @click="skipTour" />
      <div v-if="spotlightStyle" class="ui-tour__spotlight" :style="spotlightStyle" />

      <section
        ref="panelRef"
        class="ui-tour__panel"
        :style="panelStyle"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        :aria-describedby="currentStep.description ? descriptionId : undefined"
      >
        <p class="ui-tour__step">Step {{ stepState.currentValue.value + 1 }} / {{ props.steps.length }}</p>
        <h3 :id="titleId">{{ currentStep.title }}</h3>
        <p v-if="currentStep.description" :id="descriptionId">{{ currentStep.description }}</p>

        <div class="ui-tour__actions">
          <UiButton variant="ghost" size="sm" @click="skipTour">
            <template #leftIcon>
              <UiIcon name="close" decorative />
            </template>
            Skip
          </UiButton>
          <UiButton
            size="sm"
            variant="secondary"
            :disabled="stepState.currentValue.value === 0"
            @click="previousStep"
          >
            {{ currentStep.previousLabel ?? 'Back' }}
          </UiButton>
          <UiButton size="sm" @click="nextStep">
            {{ currentStep.nextLabel ?? (stepState.currentValue.value === props.steps.length - 1 ? 'Finish' : 'Next') }}
          </UiButton>
        </div>
      </section>
    </div>
  </PrimitivePortal>
</template>
