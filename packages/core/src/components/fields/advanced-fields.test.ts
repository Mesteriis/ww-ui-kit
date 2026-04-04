import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import UiColorPicker from './UiColorPicker.vue';
import UiFilePicker from './UiFilePicker.vue';
import UiMention from './UiMention.vue';

describe('advanced field surfaces', () => {
  it('selects colors, manages files, and inserts mentions through the canonical surfaces', async () => {
    const color = mount(UiColorPicker, {
      attachTo: document.body,
      props: {
        modelValue: '#1d4ed8',
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    await color.get('.ui-color-picker__trigger').trigger('click');
    (document.querySelector('.ui-color-picker__preset') as HTMLButtonElement)?.click();
    expect(color.emitted('update:modelValue')).toBeTruthy();

    const filePicker = mount(UiFilePicker, {
      props: {
        modelValue: [],
      },
    });

    const input = filePicker.get('input[type="file"]');
    const files = [new File(['hello'], 'release.txt', { type: 'text/plain' })];
    Object.defineProperty(input.element, 'files', {
      configurable: true,
      value: files,
    });
    await input.trigger('change');
    expect(filePicker.emitted('update:modelValue')?.[0]?.[0]).toHaveLength(1);

    await filePicker.setProps({ modelValue: files });
    await filePicker.get('.ui-file-picker__remove').trigger('click');
    expect(filePicker.emitted('update:modelValue')?.pop()?.[0]).toHaveLength(0);

    const mention = mount(UiMention, {
      attachTo: document.body,
      props: {
        modelValue: 'Review @br',
        items: [
          { id: '1', label: 'bravo', description: 'Bravo lane' },
          { id: '2', label: 'release', description: 'Release channel' },
        ],
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    const textarea = mention.get('textarea');
    Object.defineProperty(textarea.element, 'selectionStart', {
      configurable: true,
      value: 10,
    });
    await textarea.trigger('keyup');
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    const option = document.body.querySelector('.ui-mention__option') as HTMLButtonElement | null;
    expect(option).toBeTruthy();
    option?.click();
    expect(mention.emitted('update:modelValue')?.pop()?.[0]).toContain('@bravo ');
    expect(mention.emitted('select')).toHaveLength(1);

    color.unmount();
    mention.unmount();
  });
});
