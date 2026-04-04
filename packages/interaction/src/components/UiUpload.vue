<script setup lang="ts">
import { computed } from 'vue';

import { UiButton, UiFilePicker, UiProgress, UiTag } from '@ww/core';
import { useControllable } from '@ww/primitives';
import type { UiUploadItem, UiUploadTransport } from '../types';

defineOptions({ name: 'UiUpload' });

const props = withDefaults(
  defineProps<{
    modelValue?: UiUploadItem[];
    transport: UiUploadTransport;
    autoStart?: boolean;
    multiple?: boolean;
    accept?: string;
    disabled?: boolean;
    maxConcurrent?: number;
  }>(),
  {
    autoStart: false,
    disabled: false,
    maxConcurrent: 2,
    multiple: true,
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: UiUploadItem[]];
}>();

const activeUploads = new Map<string, AbortController>();

const uploadState = useControllable<UiUploadItem[]>({
  defaultValue: [],
  onChange: (value) => emit('update:modelValue', value),
  value: computed(() => props.modelValue),
});

const syncItems = (nextItems: UiUploadItem[]) => {
  uploadState.setValue(nextItems);
};

const queueFiles = computed(() =>
  uploadState.currentValue.value
    .map((item) => item.file)
    .filter((file): file is File => file instanceof File)
);

const fileId = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;

const updateItem = (id: string, patch: Partial<UiUploadItem>) => {
  syncItems(
    uploadState.currentValue.value.map((item) => (item.id === id ? { ...item, ...patch } : item))
  );
};

const createItem = (file: File): UiUploadItem => ({
  file,
  id: fileId(file),
  name: file.name,
  progress: 0,
  size: file.size,
  status: 'queued',
  type: file.type,
});

const onPickerUpdate = (files: File[]) => {
  const incomingIds = new Set(files.map((file) => fileId(file)));
  const existingItems = uploadState.currentValue.value.filter(
    (item) => incomingIds.has(item.id) || item.status === 'uploading'
  );
  const knownIds = new Set(existingItems.map((item) => item.id));
  const nextItems = [...existingItems];

  for (const file of files) {
    const id = fileId(file);
    if (!knownIds.has(id)) {
      nextItems.push(createItem(file));
    }
  }

  syncItems(nextItems);
  if (props.autoStart) {
    void startUploads();
  }
};

const cancelUpload = (id: string) => {
  activeUploads.get(id)?.abort();
  activeUploads.delete(id);
  updateItem(id, {
    error: 'Upload canceled.',
    status: 'canceled',
  });
};

const removeItem = (id: string) => {
  cancelUpload(id);
  syncItems(uploadState.currentValue.value.filter((item) => item.id !== id));
};

const runUpload = async (item: UiUploadItem) => {
  const controller = new AbortController();
  activeUploads.set(item.id, controller);
  updateItem(item.id, {
    error: undefined,
    progress: 0,
    status: 'uploading',
  });

  try {
    const response = await props.transport({
      file: item.file,
      id: item.id,
      onProgress: (value) => {
        updateItem(item.id, {
          progress: Math.min(Math.max(value, 0), 100),
        });
      },
      signal: controller.signal,
    });

    updateItem(item.id, {
      progress: 100,
      response,
      status: 'success',
    });
  } catch (error) {
    if (controller.signal.aborted) {
      return;
    }

    updateItem(item.id, {
      error: error instanceof Error ? error.message : 'Upload failed.',
      status: 'error',
    });
  } finally {
    activeUploads.delete(item.id);
  }
};

const startUploads = async () => {
  const queuedItems = uploadState.currentValue.value.filter((item) => item.status === 'queued');
  const queue = [...queuedItems];

  while (queue.length > 0) {
    const batch = queue.splice(0, Math.max(props.maxConcurrent, 1));
    await Promise.all(batch.map((item) => runUpload(item)));
  }
};

const retryItem = async (id: string) => {
  updateItem(id, {
    error: undefined,
    progress: 0,
    status: 'queued',
  });

  await startUploads();
};

const statusTone = (status: UiUploadItem['status']) => {
  switch (status) {
    case 'success':
      return 'success';
    case 'error':
      return 'danger';
    case 'uploading':
      return 'info';
    case 'canceled':
      return 'warning';
    default:
      return 'neutral';
  }
};
</script>

<template>
  <div class="ui-upload">
    <UiFilePicker
      :model-value="queueFiles"
      :multiple="props.multiple"
      :disabled="props.disabled"
      v-bind="props.accept ? { accept: props.accept } : {}"
      @update:model-value="onPickerUpdate"
    />

    <div v-if="uploadState.currentValue.value.length > 0" class="ui-upload__toolbar">
      <UiButton :disabled="props.disabled" @click="startUploads">Start queued uploads</UiButton>
    </div>

    <ul class="ui-upload__list">
      <li v-for="item in uploadState.currentValue.value" :key="item.id" class="ui-upload__item">
        <div class="ui-upload__summary">
          <div>
            <strong>{{ item.name }}</strong>
            <p>{{ item.size }} bytes</p>
          </div>
          <UiTag :variant="statusTone(item.status)" size="sm">{{ item.status }}</UiTag>
        </div>

        <UiProgress :value="item.progress" />

        <p v-if="item.error" class="ui-upload__error">{{ item.error }}</p>

        <div class="ui-upload__actions">
          <UiButton
            v-if="item.status === 'queued'"
            size="sm"
            :disabled="props.disabled"
            @click="runUpload(item)"
          >
            Upload
          </UiButton>
          <UiButton
            v-if="item.status === 'uploading'"
            size="sm"
            variant="secondary"
            :disabled="props.disabled"
            @click="cancelUpload(item.id)"
          >
            Cancel
          </UiButton>
          <UiButton
            v-if="item.status === 'error' || item.status === 'canceled'"
            size="sm"
            variant="secondary"
            :disabled="props.disabled"
            @click="retryItem(item.id)"
          >
            Retry
          </UiButton>
          <UiButton size="sm" variant="ghost" :disabled="props.disabled" @click="removeItem(item.id)">
            Remove
          </UiButton>
        </div>
      </li>
    </ul>
  </div>
</template>
