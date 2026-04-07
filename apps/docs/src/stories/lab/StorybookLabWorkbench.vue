<script setup lang="ts">
import { computed, ref } from 'vue';

import { UiBadge, UiButton, UiCard } from '@ww/core';
import { getThemeMeta, type ThemeName } from '@ww/themes';

import type {
  LabCopyFormat,
  LabPreviewContext,
  LabSurfaceDefinition,
} from '../../../../../apps/playground/src/lab/manifest/component-lab.types';

import { createStorybookLabSession } from './createStorybookLabSession';
import type { StorybookLabSurfaceMeta } from './surfaceLabManifest';
import StorybookLabControlField from './StorybookLabControlField.vue';
import StorybookLabPreviewCanvas from './StorybookLabPreviewCanvas.vue';

defineOptions({ name: 'StorybookLabWorkbench' });

const props = defineProps<{
  definition: LabSurfaceDefinition<Record<string, unknown>>;
  guideHref: string;
  guideTitle: string;
  playgroundPath: string;
  surfaceMeta: StorybookLabSurfaceMeta;
  themeName: ThemeName;
}>();

const copyFeedback = ref('');

const session = createStorybookLabSession(props.definition);

const previewContext = computed<LabPreviewContext>(() => {
  const themeMeta = getThemeMeta(props.themeName);

  return {
    themeMeta,
    themeName: themeMeta.name,
  };
});

const matrixStates = computed(() =>
  session.matrixItems.value.map((item) => ({
    ...item,
    state: {
      ...session.state.value,
      ...item.patch,
    },
  }))
);

const copyFormatLabel = computed(() => {
  const labelMap: Record<LabCopyFormat, string> = {
    json: 'JSON payload',
    'ts-object': 'TS object',
    vue: 'Vue snippet',
  };

  return labelMap[session.copyFormat.value] ?? session.copyFormat.value;
});

const relatedGuidePath = computed(() =>
  props.guideHref.replace('?path=/docs/', '').replace('--docs', '')
);

const openGuide = () => {
  window.parent.location.assign(props.guideHref);
};

const openMaintainerWorkbench = () => {
  window.open(props.playgroundPath, '_blank', 'noopener,noreferrer');
};

const onPresetChange = (event: Event) => {
  if (!(event.target instanceof HTMLSelectElement)) {
    return;
  }

  const target = event.target;
  const preset = props.definition.presets?.find((candidate) => candidate.id === target.value);
  session.applyPreset(preset ?? null);
};

