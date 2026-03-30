<script setup lang="ts">
import { createCollapseContext } from './collapse-context';

defineOptions({ name: 'UiCollapse' });

const props = withDefaults(
  defineProps<{
    modelValue?: string | string[];
    defaultValue?: string | string[];
    accordion?: boolean;
    bordered?: boolean;
    ghost?: boolean;
    iconPosition?: 'start' | 'end';
  }>(),
  {
    accordion: false,
    bordered: true,
    ghost: false,
    iconPosition: 'start',
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]];
}>();

const collapse = createCollapseContext(props, (event, value) => emit(event, value));
</script>

<template>
  <div
    class="ui-collapse"
    :class="{
      'ui-collapse--bordered': collapse.bordered.value,
      'ui-collapse--ghost': collapse.ghost.value,
    }"
  >
    <slot />
  </div>
</template>
