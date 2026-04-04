import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import UiCascader from './UiCascader.vue';
import UiTransfer from './UiTransfer.vue';
import UiTree from './UiTree.vue';
import UiTreeSelect from './UiTreeSelect.vue';

const nodes = [
  {
    key: 'foundations',
    label: 'Foundations',
    children: [
      { key: 'tokens', label: 'Tokens', leaf: true },
      { key: 'themes', label: 'Themes', leaf: true },
    ],
  },
  {
    key: 'systems',
    label: 'Systems',
    children: [{ key: 'interaction', label: 'Interaction', leaf: true }],
  },
];

describe('tree family', () => {
  it('supports tree keyboard selection and check propagation', async () => {
    const wrapper = mount(UiTree, {
      props: {
        checkable: true,
        nodes,
      },
    });

    await wrapper.trigger('keydown', { key: ' ' });

    const checked = wrapper.emitted('update:checkedKeys')?.at(-1)?.[0] as string[];
    expect(checked).toContain('foundations');
    expect(checked).toContain('tokens');
    expect(checked).toContain('themes');
  });

  it('updates tree-select values', async () => {
    const wrapper = mount(UiTreeSelect, {
      props: {
        nodes,
      },
      attachTo: document.body,
    });

    await wrapper.get('.ui-tree-select__trigger').trigger('click');
    await nextTick();
    (document.body.querySelector('.ui-tree__item') as HTMLElement | null)?.click();
    await nextTick();

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual('foundations');
    wrapper.unmount();
  });

  it('selects cascader paths', async () => {
    const wrapper = mount(UiCascader, {
      props: {
        nodes,
      },
      attachTo: document.body,
    });

    await wrapper.get('.ui-cascader__trigger').trigger('click');
    await nextTick();
    (document.body.querySelectorAll('.ui-cascader__option')[0] as HTMLElement | undefined)?.click();
    await nextTick();
    const options = document.body.querySelectorAll('.ui-cascader__option');
    (options[2] as HTMLElement | undefined)?.click();

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual(['foundations', 'tokens']);
    wrapper.unmount();
  });

  it('moves transfer items between panels', async () => {
    const wrapper = mount(UiTransfer, {
      props: {
        items: nodes,
      },
    });

    await wrapper.findAll('.ui-transfer__option')[0]?.trigger('click');
    await wrapper.get('.ui-transfer__actions .ui-button').trigger('click');

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual(['tokens']);
  });
});
