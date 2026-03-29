<script setup lang="ts">
import { useId } from '@ww/primitives';

import { createFieldState, provideFieldContext } from './field-context';

defineOptions({ name: 'UiField' });

const props = defineProps<{
  id?: string;
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
}>();

const fallbackId = useId('field');
const fieldState = createFieldState(props, fallbackId.value);

provideFieldContext({
  describedBy: fieldState.describedBy,
  inputId: fieldState.inputId,
  invalid: fieldState.invalid,
});
</script>

<template>
  <div class="ui-field" :data-invalid="fieldState.invalid.value || undefined">
    <label v-if="label" class="ui-field__label" :for="fieldState.inputId.value">
      {{ label }}
      <span v-if="required" aria-hidden="true"> *</span>
    </label>
    <div class="ui-field__control">
      <slot
        :described-by="fieldState.describedBy.value"
        :input-id="fieldState.inputId.value"
        :invalid="fieldState.invalid.value"
      />
    </div>
    <p v-if="hint" :id="fieldState.hintId.value" class="ui-field__hint">
      {{ hint }}
    </p>
    <p v-if="error" :id="fieldState.errorId.value" class="ui-field__error" role="alert">
      {{ error }}
    </p>
  </div>
</template>
