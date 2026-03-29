import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import UiEmptyState from './UiEmptyState.vue';

describe('UiEmptyState', () => {
  it('renders title, description, and slots', () => {
    const wrapper = mount(UiEmptyState, {
      props: {
        description: 'Description',
        title: 'Empty',
      },
      slots: {
        actions: 'Actions',
        icon: '◇',
      },
    });

    expect(wrapper.text()).toContain('Empty');
    expect(wrapper.text()).toContain('Description');
    expect(wrapper.text()).toContain('Actions');
  });

  it('omits optional regions when description and slots are absent', () => {
    const wrapper = mount(UiEmptyState, {
      props: {
        title: 'Nothing here',
      },
    });

    expect(wrapper.find('.ui-empty-state__description').exists()).toBe(false);
    expect(wrapper.find('.ui-empty-state__icon').exists()).toBe(false);
    expect(wrapper.find('.ui-empty-state__actions').exists()).toBe(false);
    expect(wrapper.text()).toContain('Nothing here');
  });
});
