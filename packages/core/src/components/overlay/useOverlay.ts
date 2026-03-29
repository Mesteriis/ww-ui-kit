import { computed, nextTick, ref, useSlots, watch } from 'vue';

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

  watch(
    () => props.open,
    (isOpen) => {
      if (isOpen) {
        focusRestoreRequested = false;
        return;
      }

      void nextTick().then(requestFocusRestore);
    }
  );

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
      presence.handleAfterEnter();
    },
    handleBackdropAfterLeave: (element: Element) => {
      clearMotion(element);
      finalizeLeave();
    },
    handleBackdropBeforeEnter: (element: Element) => {
      presence.handleBeforeEnter();
      applyMotionPreset(element, 'enter', options.backdropPreset ?? 'backdrop-soften');
    },
    handleBackdropBeforeLeave: (element: Element) => {
      presence.handleBeforeLeave();
      applyMotionPreset(element, 'leave', options.backdropPreset ?? 'backdrop-soften');
    },
    handleSurfaceAfterEnter: (element: Element) => {
      clearMotion(element);
      presence.handleAfterEnter();
    },
    handleSurfaceAfterLeave: (element: Element) => {
      clearMotion(element);
      finalizeLeave();
    },
    handleSurfaceBeforeEnter: (element: Element) => {
      presence.handleBeforeEnter();
      applyMotionPreset(element, 'enter', options.surfacePreset);
    },
    handleSurfaceBeforeLeave: (element: Element) => {
      presence.handleBeforeLeave();
      applyMotionPreset(element, 'leave', options.surfacePreset);
    },
    isActive: presence.isActive,
    labelledBy,
    panelRef,
    portalTarget: overlaySurface.portalTarget,
    titleId,
    descriptionId,
  };
}
