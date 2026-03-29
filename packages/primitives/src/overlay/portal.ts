import { OVERLAY_PORTAL_ID, OVERLAY_PORTAL_SELECTOR } from './layers';

export { OVERLAY_PORTAL_ID, OVERLAY_PORTAL_SELECTOR };

export const OVERLAY_PORTAL_ROOT_ATTRIBUTE = 'data-ui-portal-root';

const THEME_ATTRIBUTE = 'data-ui-theme';
const THEME_TYPE_ATTRIBUTE = 'data-ui-theme-type';
const portalRoots = new WeakMap<HTMLElement, HTMLElement>();

export type OverlayPortalTarget = string | HTMLElement | null | undefined;

function isElement(target: unknown): target is HTMLElement {
  return typeof HTMLElement !== 'undefined' && target instanceof HTMLElement;
}

function resolveElementTarget(target: string | HTMLElement | null | undefined): HTMLElement | null {
  if (typeof document === 'undefined' || !target) {
    return null;
  }

  if (isElement(target)) {
    return target;
  }

  if (target === 'body') {
    return document.body;
  }

  if (target === 'html') {
    return document.documentElement;
  }

  return document.querySelector<HTMLElement>(target);
}

export function findNearestThemeContainer(
  source?: HTMLElement | null,
  fallbackToRoot = true,
): HTMLElement | null {
  if (typeof document === 'undefined') {
    return null;
  }

  let current = source;

  while (current) {
    if (current.hasAttribute(THEME_ATTRIBUTE) || current.hasAttribute(THEME_TYPE_ATTRIBUTE)) {
      return current;
    }

    current = current.parentElement;
  }

  return fallbackToRoot ? document.documentElement : null;
}

function syncThemeScopeAttributes(host: HTMLElement, portalRoot: HTMLElement, source?: HTMLElement | null): void {
  const themedSource =
    findNearestThemeContainer(source, false) ??
    findNearestThemeContainer(host, false) ??
    document.documentElement;
  const inheritsThemeFromAncestor = Boolean(
    themedSource &&
      (themedSource === document.documentElement || themedSource === host || themedSource.contains(host))
  );

  if (inheritsThemeFromAncestor) {
    portalRoot.removeAttribute(THEME_ATTRIBUTE);
    portalRoot.removeAttribute(THEME_TYPE_ATTRIBUTE);
    portalRoot.style.removeProperty('color-scheme');
    return;
  }

  const themeName = themedSource?.getAttribute(THEME_ATTRIBUTE);
  const themeType = themedSource?.getAttribute(THEME_TYPE_ATTRIBUTE);

  if (themeName) {
    portalRoot.setAttribute(THEME_ATTRIBUTE, themeName);
  } else {
    portalRoot.removeAttribute(THEME_ATTRIBUTE);
  }

  if (themeType) {
    portalRoot.setAttribute(THEME_TYPE_ATTRIBUTE, themeType);
    portalRoot.style.colorScheme = themeType;
  } else {
    portalRoot.removeAttribute(THEME_TYPE_ATTRIBUTE);
    portalRoot.style.removeProperty('color-scheme');
  }
}

function ensurePortalRootForHost(host: HTMLElement, source?: HTMLElement | null): HTMLElement {
  if (
    host.id === OVERLAY_PORTAL_ID ||
    host.getAttribute(OVERLAY_PORTAL_ROOT_ATTRIBUTE) === 'true'
  ) {
    syncThemeScopeAttributes(host, host, source);
    return host;
  }

  const cachedRoot = portalRoots.get(host);
  if (cachedRoot?.isConnected) {
    syncThemeScopeAttributes(host, cachedRoot, source);
    return cachedRoot;
  }

  const existingRoot =
    host === document.body
      ? document.getElementById(OVERLAY_PORTAL_ID)
      : Array.from(host.children).find(
          (child) =>
            child instanceof HTMLElement &&
            child.getAttribute(OVERLAY_PORTAL_ROOT_ATTRIBUTE) === 'true',
        ) ?? null;

  if (existingRoot instanceof HTMLElement) {
    portalRoots.set(host, existingRoot);
    syncThemeScopeAttributes(host, existingRoot, source);
    return existingRoot;
  }

  const portalRoot = document.createElement('div');
  if (host === document.body) {
    portalRoot.id = OVERLAY_PORTAL_ID;
  }
  portalRoot.setAttribute(OVERLAY_PORTAL_ROOT_ATTRIBUTE, 'true');
  portalRoot.setAttribute('data-ui-portal-host', host === document.body ? 'global' : 'scoped');
  host.append(portalRoot);
  portalRoots.set(host, portalRoot);
  syncThemeScopeAttributes(host, portalRoot, source);
  return portalRoot;
}

export function ensureOverlayPortalRoot(options?: {
  source?: HTMLElement | null;
  target?: OverlayPortalTarget;
}): HTMLElement | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const explicitTarget = resolveElementTarget(options?.target);
  if (explicitTarget) {
    return ensurePortalRootForHost(
      explicitTarget === document.documentElement ? document.body : explicitTarget,
      options?.source ?? null
    );
  }

  const themeContainer = findNearestThemeContainer(options?.source ?? null);
  const host =
    !themeContainer || themeContainer === document.documentElement
      ? document.body
      : themeContainer;

  return ensurePortalRootForHost(host, options?.source ?? null);
}
