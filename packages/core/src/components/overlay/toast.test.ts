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
});
