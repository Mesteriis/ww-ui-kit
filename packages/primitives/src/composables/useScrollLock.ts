import { watchEffect } from 'vue';
import type { MaybeRefOrGetter } from 'vue';
import { toValue } from 'vue';

let lockCount = 0;
let previousOverflow = '';
let previousPaddingRight = '';

const lockDocument = () => {
  if (typeof document === 'undefined') {
    return;
  }

  const { body, documentElement } = document;
  if (lockCount === 0) {
    previousOverflow = body.style.overflow;
    previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    body.style.overflow = 'hidden';

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  lockCount += 1;
};

const unlockDocument = () => {
  if (typeof document === 'undefined' || lockCount === 0) {
    return;
  }

  lockCount -= 1;
  if (lockCount === 0) {
    document.body.style.overflow = previousOverflow;
    document.body.style.paddingRight = previousPaddingRight;
  }
};

export function useScrollLock(active: MaybeRefOrGetter<boolean>) {
  watchEffect((onCleanup) => {
    if (!toValue(active)) {
      return;
    }

    lockDocument();
    onCleanup(unlockDocument);
  });
}
