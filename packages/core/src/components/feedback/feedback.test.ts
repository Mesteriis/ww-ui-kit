import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import UiAlert from './UiAlert.vue';
import UiEmptyState from './UiEmptyState.vue';
import UiResult from './UiResult.vue';

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

  it('covers alert variants, custom slots, and motion guard branches', async () => {
    const defaults = mount(UiAlert, {
      props: {
        defaultOpen: true,
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    await nextTick();
    expect(defaults.get('[role="status"]').text()).toContain('i');
    expect(defaults.find('.ui-alert__title').exists()).toBe(false);
    expect(defaults.find('.ui-alert__description').exists()).toBe(false);
    expect(defaults.find('.ui-alert__close').exists()).toBe(false);

    const success = mount(UiAlert, {
      props: {
        defaultOpen: true,
        type: 'success',
        title: 'Saved',
        description: 'Saved description',
        banner: true,
        appearance: 'solid',
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    await nextTick();
    expect(success.get('[role="status"]').text()).toContain('✓');
    expect(success.classes()).toContain('ui-alert--banner');
    expect(success.classes()).toContain('ui-alert--solid');

    const info = mount(UiAlert, {
      props: {
        defaultOpen: true,
        type: 'info',
        title: 'Informational',
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });
    await nextTick();
    expect(info.text()).toContain('i');

    const closedError = mount(UiAlert, {
      props: {
        type: 'error',
        defaultOpen: false,
        showIcon: false,
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    expect(closedError.find('[role="alert"]').exists()).toBe(false);

    const error = mount(UiAlert, {
      props: {
        type: 'error',
        open: true,
        showIcon: false,
      },
      slots: {
        title: 'Critical',
        default: 'Exploded',
        close: ({ close }: { close: () => void }) =>
          h(
            'button',
            {
              id: 'custom-close',
              type: 'button',
              onClick: close,
            },
            'Dismiss now'
          ),
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });
    await nextTick();
    expect(error.find('.ui-alert__icon').exists()).toBe(false);
    expect(error.get('[role="alert"]').text()).toContain('Critical');
    expect(error.text()).toContain('Exploded');

    await error.get('#custom-close').trigger('click');
    expect(error.emitted('update:open')).toEqual([[false]]);

    const setupState = error.vm.$.setupState as {
      onBeforeEnter: (element: Element) => void;
      onBeforeLeave: (element: Element) => void;
      onAfterMotion: (element: Element) => void;
      onEnter: (element: Element, done: () => void) => void;
      onLeave: (element: Element, done: () => void) => void;
    };
    const htmlElement = document.createElement('div');
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const enterDone = vi.fn();
    const leaveDone = vi.fn();

    setupState.onBeforeEnter(htmlElement);
    setupState.onBeforeLeave(htmlElement);
    setupState.onBeforeEnter(svgElement);
    setupState.onBeforeLeave(svgElement);
    expect(htmlElement.style.opacity).toBe('1');

    const previousRequestAnimationFrame = window.requestAnimationFrame;
    window.requestAnimationFrame = ((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    }) as typeof window.requestAnimationFrame;
    setupState.onEnter(htmlElement, vi.fn());
    expect(htmlElement.style.opacity).toBe('1');
    window.requestAnimationFrame = previousRequestAnimationFrame;

    setupState.onEnter(svgElement, enterDone);
    setupState.onLeave(svgElement, leaveDone);
    setupState.onAfterMotion(svgElement);

    expect(enterDone).toHaveBeenCalledTimes(1);
    expect(leaveDone).toHaveBeenCalledTimes(1);

    const errorIcon = mount(UiAlert, {
      props: {
        defaultOpen: true,
        type: 'error',
        title: 'Error icon',
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });
    await nextTick();
    expect(errorIcon.text()).toContain('⨯');
  });

  it('renders result presets, roles, and extra content', () => {
    const success = mount(UiResult, {
      props: {
        status: 'success',
        title: 'Verify passed',
        subtitle: 'Everything is green.',
      },
      slots: {
        extra: 'Inspect evidence',
      },
    });

    expect(success.attributes('role')).toBe('status');
    expect(success.classes()).toContain('ui-result--success');
    expect(success.text()).toContain('Verify passed');
    expect(success.text()).toContain('Inspect evidence');

    const failure = mount(UiResult, {
      props: {
        status: '500',
        title: 'Server failed',
      },
    });

    expect(failure.attributes('role')).toBe('alert');
    expect(failure.text()).toContain('500');
  });
});
