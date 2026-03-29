import {
  computed,
  nextTick,
  onBeforeUnmount,
  shallowRef,
  watch,
  type ComputedRef,
  type Ref,
  type ShallowRef,
} from 'vue';
import { isProgrammaticallyFocusableElement } from '../dom/focus';
import {
  registerOverlay,
  type OverlayDismissReason,
  type OverlayRegistration,
} from './overlay-stack';
import { ensureOverlayPortalRoot, type OverlayPortalTarget } from './portal';
import {
  ensureOverlayInteractionTracking,
  getLastOverlayInteractionTarget,
} from './interaction-tracker';
import type { OverlayLayerKind } from './layers';

interface UseOverlaySurfaceOptions {
  open: Ref<boolean>;
  kind: OverlayLayerKind;
  contentRef: Ref<HTMLElement | null>;
  sourceRef?: Ref<HTMLElement | null>;
  portalTarget?: Ref<OverlayPortalTarget>;
  getBoundaryElements?: () => Array<HTMLElement | null | undefined>;
  restoreFocusTarget?: () => HTMLElement | null;
  dismissOnEscape?: boolean;
  dismissOnPointerOutside?: boolean;
  dismissOnFocusOutside?: boolean;
  containFocus?: boolean;
  lockScroll?: boolean;
  onDismiss: (reason: OverlayDismissReason) => void;
  initialFocus?: () => HTMLElement | null;
}

interface UseOverlaySurfaceResult {
  backdropStyle: ComputedRef<Record<string, string> | undefined>;
  contentStyle: ComputedRef<Record<string, string> | undefined>;
  focusOverlay: () => Promise<boolean>;
  isTopMost: ComputedRef<boolean>;
  portalTarget: ShallowRef<HTMLElement | null>;
  restoreFocus: () => void;
}

export function useOverlaySurface(options: UseOverlaySurfaceOptions): UseOverlaySurfaceResult {
  ensureOverlayInteractionTracking();

  const registration = shallowRef<OverlayRegistration | null>(null);
  const openerElement = shallowRef<HTMLElement | null>(null);
  const resolvedPortalTarget = shallowRef<HTMLElement | null>(null);

  function unregisterOverlay(): void {
    registration.value?.unregister();
    registration.value = null;
  }

  function resolvePortalTarget(): HTMLElement | null {
    const sourceElement = options.sourceRef?.value ?? openerElement.value ?? null;
    const explicitTarget = options.portalTarget?.value;

    if (!explicitTarget && options.sourceRef && !sourceElement) {
      return null;
    }

    return ensureOverlayPortalRoot({
      source: sourceElement ?? resolveFocusableTarget(options.restoreFocusTarget?.()) ?? null,
      target: explicitTarget,
    });
  }

  async function focusOverlay(): Promise<boolean> {
    await nextTick();

    const preferredTarget = options.initialFocus?.();
    if (preferredTarget) {
      preferredTarget.focus();
      return true;
    }

    return registration.value?.focusContent() || false;
  }

  function isValidFocusTarget(element: HTMLElement | null | undefined): element is HTMLElement {
    if (
      !element ||
      !element.isConnected ||
      element === document.body ||
      element === document.documentElement
    ) {
      return false;
    }

    return true;
  }

  function resolveFocusableTarget(element: HTMLElement | null | undefined): HTMLElement | null {
    let candidate = element;

    while (candidate && candidate !== document.body && candidate !== document.documentElement) {
      if (isValidFocusTarget(candidate) && isProgrammaticallyFocusableElement(candidate)) {
        return candidate;
      }
      candidate = candidate.parentElement;
    }

    return null;
  }

  function isElementInsideSurface(element: HTMLElement | null): boolean {
    const contentElement = options.contentRef.value;
    if (!contentElement || !element) return false;
    return contentElement === element || contentElement.contains(element);
  }

  function resolveOpeningFocusTarget(): HTMLElement | null {
    const interactionTarget = getLastOverlayInteractionTarget();
    const focusableInteractionTarget = resolveFocusableTarget(interactionTarget);
    if (focusableInteractionTarget && !isElementInsideSurface(focusableInteractionTarget)) {
      return focusableInteractionTarget;
    }

    const activeElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusableActiveElement = resolveFocusableTarget(activeElement);

    if (focusableActiveElement && !isElementInsideSurface(focusableActiveElement)) {
      return focusableActiveElement;
    }

    const fallbackTarget = resolveFocusableTarget(options.restoreFocusTarget?.());
    if (fallbackTarget) {
      return fallbackTarget;
    }

    return null;
  }

  function resolveRestoreFocusTarget(): HTMLElement | null {
    const opener = resolveFocusableTarget(openerElement.value);
    if (opener) {
      return opener;
    }

    const sourceTarget = resolveFocusableTarget(options.sourceRef?.value);
    if (sourceTarget) {
      return sourceTarget;
    }

    const fallbackTarget = resolveFocusableTarget(options.restoreFocusTarget?.());
    if (fallbackTarget) {
      return fallbackTarget;
    }

    return null;
  }

  function restoreFocus(): void {
    const target = resolveRestoreFocusTarget();
    if (!target) return;

    window.setTimeout(() => {
      if (target.isConnected && document.activeElement !== target) {
        target.focus();
      }
    }, 0);
  }

  watch(
    options.open,
    (isOpen, wasOpen) => {
      if (typeof document === 'undefined') return;

      if (!isOpen) {
        if (wasOpen) {
          unregisterOverlay();
        }
        return;
      }

      openerElement.value = resolveOpeningFocusTarget();
      resolvedPortalTarget.value = resolvePortalTarget();
    },
    {
      immediate: true,
      flush: 'sync',
    }
  );

  watch(
    () => [options.open.value, options.sourceRef?.value, options.portalTarget?.value] as const,
    ([isOpen]) => {
      if (!isOpen) {
        return;
      }

      resolvedPortalTarget.value = resolvePortalTarget();
    },
    {
      flush: 'post',
      immediate: true,
    }
  );

  watch(
    options.open,
    async (isOpen) => {
      if (typeof document === 'undefined') return;
      if (!isOpen) return;

      unregisterOverlay();
      registration.value = registerOverlay({
        kind: options.kind,
        getContentElement: () => options.contentRef.value,
        getLayerRoot: () => resolvedPortalTarget.value,
        getBoundaryElements: options.getBoundaryElements,
        dismissOnEscape: options.dismissOnEscape,
        dismissOnPointerOutside: options.dismissOnPointerOutside,
        dismissOnFocusOutside: options.dismissOnFocusOutside,
        containFocus: options.containFocus,
        lockScroll: options.lockScroll,
        onDismiss: options.onDismiss,
      });

      await focusOverlay();
    },
    {
      flush: 'post',
      immediate: true,
    }
  );

  onBeforeUnmount(() => {
    unregisterOverlay();
  });

  const contentStyle = computed(() =>
    registration.value
      ? {
          zIndex: String(registration.value.layers.content),
        }
      : undefined
  );

  const backdropStyle = computed(() =>
    registration.value
      ? {
          zIndex: String(registration.value.layers.backdrop),
        }
      : undefined
  );

  const isTopMost = computed(() => registration.value?.isTopMost() || false);

  return {
    backdropStyle,
    contentStyle,
    focusOverlay,
    isTopMost,
    portalTarget: resolvedPortalTarget,
    restoreFocus,
  };
}
