import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import UiInfiniteScroll from './UiInfiniteScroll.vue';
import UiVirtualList from './UiVirtualList.vue';

const items = Array.from({ length: 20 }, (_, index) => `Item ${index}`);

describe('virtual surfaces', () => {
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
