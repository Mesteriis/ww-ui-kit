import { computed, defineComponent, effectScope, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useEscapeKey } from './useEscapeKey';

describe('useEscapeKey', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('only reacts to Escape while active and cleans up listeners', async () => {
    const handler = vi.fn();

    const Harness = defineComponent({
      props: {
        active: {
          type: Boolean,
          required: true,
        },
      },
      setup(props) {
        useEscapeKey(
          handler,
          computed(() => props.active)
        );
        return {};
      },
      template: '<div />',
    });

    const wrapper = mount(Harness, {
      attachTo: document.body,
      props: {
        active: true,
      },
    });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(handler).not.toHaveBeenCalled();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(handler).toHaveBeenCalledTimes(1);

    await wrapper.setProps({ active: false });
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(handler).toHaveBeenCalledTimes(1);

    wrapper.unmount();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not fail without document access', () => {
    const active = ref(true);
    const handler = vi.fn();
    const scope = effectScope();
    const originalDocument = globalThis.document;

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: undefined,
    });

    expect(() => {
      scope.run(() => {
        useEscapeKey(handler, active);
      });
    }).not.toThrow();

    scope.stop();

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: originalDocument,
    });
  });

  it('uses the default active=true contract when no active ref is provided', () => {
    const handler = vi.fn();
    const scope = effectScope();

    scope.run(() => {
      useEscapeKey(handler);
    });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(handler).toHaveBeenCalledTimes(1);

    scope.stop();
  });
});
