import { computed, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue';

import {
  applyTransitionMotionVariables,
  clearTransitionMotionVariables,
  resolveTransitionMotionPreset,
  useFloatingPosition,
  useMotionPresence,
  useOverlaySurface,
  type FloatingPlacement,
  type MotionPresetName,
  type OverlayDismissReason,
  type OverlayLayerKind,
  type OverlayPortalTarget,
} from '@ww/primitives';

interface FloatingSurfaceProps {
  open: MaybeRefOrGetter<boolean>;
  placement?: MaybeRefOrGetter<FloatingPlacement | undefined>;
  offset?: MaybeRefOrGetter<number | undefined>;
  arrow?: MaybeRefOrGetter<boolean | undefined>;
  portalTarget?: MaybeRefOrGetter<OverlayPortalTarget | undefined>;
}

interface UseFloatingSurfaceOptions {
  kind: OverlayLayerKind;
  motionPreset: MotionPresetName | (() => MotionPresetName);
  close: (reason?: OverlayDismissReason | 'programmatic') => void;
  triggerRef: Ref<HTMLElement | null>;
  surfaceRef: Ref<HTMLElement | null>;
  dismissOnEscape?: boolean;
  dismissOnPointerOutside?: boolean;
  dismissOnFocusOutside?: boolean;
  autoFocus?: MaybeRefOrGetter<boolean | undefined>;
  restoreFocus?: MaybeRefOrGetter<boolean | undefined>;
  getBoundaryElements?: () => Array<HTMLElement | null | undefined>;
  initialFocus?: () => HTMLElement | null;
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

export function useFloatingSurface(
  props: FloatingSurfaceProps,
  options: UseFloatingSurfaceOptions
) {
  const presence = useMotionPresence(() => Boolean(toValue(props.open)));
  const isOpen = computed(() => Boolean(toValue(props.open)));
  const floating = useFloatingPosition({
    open: presence.isActive,
    anchorRef: options.triggerRef,
    contentRef: options.surfaceRef,
    placement: computed(() => toValue(props.placement) ?? 'bottom'),
    offset: computed(() => toValue(props.offset) ?? 8),
    viewportPadding: 12,
    arrowSize: computed(() => (toValue(props.arrow) ? 12 : 0)),
  });

  let focusRestoreRequested = false;
  let leaveFallbackTimer: number | null = null;
  let leaveFallbackMs = 0;

  const overlaySurface = useOverlaySurface({
    open: presence.isActive,
    kind: options.kind,
    contentRef: options.surfaceRef,
    sourceRef: options.triggerRef,
    ...(props.portalTarget ? { portalTarget: computed(() => toValue(props.portalTarget)) } : {}),
    ...(options.dismissOnEscape !== undefined ? { dismissOnEscape: options.dismissOnEscape } : {}),
    ...(options.dismissOnPointerOutside !== undefined
      ? { dismissOnPointerOutside: options.dismissOnPointerOutside }
      : {}),
    ...(options.dismissOnFocusOutside !== undefined
      ? { dismissOnFocusOutside: options.dismissOnFocusOutside }
      : {}),
    containFocus: false,
    lockScroll: false,
    ...(options.autoFocus !== undefined ? { autoFocus: options.autoFocus } : {}),
    ...(options.initialFocus ? { initialFocus: options.initialFocus } : {}),
    ...(options.getBoundaryElements ? { getBoundaryElements: options.getBoundaryElements } : {}),
    onDismiss: (reason) => options.close(reason),
  });

  const requestFocusRestore = () => {
    if (toValue(options.restoreFocus) === false || focusRestoreRequested) {
      return;
    }

    focusRestoreRequested = true;
    const triggerElement = options.triggerRef.value;
    if (triggerElement?.isConnected) {
      triggerElement.focus();
      if (document.activeElement === triggerElement) {
        return;
      }
    }

    overlaySurface.restoreFocus();
  };

  const clearLeaveFallback = () => {
    leaveFallbackMs = 0;
    if (leaveFallbackTimer !== null) {
      window.clearTimeout(leaveFallbackTimer);
      leaveFallbackTimer = null;
    }
  };

  watch(isOpen, (isSurfaceOpen) => {
    if (isSurfaceOpen) {
      clearLeaveFallback();
      focusRestoreRequested = false;
      return;
    }

    void Promise.resolve().then(() => {
      if (!isOpen.value) {
        requestFocusRestore();
      }
    });
  });

  const readDurationMs = (
    element: HTMLElement | null,
    preset: MotionPresetName | (() => MotionPresetName)
  ) => {
    const resolvedPreset = resolveTransitionMotionPreset(resolvePresetName(preset), 'fade-in');
    const target = element ?? options.surfaceRef.value ?? document.documentElement;
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
    arrowStyle: floating.arrowStyle,
    handleSurfaceAfterEnter: (element: Element) => {
      clearMotion(element);
      clearLeaveFallback();
      presence.handleAfterEnter();
      void floating.updatePosition();
    },
    handleSurfaceAfterLeave: (element: Element) => {
      clearMotion(element);
      finalizeLeave();
    },
    handleSurfaceBeforeEnter: (element: Element) => {
      clearLeaveFallback();
      presence.handleBeforeEnter();
      applyMotionPreset(element, 'enter', options.motionPreset);
    },
    handleSurfaceBeforeLeave: (element: Element) => {
      presence.handleBeforeLeave();
      applyMotionPreset(element, 'leave', options.motionPreset);
      scheduleLeaveFallback(element instanceof HTMLElement ? element : null, options.motionPreset);
    },
    isActive: presence.isActive,
    placement: floating.placement,
    portalTarget: overlaySurface.portalTarget,
    surfaceStyle: computed(() => ({
      ...(overlaySurface.contentStyle.value ?? {}),
      ...floating.floatingStyle.value,
    })),
    triggerHeight: floating.anchorHeight,
    triggerWidth: floating.anchorWidth,
    updatePosition: floating.updatePosition,
  };
}
