import {
  focusFirstElement,
  trapFocusWithin,
} from '../dom/focus';
import {
  resolveOverlayLayerSlots,
  type OverlayLayerKind,
  type OverlayLayerSlots,
} from './layers';

export type OverlayDismissReason =
  | "escape-key"
  | "pointer-outside"
  | "focus-outside";

export interface OverlayRegistrationOptions {
  kind: OverlayLayerKind;
  getContentElement: () => HTMLElement | null;
  getLayerRoot?: (() => HTMLElement | null) | undefined;
  getBoundaryElements?: (() => Array<HTMLElement | null | undefined>) | undefined;
  dismissOnEscape?: boolean | undefined;
  dismissOnPointerOutside?: boolean | undefined;
  dismissOnFocusOutside?: boolean | undefined;
  containFocus?: boolean | undefined;
  lockScroll?: boolean | undefined;
  onDismiss: (reason: OverlayDismissReason) => void;
}

export interface OverlayRegistration {
  layers: OverlayLayerSlots;
  stackIndex: number;
  unregister: () => void;
  isTopMost: () => boolean;
  focusContent: () => boolean;
}

interface OverlayEntry {
  id: number;
  layers: OverlayLayerSlots;
  options: OverlayRegistrationOptions;
  stackIndex: number;
}

interface ScrollLockState {
  active: boolean;
  overflow: string;
  paddingRight: string;
}

class OverlayStackManager {
  private entries: OverlayEntry[] = [];

  private nextId = 0;

  private listenersAttached = false;

  private suppressedClickTarget: Node | null = null;

  private suppressedFocusTarget: HTMLElement | null = null;

  private scrollLock: ScrollLockState = {
    active: false,
    overflow: "",
    paddingRight: "",
  };

  register(options: OverlayRegistrationOptions): OverlayRegistration {
    const stackIndex = this.getNextStackIndex();
    const entry: OverlayEntry = {
      id: this.nextId += 1,
      layers: resolveOverlayLayerSlots(
        stackIndex,
        options.kind,
        options.getLayerRoot?.() ?? options.getContentElement(),
      ),
      options,
      stackIndex,
    };

    this.entries.push(entry);
    this.ensureListeners();
    this.syncScrollLock();

    return {
      layers: entry.layers,
      stackIndex: entry.stackIndex,
      unregister: () => {
        this.entries = this.entries.filter(
          (candidate) => candidate.id !== entry.id,
        );
        this.syncScrollLock();
        this.teardownListenersIfIdle();
      },
      isTopMost: () => this.entries[this.entries.length - 1]?.id === entry.id,
      focusContent: () => this.focusEntry(entry),
    };
  }

  reset(): void {
    this.entries = [];
    this.syncScrollLock();
    this.teardownListenersIfIdle();
  }

  private getNextStackIndex(): number {
    return this.entries.reduce(
      (maxValue, entry) => Math.max(maxValue, entry.stackIndex),
      -1,
    ) + 1;
  }

  private ensureListeners(): void {
    if (this.listenersAttached || typeof document === "undefined") return;

    document.addEventListener("keydown", this.handleKeydown, true);
    document.addEventListener("pointerdown", this.handlePointerDown, true);
    document.addEventListener("click", this.handleClick, true);
    document.addEventListener("focusin", this.handleFocusIn, true);
    this.listenersAttached = true;
  }

  private teardownListenersIfIdle(): void {
    if (!this.listenersAttached || this.entries.length > 0 || typeof document === "undefined") {
      return;
    }

    document.removeEventListener("keydown", this.handleKeydown, true);
    document.removeEventListener("pointerdown", this.handlePointerDown, true);
    document.removeEventListener("click", this.handleClick, true);
    document.removeEventListener("focusin", this.handleFocusIn, true);
    this.listenersAttached = false;
    this.suppressedClickTarget = null;
    this.suppressedFocusTarget = null;
  }

  private readonly handleKeydown = (event: KeyboardEvent): void => {
    if (event.defaultPrevented) return;

    const topEntry = this.entries[this.entries.length - 1];
    if (!topEntry) return;

    if (
      topEntry.options.containFocus &&
      event.key === "Tab" &&
      this.trapFocusForEntry(event, topEntry)
    ) {
      return;
    }

    if (event.key !== "Escape") return;
    if (!topEntry.options.dismissOnEscape) return;

    event.preventDefault();
    topEntry.options.onDismiss("escape-key");
  };

