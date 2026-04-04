<script setup lang="ts">
import { computed, ref } from 'vue';

import { useId } from '@ww/primitives';

import { mergeDescribedBy, useFieldContext } from './field-context';

defineOptions({ name: 'UiInputTag' });

type UiInputTagRejectReason = 'duplicate' | 'empty' | 'invalid' | 'limit';

const props = withDefaults(
  defineProps<{
    modelValue?: readonly string[];
    id?: string;
    name?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    invalid?: boolean;
    ariaLabel?: string;
    ariaDescribedby?: string;
    allowDuplicates?: boolean;
    maxTags?: number;
    separators?: readonly string[];
    addOnBlur?: boolean;
    trimTags?: boolean;
    validateTag?: ((value: string) => boolean) | undefined;
  }>(),
  {
    addOnBlur: true,
    allowDuplicates: false,
    disabled: false,
    invalid: false,
    modelValue: () => [] as const,
    placeholder: 'Add a tag',
    readonly: false,
    separators: () => [',', '\n'] as const,
    trimTags: true,
    validateTag: undefined,
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
  add: [value: string];
  remove: [value: string];
  reject: [payload: { reason: UiInputTagRejectReason; value: string }];
}>();

const field = useFieldContext();
const fallbackId = useId('input-tag');
const inputId = computed(() => props.id ?? field?.inputId.value ?? fallbackId.value);
const labelId = computed(() => (props.ariaLabel ? undefined : field?.labelId.value));
const describedBy = computed(() =>
  mergeDescribedBy(props.ariaDescribedby, field?.describedBy.value)
);
const isInvalid = computed(() => props.invalid || field?.invalid.value || false);
const inputRef = ref<HTMLInputElement | null>(null);
const draftValue = ref('');
const selectedValues = computed(() => Array.from(props.modelValue));
const normalizedValueSet = computed(
  () => new Set(selectedValues.value.map((value) => value.toLowerCase()))
);
const isAtLimit = computed(
  () => props.maxTags !== undefined && selectedValues.value.length >= props.maxTags
);

function escapeForRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const separatorPattern = computed(() => {
  const separators = props.separators.filter((separator) => separator.length > 0);
  return new RegExp(separators.map((separator) => escapeForRegExp(separator)).join('|'), 'g');
});

function normalizeTag(value: string) {
  return props.trimTags ? value.trim() : value;
}

function splitCandidateValues(value: string) {
  return value
    .split(separatorPattern.value)
    .map(normalizeTag)
    .filter((candidate) => candidate.length > 0);
}

function acceptTag(nextValues: string[], candidate: string) {
  if (candidate.length === 0) {
    emit('reject', { reason: 'empty', value: candidate });
    return;
  }

  if (isAtLimit.value || (props.maxTags !== undefined && nextValues.length >= props.maxTags)) {
    emit('reject', { reason: 'limit', value: candidate });
    return;
  }

  if (
    !props.allowDuplicates &&
    (normalizedValueSet.value.has(candidate.toLowerCase()) ||
      nextValues.some((value) => value.toLowerCase() === candidate.toLowerCase()))
  ) {
    emit('reject', { reason: 'duplicate', value: candidate });
    return;
  }

  if (props.validateTag && !props.validateTag(candidate)) {
    emit('reject', { reason: 'invalid', value: candidate });
    return;
  }

  nextValues.push(candidate);
  emit('add', candidate);
}

function commitCandidates(candidates: readonly string[]) {
  if (props.disabled || props.readonly) {
    return;
  }

  const nextValues = selectedValues.value.slice();
  for (const candidate of candidates) {
    acceptTag(nextValues, candidate);
  }

  if (nextValues.length !== selectedValues.value.length) {
    emit('update:modelValue', nextValues);
  }
}

const commitDraft = () => {
  const candidate = normalizeTag(draftValue.value);
  draftValue.value = '';
  if (!candidate) {
    return;
  }

  commitCandidates([candidate]);
};

const removeTag = (value: string) => {
  if (props.disabled || props.readonly) {
    return;
  }

  emit(
    'update:modelValue',
    selectedValues.value.filter((entry) => entry !== value)
  );
  emit('remove', value);
  inputRef.value?.focus();
};

const focusInput = () => {
  inputRef.value?.focus();
};

const onInput = (event: Event) => {
  if (!(event.target instanceof HTMLInputElement)) {
    return;
  }

  draftValue.value = event.target.value;
};

const onKeydown = (event: KeyboardEvent) => {
  if (props.disabled || props.readonly) {
    return;
  }

  if (event.key === 'Enter' || props.separators.includes(event.key)) {
    event.preventDefault();
    commitDraft();
    return;
  }

  if (event.key === 'Backspace' && draftValue.value.length === 0) {
    const lastValue = selectedValues.value.at(-1);
    if (lastValue) {
      event.preventDefault();
      removeTag(lastValue);
    }
  }
};

const onBlur = () => {
  if (props.addOnBlur && draftValue.value.length > 0) {
    commitDraft();
  }
};

const onPaste = (event: ClipboardEvent) => {
  if (props.disabled || props.readonly) {
    return;
  }

  const text = event.clipboardData?.getData('text/plain') ?? '';
  const candidates = splitCandidateValues(text);
  if (candidates.length === 0) {
    return;
  }

  event.preventDefault();
  draftValue.value = '';
  commitCandidates(candidates);
};
</script>

<template>
  <div class="ui-input-tag">
    <div
      class="ui-input-tag__control"
      :class="{ 'is-invalid': isInvalid, 'is-disabled': props.disabled }"
      :role="props.ariaLabel || labelId ? 'group' : undefined"
      :aria-label="props.ariaLabel"
      :aria-labelledby="labelId"
      @click="focusInput"
    >
      <ul v-if="selectedValues.length > 0" class="ui-input-tag__list" role="list">
        <li v-for="tag in selectedValues" :key="tag" class="ui-input-tag__item">
          <span class="ui-tag ui-tag--neutral ui-tag--soft ui-tag--md ui-tag--rounded">
            <span class="ui-tag__label">{{ tag }}</span>
            <button
              type="button"
              class="ui-tag__close"
              :disabled="props.disabled || props.readonly"
              :aria-label="`Remove ${tag}`"
              data-ui-motion="ring-focus-soft"
              @click.stop="removeTag(tag)"
            >
              ×
            </button>
          </span>
        </li>
      </ul>
      <input
        :id="inputId"
        ref="inputRef"
        class="ui-input-tag__input"
        type="text"
        :name="undefined"
        :value="draftValue"
        :placeholder="selectedValues.length === 0 ? props.placeholder : undefined"
        :disabled="props.disabled || isAtLimit"
        :readonly="props.readonly"
        :aria-label="props.ariaLabel ? `${props.ariaLabel} input` : undefined"
        :aria-labelledby="props.ariaLabel ? undefined : labelId"
        :aria-describedby="describedBy"
        :aria-invalid="isInvalid || undefined"
        data-ui-motion="ring-focus-soft"
        @input="onInput"
        @keydown="onKeydown"
        @blur="onBlur"
        @paste="onPaste"
      />
    </div>
    <input
      v-for="(tag, index) in selectedValues"
      :key="`${tag}-${index}`"
      type="hidden"
      :name="props.name"
      :value="tag"
    />
  </div>
</template>
