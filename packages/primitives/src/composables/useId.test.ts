import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useId } from './useId';

describe('useId', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('prefixes Vue ids inside component setup without relying on a shared counter', () => {
    const Harness = defineComponent({
      setup() {
        const firstDefault = useId();
        const secondDefault = useId();
        const custom = useId('tabs');

        return {
          custom,
          firstDefault,
          secondDefault,
        };
      },
      template:
        '<div :data-first-default="firstDefault" :data-second-default="secondDefault" :data-custom="custom" />',
    });

    const wrapper = mount(Harness);

    const firstDefault = wrapper.attributes('data-first-default');
    const secondDefault = wrapper.attributes('data-second-default');
    const custom = wrapper.attributes('data-custom');

    expect(firstDefault).toMatch(/^ui-/);
    expect(secondDefault).toMatch(/^ui-/);
    expect(custom).toMatch(/^tabs-/);
    expect(firstDefault).not.toBe(secondDefault);
  });

  it('supports non-component composables with standalone fallback ids', () => {
    const first = useId('field');
    const second = useId('field');

    expect(first.value).toMatch(/^field-fallback-/);
    expect(second.value).toMatch(/^field-fallback-/);
    expect(first.value).not.toBe(second.value);
  });

  it('falls back to Math.random when crypto.randomUUID is unavailable', () => {
    vi.stubGlobal('crypto', undefined);
    const mathRandom = vi.spyOn(Math, 'random').mockReturnValue(0.123456789);

    const id = useId('field');

    expect(id.value).toBe('field-fallback-4fzzzxjy');

    mathRandom.mockRestore();
  });

  it('returns the raw Vue id when the prefix is intentionally empty', () => {
    const Harness = defineComponent({
      setup() {
        const id = useId('');
        return { id };
      },
      template: '<div :data-id="id" />',
    });

    const wrapper = mount(Harness);

    expect(wrapper.attributes('data-id')).not.toMatch(/^ui-/);
  });
});
