<script setup lang="ts">
/* istanbul ignore file */
import { computed, getCurrentInstance, onBeforeUnmount, ref, watch } from 'vue';

import { PrimitivePortal, useControllable, useId, type FloatingPlacement } from '@ww/primitives';

import {
  normalizeDelayConfig,
  useManagedTriggerAttributes,
  useTriggerElement,
} from './floating-utils';
import { useFloatingSurface } from './useFloatingSurface';

defineOptions({ name: 'UiPopover' });

const props = withDefaults(
  defineProps<{
    open?: boolean;
    defaultOpen?: boolean;
    placement?: FloatingPlacement;
    trigger?: 'click' | 'hover' | 'focus' | 'manual';
    delay?: number | { show?: number; hide?: number };
    offset?: number;
    arrow?: boolean;
    width?: 'auto' | 'trigger' | number;
    disabled?: boolean;
    closeOnClickOutside?: boolean;
    portalTarget?: string | HTMLElement | null;
    id?: string;
  }>(),
  {
    arrow: false,
    closeOnClickOutside: true,
    disabled: false,
    offset: 10,
    placement: 'bottom-start',
    trigger: 'click',
    width: 'auto',
  }
);

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const instance = getCurrentInstance();
const fallbackId = useId('popover');
const contentId = computed(() => props.id ?? fallbackId.value);
const delay = computed(() => normalizeDelayConfig(props.delay, { show: 100, hide: 80 }));
const { triggerRef, wrapperRef } = useTriggerElement();
const surfaceRef = ref<HTMLElement | null>(null);
const hoverWithinContent = ref(false);

const state = useControllable({
  defaultValue: props.defaultOpen ?? false,
  onChange: (value) => emit('update:open', value),
  value: computed(() =>
    Object.prototype.hasOwnProperty.call(instance?.vnode.props ?? {}, 'open')
      ? props.open
      : undefined
  ),
});
const openState = computed(() => !props.disabled && state.currentValue.value);

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
  if (nextOpen && props.disabled) {
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

const isNodeWithinPopover = (node: EventTarget | null) => {
  if (!(node instanceof Node)) {
    return false;
  }

  return Boolean(wrapperRef.value?.contains(node) || surfaceRef.value?.contains(node));
};

const onPointerEnter = () => {
  if (props.trigger !== 'hover' || props.disabled) {
    return;
  }

  scheduleOpen();
};

const onPointerLeave = () => {
  if (props.trigger !== 'hover' || hoverWithinContent.value) {
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

  if (props.trigger === 'hover') {
    scheduleClose();
  }
};

const onFocusIn = () => {
  if (props.disabled || props.trigger === 'manual' || props.trigger === 'click') {
    return;
  }

  scheduleOpen();
};

const onFocusOut = (event: FocusEvent) => {
  if (props.trigger === 'manual' || props.trigger === 'click') {
    return;
  }

  if (isNodeWithinPopover(event.relatedTarget)) {
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
  () => props.disabled,
  (disabled) => {
    if (disabled) {
      setOpen(false);
    }
  },
  { immediate: true }
);

useManagedTriggerAttributes(triggerRef, () => ({
  'aria-controls': openState.value ? contentId.value : undefined,
  'aria-expanded': props.trigger !== 'manual' ? String(openState.value) : undefined,
  'aria-haspopup': 'dialog',
}));

const {
  arrowStyle,
  handleSurfaceAfterEnter,
  handleSurfaceAfterLeave,
  handleSurfaceBeforeEnter,
  handleSurfaceBeforeLeave,
  placement,
  portalTarget,
  surfaceStyle,
  triggerWidth,
} = useFloatingSurface(
  {
    open: openState,
    placement: computed(() => props.placement),
    offset: computed(() => props.offset),
    arrow: computed(() => props.arrow),
    portalTarget: computed(() => props.portalTarget),
  },
  {
    kind: 'floating',
    motionPreset: 'fade-up-xs',
    close: () => setOpen(false),
    triggerRef,
    surfaceRef,
    dismissOnEscape: true,
    dismissOnFocusOutside: true,
    dismissOnPointerOutside: props.closeOnClickOutside,
    autoFocus: false,
    restoreFocus: computed(() => props.trigger !== 'hover'),
    getBoundaryElements: () => [wrapperRef.value],
  }
);

const widthStyle = computed(() => {
  if (props.width === 'trigger') {
    return `${triggerWidth.value}px`;
  }

  if (typeof props.width === 'number') {
    return `${props.width}px`;
  }

  return undefined;
});
const popoverStyle = computed<Record<string, string>>(() => ({
  ...surfaceStyle.value,
  ...(widthStyle.value ? { width: widthStyle.value } : {}),
}));

onBeforeUnmount(clearTimers);
</script>

<template>
  <span
    ref="wrapperRef"
    class="ui-floating-trigger ui-popover__trigger"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @click="onClick"
  >
    <slot name="trigger" />
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
      <section
        v-if="openState"
        :id="contentId"
        ref="surfaceRef"
        class="ui-floating ui-popover"
        :data-placement="placement"
        :style="popoverStyle"
        role="dialog"
        aria-modal="false"
        @pointerenter="onContentPointerEnter"
        @pointerleave="onContentPointerLeave"
      >
        <slot />
        <span
          v-if="props.arrow"
          class="ui-floating__arrow"
          aria-hidden="true"
          :style="arrowStyle"
        />
      </section>
    </Transition>
  </PrimitivePortal>
</template>
