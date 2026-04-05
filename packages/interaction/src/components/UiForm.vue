<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { useControllable, useId } from '@ww/primitives';

import {
  createFormMetaStore,
  provideUiFormContext,
  type UiFormRule,
  type UiFormValue,
} from '../internal/formContext';
import { cloneRecord, deleteValueAtPath, getValueAtPath, setValueAtPath } from '../internal/modelPath';

defineOptions({ name: 'UiForm' });

const props = withDefaults(
  defineProps<{
    modelValue?: UiFormValue;
    initialValues?: UiFormValue;
    rules?: Record<string, UiFormRule[]>;
    disabled?: boolean;
    labelWidth?: string;
    validateOn?: Array<'blur' | 'change' | 'submit'>;
    scrollBehavior?: ScrollBehavior;
  }>(),
  {
    disabled: false,
    initialValues: () => ({}),
    rules: () => ({}),
    scrollBehavior: 'smooth',
    validateOn: () => ['blur', 'submit'],
  }
);

const emit = defineEmits<{
  (event: 'update:modelValue', value: UiFormValue): void;
  (
    event: 'invalid',
    payload: { errors: Record<string, string | undefined>; values: UiFormValue }
  ): void;
  (event: 'submit', payload: { values: UiFormValue }): void;
  (
    event: 'validate',
    payload: { errors: Record<string, string | undefined>; valid: boolean }
  ): void;
}>();

const formRef = ref<HTMLFormElement | null>(null);
const formId = useId('interaction-form');
const fields = new Map<
  string,
  {
    focus: () => void;
    getElement: () => HTMLElement | null;
    getRules: () => UiFormRule[];
  }
>();
const initialSnapshot = ref(cloneRecord(props.initialValues));
const meta = createFormMetaStore();
type FormBooleanMetaRef = typeof meta.dirty;

const valueState = useControllable<UiFormValue>({
  defaultValue: cloneRecord(props.initialValues),
  onChange: (value) => emit('update:modelValue', value),
  value: computed(() => props.modelValue),
});

watch(
  () => props.initialValues,
  (nextValues) => {
    initialSnapshot.value = cloneRecord(nextValues);
    if (props.modelValue === undefined) {
      valueState.setValue(cloneRecord(nextValues));
    }
  },
  { deep: true }
);

const setMetaFlag = (target: FormBooleanMetaRef, name: string, value: boolean) => {
  target.value = {
    ...target.value,
    [name]: value,
  };
};

const setError = (name: string, value: string | undefined) => {
  meta.errors.value = {
    ...meta.errors.value,
    [name]: value,
  };
};

const getRules = (name: string) => [
  ...(props.rules[name] ?? []),
  ...(fields.get(name)?.getRules() ?? []),
];

const getValues = () => cloneRecord(valueState.currentValue.value);

const validateField = async (name: string) => {
  const value = getValueAtPath(valueState.currentValue.value, name);
  const rules = getRules(name);

  if (rules.length === 0) {
    setError(name, undefined);
    return true;
  }

  setMetaFlag(meta.validating, name, true);

  try {
    for (const rule of rules) {
      const result = await rule(value, {
        fieldName: name,
        values: valueState.currentValue.value,
      });

      if (typeof result === 'string' && result.trim()) {
        setError(name, result);
        return false;
      }
    }

    setError(name, undefined);
    return true;
  } finally {
    setMetaFlag(meta.validating, name, false);
  }
};

const validate = async () => {
  const names = [...new Set([...Object.keys(props.rules), ...fields.keys()])];
  const results = await Promise.all(names.map((name) => validateField(name)));
  const valid = results.every(Boolean);
  const errors = { ...meta.errors.value };

  emit('validate', {
    errors,
    valid,
  });

  if (!valid) {
    emit('invalid', {
      errors,
      values: getValues(),
    });
  }

  return valid;
};

const setFieldValue = (name: string, value: unknown, options?: { validate?: boolean }) => {
  const nextValues = setValueAtPath(valueState.currentValue.value, name, value);
  valueState.setValue(nextValues);
  setMetaFlag(meta.dirty, name, true);

  if (options?.validate ?? props.validateOn.includes('change')) {
    void validateField(name);
  }
};

const markFieldBlurred = async (name: string, options?: { validate?: boolean }) => {
  setMetaFlag(meta.touched, name, true);

  if (options?.validate ?? props.validateOn.includes('blur')) {
    await validateField(name);
  }
};

const scrollToField = (name: string) => {
  const element = fields.get(name)?.getElement();
  if (element && typeof element.scrollIntoView === 'function') {
    element.scrollIntoView({
      behavior: props.scrollBehavior,
      block: 'center',
      inline: 'nearest',
    });
  }
};

const focusField = (name: string) => {
  fields.get(name)?.focus();
};

const resetField = (name: string) => {
  const nextValue = getValueAtPath(initialSnapshot.value, name);
  valueState.setValue(
    nextValue === undefined
      ? deleteValueAtPath(valueState.currentValue.value, name)
      : setValueAtPath(valueState.currentValue.value, name, nextValue)
  );
  setMetaFlag(meta.dirty, name, false);
  setMetaFlag(meta.touched, name, false);
  setMetaFlag(meta.validating, name, false);
  setError(name, undefined);
};

const reset = () => {
  valueState.setValue(cloneRecord(initialSnapshot.value));
  meta.dirty.value = {};
  meta.touched.value = {};
  meta.validating.value = {};
  meta.errors.value = {};
};

const registerField = (field: {
  name: string;
  focus: () => void;
  getElement: () => HTMLElement | null;
  getRules: () => UiFormRule[];
}) => {
  fields.set(field.name, field);

  return () => {
    fields.delete(field.name);
  };
};

provideUiFormContext({
  disabled: computed(() => props.disabled),
  formId: computed(() => formId.value),
  getDirty: (name) => Boolean(meta.dirty.value[name]),
  getError: (name) => meta.errors.value[name],
  getFieldValue: (name) => getValueAtPath(valueState.currentValue.value, name),
  getRules,
  getTouched: (name) => Boolean(meta.touched.value[name]),
  getValidating: (name) => Boolean(meta.validating.value[name]),
  labelWidth: computed(() => props.labelWidth),
  markFieldBlurred,
  registerField,
  setFieldValue,
  validateField,
});

const onSubmit = async (event: Event) => {
  event.preventDefault();
  const valid = props.validateOn.includes('submit') ? await validate() : true;

  if (!valid) {
    const firstInvalidName = Object.entries(meta.errors.value).find(([, value]) => Boolean(value))?.[0];
    if (firstInvalidName) {
      scrollToField(firstInvalidName);
      focusField(firstInvalidName);
    }
    return;
  }

  emit('submit', {
    values: getValues(),
  });
};

defineExpose({
  focusField,
  reset,
  resetField,
  scrollToField,
  validate,
  validateField,
});
</script>

<template>
  <form
    ref="formRef"
    class="ui-form"
    :style="props.labelWidth ? { '--ui-form-label-width': props.labelWidth } : undefined"
    @submit="onSubmit"
  >
    <slot :values="valueState.currentValue.value" :errors="meta.errors.value"></slot>
  </form>
</template>
