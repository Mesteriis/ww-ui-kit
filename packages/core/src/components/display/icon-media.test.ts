import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import UiIcon from './UiIcon.vue';
import UiImagePreview from './UiImagePreview.vue';
import UiImagePreviewGroup from './UiImagePreviewGroup.vue';
import UiWatermark from './UiWatermark.vue';

const previewItems = [
  { src: '/one.png', alt: 'One', caption: 'First image' },
  { src: '/two.png', alt: 'Two', caption: 'Second image' },
];

describe('icon and media extensions', () => {
  it('renders named and slotted icons through the canonical surface', () => {
    const named = mount(UiIcon, {
      props: {
        name: 'calendar',
        label: 'Calendar icon',
      },
    });
    const slotted = mount(UiIcon, {
      slots: {
        default: '⌘',
      },
    });

    expect(named.attributes('aria-label')).toBe('Calendar icon');
    expect(named.find('svg').exists()).toBe(true);
    expect(slotted.text()).toContain('⌘');
  });

  it('renders watermark overlays as a generated data-url surface', () => {
    const wrapper = mount(UiWatermark, {
      props: {
        text: 'Governed proof',
      },
      slots: {
        default: '<div>Content</div>',
      },
    });

    expect(wrapper.text()).toContain('Content');
    expect(wrapper.get('.ui-watermark__overlay').attributes('style')).toContain(
      'data:image/svg+xml'
    );
  });

  it('navigates image previews and opens the default preview group integration with UiImage', async () => {
    const preview = mount(UiImagePreview, {
      attachTo: document.body,
      props: {
        open: true,
        items: previewItems,
        modelValue: 0,
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    expect(preview.find('.ui-image-preview__caption').text()).toBe('First image');

    await preview.get('.ui-image-preview__nav--next').trigger('click');
    expect(preview.emitted('update:modelValue')).toEqual([[1]]);

    const group = mount(UiImagePreviewGroup, {
      attachTo: document.body,
      props: {
        items: previewItems,
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    await group.get('.ui-image-preview-group__thumb').trigger('click');
    expect(document.body.textContent).toContain('First image');

    preview.unmount();
    group.unmount();
  });
});
