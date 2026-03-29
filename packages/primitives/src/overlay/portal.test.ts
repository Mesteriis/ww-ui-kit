import { afterEach, describe, expect, it } from 'vitest';

import {
  ensureOverlayPortalRoot,
  findNearestThemeContainer,
  OVERLAY_PORTAL_ID,
  OVERLAY_PORTAL_ROOT_ATTRIBUTE,
} from './portal';

const THEME_ATTRIBUTE = 'data-ui-theme';
const THEME_TYPE_ATTRIBUTE = 'data-ui-theme-type';

describe('overlay portal', () => {
  afterEach(() => {
    document.documentElement.removeAttribute(THEME_ATTRIBUTE);
    document.documentElement.removeAttribute(THEME_TYPE_ATTRIBUTE);
    document.body.innerHTML = '';
  });

  it('mounts scoped portal roots inside the nearest themed container and preserves theme metadata', () => {
    const container = document.createElement('section');
    container.setAttribute(THEME_ATTRIBUTE, 'belovodye');
    container.setAttribute(THEME_TYPE_ATTRIBUTE, 'light');
    const source = document.createElement('button');
    container.append(source);
    document.body.append(container);

    const portalRoot = ensureOverlayPortalRoot({ source });

    expect(portalRoot?.parentElement).toBe(container);
    expect(portalRoot?.getAttribute(OVERLAY_PORTAL_ROOT_ATTRIBUTE)).toBe('true');
    expect(portalRoot?.closest(`[${THEME_ATTRIBUTE}]`)).toBe(container);
    expect(portalRoot?.closest(`[${THEME_TYPE_ATTRIBUTE}]`)).toBe(container);
  });

  it('mounts global portal roots under body and inherits root theme metadata', () => {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, 'dark');
    document.documentElement.setAttribute(THEME_TYPE_ATTRIBUTE, 'dark');

    const source = document.createElement('button');
    document.body.append(source);

    const portalRoot = ensureOverlayPortalRoot({ source });

    expect(portalRoot?.id).toBe(OVERLAY_PORTAL_ID);
    expect(portalRoot?.parentElement).toBe(document.body);
    expect(portalRoot?.closest(`[${THEME_ATTRIBUTE}]`)).toBe(document.documentElement);
    expect(portalRoot?.closest(`[${THEME_TYPE_ATTRIBUTE}]`)).toBe(document.documentElement);
  });

  it('keeps theme metadata when an explicit target is outside the themed subtree', () => {
    const scopedContainer = document.createElement('section');
    scopedContainer.setAttribute(THEME_ATTRIBUTE, 'belovodye');
    scopedContainer.setAttribute(THEME_TYPE_ATTRIBUTE, 'light');

    const source = document.createElement('button');
    scopedContainer.append(source);
    document.body.append(scopedContainer);

    const explicitTarget = document.createElement('div');
    document.body.append(explicitTarget);

    const portalRoot = ensureOverlayPortalRoot({ source, target: explicitTarget });

    expect(portalRoot?.parentElement).toBe(explicitTarget);
    expect(portalRoot?.getAttribute(THEME_ATTRIBUTE)).toBe('belovodye');
    expect(portalRoot?.getAttribute(THEME_TYPE_ATTRIBUTE)).toBe('light');
    expect(portalRoot?.style.colorScheme).toBe('');
  });

  it('reuses existing portal roots and supports body/html/string targets', () => {
    const scopedHost = document.createElement('div');
    document.body.append(scopedHost);

    const first = ensureOverlayPortalRoot({ target: scopedHost });
    const second = ensureOverlayPortalRoot({ target: scopedHost });
    const fromBody = ensureOverlayPortalRoot({ target: 'body' });
    const fromHtml = ensureOverlayPortalRoot({ target: 'html' });

    const selectorHost = document.createElement('div');
    selectorHost.id = 'selector-target';
    document.body.append(selectorHost);
    const fromSelector = ensureOverlayPortalRoot({ target: '#selector-target' });

    expect(second).toBe(first);
    expect(fromBody?.id).toBe(OVERLAY_PORTAL_ID);
    expect(fromHtml?.parentElement).toBe(document.body);
    expect(fromSelector?.parentElement).toBe(selectorHost);
  });

  it('returns the host itself when the host is already a portal root and finds the nearest theme container', () => {
    const scoped = document.createElement('section');
    scoped.setAttribute(THEME_ATTRIBUTE, 'belovodye');
    scoped.setAttribute(THEME_TYPE_ATTRIBUTE, 'light');
    document.body.append(scoped);

    const source = document.createElement('button');
    scoped.append(source);

    const directRoot = document.createElement('div');
    directRoot.id = OVERLAY_PORTAL_ID;
    directRoot.setAttribute(OVERLAY_PORTAL_ROOT_ATTRIBUTE, 'true');
    document.body.append(directRoot);

    expect(ensureOverlayPortalRoot({ target: directRoot, source })).toBe(directRoot);
    expect(findNearestThemeContainer(source)).toBe(scoped);
    expect(findNearestThemeContainer(null)).toBe(document.documentElement);
  });

  it('reuses an existing scoped child portal root on a non-body host', () => {
    const host = document.createElement('section');
    const existingRoot = document.createElement('div');
    existingRoot.setAttribute(OVERLAY_PORTAL_ROOT_ATTRIBUTE, 'true');
    host.append(existingRoot);
    document.body.append(host);

    expect(ensureOverlayPortalRoot({ target: host })).toBe(existingRoot);
  });

  it('clears copied theme metadata when the portal host already inherits from the theme ancestor', () => {
    const scoped = document.createElement('section');
    scoped.setAttribute(THEME_ATTRIBUTE, 'belovodye');
    scoped.setAttribute(THEME_TYPE_ATTRIBUTE, 'light');
    document.body.append(scoped);

    const host = document.createElement('div');
    scoped.append(host);

    const source = document.createElement('button');
    host.append(source);

    const portalRoot = ensureOverlayPortalRoot({ target: host, source });

    expect(portalRoot?.parentElement).toBe(host);
    expect(portalRoot?.hasAttribute(THEME_ATTRIBUTE)).toBe(false);
    expect(portalRoot?.hasAttribute(THEME_TYPE_ATTRIBUTE)).toBe(false);
    expect(portalRoot?.style.colorScheme).toBe('');
  });

  it('returns null without document access and ignores invalid selector targets', () => {
    expect(ensureOverlayPortalRoot({ target: '#missing-target' })).toBe(
      document.getElementById(OVERLAY_PORTAL_ID)
    );

    const originalDocument = globalThis.document;
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: undefined,
    });

    expect(findNearestThemeContainer(null)).toBeNull();
    expect(ensureOverlayPortalRoot()).toBeNull();

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: originalDocument,
    });
  });

  it('removes copied theme attributes when the source has no explicit theme metadata', () => {
    const explicitTarget = document.createElement('div');
    explicitTarget.setAttribute('data-ui-theme', 'dark');
    explicitTarget.setAttribute('data-ui-theme-type', 'dark');
    document.body.append(explicitTarget);

    const source = document.createElement('button');
    document.body.append(source);

    const portalRoot = ensureOverlayPortalRoot({ source, target: explicitTarget });

    expect(portalRoot?.getAttribute(THEME_ATTRIBUTE)).toBeNull();
    expect(portalRoot?.getAttribute(THEME_TYPE_ATTRIBUTE)).toBeNull();
    expect(portalRoot?.style.colorScheme).toBe('');
  });

  it('copies only the theme name when a scoped source omits theme type metadata', () => {
    const scopedContainer = document.createElement('section');
    scopedContainer.setAttribute(THEME_ATTRIBUTE, 'belovodye');
    document.body.append(scopedContainer);

    const source = document.createElement('button');
    scopedContainer.append(source);

    const explicitTarget = document.createElement('div');
    document.body.append(explicitTarget);

    const portalRoot = ensureOverlayPortalRoot({ source, target: explicitTarget });

    expect(portalRoot?.getAttribute(THEME_ATTRIBUTE)).toBe('belovodye');
    expect(portalRoot?.getAttribute(THEME_TYPE_ATTRIBUTE)).toBeNull();
    expect(portalRoot?.style.colorScheme).toBe('');
  });

  it('copies only the theme type when a scoped source omits the theme name', () => {
    const scopedContainer = document.createElement('section');
    scopedContainer.setAttribute(THEME_TYPE_ATTRIBUTE, 'dark');
    document.body.append(scopedContainer);

    const source = document.createElement('button');
    scopedContainer.append(source);

    const explicitTarget = document.createElement('div');
    document.body.append(explicitTarget);

    const portalRoot = ensureOverlayPortalRoot({ source, target: explicitTarget });

    expect(portalRoot?.getAttribute(THEME_ATTRIBUTE)).toBeNull();
    expect(portalRoot?.getAttribute(THEME_TYPE_ATTRIBUTE)).toBe('dark');
    expect(portalRoot?.style.colorScheme).toBe('');
  });

  it('removes copied theme metadata on detached explicit targets without a valid theme source', () => {
    const detachedTarget = document.createElement('div');
    detachedTarget.setAttribute(THEME_ATTRIBUTE, 'dark');
    detachedTarget.setAttribute(THEME_TYPE_ATTRIBUTE, 'dark');

    const portalRoot = ensureOverlayPortalRoot({ target: detachedTarget });

    expect(portalRoot?.parentElement).toBe(detachedTarget);
    expect(portalRoot?.getAttribute(THEME_ATTRIBUTE)).toBeNull();
    expect(portalRoot?.getAttribute(THEME_TYPE_ATTRIBUTE)).toBeNull();
    expect(portalRoot?.style.colorScheme).toBe('');
  });
});
