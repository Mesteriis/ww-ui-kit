<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';

import {
  afterCollapseMotion,
  beforeCollapseMotion,
  runCollapseMotion,
  useId,
} from '@ww/primitives';

import { useCollapseContext } from './collapse-context';

defineOptions({ name: 'UiCollapsePanel' });

const props = withDefaults(
  defineProps<{
    value: string;
    title?: string;
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  }
);

const collapse = useCollapseContext();

if (!collapse) {
  throw new Error('UiCollapsePanel must be used inside UiCollapse.');
}

const baseId = useId('collapse-panel');
const headerRef = ref<HTMLElement | null>(null);
const panelId = computed(() => `${baseId.value}-content`);
const headerId = computed(() => `${baseId.value}-header`);
const unregister = collapse.registerPanel(
  props.value,
  () => headerRef.value,
  () => props.disabled
);

onBeforeUnmount(unregister);

const isOpen = computed(() => collapse.isOpen(props.value));
const isTabStop = computed(() => !props.disabled && collapse.currentHeader.value === props.value);

const toggle = () => {
  if (props.disabled) {
    return;
  }

  collapse.toggle(props.value);
};

const onKeydown = async (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggle();
    return;
  }

  await collapse.onHeaderKeydown(event);
};

const onFocus = () => {
  collapse.setCurrentHeader(props.value);
};

const onBeforeEnter = (element: Element) => {
  if (element instanceof HTMLElement) {
    beforeCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' });
  }
};

const onEnter = (element: Element, done: () => void) => {
  if (element instanceof HTMLElement) {
    runCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' }, done);
    return;
  }

  done();
};

const onBeforeLeave = (element: Element) => {
  if (element instanceof HTMLElement) {
    beforeCollapseMotion(element, { phase: 'leave', preset: 'collapse-y-soft' });
  }
};

const onLeave = (element: Element, done: () => void) => {
  if (element instanceof HTMLElement) {
    runCollapseMotion(element, { phase: 'leave', preset: 'collapse-y-soft' }, done);
    return;
  }

  done();
};

const onAfterMotion = (element: Element) => {
  if (element instanceof HTMLElement) {
    afterCollapseMotion(element);
  }
};
</script>

<template>
  <section
    class="ui-collapse__panel"
    :class="{
      'is-open': isOpen,
      'is-disabled': props.disabled,
    }"
  >
    <button
      :id="headerId"
      ref="headerRef"
      class="ui-collapse__header"
      :class="`ui-collapse__header--${collapse.iconPosition.value}`"
      type="button"
      :disabled="props.disabled"
      :aria-expanded="isOpen"
      :aria-controls="panelId"
      :tabindex="isOpen || isTabStop ? 0 : -1"
      data-ui-motion="ring-focus-soft"
      @click="toggle"
      @keydown="(event) => void onKeydown(event)"
      @focus="onFocus"
    >
      <span
        v-if="collapse.iconPosition.value === 'start'"
        class="ui-collapse__icon"
        aria-hidden="true"
      >
        <slot name="icon">
          {{ isOpen ? '−' : '+' }}
        </slot>
      </span>
      <span class="ui-collapse__title">
        <slot name="title">
          {{ props.title }}
        </slot>
      </span>
      <span
        v-if="collapse.iconPosition.value === 'end'"
        class="ui-collapse__icon"
        aria-hidden="true"
      >
        <slot name="icon">
          {{ isOpen ? '−' : '+' }}
        </slot>
      </span>
    </button>

    <Transition
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @after-enter="onAfterMotion"
      @before-leave="onBeforeLeave"
      @leave="onLeave"
      @after-leave="onAfterMotion"
    >
      <div
        v-if="isOpen"
        :id="panelId"
        class="ui-collapse__content"
        role="region"
        :aria-labelledby="headerId"
      >
        <div class="ui-collapse__body">
          <slot />
        </div>
      </div>
    </Transition>
  </section>
</template>
