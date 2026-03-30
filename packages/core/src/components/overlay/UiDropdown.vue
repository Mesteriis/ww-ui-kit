<script setup lang="ts">
/* istanbul ignore file */
import {
  computed,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  ref,
  watch,
  type ComponentPublicInstance,
} from 'vue';

import {
  PrimitivePortal,
  useControllable,
  useId,
  useRovingFocus,
  type FloatingPlacement,
} from '@ww/primitives';

import {
  normalizeDelayConfig,
  useManagedTriggerAttributes,
  useTriggerElement,
} from './floating-utils';
import { useFloatingSurface } from './useFloatingSurface';
import {
  findMenuTypeaheadMatch,
  flattenMenuItems,
  normalizeMenuItems,
  type NormalizedUiMenuEntry,
  type UiMenuItem,
  type UiMenuValue,
} from '../navigation/menu-model';

defineOptions({ name: 'UiDropdown' });

const props = withDefaults(
  defineProps<{
    open?: boolean;
    defaultOpen?: boolean;
    items: UiMenuItem[];
    placement?: FloatingPlacement;
    trigger?: 'click' | 'hover' | 'manual';
    delay?: number | { show?: number; hide?: number };
    offset?: number;
    arrow?: boolean;
    disabled?: boolean;
    closeOnSelect?: boolean;
    portalTarget?: string | HTMLElement | null;
    id?: string;
  }>(),
  {
    arrow: false,
    closeOnSelect: true,
    disabled: false,
    offset: 10,
    placement: 'bottom-start',
    trigger: 'click',
  }
);

const emit = defineEmits<{
  'update:open': [value: boolean];
  select: [payload: { value: UiMenuValue | string; label: string }];
}>();

const fallbackId = useId('dropdown');
const instance = getCurrentInstance();
const menuId = computed(() => props.id ?? fallbackId.value);
const delay = computed(() => normalizeDelayConfig(props.delay, { show: 80, hide: 100 }));
const normalizedItems = computed(() => normalizeMenuItems(props.items));
const flatItems = computed(() => flattenMenuItems(normalizedItems.value));
const flatItemMap = computed(() => new Map(flatItems.value.map((item) => [item.id, item])));
const { triggerRef, wrapperRef } = useTriggerElement();
const surfaceRef = ref<HTMLElement | null>(null);
const hoverWithinContent = ref(false);
const autoFocusMenu = ref(props.trigger !== 'hover');
const itemElements = new Map<string, HTMLElement>();
const typeaheadBuffer = ref('');
let unregisterItems: Array<() => void> = [];

const roving = useRovingFocus({
  loop: true,
  orientation: 'vertical',
});

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
let typeaheadTimer: number | null = null;

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

const clearTypeahead = () => {
  if (typeaheadTimer !== null) {
    window.clearTimeout(typeaheadTimer);
    typeaheadTimer = null;
  }

  typeaheadBuffer.value = '';
};

const setOpen = (nextOpen: boolean, source: 'hover' | 'focus' | 'click' | 'manual' = 'manual') => {
  clearTimers();
  if (nextOpen && props.disabled) {
    return;
  }

  if (nextOpen) {
    autoFocusMenu.value = source !== 'hover';
  } else {
    clearTypeahead();
  }

  state.setValue(nextOpen);
};

const scheduleOpen = (source: 'hover' | 'focus') => {
  clearTimers();
  showTimer = window.setTimeout(() => {
    showTimer = null;
    setOpen(true, source);
  }, delay.value.show);
};

const scheduleClose = () => {
  clearTimers();
  hideTimer = window.setTimeout(() => {
    hideTimer = null;
    setOpen(false);
  }, delay.value.hide);
};

const isNodeWithinDropdown = (node: EventTarget | null) => {
  if (!(node instanceof Node)) {
    return false;
  }

  return Boolean(wrapperRef.value?.contains(node) || surfaceRef.value?.contains(node));
};

