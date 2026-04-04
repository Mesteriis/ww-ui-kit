<script setup lang="ts">
import { computed } from 'vue';

defineOptions({ name: 'UiTimeline' });

type UiTimelineMode = 'left' | 'right' | 'alternate';
type UiTimelineTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger';

export interface UiTimelineItem {
  key?: number | string;
  title: string;
  description?: string;
  opposite?: string;
  tone?: UiTimelineTone;
}

interface ResolvedTimelineItem extends UiTimelineItem {
  direction: 'left' | 'right';
  isPending: boolean;
  key: number | string;
  tone: UiTimelineTone;
}

const props = withDefaults(
  defineProps<{
    items: readonly UiTimelineItem[];
    mode?: UiTimelineMode;
    reverse?: boolean;
    pending?: boolean;
    pendingLabel?: string;
    ariaLabel?: string;
  }>(),
  {
    ariaLabel: 'Timeline',
    mode: 'left',
    pending: false,
    pendingLabel: 'Pending',
    reverse: false,
  }
);

const resolveDirection = (index: number) => {
  if (props.mode === 'alternate') {
    return index % 2 === 0 ? 'left' : 'right';
  }

  return props.mode;
};

const items = computed<ResolvedTimelineItem[]>(() => {
  const baseItems = props.items.map((item, index) => ({
    ...item,
    direction: resolveDirection(index),
    isPending: false,
    key: item.key ?? `${index}-${item.title}`,
    tone: item.tone ?? 'brand',
  }));

  if (props.pending) {
    baseItems.push({
      direction: resolveDirection(baseItems.length),
      isPending: true,
      key: 'pending',
      title: props.pendingLabel,
      tone: 'neutral',
    });
  }

  return props.reverse ? [...baseItems].reverse() : baseItems;
});
</script>

<template>
  <ol class="ui-timeline" :aria-label="props.ariaLabel">
    <li
      v-for="(item, index) in items"
      :key="item.key"
      class="ui-timeline__item"
      :class="[
        `ui-timeline__item--${item.direction}`,
        `ui-timeline__item--${item.tone}`,
        { 'ui-timeline__item--pending': item.isPending },
      ]"
    >
      <div class="ui-timeline__opposite">
        <slot name="opposite" :item="item" :index="index">
          {{ item.opposite }}
        </slot>
      </div>

      <div class="ui-timeline__separator" aria-hidden="true">
        <span class="ui-timeline__line" />
        <span class="ui-timeline__dot">
          <slot name="dot" :item="item" :index="index">{{ item.isPending ? '…' : '' }}</slot>
        </span>
      </div>

      <div class="ui-timeline__content">
        <slot name="item" :item="item" :index="index">
          <strong class="ui-timeline__title">{{ item.title }}</strong>
          <p v-if="item.description" class="ui-timeline__description">
            {{ item.description }}
          </p>
        </slot>
      </div>
    </li>
  </ol>
</template>
