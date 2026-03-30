import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';

import {
  UiLayout,
  UiLayoutContent,
  UiLayoutFooter,
  UiLayoutHeader,
  UiLayoutSection,
  UiLayoutSider,
  UiLayoutToolbar,
} from '../index';

describe('page-templates package', () => {
  it('exports the public shell components', () => {
    expect(UiLayout).toBeTruthy();
    expect(UiLayoutHeader).toBeTruthy();
    expect(UiLayoutSider).toBeTruthy();
    expect(UiLayoutContent).toBeTruthy();
    expect(UiLayoutFooter).toBeTruthy();
    expect(UiLayoutSection).toBeTruthy();
    expect(UiLayoutToolbar).toBeTruthy();
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

  it('renders safely inside a themed subtree container', () => {
    const wrapper = mount(
      defineComponent({
        components: { UiLayout, UiLayoutContent, UiLayoutHeader, UiLayoutSection },
        template: `
          <section data-ui-theme="belovodye" data-ui-theme-type="light">
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
          </section>
        `,
      })
    );

    expect(wrapper.find('[data-ui-theme="belovodye"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Scoped shell');
    expect(wrapper.text()).toContain('Primary section');
    expect(wrapper.text()).toContain('Subtree content');
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