const onPointerEnter = () => {
  if (props.trigger !== 'hover' || props.disabled) {
    return;
  }

  scheduleOpen('hover');
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

  scheduleOpen('focus');
};

const onFocusOut = (event: FocusEvent) => {
  if (props.trigger === 'manual' || props.trigger === 'click') {
    return;
  }

  if (isNodeWithinDropdown(event.relatedTarget)) {
    return;
  }

  scheduleClose();
};

const onClick = () => {
  if (props.trigger !== 'click' || props.disabled) {
    return;
  }

  setOpen(!openState.value, 'click');
};

const ensureCurrentItem = () => {
  const currentId = roving.currentId.value;
  if (
    currentId &&
    flatItemMap.value.get(currentId) &&
    !flatItemMap.value.get(currentId)?.disabled
  ) {
    return;
  }

  const firstEnabledItem = flatItems.value.find((item) => !item.disabled);
  if (firstEnabledItem) {
    roving.setCurrentId(firstEnabledItem.id);
  }
};

watch(
  flatItems,
  (items) => {
    for (const unregister of unregisterItems) {
      unregister();
    }

    unregisterItems = items.map((item) =>
      roving.registerItem({
        id: item.id,
        element: () => itemElements.get(item.id) ?? null,
        disabled: () => item.disabled,
      })
    );

    ensureCurrentItem();
  },
  { immediate: true }
);

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) {
      setOpen(false);
    }
  },
  { immediate: true }
);

watch(openState, (isOpen) => {
  if (isOpen) {
    ensureCurrentItem();
  }
});

useManagedTriggerAttributes(triggerRef, () => ({
  'aria-controls': openState.value ? menuId.value : undefined,
  'aria-expanded': props.trigger !== 'manual' ? String(openState.value) : undefined,
  'aria-haspopup': 'menu',
}));

onBeforeUnmount(() => {
  for (const unregister of unregisterItems) {
    unregister();
  }
});

const registerMenuItem = (id: string) => (element: Element | ComponentPublicInstance | null) => {
  if (element instanceof HTMLElement) {
    itemElements.set(id, element);
    return;
  }

  itemElements.delete(id);
};

const getCurrentItem = () => {
  const currentId = roving.currentId.value;
  if (!currentId) {
    return null;
  }

  return flatItemMap.value.get(currentId) ?? null;
};

const focusItem = async (id: string) => {
  roving.setCurrentId(id);
  const currentElement = itemElements.get(id);
  if (currentElement) {
    currentElement.focus();
    return;
  }

  await nextTick();
  itemElements.get(id)?.focus();
};

const onItemFocus = (id: string) => {
  roving.setCurrentId(id);
};

const selectItem = (item: Extract<NormalizedUiMenuEntry, { kind: 'item' }>) => {
  if (item.disabled) {
    return;
  }

  emit('select', {
    value: item.value,
    label: item.label,
  });

  if (props.closeOnSelect) {
    setOpen(false);
  }
};

const onMenuKeydown = async (event: KeyboardEvent) => {
  const handled = await roving.onKeydown(event);
  if (handled) {
    return;
  }

  if ((event.key === 'Enter' || event.key === ' ') && roving.currentId.value) {
    event.preventDefault();
    const item = getCurrentItem();
    if (item) {
      selectItem(item);
    }
    return;
  }

  if (event.key.length !== 1 || event.altKey || event.ctrlKey || event.metaKey) {
    return;
  }

  event.preventDefault();
  typeaheadBuffer.value = `${typeaheadBuffer.value}${event.key.toLowerCase()}`;
  if (typeaheadTimer !== null) {
    window.clearTimeout(typeaheadTimer);
  }

  typeaheadTimer = window.setTimeout(() => {
    typeaheadTimer = null;
    typeaheadBuffer.value = '';
  }, 500);

  const matchedItem = findMenuTypeaheadMatch(
    flatItems.value,
    typeaheadBuffer.value,
    roving.currentId.value
  );

  if (matchedItem) {
    await focusItem(matchedItem.id);
  }
};

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
    dismissOnPointerOutside: true,
    autoFocus: computed(() => autoFocusMenu.value),
    restoreFocus: computed(() => autoFocusMenu.value),
    initialFocus: () => {
      const currentItem =
        getCurrentItem() ?? flatItems.value.find((item) => !item.disabled) ?? null;
      return currentItem ? (itemElements.get(currentItem.id) ?? null) : null;
    },
    getBoundaryElements: () => [wrapperRef.value],
  }
);

