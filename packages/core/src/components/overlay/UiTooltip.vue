<script setup lang="ts">
/* istanbul ignore file */
import { computed, getCurrentInstance, onBeforeUnmount, ref, useSlots, watch } from 'vue';

import { PrimitivePortal, useControllable, useId, type FloatingPlacement } from '@ww/primitives';

import {
  normalizeDelayConfig,
  useManagedTriggerAttributes,
  useTriggerElement,
} from './floating-utils';
import { useFloatingSurface } from './useFloatingSurface';

defineOptions({ name: 'UiTooltip' });

const props = withDefaults(
  defineProps<{
    open?: boolean;
    defaultOpen?: boolean;
    content?: string;
    placement?: FloatingPlacement;
    trigger?: 'hover' | 'focus' | 'click' | 'manual';
    delay?: number | { show?: number; hide?: number };
    offset?: number;
    arrow?: boolean;
    disabled?: boolean;
    maxWidth?: number | string;
    portalTarget?: string | HTMLElement | null;
    id?: string;
  }>(),
  {
    arrow: false,
    disabled: false,
    offset: 8,
    placement: 'top',
    trigger: 'hover',
  }
);

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const slots = useSlots();
const instance = getCurrentInstance();
const fallbackId = useId('tooltip');
const tooltipId = computed(() => props.id ?? fallbackId.value);
const delay = computed(() => normalizeDelayConfig(props.delay, { show: 200, hide: 0 }));
const { triggerRef, wrapperRef, syncTriggerElement } = useTriggerElement();
const surfaceRef = ref<HTMLElement | null>(null);
const hoverWithinContent = ref(false);
const hasContent = computed(() => Boolean(props.content) || Boolean(slots.content));

const state = useControllable({
  defaultValue: props.defaultOpen ?? false,
  onChange: (value) => emit('update:open', value),
  value: computed(() =>
    Object.prototype.hasOwnProperty.call(instance?.vnode.props ?? {}, 'open')
      ? props.open
      : undefined
  ),
});
const openState = computed(() => !props.disabled && hasContent.value && state.currentValue.value);

let showTimer: number | null = null;
let hideTimer: number | null = null;

const clearTimers = () => {
  if (showTimer !== null) {
    window.clearTimeout(showTimer);
    showTimer = null;
  }

  if (hideTimer !== null) {
    window.clearTimeout(hideTimer);
    hideTimer = null;
  }
};

const setOpen = (nextOpen: boolean) => {
  clearTimers();
  if (nextOpen && (props.disabled || !hasContent.value)) {
    return;
  }

  state.setValue(nextOpen);
};

const scheduleOpen = () => {
  clearTimers();
  showTimer = window.setTimeout(() => {
    showTimer = null;
    setOpen(true);
  }, delay.value.show);
};

const scheduleClose = () => {
  clearTimers();
  hideTimer = window.setTimeout(() => {
    hideTimer = null;
    setOpen(false);
  }, delay.value.hide);
};

const isNodeWithinTooltip = (node: EventTarget | null) => {
  if (!(node instanceof Node)) {
    return false;
  }

  return Boolean(wrapperRef.value?.contains(node) || surfaceRef.value?.contains(node));
};

const onPointerEnter = () => {
  if (props.trigger === 'manual' || props.trigger === 'focus' || props.disabled) {
    return;
  }

  scheduleOpen();
};

const onPointerLeave = () => {
  if (props.trigger === 'manual' || props.trigger === 'focus') {
    return;
  }

  if (hoverWithinContent.value) {
    return;
  }

  scheduleClose();
};

const onContentPointerEnter = () => {
  hoverWithinContent.value = true;
  clearTimers();
};

const onContentPointerLeave = () => {
  hoverWithinContent.value = false;
  scheduleClose();
};

const onFocusIn = () => {
  if (props.trigger === 'manual' || props.trigger === 'click' || props.disabled) {
    return;
  }

  scheduleOpen();
};

const onFocusOut = (event: FocusEvent) => {
  if (props.trigger === 'manual' || props.trigger === 'click') {
    return;
  }

  if (isNodeWithinTooltip(event.relatedTarget)) {
    return;
  }

  scheduleClose();
};

const onClick = () => {
  if (props.trigger !== 'click' || props.disabled) {
    return;
  }

  setOpen(!openState.value);
};

watch(
  () => [props.disabled, hasContent.value] as const,
  ([disabled, contentPresent]) => {
    if (disabled || !contentPresent) {
      setOpen(false);
    }
  },
  { immediate: true }
);

watch(
  () => props.open,
  () => {
    clearTimers();
  }
);

useManagedTriggerAttributes(triggerRef, () => ({
  'aria-describedby': !props.disabled && hasContent.value ? tooltipId.value : undefined,
}));

const maxWidthStyle = computed(() => {
  if (props.maxWidth === undefined) {
    return undefined;
  }

  return typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth;
});

const {
  arrowStyle,
  handleSurfaceAfterEnter,
  handleSurfaceAfterLeave,
  handleSurfaceBeforeEnter,
  handleSurfaceBeforeLeave,
  placement,
  portalTarget,
  surfaceStyle,
} = useFloatingSurface(
  {
    open: openState,
    placement: computed(() => props.placement),
    offset: computed(() => props.offset),
    arrow: computed(() => props.arrow),
    portalTarget: computed(() => props.portalTarget),
  },
  {
    kind: 'tooltip',
    motionPreset: 'fade-in',
    close: () => setOpen(false),
    triggerRef,
    surfaceRef,
    dismissOnEscape: true,
    dismissOnFocusOutside: true,
    dismissOnPointerOutside: true,
    autoFocus: false,
    restoreFocus: false,
    getBoundaryElements: () => [wrapperRef.value],
  }
);
const tooltipStyle = computed<Record<string, string>>(() => ({
  ...surfaceStyle.value,
  ...(maxWidthStyle.value ? { maxWidth: maxWidthStyle.value } : {}),
}));

onBeforeUnmount(clearTimers);
</script>

<template>
  <span
    ref="wrapperRef"
    class="ui-floating-trigger ui-tooltip__trigger"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @click="onClick"
    @vue:mounted="syncTriggerElement"
  >
    <slot />
  </span>

  <PrimitivePortal :to="portalTarget">
    <Transition
      appear
      name="ui-motion"
      @before-enter="handleSurfaceBeforeEnter"
      @after-enter="handleSurfaceAfterEnter"
      @before-leave="handleSurfaceBeforeLeave"
      @after-leave="handleSurfaceAfterLeave"
    >
      <div
        v-if="props.disabled ? false : openState"
        :id="tooltipId"
        ref="surfaceRef"
        class="ui-floating ui-tooltip"
        :data-placement="placement"
        :style="tooltipStyle"
        role="tooltip"
        @pointerenter="onContentPointerEnter"
        @pointerleave="onContentPointerLeave"
      >
        <slot name="content">
          {{ props.content }}
        </slot>
        <span
          v-if="props.arrow"
          class="ui-floating__arrow"
          :class="`ui-floating__arrow--${placement}`"
          :style="arrowStyle"
          aria-hidden="true"
        />
      </div>
    </Transition>
  </PrimitivePortal>
</template>
