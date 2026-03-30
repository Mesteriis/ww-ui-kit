import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import UiMenu from './UiMenu.vue';
import UiSteps from './UiSteps.vue';

describe('menu and steps', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('supports grouped and horizontal menu items, keyboard navigation, and selection updates', async () => {
    const wrapper = mount(UiMenu, {
      props: {
        items: [
          { label: 'Overview', value: 'overview', disabled: true },
          { label: 'Activity', value: 'activity', icon: '•' },
          { type: 'divider' },
          {
            type: 'group',
            label: 'Deploy',
            items: [
              { label: 'Bravo', value: 'bravo', icon: '+' },
              { label: 'Charlie', value: 'charlie', href: '#charlie' },
            ],
          },
        ],
        defaultSelectedKeys: ['overview'],
        mode: 'horizontal',
      },
    });

    const menu = wrapper.get('[role="menu"]');
    expect(wrapper.get('.ui-menu').attributes('data-mode')).toBe('horizontal');
    expect(wrapper.text()).toContain('Activity');
    expect(wrapper.find('[role="separator"]').exists()).toBe(true);
    expect(wrapper.find('[role="group"]').attributes('aria-label')).toBe('Deploy');
    expect(wrapper.find('a[href="#charlie"]').exists()).toBe(true);
    expect(wrapper.find('.ui-menu__icon').text()).toBe('•');
    expect(wrapper.findAll('.ui-menu__icon').some((icon) => icon.text() === '+')).toBe(true);

    await wrapper.get('button:not([disabled])').trigger('focus');
    await wrapper.get('button:not([disabled])').trigger('mouseenter');
    await wrapper.get('button:not([disabled])').trigger('click');
    expect(wrapper.emitted('update:selectedKeys')?.at(-1)).toEqual([['item-1']]);

    await menu.trigger('keydown', { key: 'ArrowRight' });
    await menu.trigger('keydown', { key: 'Tab' });
    await menu.trigger('keydown', { key: 'c' });
    await menu.trigger('keydown', { key: 'z' });
    vi.advanceTimersByTime(500);
    await menu.trigger('keydown', { key: ' ' });

    expect(wrapper.emitted('update:selectedKeys')?.at(-1)).toEqual([['item-3-group-1']]);
    expect(wrapper.emitted('select')?.at(-1)?.[0]).toMatchObject({
      label: 'Charlie',
      value: 'charlie',
    });

    await wrapper.get('a[href="#charlie"]').trigger('mouseenter');
    await wrapper.get('a[href="#charlie"]').trigger('focus');
    await wrapper.get('a[href="#charlie"]').trigger('click');
    expect(wrapper.emitted('update:selectedKeys')?.at(-1)).toEqual([['item-3-group-1']]);

    await menu.trigger('keydown', { key: 'z' });
    await wrapper.get('button[disabled]').trigger('mouseenter');
    await menu.trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('update:selectedKeys')?.at(-1)).toEqual([['item-3-group-1']]);
    wrapper.unmount();

    const fallbackMenu = mount(UiMenu, {
      props: {
        items: [
          { key: 'alpha', label: 'Alpha' },
          { key: 'disabled-link', label: 'Disabled link', href: '#disabled', disabled: true },
        ],
        defaultSelectedKeys: ['alpha'],
      },
    });

    expect(fallbackMenu.get('button').attributes('tabindex')).toBe('0');
    expect(fallbackMenu.get('a[href="#disabled"]').attributes('tabindex')).toBe('-1');
    await fallbackMenu.get('a[href="#disabled"]').trigger('mouseenter');
    expect(fallbackMenu.get('button').attributes('tabindex')).toBe('0');
    await fallbackMenu.setProps({
      items: [
        { key: 'alpha', label: 'Alpha' },
        { key: 'disabled-link', label: 'Disabled link', href: '#disabled', disabled: true },
        { key: 'beta', label: 'Beta' },
      ],
    });
    await fallbackMenu.get('a[href="#disabled"]').trigger('click');
    expect(fallbackMenu.emitted('select')).toBeUndefined();

    const selectedMenu = mount(UiMenu, {
      props: {
        items: [
          { key: 'alpha', label: 'Alpha' },
          { key: 'beta', label: 'Beta' },
        ],
        defaultSelectedKeys: ['beta'],
      },
    });

    expect(selectedMenu.findAll('button')[0]?.attributes('tabindex')).toBe('-1');
    expect(selectedMenu.findAll('button')[1]?.attributes('tabindex')).toBe('0');

    const currentMenu = mount(UiMenu, {
      props: {
        items: [
          { key: 'alpha', label: 'Alpha' },
          { key: 'beta', label: 'Beta' },
        ],
      },
    });

    await currentMenu.findAll('button')[0]?.trigger('focus');
    await currentMenu.setProps({
      items: [
        { key: 'alpha', label: 'Alpha' },
        { key: 'beta', label: 'Beta' },
        { key: 'gamma', label: 'Gamma' },
      ],
    });
    expect(currentMenu.findAll('button')[0]?.attributes('tabindex')).toBe('0');

    const disabledOnlyMenu = mount(UiMenu, {
      props: {
        items: [{ key: 'disabled', label: 'Disabled', disabled: true }],
      },
    });

    expect(disabledOnlyMenu.get('button[disabled]').attributes('tabindex')).toBe('-1');

    const selectedFallbackMenu = mount(UiMenu, {
      props: {
        items: [
          { key: 'alpha', label: 'Alpha' },
          { key: 'beta', label: 'Beta' },
        ],
      },
    });

    await selectedFallbackMenu.findAll('button')[1]?.trigger('click');
    await selectedFallbackMenu.findAll('button')[0]?.trigger('mouseenter');
    await selectedFallbackMenu.setProps({
      items: [
        { key: 'gamma', label: 'Gamma' },
        { key: 'beta', label: 'Beta' },
      ],
    });
    expect(selectedFallbackMenu.findAll('button')[1]?.attributes('tabindex')).toBe('0');

    const slottedMenu = mount(
      {
        components: { UiMenu },
        data: () => ({
          items: [{ key: 'alpha', label: 'Alpha', icon: '•' }],
        }),
        template: `
          <UiMenu :items="items">
            <template #item="{ item, selected }">
              <span class="custom-item">{{ item.label }}:{{ selected ? 'selected' : 'idle' }}</span>
            </template>
          </UiMenu>
        `,
      },
      {
        global: {
          components: { UiMenu },
        },
      }
    );

    expect(slottedMenu.find('.ui-menu__label').exists()).toBe(false);
    expect(slottedMenu.find('.custom-item').text()).toContain('Alpha');
    expect(slottedMenu.find('.ui-menu__icon').text()).toBe('•');
  });

  it('renders clickable and passive steps with current semantics and explicit statuses', async () => {
    const wrapper = mount(UiSteps, {
      props: {
        items: [
          { title: 'Draft' },
          { title: 'Review', description: 'Current step' },
          { title: 'Ship', disabled: true },
        ],
        modelValue: 1,
        clickable: true,
        linear: true,
        orientation: 'vertical',
      },
    });

    expect(wrapper.get('[aria-current="step"]').text()).toContain('Review');
    expect(wrapper.get('.ui-steps').attributes('data-orientation')).toBe('vertical');

    const buttons = wrapper.findAll('button');
    await buttons[0]?.trigger('click');
    expect(wrapper.emitted('update:modelValue')).toEqual([[0]]);
    expect(buttons[2]?.attributes('disabled')).toBeDefined();

    const passive = mount(UiSteps, {
      props: {
        items: [
          { title: 'Plan', status: 'error', icon: '!' },
          { title: 'Build' },
          { title: 'Ship', description: 'Ready to release' },
        ],
        defaultStep: 4,
      },
    });

    expect(passive.find('button').exists()).toBe(false);
    expect(passive.get('[aria-current="step"]').text()).toContain('Ship');
    expect(passive.find('.ui-steps__item--error').text()).toContain('!');
    expect(passive.text()).toContain('Ready to release');
  });
});
