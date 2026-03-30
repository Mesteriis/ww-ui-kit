import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import UiAvatar from './UiAvatar.vue';
import UiAvatarGroup from './UiAvatarGroup.vue';
import UiProgress from './UiProgress.vue';
import UiTable from './UiTable.vue';

describe('data display surfaces', () => {
  it('renders avatar fallback paths, slot icons, and resets failed images when src changes', async () => {
    const imageAvatar = mount(UiAvatar, {
      props: {
        src: '/avatar.png',
        alt: 'Belovodye avatar',
      },
    });

    await imageAvatar.get('img').trigger('error');
    expect(imageAvatar.emitted('error')).toHaveLength(1);
    expect(imageAvatar.attributes('aria-label')).toBe('Belovodye avatar');
    await imageAvatar.setProps({ src: '/avatar-2.png' });
    expect(imageAvatar.get('img').attributes('src')).toBe('/avatar-2.png');

    const imageWithoutAlt = mount(UiAvatar, {
      props: {
        src: '/avatar-no-alt.png',
      },
    });
    expect(imageWithoutAlt.get('img').attributes('alt')).toBe('');

    const initialsAvatar = mount(UiAvatar, {
      props: {
        initials: 'bk',
        size: 40,
      },
    });
    expect(initialsAvatar.text()).toContain('BK');
    expect(initialsAvatar.attributes('style')).toContain('--ui-avatar-size: 40px');

    const iconAvatar = mount(UiAvatar, {
      props: {
        icon: '⚙',
        shape: 'square',
      },
    });
    expect(iconAvatar.text()).toContain('⚙');

    const slotAvatar = mount(UiAvatar, {
      slots: {
        icon: '★',
      },
    });
    expect(slotAvatar.text()).toContain('★');

    const defaultAvatar = mount(UiAvatar);
    expect(defaultAvatar.text()).toContain('◌');
  });

  it('renders avatar groups with synchronized size, surplus count, and non-overlap mode', () => {
    const wrapper = mount(UiAvatarGroup, {
      props: {
        items: [{ initials: 'AL' }, { initials: 'BR' }, { initials: 'CH' }],
        max: 2,
        size: 'lg',
      },
    });

    expect(wrapper.findAll('.ui-avatar')).toHaveLength(3);
    expect(wrapper.text()).toContain('+1');

    const fullGroup = mount(UiAvatarGroup, {
      props: {
        items: [{ initials: 'AL' }, {}],
        overlap: false,
      },
    });

    expect(fullGroup.classes()).not.toContain('ui-avatar-group--overlap');
    expect(fullGroup.findAll('.ui-avatar')).toHaveLength(2);
  });

  it('renders determinate and indeterminate progress contracts', () => {
    const linear = mount(UiProgress, {
      props: {
        ariaLabel: 'Release progress',
        value: 45,
        showValue: true,
      },
    });

    expect(linear.get('[role="progressbar"]').attributes('aria-valuenow')).toBe('45');
    expect(linear.get('[role="progressbar"]').attributes('aria-label')).toBe('Release progress');
    expect(linear.text()).toContain('45%');

    const circular = mount(UiProgress, {
      props: {
        variant: 'circular',
        indeterminate: true,
        status: 'warning',
        formatValue: ({ percent }) => `${percent} percent`,
      },
    });

    expect(circular.get('[role="progressbar"]').attributes('aria-valuenow')).toBeUndefined();
    expect(circular.get('.ui-progress').classes()).toContain('is-indeterminate');

    const circularDeterminate = mount(UiProgress, {
      props: {
        variant: 'circular',
        value: 3,
        max: 0,
        showValue: true,
        formatValue: ({ value, max }) => `${value}/${max}`,
      },
    });

    const progressbar = circularDeterminate.get('[role="progressbar"]');
    expect(progressbar.attributes('aria-valuemax')).toBe('1');
    expect(progressbar.attributes('aria-valuenow')).toBe('1');
    expect(
      circularDeterminate.get('.ui-progress__circular-indicator').attributes('style')
    ).toContain('stroke-dashoffset');
    expect(circularDeterminate.text()).toContain('1/1');

    const linearIndeterminate = mount(UiProgress, {
      props: {
        indeterminate: true,
      },
    });
    expect(linearIndeterminate.get('[role="progressbar"]').attributes('aria-label')).toBe(
      'Progress'
    );
    expect(
      linearIndeterminate.get('[role="progressbar"]').attributes('aria-valuenow')
    ).toBeUndefined();
    expect(
      linearIndeterminate.get('.ui-progress__linear-indicator').attributes('style')
    ).toBeUndefined();
  });

  it('renders semantic tables with slots and empty states', () => {
    const wrapper = mount(UiTable, {
      props: {
        caption: 'Accounts',
        columns: [
          { key: 'name', header: 'Name', width: 180 },
          { key: 'status', header: 'Status', align: 'center', field: 'health', width: '25%' },
        ],
        data: [{ name: 'Northwind', health: 'Healthy' }],
        bordered: true,
        striped: true,
        stickyHeader: true,
        maxHeight: 240,
      },
      slots: {
        cell: `
          <template #cell="{ column, value }">
            <strong v-if="column.key === 'name'">{{ value }}</strong>
            <span v-else>{{ value }}</span>
          </template>
        `,
      },
    });

    expect(wrapper.get('caption').text()).toBe('Accounts');
    expect(wrapper.html()).toContain('<strong>Northwind</strong>');
    expect(wrapper.get('.ui-table').classes()).toContain('ui-table--sticky');
    expect(wrapper.get('.ui-table__scroll').attributes('style')).toContain('240px');
    expect(wrapper.get('.ui-table__scroll').attributes('role')).toBe('region');
    expect(wrapper.get('.ui-table__scroll').attributes('tabindex')).toBe('0');
    expect(wrapper.get('.ui-table__scroll').attributes('aria-label')).toBe('Accounts');
    expect(wrapper.findAll('th')[0]?.attributes('style')).toContain('180px');
    expect(wrapper.findAll('th')[1]?.attributes('style')).toContain('25%');
    expect(wrapper.text()).toContain('Healthy');

    const plainTable = mount(UiTable, {
      props: {
        columns: [{ key: 'name', header: 'Name' }],
        data: [{ name: 'Southwind' }],
        maxHeight: '50vh',
      },
    });

    expect(plainTable.text()).toContain('Southwind');
    expect(plainTable.get('.ui-table__scroll').attributes('style')).toContain('50vh');
    expect(plainTable.get('.ui-table__scroll').attributes('aria-label')).toBe('Data table');

    const empty = mount(UiTable, {
      props: {
        columns: [{ key: 'name', header: 'Name' }],
        data: [],
      },
      slots: {
        empty: 'Nothing here',
      },
    });

    expect(empty.text()).toContain('Nothing here');

    const defaultEmpty = mount(UiTable, {
      props: {
        columns: [{ key: 'name', header: 'Name' }],
        data: [],
      },
    });

    expect(defaultEmpty.text()).toContain('No rows to display.');
  });
});
