import { nextTick, ref, toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';

export interface RovingFocusItem {
  id: string;
  element: () => HTMLElement | null;
  disabled?: () => boolean;
}

export interface UseRovingFocusOptions {
  orientation?: MaybeRefOrGetter<'horizontal' | 'vertical'>;
  loop?: boolean;
}

const moveIndex = (currentIndex: number, delta: number, length: number, loop: boolean) => {
  const nextIndex = currentIndex + delta;
  if (nextIndex < 0) {
    return loop ? length - 1 : 0;
  }

  if (nextIndex >= length) {
    return loop ? 0 : length - 1;
  }

  return nextIndex;
};

export function useRovingFocus(options: UseRovingFocusOptions = {}) {
  const items = ref<RovingFocusItem[]>([]);
  const currentId = ref<string | null>(null);

  const getEnabledItems = () => items.value.filter((item) => !(item.disabled?.() ?? false));

  const focusItem = async (id: string) => {
    await nextTick();
    items.value
      .find((item) => item.id === id)
      ?.element()
      ?.focus();
  };

  const setCurrentId = (id: string) => {
    currentId.value = id;
  };

  const registerItem = (item: RovingFocusItem) => {
    items.value = [...items.value.filter((entry) => entry.id !== item.id), item];

    if (!currentId.value && !(item.disabled?.() ?? false)) {
      currentId.value = item.id;
    }

    return () => {
      items.value = items.value.filter((entry) => entry.id !== item.id);

      if (currentId.value === item.id) {
        currentId.value = getEnabledItems()[0]?.id ?? null;
      }
    };
  };

  const move = async (direction: 'next' | 'prev' | 'first' | 'last') => {
    const enabledItems = getEnabledItems();
    const [firstEnabledItem] = enabledItems;
    if (!firstEnabledItem) {
      return null;
    }

    let targetItem: RovingFocusItem = firstEnabledItem;

    if (direction === 'last') {
      targetItem = enabledItems[enabledItems.length - 1] as RovingFocusItem;
    } else if (direction !== 'first') {
      const targetIndex = moveIndex(
        Math.max(
          enabledItems.findIndex((item) => item.id === currentId.value),
          0
        ),
        direction === 'next' ? 1 : -1,
        enabledItems.length,
        options.loop ?? true
      );
      targetItem = enabledItems[targetIndex] as RovingFocusItem;
    }

    currentId.value = targetItem.id;
    await focusItem(targetItem.id);
    return targetItem.id;
  };

  const onKeydown = async (event: KeyboardEvent) => {
    const orientation = toValue(options.orientation) ?? 'horizontal';
    const isHorizontal = orientation === 'horizontal';

    if (
      (event.key === 'ArrowRight' && isHorizontal) ||
      (event.key === 'ArrowDown' && !isHorizontal)
    ) {
      event.preventDefault();
      await move('next');
      return true;
    }

    if ((event.key === 'ArrowLeft' && isHorizontal) || (event.key === 'ArrowUp' && !isHorizontal)) {
      event.preventDefault();
      await move('prev');
      return true;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      await move('first');
      return true;
    }

    if (event.key === 'End') {
      event.preventDefault();
      await move('last');
      return true;
    }

    return false;
  };

  return {
    currentId,
    items,
    move,
    onKeydown,
    registerItem,
    setCurrentId,
  };
}
