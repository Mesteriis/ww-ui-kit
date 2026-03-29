import { watchEffect } from 'vue';
import type { MaybeRefOrGetter, Ref } from 'vue';
import { toValue } from 'vue';

type MaybeElement = HTMLElement | null;
type MaybeElementRef = MaybeRefOrGetter<MaybeElement> | Ref<MaybeElement>;

export interface UseOutsideClickOptions {
  active?: MaybeRefOrGetter<boolean>;
  ignore?: readonly MaybeElementRef[];
}

const containsTarget = (container: MaybeElement, event: Event) => {
  if (!container) {
    return false;
  }

  if (typeof event.composedPath === 'function') {
    return event.composedPath().includes(container);
  }

  return event.target instanceof Node ? container.contains(event.target) : false;
};

export function useOutsideClick(
  target: MaybeElementRef,
  handler: (event: PointerEvent) => void,
  options: UseOutsideClickOptions = {}
) {
  watchEffect((onCleanup) => {
    if (typeof document === 'undefined' || options.active !== undefined && !toValue(options.active)) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      const element = toValue(target);
      if (!element || containsTarget(element, event)) {
        return;
      }

      const shouldIgnore = options.ignore?.some((ignoredTarget) => containsTarget(toValue(ignoredTarget), event)) ?? false;
      if (!shouldIgnore) {
        handler(event);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    onCleanup(() => {
      document.removeEventListener('pointerdown', onPointerDown);
    });
  });
}
