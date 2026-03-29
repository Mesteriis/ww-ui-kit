import { computed, inject, provide } from 'vue';
import type { ComputedRef } from 'vue';

export interface FieldContext {
  inputId: ComputedRef<string>;
  describedBy: ComputedRef<string | undefined>;
  invalid: ComputedRef<boolean>;
}

const fieldContextKey = Symbol('UiFieldContext');

export function provideFieldContext(context: FieldContext) {
  provide(fieldContextKey, context);
}

export function useFieldContext() {
  return inject<FieldContext | null>(fieldContextKey, null);
}

export function mergeDescribedBy(...values: Array<string | undefined>) {
  const describedBy = values.filter(Boolean).join(' ');
  return describedBy.length > 0 ? describedBy : undefined;
}

export function createFieldState(
  props: { id?: string | undefined; hint?: string | undefined; error?: string | undefined },
  fallbackId: string
) {
  const inputId = computed(() => props.id ?? fallbackId);
  const hintId = computed(() => (props.hint ? `${inputId.value}-hint` : undefined));
  const errorId = computed(() => (props.error ? `${inputId.value}-error` : undefined));
  const invalid = computed(() => Boolean(props.error));
  const describedBy = computed(() => mergeDescribedBy(hintId.value, errorId.value));

  return {
    describedBy,
    errorId,
    hintId,
    inputId,
    invalid,
  };
}
