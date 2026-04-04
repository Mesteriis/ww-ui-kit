<script setup lang="ts">
import { computed, ref } from 'vue';

import { useControllable } from '@ww/primitives';

import UiButton from '../buttons/UiButton.vue';
import UiIcon from '../display/UiIcon.vue';

defineOptions({ name: 'UiFilePicker' });

const props = withDefaults(
  defineProps<{
    modelValue?: File[];
    multiple?: boolean;
    accept?: string;
    disabled?: boolean;
    maxFiles?: number;
    dragLabel?: string;
    buttonLabel?: string;
  }>(),
  {
    buttonLabel: 'Choose files',
    disabled: false,
    dragLabel: 'Drop files here or choose from disk',
    maxFiles: Number.POSITIVE_INFINITY,
    multiple: true,
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: File[]];
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const dragging = ref(false);

const fileState = useControllable<File[]>({
  defaultValue: [],
  onChange: (value) => emit('update:modelValue', value),
  value: computed(() => props.modelValue),
});

const formatBytes = (value: number) => {
  if (value < 1024) {
    return `${value} B`;
  }

  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
};

const normalizeFiles = (files: FileList | null) => {
  if (!files) {
    return;
  }

  const nextFiles = Array.from(files).slice(0, props.maxFiles);
  fileState.setValue(nextFiles);
};

const removeFile = (index: number) => {
  const nextFiles = fileState.currentValue.value.filter((_, fileIndex) => fileIndex !== index);
  fileState.setValue(nextFiles);
};
</script>

<template>
  <div
    class="ui-file-picker"
    :class="{ 'is-dragging': dragging }"
    @dragenter.prevent="dragging = true"
    @dragover.prevent="dragging = true"
    @dragleave.prevent="dragging = false"
    @drop.prevent="
      dragging = false;
      if (!props.disabled) {
        normalizeFiles($event.dataTransfer?.files ?? null);
      }
    "
  >
    <input
      ref="inputRef"
      class="ui-file-picker__input"
      type="file"
      :accept="props.accept"
      :multiple="props.multiple"
      :disabled="props.disabled"
      @change="normalizeFiles(($event.target as HTMLInputElement).files)"
    />

    <div class="ui-file-picker__dropzone">
      <UiIcon name="upload" class="ui-file-picker__icon" />
      <p class="ui-file-picker__label">{{ props.dragLabel }}</p>
      <UiButton :disabled="props.disabled" variant="secondary" @click="inputRef?.click()">
        {{ props.buttonLabel }}
      </UiButton>
    </div>

    <ul v-if="fileState.currentValue.value.length > 0" class="ui-file-picker__list">
      <li v-for="(file, index) in fileState.currentValue.value" :key="`${file.name}-${index}`">
        <span class="ui-file-picker__file-name">{{ file.name }}</span>
        <span class="ui-file-picker__file-size">{{ formatBytes(file.size) }}</span>
        <button
          type="button"
          class="ui-file-picker__remove"
          :aria-label="`Remove ${file.name}`"
          @click="removeFile(index)"
        >
          <UiIcon name="close" decorative />
        </button>
      </li>
    </ul>
  </div>
</template>
