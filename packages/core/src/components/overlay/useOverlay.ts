import { computed, ref, useSlots, watch } from 'vue';

import {
  applyTransitionMotionVariables,
  clearTransitionMotionVariables,
  resolveTransitionMotionPreset,
  useId,
  useMotionPresence,
  useOverlaySurface,
  type MotionPresetName,
  type OverlayPortalTarget,
} from '@ww/primitives';

interface OverlayProps {
  open: boolean;
  title?: string | undefined;
  description?: string | undefined;
  ariaLabel?: string | undefined;
  closeOnOverlayClick?: boolean | undefined;
  portalTarget?: OverlayPortalTarget | undefined;
}

interface UseOverlayOptions {
  prefix: string;
  surfacePreset: MotionPresetName | (() => MotionPresetName);
  backdropPreset?: MotionPresetName | (() => MotionPresetName);
}

function parseTimeMs(rawValue: string): number {
  const value = rawValue.trim();
  if (!value) {
    return 0;
  }

  if (value.endsWith('ms')) {
    return Number.parseFloat(value) || 0;
  }

  if (value.endsWith('s')) {
    return (Number.parseFloat(value) || 0) * 1000;
  }

  return Number.parseFloat(value) || 0;
}

function resolvePresetName(preset: MotionPresetName | (() => MotionPresetName)) {
  return typeof preset === 'function' ? preset() : preset;
}

export function useOverlay(props: OverlayProps, close: () => void, options: UseOverlayOptions) {
  const slots = useSlots();
  const anchorRef = ref<HTMLElement | null>(null);
  const panelRef = ref<HTMLElement | null>(null);
  const titleId = useId(`${options.prefix}-title`);
  const descriptionId = useId(`${options.prefix}-description`);
  const hasTitle = computed(
    () => Boolean(props.title) || Boolean(slots.title) || Boolean(slots.header)
  );
  const labelledBy = computed(() => (hasTitle.value ? titleId.value : undefined));
  const describedBy = computed(() => (props.description ? descriptionId.value : undefined));

  const presence = useMotionPresence(() => props.open);
  let focusRestoreRequested = false;
  let leaveFallbackTimer: number | null = null;
  let leaveFallbackMs = 0;

  const overlaySurface = useOverlaySurface({
    open: presence.isActive,
    kind: 'modal',
    contentRef: panelRef,
    sourceRef: anchorRef,
    portalTarget: computed(() => props.portalTarget),
    dismissOnEscape: true,
    dismissOnPointerOutside: props.closeOnOverlayClick ?? true,
    dismissOnFocusOutside: false,
    containFocus: true,
    lockScroll: true,
    onDismiss: close,
  });

  const requestFocusRestore = () => {
    if (focusRestoreRequested) {
      return;
    }

    focusRestoreRequested = true;
    overlaySurface.restoreFocus();
  };

  const clearLeaveFallback = () => {
    leaveFallbackMs = 0;
    if (leaveFallbackTimer !== null) {
      window.clearTimeout(leaveFallbackTimer);
      leaveFallbackTimer = null;
    }
  };

  watch(
    () => props.open,
    (isOpen) => {
      if (isOpen) {
        clearLeaveFallback();
        focusRestoreRequested = false;
        return;
      }

      void Promise.resolve().then(() => {
        if (!props.open && !presence.isLeaving.value) {
          requestFocusRestore();
        }
      });
    }
  );

  const readDurationMs = (
    element: HTMLElement | null,
    preset: MotionPresetName | (() => MotionPresetName)
  ) => {
    const resolvedPreset = resolveTransitionMotionPreset(resolvePresetName(preset), 'fade-in');
    const target = element ?? panelRef.value ?? document.documentElement;
    const raw =
      window.getComputedStyle(target).getPropertyValue(resolvedPreset.durationToken).trim() ||
      window
        .getComputedStyle(document.documentElement)
        .getPropertyValue(resolvedPreset.durationToken)
        .trim();

    return parseTimeMs(raw);
  };

  const scheduleLeaveFallback = (
    element: HTMLElement | null,
    preset: MotionPresetName | (() => MotionPresetName)
  ) => {
    const nextFallbackMs = Math.max(leaveFallbackMs, readDurationMs(element, preset));
    clearLeaveFallback();
    leaveFallbackMs = Math.max(nextFallbackMs, 0);
    leaveFallbackTimer = window.setTimeout(() => {
      leaveFallbackTimer = null;
      leaveFallbackMs = 0;
      presence.forceCompleteLeave();
      requestFocusRestore();
    }, leaveFallbackMs);
  };

  const applyMotionPreset = (
    element: Element,
    phase: 'enter' | 'leave',
    preset: MotionPresetName | (() => MotionPresetName)
  ) => {
    if (!(element instanceof HTMLElement)) {
      return;
    }

    applyTransitionMotionVariables(
      element,
      resolveTransitionMotionPreset(resolvePresetName(preset), 'fade-in'),
      phase
    );
  };

  const clearMotion = (element: Element) => {
    if (element instanceof HTMLElement) {
      clearTransitionMotionVariables(element);
    }
  };

  const finalizeLeave = () => {
    presence.handleAfterLeave();
    if (!presence.isLeaving.value) {
      clearLeaveFallback();
      requestFocusRestore();
    }
  };

  return {
    anchorRef,
    backdropStyle: overlaySurface.backdropStyle,
    contentStyle: overlaySurface.contentStyle,
    describedBy,
    handleBackdropAfterEnter: (element: Element) => {
      clearMotion(element);
      clearLeaveFallback();
      presence.handleAfterEnter();
    },
    handleBackdropAfterLeave: (element: Element) => {
      clearMotion(element);
      finalizeLeave();
    },
    handleBackdropBeforeEnter: (element: Element) => {
      clearLeaveFallback();
      presence.handleBeforeEnter();
      applyMotionPreset(element, 'enter', options.backdropPreset ?? 'backdrop-soften');
    },
    handleBackdropBeforeLeave: (element: Element) => {
      presence.handleBeforeLeave();
      applyMotionPreset(element, 'leave', options.backdropPreset ?? 'backdrop-soften');
      scheduleLeaveFallback(
        element instanceof HTMLElement ? element : null,
        options.backdropPreset ?? 'backdrop-soften'
      );
    },
    handleSurfaceAfterEnter: (element: Element) => {
      clearMotion(element);
      clearLeaveFallback();
      presence.handleAfterEnter();
    },
    handleSurfaceAfterLeave: (element: Element) => {
      clearMotion(element);
      finalizeLeave();
    },
    handleSurfaceBeforeEnter: (element: Element) => {
      clearLeaveFallback();
      presence.handleBeforeEnter();
      applyMotionPreset(element, 'enter', options.surfacePreset);
    },
    handleSurfaceBeforeLeave: (element: Element) => {
      presence.handleBeforeLeave();
      applyMotionPreset(element, 'leave', options.surfacePreset);
      scheduleLeaveFallback(element instanceof HTMLElement ? element : null, options.surfacePreset);
    },
    isActive: presence.isActive,
    labelledBy,
    panelRef,
    portalTarget: overlaySurface.portalTarget,
    titleId,
    descriptionId,
  };
}
