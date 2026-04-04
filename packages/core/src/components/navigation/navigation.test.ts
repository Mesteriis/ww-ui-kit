import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import UiAnchor from './UiAnchor.vue';
import UiBreadcrumb from './UiBreadcrumb.vue';
import UiPagination from './UiPagination.vue';
import { buildPaginationItems, getTotalPages } from './pagination';

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

  it('covers breadcrumb slots, empty truncation, and router-agnostic href resolution', () => {
    const empty = mount(UiBreadcrumb, {
      props: {
        items: [],
        maxItems: 4,
      },
    });

    expect(empty.findAll('.ui-breadcrumb__item')).toHaveLength(0);

    const wrapper = mount(UiBreadcrumb, {
      props: {
        items: [
          { label: 'Home', to: '/' },
          { label: 'Library', href: '/library' },
          { label: 'Draft', current: false },
        ],
        maxItems: 1,
      },
      slots: {
        separator: '>',
      },
    });

    expect(wrapper.find('.ui-breadcrumb__ellipsis').exists()).toBe(false);
    expect(wrapper.get('.ui-breadcrumb__link').attributes('href')).toBe('/');
    expect(wrapper.find('[aria-current="page"]').exists()).toBe(false);
    expect(wrapper.text()).toContain('>');
  });

  it('covers pagination helpers, clamping, and optional navigation buttons', async () => {
    expect(getTotalPages(-20, 0)).toBe(1);
    expect(
      buildPaginationItems({
        currentPage: 3,
        totalPages: 10,
        siblingCount: 0,
        boundaryCount: 2,
      }).map((item) => (item.kind === 'page' ? item.page : item.id))
    ).toEqual([1, 2, 3, 4, 'end-ellipsis', 9, 10]);
    expect(
      buildPaginationItems({
        currentPage: 8,
        totalPages: 10,
        siblingCount: 0,
        boundaryCount: 2,
      }).map((item) => (item.kind === 'page' ? item.page : item.id))
    ).toEqual([1, 2, 'start-ellipsis', 7, 8, 9, 10]);
    expect(
      buildPaginationItems({
        currentPage: 1,
        totalPages: 8,
      }).map((item) => (item.kind === 'page' ? item.page : item.id))
    ).toEqual([1, 2, 3, 4, 5, 'end-ellipsis', 8]);
    expect(
      buildPaginationItems({
        currentPage: 2,
        totalPages: 4,
        siblingCount: 1,
        boundaryCount: 1,
      })
    ).toEqual([
      { kind: 'page', page: 1 },
      { kind: 'page', page: 2 },
      { kind: 'page', page: 3 },
      { kind: 'page', page: 4 },
    ]);

    expect(
      buildPaginationItems({
        currentPage: 2,
        totalPages: 10,
        siblingCount: 1,
        boundaryCount: 1,
      }).map((item) => (item.kind === 'page' ? item.page : item.id))
    ).toEqual([1, 2, 3, 4, 5, 'end-ellipsis', 10]);
    expect(
      buildPaginationItems({
        currentPage: 9,
        totalPages: 10,
        siblingCount: 1,
        boundaryCount: 1,
      }).map((item) => (item.kind === 'page' ? item.page : item.id))
    ).toEqual([1, 'start-ellipsis', 6, 7, 8, 9, 10]);
    expect(
      buildPaginationItems({
        currentPage: 10,
        totalPages: 10,
        siblingCount: 0,
        boundaryCount: 1,
      }).map((item) => (item.kind === 'page' ? item.page : item.id))
    ).toEqual([1, 'start-ellipsis', 8, 9, 10]);

    const wrapper = mount(UiPagination, {
      props: {
        defaultPage: 9,
        totalItems: 20,
        pageSize: 10,
        ariaLabel: 'Release pages',
      },
    });

    expect(wrapper.get('nav').attributes('aria-label')).toBe('Release pages');
    expect(wrapper.get('[aria-current="page"]').text()).toBe('2');

    await wrapper.get('button[aria-label="First page"]').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toEqual([[1]]);

    await wrapper.get('button[aria-label="Last page"]').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toEqual([[1], [2]]);

    await wrapper.get('button[aria-label="Previous page"]').trigger('click');
    await wrapper.get('button[aria-label="Next page"]').trigger('click');
    await wrapper.get('.ui-pagination__page').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toEqual([[1], [2], [1], [2], [1]]);

    const disabled = mount(UiPagination, {
      props: {
        modelValue: 2,
        totalItems: 50,
        pageSize: 10,
        disabled: true,
        showFirstLast: false,
        showPrevNext: false,
      },
    });

    expect(disabled.find('button[aria-label="First page"]').exists()).toBe(false);
    expect(disabled.find('button[aria-label="Next page"]').exists()).toBe(false);

    await disabled.get('.ui-pagination__page').trigger('click');
    expect(disabled.emitted('update:modelValue')).toBeUndefined();

    const disabledSetupState = disabled.vm.$.setupState as {
      setPage: (page: number) => void;
    };
    disabledSetupState.setPage(4);
    expect(disabled.emitted('update:modelValue')).toBeUndefined();

    const simple = mount(UiPagination, {
      props: {
        defaultPage: 2,
        totalItems: 20,
        pageSize: 10,
        simple: true,
      },
    });

    await simple.get('button[aria-label="Previous page"]').trigger('click');
    await simple.get('button[aria-label="Next page"]').trigger('click');
    expect(simple.emitted('update:modelValue')).toEqual([[1], [2]]);

    const simpleWithoutNav = mount(UiPagination, {
      props: {
        defaultPage: 1,
        totalItems: 20,
        pageSize: 10,
        simple: true,
        showPrevNext: false,
      },
    });

    expect(simpleWithoutNav.find('button[aria-label="Previous page"]').exists()).toBe(false);
    expect(simpleWithoutNav.find('button[aria-label="Next page"]').exists()).toBe(false);
  });

  it('tracks anchor sections inside the target container and scrolls to the selected section', async () => {
    const target = document.createElement('div');
    target.id = 'anchor-proof-target';
    document.body.append(target);

    Object.defineProperty(target, 'scrollTop', {
      configurable: true,
      value: 0,
      writable: true,
    });
    Object.defineProperty(target, 'scrollTo', {
      configurable: true,
      value: vi.fn(),
      writable: true,
    });
    Object.defineProperty(target, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        top: 0,
        right: 280,
        bottom: 240,
        left: 0,
        width: 280,
        height: 240,
        x: 0,
        y: 0,
        toJSON() {
          return this;
        },
      }),
    });

    const sectionOffsets = new Map([
      ['overview', 0],
      ['deploy', 260],
    ]);

    for (const id of ['overview', 'deploy']) {
      const section = document.createElement('section');
      section.id = id;
      target.append(section);

      Object.defineProperty(section, 'getBoundingClientRect', {
        configurable: true,
        value: () => {
          const top = (sectionOffsets.get(id) ?? 0) - target.scrollTop;
          return {
            top,
            right: 260,
            bottom: top + 120,
            left: 0,
            width: 260,
            height: 120,
            x: 0,
            y: top,
            toJSON() {
              return this;
            },
          };
        },
      });
    }

    const wrapper = mount(UiAnchor, {
      attachTo: document.body,
      props: {
        affix: true,
        items: [
          { key: 'overview', label: 'Overview', href: '#overview' },
          { key: 'deploy', label: 'Deploy', href: '#deploy' },
        ],
        offsetTop: 16,
        target: '#anchor-proof-target',
      },
    });

    await nextTick();

    expect(wrapper.find('.ui-affix').exists()).toBe(true);
    expect(wrapper.get('[aria-current="location"]').text()).toContain('Overview');

    target.scrollTop = 320;
    target.dispatchEvent(new Event('scroll'));
    await nextTick();

    expect(wrapper.get('[aria-current="location"]').text()).toContain('Deploy');

    await wrapper.get('a[href="#deploy"]').trigger('click');
    expect(target.scrollTo).toHaveBeenCalledWith({ behavior: 'smooth', left: 0, top: 244 });

    wrapper.unmount();
    target.remove();
  });

  it('keeps the last anchor item active when the target container reaches its scroll end', async () => {
    const target = document.createElement('div');
    target.id = 'anchor-proof-end-target';
    document.body.append(target);

    Object.defineProperty(target, 'scrollTop', {
      configurable: true,
      value: 0,
      writable: true,
    });
    Object.defineProperty(target, 'clientHeight', {
      configurable: true,
      value: 240,
    });
    Object.defineProperty(target, 'scrollHeight', {
      configurable: true,
      value: 600,
    });
    Object.defineProperty(target, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        top: 0,
        right: 280,
        bottom: 240,
        left: 0,
        width: 280,
        height: 240,
        x: 0,
        y: 0,
        toJSON() {
          return this;
        },
      }),
    });

    const sectionOffsets = new Map([
      ['overview', 0],
      ['contracts', 220],
      ['ship', 460],
    ]);

    for (const id of ['overview', 'contracts', 'ship']) {
      const section = document.createElement('section');
      section.id = id;
      target.append(section);

      Object.defineProperty(section, 'getBoundingClientRect', {
        configurable: true,
        value: () => {
          const top = (sectionOffsets.get(id) ?? 0) - target.scrollTop;
          return {
            top,
            right: 260,
            bottom: top + 120,
            left: 0,
            width: 260,
            height: 120,
            x: 0,
            y: top,
            toJSON() {
              return this;
            },
          };
        },
      });
    }

    const wrapper = mount(UiAnchor, {
      attachTo: document.body,
      props: {
        items: [
          { key: 'overview', label: 'Overview', href: '#overview' },
          { key: 'contracts', label: 'Contracts', href: '#contracts' },
          { key: 'ship', label: 'Ship', href: '#ship' },
        ],
        offsetTop: 12,
        target: '#anchor-proof-end-target',
      },
    });

    await nextTick();

    target.scrollTop = 360;
    target.dispatchEvent(new Event('scroll'));
    await nextTick();

    expect(wrapper.get('[aria-current="location"]').text()).toContain('Ship');

    wrapper.unmount();
    target.remove();
  });
});
