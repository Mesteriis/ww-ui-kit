import { onBeforeUnmount, ref, watch, type Ref } from 'vue';

import { observeThemeRuntime } from '@ww/themes';

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

  let stopObserving: (() => void) | null = null;

  const disconnectObserver = () => {
    stopObserving?.();
    stopObserving = null;
  };

  const refreshThemeScope = () => {
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
  };

  const reconnectObserver = () => {
    disconnectObserver();
    stopObserving = observeThemeRuntime(hostRef.value, () => {
      refreshThemeScope();
    });
  };

  watch(
    hostRef,
    () => {
      refreshThemeScope();
      reconnectObserver();
    },
    { flush: 'post' }
  );

  onBeforeUnmount(() => {
    disconnectObserver();
  });

  return {
    refreshThemeScope,
    themeScope,
  };
}
