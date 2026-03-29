<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue';

import type { ThemeMeta, ThemeName } from '@ww/themes';

import type {
  ComponentLabEntry,
  LabCopyFormat,
  LabPreviewMode,
  LabSession,
} from '../manifest/component-lab.types';
import LabInspectorPanel from '../components/LabInspectorPanel.vue';
import LabNavigation from '../components/LabNavigation.vue';
import LabPreviewStage from '../components/LabPreviewStage.vue';
import { componentLabFamilies, resolveLabEntry } from '../runtime/lab-catalog';
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

const selectedEntry = computed<ComponentLabEntry<Record<string, unknown>>>(() =>
  resolveLabEntry(props.surfaceId)
);
const session = shallowRef<LabSession<Record<string, unknown>>>(
  createLabSession<Record<string, unknown>>(selectedEntry.value.definition)
);

watch(
  () => selectedEntry.value.id,
  () => {
    session.value = createLabSession(selectedEntry.value.definition);
  },
  { immediate: true }
);

const previewContext = computed(() => ({
  themeName: props.themeName,
  themeMeta: props.themeMeta,
}));

const sessionState = computed(() => session.value.state.value);
const sessionPreviewMode = computed(() => session.value.previewMode.value);
const sessionCopyFormat = computed(() => session.value.copyFormat.value);
const sessionCopyText = computed(() => session.value.copyText.value);
const sessionActivePresetId = computed(() => session.value.activePresetId.value);

const updateState = (key: string, value: unknown) => {
  session.value.update(key as never, value as never);
};

const setPreviewMode = (mode: LabPreviewMode) => {
  session.value.previewMode.value = mode;
};

const setCopyFormat = (format: LabCopyFormat) => {
  session.value.copyFormat.value = format;
};
</script>

<template>
  <section class="lab-workbench" data-playground-mode="lab">
    <LabNavigation
      :families="componentLabFamilies"
      :selected-id="selectedEntry.id"
      @select="emit('navigateSurface', $event)"
    />

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
      @reset="session.reset"
      @bulk-toggle="session.setMultiToggleMode"
      @apply-preset="
        session.applyPreset(
          selectedEntry.definition.presets?.find(
            (preset: { id: string }) => preset.id === $event
          ) ?? null
        )
      "
    />
  </section>
</template>
