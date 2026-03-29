import { defineComponent, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import PrimitivePortal from './PrimitivePortal.vue';

describe('PrimitivePortal', () => {
  it('teleports content after mount and can render in place when disabled', async () => {
    const target = document.createElement('div');
    target.id = 'portal-target';
    document.body.append(target);

    const wrapper = mount(
      defineComponent({
        components: { PrimitivePortal },
        setup() {
          const disabled = ref(false);
          return { disabled };
        },
        template: `
          <div class="host">
            <PrimitivePortal to="#portal-target" :disabled="disabled">
              <span id="teleported">Teleported content</span>
            </PrimitivePortal>
          </div>
        `
      }),
      { attachTo: document.body }
    );

    await nextTick();

    expect(target.textContent).toContain('Teleported content');
    expect(wrapper.find('.host').text()).not.toContain('Teleported content');

    wrapper.vm.disabled = true;
    await nextTick();

    expect(wrapper.find('.host').text()).toContain('Teleported content');

    wrapper.unmount();
  });
});
