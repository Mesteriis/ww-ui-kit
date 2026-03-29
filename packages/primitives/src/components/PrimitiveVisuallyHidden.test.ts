import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import PrimitiveVisuallyHidden from './PrimitiveVisuallyHidden.vue';

describe('PrimitiveVisuallyHidden', () => {
  it('renders hidden helper content with the canonical utility class', () => {
    const wrapper = mount(PrimitiveVisuallyHidden, {
      slots: {
        default: 'Hidden label',
      },
    });

    expect(wrapper.classes()).toContain('primitive-visually-hidden');
    expect(wrapper.text()).toBe('Hidden label');
  });
});
