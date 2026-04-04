import { defineComponent, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import { UiInput } from '@ww/core';

import UiForm from './UiForm.vue';
import UiFormItem from './UiFormItem.vue';

describe('UiForm', () => {
  it('validates and submits the controlled model', async () => {
    const wrapper = mount(
      defineComponent({
        components: {
          UiForm,
          UiFormItem,
          UiInput,
        },
        setup() {
          return {
            rules: {
              title: [
                (value: unknown) => (String(value || '').trim() ? undefined : 'Title is required'),
              ],
            },
          };
        },
        template: `
          <UiForm :initial-values="{ title: '' }" :rules="rules">
            <UiFormItem name="title" label="Title">
              <template #default="{ value, setValue, handleBlur, controlProps }">
                <UiInput
                  v-bind="controlProps"
                  :model-value="String(value ?? '')"
                  @update:modelValue="setValue"
                  @blur="handleBlur"
                />
              </template>
            </UiFormItem>
            <button type="submit">Save</button>
          </UiForm>
        `,
      })
    );

    await wrapper.get('form').trigger('submit');
    await nextTick();
    expect(wrapper.text()).toContain('Title is required');

    await wrapper.get('input').setValue('Governed form');
    await wrapper.get('input').trigger('blur');
    await wrapper.get('form').trigger('submit');
    await nextTick();

    const form = wrapper.findComponent(UiForm);
    expect(form.emitted('submit')).toBeTruthy();
    expect(form.emitted('submit')?.at(-1)?.[0]).toEqual({
      values: {
        title: 'Governed form',
      },
    });
  });
});
