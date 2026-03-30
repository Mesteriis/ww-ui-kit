<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';

import { useRadioGroupContext } from './radio-group-context';

defineOptions({ name: 'UiRadio' });

const props = withDefaults(
  defineProps<{
    id?: string;
    value: string;
    disabled?: boolean;
    ariaLabel?: string;
  }>(),
  {
    disabled: false,
  }
);

const radioGroup = useRadioGroupContext();

if (!radioGroup) {
  throw new Error('UiRadio must be used inside UiRadioGroup.');
}

const radioRef = ref<HTMLElement | null>(null);
const unregister = radioGroup.registerRadio(
  props.value,
  () => radioRef.value,
  () => radioGroup.isDisabled(props.disabled)
);

onBeforeUnmount(unregister);

const inputId = computed(() => props.id ?? radioGroup.getInputId(props.value));
const isChecked = computed(() => radioGroup.isChecked(props.value));
const isDisabled = computed(() => radioGroup.isDisabled(props.disabled));
const isTabStop = computed(
  () => !isDisabled.value && radioGroup.currentTabStop.value === props.value
);

const onFocus = () => {
  radioGroup.setCurrentTabStop(props.value);
};

const onChange = () => {
  if (isDisabled.value) {
    return;
  }

  radioGroup.select(props.value);
};
</script>

<template>
  <label class="ui-radio" :data-disabled="isDisabled || undefined">
    <input
      :id="inputId"
      ref="radioRef"
      class="ui-radio__input"
      type="radio"
      :name="radioGroup.name.value"
      :checked="isChecked"
      :disabled="isDisabled"
      :required="radioGroup.required.value"
      :aria-label="props.ariaLabel"
      :aria-invalid="radioGroup.invalid.value || undefined"
      :aria-describedby="radioGroup.describedBy.value"
      :tabindex="isTabStop || isChecked ? 0 : -1"
      @focus="onFocus"
      @change="onChange"
    />
    <span class="ui-radio__control" aria-hidden="true">
      <span class="ui-radio__dot" />
    </span>
    <span v-if="$slots.default" class="ui-radio__label">
      <slot />
    </span>
  </label>
</template>
