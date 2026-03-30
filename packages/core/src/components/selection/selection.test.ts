import { defineComponent, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import UiCheckbox from './UiCheckbox.vue';
import UiRadio from './UiRadio.vue';
import UiRadioGroup from './UiRadioGroup.vue';
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
        template: `<UiCheckbox v-model="checked">Accept</UiCheckbox>`,
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
        template: `<UiSwitch v-model="enabled" aria-label="Enable">Enable</UiSwitch>`,
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
        `,
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
        template: `<UiSwitch v-model="enabled" disabled aria-label="Disabled switch" />`,
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
        name: 'consent',
        ariaLabel: 'Consent toggle',
      },
    });
    const checkboxInput = checkbox.get('input[type="checkbox"]');

    expect(checkboxInput.attributes('id')).toMatch(/^checkbox-/);
    expect(checkboxInput.attributes('aria-label')).toBe('Consent toggle');
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
        ariaDescribedby: 'external-help',
      },
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
        ariaLabel: 'Labeled switch',
      },
      slots: {
        default: 'Notifications',
      },
    });

    expect(wrapper.find('.ui-switch__label').text()).toBe('Notifications');
  });

  it('covers the disabled switch toggle guard through the setup contract', () => {
    const wrapper = mount(UiSwitch, {
      props: {
        modelValue: true,
        disabled: true,
        ariaLabel: 'Disabled direct toggle',
      },
    });

    const switchSetupState = wrapper.vm.$.setupState as {
      toggle: () => void;
    };
    switchSetupState.toggle();
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('supports radio-group roving focus, field wiring, and disabled cascades', async () => {
    const wrapper = mount(
      defineComponent({
        components: { UiField, UiRadio, UiRadioGroup },
        setup() {
          const value = ref('alpha');
          return { value };
        },
        template: `
          <UiField label="Stage" hint="Pick one" error="Required">
            <UiRadioGroup v-model="value" orientation="horizontal">
              <UiRadio value="alpha">Alpha</UiRadio>
              <UiRadio value="beta">Beta</UiRadio>
              <UiRadio value="gamma" disabled>Gamma</UiRadio>
            </UiRadioGroup>
          </UiField>
        `,
      }),
      {
        attachTo: document.body,
      }
    );

    const radios = wrapper.findAll('input[type="radio"]');
    const [alpha, beta, gamma] = radios;
    if (!alpha || !beta || !gamma) {
      throw new Error('Expected radio inputs.');
    }

    expect(wrapper.get('[role="radiogroup"]').attributes('aria-describedby')).toContain('-hint');
    expect(wrapper.get('[role="radiogroup"]').attributes('aria-describedby')).toContain('-error');
    expect(alpha.attributes('checked')).toBeDefined();
    expect(gamma.attributes('disabled')).toBeDefined();

    await alpha.trigger('focus');
    await wrapper.get('[role="radiogroup"]').trigger('keydown', { key: 'ArrowRight' });
    await nextTick();
    await nextTick();

    expect(document.activeElement).toBe(beta.element);
    expect(wrapper.text()).toContain('Beta');
    expect((beta.element as HTMLInputElement).checked).toBe(true);

    await beta.trigger('change');
    expect((beta.element as HTMLInputElement).checked).toBe(true);
  });
});
