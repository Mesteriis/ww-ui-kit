<script setup lang="ts">
/* istanbul ignore file */
import { computed } from 'vue';

import UiIcon from '../display/UiIcon.vue';

defineOptions({ name: 'UiBreadcrumb' });

type UiBreadcrumbItem = {
  label: string;
  href?: string;
  to?: string;
  icon?: string;
  current?: boolean;
};

type RenderedBreadcrumbItem =
  | (UiBreadcrumbItem & {
      kind: 'item';
      isCurrent: boolean;
    })
  | {
      kind: 'ellipsis';
      label: string;
    };

const props = withDefaults(
  defineProps<{
    items: UiBreadcrumbItem[];
    separator?: string;
    maxItems?: number;
    ariaLabel?: string;
  }>(),
  {
    ariaLabel: 'Breadcrumb',
    separator: '/',
  }
);

const renderedItems = computed<RenderedBreadcrumbItem[]>(() => {
  const baseItems = props.items.map((item, index) => ({
    ...item,
    kind: 'item' as const,
    isCurrent: item.current ?? index === props.items.length - 1,
  }));

  if (!props.maxItems || props.maxItems < 2 || baseItems.length <= props.maxItems) {
    return baseItems;
  }

  const leadingItem = baseItems[0];
  /* istanbul ignore if -- truncation only runs when baseItems.length > props.maxItems, so baseItems[0] exists. */ if (
    !leadingItem
  ) {
    return [];
  }

  const trailingItems = baseItems.slice(-(props.maxItems - 1));

  return [
    leadingItem,
    {
      kind: 'ellipsis',
      label: '…',
    },
    ...trailingItems,
  ];
});

const resolveHref = (item: UiBreadcrumbItem) => item.href ?? item.to;
</script>

<template>
  <nav class="ui-breadcrumb" :aria-label="props.ariaLabel">
    <ol class="ui-breadcrumb__list">
      <li
        v-for="(item, index) in renderedItems"
        :key="item.kind === 'item' ? `${item.label}-${index}` : `ellipsis-${index}`"
        class="ui-breadcrumb__item"
      >
        <span v-if="item.kind === 'ellipsis'" class="ui-breadcrumb__ellipsis" aria-hidden="true">
          {{ item.label }}
        </span>
        <slot
          v-else
          name="item"
          :item="item"
          :is-current="item.isCurrent"
          :href="resolveHref(item)"
        >
          <span
            v-if="item.isCurrent || !resolveHref(item)"
            class="ui-breadcrumb__current"
            :aria-current="item.isCurrent ? 'page' : undefined"
          >
            <UiIcon v-if="item.icon" class="ui-breadcrumb__icon" decorative>{{ item.icon }}</UiIcon>
            <span>{{ item.label }}</span>
          </span>
          <a v-else class="ui-breadcrumb__link" :href="resolveHref(item)">
            <UiIcon v-if="item.icon" class="ui-breadcrumb__icon" decorative>{{ item.icon }}</UiIcon>
            <span>{{ item.label }}</span>
          </a>
        </slot>
        <span
          v-if="index < renderedItems.length - 1"
          class="ui-breadcrumb__separator"
          aria-hidden="true"
        >
          <slot name="separator">
            {{ props.separator }}
          </slot>
        </span>
      </li>
    </ol>
  </nav>
</template>
