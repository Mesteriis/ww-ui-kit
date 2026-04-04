import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import { getThemeMeta } from '@ww/themes';

import LabWorkbenchView from './LabWorkbenchView.vue';

describe('LabWorkbenchView', () => {
  it('renders the selected surface, updates preview controls, and exposes usage metadata', async () => {
    const wrapper = mount(LabWorkbenchView, {
      props: {
        surfaceId: 'ui-button',
        themeName: 'belovodye',
        themeMeta: getThemeMeta('belovodye'),
      },
    });

    await vi.dynamicImportSettled();
    await flushPromises();

    expect(wrapper.text()).toContain('UiButton');
    expect(wrapper.text()).toContain('@ww/core');
    expect(wrapper.text()).toContain('Downstream usage');
    expect(wrapper.get('[data-lab-meta="package"]').text()).toContain('@ww/core');
    expect(wrapper.get('[data-lab-meta="theme-name"]').text()).toContain('belovodye');
    expect(wrapper.get('[data-lab-meta="theme-type"]').text()).toContain('dark');

    const labelInput = wrapper.get('[data-lab-control="label"] input');
    await labelInput.setValue('Ship release');
    expect(wrapper.text()).toContain('Ship release');

    await wrapper.get('[data-lab-nav-item="ui-input"]').trigger('click');
    expect(wrapper.emitted('navigateSurface')).toEqual([['ui-input']]);
  });
});
