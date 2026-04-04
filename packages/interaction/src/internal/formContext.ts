import { computed, inject, provide, ref, type ComputedRef } from 'vue';

import { useId } from '@ww/primitives';

export type UiFormValue = Record<string, unknown>;
export type UiFormRuleResult = string | void | null | undefined;

export interface UiFormRuleContext {
  fieldName: string;
  values: Readonly<UiFormValue>;
}

export type UiFormRule = (
  value: unknown,
  context: UiFormRuleContext
) => UiFormRuleResult | Promise<UiFormRuleResult>;

export interface UiRegisteredField {
  name: string;
  focus: () => void;
  getElement: () => HTMLElement | null;
  getRules: () => UiFormRule[];
}

export interface UiFormFieldState {
  dirty: ComputedRef<boolean>;
  error: ComputedRef<string | undefined>;
  invalid: ComputedRef<boolean>;
  touched: ComputedRef<boolean>;
  validating: ComputedRef<boolean>;
}

export interface UiFormProvideValue {
  disabled: ComputedRef<boolean>;
  getError: (name: string) => string | undefined;
  getFieldValue: (name: string) => unknown;
  getRules: (name: string) => UiFormRule[];
  getTouched: (name: string) => boolean;
  getDirty: (name: string) => boolean;
  getValidating: (name: string) => boolean;
  registerField: (field: UiRegisteredField) => () => void;
  setFieldValue: (name: string, value: unknown, options?: { validate?: boolean }) => void;
  markFieldBlurred: (name: string, options?: { validate?: boolean }) => Promise<void>;
  validateField: (name: string) => Promise<boolean>;
  formId: ComputedRef<string>;
  labelWidth: ComputedRef<string | undefined>;
}

const formContextKey = Symbol('UiFormContext');

export function provideUiFormContext(value: UiFormProvideValue) {
  provide(formContextKey, value);
}

export function useUiFormContext() {
  return inject<UiFormProvideValue | null>(formContextKey, null);
}

export function createUiFormFieldState(
  form: UiFormProvideValue,
  name: ComputedRef<string>,
  help: ComputedRef<string | undefined>
) {
  const fallbackId = useId('form-item');
  const inputId = computed(() => `${form.formId.value}-${name.value || fallbackId.value}`);
  const helpId = computed(() => (help.value ? `${inputId.value}-help` : undefined));
  const errorId = computed(() =>
    form.getError(name.value) ? `${inputId.value}-error` : undefined
  );
  const dirty = computed(() => form.getDirty(name.value));
  const error = computed(() => form.getError(name.value));
  const invalid = computed(() => Boolean(error.value));
  const touched = computed(() => form.getTouched(name.value));
  const validating = computed(() => form.getValidating(name.value));
  const describedBy = computed(() =>
    [helpId.value, errorId.value].filter(Boolean).join(' ') || undefined
  );

  return {
    describedBy,
    dirty,
    error,
    errorId,
    helpId,
    inputId,
    invalid,
    touched,
    validating,
  };
}

export function createFormMetaStore() {
  const dirty = ref<Record<string, boolean>>({});
  const touched = ref<Record<string, boolean>>({});
  const validating = ref<Record<string, boolean>>({});
  const errors = ref<Record<string, string | undefined>>({});

  return {
    dirty,
    errors,
    touched,
    validating,
  };
}
