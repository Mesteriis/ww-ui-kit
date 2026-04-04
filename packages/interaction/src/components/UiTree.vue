<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { UiIcon } from '@ww/core';
import { useControllable } from '@ww/primitives';

import UiVirtualList from './UiVirtualList.vue';
import {
  buildVisibleTreeNodes,
  collectAncestorKeys,
  normalizeTree,
  toggleCheckedKey,
  type UiTreeNode,
} from '../internal/tree';

defineOptions({ name: 'UiTree' });

const props = withDefaults(
  defineProps<{
    nodes: UiTreeNode[];
    modelValue?: string[];
    expandedKeys?: string[];
    checkedKeys?: string[];
    defaultExpandedKeys?: string[];
    defaultCheckedKeys?: string[];
    multiple?: boolean;
    checkable?: boolean;
    selectable?: boolean;
    searchValue?: string;
    ariaLabel?: string;
    virtual?: boolean;
    height?: number;
    itemSize?: number;
    loadChildren?: (node: UiTreeNode) => Promise<UiTreeNode[]>;
  }>(),
  {
    ariaLabel: 'Tree',
    checkable: false,
    defaultCheckedKeys: () => [],
    defaultExpandedKeys: () => [],
    height: 320,
    itemSize: 36,
    multiple: false,
    searchValue: '',
    selectable: true,
    virtual: false,
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
  'update:expandedKeys': [value: string[]];
  'update:checkedKeys': [value: string[]];
  select: [payload: { key: string; keys: string[] }];
  check: [payload: { key: string; keys: string[] }];
}>();

const loadedChildren = ref(new Map<string, UiTreeNode[]>());
const loadingKeys = ref<string[]>([]);
const activeKey = ref<string | null>(null);

const selectedState = useControllable<string[]>({
  defaultValue: [],
  onChange: (value) => emit('update:modelValue', value),
  value: computed(() => props.modelValue),
});
const expandedState = useControllable<string[]>({
  defaultValue: props.defaultExpandedKeys,
  onChange: (value) => emit('update:expandedKeys', value),
  value: computed(() => props.expandedKeys),
});
const checkedState = useControllable<string[]>({
  defaultValue: props.defaultCheckedKeys,
  onChange: (value) => emit('update:checkedKeys', value),
  value: computed(() => props.checkedKeys),
});

const registry = computed(() => normalizeTree(props.nodes, loadedChildren.value));
const visibleNodes = computed(() =>
  buildVisibleTreeNodes(
    registry.value,
    expandedState.currentValue.value,
    selectedState.currentValue.value,
    checkedState.currentValue.value,
    props.searchValue
  )
);

watch(
  visibleNodes,
  (nextVisible) => {
    if (nextVisible.length === 0) {
      activeKey.value = null;
      return;
    }

    if (activeKey.value && nextVisible.some((entry) => entry.node.key === activeKey.value)) {
      return;
    }

    activeKey.value = nextVisible[0]?.node.key ?? null;
  },
  { immediate: true }
);

const ensureLoadedChildren = async (key: string) => {
  if (!props.loadChildren) {
    return;
  }

  const node = registry.value.map.get(key);
  if (!node || node.disabled || node.children.length > 0 || node.leaf) {
    return;
  }

  if (loadingKeys.value.includes(key) || loadedChildren.value.has(key)) {
    return;
  }

  loadingKeys.value = [...loadingKeys.value, key];

  try {
    const children = await props.loadChildren(node);
    loadedChildren.value = new Map(loadedChildren.value).set(key, children);
  } finally {
    loadingKeys.value = loadingKeys.value.filter((entry) => entry !== key);
  }
};

const setExpandedKeys = async (keys: string[]) => {
  expandedState.setValue(keys);
  await Promise.all(keys.map((key) => ensureLoadedChildren(key)));
};

const toggleExpanded = async (key: string) => {
  const next = new Set(expandedState.currentValue.value);
  if (next.has(key)) {
    next.delete(key);
  } else {
    next.add(key);
  }

  await setExpandedKeys([...next]);
};

const selectKey = (key: string) => {
  const node = registry.value.map.get(key);
  if (!node || node.disabled || !props.selectable) {
    return;
  }

  const current = selectedState.currentValue.value;
  const nextKeys = props.multiple
    ? current.includes(key)
      ? current.filter((entry) => entry !== key)
      : [...current, key]
    : [key];

  selectedState.setValue(nextKeys);
  activeKey.value = key;
  emit('select', {
    key,
    keys: nextKeys,
  });
};

const toggleCheck = (key: string) => {
  if (!props.checkable) {
    return;
  }

  const node = registry.value.map.get(key);
  if (!node || node.disabled) {
    return;
  }

  const nextChecked = toggleCheckedKey(
    registry.value,
    checkedState.currentValue.value,
    key,
    !checkedState.currentValue.value.includes(key)
  );
  checkedState.setValue(nextChecked);
  emit('check', {
    key,
    keys: nextChecked,
  });
};

const moveActive = (step: number) => {
  if (visibleNodes.value.length === 0) {
    return;
  }

  const currentIndex = visibleNodes.value.findIndex((entry) => entry.node.key === activeKey.value);
  const nextIndex =
    currentIndex < 0
      ? 0
      : Math.min(Math.max(currentIndex + step, 0), visibleNodes.value.length - 1);
  activeKey.value = visibleNodes.value[nextIndex]?.node.key ?? activeKey.value;
};

const onKeydown = async (event: KeyboardEvent) => {
  const activeNode = visibleNodes.value.find((entry) => entry.node.key === activeKey.value);
  if (!activeNode) {
    return;
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    moveActive(1);
    return;
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault();
    moveActive(-1);
    return;
  }

  if (event.key === 'Home') {
    event.preventDefault();
    activeKey.value = visibleNodes.value[0]?.node.key ?? null;
    return;
  }

  if (event.key === 'End') {
    event.preventDefault();
    activeKey.value = visibleNodes.value.at(-1)?.node.key ?? null;
    return;
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault();
    if (activeNode.node.children.length > 0 && !activeNode.isExpanded) {
      await toggleExpanded(activeNode.node.key);
      return;
    }

    const child = activeNode.node.children[0];
    if (child) {
      activeKey.value = child.key;
    }
    return;
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    if (activeNode.isExpanded && activeNode.node.children.length > 0) {
      await toggleExpanded(activeNode.node.key);
      return;
    }

    const parentKey = collectAncestorKeys(registry.value, activeNode.node.key).at(-1);
    if (parentKey) {
      activeKey.value = parentKey;
    }
    return;
  }

  if (event.key === ' ' || event.key === 'Spacebar') {
    event.preventDefault();
    if (props.checkable) {
      toggleCheck(activeNode.node.key);
    } else {
      selectKey(activeNode.node.key);
    }
    return;
  }

  if (event.key === 'Enter') {
    event.preventDefault();
    selectKey(activeNode.node.key);
  }
};

const renderIndent = (level: number) => ({
  paddingInlineStart: `calc(var(--ui-space-3) + ${(level - 1) * 1.25}rem)`,
});

const resolveAriaChecked = (checked: boolean, halfChecked: boolean) => {
  if (halfChecked) {
    return 'mixed' as const;
  }

  return checked || false;
};
</script>

<template>
  <div
    class="ui-tree"
    role="tree"
    tabindex="0"
    :aria-label="props.ariaLabel"
    :aria-activedescendant="activeKey ?? undefined"
    @keydown="onKeydown"
  >
    <div v-if="visibleNodes.length === 0" class="ui-tree__empty">No matching nodes</div>

    <UiVirtualList
      v-else-if="props.virtual"
      :items="visibleNodes"
      :height="props.height"
      :item-size="props.itemSize"
      aria-label="Tree items"
    >
      <template #default="{ item }">
        <button
          :id="item.node.key"
          type="button"
          class="ui-tree__item"
          :class="{
            'is-active': item.node.key === activeKey,
            'is-selected': item.isSelected,
          }"
          role="treeitem"
          :aria-level="item.node.level"
          :aria-expanded="item.node.children.length > 0 ? item.isExpanded : undefined"
          :aria-selected="props.selectable ? item.isSelected : undefined"
          :aria-checked="props.checkable ? resolveAriaChecked(item.isChecked, item.isHalfChecked) : undefined"
          :disabled="item.node.disabled"
          :style="renderIndent(item.node.level)"
          @click="selectKey(item.node.key)"
        >
          <span class="ui-tree__toggle" @click.stop="item.node.children.length > 0 && toggleExpanded(item.node.key)">
            <UiIcon
              v-if="item.node.children.length > 0"
              :name="item.isExpanded ? 'chevronDown' : 'chevronRight'"
              decorative
            />
          </span>
          <span
            v-if="props.checkable"
            class="ui-tree__check"
            :data-state="item.isHalfChecked ? 'mixed' : item.isChecked ? 'checked' : 'unchecked'"
            @click.stop="toggleCheck(item.node.key)"
          >
            <UiIcon
              v-if="item.isHalfChecked || item.isChecked"
              :name="item.isHalfChecked ? 'minus' : 'check'"
              decorative
            />
          </span>
          <span class="ui-tree__label">
            <slot name="node" :node="item.node" :selected="item.isSelected">{{ item.node.label }}</slot>
          </span>
          <span v-if="loadingKeys.includes(item.node.key)" class="ui-tree__meta">Loading…</span>
        </button>
      </template>
    </UiVirtualList>

    <div v-else class="ui-tree__list">
      <button
        v-for="item in visibleNodes"
        :id="item.node.key"
        :key="item.node.key"
        type="button"
        class="ui-tree__item"
        :class="{
          'is-active': item.node.key === activeKey,
          'is-selected': item.isSelected,
        }"
        role="treeitem"
        :aria-level="item.node.level"
        :aria-expanded="item.node.children.length > 0 ? item.isExpanded : undefined"
        :aria-selected="props.selectable ? item.isSelected : undefined"
        :aria-checked="props.checkable ? resolveAriaChecked(item.isChecked, item.isHalfChecked) : undefined"
        :disabled="item.node.disabled"
        :style="renderIndent(item.node.level)"
        @click="selectKey(item.node.key)"
      >
        <span class="ui-tree__toggle" @click.stop="item.node.children.length > 0 && toggleExpanded(item.node.key)">
          <UiIcon
            v-if="item.node.children.length > 0"
            :name="item.isExpanded ? 'chevronDown' : 'chevronRight'"
            decorative
          />
        </span>
        <span
          v-if="props.checkable"
          class="ui-tree__check"
          :data-state="item.isHalfChecked ? 'mixed' : item.isChecked ? 'checked' : 'unchecked'"
          @click.stop="toggleCheck(item.node.key)"
        >
          <UiIcon
            v-if="item.isHalfChecked || item.isChecked"
            :name="item.isHalfChecked ? 'minus' : 'check'"
            decorative
          />
        </span>
        <span class="ui-tree__label">
          <slot name="node" :node="item.node" :selected="item.isSelected">{{ item.node.label }}</slot>
        </span>
        <span v-if="loadingKeys.includes(item.node.key)" class="ui-tree__meta">Loading…</span>
      </button>
    </div>
  </div>
</template>
