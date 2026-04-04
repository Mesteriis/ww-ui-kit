<script setup lang="ts">
import { computed } from 'vue';

import { useControllable } from '@ww/primitives';

import UiIcon from '../display/UiIcon.vue';

defineOptions({ name: 'UiSteps' });

export type UiStepStatus = 'wait' | 'process' | 'complete' | 'error';
export type UiStepsOrientation = 'horizontal' | 'vertical';

export interface UiStepItem {
  title: string;
  description?: string;
  icon?: string;
  status?: UiStepStatus;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    items: UiStepItem[];
    modelValue?: number;
    defaultStep?: number;
    orientation?: UiStepsOrientation;
    clickable?: boolean;
    linear?: boolean;
    ariaLabel?: string;
  }>(),
  {
    ariaLabel: 'Progress steps',
    clickable: false,
    defaultStep: 0,
    linear: false,
    orientation: 'horizontal',
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: number];
  select: [payload: { index: number; item: UiStepItem }];
}>();

const state = useControllable({
  defaultValue: props.defaultStep,
  onChange: (value) => emit('update:modelValue', value),
  value: computed(() => props.modelValue),
});

const currentStep = computed(() =>
  Math.min(Math.max(0, state.currentValue.value), Math.max(0, props.items.length - 1))
);

const resolveStatus = (item: UiStepItem, index: number): UiStepStatus => {
  if (item.status) {
    return item.status;
  }

  if (index < currentStep.value) {
    return 'complete';
  }

  if (index === currentStep.value) {
    return 'process';
  }

  return 'wait';
};

const canSelect = (item: UiStepItem, index: number) =>
  props.clickable && !item.disabled && (!props.linear || index <= currentStep.value + 1);

const onSelect = (item: UiStepItem, index: number) => {
  state.setValue(index);
  emit('select', { index, item });
};
</script>

<template>
  <nav class="ui-steps" :data-orientation="props.orientation" :aria-label="props.ariaLabel">
    <ol class="ui-steps__list">
      <li
        v-for="(item, index) in props.items"
        :key="`${item.title}-${index}`"
        class="ui-steps__item"
        :class="[
          `ui-steps__item--${resolveStatus(item, index)}`,
          {
            'is-current': index === currentStep,
            'is-clickable': canSelect(item, index),
            'is-disabled': item.disabled,
          },
        ]"
      >
        <button
          v-if="props.clickable"
          type="button"
          class="ui-steps__trigger"
          :aria-current="index === currentStep ? 'step' : undefined"
          :disabled="!canSelect(item, index)"
          data-ui-motion="ring-focus-soft"
          @click="onSelect(item, index)"
        >
          <span class="ui-steps__marker" aria-hidden="true">
            <UiIcon v-if="item.icon" decorative>{{ item.icon }}</UiIcon>
            <template v-else>{{ index + 1 }}</template>
          </span>
          <span class="ui-steps__body">
            <span class="ui-steps__title">{{ item.title }}</span>
            <span v-if="item.description" class="ui-steps__description">{{
              item.description
            }}</span>
          </span>
        </button>
        <div
          v-else
          class="ui-steps__trigger"
          :aria-current="index === currentStep ? 'step' : undefined"
        >
          <span class="ui-steps__marker" aria-hidden="true">
            <UiIcon v-if="item.icon" decorative>{{ item.icon }}</UiIcon>
            <template v-else>{{ index + 1 }}</template>
          </span>
          <span class="ui-steps__body">
            <span class="ui-steps__title">{{ item.title }}</span>
            <span v-if="item.description" class="ui-steps__description">{{
              item.description
            }}</span>
          </span>
        </div>
      </li>
    </ol>
  </nav>
</template>
