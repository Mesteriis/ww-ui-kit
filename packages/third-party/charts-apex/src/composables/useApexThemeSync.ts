import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';

import { THEME_ATTRIBUTE, THEME_TYPE_ATTRIBUTE } from '@ww/themes';

import {
  resolveApexThemeScope,
  type ResolvedApexThemeScope,
} from '../internal/detect-nearest-themed-container';

export interface ApexThemeScopeState extends ResolvedApexThemeScope {
  revision: number;
}

export function useApexThemeSync(hostRef: Ref<HTMLElement | null>) {
  const themeScope = ref<ApexThemeScopeState>({
    ...resolveApexThemeScope(),
    revision: 0,
  });

  let observer: MutationObserver | null = null;
  let isScheduled = false;
  let isDisposed = false;

  const disconnectObserver = () => {
    observer?.disconnect();
    observer = null;
  };

  const refreshThemeScope = () => {
    if (isDisposed) {
      return;
    }

    const nextScope = resolveApexThemeScope(hostRef.value);
    const previousScope = themeScope.value;
    const didChange =
      previousScope.container !== nextScope.container ||
      previousScope.themeName !== nextScope.themeName ||
      previousScope.themeType !== nextScope.themeType;

    themeScope.value = {
      ...nextScope,
      revision: didChange ? previousScope.revision + 1 : previousScope.revision,
    };

    disconnectObserver();

    if (typeof MutationObserver === 'undefined' || typeof document === 'undefined') {
      return;
    }

    observer = new MutationObserver(() => {
      scheduleRefresh();
    });

    const targets = new Set<HTMLElement>();
    targets.add(document.documentElement);

    if (themeScope.value.container && themeScope.value.container !== document.documentElement) {
      targets.add(themeScope.value.container);
    }

    for (const target of targets) {
      observer.observe(target, {
        attributes: true,
        attributeFilter: [THEME_ATTRIBUTE, THEME_TYPE_ATTRIBUTE, 'style'],
      });
    }
  };

  const scheduleRefresh = () => {
    if (isScheduled) {
      return;
    }

    isScheduled = true;
    const flush = () => {
      isScheduled = false;
      refreshThemeScope();
    };

    if (typeof queueMicrotask === 'function') {
      queueMicrotask(flush);
      return;
    }

    void Promise.resolve().then(flush);
  };

  onMounted(() => {
    refreshThemeScope();
  });

  watch(
    hostRef,
    () => {
      scheduleRefresh();
    },
    { flush: 'post' }
  );

  onBeforeUnmount(() => {
    isDisposed = true;
    disconnectObserver();
  });

  return {
    refreshThemeScope,
    themeScope,
  };
}
