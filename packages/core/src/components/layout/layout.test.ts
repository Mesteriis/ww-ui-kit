import { defineComponent, h, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

import UiAffix from './UiAffix.vue';
import UiFlex from './UiFlex.vue';
import UiGrid from './UiGrid.vue';
import UiScrollArea from './UiScrollArea.vue';
import UiScrollTop from './UiScrollTop.vue';
import UiSpace from './UiSpace.vue';

const initialInnerWidth = window.innerWidth;

function setWindowWidth(value: number) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value,
    writable: true,
  });
}

afterEach(() => {
  setWindowWidth(initialInnerWidth);
  vi.restoreAllMocks();
});

describe('layout components', () => {
  it('renders flex layout utilities with constrained gap and alignment props', () => {
    const wrapper = mount(UiFlex, {
      props: {
        direction: 'column',
        wrap: 'wrap',
        justify: 'between',
        align: 'center',
        gap: '6',
        block: true,
      },
      slots: {
        default: '<span>Alpha</span><span>Bravo</span>',
      },
    });

    expect(wrapper.classes()).toContain('ui-flex--column');
    expect(wrapper.classes()).toContain('ui-flex--wrap');
    expect(wrapper.classes()).toContain('ui-flex--block');
    expect(wrapper.attributes('style')).toContain('gap: var(--ui-space-6);');
    expect(wrapper.attributes('style')).toContain('justify-content: space-between;');
    expect(wrapper.attributes('style')).toContain('align-items: center;');
  });

  it('renders space separators, compact seams, and forwarded accessibility attrs', () => {
    const wrapper = mount(UiSpace, {
      attrs: {
        'aria-label': 'Compact actions',
      },
      props: {
        compact: true,
        direction: 'horizontal',
        separator: '/',
      },
      slots: {
        default: () => [
          h('button', { class: 'ui-button' }, 'Review'),
          h('input', { class: 'ui-input', value: 'Search' }),
        ],
      },
    });

    expect(wrapper.classes()).toContain('ui-space--compact');
    expect(wrapper.classes()).toContain('ui-space--horizontal');
    expect(wrapper.attributes('aria-label')).toBe('Compact actions');
    expect(wrapper.findAll('.ui-space__item')).toHaveLength(2);
    expect(wrapper.findAll('.ui-space__separator')).toHaveLength(0);
    expect(wrapper.attributes('style')).toContain('gap: 0px;');
  });

  it('renders space separators when compact mode is disabled', () => {
    const wrapper = mount(UiSpace, {
      props: {
        direction: 'vertical',
        separator: '•',
        size: '4',
      },
      slots: {
        default: '<span>Alpha</span><span>Bravo</span><span>Charlie</span>',
      },
    });

    expect(wrapper.classes()).toContain('ui-space--vertical');
    expect(wrapper.findAll('.ui-space__separator')).toHaveLength(2);
    expect(wrapper.text()).toContain('Alpha');
    expect(wrapper.text()).toContain('Charlie');
  });

  it('resolves responsive grid spans from the sanctioned breakpoint contract', async () => {
    setWindowWidth(1280);

    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const wrapper = mount(UiGrid, {
      props: {
        columns: 12,
        gap: '4',
        items: [
          {
            key: 'summary',
            span: 12,
            responsive: {
              md: 6,
              lg: 4,
            },
          },
          {
            key: 'actions',
            span: 12,
            responsive: {
              md: 6,
              lg: 8,
            },
          },
        ],
      },
      slots: {
        item: ({ item }: { item: { key: string } }) => h('span', item.key),
      },
    });

    await nextTick();

    const items = wrapper.findAll('.ui-grid__item');
    expect(items).toHaveLength(2);
    expect(items[0].attributes('style')).toContain('grid-column: span 4 / span 4;');
    expect(items[1].attributes('style')).toContain('grid-column: span 8 / span 8;');

    setWindowWidth(900);
    window.dispatchEvent(new Event('resize'));
    await nextTick();

    expect(items[0].attributes('style')).toContain('grid-column: span 6 / span 6;');
    expect(items[1].attributes('style')).toContain('grid-column: span 6 / span 6;');

    setWindowWidth(640);
    window.dispatchEvent(new Event('resize'));
    await nextTick();

    expect(items[0].attributes('style')).toContain('grid-column: span 12 / span 12;');
    expect(items[1].attributes('style')).toContain('grid-column: span 12 / span 12;');

    wrapper.unmount();

    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function), {
      passive: true,
    });
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('renders scroll areas with governed region semantics and imperative scroll helpers', () => {
    const wrapper = mount(UiScrollArea, {
      props: {
        ariaLabel: 'Release notes',
        maxHeight: 160,
        visibility: 'hover',
      },
      slots: {
        default: '<div style="block-size: 32rem;">Scrollable content</div>',
      },
    });

    const viewport = wrapper.get('.ui-scroll-area__viewport');
    const element = viewport.element as HTMLElement & {
      scrollBy: (options: ScrollToOptions) => void;
      scrollTo: (options: ScrollToOptions) => void;
    };
    const scrollToSpy = vi.fn();
    const scrollBySpy = vi.fn();

    Object.defineProperty(element, 'scrollHeight', {
      configurable: true,
      value: 480,
    });
    element.scrollTo = scrollToSpy;
    element.scrollBy = scrollBySpy;

    expect(wrapper.classes()).toContain('ui-scroll-area--hover');
    expect(viewport.attributes('role')).toBe('region');
    expect(viewport.attributes('aria-label')).toBe('Release notes');
    expect(viewport.attributes('style')).toContain('max-height: 160px;');

    const exposed = wrapper.vm as unknown as {
      scrollBy: (options: number | ScrollToOptions) => void;
      scrollToBottom: (behavior?: ScrollBehavior) => void;
      scrollToTop: (behavior?: ScrollBehavior) => void;
    };

    exposed.scrollBy({ top: 48, behavior: 'auto' });
    exposed.scrollToTop('auto');
    exposed.scrollToBottom('smooth');

    expect(scrollBySpy).toHaveBeenCalledWith({ top: 48, behavior: 'auto' });
    expect(scrollToSpy).toHaveBeenNthCalledWith(1, { top: 0, behavior: 'auto' });
    expect(scrollToSpy).toHaveBeenNthCalledWith(2, { top: 480, behavior: 'smooth' });
  });

  it('tracks affix state and scroll-top visibility against the sanctioned target container', async () => {
    const target = document.createElement('div');
    let affixTop = 72;

    Object.defineProperty(target, 'scrollTop', {
      configurable: true,
      value: 0,
      writable: true,
    });
    Object.defineProperty(target, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        top: 12,
        right: 312,
        bottom: 212,
        left: 12,
        width: 300,
        height: 200,
        x: 12,
        y: 12,
        toJSON() {
          return this;
        },
      }),
    });
    Object.defineProperty(target, 'scrollTo', {
      configurable: true,
      value: vi.fn(),
      writable: true,
    });

    document.body.append(target);

    const wrapper = mount(
      defineComponent({
        components: { UiAffix, UiScrollTop },
        setup() {
          const stuck = ref(false);
          return { stuck, target };
        },
        template: `
          <div>
            <UiAffix v-model:stuck="stuck" :target="target" :offset-top="24">
              <div>Filters</div>
            </UiAffix>
            <UiScrollTop :target="target" :threshold="120" behavior="auto" />
            <p>{{ stuck ? 'stuck' : 'floating' }}</p>
          </div>
        `,
      }),
      {
        attachTo: document.body,
      }
    );

    Object.defineProperty(wrapper.get('.ui-affix').element, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        top: affixTop,
        right: 240,
        bottom: affixTop + 48,
        left: 24,
        width: 216,
        height: 48,
        x: 24,
        y: affixTop,
        toJSON() {
          return this;
        },
      }),
    });

    target.dispatchEvent(new Event('scroll'));
    await nextTick();

    expect(wrapper.text()).toContain('floating');
    expect(wrapper.find('.ui-scroll-top__button').exists()).toBe(false);

    affixTop = 24;
    target.scrollTop = 180;
    target.dispatchEvent(new Event('scroll'));
    await nextTick();

    expect(wrapper.text()).toContain('stuck');
    expect(wrapper.find('.ui-scroll-top__button').exists()).toBe(true);

    await wrapper.get('.ui-scroll-top__button').trigger('click');
    expect(target.scrollTo).toHaveBeenCalledWith({ behavior: 'auto', left: 0, top: 0 });

    wrapper.unmount();
    target.remove();
  });
});
