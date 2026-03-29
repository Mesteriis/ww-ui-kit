import { defineComponent, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import UiField from './UiField.vue';
import UiInput from './UiInput.vue';
import UiSelectSimple from './UiSelectSimple.vue';
import UiTextarea from './UiTextarea.vue';

describe('field controls', () => {
  it('wires label, hint, and error to input controls', async () => {
    const wrapper = mount(
      defineComponent({
        components: { UiField, UiInput },
        setup() {
          const value = ref('');
          return { value };
        },
        template: `
          <UiField label="Name" hint="Hint" error="Error">
            <UiInput v-model="value" />
          </UiField>
        `,
      })
    );

    const input = wrapper.get('input');
    expect(wrapper.get('label').attributes('for')).toBe(input.attributes('id'));
    expect(input.attributes('aria-describedby')).toContain('-hint');
    expect(input.attributes('aria-describedby')).toContain('-error');
    expect(input.attributes('aria-invalid')).toBe('true');

    await input.setValue('UIKit');
    expect((input.element as HTMLInputElement).value).toBe('UIKit');
  });

  it('mounts textarea and native select contracts', async () => {
    const wrapper = mount(
      defineComponent({
        components: { UiField, UiTextarea, UiSelectSimple },
        setup() {
          const text = ref('Notes');
          const selected = ref('one');
          const options = [
            { label: 'One', value: 'one' },
            { label: 'Two', value: 'two' },
          ];
          return { options, selected, text };
        },
        template: `
          <div>
            <UiField label="Description">
              <UiTextarea v-model="text" />
            </UiField>
            <UiField label="Option">
              <UiSelectSimple v-model="selected" :options="options" />
            </UiField>
          </div>
        `,
      })
    );

    expect(wrapper.find('textarea').exists()).toBe(true);
    await wrapper.find('select').setValue('two');
    expect((wrapper.find('select').element as HTMLSelectElement).value).toBe('two');
  });

  it('supports standalone input props and placeholder select state', async () => {
    const input = mount(UiInput, {
      props: {
        id: 'standalone-input',
        modelValue: 'search',
        placeholder: 'Search',
        readonly: true,
        disabled: true,
        invalid: true,
        ariaDescribedby: 'external-hint',
      },
    });

    expect(input.attributes('id')).toBe('standalone-input');
    expect(input.attributes('readonly')).toBeDefined();
    expect(input.attributes('disabled')).toBeDefined();
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('aria-describedby')).toBe('external-hint');

    const select = mount(UiSelectSimple, {
      props: {
        modelValue: '',
        ariaLabel: 'Standalone options',
        placeholder: 'Choose one',
        options: [
          { label: 'One', value: 'one' },
          { label: 'Two', value: 'two', disabled: true },
        ],
      },
    });

    const placeholder = select.get('option[value=""]');
    expect(placeholder.attributes('disabled')).toBeDefined();
    expect(select.get('select').attributes('aria-label')).toBe('Standalone options');

    await select.get('select').setValue('one');
    expect((select.get('select').element as HTMLSelectElement).value).toBe('one');
    expect(select.find('option[value="two"]').attributes('disabled')).toBeDefined();
  });

  it('covers standalone fallback ids, neutral aria state, and non-control input handlers', async () => {
    const input = mount(UiInput, {
      props: {
        modelValue: '',
        autocomplete: 'email',
        name: 'email',
      },
    });

    expect(input.attributes('id')).toMatch(/^input-/);
    expect(input.attributes('aria-invalid')).toBeUndefined();
    expect(input.attributes('aria-describedby')).toBeUndefined();
    expect(input.attributes('autocomplete')).toBe('email');
    expect(input.attributes('name')).toBe('email');

    const inputSetupState = input.vm.$.setupState as {
      onInput: (event: Event) => void;
    };
    inputSetupState.onInput({ target: document.createElement('div') } as unknown as Event);
    expect((input.element as HTMLInputElement).value).toBe('');

    const textarea = mount(UiTextarea, {
      props: {
        modelValue: '',
        name: 'notes',
      },
    });

    expect(textarea.attributes('id')).toMatch(/^textarea-/);
    expect(textarea.attributes('aria-invalid')).toBeUndefined();
    expect(textarea.attributes('aria-describedby')).toBeUndefined();
    expect(textarea.attributes('rows')).toBe('4');

    const textareaElement = textarea.get('textarea');
    await textareaElement.setValue('Updated notes');
    expect(textarea.emitted('update:modelValue')).toEqual([['Updated notes']]);

    const textareaSetupState = textarea.vm.$.setupState as {
      onInput: (event: Event) => void;
    };
    textareaSetupState.onInput({ target: document.createElement('div') } as unknown as Event);
    expect(textarea.emitted('update:modelValue')).toEqual([['Updated notes']]);
  });

  it('renders field/body-only paths and ignores non-select change targets', () => {
    const field = mount(UiField, {
      props: {
        label: 'Required field',
        required: true,
      },
      slots: {
        default: '<input id="raw-input" />',
      },
    });

    expect(field.find('label').exists()).toBe(true);
    expect(field.text()).toContain('*');
    expect(field.find('.ui-field__hint').exists()).toBe(false);
    expect(field.find('.ui-field__error').exists()).toBe(false);

    const select = mount(UiSelectSimple, {
      props: {
        modelValue: 'one',
        options: [{ label: 'One', value: 'one' }],
      },
    });

    const selectSetupState = select.vm.$.setupState as {
      onChange: (event: Event) => void;
    };
    selectSetupState.onChange({ target: document.createElement('div') } as unknown as Event);
    expect(select.emitted('update:modelValue')).toBeUndefined();
  });
});
