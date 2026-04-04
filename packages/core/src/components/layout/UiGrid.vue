<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import type { ThemeResponsiveBreakpoint } from '@ww/themes';

import type { UiGridItem, UiLayoutAlign, UiLayoutGapToken, UiLayoutJustify } from './layout.types';
import {
  clampGridColumns,
  resolveActiveResponsiveBreakpoint,
  resolveGapToken,
  resolveGridAlign,
  resolveGridItemPlacement,
  resolveGridItemSpan,
  resolveJustify,
} from './layout.shared';

defineOptions({ name: 'UiGrid' });

const props = withDefaults(
  defineProps<{
    items?: readonly UiGridItem[];
    columns?: number;
    gap?: UiLayoutGapToken;
    rowGap?: UiLayoutGapToken;
    columnGap?: UiLayoutGapToken;
    justify?: UiLayoutJustify;
    align?: UiLayoutAlign;
    wrap?: boolean;
    dense?: boolean;
  }>(),
  {
    align: 'stretch',
    columns: 12,
    dense: false,
    gap: '4',
    justify: 'start',
    wrap: true,
  }
);

defineSlots<{
  default?: () => unknown;
  item?: (props: { item: UiGridItem; index: number }) => unknown;
}>();

const activeBreakpoint = ref<'base' | ThemeResponsiveBreakpoint>('base');
const resolvedColumns = computed(() => clampGridColumns(props.columns));
const resolvedItems = computed(() => props.items ?? []);

const gridStyle = computed(() => ({
  alignItems: resolveGridAlign(props.align),
  columnGap: resolveGapToken(props.columnGap ?? props.gap),
  gridTemplateColumns: `repeat(${resolvedColumns.value}, minmax(0, 1fr))`,
  justifyContent: resolveJustify(props.justify),
  rowGap: resolveGapToken(props.rowGap ?? props.gap),
}));

const updateBreakpoint = () => {
  activeBreakpoint.value = resolveActiveResponsiveBreakpoint();
};

const resolveItemStyle = (item: UiGridItem) => {
  const span = resolveGridItemSpan(item, resolvedColumns.value, activeBreakpoint.value);

  return {
    ...(props.wrap
      ? {
          gridColumn: `span ${span} / span ${span}`,
        }
      : {}),
    ...(item.align ? { alignSelf: resolveGridItemPlacement(item.align) } : {}),
    ...(item.justify ? { justifySelf: resolveGridItemPlacement(item.justify) } : {}),
  };
};

onMounted(() => {
  updateBreakpoint();

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateBreakpoint, { passive: true });
  }
});

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateBreakpoint);
  }
});
</script>

<template>
  <div
    class="ui-grid"
    :class="{
      'ui-grid--dense': props.dense,
      'ui-grid--nowrap': !props.wrap,
    }"
    :style="gridStyle"
  >
    <template v-if="resolvedItems.length > 0">
      <div
        v-for="(item, index) in resolvedItems"
        :key="item.key ?? index"
        class="ui-grid__item"
        :data-ui-grid-item-key="String(item.key ?? index)"
        :style="resolveItemStyle(item)"
      >
        <slot name="item" :item="item" :index="index" />
      </div>
    </template>
    <slot v-else />
  </div>
</template>
