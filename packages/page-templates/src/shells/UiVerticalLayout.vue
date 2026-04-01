<script setup lang="ts">
import { computed } from 'vue';

import type { UiFlowLayoutProps } from '../shared/types';

defineOptions({ name: 'UiVerticalLayout' });

const props = withDefaults(defineProps<UiFlowLayoutProps>(), {
  gap: 'var(--ui-space-4)',
  scroll: false,
});

defineSlots<{
  default?: () => unknown;
}>();

const layoutStyle = computed(() => ({
  '--ui-layout-flow-gap': props.gap,
}));
</script>

<template>
  <div
    class="ui-flow-layout ui-vertical-layout"
    data-ui-direction="vertical"
    :data-ui-scroll="props.scroll ? 'true' : 'false'"
    :style="layoutStyle"
    :tabindex="props.scroll ? 0 : undefined"
  >
    <slot />
  </div>
</template>
