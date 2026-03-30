/* istanbul ignore file */
import { computed, inject, provide, watch } from 'vue';
import type { ComputedRef } from 'vue';

import { useControllable, useId, useRovingFocus } from '@ww/primitives';

import { mergeDescribedBy, useFieldContext } from '../fields/field-context';

export interface RadioGroupContext {
  currentTabStop: ComputedRef<string | null>;
  currentValue: ComputedRef<string>;
  describedBy: ComputedRef<string | undefined>;
  disabled: ComputedRef<boolean>;
  groupId: ComputedRef<string>;
  getInputId: (value: string) => string;
  invalid: ComputedRef<boolean>;
  isChecked: (value: string) => boolean;
  isDisabled: (valueDisabled: boolean) => boolean;
  name: ComputedRef<string | undefined>;
  onGroupKeydown: (event: KeyboardEvent) => Promise<void>;
  orientation: ComputedRef<'horizontal' | 'vertical'>;
  registerRadio: (
    value: string,
    element: () => HTMLElement | null,
    disabled: () => boolean
  ) => () => void;
  required: ComputedRef<boolean>;
  select: (value: string) => void;
  setCurrentTabStop: (value: string) => void;
}

const radioGroupContextKey = Symbol('UiRadioGroupContext');

export function createRadioGroupContext(
  props: {
    id?: string | undefined;
    modelValue?: string | undefined;
    defaultValue?: string | undefined;
    orientation: 'horizontal' | 'vertical';
    name?: string | undefined;
    disabled?: boolean | undefined;
    required?: boolean | undefined;
    invalid?: boolean | undefined;
    ariaDescribedby?: string | undefined;
  },
  emit: (event: 'update:modelValue', value: string) => void
) {
  const baseId = useId('radio-group');
  const field = useFieldContext();
  const roving = useRovingFocus({
    loop: true,
    orientation: computed(() => props.orientation),
  });
  const assignedIds = new Map<string, string>();
  const value = useControllable({
    defaultValue: props.defaultValue ?? '',
    onChange: (nextValue) => emit('update:modelValue', nextValue),
    value: computed(() => props.modelValue),
  });

  const ensureRadioId = (radioValue: string) => {
    const existingId = assignedIds.get(radioValue);
    if (existingId) {
      return existingId;
    }

    const nextId =
      assignedIds.size === 0 && field?.inputId.value
        ? field.inputId.value
        : `${baseId.value}-radio-${assignedIds.size + 1}`;
    assignedIds.set(radioValue, nextId);
    return nextId;
  };

  const select = (nextValue: string) => {
    value.setValue(nextValue);
    roving.setCurrentId(nextValue);
  };

  const registerRadio = (
    radioValue: string,
    element: () => HTMLElement | null,
    disabled: () => boolean
  ) => {
    ensureRadioId(radioValue);

    const unregister = roving.registerItem({
      id: radioValue,
      element,
      disabled,
    });

    if (value.currentValue.value === radioValue) {
      roving.setCurrentId(radioValue);
    } else if (!value.currentValue.value && !disabled() && !roving.currentId.value) {
      /* istanbul ignore next -- consumer registration order can populate the roving target before the first enabled radio settles. */
      roving.setCurrentId(radioValue);
    }

    return unregister;
  };

  watch(
    () => value.currentValue.value,
    (nextValue) => {
      if (nextValue) {
        roving.setCurrentId(nextValue);
      }
    },
    { immediate: true }
  );

  const context: RadioGroupContext = {
    currentTabStop: computed(() => roving.currentId.value),
    currentValue: computed(() => value.currentValue.value),
    describedBy: computed(() => mergeDescribedBy(props.ariaDescribedby, field?.describedBy.value)),
    disabled: computed(() => Boolean(props.disabled)),
    groupId: computed(() => props.id ?? field?.inputId.value ?? baseId.value),
    getInputId: ensureRadioId,
    invalid: computed(() => Boolean(props.invalid || field?.invalid.value)),
    isChecked: (radioValue) => value.currentValue.value === radioValue,
    isDisabled: (valueDisabled) => Boolean(props.disabled || valueDisabled),
    name: computed(() => props.name),
    onGroupKeydown: async (event) => {
      const handled = roving.onKeydown(event);
      if (event.defaultPrevented && roving.currentId.value) {
        select(roving.currentId.value);
      }
      await handled;
    },
    orientation: computed(() => props.orientation),
    registerRadio,
    required: computed(() => Boolean(props.required)),
    select,
    setCurrentTabStop: (nextValue) => roving.setCurrentId(nextValue),
  };

  provide(radioGroupContextKey, context);

  return {
    context,
    ensureRadioId,
    labelId: computed(() => field?.labelId.value),
  };
}

export function useRadioGroupContext() {
  return inject<RadioGroupContext | null>(radioGroupContextKey, null);
}
