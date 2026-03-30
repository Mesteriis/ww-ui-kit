<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch, type ComponentPublicInstance } from 'vue';

import { useControllable, useRovingFocus } from '@ww/primitives';

import {
  findMenuItemByKey,
  findMenuTypeaheadMatch,
  flattenMenuItems,
  normalizeMenuItems,
  type UiMenuItem,
  type UiMenuValue,
} from './menu-model';

defineOptions({ name: 'UiMenu' });

export type UiMenuMode = 'vertical' | 'horizontal';
export type { UiMenuItem, UiMenuValue };

const props = withDefaults(
  defineProps<{
    items: UiMenuItem[];
    mode?: UiMenuMode;
    selectedKeys?: string[];
    defaultSelectedKeys?: string[];
    ariaLabel?: string;
  }>(),
  {
    ariaLabel: 'Menu',
    defaultSelectedKeys: () => [],
    mode: 'vertical',
  }
);

const emit = defineEmits<{
  'update:selectedKeys': [value: string[]];
  select: [payload: { key: string; label: string; value: UiMenuValue | string }];
}>();

const selectedState = useControllable({
  defaultValue: props.defaultSelectedKeys,
  onChange: (value) => emit('update:selectedKeys', value),
  value: computed(() => props.selectedKeys),
});

const normalizedItems = computed(() => normalizeMenuItems(props.items));
const flatItems = computed(() => flattenMenuItems(normalizedItems.value));
const selectedKeySet = computed(() => new Set(selectedState.currentValue.value));
const itemElements = new Map<string, HTMLElement>();
const typeaheadBuffer = ref('');
const roving = useRovingFocus({
  loop: true,
  orientation: computed(() => props.mode),
});

let typeaheadTimer: number | null = null;
let unregisterItems: Array<() => void> = [];

const clearTypeahead = () => {
  window.clearTimeout(Number(typeaheadTimer));
  typeaheadTimer = null;
  typeaheadBuffer.value = '';
};

const ensureCurrentItem = () => {
  const selectedItem = flatItems.value.find(
    (item) => selectedKeySet.value.has(item.key) && !item.disabled
  );
  if (selectedItem) {
    roving.setCurrentId(selectedItem.key);
    return;
  }

  const currentItem = flatItems.value.find(
    (item) => item.key === roving.currentId.value && !item.disabled
  );
  if (currentItem) {
    roving.setCurrentId(currentItem.key);
  }
};

watch(
  flatItems,
  (items) => {
    unregisterItems.forEach((unregister) => unregister());

    unregisterItems = items.map((item) =>
      roving.registerItem({
        id: item.key,
        element: () => itemElements.get(item.key) as HTMLElement | null,
        disabled: () => item.disabled,
      })
    );

    ensureCurrentItem();
  },
  { immediate: true }
);

watch(selectedKeySet, ensureCurrentItem);

const registerItem = (key: string) => (element: Element | ComponentPublicInstance | null) => {
  if (element instanceof HTMLElement) {
    itemElements.set(key, element);
    return;
  }

  itemElements.delete(key);
};

const focusItem = async (key: string) => {
  roving.setCurrentId(key);
  itemElements.get(key)?.focus();
  await nextTick();
  itemElements.get(key)?.focus();
};

const onItemFocus = (key: string) => {
  const item = flatItems.value.find((entry) => entry.key === key);
  if (!item || item.disabled) {
    return;
  }

  roving.setCurrentId(key);
};

const activateItem = (key: string) => {
  const item = findMenuItemByKey(normalizedItems.value, key);
  if (!item || item.disabled) {
    return;
  }

  selectedState.setValue([item.key]);
  emit('select', {
    key: item.key,
    label: item.label,
    value: item.value,
  });
};

