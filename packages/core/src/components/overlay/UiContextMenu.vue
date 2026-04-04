<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, ref, watch } from 'vue';

import { PrimitivePortal, useControllable, useId, type FloatingPlacement } from '@ww/primitives';

import UiMenu from '../navigation/UiMenu.vue';
import type { UiMenuItem, UiMenuValue } from '../navigation/menu-model';
import { useManagedTriggerAttributes, useTriggerElement } from './floating-utils';
import { useFloatingSurface } from './useFloatingSurface';

defineOptions({ name: 'UiContextMenu' });
const instance = getCurrentInstance();

const props = withDefaults(
  defineProps<{
    open?: boolean;
    defaultOpen?: boolean;
    items: UiMenuItem[];
    ariaLabel?: string;
    placement?: FloatingPlacement;
    offset?: number;
    disabled?: boolean;
    closeOnSelect?: boolean;
    portalTarget?: string | HTMLElement | null;
    id?: string;
  }>(),
  {
    ariaLabel: 'Context menu',
    closeOnSelect: true,
    disabled: false,
    offset: 8,
    placement: 'bottom-start',
  }
);

const emit = defineEmits<{
  'update:open': [value: boolean];
  select: [payload: { value: UiMenuValue | string; label: string }];
}>();

const fallbackId = useId('context-menu');
const menuId = computed(() => props.id ?? fallbackId.value);
const { triggerRef, wrapperRef } = useTriggerElement();
const anchorRef = ref<HTMLElement | null>(null);
const surfaceRef = ref<HTMLElement | null>(null);
const anchorPoint = ref({ x: 0, y: 0 });

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

const anchorStyle = computed<Record<string, string>>(() => ({
  left: `${anchorPoint.value.x}px`,
  top: `${anchorPoint.value.y}px`,
}));

const setOpen = (nextOpen: boolean) => {
  if (nextOpen && props.disabled) {
    return;
  }

  state.setValue(nextOpen);
};

const openAtPoint = (x: number, y: number) => {
  anchorPoint.value = { x, y };
  setOpen(true);
};

const onContextMenu = (event: MouseEvent) => {
  if (props.disabled) {
    return;
  }

  event.preventDefault();
  openAtPoint(event.clientX, event.clientY);
};

const onTriggerKeydown = (event: KeyboardEvent) => {
  if (props.disabled) {
    return;
  }

  if (event.key !== 'ContextMenu' && !(event.shiftKey && event.key === 'F10')) {
    return;
  }

  event.preventDefault();

  const trigger = triggerRef.value ?? wrapperRef.value;
  const rect = trigger?.getBoundingClientRect();
  if (!rect) {
    return;
  }

  openAtPoint(rect.left + Math.min(rect.width / 2, 16), rect.top + Math.min(rect.height / 2, 16));
};

const onSelect = (payload: { value: UiMenuValue | string; label: string }) => {
  emit('select', payload);

  if (props.closeOnSelect) {
    void nextTick(() => {
      setOpen(false);
    });
  }
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
  'aria-controls': props.disabled ? undefined : openState.value ? menuId.value : undefined,
  'aria-expanded': props.disabled ? undefined : String(openState.value),
  'aria-haspopup': props.disabled ? undefined : 'menu',
}));

const {
  handleSurfaceAfterEnter,
  handleSurfaceAfterLeave,
  handleSurfaceBeforeEnter,
  handleSurfaceBeforeLeave,
  placement,
  portalTarget,
  surfaceStyle,
  updatePosition,
} = useFloatingSurface(
  {
    open: openState,
    placement: computed(() => props.placement),
    offset: computed(() => props.offset),
    portalTarget: computed(() => props.portalTarget),
  },
  {
    kind: 'floating',
    motionPreset: 'fade-up-xs',
    close: () => setOpen(false),
    triggerRef,
    anchorRef,
    surfaceRef,
    dismissOnEscape: true,
    dismissOnFocusOutside: true,
    dismissOnPointerOutside: true,
    autoFocus: true,
    restoreFocus: true,
    initialFocus: () => surfaceRef.value?.querySelector<HTMLElement>('[role="menuitem"]') ?? null,
    getBoundaryElements: () => [wrapperRef.value],
  }
);

const contextMenuStyle = computed<Record<string, string>>(() => ({
  ...surfaceStyle.value,
}));

watch(openState, (isOpen, _, onCleanup) => {
  if (!isOpen) {
    return;
  }

  void nextTick(() => {
    void updatePosition();
  });

  const close = () => setOpen(false);
  window.addEventListener('resize', close);
  window.addEventListener('scroll', close, true);
  window.visualViewport?.addEventListener('resize', close);
  window.visualViewport?.addEventListener('scroll', close);

  onCleanup(() => {
    window.removeEventListener('resize', close);
    window.removeEventListener('scroll', close, true);
    window.visualViewport?.removeEventListener('resize', close);
    window.visualViewport?.removeEventListener('scroll', close);
  });
});
</script>

<template>
  <span
    ref="wrapperRef"
    class="ui-floating-trigger ui-context-menu__trigger"
    @contextmenu="onContextMenu"
    @keydown="onTriggerKeydown"
  >
    <slot name="trigger" />
    <span ref="anchorRef" class="ui-context-menu__anchor" :style="anchorStyle" aria-hidden="true" />
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
        :id="menuId"
        ref="surfaceRef"
        class="ui-floating ui-context-menu"
        :data-placement="placement"
        :style="contextMenuStyle"
        role="presentation"
      >
        <UiMenu :items="props.items" :aria-label="props.ariaLabel" @select="onSelect" />
      </section>
    </Transition>
  </PrimitivePortal>
</template>
