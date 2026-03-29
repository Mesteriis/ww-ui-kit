<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';

import { useTabsContext } from './tabs-context';

defineOptions({ name: 'UiTabsTrigger' });

const props = withDefaults(
  defineProps<{
    value: string;
    disabled?: boolean;
  }>(),
  {
    disabled: false
  }
);

const tabs = useTabsContext();

if (!tabs) {
  throw new Error('UiTabsTrigger must be used inside UiTabsRoot.');
}

const triggerRef = ref<HTMLElement | null>(null);
const unregister = tabs.registerTrigger(
  props.value,
  () => triggerRef.value,
  () => props.disabled
);

onBeforeUnmount(unregister);

const isSelected = computed(() => tabs.currentValue.value === props.value);
const isTabStop = computed(() => tabs.currentTabStop.value === props.value || isSelected.value);

const onFocus = () => {
  tabs.setCurrentTabStop(props.value);
  tabs.select(props.value);
};

const onActivate = () => {
  if (!props.disabled) {
    tabs.select(props.value);
  }
};

const onKeydown = (event: KeyboardEvent) => {
  if ((event.key === 'Enter' || event.key === ' ') && !props.disabled) {
    event.preventDefault();
    onActivate();
  }
};
</script>

<template>
  <button
    :id="tabs.getTriggerId(props.value)"
    ref="triggerRef"
    class="ui-tabs__trigger"
    :class="{ 'is-active': isSelected }"
    role="tab"
    :type="'button'"
    :aria-selected="isSelected"
    :aria-controls="tabs.getPanelId(props.value)"
    :tabindex="props.disabled ? -1 : isTabStop ? 0 : -1"
    :disabled="props.disabled"
    data-ui-motion="ring-focus-soft underline-slide"
    @focus="onFocus"
    @click="onActivate"
    @keydown="onKeydown"
  >
    <slot />
  </button>
</template>
