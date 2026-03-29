import { watchEffect } from 'vue';
import type { MaybeRefOrGetter } from 'vue';
import { toValue } from 'vue';

export function useEscapeKey(handler: (event: KeyboardEvent) => void, active: MaybeRefOrGetter<boolean> = true) {
  watchEffect((onCleanup) => {
    if (!toValue(active) || typeof document === 'undefined') {
      return;
    }

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handler(event);
      }
    };

    document.addEventListener('keydown', onKeydown);
    onCleanup(() => {
      document.removeEventListener('keydown', onKeydown);
    });
  });
}
