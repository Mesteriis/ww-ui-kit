import { defineComponent, h, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import UiTabsList from './UiTabsList.vue';
import UiTabsPanel from './UiTabsPanel.vue';
import UiTabsRoot from './UiTabsRoot.vue';
import UiTabsTrigger from './UiTabsTrigger.vue';
import { createTabsContext } from './tabs-context';

describe('tabs', () => {
  it('supports roving focus and keyboard activation', async () => {
    const wrapper = mount(
      defineComponent({
        components: { UiTabsList, UiTabsPanel, UiTabsRoot, UiTabsTrigger },
        setup() {
          const value = ref('first');
          return { value };
        },
        template: `
          <UiTabsRoot v-model="value">
            <UiTabsList>
              <UiTabsTrigger value="first">First</UiTabsTrigger>
              <UiTabsTrigger value="second">Second</UiTabsTrigger>
              <UiTabsTrigger value="third">Third</UiTabsTrigger>
            </UiTabsList>
            <UiTabsPanel value="first">One</UiTabsPanel>
            <UiTabsPanel value="second">Two</UiTabsPanel>
            <UiTabsPanel value="third">Three</UiTabsPanel>
          </UiTabsRoot>
        `,
      }),
      {
        attachTo: document.body,
      }
    );

    const list = wrapper.get('[role="tablist"]');
    const triggers = wrapper.findAll('[role="tab"]');
    const [first, second, third] = triggers;

    if (!first || !second || !third) {
      throw new Error('Expected three tab triggers.');
    }

    await first.trigger('focus');
    await list.trigger('keydown', { key: 'ArrowRight' });
    await nextTick();

    expect(second.attributes('aria-selected')).toBe('true');

    await list.trigger('keydown', { key: 'End' });
    await nextTick();
    expect(third.attributes('aria-selected')).toBe('true');

    await list.trigger('keydown', { key: 'Home' });
    await nextTick();
    expect(first.attributes('aria-selected')).toBe('true');
    expect(wrapper.text()).toContain('One');
  });

  it('supports manual activation through click and exposes hidden inactive panels', async () => {
    const wrapper = mount(
      defineComponent({
        components: { UiTabsList, UiTabsPanel, UiTabsRoot, UiTabsTrigger },
        setup() {
          const value = ref('alpha');
          return { value };
        },
        template: `
          <UiTabsRoot v-model="value">
            <UiTabsList>
              <UiTabsTrigger value="alpha">Alpha</UiTabsTrigger>
              <UiTabsTrigger value="beta">Beta</UiTabsTrigger>
            </UiTabsList>
            <UiTabsPanel value="alpha">Alpha panel</UiTabsPanel>
            <UiTabsPanel value="beta">Beta panel</UiTabsPanel>
          </UiTabsRoot>
        `,
      })
    );

    const triggers = wrapper.findAll('[role="tab"]');
    const [alpha, beta] = triggers;
    if (!alpha || !beta) {
      throw new Error('Expected two tab triggers.');
    }

    expect(beta.attributes('tabindex')).toBe('-1');
    expect(
      wrapper
        .findAll('[role="tabpanel"]')
        .some((panel) => panel.attributes('style')?.includes('display: none'))
    ).toBe(true);

    await beta.trigger('click');
    await nextTick();

    expect(beta.attributes('aria-selected')).toBe('true');
    expect(wrapper.text()).toContain('Beta panel');
  });

  it('handles disabled triggers, provider errors, and direct tabs context branches', async () => {
    expect(() => mount(UiTabsList)).toThrow('UiTabsList must be used inside UiTabsRoot.');
    expect(() => mount(UiTabsTrigger, { props: { value: 'orphan' } })).toThrow(
      'UiTabsTrigger must be used inside UiTabsRoot.'
    );
    expect(() => mount(UiTabsPanel, { props: { value: 'orphan' } })).toThrow(
      'UiTabsPanel must be used inside UiTabsRoot.'
    );

    const wrapper = mount(
      defineComponent({
        components: { UiTabsList, UiTabsPanel, UiTabsRoot, UiTabsTrigger },
        setup() {
          const value = ref('primary');
          return { value };
        },
        template: `
          <UiTabsRoot v-model="value" orientation="vertical">
            <UiTabsList>
              <UiTabsTrigger value="primary">Primary</UiTabsTrigger>
              <UiTabsTrigger value="disabled" disabled>Disabled</UiTabsTrigger>
              <UiTabsTrigger value="secondary">Secondary</UiTabsTrigger>
            </UiTabsList>
            <UiTabsPanel value="primary">Primary panel</UiTabsPanel>
            <UiTabsPanel value="disabled">Disabled panel</UiTabsPanel>
            <UiTabsPanel value="secondary">Secondary panel</UiTabsPanel>
          </UiTabsRoot>
        `,
      }),
      {
        attachTo: document.body,
      }
    );

    const triggers = wrapper.findAll('[role="tab"]');
    const [primary, disabled, secondary] = triggers;
    if (!primary || !disabled || !secondary) {
      throw new Error('Expected three tab triggers.');
    }

    expect(disabled.attributes('disabled')).toBeDefined();
    expect(disabled.attributes('tabindex')).toBe('-1');

    await disabled.trigger('click');
    await disabled.trigger('keydown', { key: ' ' });
    expect(disabled.attributes('aria-selected')).toBe('false');

    await secondary.trigger('keydown', { key: 'Enter' });
    await nextTick();
    expect(secondary.attributes('aria-selected')).toBe('true');

    await primary.trigger('focus');
    expect(primary.attributes('aria-selected')).toBe('true');

    const ContextHarness = defineComponent({
      props: {
        defaultValue: {
          type: String,
          default: undefined,
        },
        modelValue: {
          type: String,
          default: undefined,
        },
        orientation: {
          type: String as () => 'horizontal' | 'vertical',
          default: 'horizontal',
        },
      },
      emits: ['update:modelValue'],
      setup(props, { emit, expose }) {
        const context = createTabsContext(props, (event, value) => emit(event, value));

        expose({ context });
        return () => h('div');
      },
    });

    const contextWrapper = mount(ContextHarness, {
      props: {
        orientation: 'horizontal',
      },
    });

    const context = (
      contextWrapper.vm as typeof contextWrapper.vm & {
        context: ReturnType<typeof createTabsContext>;
      }
    ).context;

    expect(context.currentValue.value).toBe('');

    const disabledButton = document.createElement('button');
    const enabledButton = document.createElement('button');
    document.body.append(disabledButton, enabledButton);

    const unregisterDisabled = context.registerTrigger(
      'disabled-first',
      () => disabledButton,
      () => true
    );
    expect(context.currentValue.value).toBe('');

    const unregisterEnabled = context.registerTrigger(
      'enabled-second',
      () => enabledButton,
      () => false
    );
    expect(context.currentValue.value).toBe('enabled-second');
    expect(context.currentTabStop.value).toBe('enabled-second');

    await context.onListKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(context.currentValue.value).toBe('enabled-second');

    context.setCurrentTabStop('disabled-first');
    expect(context.currentTabStop.value).toBe('disabled-first');
    expect(context.currentValue.value).toBe('enabled-second');

    unregisterDisabled();
    unregisterEnabled();
    disabledButton.remove();
    enabledButton.remove();
  });

  it('covers direct trigger handlers for disabled and non-selected tab-stop branches', async () => {
    const wrapper = mount(
      defineComponent({
        components: { UiTabsList, UiTabsPanel, UiTabsRoot, UiTabsTrigger },
        setup() {
          const value = ref('first');
          return { value };
        },
        template: `
          <UiTabsRoot v-model="value">
            <UiTabsList>
              <UiTabsTrigger value="first">First</UiTabsTrigger>
              <UiTabsTrigger value="second" disabled>Second</UiTabsTrigger>
            </UiTabsList>
            <UiTabsPanel value="first">One</UiTabsPanel>
            <UiTabsPanel value="second">Two</UiTabsPanel>
          </UiTabsRoot>
        `,
      }),
      {
        attachTo: document.body,
      }
    );

    const triggers = wrapper.findAllComponents(UiTabsTrigger);
    const [firstTrigger, secondTrigger] = triggers;
    if (!firstTrigger || !secondTrigger) {
      throw new Error('Expected tab triggers.');
    }

    const disabledSetupState = secondTrigger.vm.$.setupState as {
      onActivate: () => void;
      onKeydown: (event: KeyboardEvent) => void;
    };
    disabledSetupState.onActivate();
    disabledSetupState.onKeydown(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }));

    expect(secondTrigger.attributes('aria-selected')).toBe('false');
    expect(secondTrigger.attributes('tabindex')).toBe('-1');

    const activeSetupState = firstTrigger.vm.$.setupState as {
      onKeydown: (event: KeyboardEvent) => void;
    };
    const ignoredKey = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
    activeSetupState.onKeydown(ignoredKey);
    expect(ignoredKey.defaultPrevented).toBe(false);
  });
});
