import { computed, defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import { useControllable } from './useControllable';

const Harness = defineComponent({
  props: {
    value: {
      type: String,
      required: false,
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const state = useControllable({
      defaultValue: 'initial',
      onChange: (value) => emit('change', value),
      value: computed(() => props.value),
    });

    return { state };
  },
  template: `<button @click="state.setValue('next')">{{ state.currentValue }}</button>`,
});

describe('useControllable', () => {
  it('updates internal state when uncontrolled', async () => {
    const wrapper = mount(Harness);

    expect(wrapper.text()).toBe('initial');

    await wrapper.trigger('click');

    expect(wrapper.text()).toBe('next');
    expect(wrapper.emitted('change')?.[0]).toEqual(['next']);
  });

  it('keeps external state when controlled', async () => {
    const wrapper = mount(Harness, {
      props: {
        value: 'controlled',
      },
    });

    await wrapper.trigger('click');

    expect(wrapper.text()).toBe('controlled');
    expect(wrapper.emitted('change')?.[0]).toEqual(['next']);
  });
});
