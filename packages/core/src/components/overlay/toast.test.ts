import { defineComponent, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import UiToast from './UiToast.vue';

describe('UiToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('exposes an imperative stack API, trims to maxStack, and uses severity semantics', async () => {
    const wrapper = mount(
      defineComponent({
        components: { UiToast },
        setup() {
          const toastRef = ref<{
            clear: () => void;
            dismiss: (id: string) => void;
            push: (payload: Record<string, unknown>) => string;
          } | null>(null);
          return { toastRef };
        },
        template: `<UiToast ref="toastRef" :max-stack="2" />`,
      }),
      {
        attachTo: document.body,
        global: {
          stubs: {
            'transition-group': false,
          },
        },
      }
    );

    const vm = wrapper.vm as typeof wrapper.vm & {
      toastRef: {
        clear: () => void;
        dismiss: (id: string) => void;
        push: (payload: Record<string, unknown>) => string;
      } | null;
    };

    vm.toastRef?.push({ title: 'Saved', type: 'success', duration: 0 });
    vm.toastRef?.push({ title: 'Synced', type: 'info', duration: 0 });
    vm.toastRef?.push({ title: 'Failed', type: 'error', duration: 0 });
    await nextTick();

    const toasts = document.querySelectorAll('.ui-toast');
    expect(toasts).toHaveLength(2);
    expect(document.body.textContent).not.toContain('Saved');
    expect(document.body.textContent).toContain('Failed');
    expect(document.querySelector('.ui-toast--error')?.getAttribute('role')).toBe('alert');
    expect(document.querySelector('.ui-toast--error')?.getAttribute('aria-live')).toBe('assertive');
    expect(document.querySelector('.ui-toast--info')?.getAttribute('role')).toBe('status');

    vm.toastRef?.clear();
    await nextTick();
    expect(document.querySelector('.ui-toast')).toBeNull();

    wrapper.unmount();
  });

  it('pauses dismissal on hover and resumes when the pointer leaves', async () => {
    const wrapper = mount(UiToast, {
      attachTo: document.body,
      props: {
        duration: 1000,
      },
      global: {
        stubs: {
          'transition-group': false,
        },
      },
    });

    const toastVm = wrapper.vm as typeof wrapper.vm & {
      push: (payload: Record<string, unknown>) => string;
    };

    toastVm.push({
      title: 'Auto close',
      description: 'Hover to pause',
    });
    await nextTick();

    const toast = document.querySelector('.ui-toast');
    expect(toast).not.toBeNull();

    vi.advanceTimersByTime(500);
    await nextTick();
    toast?.dispatchEvent(new Event('pointerenter', { bubbles: true }));
    vi.advanceTimersByTime(800);
    await nextTick();
    expect(document.querySelector('.ui-toast')).not.toBeNull();

    toast?.dispatchEvent(new Event('pointerleave', { bubbles: true }));
    vi.advanceTimersByTime(600);
    await nextTick();
    expect(document.querySelector('.ui-toast')).toBeNull();

    wrapper.unmount();
  });

  it('covers action clicks, non-closable toasts, maxStack zero, and motion hooks', async () => {
    const actionSpy = vi.fn();

    const wrapper = mount(UiToast, {
      attachTo: document.body,
      props: {
        duration: 0,
        maxStack: 0,
        pauseOnHover: false,
      },
      global: {
        stubs: {
          'transition-group': false,
        },
      },
    });

    const toastVm = wrapper.vm as typeof wrapper.vm & {
      dismiss: (id: string) => void;
      push: (payload: Record<string, unknown>) => string;
    };

    toastVm.dismiss('missing');
    toastVm.push({
      title: 'Trimmed immediately',
      description: 'Nothing should remain',
    });
    await nextTick();
    expect(document.querySelector('.ui-toast')).toBeNull();

    await wrapper.setProps({ maxStack: 3, pauseOnHover: true });
    const actionId = toastVm.push({
      title: 'Needs action',
      description: 'Action description',
      closable: false,
      action: {
        label: 'Retry',
        onClick: actionSpy,
      },
    });
    await nextTick();

    expect(document.querySelector('.ui-toast__close')).toBeNull();
    (document.querySelector('button.ui-toast__action') as HTMLButtonElement | null)?.click();
    await nextTick();
    expect(actionSpy).toHaveBeenCalledTimes(1);
    expect(wrapper.emitted('dismiss')).toEqual([[actionId]]);

    const setupState = wrapper.vm.$.setupState as {
      resumeToast: (toast: {
        id: string;
        duration: number;
        remainingMs: number;
        startedAt: number | null;
      }) => void;
      onAfterEnter: (element: Element) => void;
      onAfterLeave: (element: Element) => void;
      onBeforeEnter: (element: Element) => void;
      onBeforeLeave: (element: Element) => void;
    };
    const element = document.createElement('div');
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const closableId = toastVm.push({
      title: 'Closable',
      duration: 1000,
    });
    await nextTick();

    const now = Date.now();
    vi.setSystemTime(now + 1000);
    const toastElements = Array.from(document.querySelectorAll<HTMLElement>('.ui-toast'));
    toastElements.at(-1)?.dispatchEvent(new Event('pointerenter', { bubbles: true }));
    toastElements.at(-1)?.dispatchEvent(new Event('pointerleave', { bubbles: true }));
    await nextTick();

    setupState.onBeforeEnter(element);
    setupState.onAfterEnter(element);
    setupState.onBeforeLeave(element);
    setupState.onAfterLeave(element);
    setupState.onAfterLeave(svgElement);

    const closeButtonId = toastVm.push({
      title: 'Close me',
      duration: 0,
    });
    await nextTick();
    const latestToast = Array.from(document.querySelectorAll<HTMLElement>('.ui-toast')).at(-1);
    latestToast?.dispatchEvent(new Event('pointerenter', { bubbles: true }));
    latestToast?.dispatchEvent(new Event('pointerleave', { bubbles: true }));
    const closeButtons = Array.from(
      document.querySelectorAll<HTMLButtonElement>('.ui-toast__close')
    );
    closeButtons.at(-1)?.click();
    expect(wrapper.emitted('dismiss')).toEqual([[actionId], [closableId], [closeButtonId]]);

    wrapper.unmount();
  });
});
