let listenersAttached = false;
let lastInteractionTarget: HTMLElement | null = null;
let lastInteractionTimestamp = 0;

function resolveEventTarget(target: EventTarget | null): HTMLElement | null {
  if (typeof HTMLElement === "undefined") {
    return null;
  }

  if (target instanceof HTMLElement) {
    return target;
  }

  const parentElement =
    target && typeof target === "object" && "parentElement" in target
      ? target.parentElement
      : null;

  return parentElement instanceof HTMLElement ? parentElement : null;
}

function isFocusableElement(element: HTMLElement): boolean {
  if ("disabled" in element && Boolean(element.disabled)) {
    return false;
  }

  const tabIndex = element.getAttribute("tabindex");
  if (tabIndex !== null) {
    return Number(tabIndex) >= 0;
  }

  const tagName = element.tagName.toLowerCase();
  if (
    tagName === "button" ||
    tagName === "input" ||
    tagName === "select" ||
    tagName === "textarea" ||
    tagName === "summary"
  ) {
    return true;
  }

  if (tagName === "a" && Boolean(element.getAttribute("href"))) {
    return true;
  }

  const contentEditable = element.getAttribute("contenteditable");
  return contentEditable === "" || contentEditable === "true";
}

function resolveTrackedElement(target: EventTarget | null): HTMLElement | null {
  let element = resolveEventTarget(target);

  while (
    element &&
    element !== document.body &&
    element !== document.documentElement
  ) {
    if (isFocusableElement(element)) {
      return element;
    }
    element = element.parentElement;
  }

  return resolveEventTarget(target);
}

function isTrackedElement(element: HTMLElement | null): element is HTMLElement {
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

function updateInteractionTarget(target: EventTarget | null): void {
  if (typeof document === "undefined") return;

  const element = resolveTrackedElement(target);
  if (!isTrackedElement(element)) return;
  lastInteractionTarget = element;
  lastInteractionTimestamp = Date.now();
}

function handlePointerDown(event: PointerEvent): void {
  updateInteractionTarget(event.target);
}

function handleKeyDown(event: KeyboardEvent): void {
  if (typeof document === "undefined") return;

  const activeElement =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

  if (isTrackedElement(activeElement)) {
    lastInteractionTarget = activeElement;
    return;
  }

  updateInteractionTarget(event.target);
}

export function ensureOverlayInteractionTracking(): void {
  if (listenersAttached || typeof document === "undefined") return;

  document.addEventListener("pointerdown", handlePointerDown, true);
  document.addEventListener("keydown", handleKeyDown, true);
  listenersAttached = true;
}

export function getLastOverlayInteractionTarget(
  maxAgeMs = 1500,
): HTMLElement | null {
  if (typeof document === "undefined") return null;
  if (Date.now() - lastInteractionTimestamp > maxAgeMs) {
    return null;
  }

  return isTrackedElement(lastInteractionTarget)
    ? lastInteractionTarget
    : null;
}
