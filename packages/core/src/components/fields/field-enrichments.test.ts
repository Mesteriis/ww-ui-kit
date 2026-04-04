import { defineComponent, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';

import UiField from './UiField.vue';
import UiInput from './UiInput.vue';
import UiInputGroup from './UiInputGroup.vue';
import UiInputOtp from './UiInputOtp.vue';
import UiInputPassword from './UiInputPassword.vue';
import UiInputTag from './UiInputTag.vue';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('field enrichment controls', () => {
  it('keeps input group structural and field-aware without owning a second field runtime', () => {
    const wrapper = mount(
      defineComponent({
        components: { UiField, UiInput, UiInputGroup },
        setup() {
          const value = ref('ww-ui-kit');
          return { value };
        },
        template: `
          <UiField label="Repository" hint="Uses the shared field label">
            <UiInputGroup>
              <template #prepend>https://</template>
              <UiInput v-model="value" placeholder="repository" />
              <template #append>.dev</template>
            </UiInputGroup>
          </UiField>
        `,
      })
    );

    const group = wrapper.get('.ui-input-group');
    expect(group.attributes('role')).toBe('group');
    expect(group.attributes('aria-labelledby')).toContain('-label');
    expect(group.text()).toContain('https://');
    expect(group.text()).toContain('.dev');
    expect(group.classes()).toContain('ui-input-group--block');
  });

  it('covers password visibility control, field wiring, and optional strength content', async () => {
    const host = mount(
      defineComponent({
        components: { UiField, UiInputPassword },
        setup() {
          const password = ref('Belovodye-42');
          const revealed = ref(false);
          const rules = [
            { label: 'At least 12 characters', met: true },
            { label: 'Contains a number', met: true },
          ];
          return { password, revealed, rules };
        },
        template: `
          <UiField label="Password" hint="Keep it governed">
            <UiInputPassword
              v-model="password"
              v-model:revealed="revealed"
              :strength="72"
              strength-text="Strong"
              :rules="rules"
              invalid
            />
          </UiField>
        `,
      }),
      {
        attachTo: document.body,
      }
    );

    const input = host.get('input');
    expect(input.attributes('type')).toBe('password');
    expect(input.attributes('aria-labelledby')).toContain('-label');
    expect(input.attributes('aria-describedby')).toContain('-hint');
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(host.text()).toContain('Strong');
    expect(host.text()).toContain('At least 12 characters');

    await host.get('.ui-input-password__toggle').trigger('click');
    expect((host.vm as { revealed: boolean }).revealed).toBe(true);
    expect(host.get('input').attributes('type')).toBe('text');

    const controlled = mount(UiInputPassword, {
      props: {
        modelValue: 'secret',
        revealed: true,
      },
    });
    expect(controlled.get('input').attributes('type')).toBe('text');
    await controlled.get('.ui-input-password__toggle').trigger('click');
    expect(controlled.emitted('update:revealed')?.at(-1)).toEqual([false]);
  });

  it('covers tag input addition, duplicate protection, hidden inputs, and paste splitting', async () => {
    const validateTag = (value: string) => value.length >= 4;
    const host = mount(
      defineComponent({
        components: { UiField, UiInputTag },
        setup() {
          const tags = ref<string[]>([]);
          return { tags, validateTag };
        },
        template: `
          <UiField label="Coverage tags" hint="Comma and paste both distribute values">
            <UiInputTag
              v-model="tags"
              name="coverage"
              :max-tags="3"
              :validate-tag="validateTag"
            />
          </UiField>
        `,
      }),
      {
        attachTo: document.body,
      }
    );

    const input = host.get('.ui-input-tag__input');
    expect(input.attributes('aria-describedby')).toContain('-hint');

    await input.setValue('tokens');
    await input.trigger('keydown', { key: 'Enter' });
    expect((host.vm as { tags: string[] }).tags).toEqual(['tokens']);

    await input.setValue('tokens');
    await input.trigger('keydown', { key: 'Enter' });
    expect(host.findComponent(UiInputTag).emitted('reject')?.at(-1)?.[0]).toMatchObject({
      reason: 'duplicate',
      value: 'tokens',
    });

    await input.trigger('paste', {
      clipboardData: {
        getData: () => 'themes,docs',
      },
    });
    expect((host.vm as { tags: string[] }).tags).toEqual(['tokens', 'themes', 'docs']);
    expect(host.findAll('input[type="hidden"]')).toHaveLength(3);

    await host.findAll('.ui-tag__close')[0]?.trigger('click');
    expect((host.vm as { tags: string[] }).tags).toEqual(['themes', 'docs']);

    await input.setValue('bad');
    await input.trigger('keydown', { key: 'Enter' });
    expect(host.findComponent(UiInputTag).emitted('reject')?.at(-1)?.[0]).toMatchObject({
      reason: 'invalid',
      value: 'bad',
    });
  });

  it('covers otp auto-advance, paste distribution, backspace flow, and hidden form sync', async () => {
    const host = mount(
      defineComponent({
        components: { UiField, UiInputOtp },
        setup() {
          const code = ref('');
          return { code };
        },
        template: `
          <UiField label="One-time code" hint="Use the emailed code">
            <UiInputOtp v-model="code" name="otp" :length="4" />
          </UiField>
        `,
      }),
      {
        attachTo: document.body,
      }
    );

    const inputs = host.findAll('.ui-input-otp__segment');
    await inputs[0]?.setValue('1');
    await nextTick();
    expect((host.vm as { code: string }).code).toBe('1');
    expect(document.activeElement).toBe(inputs[1]?.element);

    await inputs[1]?.trigger('paste', {
      clipboardData: {
        getData: () => '2345',
      },
    });
    await nextTick();
    expect((host.vm as { code: string }).code).toBe('1234');
    expect(host.get('input[type="hidden"]').attributes('value')).toBe('1234');

    await inputs[3]?.trigger('keydown', { key: 'Backspace' });
    await nextTick();
    expect((host.vm as { code: string }).code).toBe('123');

    await inputs[3]?.trigger('keydown', { key: 'Backspace' });
    await nextTick();
    expect((host.vm as { code: string }).code).toBe('12');
    expect(document.activeElement).toBe(inputs[2]?.element);

    const standalone = mount(UiInputOtp, {
      props: {
        modelValue: 'A1',
        length: 4,
        mode: 'alphanumeric',
        mask: true,
        ariaLabel: 'Verification code',
      },
      attachTo: document.body,
    });

    expect(standalone.findAll('.ui-input-otp__segment')[0]?.attributes('type')).toBe('password');
    expect(standalone.findAll('.ui-input-otp__segment')[0]?.attributes('inputmode')).toBe('text');
    await standalone.findAll('.ui-input-otp__segment')[1]?.trigger('keydown', { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(standalone.findAll('.ui-input-otp__segment')[0]?.element);
  });
});
