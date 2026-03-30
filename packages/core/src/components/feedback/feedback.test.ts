import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, expect, it } from 'vitest';

import UiAlert from './UiAlert.vue';
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

  it('renders alert semantics, actions, and dismiss handling', async () => {
    const wrapper = mount(UiAlert, {
      props: {
        closable: true,
        defaultOpen: true,
        description: 'Alert description',
        title: 'Action needed',
        type: 'warning',
      },
      slots: {
        action: '<button type="button">Retry</button>',
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    await nextTick();
    expect(wrapper.get('[role="alert"]').text()).toContain('Action needed');
    expect(wrapper.text()).toContain('Retry');

    await wrapper.get('button[aria-label="Dismiss alert"]').trigger('click');
    expect(wrapper.emitted('update:open')).toEqual([[false]]);
  });
});
