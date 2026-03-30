import { defineComponent, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import UiField from './UiField.vue';
import UiAutocomplete from './UiAutocomplete.vue';
import UiNumberInput from './UiNumberInput.vue';
import UiSelect from './UiSelect.vue';

async function flushFloating() {
  await nextTick();
  await nextTick();
}

function findFloatingOption(text: string) {
  return Array.from(document.querySelectorAll<HTMLButtonElement>('button')).find((option) =>
    option.textContent?.includes(text)
  );
}

function mockRect(element: Element, width: number) {
  Object.defineProperty(element, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      width,
      height: 40,
      top: 0,
      left: 0,
      right: width,
      bottom: 40,
      x: 0,
      y: 0,
      toJSON() {
        return this;
      },
    }),
  });
}

describe('rich field controls', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('covers number input field wiring, keyboard flow, and blur behavior', async () => {
    const host = mount(
      defineComponent({
        components: { UiField, UiNumberInput },
        setup() {
          const value = ref<number | null>(1.5);
          return { value };
        },
        template: `
          <UiField label="Budget" hint="Numbers stay clamped">
            <UiNumberInput
              v-model="value"
              name="budget"
              placeholder="0.0"
              :min="0"
              :max="5"
              :step="0.5"
              :precision="1"
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
    expect(input.attributes('aria-describedby')).toContain('-hint');
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('inputmode')).toBe('numeric');
    expect(input.attributes('name')).toBe('budget');
    expect(input.attributes('placeholder')).toBe('0.0');

    await input.trigger('focus');
    await input.trigger('keydown', { key: 'ArrowUp' });
    expect((host.vm as { value: number | null }).value).toBe(2);

    await input.trigger('keydown', { key: 'ArrowDown' });
    expect((host.vm as { value: number | null }).value).toBe(1.5);

    await input.trigger('keydown', { key: 'PageUp' });
    expect((host.vm as { value: number | null }).value).toBe(5);

    await input.trigger('keydown', { key: 'PageDown' });
    expect((host.vm as { value: number | null }).value).toBe(0);

    await input.trigger('keydown', { key: 'Home' });
    expect((host.vm as { value: number | null }).value).toBe(0);

    await input.trigger('keydown', { key: 'End' });
    expect((host.vm as { value: number | null }).value).toBe(5);

    const [decrementButton, incrementButton] = host.findAll('.ui-number-input__button');
    await decrementButton?.trigger('click');
    expect((host.vm as { value: number | null }).value).toBe(4.5);

    await incrementButton?.trigger('click');
    expect((host.vm as { value: number | null }).value).toBe(5);

    await input.setValue('3.4');
    await input.trigger('keydown', { key: 'Enter' });
    expect((host.vm as { value: number | null }).value).toBe(3.4);

    await input.setValue('7.9');
    await input.trigger('blur');
    expect((host.vm as { value: number | null }).value).toBe(5);

    const focused = mount(UiNumberInput, {
      props: {
        modelValue: 1,
        step: 0.5,
        precision: 1,
      },
    });

    const focusedInput = focused.get('input');
    await focusedInput.trigger('focus');
    await focusedInput.setValue('1.7');
    await focused.setProps({ modelValue: 4 });
    expect((focusedInput.element as HTMLInputElement).value).toBe('1.7');
    await focusedInput.trigger('blur');
    await focused.setProps({ modelValue: 4.5 });
    expect((focusedInput.element as HTMLInputElement).value).toBe('4.5');

    const fallback = mount(UiNumberInput, {
      props: {
        modelValue: null,
        min: 2,
      },
    });
    await fallback.get('input').setValue('oops');
    await fallback.get('input').trigger('blur');
    expect(fallback.emitted('update:modelValue')?.at(-1)).toEqual([2]);

    const allowEmpty = mount(UiNumberInput, {
      props: {
        modelValue: 1,
        allowEmpty: true,
      },
    });
    await allowEmpty.get('input').setValue('');
    await allowEmpty.get('input').trigger('blur');
    expect(allowEmpty.emitted('update:modelValue')?.at(-1)).toEqual([null]);

    const unclamped = mount(UiNumberInput, {
      props: {
        modelValue: 1.25,
        max: 2,
        step: 0.25,
        clampOnBlur: false,
      },
    });
    await unclamped.get('input').setValue('9.75');
    await unclamped.get('input').trigger('blur');
    expect(unclamped.emitted('update:modelValue')?.at(-1)).toEqual([9.75]);

    const modelFallback = mount(UiNumberInput, {
      props: {
        modelValue: 3,
      },
    });
    await modelFallback.get('input').setValue('nope');
    await modelFallback.get('input').trigger('blur');
    expect(modelFallback.emitted('update:modelValue')?.at(-1)).toEqual([3]);
    await modelFallback.get('input').trigger('keydown', { key: 'Home' });
    await modelFallback.get('input').trigger('keydown', { key: 'End' });
    expect(modelFallback.emitted('update:modelValue')?.at(-1)).toEqual([3]);

    const zeroFallback = mount(UiNumberInput, {
      props: {
        modelValue: null,
      },
    });
    await zeroFallback.get('input').setValue('nope');
    await zeroFallback.get('input').trigger('blur');
    expect(zeroFallback.emitted('update:modelValue')?.at(-1)).toEqual([0]);

    const steppedFromEmpty = mount(UiNumberInput, {
      props: {
        modelValue: null,
        step: 2,
      },
    });
    await steppedFromEmpty.findAll('button')[1]?.trigger('click');
    expect(steppedFromEmpty.emitted('update:modelValue')?.at(-1)).toEqual([2]);

    const typedStep = mount(UiNumberInput, {
      props: {
        modelValue: 1,
      },
    });
    await typedStep.get('input').trigger('focus');
    await typedStep.get('input').setValue('3');
    await typedStep.findAll('button')[1]?.trigger('click');
    expect(typedStep.emitted('update:modelValue')?.at(-1)).toEqual([4]);

    const disabled = mount(UiNumberInput, {
      props: {
        modelValue: 1,
        disabled: true,
      },
    });
    await disabled.get('input').trigger('keydown', { key: 'ArrowUp' });
    expect(disabled.emitted('update:modelValue')).toBeUndefined();

    const readonly = mount(UiNumberInput, {
      props: {
        modelValue: 1,
        readonly: true,
      },
    });
    expect(readonly.findAll('button')[0]?.attributes('disabled')).toBeDefined();
    await readonly.findAll('button')[0]?.trigger('click');
    await readonly.get('input').trigger('keydown', { key: 'PageUp' });
    expect(readonly.emitted('update:modelValue')).toBeUndefined();
  });

  it('covers searchable select filtering, empty state, disabled options, and clearing', async () => {
    const host = mount(
      defineComponent({
        components: { UiField, UiSelect },
        setup() {
          const value = ref<string | number | null>('alpha');
          const options = [
            { label: 'Alpha', value: 'alpha', icon: 'A' },
            {
              type: 'group' as const,
              label: 'Deploy',
              options: [
                { label: 'Bravo', value: 'bravo' },
                { label: 'Charlie', value: 'charlie', disabled: true },
              ],
            },
          ];

          return { options, value };
        },
        template: `
          <UiField label="Environment" hint="Pick a target">
            <UiSelect
              v-model="value"
              searchable
              clearable
              invalid
              :options="options"
            >
              <template #empty="{ query }">No matching {{ query }}</template>
            </UiSelect>
          </UiField>
        `,
      }),
      {
        attachTo: document.body,
        global: {
          stubs: {
            transition: false,
          },
        },
      }
    );

    const select = host.findComponent(UiSelect);
    const input = host.get('.ui-rich-select__input');
    mockRect(host.get('.ui-rich-select__control').element, 240);
    expect(input.attributes('aria-labelledby')).toContain('-label');
    expect(input.attributes('aria-describedby')).toContain('-hint');
    expect(input.attributes('aria-invalid')).toBe('true');

    await input.trigger('focus');
    await flushFloating();
    expect(select.emitted('open')).toHaveLength(1);
    expect(document.querySelector('.ui-rich-select__group-label')?.textContent).toContain('Deploy');
    expect(document.querySelector('.ui-rich-select__option-icon')?.textContent).toContain('A');
    await host.get('.ui-rich-select__control').trigger('keydown', { key: 'x' });
    document.body.click();
    await flushFloating();
    await input.trigger('focus');
    await flushFloating();

    await input.setValue('zzz');
    await flushFloating();
    expect(document.querySelector('.ui-rich-select__dropdown')?.getAttribute('style')).toContain(
      'min-width'
    );
    expect(document.querySelector('.ui-rich-select__empty')?.textContent).toContain(
      'No matching zzz'
    );

    await input.setValue('cha');
    await flushFloating();
    const disabledOption = findFloatingOption('Charlie');
    disabledOption?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await nextTick();
    await input.trigger('keydown', { key: 'Enter' });
    expect((host.vm as { value: string | number | null }).value).toBe('alpha');

    await input.setValue('br');
    await flushFloating();
    findFloatingOption('Bravo')?.click();
    await flushFloating();
    expect((host.vm as { value: string | number | null }).value).toBe('bravo');
    expect(select.emitted('close')?.length).toBeGreaterThanOrEqual(1);
    expect((input.element as HTMLInputElement).value).toBe('Bravo');

    await input.trigger('focus');
    await flushFloating();
    expect((input.element as HTMLInputElement).value).toBe('');

    await host.get('.ui-rich-select__clear').trigger('click');
    expect((host.vm as { value: string | number | null }).value).toBeNull();

    const fieldInvalid = mount(
      defineComponent({
        components: { UiField, UiSelect },
        setup() {
          const value = ref<string | number | null>(null);
          return { value };
        },
        template: `
          <UiField label="Status" error="Required">
            <UiSelect v-model="value" :options="[{ label: 'Alpha', value: 'alpha' }]" />
          </UiField>
        `,
      })
    );

    expect(fieldInvalid.get('.ui-rich-select__control').attributes('aria-invalid')).toBe('true');
  });

  it('covers non-searchable and multiple select keyboard behavior and placeholders', async () => {
    const single = mount(
      defineComponent({
        components: { UiSelect },
        setup() {
          const value = ref<string | number | null>(null);
          const options = [
            { label: 'Alpha', value: 'alpha' },
            { label: 'Bravo', value: 'bravo', disabled: true },
            { label: 'Charlie', value: 'charlie' },
          ];

          return { options, value };
        },
        template: `<UiSelect v-model="value" aria-label="Plain select" :options="options" />`,
      }),
      {
        attachTo: document.body,
        global: {
          stubs: {
            transition: false,
          },
        },
      }
    );

    const control = single.get('.ui-rich-select__control');
    expect(control.attributes('role')).toBe('button');
    expect(control.attributes('aria-label')).toBe('Plain select');
    expect(control.text()).toContain('Select an option');

    await control.trigger('keydown', { key: 'Enter' });
    await flushFloating();
    await control.trigger('keydown', { key: 'ArrowUp' });
    await control.trigger('keydown', { key: 'ArrowDown' });
    await control.trigger('keydown', { key: 'ArrowUp' });
    await control.trigger('keydown', { key: 'Home' });
    expect(control.attributes('aria-activedescendant')).toContain('option-0');
    await control.trigger('keydown', { key: 'End' });
    expect(control.attributes('aria-activedescendant')).toContain('option-2');
    await control.trigger('keydown', { key: 'ArrowDown' });
    expect(control.attributes('aria-activedescendant')).toContain('option-2');
    await control.trigger('keydown', { key: 'x', ctrlKey: true });
    await control.trigger('keydown', { key: 'c' });
    vi.advanceTimersByTime(500);
    expect(control.attributes('aria-activedescendant')).toContain('option-2');
    await control.trigger('keydown', { key: 'z' });
    vi.advanceTimersByTime(500);
    expect(control.attributes('aria-activedescendant')).toContain('option-2');
    await control.trigger('keydown', { key: 'Enter' });
    expect((single.vm as { value: string | number | null }).value).toBe('charlie');

    await control.trigger('keydown', { key: 'Enter' });
    await flushFloating();
    await control.trigger('keydown', { key: 'Escape' });
    await flushFloating();
    expect(control.attributes('aria-expanded')).toBe('false');

    const multiple = mount(
      defineComponent({
        components: { UiSelect },
        setup() {
          const value = ref<Array<string | number>>(['alpha']);
          const options = [
            { label: 'Alpha', value: 'alpha' },
            { label: 'Bravo', value: 'bravo' },
          ];

          return { options, value };
        },
        template: `
          <UiSelect
            v-model="value"
            clearable
            multiple
            placeholder="Pick many"
            :options="options"
          />
        `,
      }),
      {
        attachTo: document.body,
        global: {
          stubs: {
            transition: false,
          },
        },
      }
    );

    await multiple.get('.ui-rich-select__control').trigger('click');
    await flushFloating();
    Array.from(document.querySelectorAll<HTMLElement>('.ui-rich-select__dropdown'))
      .at(-1)
      ?.querySelectorAll<HTMLButtonElement>('.ui-rich-select__option')
      .forEach((option) => {
        if (option.textContent?.includes('Bravo')) {
          option.click();
        }
      });
    await flushFloating();
    expect((multiple.vm as { value: Array<string | number> }).value).toEqual(['alpha', 'bravo']);
    Array.from(document.querySelectorAll<HTMLElement>('.ui-rich-select__dropdown'))
      .at(-1)
      ?.querySelectorAll<HTMLButtonElement>('.ui-rich-select__option')
      .forEach((option) => {
        if (option.textContent?.includes('Alpha')) {
          option.click();
        }
      });
    await flushFloating();
    expect((multiple.vm as { value: Array<string | number> }).value).toEqual(['bravo']);

    await multiple.get('.ui-rich-select__clear').trigger('click');
    expect((multiple.vm as { value: Array<string | number> }).value).toEqual([]);
    expect(multiple.text()).toContain('Pick many');

    const closableMulti = mount(
      defineComponent({
        components: { UiSelect },
        setup() {
          const value = ref<Array<string | number>>(['alpha', 'bravo']);
          const options = [
            { label: 'Alpha', value: 'alpha' },
            { label: 'Bravo', value: 'bravo' },
          ];

          return { options, value };
        },
        template: `<UiSelect v-model="value" multiple :options="options" />`,
      })
    );

    await closableMulti.get('.ui-tag__close').trigger('click');
    expect((closableMulti.vm as { value: Array<string | number> }).value).toEqual(['bravo']);

    const disabled = mount(UiSelect, {
      attachTo: document.body,
      props: {
        options: [{ label: 'Alpha', value: 'alpha' }],
        disabled: true,
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    await disabled.get('.ui-rich-select__control').trigger('click');
    await disabled.get('.ui-rich-select__control').trigger('keydown', { key: 'ArrowDown' });
    expect(disabled.emitted('open')).toBeUndefined();

    const defaultEmpty = mount(UiSelect, {
      attachTo: document.body,
      props: {
        searchable: true,
        options: [{ label: 'Alpha', value: 'alpha' }],
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    await defaultEmpty.get('.ui-rich-select__input').setValue('zzz');
    await flushFloating();
    await defaultEmpty.get('.ui-rich-select__input').trigger('keydown', { key: 'Home' });
    await defaultEmpty.get('.ui-rich-select__input').trigger('keydown', { key: 'End' });
    expect(document.querySelector('.ui-rich-select__empty')?.textContent).toContain(
      'No matching options.'
    );

    const searchableMultiple = mount(UiSelect, {
      attachTo: document.body,
      props: {
        multiple: true,
        searchable: true,
        options: [{ label: 'Alpha', value: 'alpha' }],
        placeholder: 'Search many',
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    expect(searchableMultiple.get('.ui-rich-select__input').attributes('placeholder')).toBe(
      'Search many'
    );

    const singleArrayValue = mount(UiSelect, {
      props: {
        modelValue: ['alpha', 'bravo'],
        options: [{ label: 'Alpha', value: 'alpha' }],
      },
    });

    expect(singleArrayValue.text()).toContain('Alpha');

    const emptyOptionsSelect = mount(UiSelect, {
      props: {
        options: [],
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });
    await emptyOptionsSelect.get('.ui-rich-select__control').trigger('keydown', { key: 'Enter' });
    await flushFloating();
    await emptyOptionsSelect.get('.ui-rich-select__control').trigger('keydown', { key: 'Home' });
    await emptyOptionsSelect.get('.ui-rich-select__control').trigger('keydown', { key: 'End' });

    const removableSingle = mount(
      defineComponent({
        components: { UiSelect },
        setup() {
          const value = ref<string | number | null>('alpha');
          return { value };
        },
        template: `
          <UiSelect v-model="value" :options="[{ label: 'Alpha', value: 'alpha' }]">
            <template #selected="{ selected, remove }">
              <button type="button" class="custom-remove" @click="remove(selected[0].value)">
                remove
              </button>
            </template>
          </UiSelect>
        `,
      })
    );

    await removableSingle.get('.custom-remove').trigger('click');
    expect((removableSingle.vm as { value: string | number | null }).value).toBeNull();
  });

  it('covers autocomplete filtering, keyboard flow, disabled items, and state messaging', async () => {
    const host = mount(
      defineComponent({
        components: { UiField, UiAutocomplete },
        setup() {
          const value = ref('');
          const items = [
            { label: 'Alpha', value: 'alpha' },
            { label: 'Bravo', value: 'bravo', description: 'Deploy lane' },
            { label: 'Charlie', value: 'charlie', disabled: true, description: 'Disabled lane' },
          ];

          return { items, value };
        },
        template: `
          <UiField label="Search" hint="Type to filter">
            <UiAutocomplete v-model="value" invalid :items="items" />
          </UiField>
        `,
      }),
      {
        attachTo: document.body,
        global: {
          stubs: {
            transition: false,
          },
        },
      }
    );

    const autocomplete = host.findComponent(UiAutocomplete);
    const input = host.get('input');
    mockRect(input.element, 260);
    expect(input.attributes('aria-labelledby')).toContain('-label');
    expect(input.attributes('aria-describedby')).toContain('-hint');
    expect(input.attributes('aria-invalid')).toBe('true');

    await input.trigger('focus');
    await flushFloating();
    expect(document.querySelector('.ui-autocomplete__dropdown')?.getAttribute('style')).toContain(
      'min-width'
    );
    expect(document.querySelector('.ui-autocomplete__option-description')?.textContent).toContain(
      'Deploy lane'
    );
    await input.trigger('keydown', { key: 'Escape' });
    await flushFloating();
    expect(input.attributes('aria-expanded')).toBe('false');
    await input.trigger('focus');
    await flushFloating();
    await input.trigger('keydown', { key: 'b', ctrlKey: true });
    document.body.click();
    await flushFloating();
    await input.trigger('focus');
    await flushFloating();
    await input.trigger('keydown', { key: 'ArrowUp' });
    expect(input.attributes('aria-activedescendant')).toContain('option-0');

    await input.trigger('keydown', { key: 'ArrowDown' });
    await input.trigger('keydown', { key: 'ArrowUp' });
    await input.trigger('keydown', { key: 'Home' });
    expect(input.attributes('aria-activedescendant')).toContain('option-0');
    await input.trigger('keydown', { key: 'End' });
    expect(input.attributes('aria-activedescendant')).toContain('option-1');
    await input.trigger('keydown', { key: 'ArrowDown' });
    expect(input.attributes('aria-activedescendant')).toContain('option-1');
    await input.trigger('keydown', { key: 'b' });
    vi.advanceTimersByTime(500);
    expect(input.attributes('aria-activedescendant')).toContain('option-1');
    await input.trigger('keydown', { key: 'z' });
    vi.advanceTimersByTime(500);
    expect(input.attributes('aria-activedescendant')).toContain('option-1');
    await input.trigger('keydown', { key: 'Enter' });
    expect((host.vm as { value: string }).value).toBe('bravo');
    expect(autocomplete.emitted('select')?.at(-1)?.[0]).toEqual({
      item: {
        label: 'Bravo',
        value: 'bravo',
        description: 'Deploy lane',
      },
      value: 'bravo',
    });

    await input.setValue('zzz');
    await flushFloating();
    expect(document.querySelector('.ui-autocomplete__state')?.textContent).toContain(
      'No suggestions'
    );
    const emptySelectCount = autocomplete.emitted('select')?.length ?? 0;
    await input.trigger('keydown', { key: 'Home' });
    await input.trigger('keydown', { key: 'End' });
    await input.trigger('keydown', { key: 'Enter' });
    expect(autocomplete.emitted('select')?.length ?? 0).toBe(emptySelectCount);

    await input.setValue('cha');
    await flushFloating();
    const disabledOption = Array.from(
      document.querySelectorAll<HTMLButtonElement>('.ui-autocomplete__option')
    ).find((option) => option.textContent?.includes('Charlie'));
    disabledOption?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await nextTick();
    const selectCount = autocomplete.emitted('select')?.length ?? 0;
    await input.trigger('keydown', { key: 'Enter' });
    expect(autocomplete.emitted('select')?.length ?? 0).toBe(selectCount);

    await input.setValue('al');
    await flushFloating();
    Array.from(document.querySelectorAll<HTMLButtonElement>('.ui-autocomplete__option'))
      .find((option) => option.textContent?.includes('Alpha'))
      ?.click();
    expect((host.vm as { value: string }).value).toBe('alpha');

    await input.trigger('keydown', { key: 'Escape' });
    await flushFloating();

    const loading = mount(UiAutocomplete, {
      attachTo: document.body,
      props: {
        modelValue: 'a',
        items: [],
        loading: true,
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    await loading.get('input').trigger('focus');
    await flushFloating();
    expect(document.querySelector('.ui-autocomplete__state')?.textContent).toContain('Loading');
    loading.unmount();
    host.unmount();
    await nextTick();

    const disabled = mount(UiAutocomplete, {
      attachTo: document.body,
      props: {
        modelValue: '',
        items: [{ label: 'Alpha' }],
        disabled: true,
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    await disabled.get('input').trigger('keydown', { key: 'ArrowDown' });
    expect(document.querySelector('.ui-autocomplete__dropdown')).toBeNull();

    const labelled = mount(UiAutocomplete, {
      props: {
        ariaLabel: 'Quick search',
        items: [{ label: 'Alpha' }],
      },
    });

    expect(labelled.get('input').attributes('aria-label')).toBe('Quick search');
    expect(labelled.get('input').attributes('aria-labelledby')).toBeUndefined();
  });
});
