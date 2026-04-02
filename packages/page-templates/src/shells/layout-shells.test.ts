import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';

import {
  UiDashboardLayout,
  UiHorizontalLayout,
  UiLayout,
  UiLayoutContent,
  UiLayoutFooter,
  UiLayoutHeader,
  UiLayoutSection,
  UiLayoutSider,
  UiLayoutToolbar,
  UiVerticalLayout,
} from '../index';

describe('page-templates package', () => {
  it('exports the public shell components', () => {
    expect(UiDashboardLayout).toBeTruthy();
    expect(UiHorizontalLayout).toBeTruthy();
    expect(UiLayout).toBeTruthy();
    expect(UiLayoutHeader).toBeTruthy();
    expect(UiLayoutSider).toBeTruthy();
    expect(UiLayoutContent).toBeTruthy();
    expect(UiLayoutFooter).toBeTruthy();
    expect(UiLayoutSection).toBeTruthy();
    expect(UiLayoutToolbar).toBeTruthy();
    expect(UiVerticalLayout).toBeTruthy();
  });

  it('renders the dashboard layout slot contract with semantic regions', () => {
    const wrapper = mount(UiDashboardLayout, {
      slots: {
        'aside-header':
          '<div><strong>WW</strong><span>Workspace overview</span><p>Reusable dashboard shell</p></div>',
        'aside-content':
          '<nav aria-label="Dashboard navigation"><a href="#summary">Summary</a><a href="#queue">Queue</a></nav>',
        'aside-actions':
          '<button type="button">Create insight</button><button type="button">Invite analyst</button>',
        header: '<div><h1>Operations cockpit</h1><p>Route state stays in apps.</p></div>',
        'header-actions': '<button type="button">Open workspace menu</button>',
        default: '<article><h2>Pipeline coverage</h2><p>Dashboard content</p></article>',
      },
    });

    expect(wrapper.find('section.ui-dashboard-layout[data-ui-region="shell"]').exists()).toBe(true);
    expect(wrapper.find('aside.ui-dashboard-layout__aside[data-ui-region="aside"]').exists()).toBe(
      true
    );
    expect(wrapper.find('section.ui-dashboard-layout__main[data-ui-region="main"]').exists()).toBe(
      true
    );
    expect(
      wrapper.find('header.ui-dashboard-layout__header[data-ui-region="header"]').exists()
    ).toBe(true);
    expect(
      wrapper.find('section.ui-dashboard-layout__content[data-ui-region="content"]').exists()
    ).toBe(true);
    expect(wrapper.find('[data-ui-region="aside-content"]').attributes('data-ui-scroll')).toBe(
      'true'
    );
    expect(wrapper.find('[data-ui-region="aside-content"]').attributes('role')).toBe('region');
    expect(wrapper.find('[data-ui-region="aside-content"]').attributes('tabindex')).toBe('0');
    expect(wrapper.find('[data-ui-region="aside-content"]').attributes('aria-label')).toBe(
      'Dashboard sidebar content'
    );
    expect(wrapper.find('[data-ui-slot="aside-header"]').text()).toContain('Workspace overview');
    expect(wrapper.find('[data-ui-slot="aside-content"]').text()).toContain('Summary');
    expect(wrapper.find('[data-ui-slot="aside-actions"]').text()).toContain('Create insight');
    expect(wrapper.find('[data-ui-slot="header"]').text()).toContain('Operations cockpit');
    expect(wrapper.find('[data-ui-slot="header-actions"]').text()).toContain('Open workspace menu');
    expect(wrapper.find('[data-ui-region="content"]').text()).toContain('Pipeline coverage');
    expect(wrapper.find('[data-ui-region="content"]').attributes('data-ui-scroll')).toBe('true');
    expect(wrapper.find('[data-ui-region="content"]').attributes('role')).toBe('region');
    expect(wrapper.find('[data-ui-region="content"]').attributes('tabindex')).toBe('0');
    expect(wrapper.find('[data-ui-region="content"]').attributes('aria-label')).toBe(
      'Dashboard main content'
    );
  });

  it('keeps dashboard layout region wrappers stable when optional slots are omitted', () => {
    const wrapper = mount(UiDashboardLayout, {
      slots: {
        default: '<div>Only main content</div>',
      },
    });

    expect(wrapper.find('[data-ui-slot="aside-header"]').exists()).toBe(true);
    expect(wrapper.find('[data-ui-slot="aside-content"]').exists()).toBe(true);
    expect(wrapper.find('[data-ui-slot="aside-actions"]').exists()).toBe(true);
    expect(wrapper.find('[data-ui-slot="header"]').exists()).toBe(true);
    expect(wrapper.find('[data-ui-slot="header-actions"]').exists()).toBe(true);
    expect(wrapper.find('[data-ui-region="content"]').text()).toContain('Only main content');
  });

  it('locks document scroll while the dashboard layout is mounted and restores it on unmount', () => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const originalClientWidth = document.documentElement.clientWidth;

    Object.defineProperty(document.documentElement, 'clientWidth', {
      configurable: true,
      value: window.innerWidth,
    });

    const wrapper = mount(UiDashboardLayout, {
      attachTo: document.body,
      slots: {
        default: '<div>Scroll lock proof</div>',
      },
    });

    expect(document.body.style.overflow).toBe('hidden');

    wrapper.unmount();

    expect(document.body.style.overflow).toBe(originalOverflow);
    expect(document.body.style.paddingRight).toBe(originalPaddingRight);

    Object.defineProperty(document.documentElement, 'clientWidth', {
      configurable: true,
      value: originalClientWidth,
    });
  });

  it('renders structural regions through explicit layout composition', () => {
    const wrapper = mount(UiLayout, {
      props: {
        width: 'narrow',
      },
      slots: {
        header:
          '<header class="ui-layout-header"><div><h1>Operations shell</h1><p>Structural shell</p></div></header>',
        toolbar: '<div class="ui-layout-toolbar"><button type="button">Refresh</button></div>',
        default:
          '<div class="ui-layout-content" data-ui-padded="false"><div>Main content</div></div>',
        sider:
          '<aside class="ui-layout-sider" data-ui-padded="true"><div>Sidebar content</div></aside>',
        footer: '<footer class="ui-layout-footer"><span>Footer meta</span></footer>',
      },
    });

    expect(wrapper.attributes('data-ui-width')).toBe('narrow');
    expect(wrapper.attributes('data-ui-has-sider')).toBe('true');
    expect(wrapper.text()).toContain('Operations shell');
    expect(wrapper.text()).toContain('Structural shell');
    expect(wrapper.text()).toContain('Refresh');
    expect(wrapper.text()).toContain('Main content');
    expect(wrapper.text()).toContain('Sidebar content');
    expect(wrapper.text()).toContain('Footer meta');
  });

  it('renders vertical and horizontal flow layouts with gap, scroll, and accessible region contracts', () => {
    const vertical = mount(UiVerticalLayout, {
      props: {
        gap: '2rem',
        scroll: true,
      },
      slots: {
        default: '<span>Filters</span><span>Approvals</span><span>Escalations</span>',
      },
    });

    const horizontal = mount(UiHorizontalLayout, {
      props: {
        gap: '1.25rem',
      },
      slots: {
        default: '<button type="button">North lane</button><button type="button">Bravo</button>',
      },
    });

    const horizontalScrollable = mount(UiHorizontalLayout, {
      props: {
        gap: '1.25rem',
        scroll: true,
      },
      attrs: {
        'aria-label': 'Dashboard swimlanes',
      },
      slots: {
        default: '<button type="button">North lane</button><button type="button">Bravo</button>',
      },
    });

    expect(vertical.classes()).toContain('ui-flow-layout');
    expect(vertical.classes()).toContain('ui-vertical-layout');
    expect(vertical.attributes('data-ui-direction')).toBe('vertical');
    expect(vertical.attributes('data-ui-scroll')).toBe('true');
    expect(vertical.attributes('role')).toBe('region');
    expect(vertical.attributes('tabindex')).toBe('0');
    expect(vertical.attributes('aria-label')).toBe('Scrollable vertical layout');
    expect(vertical.attributes('style')).toContain('--ui-layout-flow-gap: 2rem;');
    expect(vertical.text()).toContain('Filters');
    expect(vertical.text()).toContain('Escalations');

    expect(horizontal.classes()).toContain('ui-flow-layout');
    expect(horizontal.classes()).toContain('ui-horizontal-layout');
    expect(horizontal.attributes('data-ui-direction')).toBe('horizontal');
    expect(horizontal.attributes('data-ui-scroll')).toBe('false');
    expect(horizontal.attributes('tabindex')).toBeUndefined();
    expect(horizontal.attributes('style')).toContain('--ui-layout-flow-gap: 1.25rem;');
    expect(horizontal.text()).toContain('North lane');
    expect(horizontal.text()).toContain('Bravo');

    expect(horizontalScrollable.classes()).toContain('ui-flow-layout');
    expect(horizontalScrollable.classes()).toContain('ui-horizontal-layout');
    expect(horizontalScrollable.attributes('data-ui-direction')).toBe('horizontal');
    expect(horizontalScrollable.attributes('data-ui-scroll')).toBe('true');
    expect(horizontalScrollable.attributes('role')).toBe('region');
    expect(horizontalScrollable.attributes('tabindex')).toBe('0');
    expect(horizontalScrollable.attributes('aria-label')).toBe('Dashboard swimlanes');
    expect(horizontalScrollable.attributes('style')).toContain('--ui-layout-flow-gap: 1.25rem;');
    expect(horizontalScrollable.text()).toContain('North lane');
    expect(horizontalScrollable.text()).toContain('Bravo');
  });

  it('renders safely inside a themed subtree container', () => {
    const wrapper = mount(
      defineComponent({
        components: {
          UiHorizontalLayout,
          UiLayout,
          UiLayoutContent,
          UiLayoutHeader,
          UiLayoutSection,
          UiVerticalLayout,
        },
        template: `
          <section data-ui-theme="belovodye" data-ui-theme-type="dark">
            <UiLayout>
              <template #header>
                <UiLayoutHeader>
                  <div>
                    <h1>Scoped shell</h1>
                  </div>
                </UiLayoutHeader>
              </template>
              <UiLayoutContent :padded="false">
                <UiLayoutSection title="Primary section">Subtree content</UiLayoutSection>
              </UiLayoutContent>
            </UiLayout>
            <UiVerticalLayout><span>Scoped vertical</span></UiVerticalLayout>
            <UiHorizontalLayout><span>Scoped horizontal</span></UiHorizontalLayout>
          </section>
        `,
      })
    );

    expect(wrapper.find('[data-ui-theme="belovodye"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Scoped shell');
    expect(wrapper.text()).toContain('Primary section');
    expect(wrapper.text()).toContain('Subtree content');
    expect(wrapper.text()).toContain('Scoped vertical');
    expect(wrapper.text()).toContain('Scoped horizontal');
  });

  it('renders helper regions and optional section metadata', () => {
    const helpers = mount(
      defineComponent({
        components: {
          UiLayoutContent,
          UiLayoutFooter,
          UiLayoutHeader,
          UiLayoutSection,
          UiLayoutSider,
          UiLayoutToolbar,
        },
        template: `
          <div>
            <UiLayoutHeader>Header</UiLayoutHeader>
            <UiLayoutToolbar>Toolbar</UiLayoutToolbar>
            <UiLayoutContent :padded="false">Body</UiLayoutContent>
            <UiLayoutSider :padded="false">Sidebar</UiLayoutSider>
            <UiLayoutFooter>Footer</UiLayoutFooter>
            <UiLayoutSection title="Section title" description="Section description">
              Section body
            </UiLayoutSection>
          </div>
        `,
      })
    );

    expect(helpers.text()).toContain('Header');
    expect(helpers.text()).toContain('Toolbar');
    expect(helpers.find('.ui-layout-content').attributes('data-ui-padded')).toBe('false');
    expect(helpers.find('.ui-layout-sider').attributes('data-ui-padded')).toBe('false');
    expect(helpers.text()).toContain('Footer');
    expect(helpers.text()).toContain('Section title');
    expect(helpers.text()).toContain('Section description');
  });

  it('omits optional regions and supports body-only layout sections', () => {
    const layout = mount(UiLayout, {
      slots: {
        default: '<div class="ui-layout-content"><div>Only body</div></div>',
      },
    });

    expect(layout.attributes('data-ui-has-sider')).toBe('false');
    expect(layout.find('.ui-layout-footer').exists()).toBe(false);

    const section = mount(UiLayoutSection, {
      slots: {
        default: 'Body only',
      },
    });

    expect(section.find('.ui-layout-section__header').exists()).toBe(false);
    expect(section.text()).toContain('Body only');
  });

  it('infers sider presence from the named slot and supports description-only sections', () => {
    const layout = mount(UiLayout, {
      slots: {
        default: '<div class="ui-layout-content"><div>Main</div></div>',
        sider: '<aside class="ui-layout-sider"><div>Sidebar</div></aside>',
      },
    });

    expect(layout.attributes('data-ui-has-sider')).toBe('true');

    const section = mount(UiLayoutSection, {
      props: {
        description: 'Description only',
      },
      slots: {
        default: 'Body',
      },
    });

    expect(section.find('.ui-layout-section__header').exists()).toBe(true);
    expect(section.find('.ui-layout-section__title').exists()).toBe(false);
    expect(section.text()).toContain('Description only');
  });

  it('removes the retired page-prefixed export names from the public entrypoint', async () => {
    const publicSurface = await import('../index');
    const retiredPrefix = ['Ui', 'Page'].join('');

    expect(Object.keys(publicSurface).some((key) => key.startsWith(retiredPrefix))).toBe(false);
  });
});
