<script setup lang="ts">
import { computed } from 'vue';

import type {
  UiFlexDirection,
  UiFlexWrap,
  UiLayoutAlign,
  UiLayoutGapToken,
  UiLayoutJustify,
} from './layout.types';
import { resolveFlexAlign, resolveGapToken, resolveJustify, resolveWrap } from './layout.shared';

defineOptions({ name: 'UiFlex' });

const props = withDefaults(
  defineProps<{
    direction?: UiFlexDirection;
    wrap?: boolean | UiFlexWrap;
    justify?: UiLayoutJustify;
    align?: UiLayoutAlign;
    gap?: UiLayoutGapToken;
    inline?: boolean;
    block?: boolean;
  }>(),
  {
    align: 'stretch',
    block: false,
    direction: 'row',
    gap: '4',
    inline: false,
    justify: 'start',
    wrap: 'nowrap',
  }
);

const resolvedWrap = computed(() => resolveWrap(props.wrap));

const layoutStyle = computed(() => ({
  alignItems: resolveFlexAlign(props.align),
  gap: resolveGapToken(props.gap),
  justifyContent: resolveJustify(props.justify),
}));
</script>

<template>
  <div
    class="ui-flex"
    :class="[
      `ui-flex--${props.direction}`,
      `ui-flex--${resolvedWrap}`,
      {
        'ui-flex--block': props.block,
        'ui-flex--inline': props.inline,
      },
    ]"
    :style="layoutStyle"
  >
    <slot />
  </div>
</template>
