<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue';

import type { ThemeMeta, ThemeName } from '@ww/themes';

import type {
  ComponentLabCatalogEntry,
  ComponentLabEntry,
  LabCopyFormat,
  LabPreviewMode,
  LabSession,
} from '../manifest/component-lab.types';
import LabInspectorPanel from '../components/LabInspectorPanel.vue';
import LabNavigation from '../components/LabNavigation.vue';
import LabPreviewStage from '../components/LabPreviewStage.vue';
import { componentLabFamilies, loadLabEntry, resolveLabCatalogEntry } from '../runtime/lab-catalog';
import { createLabSession } from '../runtime/session';

defineOptions({ name: 'LabWorkbenchView' });

const props = defineProps<{
  surfaceId: string;
  themeName: ThemeName;
  themeMeta: ThemeMeta;
}>();

const emit = defineEmits<{
  navigateSurface: [surfaceId: string];
}>();

const selectedCatalogEntry = computed<ComponentLabCatalogEntry>(() =>
  resolveLabCatalogEntry(props.surfaceId)
);
const selectedEntry = shallowRef<ComponentLabEntry<Record<string, unknown>> | null>(null);
const session = shallowRef<LabSession<Record<string, unknown>> | null>(null);
const isLoading = ref(true);
const loadError = ref('');
let activeLoadId = 0;

watch(
  () => selectedCatalogEntry.value.id,
  async (surfaceId) => {
    activeLoadId += 1;
    const loadId = activeLoadId;
    isLoading.value = true;
    loadError.value = '';

    try {
      const entry = await loadLabEntry(surfaceId);
      if (loadId !== activeLoadId) {
        return;
      }

      selectedEntry.value = entry;
      session.value = createLabSession<Record<string, unknown>>(entry.definition);
    } catch (error) {
      if (loadId !== activeLoadId) {
        return;
      }

      selectedEntry.value = null;
      session.value = null;
      loadError.value =
        error instanceof Error
          ? error.message
          : 'Failed to load the governed component lab definition.';
    } finally {
      if (loadId === activeLoadId) {
        isLoading.value = false;
      }
    }
  },
  { immediate: true }
);

const previewContext = computed(() => ({
  themeName: props.themeName,
  themeMeta: props.themeMeta,
}));

const sessionState = computed(() => session.value?.state.value ?? {});
const sessionPreviewMode = computed<LabPreviewMode>(() => session.value?.previewMode.value ?? 'single');
const sessionCopyFormat = computed<LabCopyFormat>(() => session.value?.copyFormat.value ?? 'json');
const sessionCopyText = computed(() => session.value?.copyText.value ?? '');
const sessionActivePresetId = computed(() => session.value?.activePresetId.value ?? null);

const updateState = (key: string, value: unknown) => {
  if (!session.value) {
    return;
  }

  session.value.update(key as never, value as never);
};

const setPreviewMode = (mode: LabPreviewMode) => {
  if (!session.value) {
    return;
  }

  session.value.previewMode.value = mode;
};

const setCopyFormat = (format: LabCopyFormat) => {
  if (!session.value) {
    return;
  }

  session.value.copyFormat.value = format;
};

const resetSession = () => {
  if (!session.value) {
    return;
  }

  session.value.reset();
};

const setBulkToggleMode = (controlId: string, mode: 'all' | 'none') => {
  if (!session.value) {
    return;
  }

  session.value.setMultiToggleMode(controlId, mode);
};

const applyPreset = (presetId: string | null) => {
  if (!session.value || !selectedEntry.value) {
    return;
  }

  session.value.applyPreset(
    selectedEntry.value.definition.presets?.find((preset: { id: string }) => preset.id === presetId) ??
      null
  );
};
</script>

<template>
  <section class="lab-workbench" data-playground-mode="lab">
    <LabNavigation
      :families="componentLabFamilies"
      :selected-id="selectedCatalogEntry.id"
      @select="emit('navigateSurface', $event)"
    />

    <template v-if="selectedEntry && session">
      <LabPreviewStage
        :entry="selectedEntry"
        :state="sessionState"
        :preview-mode="sessionPreviewMode"
        :preview-context="previewContext"
      />

      <LabInspectorPanel
        :entry="selectedEntry"
        :state="sessionState"
        :preview-mode="sessionPreviewMode"
        :copy-format="sessionCopyFormat"
        :copy-text="sessionCopyText"
        :active-preset-id="sessionActivePresetId"
        :preview-context="previewContext"
        @update-state="updateState"
        @set-preview-mode="setPreviewMode"
        @set-copy-format="setCopyFormat"
        @reset="resetSession"
        @bulk-toggle="setBulkToggleMode"
        @apply-preset="applyPreset"
      />
    </template>

    <section v-else class="lab-stage" data-lab-preview-mode="loading">
      <header class="lab-stage__header">
        <p class="lab-stage__eyebrow">
          {{ selectedCatalogEntry.packageName }} · {{ selectedCatalogEntry.stability }}
        </p>
        <h2>{{ selectedCatalogEntry.title }}</h2>
        <p>
          {{
            isLoading
              ? 'Loading governed component lab definition.'
              : loadError || 'Governed component lab entry is unavailable.'
          }}
        </p>
      </header>
    </section>
  </section>
</template>
