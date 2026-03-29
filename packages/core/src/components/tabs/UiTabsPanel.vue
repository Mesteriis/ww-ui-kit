<script setup lang="ts">
import { computed } from 'vue';

import { useTabsContext } from './tabs-context';

defineOptions({ name: 'UiTabsPanel' });

const props = defineProps<{
  value: string;
}>();

const tabs = useTabsContext();

if (!tabs) {
  throw new Error('UiTabsPanel must be used inside UiTabsRoot.');
}

const isSelected = computed(() => tabs.currentValue.value === props.value);
</script>

<template>
  <div
    v-show="isSelected"
    :id="tabs.getPanelId(props.value)"
    class="ui-tabs__panel"
    role="tabpanel"
    :aria-labelledby="tabs.getTriggerId(props.value)"
    tabindex="0"
  >
    <slot />
  </div>
</template>
