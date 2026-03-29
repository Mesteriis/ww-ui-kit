import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';

import {
  UiPageBody,
  UiPageHeader,
  UiPageSection,
  UiPageSidebar,
  UiPageTemplate,
  UiPageToolbar,
} from '../index';

describe('page-templates package', () => {
  it('exports the public shell components', () => {
    expect(UiPageTemplate).toBeTruthy();
    expect(UiPageHeader).toBeTruthy();
    expect(UiPageBody).toBeTruthy();
    expect(UiPageSidebar).toBeTruthy();
    expect(UiPageSection).toBeTruthy();
    expect(UiPageToolbar).toBeTruthy();
  });

  it('renders header, toolbar, body, sidebar, and footer slots', () => {
    const wrapper = mount(UiPageTemplate, {
      props: {
        title: 'Workspace',
        description: 'Template shell',
        hasSidebar: true,
      },
      slots: {
        toolbar: '<button type="button">Refresh</button>',
        default: '<div>Main content</div>',
        sidebar: '<div>Sidebar content</div>',
        footer: '<span>Footer meta</span>',
      },
    });

    expect(wrapper.text()).toContain('Workspace');
    expect(wrapper.text()).toContain('Template shell');
    expect(wrapper.text()).toContain('Refresh');
    expect(wrapper.text()).toContain('Main content');
    expect(wrapper.text()).toContain('Sidebar content');
    expect(wrapper.text()).toContain('Footer meta');
  });

  it('renders safely inside a themed subtree container', () => {
    const wrapper = mount(
      defineComponent({
        components: { UiPageTemplate, UiPageSection },
        template: `
          <section data-ui-theme="belovodye" data-ui-theme-type="light">
            <UiPageTemplate title="Scoped page">
              <UiPageSection title="Primary section">
                Subtree content
              </UiPageSection>
            </UiPageTemplate>
          </section>
        `,
      })
    );

    expect(wrapper.find('[data-ui-theme="belovodye"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Scoped page');
    expect(wrapper.text()).toContain('Primary section');
    expect(wrapper.text()).toContain('Subtree content');
  });

  it('renders topbar, width contract, helper shells, and optional section metadata', () => {
    const wrapper = mount(UiPageTemplate, {
      props: {
        width: 'narrow',
        padded: false,
      },
      slots: {
        topbar: '<span>Topbar</span>',
        default: '<div>Main only</div>',
      },
    });

    expect(wrapper.attributes('data-ui-width')).toBe('narrow');
    expect(wrapper.find('.ui-page-template__topbar').text()).toContain('Topbar');
    expect(wrapper.find('.ui-page-sidebar').exists()).toBe(false);
    expect(wrapper.find('.ui-page-body').attributes('data-ui-padded')).toBe('false');

    const helpers = mount(
      defineComponent({
        components: {
          UiPageHeader,
          UiPageBody,
          UiPageSidebar,
          UiPageSection,
          UiPageToolbar,
        },
        template: `
          <div>
            <UiPageHeader>Header</UiPageHeader>
            <UiPageToolbar>Toolbar</UiPageToolbar>
            <UiPageBody :padded="false">Body</UiPageBody>
            <UiPageSidebar :padded="false">Sidebar</UiPageSidebar>
            <UiPageSection title="Section title" description="Section description">
              Section body
            </UiPageSection>
          </div>
        `,
      })
    );

    expect(helpers.text()).toContain('Header');
    expect(helpers.text()).toContain('Toolbar');
    expect(helpers.find('.ui-page-body').attributes('data-ui-padded')).toBe('false');
    expect(helpers.find('.ui-page-sidebar').attributes('data-ui-padded')).toBe('false');
    expect(helpers.text()).toContain('Section title');
    expect(helpers.text()).toContain('Section description');
  });

  it('covers slot-first headers, section body-only mode, and template footer omission', () => {
    const template = mount(UiPageTemplate, {
      slots: {
        header: '<div class="custom-header">Custom page header</div>',
        default: '<div>Only body</div>',
      },
    });

    expect(template.find('.custom-header').exists()).toBe(true);
    expect(template.find('.ui-page-template__footer').exists()).toBe(false);

    const section = mount(UiPageSection, {
      slots: {
        default: 'Body only',
      },
    });

    expect(section.find('.ui-page-section__header').exists()).toBe(false);
    expect(section.text()).toContain('Body only');
  });

  it('renders description-only section and sidebar inferred from slot presence', () => {
    const template = mount(UiPageTemplate, {
      slots: {
        default: '<div>Main</div>',
        sidebar: '<div>Sidebar</div>',
      },
    });

    expect(template.attributes('data-ui-has-sidebar')).toBe('true');

    const section = mount(UiPageSection, {
      props: {
        description: 'Description only',
      },
      slots: {
        default: 'Body',
      },
    });

    expect(section.find('.ui-page-section__header').exists()).toBe(true);
    expect(section.find('.ui-page-section__title').exists()).toBe(false);
    expect(section.text()).toContain('Description only');
  });

  it('renders a description-only page header without a title', () => {
    const wrapper = mount(UiPageTemplate, {
      props: {
        description: 'Description-only page',
      },
      slots: {
        default: '<div>Main content</div>',
      },
    });

    expect(wrapper.find('.ui-page-template__title').exists()).toBe(false);
    expect(wrapper.find('.ui-page-template__description').text()).toContain(
      'Description-only page'
    );
  });
});
