import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import UiTour from './UiTour.vue';
import UiUpload from './UiUpload.vue';

describe('upload and tour', () => {
  it('runs uploads through the injected transport adapter', async () => {
    const file = new File(['governed'], 'governed.txt', { type: 'text/plain' });
    const transport = vi.fn(async ({ onProgress }: { onProgress: (value: number) => void }) => {
      onProgress(50);
      onProgress(100);
      return { ok: true };
    });

    const wrapper = mount(UiUpload, {
      props: {
        transport,
      },
    });

    const input = wrapper.get('input[type="file"]').element as HTMLInputElement;
    Object.defineProperty(input, 'files', {
      configurable: true,
      value: {
        0: file,
        item: (index: number) => (index === 0 ? file : null),
        length: 1,
      },
    });
    await wrapper.get('input[type="file"]').trigger('change');
    await nextTick();
    await nextTick();
    await wrapper.get('.ui-upload__actions .ui-button').trigger('click');
    await nextTick();
    await nextTick();

    expect(transport).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toContain('success');
  });

  it('advances and finishes the tour', async () => {
    const target = document.createElement('div');
    target.id = 'tour-target';
    document.body.appendChild(target);

    const wrapper = mount(UiTour, {
      props: {
        open: true,
        steps: [
          { target: '#tour-target', title: 'Step one' },
          { target: '#tour-target', title: 'Step two' },
        ],
      },
      attachTo: document.body,
    });

    (document.body.querySelectorAll('.ui-tour__actions .ui-button')[2] as HTMLElement | undefined)?.click();
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe(1);

    await nextTick();
    (document.body.querySelectorAll('.ui-tour__actions .ui-button')[2] as HTMLElement | undefined)?.click();
    await nextTick();

    expect(wrapper.emitted('finish')).toBeTruthy();
    document.body.removeChild(target);
  });
});
