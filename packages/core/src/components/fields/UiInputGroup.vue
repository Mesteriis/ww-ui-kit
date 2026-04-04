<script setup lang="ts">
import { computed } from 'vue';

import { useFieldContext } from './field-context';

defineOptions({ name: 'UiInputGroup' });

const props = withDefaults(
  defineProps<{
    block?: boolean;
    wrap?: boolean;
    compact?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    ariaLabel?: string;
    ariaLabelledby?: string;
  }>(),
  {
    block: true,
    compact: true,
    disabled: false,
    invalid: false,
    wrap: false,
  }
);

const field = useFieldContext();
const groupAriaLabelledby = computed(() =>
  props.ariaLabel ? undefined : (props.ariaLabelledby ?? field?.labelId.value)
);
const role = computed(() =>
  props.ariaLabel || groupAriaLabelledby.value ? 'group' : undefined
);
</script>

<template>
  <div
    class="ui-input-group"
    :class="{
      'ui-input-group--block': props.block,
      'ui-input-group--compact': props.compact,
      'ui-input-group--wrap': props.wrap,
      'is-disabled': props.disabled,
      'is-invalid': props.invalid,
    }"
    :role="role"
    :aria-label="props.ariaLabel"
    :aria-labelledby="groupAriaLabelledby"
  >
    <span v-if="$slots.prepend" class="ui-input-group__addon ui-input-group__addon--prepend">
      <slot name="prepend" />
    </span>
    <slot />
    <span v-if="$slots.append" class="ui-input-group__addon ui-input-group__addon--append">
      <slot name="append" />
    </span>
  </div>
</template>
