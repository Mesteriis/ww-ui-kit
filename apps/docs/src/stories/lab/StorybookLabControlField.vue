<script setup lang="ts">
import { computed } from 'vue';

import type { LabControl } from '../../../../../apps/playground/src/lab/manifest/component-lab.types';

defineOptions({ name: 'StorybookLabControlField' });

const props = defineProps<{
  control: LabControl;
  modelValue: unknown;
}>();

const emit = defineEmits<{
  bulkAction: [mode: 'all' | 'none'];
  'update:modelValue': [value: unknown];
}>();

const resolveOptionValue = (rawValue: string) => {
  if (!('options' in props.control)) {
    return rawValue;
  }

  return (
    props.control.options.find((option) => String(option.value) === rawValue)?.value ?? rawValue
  );
};

const onTextInput = (event: Event) => {
  if (event.target instanceof HTMLInputElement) {
    emit('update:modelValue', event.target.value);
  }
};

const onNumberInput = (event: Event) => {
  if (event.target instanceof HTMLInputElement) {
    emit('update:modelValue', Number(event.target.value));
  }
};

const onBooleanChange = (event: Event) => {
  if (event.target instanceof HTMLInputElement) {
    emit('update:modelValue', event.target.checked);
  }
};

const onSelectChange = (event: Event) => {
  if (event.target instanceof HTMLSelectElement) {
    emit('update:modelValue', resolveOptionValue(event.target.value));
  }
};

const multiToggleControl = computed(() =>
  props.control.kind === 'multi-toggle' ? props.control : null
);

const toggleMultiValue = (optionValue: string | number) => {
  const currentValues = Array.isArray(props.modelValue)
    ? props.modelValue.filter(
        (value): value is string | number => typeof value === 'string' || typeof value === 'number'
      )
    : [];
  const nextValues = currentValues.includes(optionValue)
    ? currentValues.filter((value) => value !== optionValue)
    : [...currentValues, optionValue];
  emit('update:modelValue', nextValues);
};

const isPressed = (optionValue: string | number) =>
  Array.isArray(props.modelValue) && props.modelValue.includes(optionValue);
</script>

<template>
  <section class="sb-lab-control" :data-lab-control="props.control.id">
    <header class="sb-lab-control__header">
      <label class="sb-lab-control__label">{{ props.control.label }}</label>
      <p v-if="props.control.help" class="sb-lab-control__help">{{ props.control.help }}</p>
    </header>

    <div v-if="props.control.kind === 'text'" class="sb-lab-control__body">
      <input
        :aria-label="props.control.label"
        class="ui-input sb-lab-control__input"
        :placeholder="props.control.placeholder"
        :value="String(props.modelValue ?? '')"
        @input="onTextInput"
      />
    </div>

    <div v-else-if="props.control.kind === 'number'" class="sb-lab-control__body">
      <input
        :aria-label="props.control.label"
        class="ui-input sb-lab-control__input"
        type="number"
        :min="props.control.min"
        :max="props.control.max"
        :step="props.control.step ?? 1"
        :value="Number(props.modelValue ?? 0)"
        @input="onNumberInput"
      />
    </div>

    <div v-else-if="props.control.kind === 'boolean'" class="sb-lab-control__body">
      <label class="sb-lab-control__toggle">
        <input
          :aria-label="props.control.label"
          type="checkbox"
          :checked="Boolean(props.modelValue)"
          @change="onBooleanChange"
        />
        <span>{{ Boolean(props.modelValue) ? 'On' : 'Off' }}</span>
      </label>
    </div>

    <div v-else-if="props.control.kind === 'select'" class="sb-lab-control__body">
      <select
        :aria-label="props.control.label"
        class="ui-input ui-select__control sb-lab-control__select"
        :value="String(props.modelValue ?? '')"
        @change="onSelectChange"
      >
        <option
          v-for="option in props.control.options"
          :key="String(option.value)"
          :value="String(option.value)"
        >
          {{ option.label }}
        </option>
      </select>
    </div>

    <div v-else-if="props.control.kind === 'segment'" class="sb-lab-control__segment">
      <button
        v-for="option in props.control.options"
        :key="String(option.value)"
        type="button"
        class="sb-lab-control__chip"
        :class="{ 'is-active': props.modelValue === option.value }"
        :aria-pressed="props.modelValue === option.value"
        @click="emit('update:modelValue', option.value)"
      >
        {{ option.label }}
      </button>
    </div>

    <div v-else class="sb-lab-control__stack">
      <div class="sb-lab-control__actions">
        <button type="button" class="sb-lab-control__subtle" @click="emit('bulkAction', 'all')">
          {{ multiToggleControl?.enableAllLabel ?? 'Enable all' }}
        </button>
        <button type="button" class="sb-lab-control__subtle" @click="emit('bulkAction', 'none')">
          {{ multiToggleControl?.disableAllLabel ?? 'Clear' }}
        </button>
      </div>
      <div class="sb-lab-control__segment sb-lab-control__segment--wrap">
        <button
          v-for="option in multiToggleControl?.options ?? []"
          :key="String(option.value)"
          type="button"
          class="sb-lab-control__chip"
          :class="{ 'is-active': isPressed(option.value) }"
          :aria-pressed="isPressed(option.value)"
          @click="toggleMultiValue(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
  </section>
</template>
