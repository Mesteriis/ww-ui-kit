<script setup lang="ts">
import { computed } from 'vue';

import { useControllable, useId } from '@ww/primitives';

import UiProgress from '../display/UiProgress.vue';
import { mergeDescribedBy, useFieldContext } from './field-context';
import UiInputGroup from './UiInputGroup.vue';

defineOptions({ name: 'UiInputPassword' });

interface UiInputPasswordRule {
  label: string;
  met: boolean;
}

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    id?: string;
    name?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    invalid?: boolean;
    autocomplete?: string;
    ariaLabel?: string;
    ariaDescribedby?: string;
    revealed?: boolean;
    defaultRevealed?: boolean;
    revealToggle?: boolean;
    showLabel?: string;
    hideLabel?: string;
    strength?: number | null;
    strengthText?: string;
    rules?: readonly UiInputPasswordRule[];
  }>(),
  {
    autocomplete: 'current-password',
    defaultRevealed: false,
    disabled: false,
    hideLabel: 'Hide password',
    invalid: false,
    modelValue: '',
    readonly: false,
    revealToggle: true,
    rules: () => [] as const,
    showLabel: 'Show password',
    strength: null,
    strengthText: '',
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'update:revealed': [value: boolean];
}>();

const field = useFieldContext();
const fallbackId = useId('input-password');
const inputId = computed(() => props.id ?? field?.inputId.value ?? fallbackId.value);
const labelId = computed(() => (props.ariaLabel ? undefined : field?.labelId.value));
const strengthId = computed(() =>
  props.strength === null || props.strength === undefined ? undefined : `${inputId.value}-strength`
);
const rulesId = computed(() => (props.rules.length > 0 ? `${inputId.value}-rules` : undefined));
const describedBy = computed(() =>
  mergeDescribedBy(props.ariaDescribedby, field?.describedBy.value, strengthId.value, rulesId.value)
);
const isInvalid = computed(() => props.invalid || field?.invalid.value || false);
const revealState = useControllable({
  value: computed(() => props.revealed),
  defaultValue: props.defaultRevealed,
  onChange: (value) => emit('update:revealed', value),
});
const inputType = computed(() => (revealState.currentValue.value ? 'text' : 'password'));
const strengthValue = computed(() => Math.min(100, Math.max(0, Number(props.strength ?? 0))));
const strengthStatus = computed(() => {
  if (strengthValue.value >= 75) {
    return 'success';
  }

  if (strengthValue.value >= 40) {
    return 'warning';
  }

  return 'danger';
});
const strengthLabel = computed(() => props.strengthText || `${strengthValue.value}%`);

const onInput = (event: Event) => {
  if (event.target instanceof HTMLInputElement) {
    emit('update:modelValue', event.target.value);
  }
};

const toggleVisibility = () => {
  if (props.disabled || props.readonly) {
    return;
  }

  revealState.setValue(!revealState.currentValue.value);
};
</script>

<template>
  <div class="ui-input-password">
    <UiInputGroup
      class="ui-input-password__group"
      :disabled="props.disabled"
      :invalid="isInvalid"
      :aria-label="props.ariaLabel"
    >
      <input
        :id="inputId"
        class="ui-input ui-input-group__fill"
        :class="{ 'is-invalid': isInvalid }"
        :type="inputType"
        :name="props.name"
        :value="props.modelValue"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :autocomplete="props.autocomplete"
        :aria-label="props.ariaLabel"
        :aria-labelledby="labelId"
        :aria-invalid="isInvalid || undefined"
        :aria-describedby="describedBy"
        data-ui-motion="ring-focus-soft"
        @input="onInput"
      />
      <button
        v-if="props.revealToggle"
        type="button"
        class="ui-input-password__toggle"
        :disabled="props.disabled || props.readonly"
        :aria-controls="inputId"
        :aria-label="revealState.currentValue.value ? props.hideLabel : props.showLabel"
        :aria-pressed="revealState.currentValue.value"
        data-ui-motion="ring-focus-soft"
        @click="toggleVisibility"
      >
        {{ revealState.currentValue.value ? props.hideLabel : props.showLabel }}
      </button>
    </UiInputGroup>

    <div
      v-if="props.strength !== null && props.strength !== undefined"
      :id="strengthId"
      class="ui-input-password__meta"
    >
      <UiProgress
        :value="strengthValue"
        :status="strengthStatus"
        :aria-label="props.strengthText || 'Password strength'"
      />
      <span class="ui-input-password__strength">{{ strengthLabel }}</span>
    </div>

    <ul v-if="props.rules.length > 0" :id="rulesId" class="ui-input-password__rules">
      <li
        v-for="rule in props.rules"
        :key="rule.label"
        class="ui-input-password__rule"
        :data-state="rule.met ? 'met' : 'pending'"
      >
        <span class="ui-input-password__rule-indicator" aria-hidden="true">
          {{ rule.met ? '✓' : '•' }}
        </span>
        <span>{{ rule.label }}</span>
      </li>
    </ul>
  </div>
</template>
