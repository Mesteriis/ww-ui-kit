<script setup lang="ts">
import { computed, useSlots } from 'vue';

import type { LayoutWidth } from '../shared/types';

defineOptions({ name: 'UiLayout' });

const props = withDefaults(
  defineProps<{
    width?: LayoutWidth;
  }>(),
  {
    width: 'content',
  }
);

defineSlots<{
  header?: () => unknown;
  toolbar?: () => unknown;
  default?: () => unknown;
  sider?: () => unknown;
  footer?: () => unknown;
}>();

const slots = useSlots();
const hasSider = computed(() => Boolean(slots.sider));
</script>

<template>
  <section class="ui-layout" :data-ui-width="props.width" :data-ui-has-sider="hasSider">
    <slot v-if="$slots.header" name="header" />
    <slot v-if="$slots.toolbar" name="toolbar" />
    <div class="ui-layout__body">
      <slot />
      <slot v-if="$slots.sider" name="sider" />
    </div>
    <slot v-if="$slots.footer" name="footer" />
  </section>
</template>
