import { nextTick, onBeforeUnmount, onMounted, onUpdated, ref, watch, type Ref } from 'vue';

const FOCUSABLE_TRIGGER_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  "input:not([disabled]):not([type='hidden'])",
  'select:not([disabled])',
  'textarea:not([disabled])',
  "[tabindex]:not([tabindex='-1'])",
  '[contenteditable="true"]',
  '[contenteditable=""]',
].join(', ');

export type DelayConfig = {
  show: number;
  hide: number;
};

export function normalizeDelayConfig(
  delay: number | Partial<DelayConfig> | undefined,
  fallback: DelayConfig
): DelayConfig {
  if (typeof delay === 'number') {
    return {
      hide: Math.max(0, delay),
      show: Math.max(0, delay),
    };
  }

  return {
    hide: Math.max(0, delay?.hide ?? fallback.hide),
    show: Math.max(0, delay?.show ?? fallback.show),
  };
}

export function resolveTriggerElement(wrapper: HTMLElement | null): HTMLElement | null {
  if (!wrapper) {
    return null;
  }

  if (wrapper.matches(FOCUSABLE_TRIGGER_SELECTOR)) {
    return wrapper;
  }

  return wrapper.querySelector<HTMLElement>(FOCUSABLE_TRIGGER_SELECTOR) ?? wrapper;
}

export function useTriggerElement() {
  const wrapperRef = ref<HTMLElement | null>(null);
  const triggerRef = ref<HTMLElement | null>(null);
  let observer: MutationObserver | null = null;

  const syncTriggerElement = async () => {
    await nextTick();
    triggerRef.value = resolveTriggerElement(wrapperRef.value);
  };

  watch(wrapperRef, () => {
    void syncTriggerElement();
  });

  onMounted(() => {
    void syncTriggerElement();

    observer = new MutationObserver(() => {
      void syncTriggerElement();
    });

    if (wrapperRef.value) {
      observer.observe(wrapperRef.value, {
        childList: true,
        subtree: true,
      });
    }
  });

  watch(wrapperRef, (nextWrapper, previousWrapper) => {
    if (previousWrapper && observer) {
      observer.disconnect();
    }

    if (nextWrapper && observer) {
      observer.observe(nextWrapper, {
        childList: true,
        subtree: true,
      });
    }
  });

  onUpdated(() => {
    void syncTriggerElement();
  });

  return {
    syncTriggerElement,
    triggerRef,
    wrapperRef,
  };
}

export function useManagedTriggerAttributes(
  targetRef: Ref<HTMLElement | null>,
  resolveAttributes: () => Record<string, string | undefined>
) {
  let previousTarget: HTMLElement | null = null;
  let previousAttributeNames = new Set<string>();

  const applyAttributes = () => {
    const target = targetRef.value;
    const attributes = resolveAttributes();

    if (previousTarget && previousTarget !== target) {
      for (const attributeName of previousAttributeNames) {
        previousTarget.removeAttribute(attributeName);
      }
      previousAttributeNames.clear();
    }

    if (!target) {
      previousTarget = null;
      previousAttributeNames.clear();
      return;
    }

    const nextAttributeNames = new Set<string>();

    for (const [attributeName, attributeValue] of Object.entries(attributes)) {
      nextAttributeNames.add(attributeName);

      if (attributeValue === undefined) {
        target.removeAttribute(attributeName);
        continue;
      }

      target.setAttribute(attributeName, attributeValue);
    }

    for (const attributeName of previousAttributeNames) {
      if (!nextAttributeNames.has(attributeName)) {
        target.removeAttribute(attributeName);
      }
    }

    previousTarget = target;
    previousAttributeNames = nextAttributeNames;
  };

  watch(
    [targetRef, resolveAttributes],
    () => {
      applyAttributes();
    },
    {
      immediate: true,
      flush: 'post',
    }
  );

  onBeforeUnmount(() => {
    if (!previousTarget) {
      return;
    }

    for (const attributeName of previousAttributeNames) {
      previousTarget.removeAttribute(attributeName);
    }
  });

  return {
    applyAttributes,
  };
}
