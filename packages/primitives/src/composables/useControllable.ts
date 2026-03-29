import { computed, ref, toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';

export interface UseControllableOptions<TValue> {
  value: MaybeRefOrGetter<TValue | undefined>;
  defaultValue: TValue;
  onChange?: (value: TValue) => void;
}

export function useControllable<TValue>(options: UseControllableOptions<TValue>) {
  const uncontrolledValue = ref<TValue>(options.defaultValue);
  const isControlled = computed(() => toValue<TValue | undefined>(options.value) !== undefined);
  const currentValue = computed<TValue>(() => {
    const resolvedValue = toValue<TValue | undefined>(options.value);
    // Vue generic helpers erase some inference here; the resolved value remains TValue.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return resolvedValue === undefined ? uncontrolledValue.value : resolvedValue;
  });

  const setValue = (nextValue: TValue) => {
    if (!isControlled.value) {
      uncontrolledValue.value = nextValue;
    }

    options.onChange?.(nextValue);
  };

  return {
    currentValue,
    isControlled,
    setValue
  };
}
