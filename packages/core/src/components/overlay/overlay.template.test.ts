import { ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./useOverlay', () => ({
  useOverlay: vi.fn(() => ({
    anchorRef: ref<HTMLElement | null>(null),
    backdropStyle: ref({ zIndex: '4000' }),
    contentStyle: ref({ zIndex: '4002' }),
    describedBy: ref('overlay-description'),
    handleBackdropAfterEnter: vi.fn(),
    handleBackdropAfterLeave: vi.fn(),
    handleBackdropBeforeEnter: vi.fn(),
    handleBackdropBeforeLeave: vi.fn(),
    handleSurfaceAfterEnter: vi.fn(),
    handleSurfaceAfterLeave: vi.fn(),
    handleSurfaceBeforeEnter: vi.fn(),
    handleSurfaceBeforeLeave: vi.fn(),
    isActive: ref(true),
    labelledBy: ref(null),
    panelRef: ref<HTMLElement | null>(null),
    portalTarget: ref<HTMLElement | null>(null),
    titleId: 'overlay-title',
    descriptionId: 'overlay-description'
  }))
}));

import UiDialog from './UiDialog.vue';
import UiDrawer from './UiDrawer.vue';

describe('overlay template branches', () => {
  it('renders dialog header slots, description branch, closed state, and close button emit', async () => {
    const closedWrapper = mount(UiDialog, {
      attachTo: document.body,
      props: {
        open: false,
        ariaLabel: 'Dialog aria label'
      },
      global: {
        stubs: {
          transition: false
        }
      }
    });

    expect(closedWrapper.find('.ui-overlay').attributes('data-ui-state')).toBe('closed');
    closedWrapper.unmount();

    const wrapper = mount(UiDialog, {
      attachTo: document.body,
      props: {
        open: true,
        description: 'Dialog description',
        ariaLabel: 'Dialog aria label'
      },
      slots: {
        header: '<div class="dialog-header-slot">Dialog header slot</div>',
        default: '<div>Body</div>'
      },
      global: {
        stubs: {
          transition: false
        }
      }
    });

    expect(wrapper.find('.dialog-header-slot').exists()).toBe(true);
    expect(wrapper.text()).toContain('Dialog description');

    await wrapper.get('.ui-overlay__close').trigger('click');
    expect(wrapper.emitted('update:open')).toEqual([[false]]);

    wrapper.unmount();
  });

  it('renders drawer title slots, description branch, open state, and close button emit', async () => {
    const closedWrapper = mount(UiDrawer, {
      attachTo: document.body,
      props: {
        open: false,
        ariaLabel: 'Drawer aria label'
      },
      global: {
        stubs: {
          transition: false
        }
      }
    });

    expect(closedWrapper.find('.ui-overlay').attributes('data-ui-state')).toBe('closed');
    closedWrapper.unmount();

    const wrapper = mount(UiDrawer, {
      attachTo: document.body,
      props: {
        open: true,
        side: 'right',
        description: 'Drawer description',
        ariaLabel: 'Drawer aria label'
      },
      slots: {
        title: '<span class="drawer-title-slot">Drawer title slot</span>',
        default: '<div>Drawer body</div>'
      },
      global: {
        stubs: {
          transition: false
        }
      }
    });

    expect(wrapper.find('.ui-overlay').attributes('data-ui-state')).toBe('open');
    expect(wrapper.find('.drawer-title-slot').exists()).toBe(true);
    expect(wrapper.text()).toContain('Drawer description');

    await wrapper.get('.ui-overlay__close').trigger('click');
    expect(wrapper.emitted('update:open')).toEqual([[false]]);

    wrapper.unmount();
  });
});