const onCopyFormatChange = (event: Event) => {
  if (event.target instanceof HTMLSelectElement) {
    session.copyFormat.value = event.target.value as LabCopyFormat;
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
  await writeClipboard(session.copyText.value);
  copyFeedback.value = `${copyFormatLabel.value} copied`;
  window.setTimeout(() => {
    copyFeedback.value = '';
  }, 1600);
};
</script>

<template>
  <section class="sb-lab" :data-lab-surface="props.surfaceMeta.id">
    <header class="sb-lab__hero">
      <div class="sb-lab__hero-copy">
        <p class="sb-lab__eyebrow">{{ props.surfaceMeta.family }} lab</p>
        <h1>{{ props.surfaceMeta.title }}</h1>
        <p>{{ props.definition.description }}</p>
      </div>

      <div class="sb-lab__badges">
        <UiBadge variant="brand">{{ props.surfaceMeta.packageName }}</UiBadge>
        <UiBadge variant="success">{{ previewContext.themeMeta.label }}</UiBadge>
        <UiBadge>{{ previewContext.themeMeta.type }}</UiBadge>
      </div>

      <div class="sb-lab__actions">
        <UiButton @click="openGuide">Open guide</UiButton>
        <UiButton variant="secondary" @click="openMaintainerWorkbench">
          Maintainer workbench
        </UiButton>
        <UiButton variant="secondary" @click="session.reset">Reset</UiButton>
      </div>
    </header>

    <div class="sb-lab__layout">
      <section class="sb-lab__stage">
        <UiCard class="sb-lab__card">
          <template #header>
            <div class="sb-lab__card-header">
              <div>
                <h2>Preview stage</h2>
                <p>Switch between a single copy-ready config and the governed matrix review.</p>
              </div>

              <div class="sb-lab__segment" role="group" aria-label="Preview mode">
                <button
                  v-for="mode in props.definition.previewModes"
                  :key="mode"
                  type="button"
                  class="sb-lab__chip"
                  :class="{ 'is-active': session.previewMode.value === mode }"
                  :aria-pressed="session.previewMode.value === mode"
                  @click="session.previewMode.value = mode"
                >
                  {{ mode === 'single' ? 'Single preview' : 'Variant matrix' }}
                </button>
              </div>
            </div>
          </template>

          <div v-if="session.previewMode.value === 'single'" class="sb-lab__single-stage">
            <StorybookLabPreviewCanvas
              :definition="props.definition"
              :preview-context="previewContext"
              :state="session.state.value"
            />
          </div>

          <div v-else class="sb-lab__matrix">
            <article
              v-for="item in matrixStates"
              :key="item.id"
              class="sb-lab__matrix-item"
              :data-lab-matrix-item="item.id"
            >
              <header class="sb-lab__matrix-header">
                <strong>{{ item.title }}</strong>
                <span v-if="item.description">{{ item.description }}</span>
              </header>

              <StorybookLabPreviewCanvas
                :definition="props.definition"
                :preview-context="previewContext"
                :state="item.state"
              />
            </article>
          </div>
        </UiCard>

        <UiCard class="sb-lab__card">
          <template #header>
            <div class="sb-lab__card-header">
              <div>
                <h2>Copy config</h2>
                <p>Keep only public props and slots, without lab-only runtime noise.</p>
              </div>

              <div class="sb-lab__copy-bar">
                <label class="sb-lab__field">
                  <span>Copy format</span>
                  <select
                    aria-label="Copy format"
                    class="ui-input ui-select__control sb-lab__select"
                    :value="session.copyFormat.value"
                    @change="onCopyFormatChange"
                  >
                    <option
                      v-for="format in props.definition.copyFormats"
                      :key="format"
                      :value="format"
                    >
                      {{ format === 'ts-object' ? 'ts object' : format === 'vue' ? 'vue snippet' : format }}
                    </option>
                  </select>
                </label>

                <UiButton data-lab-copy-button="true" @click="copyConfig">Copy current config</UiButton>
              </div>
            </div>
          </template>

          <p v-if="copyFeedback" class="sb-lab__copy-feedback" data-lab-copy-feedback="true">
            {{ copyFeedback }}
          </p>

          <pre class="sb-lab__code"><code>{{ session.copyText.value }}</code></pre>
        </UiCard>
      </section>

      <aside class="sb-lab__sidebar">
        <UiCard v-if="props.definition.presets?.length" class="sb-lab__card">
          <template #header>
            <div class="sb-lab__card-header">
              <div>
                <h2>Presets</h2>
                <p>Curated starting points for common review paths.</p>
              </div>
            </div>
          </template>

          <label class="sb-lab__field">
            <span>Preset</span>
            <select
              aria-label="Preset"
              class="ui-input ui-select__control sb-lab__select"
              :value="session.activePresetId.value ?? ''"
              @change="onPresetChange"
            >
              <option value="">Custom</option>
              <option
                v-for="preset in props.definition.presets"
                :key="preset.id"
                :value="preset.id"
              >
                {{ preset.label }}
              </option>
            </select>
          </label>
        </UiCard>

        <UiCard
          v-for="section in props.definition.controlSections"
          :key="section.id"
          class="sb-lab__card"
        >
          <template #header>
            <div class="sb-lab__card-header">
              <div>
                <h2>{{ section.title }}</h2>
                <p v-if="section.description">{{ section.description }}</p>
              </div>
            </div>
          </template>

          <div class="sb-lab__controls">
            <StorybookLabControlField
              v-for="control in section.controls"
              :key="control.id"
              :control="control"
              :model-value="session.state.value[control.id]"
              @bulk-action="session.setMultiToggleMode(control.id, $event)"
              @update:model-value="session.update(control.id, $event)"
            />
          </div>
        </UiCard>

        <UiCard class="sb-lab__card">
          <template #header>
            <div class="sb-lab__card-header">
              <div>
                <h2>Lab contract</h2>
                <p>Storybook owns public tuning and copy flows; advanced composition still lives in playground.</p>
              </div>
            </div>
          </template>

          <dl class="sb-lab__meta">
            <div>
              <dt>Guide</dt>
              <dd>{{ props.guideTitle }}</dd>
            </div>
            <div>
              <dt>Guide path</dt>
              <dd>{{ relatedGuidePath }}</dd>
            </div>
            <div>
              <dt>Maintainer path</dt>
              <dd>{{ props.playgroundPath }}</dd>
            </div>
            <div>
              <dt>Schema file</dt>
              <dd>{{ props.surfaceMeta.runtimeFiles.schema }}</dd>
            </div>
            <div>
              <dt>Preview runtime</dt>
              <dd>{{ props.surfaceMeta.runtimeFiles.preview }}</dd>
            </div>
          </dl>

          <div class="sb-lab__lists">
            <section>
              <h3>Preview modes</h3>
              <ul>
                <li v-for="mode in props.surfaceMeta.previewModes" :key="mode">{{ mode }}</li>
              </ul>
            </section>

            <section>
              <h3>Copy formats</h3>
              <ul>
                <li v-for="format in props.surfaceMeta.copyFormats" :key="format">{{ format }}</li>
              </ul>
            </section>
          </div>
        </UiCard>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.sb-lab {
  --sb-lab-bg: linear-gradient(180deg, #07131d 0%, #081923 42%, #f3f7fa 42%, #eef4f7 100%);
  --sb-lab-panel: rgba(255, 255, 255, 0.96);
  --sb-lab-panel-strong: rgba(6, 18, 26, 0.95);
  --sb-lab-border: rgba(104, 142, 161, 0.24);
  --sb-lab-border-strong: rgba(110, 242, 220, 0.26);
  --sb-lab-shadow: 0 18px 46px rgba(7, 17, 25, 0.16);
  --sb-lab-code-bg: #07131d;
  --sb-lab-code-text: #d9edf4;
  display: grid;
  gap: 1.5rem;
  min-height: 100dvh;
  padding: 1.5rem;
  background: var(--sb-lab-bg);
}

.sb-lab__hero {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--sb-lab-border-strong);
  border-radius: 1.5rem;
  background:
    radial-gradient(circle at top right, rgba(110, 242, 220, 0.22), transparent 28rem),
    radial-gradient(circle at left center, rgba(255, 141, 150, 0.18), transparent 22rem),
    var(--sb-lab-panel-strong);
  color: #eff6fa;
  box-shadow: var(--sb-lab-shadow);
}

.sb-lab__hero-copy {
  display: grid;
  gap: 0.5rem;
  max-width: 52rem;
}

.sb-lab__hero-copy h1,
.sb-lab__card-header h2,
.sb-lab__lists h3 {
  margin: 0;
  font-size: 1.1rem;
}

.sb-lab__hero-copy h1 {
  font-size: clamp(1.9rem, 2.8vw, 3rem);
  letter-spacing: -0.04em;
}

.sb-lab__hero-copy p,
.sb-lab__card-header p {
  margin: 0;
  color: rgba(224, 236, 244, 0.8);
}

.sb-lab__eyebrow {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #6ef2dc;
}

.sb-lab__badges,
.sb-lab__actions,
.sb-lab__copy-bar,
.sb-lab__segment,
.sb-lab-control__segment,
.sb-lab-control__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.sb-lab__layout {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: minmax(0, 1.45fr) minmax(22rem, 0.95fr);
  align-items: start;
}

.sb-lab__stage,
.sb-lab__sidebar {
  display: grid;
  gap: 1rem;
}

.sb-lab__card {
  border: 1px solid var(--sb-lab-border);
  background: var(--sb-lab-panel);
  box-shadow: var(--sb-lab-shadow);
}

.sb-lab__card-header {
  display: grid;
  gap: 0.35rem;
}

.sb-lab__card-header p {
  color: var(--ui-text-secondary);
}

.sb-lab__chip,
.sb-lab-control__chip,
.sb-lab-control__subtle {
  border: 1px solid var(--sb-lab-border);
  border-radius: 999px;
  background: rgba(7, 19, 29, 0.04);
  color: var(--ui-text-primary);
  cursor: pointer;
  transition:
    border-color 160ms ease,
    background-color 160ms ease,
    color 160ms ease;
}

.sb-lab__chip,
.sb-lab-control__chip {
  padding: 0.55rem 0.9rem;
}

.sb-lab__chip.is-active,
.sb-lab-control__chip.is-active {
  border-color: rgba(11, 126, 119, 0.5);
  background: rgba(110, 242, 220, 0.18);
  color: #07555b;
}

.sb-lab__single-stage {
  display: grid;
}

.sb-lab__matrix {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
}

.sb-lab__matrix-item {
  display: grid;
  gap: 0.85rem;
  padding: 1rem;
  border: 1px solid var(--sb-lab-border);
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(243, 248, 250, 0.96), rgba(255, 255, 255, 0.98));
}

