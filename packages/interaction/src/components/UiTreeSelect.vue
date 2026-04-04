<script setup lang="ts">
import { computed, ref } from 'vue';

import { UiButton, UiIcon, UiTag } from '@ww/core';
import { PrimitivePortal, useControllable } from '@ww/primitives';

import UiTree from './UiTree.vue';
import { useFloatingPanel } from '../internal/useFloatingPanel';
import { normalizeTree, type UiTreeNode } from '../internal/tree';

defineOptions({ name: 'UiTreeSelect' });

const props = withDefaults(
  defineProps<{
    modelValue?: string[] | string | null;
    nodes: UiTreeNode[];
    multiple?: boolean;
    checkable?: boolean;
    searchable?: boolean;
    clearable?: boolean;
    disabled?: boolean;
    placeholder?: string;
    ariaLabel?: string;
    virtual?: boolean;
    height?: number;
    itemSize?: number;
  }>(),
  {
    ariaLabel: 'Tree select',
    checkable: false,
    clearable: false,
    disabled: false,
    height: 280,
    itemSize: 36,
    multiple: false,
    placeholder: 'Select items',
    searchable: true,
    virtual: false,
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string[] | string | null];
}>();

const open = ref(false);
const searchValue = ref('');
const triggerRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);

const selectedState = useControllable<string[]>({
  defaultValue: [],
  onChange: (value) => {
    if (props.multiple || props.checkable) {
      emit('update:modelValue', value);
      return;
    }

    emit('update:modelValue', value[0] ?? null);
  },
  value: computed(() => {
    if (Array.isArray(props.modelValue)) {
      return props.modelValue;
    }

    return props.modelValue ? [props.modelValue] : [];
  }),
});

const registry = computed(() => normalizeTree(props.nodes));
const selectedLabels = computed(() =>
  selectedState.currentValue.value
    .map((key) => registry.value.map.get(key)?.label)
    .filter((value): value is string => Boolean(value))
);

const { panelStyle } = useFloatingPanel({
  close: () => {
    open.value = false;
  },
  open,
  panelRef,
  triggerRef,
});

const clearSelection = () => {
  selectedState.setValue([]);
};

const onSelect = (keys: string[]) => {
  selectedState.setValue(keys);
  if (!props.multiple && !props.checkable) {
    open.value = false;
  }
};
</script>

<template>
  <div class="ui-tree-select">
    <button
      ref="triggerRef"
      type="button"
      class="ui-tree-select__trigger"
      :aria-expanded="open"
      :aria-haspopup="'dialog'"
      :aria-label="props.ariaLabel"
      :disabled="props.disabled"
      @click="open = !open"
    >
      <span v-if="selectedLabels.length === 0" class="ui-tree-select__placeholder">
        {{ props.placeholder }}
      </span>
      <span v-else-if="props.multiple || props.checkable" class="ui-tree-select__tags">
        <UiTag v-for="label in selectedLabels" :key="label" variant="info" size="sm">{{ label }}</UiTag>
      </span>
      <span v-else class="ui-tree-select__value">{{ selectedLabels[0] }}</span>
      <span class="ui-tree-select__actions">
        <UiButton
          v-if="props.clearable && selectedLabels.length > 0"
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
      <section v-if="open" ref="panelRef" class="ui-tree-select__panel" :style="panelStyle">
        <input
          v-if="props.searchable"
          v-model="searchValue"
          class="ui-tree-select__search"
          type="search"
          placeholder="Search tree"
        />
        <UiTree
          :nodes="props.nodes"
          :model-value="selectedState.currentValue.value"
          :checked-keys="selectedState.currentValue.value"
          :checkable="props.checkable"
          :multiple="props.multiple || props.checkable"
          :search-value="searchValue"
          :virtual="props.virtual"
          :height="props.height"
          :item-size="props.itemSize"
          @update:model-value="onSelect"
          @update:checked-keys="onSelect"
        />
      </section>
    </PrimitivePortal>
  </div>
</template>
