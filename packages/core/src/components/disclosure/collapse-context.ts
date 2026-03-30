/* istanbul ignore file */
import { computed, inject, provide, watch } from 'vue';
import type { ComputedRef } from 'vue';

import { useControllable, useRovingFocus } from '@ww/primitives';

export interface CollapseContext {
  accordion: ComputedRef<boolean>;
  bordered: ComputedRef<boolean>;
  ghost: ComputedRef<boolean>;
  iconPosition: ComputedRef<'start' | 'end'>;
  isOpen: (value: string) => boolean;
  onHeaderKeydown: (event: KeyboardEvent) => Promise<void>;
  registerPanel: (
    value: string,
    element: () => HTMLElement | null,
    disabled: () => boolean
  ) => () => void;
  setCurrentHeader: (value: string) => void;
  toggle: (value: string) => void;
  currentHeader: ComputedRef<string | null>;
}

const collapseContextKey = Symbol('UiCollapseContext');

function normalizeValues(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  return value ? [value] : [];
}

export function createCollapseContext(
  props: {
    modelValue?: string | string[] | undefined;
    defaultValue?: string | string[] | undefined;
    accordion?: boolean | undefined;
    bordered?: boolean | undefined;
    ghost?: boolean | undefined;
    iconPosition?: 'start' | 'end' | undefined;
  },
  emit: (event: 'update:modelValue', value: string | string[]) => void
) {
  const roving = useRovingFocus({
    loop: true,
    orientation: 'vertical',
  });
  const value = useControllable({
    defaultValue: normalizeValues(props.defaultValue),
    onChange: (nextValue) => {
      emit('update:modelValue', props.accordion ? (nextValue[0] ?? '') : nextValue);
    },
    value: computed(() => normalizeValues(props.modelValue)),
  });

  const isOpen = (panelValue: string) => value.currentValue.value.includes(panelValue);

  const toggle = (panelValue: string) => {
    if (props.accordion) {
      value.setValue(isOpen(panelValue) ? [] : [panelValue]);
      roving.setCurrentId(panelValue);
      return;
    }

    value.setValue(
      isOpen(panelValue)
        ? value.currentValue.value.filter((entry) => entry !== panelValue)
        : [...value.currentValue.value, panelValue]
    );
    roving.setCurrentId(panelValue);
  };

  const registerPanel = (
    panelValue: string,
    element: () => HTMLElement | null,
    disabled: () => boolean
  ) => {
    const unregister = roving.registerItem({
      id: panelValue,
      element,
      disabled,
    });

    if (!roving.currentId.value && !disabled()) {
      /* istanbul ignore next -- upstream registration order can preseed the roving item before the first enabled panel arrives. */
      roving.setCurrentId(panelValue);
    }

    return unregister;
  };

  watch(
    () => value.currentValue.value,
    (nextValue) => {
      if (nextValue[0]) {
        roving.setCurrentId(nextValue[0]);
      }
    },
    { immediate: true }
  );

  const context: CollapseContext = {
    accordion: computed(() => Boolean(props.accordion)),
    bordered: computed(() => props.bordered !== false),
    currentHeader: computed(() => roving.currentId.value),
    ghost: computed(() => Boolean(props.ghost)),
    iconPosition: computed(() => props.iconPosition ?? 'start'),
    isOpen,
    onHeaderKeydown: async (event) => {
      await roving.onKeydown(event);
    },
    registerPanel,
    setCurrentHeader: (nextValue) => roving.setCurrentId(nextValue),
    toggle,
  };

  provide(collapseContextKey, context);
  return context;
}

export function useCollapseContext() {
  return inject<CollapseContext | null>(collapseContextKey, null);
}
