import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import UiSplitter from './UiSplitter.vue';

describe('splitter surface', () => {
  it('updates pane sizes from keyboard and pointer interactions', async () => {
    const wrapper = mount(UiSplitter, {
      attachTo: document.body,
      props: {
        modelValue: [50, 50],
      },
      slots: {
        first: '<div>Left</div>',
        second: '<div>Right</div>',
      },
    });

    const separator = wrapper.get('.ui-splitter__separator');

    await separator.trigger('keydown', { key: 'ArrowRight' });
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[55, 45]]);

    Object.defineProperty(wrapper.element, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        width: 400,
        height: 200,
        left: 0,
        top: 0,
      }),
    });

    separator.element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 240 }));
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 240 }));
    window.dispatchEvent(new PointerEvent('pointerup'));

    expect(wrapper.emitted('update:modelValue')?.some((entry) => entry[0][0] === 60)).toBe(true);
  });
});
