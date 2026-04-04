import { defineComponent, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import UiField from './UiField.vue';
import UiRating from './UiRating.vue';

describe('UiRating', () => {
  it('wires field semantics, hidden input output, and keyboard selection', async () => {
    const wrapper = mount(
      defineComponent({
        components: { UiField, UiRating },
        setup() {
          const value = ref(4.5);
          return { value };
        },
        template: `
          <UiField label="Confidence" hint="Half-step rating">
            <UiRating v-model="value" name="confidence" allow-half allow-clear tone="brand" />
          </UiField>
        `,
      })
    );

    const group = wrapper.get('[role="radiogroup"]');
    expect(group.attributes('aria-labelledby')).toBe(wrapper.get('label').attributes('id'));
    expect(group.attributes('aria-describedby')).toContain('-hint');
    expect(wrapper.get('input[type="hidden"]').attributes('value')).toBe('4.5');

    await group.trigger('keydown', { key: 'End' });
    await nextTick();
    expect(wrapper.get('input[type="hidden"]').attributes('value')).toBe('5');

    await wrapper.get('button[aria-label="5 of 5"]').trigger('click');
    await nextTick();
    expect(wrapper.get('input[type="hidden"]').attributes('value')).toBe('0');
  });

  it('keeps readonly and disabled guards explicit', async () => {
    const readonly = mount(UiRating, {
      props: {
        modelValue: 3,
        readonly: true,
        invalid: true,
      },
    });

    expect(readonly.classes()).toContain('ui-rating--invalid');
    expect(readonly.attributes('aria-readonly')).toBe('true');
    await readonly.get('button[aria-label="1 of 5"]').trigger('click');
    expect(readonly.emitted('update:modelValue')).toBeUndefined();

    const disabled = mount(UiRating, {
      props: {
        disabled: true,
      },
    });

    expect(disabled.attributes('aria-disabled')).toBe('true');
    expect(disabled.get('button[aria-label="1 of 5"]').attributes('disabled')).toBeDefined();
  });
});
