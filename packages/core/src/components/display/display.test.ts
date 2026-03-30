import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import UiBadge from './UiBadge.vue';
import UiCard from './UiCard.vue';
import UiDivider from './UiDivider.vue';
import UiSkeleton from './UiSkeleton.vue';
import UiSpinner from './UiSpinner.vue';
import UiTag from './UiTag.vue';

describe('display components', () => {
  it('renders badge, card, divider, spinner, and skeleton', () => {
    const badge = mount(UiBadge, {
      props: { variant: 'brand' },
      slots: { default: 'Brand' },
    });
    const card = mount(UiCard, {
      slots: {
        default: 'Body',
        footer: 'Footer',
        header: 'Header',
      },
    });
    const divider = mount(UiDivider, {
      props: { orientation: 'vertical' },
    });
    const spinner = mount(UiSpinner, {
      props: { size: 'lg' },
    });
    const skeleton = mount(UiSkeleton, {
      props: { shape: 'circle', width: '4rem' },
    });

    expect(badge.classes()).toContain('ui-badge--brand');
    expect(card.text()).toContain('Header');
    expect(divider.attributes('aria-orientation')).toBe('vertical');
    expect(spinner.attributes('role')).toBe('status');
    expect(skeleton.attributes('aria-hidden')).toBe('true');
  });

  it('applies display defaults and inline sizing contracts', () => {
    const badge = mount(UiBadge, {
      slots: { default: 'Neutral' },
    });
    const bareCard = mount(UiCard, {
      slots: {
        default: 'Body only',
      },
    });
    const divider = mount(UiDivider);
    const spinner = mount(UiSpinner, {
      props: {
        size: 'sm',
        label: 'Loading data',
      },
    });
    const skeleton = mount(UiSkeleton, {
      props: {
        width: '12rem',
        height: '2rem',
        shape: 'rect',
      },
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

  it('supports clickable and closable tag states', async () => {
    const wrapper = mount(UiTag, {
      props: {
        clickable: true,
        closable: true,
        ellipsis: true,
        label: 'Needs review',
        variant: 'warning',
      },
    });

    expect(wrapper.classes()).toContain('ui-tag--warning');
    expect(wrapper.classes()).toContain('ui-tag--ellipsis');

    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);

    await wrapper.get('button[aria-label="Remove tag"]').trigger('click');
    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('covers tag keyboard activation, icon slots, button roots, and disabled guards', async () => {
    const buttonTag = mount(UiTag, {
      props: {
        clickable: true,
        label: 'Open release',
      },
      slots: {
        icon: '◇',
      },
    });

    expect(buttonTag.element.tagName).toBe('BUTTON');
    expect(buttonTag.attributes('type')).toBe('button');
    expect(buttonTag.find('.ui-tag__icon').exists()).toBe(true);

    await buttonTag.trigger('click');
    expect(buttonTag.emitted('click')).toHaveLength(1);

    const keyboardTag = mount(UiTag, {
      props: {
        clickable: true,
        closable: true,
        label: 'Keyboard tag',
      },
    });

    expect(keyboardTag.attributes('role')).toBe('button');
    expect(keyboardTag.attributes('tabindex')).toBe('0');

    await keyboardTag.trigger('keydown', { key: 'Enter' });
    await keyboardTag.trigger('keydown', { key: ' ' });
    await keyboardTag.trigger('keydown', { key: 'Escape' });
    expect(keyboardTag.emitted('click')).toHaveLength(2);

    const disabledTag = mount(UiTag, {
      props: {
        clickable: true,
        closable: true,
        disabled: true,
        label: 'Disabled tag',
      },
    });

    await disabledTag.trigger('click');
    await disabledTag.trigger('keydown', { key: 'Enter' });
    await disabledTag.get('button[aria-label="Remove tag"]').trigger('click');
    expect(disabledTag.emitted('click')).toBeUndefined();
    expect(disabledTag.emitted('close')).toBeUndefined();

    const disabledSetupState = disabledTag.vm.$.setupState as {
      onClose: (event: MouseEvent) => void;
    };
    disabledSetupState.onClose(new MouseEvent('click'));
    expect(disabledTag.emitted('close')).toBeUndefined();
  });
});
