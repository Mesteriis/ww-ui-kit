<script setup lang="ts">
import { computed } from 'vue';

import { mergeDescribedBy, useFieldContext } from '../fields/field-context';

defineOptions({ name: 'UiSwitch' });

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    disabled?: boolean;
    ariaLabel?: string;
    ariaDescribedby?: string;
  }>(),
  {
    modelValue: false,
    disabled: false,
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const field = useFieldContext();
const describedBy = computed(() =>
  mergeDescribedBy(props.ariaDescribedby, field?.describedBy.value)
);

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue);
  }
};
</script>

<template>
  <button
    type="button"
    class="ui-switch"
    :class="{ 'is-checked': props.modelValue }"
    role="switch"
    :disabled="props.disabled"
    :aria-checked="props.modelValue"
    :aria-describedby="describedBy"
    :aria-label="props.ariaLabel"
    data-ui-motion="ring-focus-soft"
    @click="toggle"
  >
    <span class="ui-switch__track" aria-hidden="true">
      <span class="ui-switch__thumb" />
    </span>
    <span v-if="$slots.default" class="ui-switch__label">
      <slot />
    </span>
  </button>
</template>
