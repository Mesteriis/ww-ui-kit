<script setup lang="ts">
import { computed } from 'vue';

defineOptions({ name: 'UiDescriptions' });

type UiDescriptionsLayout = 'horizontal' | 'vertical';
type UiDescriptionsSize = 'sm' | 'md' | 'lg';

export interface UiDescriptionsItem {
  key?: number | string;
  label: string;
  value?: string | number;
  span?: number;
}

const props = withDefaults(
  defineProps<{
    items: readonly UiDescriptionsItem[];
    column?: number;
    layout?: UiDescriptionsLayout;
    bordered?: boolean;
    size?: UiDescriptionsSize;
    title?: string;
    ariaLabel?: string;
  }>(),
  {
    ariaLabel: 'Descriptions',
    bordered: false,
    column: 3,
    layout: 'horizontal',
    size: 'md',
  }
);

const columnCount = computed(() => Math.max(1, Math.floor(props.column)));
const items = computed(() =>
  props.items.map((item, index) => ({
    ...item,
    key: item.key ?? `${index}-${item.label}`,
    span: Math.min(columnCount.value, Math.max(1, Math.floor(item.span ?? 1))),
  }))
);
</script>

<template>
  <section
    class="ui-descriptions"
    :class="[
      `ui-descriptions--${props.layout}`,
      `ui-descriptions--${props.size}`,
      { 'ui-descriptions--bordered': props.bordered },
    ]"
    :aria-label="props.ariaLabel"
  >
    <header v-if="props.title || $slots.title || $slots.extra" class="ui-descriptions__header">
      <div class="ui-descriptions__heading">
        <slot name="title">
          <h3 v-if="props.title" class="ui-descriptions__title">{{ props.title }}</h3>
        </slot>
      </div>
      <div v-if="$slots.extra" class="ui-descriptions__extra">
        <slot name="extra" />
      </div>
    </header>

    <dl class="ui-descriptions__list" :style="{ '--ui-descriptions-columns': String(columnCount) }">
      <div
        v-for="(item, index) in items"
        :key="item.key"
        class="ui-descriptions__item"
        :style="{ '--ui-descriptions-item-span': String(item.span) }"
      >
        <slot name="item" :item="item" :index="index">
          <dt class="ui-descriptions__label">
            <slot name="label" :item="item" :index="index">{{ item.label }}</slot>
          </dt>
          <dd class="ui-descriptions__value">
            <slot name="value" :item="item" :index="index">{{ item.value ?? '—' }}</slot>
          </dd>
        </slot>
      </div>
    </dl>
  </section>
</template>
