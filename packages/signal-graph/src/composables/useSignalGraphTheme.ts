import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';

import { findNearestThemeContainer } from '@ww/primitives';
import { THEME_ATTRIBUTE, THEME_TYPE_ATTRIBUTE, getThemeType, type ThemeName, type ThemeType } from '@ww/themes';

import type { SignalGraphThemeState } from '../types';

function isThemeName(value: string | null): value is ThemeName {
  return Boolean(value && value.length > 0);
}

function isThemeType(value: string | null): value is ThemeType {
  return value === 'light' || value === 'dark';
}

function resolveThemeState(source?: HTMLElement | null): SignalGraphThemeState {
  const container = findNearestThemeContainer(source);
  const rawThemeName = container?.getAttribute(THEME_ATTRIBUTE) ?? null;
  const themeName = isThemeName(rawThemeName) ? rawThemeName : 'light';
  const rawThemeType = container?.getAttribute(THEME_TYPE_ATTRIBUTE) ?? null;
  const themeType = isThemeType(rawThemeType) ? rawThemeType : getThemeType(themeName);

  return {
    container,
    themeName,
    themeType,
    revision: 0,
  };
}

export function useSignalGraphTheme(hostRef: Ref<HTMLElement | null>) {
  const themeState = ref<SignalGraphThemeState>(resolveThemeState());
  let observer: MutationObserver | null = null;
  let refreshScheduled = false;

  const disconnectObserver = () => {
    observer?.disconnect();
    observer = null;
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

    disconnectObserver();

    if (typeof MutationObserver === 'undefined' || typeof document === 'undefined') {
      return;
    }

    observer = new MutationObserver(() => {
      if (refreshScheduled) {
        return;
      }

      refreshScheduled = true;
      const flush = () => {
        refreshScheduled = false;
        refreshThemeState();
      };

      if (typeof queueMicrotask === 'function') {
        queueMicrotask(flush);
        return;
      }

      void Promise.resolve().then(flush);
    });

    const targets = new Set<HTMLElement>();
    targets.add(document.documentElement);

    if (themeState.value.container && themeState.value.container !== document.documentElement) {
      targets.add(themeState.value.container);
    }

    for (const target of targets) {
      observer.observe(target, {
        attributes: true,
        attributeFilter: [THEME_ATTRIBUTE, THEME_TYPE_ATTRIBUTE, 'style'],
      });
    }
  };

  watch(hostRef, refreshThemeState, { flush: 'post' });

  onMounted(() => {
    refreshThemeState();
  });

  onBeforeUnmount(() => {
    disconnectObserver();
  });

  return {
    refreshThemeState,
    themeState,
  };
}
