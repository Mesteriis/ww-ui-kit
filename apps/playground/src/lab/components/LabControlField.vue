<script setup lang="ts">
import { computed } from 'vue';

import type { LabControl } from '../manifest/component-lab.types';

defineOptions({ name: 'LabControlField' });

const props = defineProps<{
  control: LabControl;
  modelValue: unknown;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: unknown];
  bulkAction: [mode: 'all' | 'none'];
}>();

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
    emit('update:modelValue', event.target.value);
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
  <section class="lab-control" :data-lab-control="props.control.id">
    <header class="lab-control__header">
      <label class="lab-control__label">{{ props.control.label }}</label>
      <p v-if="props.control.help" class="lab-control__help">{{ props.control.help }}</p>
    </header>

    <div v-if="props.control.kind === 'text'" class="lab-control__body">
      <input
        class="ui-input lab-control__input"
        :placeholder="props.control.placeholder"
        :value="String(props.modelValue ?? '')"
        @input="onTextInput"
      />
    </div>

    <div v-else-if="props.control.kind === 'number'" class="lab-control__body">
      <input
        class="ui-input lab-control__input"
        type="number"
        :min="props.control.min"
        :max="props.control.max"
        :step="props.control.step ?? 1"
        :value="Number(props.modelValue ?? 0)"
        @input="onNumberInput"
      />
    </div>

    <div v-else-if="props.control.kind === 'boolean'" class="lab-control__body">
      <label class="lab-control__toggle">
        <input type="checkbox" :checked="Boolean(props.modelValue)" @change="onBooleanChange" />
        <span>{{ Boolean(props.modelValue) ? 'On' : 'Off' }}</span>
      </label>
    </div>

    <div v-else-if="props.control.kind === 'select'" class="lab-control__body">
      <select
        class="ui-input ui-select__control lab-control__select"
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

    <div v-else-if="props.control.kind === 'segment'" class="lab-control__segment">
      <button
        v-for="option in props.control.options"
        :key="String(option.value)"
        type="button"
        class="lab-control__chip"
        :class="{ 'is-active': props.modelValue === option.value }"
        :aria-pressed="props.modelValue === option.value"
        @click="emit('update:modelValue', option.value)"
      >
        {{ option.label }}
      </button>
    </div>

    <div v-else class="lab-control__stack">
      <div class="lab-control__actions">
        <button type="button" class="lab-control__subtle" @click="emit('bulkAction', 'all')">
          {{ multiToggleControl?.enableAllLabel ?? 'Enable all' }}
        </button>
        <button type="button" class="lab-control__subtle" @click="emit('bulkAction', 'none')">
          {{ multiToggleControl?.disableAllLabel ?? 'Clear' }}
        </button>
      </div>
      <div class="lab-control__segment lab-control__segment--wrap">
        <button
          v-for="option in multiToggleControl?.options ?? []"
          :key="String(option.value)"
          type="button"
          class="lab-control__chip"
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
