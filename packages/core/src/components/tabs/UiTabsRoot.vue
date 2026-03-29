<script setup lang="ts">
import { createTabsContext } from './tabs-context';

defineOptions({ name: 'UiTabsRoot' });

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    defaultValue?: string;
    orientation?: 'horizontal' | 'vertical';
  }>(),
  {
    orientation: 'horizontal'
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

createTabsContext(
  props,
  (event, value) => emit(event, value)
);
</script>

<template>
  <div class="ui-tabs" :data-orientation="props.orientation">
    <slot />
  </div>
</template>