  private readonly handlePointerDown = (event: PointerEvent): void => {
    const topEntry = this.entries[this.entries.length - 1];
    const target = event.target as Node | null;
    if (!topEntry || !target) {
      this.suppressedClickTarget = null;
      this.suppressedFocusTarget = null;
      return;
    }
    if (this.containsTarget(topEntry, target)) {
      this.suppressedClickTarget = null;
      this.suppressedFocusTarget = null;
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.suppressedClickTarget = target;
    if (!topEntry.options.dismissOnPointerOutside) return;

    const nextEntry = this.entries[this.entries.length - 2];
    const focusTarget = this.resolveFocusableTarget(target);
    topEntry.options.onDismiss("pointer-outside");
    this.suppressedFocusTarget =
      nextEntry &&
      focusTarget &&
      this.containsTarget(nextEntry, focusTarget)
        ? focusTarget
        : null;

    if (!this.suppressedFocusTarget) return;

    setTimeout(() => {
      if (this.suppressedFocusTarget !== focusTarget) return;
      this.suppressedFocusTarget = null;
      if (!focusTarget?.isConnected) return;
      focusTarget.focus();
    }, 0);
  };

  private readonly handleClick = (event: MouseEvent): void => {
    const target = event.target as Node | null;
    if (!target) {
      this.suppressedClickTarget = null;
      this.suppressedFocusTarget = null;
      return;
    }

    const suppressedTarget = this.suppressedClickTarget;
    const suppressedFocusTarget = this.suppressedFocusTarget;
    this.suppressedClickTarget = null;
    this.suppressedFocusTarget = null;
    if (!suppressedTarget) return;

    const shouldSuppress =
      suppressedTarget === target ||
      suppressedTarget.contains(target) ||
      target.contains(suppressedTarget);
    if (!shouldSuppress) return;

    event.preventDefault();
    event.stopPropagation();

    if (!suppressedFocusTarget) return;

    queueMicrotask(() => {
      if (!suppressedFocusTarget.isConnected) return;
      suppressedFocusTarget.focus();
    });
  };

  private readonly handleFocusIn = (event: FocusEvent): void => {
    const topEntry = this.entries[this.entries.length - 1];
    const target = event.target as Node | null;
    if (!topEntry || !target) return;
    if (this.containsTarget(topEntry, target)) return;

    const nextEntry = this.entries[this.entries.length - 2];

    if (topEntry.options.dismissOnFocusOutside) {
      topEntry.options.onDismiss("focus-outside");

      if (
        nextEntry?.options.containFocus &&
        !this.containsTarget(nextEntry, target)
      ) {
        queueMicrotask(() => {
          const currentTopEntry = this.entries[this.entries.length - 1];
          if (!currentTopEntry || currentTopEntry.id !== nextEntry.id) return;
          /* istanbul ignore if -- defensive race: the outside target can be reparented into the next overlay before recovery runs. */
          if (this.containsTarget(currentTopEntry, target)) {
            return;
          }
          this.focusEntry(currentTopEntry);
        });
      }

      return;
    }

    if (!topEntry.options.containFocus) return;

    queueMicrotask(() => {
      const currentTopEntry = this.entries[this.entries.length - 1];
      if (!currentTopEntry || currentTopEntry.id !== topEntry.id) return;
      this.focusEntry(currentTopEntry);
    });
  };

  private containsTarget(entry: OverlayEntry, target: Node): boolean {
    return this.getBoundaryElements(entry).some((element) =>
      element === target || element.contains(target),
    );
  }

  private getBoundaryElements(entry: OverlayEntry): HTMLElement[] {
    const contentElement = entry.options.getContentElement();
    const extraElements = entry.options.getBoundaryElements?.() || [];

    return [contentElement, ...extraElements].filter(
      (element): element is HTMLElement => Boolean(element),
    );
  }

  private isProgrammaticallyFocusableElement(element: HTMLElement): boolean {
    if ("disabled" in element && Boolean(element.disabled)) {
      return false;
    }

    const tabIndex = element.getAttribute("tabindex");
    if (tabIndex !== null) {
      return Number(tabIndex) >= -1;
    }

    const tagName = element.tagName.toLowerCase();
    if (
      tagName === "button" ||
      tagName === "select" ||
      tagName === "textarea" ||
      tagName === "summary"
    ) {
      return true;
    }

    if (tagName === "a" && Boolean(element.getAttribute("href"))) {
      return true;
    }

    if (tagName === "input") {
      return (element as HTMLInputElement).type !== "hidden";
    }

    const contentEditable = element.getAttribute("contenteditable");
    return contentEditable === "" || contentEditable === "true";
  }

  private resolveFocusableTarget(target: Node | null): HTMLElement | null {
    let candidate =
      target instanceof HTMLElement
        ? target
        : target?.parentElement instanceof HTMLElement
          ? target.parentElement
          : null;

    while (
      candidate &&
      candidate !== document.body &&
      candidate !== document.documentElement
    ) {
      if (this.isProgrammaticallyFocusableElement(candidate)) {
        return candidate;
      }
      candidate = candidate.parentElement;
    }

    return null;
  }

  private focusEntry(entry: OverlayEntry): boolean {
    const contentElement = entry.options.getContentElement();
    if (!contentElement) return false;
    if (focusFirstElement(contentElement)) return true;
    contentElement.focus();
    return true;
  }

  private trapFocusForEntry(
    event: KeyboardEvent,
    entry: OverlayEntry,
  ): boolean {
    const contentElement = entry.options.getContentElement();
    if (!contentElement) return false;
    return trapFocusWithin(event, contentElement);
  }

  private syncScrollLock(): void {
    if (typeof document === "undefined") return;

    const shouldLock = this.entries.some((entry) => entry.options.lockScroll);
    if (shouldLock && !this.scrollLock.active) {
      const body = document.body;
      this.scrollLock = {
        active: true,
        overflow: body.style.overflow,
        paddingRight: body.style.paddingRight,
      };

      const scrollbarWidth = Math.max(
        0,
        window.innerWidth - document.documentElement.clientWidth,
      );

      body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`;
      }
      return;
    }

    if (!shouldLock && this.scrollLock.active) {
      document.body.style.overflow = this.scrollLock.overflow;
      document.body.style.paddingRight = this.scrollLock.paddingRight;
      this.scrollLock.active = false;
    }
  }
}

const overlayStackManager = new OverlayStackManager();

export function registerOverlay(
  options: OverlayRegistrationOptions,
): OverlayRegistration {
  return overlayStackManager.register(options);
}

export function resetOverlayStackForTesting(): void {
  overlayStackManager.reset();
}
