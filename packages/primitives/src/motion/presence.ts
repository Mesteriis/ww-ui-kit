import {
  computed,
  ref,
  toValue,
  type MaybeRefOrGetter,
} from "vue";

export function useMotionPresence(open: MaybeRefOrGetter<boolean>) {
  const leavingTransitions = ref(0);
  const isLeaving = ref(false);
  const isActive = computed(() => Boolean(toValue(open)) || isLeaving.value);

  function handleBeforeEnter(): void {
    leavingTransitions.value = 0;
    isLeaving.value = false;
  }

  function handleAfterEnter(): void {
    leavingTransitions.value = 0;
    isLeaving.value = false;
  }

  function handleBeforeLeave(): void {
    leavingTransitions.value += 1;
    isLeaving.value = true;
  }

  function handleAfterLeave(): void {
    leavingTransitions.value = Math.max(0, leavingTransitions.value - 1);
    if (leavingTransitions.value === 0) {
      isLeaving.value = false;
    }
  }

  return {
    handleAfterEnter,
    handleAfterLeave,
    handleBeforeEnter,
    handleBeforeLeave,
    isActive,
    isLeaving,
  };
}
