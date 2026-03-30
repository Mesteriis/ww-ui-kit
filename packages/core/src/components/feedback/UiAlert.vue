<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';

import {
  afterCollapseMotion,
  beforeCollapseMotion,
  runCollapseMotion,
  useControllable,
} from '@ww/primitives';

defineOptions({ name: 'UiAlert' });

type UiAlertType = 'info' | 'success' | 'warning' | 'error';

const props = withDefaults(
  defineProps<{
    open?: boolean;
    defaultOpen?: boolean;
    type?: UiAlertType;
    title?: string;
    description?: string;
    closable?: boolean;
    showIcon?: boolean;
    banner?: boolean;
    appearance?: 'soft' | 'outline' | 'solid';
  }>(),
  {
    appearance: 'soft',
    banner: false,
    closable: false,
    showIcon: true,
    type: 'info',
  }
);

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const instance = getCurrentInstance();
const state = useControllable({
  defaultValue: props.defaultOpen ?? true,
  onChange: (value) => emit('update:open', value),
  value: computed(() =>
    Object.prototype.hasOwnProperty.call(instance?.vnode.props ?? {}, 'open')
      ? props.open
      : undefined
  ),
});
const onBeforeEnter = (element: Element) => {
  if (element instanceof HTMLElement) {
    element.style.opacity = '0';
  }
};

const onEnter = (element: Element, done: () => void) => {
  if (!(element instanceof HTMLElement)) {
    done();
    return;
  }

  beforeCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' });
  requestAnimationFrame(() => {
    element.style.opacity = '1';
    runCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' }, done);
  });
};

const onBeforeLeave = (element: Element) => {
  if (element instanceof HTMLElement) {
    element.style.opacity = '1';
  }
};

const onLeave = (element: Element, done: () => void) => {
  if (!(element instanceof HTMLElement)) {
    done();
    return;
  }

  beforeCollapseMotion(element, { phase: 'leave', preset: 'collapse-y-soft' });
  element.style.opacity = '1';
  runCollapseMotion(element, { phase: 'leave', preset: 'collapse-y-soft' }, done);
};

const onAfterMotion = (element: Element) => {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  afterCollapseMotion(element);
};

const dismiss = () => {
  state.setValue(false);
};

const role = computed(() =>
  props.type === 'warning' || props.type === 'error' ? 'alert' : 'status'
);
const defaultIcon = computed(() => {
  switch (props.type) {
    case 'success':
      return '✓';
    case 'warning':
      return '!';
    case 'error':
      return '⨯';
    case 'info':
    default:
      return 'i';
  }
});
</script>

<template>
  <Transition
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterMotion"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @after-leave="onAfterMotion"
  >
    <section
      v-if="state.currentValue.value"
      class="ui-alert"
      :class="[
        `ui-alert--${props.type}`,
        `ui-alert--${props.appearance}`,
        {
          'ui-alert--banner': props.banner,
        },
      ]"
      :role="role"
      :aria-live="role === 'alert' ? 'assertive' : 'polite'"
    >
      <div v-if="props.showIcon" class="ui-alert__icon" aria-hidden="true">
        <slot name="icon">
          {{ defaultIcon }}
        </slot>
      </div>

      <div class="ui-alert__body">
        <div v-if="props.title || $slots.title" class="ui-alert__title">
          <slot name="title">
            {{ props.title }}
          </slot>
        </div>
        <div v-if="props.description || $slots.default" class="ui-alert__description">
          <slot>
            {{ props.description }}
          </slot>
        </div>
        <div v-if="$slots.action" class="ui-alert__actions">
          <slot name="action" />
        </div>
      </div>

      <div v-if="props.closable || $slots.close" class="ui-alert__close">
        <slot name="close" :close="dismiss">
          <button
            type="button"
            class="ui-alert__close-button"
            data-ui-motion="ring-focus-soft"
            aria-label="Dismiss alert"
            @click="dismiss"
          >
            ×
          </button>
        </slot>
      </div>
    </section>
  </Transition>
</template>
