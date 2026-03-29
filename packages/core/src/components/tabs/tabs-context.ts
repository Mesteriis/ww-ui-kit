import { computed, inject, provide, watch } from 'vue';
import type { ComputedRef } from 'vue';

import { useControllable, useId, useRovingFocus } from '@ww/primitives';

export interface TabsContext {
  currentTabStop: ComputedRef<string | null>;
  currentValue: ComputedRef<string>;
  getPanelId: (value: string) => string;
  getTriggerId: (value: string) => string;
  onListKeydown: (event: KeyboardEvent) => Promise<void>;
  orientation: ComputedRef<'horizontal' | 'vertical'>;
  registerTrigger: (value: string, element: () => HTMLElement | null, disabled: () => boolean) => () => void;
  select: (value: string) => void;
  setCurrentTabStop: (value: string) => void;
}

const tabsContextKey = Symbol('UiTabsContext');

export function createTabsContext(
  props: {
    modelValue?: string | undefined;
    defaultValue?: string | undefined;
    orientation: 'horizontal' | 'vertical';
  },
  emit: (event: 'update:modelValue', value: string) => void
) {
  const baseId = useId('tabs');
  const roving = useRovingFocus({
    loop: true,
    orientation: computed(() => props.orientation)
  });
  const value = useControllable({
    defaultValue: props.defaultValue ?? '',
    onChange: (nextValue) => emit('update:modelValue', nextValue),
    value: computed(() => props.modelValue)
  });

  const select = (nextValue: string) => {
    value.setValue(nextValue);
    roving.setCurrentId(nextValue);
  };

  const registerTrigger = (nextValue: string, element: () => HTMLElement | null, disabled: () => boolean) => {
    const unregister = roving.registerItem({
      disabled,
      element,
      id: nextValue
    });

    if (!value.currentValue.value && !disabled()) {
      select(nextValue);
    }

    if (value.currentValue.value === nextValue) {
      roving.setCurrentId(nextValue);
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

  const context: TabsContext = {
    currentTabStop: computed(() => roving.currentId.value),
    currentValue: computed(() => value.currentValue.value),
    getPanelId: (nextValue) => `${baseId.value}-panel-${nextValue}`,
    getTriggerId: (nextValue) => `${baseId.value}-trigger-${nextValue}`,
    onListKeydown: async (event) => {
      const handled = await roving.onKeydown(event);

      if (handled && roving.currentId.value) {
        select(roving.currentId.value);
      }
    },
    orientation: computed(() => props.orientation),
    registerTrigger,
    select,
    setCurrentTabStop: (nextValue) => roving.setCurrentId(nextValue)
  };

  provide(tabsContextKey, context);
  return context;
}

export function useTabsContext() {
  return inject<TabsContext | null>(tabsContextKey, null);
}
