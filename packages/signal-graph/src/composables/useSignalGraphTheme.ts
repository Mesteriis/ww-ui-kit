import { onBeforeUnmount, ref, watch, type Ref } from 'vue';

import { observeThemeRuntime, readThemeRuntime } from '@ww/themes';

import type { SignalGraphThemeState } from '../types';

function resolveThemeState(source?: HTMLElement | null): SignalGraphThemeState {
  const runtimeState = readThemeRuntime(source);

  return {
    container: runtimeState.container,
    themeName: runtimeState.themeName,
    themeType: runtimeState.themeType,
    revision: 0,
  };
}

export function useSignalGraphTheme(hostRef: Ref<HTMLElement | null>) {
  const themeState = ref<SignalGraphThemeState>(resolveThemeState());
  let stopObserving: (() => void) | null = null;

  const disconnectObserver = () => {
    stopObserving?.();
    stopObserving = null;
  };

  const refreshThemeState = () => {
    const nextState = resolveThemeState(hostRef.value);
    const previousState = themeState.value;
    const didChange =
      previousState.container !== nextState.container ||
      previousState.themeName !== nextState.themeName ||
      previousState.themeType !== nextState.themeType;

    themeState.value = {
      ...nextState,
      revision: didChange ? previousState.revision + 1 : previousState.revision,
    };
  };

  const reconnectObserver = () => {
    disconnectObserver();
    stopObserving = observeThemeRuntime(hostRef.value, (nextRuntimeState) => {
      const previousState = themeState.value;
      const didChange =
        previousState.container !== nextRuntimeState.container ||
        previousState.themeName !== nextRuntimeState.themeName ||
        previousState.themeType !== nextRuntimeState.themeType;

      themeState.value = {
        container: nextRuntimeState.container,
        revision: didChange ? previousState.revision + 1 : previousState.revision,
        themeName: nextRuntimeState.themeName,
        themeType: nextRuntimeState.themeType,
      };
    });
  };

  watch(
    hostRef,
    () => {
      refreshThemeState();
      reconnectObserver();
    },
    { flush: 'post' }
  );

  onBeforeUnmount(() => {
    disconnectObserver();
  });

  return {
    refreshThemeState,
    themeState,
  };
}
