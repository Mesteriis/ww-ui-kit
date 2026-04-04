<script setup lang="ts">
import { computed, ref } from 'vue';

import { UiButton, UiIcon } from '@ww/core';
import { PrimitivePortal, useControllable } from '@ww/primitives';

import { useFloatingPanel } from '../internal/useFloatingPanel';
import { normalizeTree, type UiTreeNode } from '../internal/tree';

defineOptions({ name: 'UiCascader' });

const props = withDefaults(
  defineProps<{
    modelValue?: string[] | null;
    nodes: UiTreeNode[];
    placeholder?: string;
    disabled?: boolean;
    searchable?: boolean;
    changeOnSelect?: boolean;
    ariaLabel?: string;
  }>(),
  {
    ariaLabel: 'Cascader',
    changeOnSelect: false,
    disabled: false,
    placeholder: 'Select path',
    searchable: true,
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string[] | null];
}>();

const open = ref(false);
const query = ref('');
const triggerRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);

const pathState = useControllable<string[] | null>({
  defaultValue: null,
  onChange: (value) => emit('update:modelValue', value),
  value: computed(() => props.modelValue),
});

const registry = computed(() => normalizeTree(props.nodes));
const activePath = ref<string[]>(pathState.currentValue.value ?? []);
const selectedLabels = computed(() =>
  (pathState.currentValue.value ?? [])
    .map((key) => registry.value.map.get(key)?.label)
    .filter((value): value is string => Boolean(value))
);

const columns = computed(() => {
  const result = [registry.value.roots];
  let currentNodes = registry.value.roots;

  for (const key of activePath.value) {
    const node = currentNodes.find((entry) => entry.key === key);
    if (!node || node.children.length === 0) {
      break;
    }

    result.push(node.children);
    currentNodes = node.children;
  }

  return result;
});

const searchResults = computed(() => {
  if (!query.value.trim()) {
    return [];
  }

  const normalizedQuery = query.value.trim().toLowerCase();
  return registry.value.leafNodes.filter((node) =>
    node.pathLabels.join(' / ').toLowerCase().includes(normalizedQuery)
  );
});

const { panelStyle } = useFloatingPanel({
  close: () => {
    open.value = false;
  },
  open,
  panelRef,
  triggerRef,
});

const selectNode = (key: string) => {
  const node = registry.value.map.get(key);
  if (!node || node.disabled) {
    return;
  }

  activePath.value = node.pathKeys;

  if (node.children.length === 0 || props.changeOnSelect || query.value.trim()) {
    pathState.setValue(node.pathKeys);
    open.value = false;
  }
};

const clearSelection = () => {
  pathState.setValue(null);
  activePath.value = [];
};
</script>

<template>
  <div class="ui-cascader">
    <button
      ref="triggerRef"
      type="button"
      class="ui-cascader__trigger"
      :aria-expanded="open"
      :aria-haspopup="'dialog'"
      :aria-label="props.ariaLabel"
      :disabled="props.disabled"
      @click="open = !open"
    >
      <span v-if="selectedLabels.length === 0" class="ui-cascader__placeholder">
        {{ props.placeholder }}
      </span>
      <span v-else class="ui-cascader__value">{{ selectedLabels.join(' / ') }}</span>
      <span class="ui-cascader__actions">
        <UiButton
          v-if="selectedLabels.length > 0"
          variant="ghost"
          size="sm"
          @click.stop="clearSelection"
        >
          Clear
        </UiButton>
        <UiIcon :name="open ? 'chevronUp' : 'chevronDown'" decorative />
      </span>
    </button>

    <PrimitivePortal>
      <section v-if="open" ref="panelRef" class="ui-cascader__panel" :style="panelStyle">
        <input
          v-if="props.searchable"
          v-model="query"
          class="ui-cascader__search"
          type="search"
          placeholder="Search paths"
        />

        <div v-if="searchResults.length > 0" class="ui-cascader__results" role="listbox">
          <button
            v-for="node in searchResults"
            :key="node.key"
            type="button"
            class="ui-cascader__option"
            role="option"
            @click="selectNode(node.key)"
          >
            {{ node.pathLabels.join(' / ') }}
          </button>
        </div>

        <div v-else class="ui-cascader__columns">
          <div v-for="(column, columnIndex) in columns" :key="columnIndex" class="ui-cascader__column">
            <button
              v-for="node in column"
              :key="node.key"
              type="button"
              class="ui-cascader__option"
              :class="{ 'is-active': activePath.includes(node.key) }"
              :disabled="node.disabled"
              @mouseenter="activePath = node.pathKeys"
              @click="selectNode(node.key)"
            >
              <span>{{ node.label }}</span>
              <UiIcon v-if="node.children.length > 0" name="chevronRight" decorative />
            </button>
          </div>
        </div>
      </section>
    </PrimitivePortal>
  </div>
</template>
