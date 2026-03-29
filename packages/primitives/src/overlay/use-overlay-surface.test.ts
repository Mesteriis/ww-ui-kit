import { defineComponent, effectScope, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { resetOverlayStackForTesting } from './overlay-stack';
import { useOverlaySurface } from './use-overlay-surface';

describe('useOverlaySurface', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    resetOverlayStackForTesting();
    document.body.innerHTML = '';
  });

  it('resolves themed portal roots, shared layer styles, and restoreFocus', async () => {
    const onDismiss = vi.fn();

    const wrapper = mount(
      defineComponent({
        setup(_, { expose }) {
          const open = ref(true);
          const sourceRef = ref<HTMLElement | null>(null);
          const contentRef = ref<HTMLElement | null>(null);
          const preferredRef = ref<HTMLElement | null>(null);

          const surface = useOverlaySurface({
            open,
            kind: 'modal',
            contentRef,
            sourceRef,
            dismissOnEscape: true,
            dismissOnPointerOutside: true,
            containFocus: true,
            lockScroll: true,
            initialFocus: () => preferredRef.value,
            onDismiss,
          });

          expose({
            closeOverlay: () => {
              open.value = false;
            },
            sourceRef,
            preferredRef,
            surface,
          });
          return { contentRef, preferredRef, sourceRef, surface };
        },
        template: `
          <section data-ui-theme="belovodye" data-ui-theme-type="light">
            <button ref="sourceRef" id="opener" type="button">Open</button>
            <div ref="contentRef" tabindex="-1">
              <button ref="preferredRef" id="inside" type="button">Inside</button>
            </div>
          </section>
        `,
      }),
      {
        attachTo: document.body,
      }
    );

    await nextTick();
    await nextTick();

    const vm = wrapper.vm as unknown as {
      closeOverlay: () => void;
      surface: ReturnType<typeof useOverlaySurface>;
    };
    const opener = wrapper.find('#opener').element as HTMLButtonElement;
    const preferred = wrapper.find('#inside').element as HTMLButtonElement;

    expect(vm.surface.portalTarget.value?.closest('[data-ui-theme="belovodye"]')).not.toBeNull();
    expect(vm.surface.backdropStyle.value).toEqual({ zIndex: '4000' });
    expect(vm.surface.contentStyle.value).toEqual({ zIndex: '4002' });
    expect(vm.surface.isTopMost.value).toBe(true);

    opener.focus();
    expect(await vm.surface.focusOverlay()).toBe(true);
    expect(document.activeElement).toBe(preferred);

    vm.closeOverlay();
    await nextTick();
    vm.surface.restoreFocus();
    vi.runAllTimers();
    await nextTick();

    expect(document.activeElement).toBe(opener);
    expect(onDismiss).not.toHaveBeenCalled();

    wrapper.unmount();
  });

  it('returns no portal target when a source ref exists but is unresolved', async () => {
    const wrapper = mount(
      defineComponent({
        setup(_, { expose }) {
          const open = ref(true);
          const sourceRef = ref<HTMLElement | null>(null);
          const contentRef = ref<HTMLElement | null>(null);

          const surface = useOverlaySurface({
            open,
            kind: 'modal',
            contentRef,
            sourceRef,
            onDismiss: vi.fn(),
          });

          expose({ surface });
          return { contentRef, surface };
        },
        template: `<div ref="contentRef" tabindex="-1">Content</div>`,
      }),
      {
        attachTo: document.body,
      }
    );

    await nextTick();
    await nextTick();

    const vm = wrapper.vm as unknown as {
      surface: ReturnType<typeof useOverlaySurface>;
    };

    expect(vm.surface.portalTarget.value).toBeNull();
    expect(await vm.surface.focusOverlay()).toBe(true);

    wrapper.unmount();
  });

  it('uses a fallback restore focus target when no opener can be resolved', async () => {
    const fallbackButton = document.createElement('button');
    document.body.append(fallbackButton);

    const wrapper = mount(
      defineComponent({
        setup(_, { expose }) {
          const open = ref(true);
          const contentRef = ref<HTMLElement | null>(null);

          const surface = useOverlaySurface({
            open,
            kind: 'modal',
            contentRef,
            restoreFocusTarget: () => fallbackButton,
            onDismiss: vi.fn(),
          });

          expose({ surface });
          return { contentRef, surface };
        },
        template: `<div ref="contentRef" tabindex="-1">Content</div>`,
      }),
      {
        attachTo: document.body,
      }
    );

    await nextTick();
    await nextTick();

    const vm = wrapper.vm as unknown as {
      surface: ReturnType<typeof useOverlaySurface>;
    };

    vm.surface.restoreFocus();
    vi.runAllTimers();
    await nextTick();

    expect(document.activeElement).toBe(fallbackButton);

    wrapper.unmount();
  });

  it('captures the active element as the opener when opening after mount', async () => {
    const opener = document.createElement('button');
    document.body.append(opener);

    const wrapper = mount(
      defineComponent({
        setup(_, { expose }) {
          const open = ref(false);
          const contentRef = ref<HTMLElement | null>(null);

          const surface = useOverlaySurface({
            open,
            kind: 'modal',
            contentRef,
            onDismiss: vi.fn(),
          });

          expose({
            openOverlay: () => {
              open.value = true;
            },
            closeOverlay: () => {
              open.value = false;
            },
            surface,
          });
          return { contentRef, surface };
        },
        template: `<div ref="contentRef" tabindex="-1">Content</div>`,
      }),
      {
        attachTo: document.body,
      }
    );

    opener.focus();

    const vm = wrapper.vm as unknown as {
      closeOverlay: () => void;
      openOverlay: () => void;
      surface: ReturnType<typeof useOverlaySurface>;
    };

    vm.openOverlay();
    await nextTick();
    await nextTick();
    vm.closeOverlay();
    await nextTick();
    vm.surface.restoreFocus();
    vi.runAllTimers();
    await nextTick();

    expect(document.activeElement).toBe(opener);

    wrapper.unmount();
  });

  it('prefers the tracked interaction target over the active element when opening', async () => {
    const interactionTarget = document.createElement('button');
    interactionTarget.textContent = 'interaction';
    document.body.append(interactionTarget);
    interactionTarget.dispatchEvent(new Event('pointerdown', { bubbles: true }));

    const activeElement = document.createElement('button');
    document.body.append(activeElement);
    activeElement.focus();

    const wrapper = mount(
      defineComponent({
        setup(_, { expose }) {
          const open = ref(true);
          const contentRef = ref<HTMLElement | null>(null);

          const surface = useOverlaySurface({
            open,
            kind: 'modal',
            contentRef,
            onDismiss: vi.fn(),
          });

          expose({
            closeOverlay: () => {
              open.value = false;
            },
            surface,
          });
          return { contentRef, surface };
        },
        template: `<div ref="contentRef" tabindex="-1">Content</div>`,
      }),
      {
        attachTo: document.body,
      }
    );

    await nextTick();
    await nextTick();

    const vm = wrapper.vm as unknown as {
      closeOverlay: () => void;
      surface: ReturnType<typeof useOverlaySurface>;
    };

    vm.closeOverlay();
    await nextTick();
    vm.surface.restoreFocus();
    vi.runAllTimers();
    await nextTick();

    expect(document.activeElement).toBe(interactionTarget);

    wrapper.unmount();
  });

  it('returns false without a registration, resolves fallback portal targets, and skips redundant focus restoration', async () => {
    const portalHost = document.createElement('div');
    const fallbackLink = document.createElement('a');
    fallbackLink.href = '#fallback';
    fallbackLink.textContent = 'fallback';
    document.body.append(portalHost, fallbackLink);

    const wrapper = mount(
      defineComponent({
        setup(_, { expose }) {
          const open = ref(false);
          const contentRef = ref<HTMLElement | null>(null);
          const portalTarget = ref<HTMLElement | null>(portalHost);

          const surface = useOverlaySurface({
            open,
            kind: 'modal',
            contentRef,
            portalTarget,
            restoreFocusTarget: () => fallbackLink,
            onDismiss: vi.fn(),
          });

          expose({
            openOverlay: () => {
              open.value = true;
            },
            surface,
          });
          return { contentRef, surface };
        },
        template: `<div ref="contentRef" tabindex="-1">Content</div>`,
      }),
      {
        attachTo: document.body,
      }
    );

    await nextTick();

    const vm = wrapper.vm as unknown as {
      openOverlay: () => void;
      surface: ReturnType<typeof useOverlaySurface>;
    };

    expect(await vm.surface.focusOverlay()).toBe(false);

    vm.openOverlay();
    await nextTick();
    await nextTick();

    expect(vm.surface.portalTarget.value?.parentElement).toBe(portalHost);

    fallbackLink.focus();
    vm.surface.restoreFocus();
    vi.runAllTimers();
    await nextTick();

    expect(document.activeElement).toBe(fallbackLink);

    wrapper.unmount();
  });

  it('covers invalid focus-target guards, documentless watchers, and non-topmost fallback state', async () => {
    const originalDocument = globalThis.document;
    const anchor = document.createElement('a');
    anchor.href = '#restore';
    const disabledButton = document.createElement('button');
    disabledButton.disabled = true;
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    const negativeTabIndex = document.createElement('div');
    negativeTabIndex.tabIndex = -2;
    document.body.append(anchor, disabledButton, hiddenInput, negativeTabIndex);

    const wrapper = mount(
      defineComponent({
        setup(_, { expose }) {
          const open = ref(false);
          const contentRef = ref<HTMLElement | null>(null);
          const restoreTarget = ref<HTMLElement | null>(null);

          const surface = useOverlaySurface({
            open,
            kind: 'modal',
            contentRef,
            restoreFocusTarget: () => restoreTarget.value,
            onDismiss: vi.fn(),
          });

          expose({
            closeOverlay: () => {
              open.value = false;
            },
            openOverlay: () => {
              open.value = true;
            },
            setRestoreTarget: (nextTarget: HTMLElement | null) => {
              restoreTarget.value = nextTarget;
            },
            surface,
          });
          return { contentRef, surface };
        },
        template: `
          <div ref="contentRef" tabindex="-1">
            <button id="inside" type="button">Inside</button>
          </div>
        `,
      }),
      {
        attachTo: document.body,
      }
    );

    const vm = wrapper.vm as unknown as {
      closeOverlay: () => void;
      openOverlay: () => void;
      setRestoreTarget: (nextTarget: HTMLElement | null) => void;
      surface: ReturnType<typeof useOverlaySurface>;
    };

    const inside = wrapper.find('#inside').element as HTMLButtonElement;
    inside.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));

    vm.setRestoreTarget(anchor);
    vm.openOverlay();
    await nextTick();
    await nextTick();
    expect(vm.surface.portalTarget.value?.parentElement).toBe(document.body);
    expect(vm.surface.isTopMost.value).toBe(true);

    vm.closeOverlay();
    await nextTick();
    expect(vm.surface.isTopMost.value).toBe(false);

    vm.setRestoreTarget(disabledButton);
    vm.surface.restoreFocus();
    vi.runAllTimers();
    await nextTick();
    expect(document.activeElement).not.toBe(disabledButton);

    vm.setRestoreTarget(hiddenInput);
    vm.surface.restoreFocus();
    vi.runAllTimers();
    await nextTick();
    expect(document.activeElement).not.toBe(hiddenInput);

    vm.setRestoreTarget(negativeTabIndex);
    vm.surface.restoreFocus();
    vi.runAllTimers();
    await nextTick();
    expect(document.activeElement).not.toBe(negativeTabIndex);

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: undefined,
    });
    vm.openOverlay();
    await nextTick();
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: originalDocument,
    });
    expect(vm.surface.portalTarget.value).toBeNull();

    wrapper.unmount();
  });

  it('falls through invalid restore targets before focusing a valid fallback anchor', async () => {
    const disconnectedButton = document.createElement('button');
    const disabledButton = document.createElement('button');
    disabledButton.disabled = true;
    const negativeTabIndex = document.createElement('div');
    negativeTabIndex.tabIndex = -2;
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    const anchor = document.createElement('a');
    anchor.href = '#valid';
    anchor.textContent = 'valid';
    document.body.append(disabledButton, negativeTabIndex, hiddenInput, anchor);

    const wrapper = mount(
      defineComponent({
        setup(_, { expose }) {
          const open = ref(true);
          const contentRef = ref<HTMLElement | null>(null);
          const restoreTarget = ref<HTMLElement | null>(disconnectedButton);

          const surface = useOverlaySurface({
            open,
            kind: 'modal',
            contentRef,
            restoreFocusTarget: () => restoreTarget.value,
            onDismiss: vi.fn(),
          });

          expose({
            setRestoreTarget: (nextTarget: HTMLElement | null) => {
              restoreTarget.value = nextTarget;
            },
            surface,
          });
          return { contentRef };
        },
        template: `<div ref="contentRef" tabindex="-1">Content</div>`,
      }),
      {
        attachTo: document.body,
      }
    );

    await nextTick();
    await nextTick();

    const vm = wrapper.vm as unknown as {
      setRestoreTarget: (nextTarget: HTMLElement | null) => void;
      surface: ReturnType<typeof useOverlaySurface>;
    };

    vm.surface.restoreFocus();
    vi.runAllTimers();
    await nextTick();
    expect(document.activeElement).not.toBe(disconnectedButton);

    vm.setRestoreTarget(disabledButton);
    vm.surface.restoreFocus();
    vi.runAllTimers();
    await nextTick();
    expect(document.activeElement).not.toBe(disabledButton);

    vm.setRestoreTarget(negativeTabIndex);
    vm.surface.restoreFocus();
    vi.runAllTimers();
    await nextTick();
    expect(document.activeElement).not.toBe(negativeTabIndex);

    vm.setRestoreTarget(hiddenInput);
    vm.surface.restoreFocus();
    vi.runAllTimers();
    await nextTick();
    expect(document.activeElement).not.toBe(hiddenInput);

    vm.setRestoreTarget(anchor);
    vm.surface.restoreFocus();
    vi.runAllTimers();
    await nextTick();
    expect(document.activeElement).toBe(anchor);

    wrapper.unmount();
  });

  it('stays inert without document access and falls back when activeElement is not focusable', async () => {
    const originalDocument = globalThis.document;
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const scope = effectScope();

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: undefined,
    });

    const state = scope.run(() =>
      useOverlaySurface({
        open: ref(true),
        kind: 'modal',
        contentRef: ref(null),
        onDismiss: vi.fn(),
      })
    );

    expect(state?.portalTarget.value).toBeNull();

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: originalDocument,
    });

    const originalActiveElement = Object.getOwnPropertyDescriptor(document, 'activeElement');
    Object.defineProperty(document, 'activeElement', {
      configurable: true,
      get: () => document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
    });

    const anchor = document.createElement('a');
    anchor.href = '#fallback';
    document.body.append(anchor);
    const focusSpy = vi.spyOn(anchor, 'focus');

    const wrapper = mount(
      defineComponent({
        setup(_, { expose }) {
          const open = ref(true);
          const contentRef = ref<HTMLElement | null>(null);

          const surface = useOverlaySurface({
            open,
            kind: 'modal',
            contentRef,
            restoreFocusTarget: () => anchor,
            onDismiss: vi.fn(),
          });

          expose({ surface });
          return { contentRef };
        },
        template: `<div ref="contentRef" tabindex="-1">Content</div>`,
      }),
      {
        attachTo: document.body,
      }
    );

    if (originalActiveElement) {
      Object.defineProperty(document, 'activeElement', originalActiveElement);
    }

    await nextTick();
    await nextTick();

    const vm = wrapper.vm as unknown as {
      surface: ReturnType<typeof useOverlaySurface>;
    };

    vm.surface.restoreFocus();
    vi.runAllTimers();
    await nextTick();

    expect(focusSpy).toHaveBeenCalled();

    wrapper.unmount();
    scope.stop();
    warnSpy.mockRestore();
  });
});
