<script setup lang="ts">
import { computed } from 'vue';

import { useControllable } from '@ww/primitives';

import UiPagination from '../navigation/UiPagination.vue';
import UiSkeleton from './UiSkeleton.vue';

defineOptions({ name: 'UiList' });

type UiListRecord = Record<string, unknown>;

defineSlots<{
  actions?: (props: { item: UiListRecord; index: number }) => unknown;
  empty?: () => unknown;
  extra?: () => unknown;
  footer?: () => unknown;
  header?: () => unknown;
  item?: (props: { item: UiListRecord; index: number }) => unknown;
  loadMore?: () => unknown;
  loading?: () => unknown;
  meta?: (props: { item: UiListRecord; index: number }) => unknown;
}>();

type UiListSize = 'sm' | 'md' | 'lg';

const props = withDefaults(
  defineProps<{
    dataSource: readonly UiListRecord[];
    page?: number;
    defaultPage?: number;
    pageSize?: number;
    pagination?: boolean | 'simple';
    loading?: boolean;
    bordered?: boolean;
    split?: boolean;
    gridColumns?: number | 'auto';
    gridMinWidth?: number | string;
    size?: UiListSize;
    title?: string;
    emptyText?: string;
    itemKey?: ((item: UiListRecord, index: number) => number | string) | string;
    ariaLabel?: string;
  }>(),
  {
    ariaLabel: 'List',
    bordered: false,
    defaultPage: 1,
    emptyText: 'No items to display.',
    gridMinWidth: '16rem',
    loading: false,
    pageSize: 5,
    pagination: false,
    size: 'md',
    split: true,
  }
);

const emit = defineEmits<{
  'update:page': [value: number];
}>();

const state = useControllable({
  defaultValue: props.defaultPage,
  onChange: (value) => emit('update:page', value),
  value: computed(() => props.page),
});

const showPagination = computed(
  () => props.pagination !== false && props.pageSize > 0 && props.dataSource.length > props.pageSize
);
const totalPages = computed(() =>
  showPagination.value ? Math.ceil(props.dataSource.length / props.pageSize) : 1
);
const currentPage = computed(() =>
  Math.min(Math.max(1, state.currentValue.value), Math.max(1, totalPages.value))
);
const visibleItems = computed(() => {
  if (!showPagination.value) {
    return props.dataSource;
  }

  const startIndex = (currentPage.value - 1) * props.pageSize;
  return props.dataSource.slice(startIndex, startIndex + props.pageSize);
});
const isGrid = computed(() => props.gridColumns !== undefined);
const gridStyle = computed<Record<string, string> | undefined>(() => {
  if (!isGrid.value) {
    return undefined;
  }

  if (props.gridColumns === 'auto') {
    return {
      gridTemplateColumns: `repeat(auto-fit, minmax(${typeof props.gridMinWidth === 'number' ? `${props.gridMinWidth}px` : props.gridMinWidth}, minmax(0, 1fr)))`,
    };
  }

  return {
    gridTemplateColumns: `repeat(${Math.max(1, props.gridColumns ?? 1)}, minmax(0, 1fr))`,
  };
});

const resolveItemKey = (item: UiListRecord, index: number) => {
  if (typeof props.itemKey === 'function') {
    return props.itemKey(item, index);
  }

  if (typeof props.itemKey === 'string' && props.itemKey in item) {
    const keyValue = item[props.itemKey];
    if (typeof keyValue === 'string' || typeof keyValue === 'number') {
      return String(keyValue);
    }
  }

  return index;
};

const resolveItemLabel = (item: UiListRecord) => {
  const title = item.title;
  if (typeof title === 'string' || typeof title === 'number') {
    return String(title);
  }

  const label = item.label;
  if (typeof label === 'string' || typeof label === 'number') {
    return String(label);
  }

  return JSON.stringify(item) ?? 'Item';
};

const resolveItemDescription = (item: UiListRecord) => {
  const description = item.description;
  if (typeof description === 'string' || typeof description === 'number') {
    return String(description);
  }

  return null;
};
</script>

<template>
  <section
    class="ui-list"
    :class="[
      `ui-list--${props.size}`,
      {
        'ui-list--bordered': props.bordered,
        'ui-list--grid': isGrid,
        'ui-list--split': props.split,
      },
    ]"
    :aria-label="props.ariaLabel"
    :aria-busy="props.loading || undefined"
  >
    <header v-if="props.title || $slots.header || $slots.extra" class="ui-list__header">
      <div class="ui-list__heading">
        <slot name="header">
          <h3 v-if="props.title" class="ui-list__title">{{ props.title }}</h3>
        </slot>
      </div>
      <div v-if="$slots.extra" class="ui-list__extra">
        <slot name="extra" />
      </div>
    </header>

    <div v-if="props.loading" class="ui-list__loading">
      <slot name="loading">
        <UiSkeleton width="100%" height="3.5rem" />
        <UiSkeleton width="100%" height="3.5rem" />
        <UiSkeleton width="100%" height="3.5rem" />
      </slot>
    </div>

    <div v-else-if="visibleItems.length === 0" class="ui-list__empty">
      <slot name="empty">{{ props.emptyText }}</slot>
    </div>

    <ul v-else class="ui-list__items" :style="gridStyle">
      <li
        v-for="(item, index) in visibleItems"
        :key="resolveItemKey(item, index)"
        class="ui-list__item"
      >
        <div class="ui-list__item-main">
          <slot name="item" :item="item" :index="index">
            <strong class="ui-list__item-title">{{ resolveItemLabel(item) }}</strong>
            <p v-if="resolveItemDescription(item)" class="ui-list__item-description">
              {{ resolveItemDescription(item) }}
            </p>
          </slot>
        </div>

        <div v-if="$slots.meta" class="ui-list__item-meta">
          <slot name="meta" :item="item" :index="index" />
        </div>

        <div v-if="$slots.actions" class="ui-list__item-actions">
          <slot name="actions" :item="item" :index="index" />
        </div>
      </li>
    </ul>

    <div v-if="$slots.loadMore" class="ui-list__load-more">
      <slot name="loadMore" />
    </div>

    <UiPagination
      v-if="showPagination"
      :model-value="currentPage"
      :total-items="props.dataSource.length"
      :page-size="props.pageSize"
      :simple="props.pagination === 'simple'"
      :aria-label="`${props.ariaLabel} pagination`"
      @update:model-value="state.setValue($event)"
    />

    <footer v-if="$slots.footer" class="ui-list__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>
