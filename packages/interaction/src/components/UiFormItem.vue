<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, type ComponentPublicInstance } from 'vue';

import { UiField } from '@ww/core';

import {
  createUiFormFieldState,
  useUiFormContext,
  type UiFormRule,
} from '../internal/formContext';

defineOptions({ name: 'UiFormItem' });

const props = withDefaults(
  defineProps<{
    name: string;
    label?: string;
    help?: string;
    required?: boolean;
    rules?: UiFormRule[];
    validateOn?: Array<'blur' | 'change'>;
  }>(),
  {
    required: false,
    rules: () => [],
    validateOn: () => [],
  }
);

const form = useUiFormContext();
if (!form) {
  throw new Error('UiFormItem must be used inside UiForm.');
}

const rootRef = ref<HTMLElement | null>(null);
const controlRef = ref<HTMLElement | null>(null);
const name = computed(() => props.name);
const help = computed(() => props.help);
const fieldState = createUiFormFieldState(form, name, help);

const setControlRef = (element: Element | ComponentPublicInstance | null) => {
  controlRef.value = element instanceof HTMLElement ? element : null;
};

const unregister = form.registerField({
  name: props.name,
  focus: () => {
    const focusTarget =
      controlRef.value?.querySelector<HTMLElement>(
        'input, textarea, select, button, [tabindex]:not([tabindex="-1"])'
      ) ?? controlRef.value;
    focusTarget?.focus();
  },
  getElement: () => rootRef.value,
  getRules: () => props.rules,
});

onMounted(() => {
  rootRef.value = rootRef.value ?? controlRef.value?.closest('.ui-form-item') ?? null;
});

onUnmounted(() => {
  unregister();
});

const controlProps = computed(() => ({
  ariaDescribedby: fieldState.describedBy.value,
  disabled: form.disabled.value,
  id: fieldState.inputId.value,
  invalid: fieldState.invalid.value,
}));

const onValueChange = (value: unknown) => {
  form.setFieldValue(props.name, value, {
    validate: props.validateOn.includes('change'),
  });
};

const onBlur = async () => {
  await form.markFieldBlurred(props.name, {
    validate: props.validateOn.includes('blur'),
  });
};

const fieldProps = computed(() => ({
  id: fieldState.inputId.value,
  ...(props.label ? { label: props.label } : {}),
  ...(props.help ? { hint: props.help } : {}),
  ...(fieldState.error.value ? { error: fieldState.error.value } : {}),
  ...(props.required ? { required: true } : {}),
}));
</script>

<template>
  <div ref="rootRef" class="ui-form-item" :data-invalid="fieldState.invalid.value || undefined">
    <UiField v-bind="fieldProps">
      <div :ref="setControlRef" class="ui-form-item__control">
        <slot
          :value="form.getFieldValue(props.name)"
          :set-value="onValueChange"
          :handle-blur="onBlur"
          :invalid="fieldState.invalid.value"
          :error="fieldState.error.value"
          :described-by="fieldState.describedBy.value"
          :control-props="controlProps"
          :dirty="fieldState.dirty.value"
          :touched="fieldState.touched.value"
          :validating="fieldState.validating.value"
        />
      </div>
    </UiField>
  </div>
</template>
