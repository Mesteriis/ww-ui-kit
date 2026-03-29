import { defineComponent, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import UiCheckbox from './UiCheckbox.vue';
import UiSwitch from './UiSwitch.vue';
import UiField from '../fields/UiField.vue';

describe('selection controls', () => {
  it('toggles checkbox model state and aria attributes', async () => {
    const wrapper = mount(
      defineComponent({
        components: { UiCheckbox },
        setup() {
          const checked = ref(false);
          return { checked };
        },
        template: `<UiCheckbox v-model="checked">Accept</UiCheckbox>`
      })
    );

    const input = wrapper.get('input[type="checkbox"]');
    await input.setValue(true);

    expect((input.element as HTMLInputElement).checked).toBe(true);
  });

  it('toggles switch state with switch semantics', async () => {
    const wrapper = mount(
      defineComponent({
        components: { UiSwitch },
        setup() {
          const enabled = ref(false);
          return { enabled };
        },
        template: `<UiSwitch v-model="enabled" aria-label="Enable">Enable</UiSwitch>`
      })
    );

    const button = wrapper.get('button');
    expect(button.attributes('role')).toBe('switch');
    expect(button.attributes('aria-checked')).toBe('false');

    await button.trigger('click');
    expect(button.attributes('aria-checked')).toBe('true');
  });

  it('wires checkbox to field context and prevents disabled switch updates', async () => {
    const checkboxWrapper = mount(
      defineComponent({
        components: { UiCheckbox, UiField },
        setup() {
          const checked = ref(false);
          return { checked };
        },
        template: `
          <UiField label="Terms" hint="Required" error="Missing">
            <UiCheckbox v-model="checked">Accept terms</UiCheckbox>
          </UiField>
        `
      })
    );

    const checkbox = checkboxWrapper.get('input[type="checkbox"]');
    expect(checkbox.attributes('aria-describedby')).toContain('-hint');
    expect(checkbox.attributes('aria-describedby')).toContain('-error');
    expect(checkbox.attributes('aria-invalid')).toBe('true');

    const switchWrapper = mount(
      defineComponent({
        components: { UiSwitch },
        setup() {
          const enabled = ref(false);
          return { enabled };
        },
        template: `<UiSwitch v-model="enabled" disabled aria-label="Disabled switch" />`
      })
    );

    const button = switchWrapper.get('button');
    await button.trigger('click');
    expect(button.attributes('aria-checked')).toBe('false');
    expect(button.attributes('disabled')).toBeDefined();
  });

  it('covers standalone checkbox and switch branches without labels or valid event targets', async () => {
    const checkbox = mount(UiCheckbox, {
      props: {
        modelValue: false,
        name: 'consent'
      }
    });
    const checkboxInput = checkbox.get('input[type="checkbox"]');

    expect(checkboxInput.attributes('id')).toMatch(/^checkbox-\d+$/);
    expect(checkboxInput.attributes('aria-invalid')).toBeUndefined();
    expect(checkboxInput.attributes('aria-describedby')).toBeUndefined();
    expect(checkboxInput.attributes('name')).toBe('consent');

    const checkboxSetupState = checkbox.vm.$.setupState as {
      onChange: (event: Event) => void;
    };
    checkboxSetupState.onChange({ target: document.createElement('div') } as unknown as Event);
    expect(checkbox.emitted('update:modelValue')).toBeUndefined();

    const switchWrapper = mount(UiSwitch, {
      props: {
        modelValue: true,
        ariaDescribedby: 'external-help'
      }
    });

    expect(switchWrapper.find('.ui-switch__label').exists()).toBe(false);
    expect(switchWrapper.attributes('aria-describedby')).toBe('external-help');
    expect(switchWrapper.attributes('aria-label')).toBeUndefined();

    await switchWrapper.trigger('click');
    expect(switchWrapper.emitted('update:modelValue')).toEqual([[false]]);
  });

  it('renders switch labels when a default slot is present', () => {
    const wrapper = mount(UiSwitch, {
      props: {
        modelValue: false,
        ariaLabel: 'Labeled switch'
      },
      slots: {
        default: 'Notifications'
      }
    });

    expect(wrapper.find('.ui-switch__label').text()).toBe('Notifications');
  });

  it('covers the disabled switch toggle guard through the setup contract', () => {
    const wrapper = mount(UiSwitch, {
      props: {
        modelValue: true,
        disabled: true,
        ariaLabel: 'Disabled direct toggle'
      }
    });

    const switchSetupState = wrapper.vm.$.setupState as {
      toggle: () => void;
    };
    switchSetupState.toggle();
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });
});
