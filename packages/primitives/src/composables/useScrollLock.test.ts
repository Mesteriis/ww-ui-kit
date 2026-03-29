import { computed, defineComponent, effectScope } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import { useScrollLock } from './useScrollLock';

describe('useScrollLock', () => {
  it('locks and unlocks body scroll with cleanup', async () => {
    const Harness = defineComponent({
      props: {
        active: {
          type: Boolean,
          required: true,
        },
      },
      setup(props) {
        useScrollLock(computed(() => props.active));
        return {};
      },
      template: '<div />',
    });

    const wrapper = mount(Harness, {
      props: {
        active: true,
      },
    });

    expect(document.body.style.overflow).toBe('hidden');

    await wrapper.setProps({ active: false });
    expect(document.body.style.overflow).toBe('');

    wrapper.unmount();
  });

  it('supports multiple concurrent locks, initial inactive mode, and missing document access', async () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 1400,
    });
    Object.defineProperty(document.documentElement, 'clientWidth', {
      configurable: true,
      value: 1360,
    });

    const Harness = defineComponent({
      props: {
        active: {
          type: Boolean,
          required: true,
        },
      },
      setup(props) {
        useScrollLock(computed(() => props.active));
        return {};
      },
      template: '<div />',
    });

    const first = mount(Harness, { props: { active: false } });
    expect(document.body.style.overflow).toBe('');

    await first.setProps({ active: true });
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.paddingRight).toBe('40px');

    const second = mount(Harness, { props: { active: true } });
    expect(document.body.style.overflow).toBe('hidden');

    first.unmount();
    expect(document.body.style.overflow).toBe('hidden');

    second.unmount();
    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.paddingRight).toBe('');

    const scope = effectScope();
    const originalDocument = globalThis.document;
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: undefined,
    });

    expect(() => {
      scope.run(() => {
        useScrollLock(true);
      });
    }).not.toThrow();

    scope.stop();
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: originalDocument,
    });
  });

  it('restores zero-width scroll locks without touching padding-right', async () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 1280,
    });
    Object.defineProperty(document.documentElement, 'clientWidth', {
      configurable: true,
      value: 1280,
    });

    const Harness = defineComponent({
      props: {
        active: {
          type: Boolean,
          required: true,
        },
      },
      setup(props) {
        useScrollLock(computed(() => props.active));
        return {};
      },
      template: '<div />',
    });

    const wrapper = mount(Harness, { props: { active: true } });
    expect(document.body.style.paddingRight).toBe('');

    wrapper.unmount();
    expect(document.body.style.overflow).toBe('');
  });
});