const onMenuKeydown = async (event: KeyboardEvent) => {
  const handled = await roving.onKeydown(event);
  if (handled) {
    return;
  }

  if ((event.key === 'Enter' || event.key === ' ') && roving.currentId.value) {
    event.preventDefault();
    activateItem(roving.currentId.value);
    return;
  }

  if (event.key.length !== 1 || event.altKey || event.ctrlKey || event.metaKey) {
    return;
  }

  event.preventDefault();
  typeaheadBuffer.value = `${typeaheadBuffer.value}${event.key.toLowerCase()}`;
  window.clearTimeout(typeaheadTimer ?? undefined);
  typeaheadTimer = window.setTimeout(clearTypeahead, 500);

  const match = findMenuTypeaheadMatch(
    flatItems.value,
    typeaheadBuffer.value,
    roving.currentId.value
  );
  if (!match) {
    return;
  }

  await focusItem(match.id);
};

onBeforeUnmount(() => {
  clearTypeahead();
  unregisterItems.forEach((unregister) => unregister());
  unregisterItems = [];
});
</script>

<template>
  <nav class="ui-menu" :data-mode="props.mode" :aria-label="props.ariaLabel">
    <ul
      class="ui-menu__list"
      role="menu"
      :aria-orientation="props.mode"
      @keydown="(event) => void onMenuKeydown(event)"
    >
      <template v-for="entry in normalizedItems" :key="entry.key">
        <li v-if="entry.kind === 'divider'" class="ui-menu__divider" role="separator" />
        <li v-else-if="entry.kind === 'group'" class="ui-menu__group" role="presentation">
          <div class="ui-menu__group-label">{{ entry.label }}</div>
          <ul class="ui-menu__group-list" role="group" :aria-label="entry.label">
            <li
              v-for="item in entry.items"
              :key="item.key"
              class="ui-menu__item"
              role="presentation"
            >
              <component
                :is="item.href ? 'a' : 'button'"
                v-if="item.kind === 'item'"
                :ref="registerItem(item.key)"
                class="ui-menu__action"
                :class="{
                  'is-active': roving.currentId.value === item.key,
                  'is-selected': selectedKeySet.has(item.key),
                }"
                :type="item.href ? undefined : 'button'"
                :href="item.href"
                :disabled="item.href ? undefined : item.disabled"
                :role="'menuitem'"
                :tabindex="!item.disabled && roving.currentId.value === item.key ? 0 : -1"
                :aria-disabled="item.disabled || undefined"
                :data-selected="selectedKeySet.has(item.key) || undefined"
                data-ui-motion="ring-focus-soft"
                @focus="onItemFocus(item.key)"
                @mouseenter="onItemFocus(item.key)"
                @click="activateItem(item.key)"
              >
                <span v-if="item.icon" class="ui-menu__icon" aria-hidden="true">
                  {{ item.icon }}
                </span>
                <slot name="item" :item="item" :selected="selectedKeySet.has(item.key)">
                  <span class="ui-menu__label">{{ item.label }}</span>
                </slot>
              </component>
            </li>
          </ul>
        </li>
        <li v-else class="ui-menu__item" role="presentation">
          <component
            :is="entry.href ? 'a' : 'button'"
            :ref="registerItem(entry.key)"
            class="ui-menu__action"
            :class="{
              'is-active': roving.currentId.value === entry.key,
              'is-selected': selectedKeySet.has(entry.key),
            }"
            :type="entry.href ? undefined : 'button'"
            :href="entry.href"
            :disabled="entry.href ? undefined : entry.disabled"
            :role="'menuitem'"
            :tabindex="entry.disabled ? -1 : roving.currentId.value === entry.key ? 0 : -1"
            :aria-disabled="entry.disabled || undefined"
            :data-selected="selectedKeySet.has(entry.key) || undefined"
            data-ui-motion="ring-focus-soft"
            @focus="onItemFocus(entry.key)"
            @mouseenter="onItemFocus(entry.key)"
            @click="activateItem(entry.key)"
          >
            <span v-if="entry.icon" class="ui-menu__icon" aria-hidden="true">
              {{ entry.icon }}
            </span>
            <slot name="item" :item="entry" :selected="selectedKeySet.has(entry.key)">
              <span class="ui-menu__label">{{ entry.label }}</span>
            </slot>
          </component>
        </li>
      </template>
    </ul>
  </nav>
</template>
