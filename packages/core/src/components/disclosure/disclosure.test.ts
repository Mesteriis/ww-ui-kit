import { defineComponent, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import UiCollapse from './UiCollapse.vue';
import UiCollapsePanel from './UiCollapsePanel.vue';

describe('collapse components', () => {
  it('supports accordion toggling, arrow navigation, and region semantics', async () => {
    const wrapper = mount(
      defineComponent({
        components: { UiCollapse, UiCollapsePanel },
        setup() {
          const value = ref('first');
          return { value };
        },
        template: `
          <UiCollapse v-model="value" accordion>
            <UiCollapsePanel value="first" title="First">First body</UiCollapsePanel>
            <UiCollapsePanel value="second" title="Second">Second body</UiCollapsePanel>
            <UiCollapsePanel value="third" title="Third" disabled>Third body</UiCollapsePanel>
          </UiCollapse>
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

    const headers = wrapper.findAll('.ui-collapse__header');
    const [first, second, third] = headers;
    if (!first || !second || !third) {
      throw new Error('Expected collapse headers.');
    }

    expect(first.attributes('aria-expanded')).toBe('true');
    expect(third.attributes('disabled')).toBeDefined();

    await first.trigger('focus');
    await first.trigger('keydown', { key: 'ArrowDown' });
    await nextTick();
    expect(document.activeElement).toBe(second.element);

    await second.trigger('keydown', { key: 'Enter' });
    await nextTick();
    await nextTick();
    expect(second.attributes('aria-expanded')).toBe('true');
    expect(first.attributes('aria-expanded')).toBe('false');
    expect(
      wrapper
        .findAll('[role="region"]')
        .some((region) => region.attributes('aria-labelledby') === second.attributes('id'))
    ).toBe(true);
  });

  it('supports multiple open panels and icon position styling', async () => {
    const wrapper = mount(
      defineComponent({
        components: { UiCollapse, UiCollapsePanel },
        setup() {
          const value = ref<string[]>(['one']);
          return { value };
        },
        template: `
          <UiCollapse v-model="value" :accordion="false" icon-position="end">
            <UiCollapsePanel value="one" title="One">Panel one</UiCollapsePanel>
            <UiCollapsePanel value="two" title="Two">Panel two</UiCollapsePanel>
          </UiCollapse>
        `,
      }),
      {
        global: {
          stubs: {
            transition: false,
          },
        },
      }
    );

    const headers = wrapper.findAll('.ui-collapse__header');
    const [one, two] = headers;
    if (!one || !two) {
      throw new Error('Expected headers.');
    }

    expect(one.classes()).toContain('ui-collapse__header--end');
    await two.trigger('click');
    await nextTick();

    expect(wrapper.findAll('[role="region"]')).toHaveLength(2);
  });

  it('covers standalone panel errors, disabled toggles, and motion fallbacks', async () => {
    expect(() => mount(UiCollapsePanel, { props: { value: 'orphan' } })).toThrow(
      'UiCollapsePanel must be used inside UiCollapse.'
    );

    const wrapper = mount(
      defineComponent({
        components: { UiCollapse, UiCollapsePanel },
        setup() {
          const value = ref<string[]>([]);
          return { value };
        },
        template: `
          <UiCollapse v-model="value" :accordion="false" bordered="false" ghost icon-position="end">
            <UiCollapsePanel value="locked" title="Locked" disabled>Locked body</UiCollapsePanel>
          </UiCollapse>
        `,
      }),
      {
        global: {
          stubs: {
            transition: false,
          },
        },
      }
    );

    const header = wrapper.get('.ui-collapse__header');
    await header.trigger('click');
    expect(wrapper.find('[role="region"]').exists()).toBe(false);

    const setupState = wrapper.findComponent(UiCollapsePanel).vm.$.setupState as {
      onBeforeEnter: (element: Element) => void;
      onBeforeLeave: (element: Element) => void;
      onAfterMotion: (element: Element) => void;
      onEnter: (element: Element, done: () => void) => void;
      onLeave: (element: Element, done: () => void) => void;
      toggle: () => void;
    };
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const enterDone = vi.fn();
    const leaveDone = vi.fn();

    setupState.toggle();
    setupState.onBeforeEnter(svgElement);
    setupState.onBeforeLeave(svgElement);
    setupState.onEnter(svgElement, enterDone);
    setupState.onLeave(svgElement, leaveDone);
    setupState.onAfterMotion(svgElement);

    expect(enterDone).toHaveBeenCalledTimes(1);
    expect(leaveDone).toHaveBeenCalledTimes(1);
  });
});
