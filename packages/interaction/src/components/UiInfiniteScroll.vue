<script setup lang="ts" generic="TItem">
import { computed, ref, watch, type CSSProperties } from 'vue';

import UiVirtualScroll from './UiVirtualScroll.vue';

defineOptions({ name: 'UiInfiniteScroll' });

const props = withDefaults(
  defineProps<{
    items: TItem[];
    itemSize: number;
    height: number;
    overscan?: number;
    hasMore?: boolean;
    loading?: boolean;
    threshold?: number;
    loadingLabel?: string;
    endLabel?: string;
  }>(),
  {
    endLabel: 'No more items',
    hasMore: false,
    loadingLabel: 'Loading more items',
    loading: false,
    overscan: 4,
    threshold: 4,
  }
);

const emit = defineEmits<{
  loadMore: [];
}>();

const lastRequestedIndex = ref(-1);

watch(
  () => props.items.length,
  () => {
    lastRequestedIndex.value = -1;
    if (props.hasMore && !props.loading && props.items.length <= props.threshold) {
      emit('loadMore');
    }
  },
  { immediate: true }
);

const onRangeChange = ({ end }: { end: number; start: number }) => {
  if (!props.hasMore || props.loading) {
    return;
  }

  if (end >= props.items.length - props.threshold && end > lastRequestedIndex.value) {
    lastRequestedIndex.value = end;
    emit('loadMore');
  }
};

const footerState = computed(() => {
  if (props.loading) {
    return props.loadingLabel;
  }

  if (!props.hasMore) {
    return props.endLabel;
  }

  return '';
});
</script>

<template>
  <UiVirtualScroll
    :items="props.items"
    :item-size="props.itemSize"
    :height="props.height"
    :overscan="props.overscan"
    aria-label="Infinite scroll"
    role="list"
    @range-change="onRangeChange"
  >
    <template #default="{ item, index, style }">
      <div class="ui-virtual-list__item" :style="style as CSSProperties" role="listitem">
        <slot :item="item" :index="index" />
      </div>
    </template>
  </UiVirtualScroll>
  <p v-if="footerState" class="ui-infinite-scroll__status" aria-live="polite">
    {{ footerState }}
  </p>
</template>
