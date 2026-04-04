<script setup lang="ts">
import { computed, ref } from 'vue';

import { UiButton, UiIcon } from '@ww/core';
import { useControllable } from '@ww/primitives';

import UiVirtualList from './UiVirtualList.vue';
import { flattenTransferItems, type UiTreeNode } from '../internal/tree';

defineOptions({ name: 'UiTransfer' });

const props = withDefaults(
  defineProps<{
    items: UiTreeNode[];
    modelValue?: string[];
    titles?: [string, string];
    disabled?: boolean;
    searchable?: boolean;
    height?: number;
    itemSize?: number;
    virtual?: boolean;
  }>(),
  {
    disabled: false,
    height: 280,
    itemSize: 36,
    searchable: true,
    titles: () => ['Available', 'Selected'],
    virtual: false,
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
}>();

const targetState = useControllable<string[]>({
  defaultValue: [],
  onChange: (value) => emit('update:modelValue', value),
  value: computed(() => props.modelValue),
});

const sourceSearch = ref('');
const targetSearch = ref('');
const sourceSelection = ref<string[]>([]);
const targetSelection = ref<string[]>([]);

const allItems = computed(() => flattenTransferItems(props.items));
const sourceItems = computed(() =>
  allItems.value.filter((item) => !targetState.currentValue.value.includes(item.key))
);
const targetItems = computed(() =>
  allItems.value.filter((item) => targetState.currentValue.value.includes(item.key))
);

const filterItems = (items: typeof allItems.value, query: string) => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) =>
    item.pathLabels.join(' / ').toLowerCase().includes(normalizedQuery)
  );
};

const visibleSourceItems = computed(() => filterItems(sourceItems.value, sourceSearch.value));
const visibleTargetItems = computed(() => filterItems(targetItems.value, targetSearch.value));

const toggleSelection = (collection: typeof sourceSelection, key: string) => {
  collection.value = collection.value.includes(key)
    ? collection.value.filter((entry) => entry !== key)
    : [...collection.value, key];
};

const toggleSourceSelection = (key: string) => {
  toggleSelection(sourceSelection, key);
};

const toggleTargetSelection = (key: string) => {
  toggleSelection(targetSelection, key);
};

const moveToTarget = () => {
  targetState.setValue([
    ...new Set([...targetState.currentValue.value, ...sourceSelection.value]),
  ]);
  sourceSelection.value = [];
};

const moveToSource = () => {
  targetState.setValue(
    targetState.currentValue.value.filter((key) => !targetSelection.value.includes(key))
  );
  targetSelection.value = [];
};
</script>

<template>
  <div class="ui-transfer">
    <section class="ui-transfer__panel">
      <header class="ui-transfer__header">
        <h3>{{ props.titles[0] }}</h3>
        <span>{{ visibleSourceItems.length }}</span>
      </header>
      <input
        v-if="props.searchable"
        v-model="sourceSearch"
        class="ui-transfer__search"
        type="search"
        placeholder="Search available"
      />
      <UiVirtualList
        v-if="props.virtual"
        :items="visibleSourceItems"
        :height="props.height"
        :item-size="props.itemSize"
        aria-label="Available items"
      >
        <template #default="{ item }">
          <button
            type="button"
            class="ui-transfer__option"
            :disabled="props.disabled || item.disabled"
            @click="toggleSourceSelection(item.key)"
          >
            <span class="ui-transfer__checkbox" :data-selected="sourceSelection.includes(item.key) || undefined">
              <UiIcon v-if="sourceSelection.includes(item.key)" name="check" decorative />
            </span>
            <span>{{ item.pathLabels.join(' / ') }}</span>
          </button>
        </template>
      </UiVirtualList>
      <div v-else class="ui-transfer__list">
        <button
          v-for="item in visibleSourceItems"
          :key="item.key"
          type="button"
          class="ui-transfer__option"
          :disabled="props.disabled || item.disabled"
            @click="toggleSourceSelection(item.key)"
          >
          <span class="ui-transfer__checkbox" :data-selected="sourceSelection.includes(item.key) || undefined">
            <UiIcon v-if="sourceSelection.includes(item.key)" name="check" decorative />
          </span>
          <span>{{ item.pathLabels.join(' / ') }}</span>
        </button>
      </div>
    </section>

    <div class="ui-transfer__actions">
      <UiButton :disabled="sourceSelection.length === 0 || props.disabled" @click="moveToTarget">
        Move right
      </UiButton>
      <UiButton
        variant="secondary"
        :disabled="targetSelection.length === 0 || props.disabled"
        @click="moveToSource"
      >
        Move left
      </UiButton>
    </div>

    <section class="ui-transfer__panel">
      <header class="ui-transfer__header">
        <h3>{{ props.titles[1] }}</h3>
        <span>{{ visibleTargetItems.length }}</span>
      </header>
      <input
        v-if="props.searchable"
        v-model="targetSearch"
        class="ui-transfer__search"
        type="search"
        placeholder="Search selected"
      />
      <UiVirtualList
        v-if="props.virtual"
        :items="visibleTargetItems"
        :height="props.height"
        :item-size="props.itemSize"
        aria-label="Selected items"
      >
        <template #default="{ item }">
          <button
            type="button"
            class="ui-transfer__option"
            :disabled="props.disabled || item.disabled"
            @click="toggleTargetSelection(item.key)"
          >
            <span class="ui-transfer__checkbox" :data-selected="targetSelection.includes(item.key) || undefined">
              <UiIcon v-if="targetSelection.includes(item.key)" name="check" decorative />
            </span>
            <span>{{ item.pathLabels.join(' / ') }}</span>
          </button>
        </template>
      </UiVirtualList>
      <div v-else class="ui-transfer__list">
        <button
          v-for="item in visibleTargetItems"
          :key="item.key"
          type="button"
          class="ui-transfer__option"
          :disabled="props.disabled || item.disabled"
            @click="toggleTargetSelection(item.key)"
          >
          <span class="ui-transfer__checkbox" :data-selected="targetSelection.includes(item.key) || undefined">
            <UiIcon v-if="targetSelection.includes(item.key)" name="check" decorative />
          </span>
          <span>{{ item.pathLabels.join(' / ') }}</span>
        </button>
      </div>
    </section>
  </div>
</template>
