import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import UiBreadcrumb from './UiBreadcrumb.vue';
import UiPagination from './UiPagination.vue';
import { buildPaginationItems } from './pagination';

describe('navigation components', () => {
  it('renders breadcrumb items with current-page and ellipsis semantics', () => {
    const wrapper = mount(UiBreadcrumb, {
      props: {
        items: [
          { label: 'Home', href: '/' },
          { label: 'Library', href: '/library' },
          { label: 'Design system', href: '/library/design-system' },
          { label: 'Components' },
        ],
        maxItems: 3,
      },
    });

    expect(wrapper.get('nav').attributes('aria-label')).toBe('Breadcrumb');
    expect(wrapper.text()).toContain('…');
    expect(wrapper.get('[aria-current="page"]').text()).toContain('Components');
  });

  it('builds page items and marks the current page in the pagination surface', async () => {
    const items = buildPaginationItems({
      currentPage: 6,
      totalPages: 12,
      siblingCount: 1,
      boundaryCount: 1,
    });

    expect(items.some((item) => item.kind === 'ellipsis')).toBe(true);

    const wrapper = mount(UiPagination, {
      props: {
        modelValue: 3,
        totalItems: 120,
        pageSize: 10,
      },
    });

    const current = wrapper.get('[aria-current="page"]');
    expect(current.text()).toBe('3');

    await wrapper.get('button[aria-label="Next page"]').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toEqual([[4]]);
  });

  it('supports simple pagination mode and disabled navigation buttons', () => {
    const wrapper = mount(UiPagination, {
      props: {
        modelValue: 1,
        totalItems: 20,
        pageSize: 10,
        simple: true,
      },
    });

    expect(wrapper.text()).toContain('Page 1 of 2');
    expect(wrapper.get('button[aria-label="Previous page"]').attributes('disabled')).toBeDefined();
  });
});