const minWidthStyle = computed(() =>
  triggerWidth.value > 0 ? `${triggerWidth.value}px` : undefined
);
const dropdownStyle = computed<Record<string, string>>(() => ({
  ...surfaceStyle.value,
  ...(minWidthStyle.value ? { minWidth: minWidthStyle.value } : {}),
}));
</script>

<template>
  <span
    ref="wrapperRef"
    class="ui-floating-trigger ui-dropdown__trigger"
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
      <div
        v-if="openState"
        :id="menuId"
        ref="surfaceRef"
        class="ui-floating ui-dropdown"
        :data-placement="placement"
        :style="dropdownStyle"
        role="menu"
        @keydown="(event) => void onMenuKeydown(event)"
        @pointerenter="onContentPointerEnter"
        @pointerleave="onContentPointerLeave"
      >
        <ul class="ui-dropdown__list" role="none">
          <template v-for="entry in normalizedItems" :key="entry.id">
            <li v-if="entry.kind === 'divider'" class="ui-dropdown__divider" role="separator" />
            <li v-else-if="entry.kind === 'group'" class="ui-dropdown__group" role="presentation">
              <div class="ui-dropdown__group-label">{{ entry.label }}</div>
              <ul class="ui-dropdown__group-list" role="group" :aria-label="entry.label">
                <li
                  v-for="groupEntry in entry.items"
                  :key="groupEntry.id"
                  class="ui-dropdown__row"
                  role="presentation"
                >
                  <button
                    v-if="groupEntry.kind === 'item'"
                    :ref="registerMenuItem(groupEntry.id)"
                    class="ui-dropdown__item"
                    :class="{ 'is-active': roving.currentId.value === groupEntry.id }"
                    type="button"
                    role="menuitem"
                    :disabled="groupEntry.disabled"
                    :tabindex="
                      groupEntry.disabled ? -1 : roving.currentId.value === groupEntry.id ? 0 : -1
                    "
                    data-ui-motion="ring-focus-soft"
                    @focus="onItemFocus(groupEntry.id)"
                    @mouseenter="onItemFocus(groupEntry.id)"
                    @click="selectItem(groupEntry)"
                  >
                    <span v-if="groupEntry.icon" class="ui-dropdown__icon" aria-hidden="true">
                      {{ groupEntry.icon }}
                    </span>
                    <span class="ui-dropdown__label">{{ groupEntry.label }}</span>
                  </button>
                </li>
              </ul>
            </li>
            <li v-else class="ui-dropdown__row" role="presentation">
              <button
                :ref="registerMenuItem(entry.id)"
                class="ui-dropdown__item"
                :class="{ 'is-active': roving.currentId.value === entry.id }"
                type="button"
                role="menuitem"
                :disabled="entry.disabled"
                :tabindex="entry.disabled ? -1 : roving.currentId.value === entry.id ? 0 : -1"
                data-ui-motion="ring-focus-soft"
                @focus="onItemFocus(entry.id)"
                @mouseenter="onItemFocus(entry.id)"
                @click="selectItem(entry)"
              >
                <span v-if="entry.icon" class="ui-dropdown__icon" aria-hidden="true">
                  {{ entry.icon }}
                </span>
                <span class="ui-dropdown__label">{{ entry.label }}</span>
              </button>
            </li>
          </template>
        </ul>

        <span
          v-if="props.arrow"
          class="ui-floating__arrow"
          aria-hidden="true"
          :style="arrowStyle"
        />
      </div>
    </Transition>
  </PrimitivePortal>
</template>
