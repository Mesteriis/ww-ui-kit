<script setup lang="ts">
import { useTabsContext } from './tabs-context';

defineOptions({ name: 'UiTabsList' });

const tabs = useTabsContext();

if (!tabs) {
  throw new Error('UiTabsList must be used inside UiTabsRoot.');
}
</script>

<template>
  <div
    class="ui-tabs__list"
    role="tablist"
    :aria-orientation="tabs.orientation.value"
    @keydown="(event) => void tabs.onListKeydown(event)"
  >
    <slot />
  </div>
</template>
