import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import UiBadge from './UiBadge.vue';
import UiCard from './UiCard.vue';
import UiDivider from './UiDivider.vue';
import UiSkeleton from './UiSkeleton.vue';
import UiSpinner from './UiSpinner.vue';

describe('display components', () => {
  it('renders badge, card, divider, spinner, and skeleton', () => {
    const badge = mount(UiBadge, {
      props: { variant: 'brand' },
      slots: { default: 'Brand' }
    });
    const card = mount(UiCard, {
      slots: {
        default: 'Body',
        footer: 'Footer',
        header: 'Header'
      }
    });
    const divider = mount(UiDivider, {
      props: { orientation: 'vertical' }
    });
    const spinner = mount(UiSpinner, {
      props: { size: 'lg' }
    });
    const skeleton = mount(UiSkeleton, {
      props: { shape: 'circle', width: '4rem' }
    });

    expect(badge.classes()).toContain('ui-badge--brand');
    expect(card.text()).toContain('Header');
    expect(divider.attributes('aria-orientation')).toBe('vertical');
    expect(spinner.attributes('role')).toBe('status');
    expect(skeleton.attributes('aria-hidden')).toBe('true');
  });

  it('applies display defaults and inline sizing contracts', () => {
    const badge = mount(UiBadge, {
      slots: { default: 'Neutral' }
    });
    const bareCard = mount(UiCard, {
      slots: {
        default: 'Body only'
      }
    });
    const divider = mount(UiDivider);
    const spinner = mount(UiSpinner, {
      props: {
        size: 'sm',
        label: 'Loading data'
      }
    });
    const skeleton = mount(UiSkeleton, {
      props: {
        width: '12rem',
        height: '2rem',
        shape: 'rect'
      }
    });

    expect(badge.classes()).toContain('ui-badge--neutral');
    expect(bareCard.find('.ui-card__header').exists()).toBe(false);
    expect(bareCard.find('.ui-card__footer').exists()).toBe(false);
    expect(divider.attributes('aria-orientation')).toBe('horizontal');
    expect(spinner.attributes('aria-label')).toBe('Loading data');
    expect(spinner.classes()).toContain('ui-spinner--sm');
    expect(skeleton.attributes('style')).toContain('--ui-skeleton-width: 12rem;');
    expect(skeleton.attributes('style')).toContain('--ui-skeleton-height: 2rem;');
    expect(skeleton.classes()).toContain('ui-skeleton--rect');
  });

  it('covers default skeleton sizing and rounded shape fallback', () => {
    const skeleton = mount(UiSkeleton);

    expect(skeleton.attributes('style')).toContain('--ui-skeleton-width: 100%;');
    expect(skeleton.attributes('style')).toContain('--ui-skeleton-height: 1rem;');
    expect(skeleton.classes()).toContain('ui-skeleton--rounded');
  });
});