.sb-lab__matrix-header {
  display: grid;
  gap: 0.2rem;
}

.sb-lab__matrix-header span {
  color: var(--ui-text-secondary);
  font-size: 0.9rem;
}

.sb-lab__field {
  display: grid;
  gap: 0.45rem;
  min-width: 11rem;
  font-size: 0.92rem;
  color: var(--ui-text-secondary);
}

.sb-lab__select,
.sb-lab-control__input,
.sb-lab-control__select {
  width: 100%;
}

.sb-lab__copy-feedback,
.sb-lab-control__help {
  margin: 0;
  color: var(--ui-text-secondary);
  font-size: 0.9rem;
}

.sb-lab__code {
  margin: 0;
  overflow: auto;
  padding: 1rem;
  border-radius: 1rem;
  background: var(--sb-lab-code-bg);
  color: var(--sb-lab-code-text);
  font-size: 0.88rem;
  line-height: 1.55;
}

.sb-lab__meta {
  display: grid;
  gap: 0.9rem;
  margin: 0;
}

.sb-lab__meta div {
  display: grid;
  gap: 0.25rem;
}

.sb-lab__meta dt {
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ui-text-secondary);
}

.sb-lab__meta dd {
  margin: 0;
  word-break: break-word;
}

.sb-lab__lists {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.sb-lab__lists ul {
  margin: 0.5rem 0 0;
  padding-left: 1rem;
  color: var(--ui-text-secondary);
}

.sb-lab-canvas {
  display: grid;
  min-height: 18rem;
  padding: 1rem;
  border: 1px dashed rgba(107, 140, 156, 0.35);
  border-radius: 1.25rem;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(243, 249, 250, 0.96)),
    linear-gradient(135deg, rgba(110, 242, 220, 0.08), rgba(255, 141, 150, 0.08));
}

.sb-lab-canvas__surface {
  display: grid;
  align-content: center;
  justify-items: start;
  gap: 1rem;
  min-height: 100%;
  padding: 1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(104, 142, 161, 0.2);
}

.sb-lab__controls {
  display: grid;
  gap: 1rem;
}

.sb-lab-control {
  display: grid;
  gap: 0.65rem;
}

.sb-lab-control__header,
.sb-lab-control__body,
.sb-lab-control__stack {
  display: grid;
  gap: 0.4rem;
}

.sb-lab-control__label {
  font-weight: 600;
}

.sb-lab-control__toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
}

.sb-lab-control__segment--wrap {
  display: flex;
  flex-wrap: wrap;
}

.sb-lab-control__subtle {
  padding: 0.45rem 0.85rem;
}

@media (max-width: 1100px) {
  .sb-lab__layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .sb-lab {
    padding: 1rem;
  }

  .sb-lab__hero,
  .sb-lab-canvas,
  .sb-lab__matrix-item {
    padding: 1rem;
  }

  .sb-lab__copy-bar {
    display: grid;
  }
}
</style>
