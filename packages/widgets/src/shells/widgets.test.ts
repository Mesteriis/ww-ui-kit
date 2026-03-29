import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';

import { UiWidgetBody, UiWidgetFooter, UiWidgetHeader, UiWidgetShell } from '../index';

describe('widgets package', () => {
  it('exports the public shell components', () => {
    expect(UiWidgetShell).toBeTruthy();
    expect(UiWidgetHeader).toBeTruthy();
    expect(UiWidgetBody).toBeTruthy();
    expect(UiWidgetFooter).toBeTruthy();
  });

  it('renders header, body, footer, and actions slots', () => {
    const wrapper = mount(UiWidgetShell, {
      props: {
        title: 'Summary widget',
        description: 'Reusable shell',
      },
      slots: {
        actions: '<button type="button">Refresh</button>',
        default: '<p>Body content</p>',
        footer: '<span>Footer meta</span>',
      },
    });

    expect(wrapper.text()).toContain('Summary widget');
    expect(wrapper.text()).toContain('Reusable shell');
    expect(wrapper.text()).toContain('Refresh');
    expect(wrapper.text()).toContain('Body content');
    expect(wrapper.text()).toContain('Footer meta');
  });

  it('renders inside a themed subtree and keeps content visible', () => {
    const wrapper = mount(
      defineComponent({
        components: { UiWidgetShell },
        template: `
          <section data-ui-theme="belovodye" data-ui-theme-type="light">
            <UiWidgetShell title="Scoped widget">
              <template #empty>
                <span>Empty scoped shell</span>
              </template>
            </UiWidgetShell>
          </section>
        `,
      })
    );

    expect(wrapper.find('[data-ui-theme="belovodye"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Scoped widget');
    expect(wrapper.text()).toContain('Empty scoped shell');
  });

  it('renders loading, error, and default empty states through the shell contract', () => {
    const loading = mount(UiWidgetShell, {
      props: {
        loading: true,
        title: 'Loading widget',
      },
    });
    const error = mount(UiWidgetShell, {
      props: {
        title: 'Broken widget',
        error: 'Backend integration belongs in the app layer.',
      },
    });
    const emptyFallback = mount(UiWidgetShell, {
      props: {
        title: 'Scaffold widget',
      },
    });
    const helpers = mount(
      defineComponent({
        components: { UiWidgetHeader, UiWidgetBody, UiWidgetFooter },
        template: `
        <div>
          <UiWidgetHeader>Header</UiWidgetHeader>
          <UiWidgetBody :padded="false">Body</UiWidgetBody>
          <UiWidgetFooter>Footer</UiWidgetFooter>
        </div>
      `,
      })
    );

    expect(loading.text()).toContain('Loading widget content.');
    expect(error.text()).toContain('Widget unavailable');
    expect(error.text()).toContain('Backend integration belongs in the app layer.');
    expect(emptyFallback.text()).toContain('Widget shell ready');
    expect(helpers.find('.ui-widget-body').attributes('data-ui-padded')).toBe('false');
    expect(helpers.text()).toContain('Header');
    expect(helpers.text()).toContain('Footer');
  });

  it('covers custom header, actions-only headers, and explicit empty slots', () => {
    const customHeader = mount(UiWidgetShell, {
      slots: {
        header: '<div class="custom-header">Custom header</div>',
        actions: '<button type="button">Action</button>',
        empty: '<span class="empty-slot">Nothing here</span>',
      },
    });

    expect(customHeader.find('.custom-header').exists()).toBe(true);
    expect(customHeader.text()).toContain('Action');
    expect(customHeader.text()).toContain('Nothing here');

    const booleanError = mount(UiWidgetShell, {
      props: {
        error: true,
      },
    });

    expect(booleanError.text()).toContain('This widget surface is unavailable.');
  });

  it('renders description-only header copy and default empty fallback without actions', () => {
    const wrapper = mount(UiWidgetShell, {
      props: {
        description: 'Description only',
      },
    });

    expect(wrapper.find('.ui-widget-shell__title').exists()).toBe(false);
    expect(wrapper.text()).toContain('Description only');
    expect(wrapper.text()).toContain('Widget shell ready');
  });
});
