import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import UiButton from './UiButton.vue';
import UiIconButton from './UiIconButton.vue';

describe('buttons', () => {
  it('renders button variants and loading semantics', () => {
    const wrapper = mount(UiButton, {
      props: {
        loading: true,
        variant: 'danger',
      },
      slots: {
        default: 'Delete',
      },
    });

    expect(wrapper.attributes('aria-busy')).toBe('true');
    expect(wrapper.attributes('disabled')).toBeDefined();
    expect(wrapper.text()).toContain('Delete');
    expect(wrapper.attributes('data-ui-button-tone')).toBe('danger');
    expect(wrapper.attributes('data-ui-button-appearance')).toBe('solid');
  });

  it('renders icon button with accessible label', () => {
    const wrapper = mount(UiIconButton, {
      props: {
        ariaLabel: 'Open menu',
      },
      slots: {
        default: '☰',
      },
    });

    expect(wrapper.attributes('aria-label')).toBe('Open menu');
    expect(wrapper.text()).not.toContain('Open menu');
  });

  it('resolves tone, appearance, and effect classes independently from legacy variants', () => {
    const wrapper = mount(UiButton, {
      props: {
        tone: 'warning',
        appearance: 'outline',
        effect: 'border-flow',
      },
      slots: {
        default: 'Inspect logs',
      },
    });

    expect(wrapper.classes()).toContain('ui-button--tone-warning');
    expect(wrapper.classes()).toContain('ui-button--appearance-outline');
    expect(wrapper.classes()).toContain('ui-button--effect-border-flow');
    expect(wrapper.attributes('data-ui-button-tone')).toBe('warning');
  });

  it('announces icon button loading state through aria-label', () => {
    const wrapper = mount(UiIconButton, {
      props: {
        ariaLabel: 'Refresh',
        loading: true,
      },
    });

    expect(wrapper.attributes('aria-busy')).toBe('true');
    expect(wrapper.attributes('aria-label')).toBe('Refresh, loading');
  });

  it('renders icon slots, block mode, and explicit button type', () => {
    const wrapper = mount(UiButton, {
      props: {
        block: true,
        tone: 'brand',
        appearance: 'ghost',
        type: 'submit',
      },
      slots: {
        default: 'Save',
        leftIcon: '<span>←</span>',
        rightIcon: '<span>→</span>',
      },
    });

    expect(wrapper.attributes('type')).toBe('submit');
    expect(wrapper.classes()).toContain('ui-button--block');
    expect(wrapper.findAll('.ui-button__icon')).toHaveLength(2);
    expect(wrapper.text()).toContain('Save');
  });
});
