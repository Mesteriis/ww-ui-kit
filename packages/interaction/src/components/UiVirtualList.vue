<script setup lang="ts" generic="TItem">
import type { CSSProperties } from 'vue';

import UiVirtualScroll from './UiVirtualScroll.vue';

defineOptions({ name: 'UiVirtualList' });

const props = withDefaults(
  defineProps<{
    items: TItem[];
    itemSize: number;
    height: number;
    overscan?: number;
    ariaLabel?: string;
  }>(),
  {
    ariaLabel: 'Virtual list',
    overscan: 4,
  }
);
</script>

<template>
  <UiVirtualScroll
    :items="props.items"
    :item-size="props.itemSize"
    :height="props.height"
    :overscan="props.overscan"
    :aria-label="props.ariaLabel"
    role="list"
  >
    <template #default="{ item, index, style }">
      <div class="ui-virtual-list__item" :style="style as CSSProperties" role="listitem">
        <slot :item="item" :index="index" />
      </div>
    </template>
  </UiVirtualScroll>
</template>
