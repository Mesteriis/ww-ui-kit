import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';

import UiInfiniteScroll from './UiInfiniteScroll.vue';
import UiVirtualList from './UiVirtualList.vue';
import UiVirtualScroll from './UiVirtualScroll.vue';

const items = Array.from({ length: 20 }, (_, index) => `Item ${index}`);

describe('virtual surfaces', () => {
  it('emits visible ranges from the base virtual scroll surface', async () => {
    const wrapper = mount(UiVirtualScroll, {
      attachTo: document.body,
      props: {
        items,
        itemSize: 32,
        height: 96,
        role: 'list',
      },
      slots: {
        default: ({ item, style }: { item: string; style: Record<string, string> }) =>
          h('div', { class: 'virtual-row', role: 'listitem', style }, item),
      },
    });

    expect(wrapper.emitted('rangeChange')?.[0]?.[0]).toEqual({ end: 7, start: 0 });

    const viewport = wrapper.get('.ui-virtual-scroll');
    Object.defineProperty(viewport.element, 'scrollTop', {
      configurable: true,
      value: 160,
    });
    await viewport.trigger('scroll');

    expect(wrapper.emitted('rangeChange')?.at(-1)?.[0]).toEqual({ end: 12, start: 1 });
  });

  it('renders only the visible virtual list window', () => {
    const wrapper = mount(UiVirtualList, {
      props: {
        items,
        itemSize: 32,
        height: 96,
      },
      slots: {
        default: ({ item }: { item: string }) => item,
      },
    });

    expect(wrapper.findAll('.ui-virtual-list__item').length).toBeLessThan(items.length);
  });

  it('requests more data when infinite scroll is near the threshold', () => {
    const wrapper = mount(UiInfiniteScroll, {
      props: {
        items: items.slice(0, 3),
        itemSize: 32,
        height: 96,
        hasMore: true,
        threshold: 4,
      },
      slots: {
        default: ({ item }: { item: string }) => item,
      },
    });

    expect(wrapper.emitted('loadMore')).toBeTruthy();
  });
});
