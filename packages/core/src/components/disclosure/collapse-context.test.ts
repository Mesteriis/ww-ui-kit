import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import { createCollapseContext } from './collapse-context';

describe('collapse context', () => {
  it('normalizes accordion values and emits canonical update payloads', () => {
    const accordionUpdates: Array<string | string[]> = [];

    const wrapper = mount(
      defineComponent({
        setup(_, { expose }) {
          const collapse = createCollapseContext(
            {
              accordion: true,
              bordered: false,
              defaultValue: ['first', ''],
              ghost: true,
              iconPosition: 'end',
              modelValue: 'first',
            },
            (_event, value) => {
              accordionUpdates.push(value);
            }
          );

          expose({
            collapse,
          });

          return () => h('div');
        },
      })
    );

    const vm = wrapper.vm as unknown as {
      collapse: ReturnType<typeof createCollapseContext>;
    };

    const first = document.createElement('button');
    const second = document.createElement('button');

    vm.collapse.registerPanel(
      'first',
      () => first,
      () => false
    );
    vm.collapse.registerPanel(
      'second',
      () => second,
      () => true
    );

    expect(vm.collapse.accordion.value).toBe(true);
    expect(vm.collapse.bordered.value).toBe(false);
    expect(vm.collapse.ghost.value).toBe(true);
    expect(vm.collapse.iconPosition.value).toBe('end');
    expect(vm.collapse.currentHeader.value).toBe('first');
    expect(vm.collapse.isOpen('first')).toBe(true);

    vm.collapse.toggle('first');
    vm.collapse.toggle('second');

    expect(accordionUpdates).toEqual(['', 'second']);
  });

  it('supports multi-open payloads and manual header tracking', () => {
    const updates: Array<string | string[]> = [];

    const wrapper = mount(
      defineComponent({
        setup(_, { expose }) {
          const collapse = createCollapseContext(
            {
              accordion: false,
              bordered: true,
              defaultValue: 'alpha',
              ghost: false,
              iconPosition: 'start',
              modelValue: undefined,
            },
            (_event, value) => {
              updates.push(value);
            }
          );

          expose({
            collapse,
          });

          return () => h('div');
        },
      })
    );

    const vm = wrapper.vm as unknown as {
      collapse: ReturnType<typeof createCollapseContext>;
    };

    vm.collapse.setCurrentHeader('beta');
    vm.collapse.toggle('beta');
    vm.collapse.toggle('alpha');

    expect(vm.collapse.currentHeader.value).toBe('alpha');
    expect(updates).toEqual([['beta'], ['alpha']]);
  });

  it('assigns the first available roving header when nothing is selected', () => {
    const wrapper = mount(
      defineComponent({
        setup(_, { expose }) {
          const collapse = createCollapseContext(
            {
              accordion: false,
              bordered: true,
              defaultValue: undefined,
              ghost: false,
              iconPosition: 'start',
              modelValue: undefined,
            },
            () => undefined
          );

          expose({
            collapse,
          });

          return () => h('div');
        },
      })
    );

    const vm = wrapper.vm as unknown as {
      collapse: ReturnType<typeof createCollapseContext>;
    };

    vm.collapse.registerPanel(
      'first',
      () => document.createElement('button'),
      () => false
    );
    expect(vm.collapse.currentHeader.value).toBe('first');
  });

  it('removes an open panel in multi mode and skips disabled panels when picking the first tab stop', () => {
    const updates: Array<string | string[]> = [];

    const wrapper = mount(
      defineComponent({
        setup(_, { expose }) {
          const collapse = createCollapseContext(
            {
              accordion: false,
              bordered: true,
              defaultValue: ['alpha'],
              ghost: false,
              iconPosition: 'start',
              modelValue: ['alpha'],
            },
            (_event, value) => {
              updates.push(value);
            }
          );

          expose({
            collapse,
          });

          return () => h('div');
        },
      })
    );

    const vm = wrapper.vm as unknown as {
      collapse: ReturnType<typeof createCollapseContext>;
    };

    vm.collapse.registerPanel(
      'disabled',
      () => document.createElement('button'),
      () => true
    );
    vm.collapse.registerPanel(
      'alpha',
      () => document.createElement('button'),
      () => false
    );
    expect(vm.collapse.isOpen('alpha')).toBe(true);
    vm.collapse.toggle('alpha');

    expect(updates).toEqual([[]]);
    expect(vm.collapse.currentHeader.value).toBe('alpha');
  });
});
