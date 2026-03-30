<script setup lang="ts">
import { computed } from 'vue';

import { createRadioGroupContext } from './radio-group-context';

defineOptions({ name: 'UiRadioGroup' });

const props = withDefaults(
  defineProps<{
    id?: string;
    modelValue?: string;
    defaultValue?: string;
    orientation?: 'horizontal' | 'vertical';
    name?: string;
    disabled?: boolean;
    required?: boolean;
    invalid?: boolean;
    ariaDescribedby?: string;
  }>(),
  {
    disabled: false,
    invalid: false,
    orientation: 'vertical',
    required: false,
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const radioGroup = createRadioGroupContext(props, (event, value) => emit(event, value));

const ariaLabelledby = computed(() => radioGroup.labelId.value);
</script>

<template>
  <div
    :id="radioGroup.context.groupId.value"
    class="ui-radio-group"
    :data-orientation="props.orientation"
    role="radiogroup"
    :aria-labelledby="ariaLabelledby"
    :aria-describedby="radioGroup.context.describedBy.value"
    :aria-invalid="radioGroup.context.invalid.value || undefined"
    :aria-required="radioGroup.context.required.value || undefined"
    :aria-disabled="radioGroup.context.disabled.value || undefined"
    :aria-orientation="radioGroup.context.orientation.value"
    @keydown="(event) => void radioGroup.context.onGroupKeydown(event)"
  >
    <slot />
  </div>
</template>
