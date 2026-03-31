<script setup lang="ts">
import { ref } from 'vue';

import type {
  ComponentLabEntry,
  LabCopyFormat,
  LabPreviewContext,
  LabPreviewMode,
} from '../manifest/component-lab.types';
import LabControlField from './LabControlField.vue';
import LabUsagePanel from './LabUsagePanel.vue';

defineOptions({ name: 'LabInspectorPanel' });

const props = defineProps<{
  entry: ComponentLabEntry<Record<string, unknown>>;
  state: Record<string, unknown>;
  previewMode: LabPreviewMode;
  copyFormat: LabCopyFormat;
  copyText: string;
  activePresetId: string | null;
  previewContext: LabPreviewContext;
}>();

const emit = defineEmits<{
  updateState: [key: string, value: unknown];
  setPreviewMode: [mode: LabPreviewMode];
  setCopyFormat: [format: LabCopyFormat];
  reset: [];
  bulkToggle: [controlId: string, mode: 'all' | 'none'];
  applyPreset: [presetId: string | null];
}>();

const copyFeedback = ref('');

const onPresetChange = (event: Event) => {
  if (event.target instanceof HTMLSelectElement) {
    emit('applyPreset', event.target.value || null);
  }
};

const onCopyFormatChange = (event: Event) => {
  if (event.target instanceof HTMLSelectElement) {
    emit('setCopyFormat', event.target.value as LabCopyFormat);
  }
};

async function writeClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

const copyConfig = async () => {
  await writeClipboard(props.copyText);
  copyFeedback.value = `Copied ${props.copyFormat}`;
  window.setTimeout(() => {
    copyFeedback.value = '';
  }, 1800);
};
</script>

<template>
  <aside class="lab-inspector" data-lab-inspector="panel">
    <section class="lab-panel">
      <header class="lab-panel__header">
        <h3>Metadata</h3>
        <p>Package, layer, stability, and active theme metadata for the selected surface.</p>
      </header>
      <dl class="lab-meta">
        <div class="lab-meta__item" data-lab-meta="package">
          <dt>Package</dt>
          <dd :title="props.entry.packageName">{{ props.entry.packageName }}</dd>
        </div>
        <div class="lab-meta__item" data-lab-meta="layer">
          <dt>Layer</dt>
          <dd :title="props.entry.packageLayer">{{ props.entry.packageLayer }}</dd>
        </div>
        <div class="lab-meta__item" data-lab-meta="stability">
          <dt>Stability</dt>
          <dd :title="props.entry.stability">{{ props.entry.stability }}</dd>
        </div>
        <div class="lab-meta__item" data-lab-meta="export">
          <dt>Export</dt>
          <dd :title="props.entry.exportName">{{ props.entry.exportName }}</dd>
        </div>
        <div class="lab-meta__item" data-lab-meta="theme-name">
          <dt>ThemeName</dt>
          <dd :title="props.previewContext.themeName">{{ props.previewContext.themeName }}</dd>
        </div>
        <div class="lab-meta__item" data-lab-meta="theme-type">
          <dt>ThemeType</dt>
          <dd :title="props.previewContext.themeMeta.type">
            {{ props.previewContext.themeMeta.type }}
          </dd>
        </div>
      </dl>
    </section>

    <section v-if="props.entry.definition.presets?.length" class="lab-panel">
      <header class="lab-panel__header">
        <h3>Presets</h3>
        <p>Curated maintainer presets for common visual review flows.</p>
      </header>
      <select
        class="ui-input ui-select__control"
        :value="props.activePresetId ?? ''"
        @change="onPresetChange"
      >
        <option value="">Custom</option>
        <option
          v-for="preset in props.entry.definition.presets"
          :key="preset.id"
          :value="preset.id"
        >
          {{ preset.label }}
        </option>
      </select>
    </section>

    <section class="lab-panel">
      <header class="lab-panel__header">
        <h3>Preview mode</h3>
        <p>Switch between the current single configuration and the curated matrix view.</p>
      </header>
      <div class="lab-control__segment">
        <button
          v-for="mode in props.entry.definition.previewModes"
          :key="mode"
          type="button"
          class="lab-control__chip"
          :class="{ 'is-active': props.previewMode === mode }"
          :aria-pressed="props.previewMode === mode"
          @click="emit('setPreviewMode', mode)"
        >
          {{ mode === 'single' ? 'Single preview' : 'Variant matrix' }}
        </button>
      </div>
      <button type="button" class="lab-control__subtle" @click="emit('reset')">
        Reset to defaults
      </button>
    </section>

    <section
      v-for="section in props.entry.definition.controlSections"
      :key="section.id"
      class="lab-panel"
    >
      <header class="lab-panel__header">
        <h3>{{ section.title }}</h3>
        <p v-if="section.description">{{ section.description }}</p>
      </header>
      <div class="lab-panel__controls">
        <LabControlField
          v-for="control in section.controls"
          :key="control.id"
          :control="control"
          :model-value="props.state[control.id]"
          @update:model-value="emit('updateState', control.id, $event)"
          @bulk-action="emit('bulkToggle', control.id, $event)"
        />
      </div>
    </section>

    <section class="lab-panel">
      <header class="lab-panel__header">
        <h3>Copy config</h3>
        <p>Copy the current curated configuration without lab-only runtime noise.</p>
      </header>
      <div class="lab-copy">
        <select
          class="ui-input ui-select__control"
          :value="props.copyFormat"
          @change="onCopyFormatChange"
        >
          <option
            v-for="format in props.entry.definition.copyFormats"
            :key="format"
            :value="format"
          >
            {{ format === 'ts-object' ? 'ts object' : format === 'vue' ? 'vue snippet' : format }}
          </option>
        </select>
        <button
          type="button"
          class="lab-copy__button"
          data-lab-copy-button="true"
          @click="copyConfig"
        >
          Copy current config
        </button>
      </div>
      <p v-if="copyFeedback" class="lab-copy__feedback" data-lab-copy-feedback="true">
        {{ copyFeedback }}
      </p>
      <pre class="lab-copy__preview"><code>{{ props.copyText }}</code></pre>
    </section>

    <LabUsagePanel :usage="props.entry.usage" />
  </aside>
</template>
