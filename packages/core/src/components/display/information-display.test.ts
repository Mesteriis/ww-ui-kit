import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

import UiDescriptions from './UiDescriptions.vue';
import UiList from './UiList.vue';
import UiStatistic from './UiStatistic.vue';
import UiTimeline from './UiTimeline.vue';

afterEach(() => {
  vi.useRealTimers();
});

describe('information display surfaces', () => {
  it('renders descriptions and timeline contracts with pending state', () => {
    const descriptions = mount(UiDescriptions, {
      props: {
        title: 'Metadata',
        bordered: true,
        items: [
          { label: 'Layer', value: '@ww/core' },
          { label: 'Coverage', value: 'Stories + tests', span: 2 },
        ],
      },
      slots: {
        extra: 'Stable',
      },
    });

    expect(descriptions.text()).toContain('Metadata');
    expect(descriptions.text()).toContain('Stories + tests');
    expect(descriptions.classes()).toContain('ui-descriptions--bordered');
    expect(descriptions.find('.ui-descriptions__extra').text()).toContain('Stable');

    const timeline = mount(UiTimeline, {
      props: {
        items: [
          { title: 'Contract fixed', opposite: 'ADR' },
          { title: 'Stories updated', opposite: 'Docs', tone: 'success' },
        ],
        pending: true,
        pendingLabel: 'Awaiting notes',
      },
    });

    expect(timeline.findAll('.ui-timeline__item')).toHaveLength(3);
    expect(timeline.text()).toContain('Contract fixed');
    expect(timeline.text()).toContain('Awaiting notes');
  });

  it('formats statistic values and emits finish for countdowns', async () => {
    vi.useFakeTimers();
    const now = new Date('2026-04-04T10:00:00Z').getTime();
    vi.setSystemTime(now);

    const countdown = mount(UiStatistic, {
      props: {
        title: 'Countdown',
        countdownTo: now + 61_000,
      },
    });

    expect(countdown.text()).toContain('01:01');
    vi.advanceTimersByTime(61_000);
    await nextTick();

    expect(countdown.emitted('finish')).toHaveLength(1);
    expect(countdown.text()).toContain('00:00');

    const formatted = mount(UiStatistic, {
      props: {
        title: 'Metric',
        value: 98.4,
        precision: 1,
        suffix: '/100',
      },
    });

    expect(formatted.text()).toContain('98.4');
    expect(formatted.text()).toContain('/100');
  });

  it('paginates list items, preserves slots, and renders empty states', async () => {
    const wrapper = mount(UiList, {
      props: {
        title: 'Surfaces',
        dataSource: [
          { title: 'UiDescriptions', description: 'Metadata', meta: 'Display' },
          { title: 'UiStatistic', description: 'Metrics', meta: 'Display' },
          { title: 'UiResult', description: 'Outcome', meta: 'Feedback' },
        ],
        pageSize: 2,
        pagination: true,
        bordered: true,
      },
      slots: {
        item: `
          <template #item="{ item }">
            <strong>{{ item.title }}</strong>
            <p>{{ item.description }}</p>
          </template>
        `,
        meta: `
          <template #meta="{ item }">
            <span>{{ item.meta }}</span>
          </template>
        `,
        loadMore: 'Load more',
      },
    });

    expect(wrapper.text()).toContain('UiDescriptions');
    expect(wrapper.text()).toContain('Load more');

    await wrapper.get('button[aria-label="Next page"]').trigger('click');
    await nextTick();
    expect(wrapper.text()).toContain('UiResult');

    const empty = mount(UiList, {
      props: {
        dataSource: [],
        title: 'Empty',
      },
      slots: {
        empty: 'Nothing here',
      },
    });

    expect(empty.text()).toContain('Nothing here');
  });
});
