<script setup lang="ts">
import { computed, useAttrs } from 'vue';

import type { UiFlowLayoutProps } from '../shared/types';

defineOptions({
  name: 'UiVerticalLayout',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<UiFlowLayoutProps>(), {
  gap: 'var(--ui-space-4)',
  scroll: false,
});

const attrs = useAttrs();

defineSlots<{
  default?: () => unknown;
}>();

const layoutStyle = computed(() => ({
  '--ui-layout-flow-gap': props.gap,
}));

const fallbackAriaLabel = computed(() => {
  const ariaLabel = attrs['aria-label'];
  const ariaLabelledby = attrs['aria-labelledby'];

  if (
    (typeof ariaLabel === 'string' && ariaLabel.trim().length > 0) ||
    (typeof ariaLabelledby === 'string' && ariaLabelledby.trim().length > 0)
  ) {
    return undefined;
  }

  return 'Scrollable vertical layout';
});
</script>

<template>
  <div
    class="ui-flow-layout ui-vertical-layout"
    data-ui-direction="vertical"
    :data-ui-scroll="props.scroll ? 'true' : 'false'"
    :style="layoutStyle"
    :role="props.scroll ? 'region' : undefined"
    :tabindex="props.scroll ? 0 : undefined"
    :aria-label="props.scroll ? fallbackAriaLabel : undefined"
    v-bind="attrs"
  >
    <slot />
  </div>
</template>
