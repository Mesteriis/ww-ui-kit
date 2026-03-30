import { computed, defineComponent, h, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import { provideFieldContext } from '../fields/field-context';
import { createRadioGroupContext } from './radio-group-context';

describe('radio-group context', () => {
  it('assigns ids, tracks a default tab stop, and emits selected values', async () => {
    const updates: string[] = [];

    const wrapper = mount(
      defineComponent({
        props: {
          orientation: {
            type: String,
            required: true,
          },
          defaultValue: {
            type: String,
            required: false,
          },
        },
        setup(props, { expose }) {
          const radioGroup = createRadioGroupContext(
            {
              ariaDescribedby: undefined,
              defaultValue: props.defaultValue,
              disabled: false,
              id: undefined,
              invalid: false,
              modelValue: undefined,
              name: 'release-state',
              orientation: props.orientation as 'horizontal' | 'vertical',
              required: false,
            },
            (_event, value) => {
              updates.push(value);
            }
          );

          expose({
            radioGroup,
            updates,
          });

          return () => h('div');
        },
      }),
      {
        props: {
          orientation: 'horizontal',
        },
      }
    );

    const vm = wrapper.vm as unknown as {
      radioGroup: ReturnType<typeof createRadioGroupContext>;
      updates: string[];
    };
    const first = document.createElement('input');
    const second = document.createElement('input');

    const unregisterFirst = vm.radioGroup.context.registerRadio(
      'draft',
      () => first,
      () => false
    );
    const unregisterSecond = vm.radioGroup.context.registerRadio(
      'published',
      () => second,
      () => true
    );

    expect(vm.radioGroup.ensureRadioId('draft')).toMatch(/^radio-group-/);
    expect(vm.radioGroup.context.currentTabStop.value).toBe('draft');
    expect(vm.radioGroup.context.currentValue.value).toBe('');
    expect(vm.radioGroup.context.invalid.value).toBe(false);

    vm.radioGroup.context.select('draft');

    expect(vm.updates).toEqual(['draft']);
    expect(vm.radioGroup.context.isChecked('draft')).toBe(true);
    expect(vm.radioGroup.context.isDisabled(true)).toBe(true);

    unregisterFirst();
    unregisterSecond();
  });

  it('reuses the field input id for the first radio and skips disabled radios for the initial tab stop', () => {
    const Child = defineComponent({
      setup(_, { expose }) {
        const radioGroup = createRadioGroupContext(
          {
            ariaDescribedby: 'external-help',
            defaultValue: undefined,
            disabled: false,
            id: undefined,
            invalid: false,
            modelValue: undefined,
            name: 'deployment-state',
            orientation: 'vertical',
            required: true,
          },
          () => undefined
        );

        expose({
          radioGroup,
        });

        return () => h('div');
      },
    });

    const wrapper = mount(
      defineComponent({
        setup(_, { expose }) {
          const childRef = ref<{
            radioGroup: ReturnType<typeof createRadioGroupContext>;
          } | null>(null);

          provideFieldContext({
            describedBy: computed(() => 'field-hint'),
            inputId: computed(() => 'field-radio'),
            invalid: computed(() => false),
            labelId: computed(() => 'field-radio-label'),
          });

          expose({
            childRef,
          });

          return () => h(Child, { ref: childRef });
        },
      })
    );

    const vm = wrapper.vm as unknown as {
      childRef: {
        radioGroup: ReturnType<typeof createRadioGroupContext>;
      } | null;
    };

    if (!vm.childRef) {
      throw new Error('Expected child ref.');
    }

    vm.childRef.radioGroup.context.registerRadio(
      'disabled',
      () => document.createElement('input'),
      () => true
    );
    vm.childRef.radioGroup.context.registerRadio(
      'ready',
      () => document.createElement('input'),
      () => false
    );

    expect(vm.childRef.radioGroup.ensureRadioId('disabled')).toBe('field-radio');
    expect(vm.childRef.radioGroup.context.currentTabStop.value).toBe('ready');
    expect(vm.childRef.radioGroup.context.describedBy.value).toBe('external-help field-hint');
    expect(vm.childRef.radioGroup.context.required.value).toBe(true);
  });
});
