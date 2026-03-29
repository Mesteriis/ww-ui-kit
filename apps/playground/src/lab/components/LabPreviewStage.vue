<script setup lang="ts">
import { computed } from 'vue';

import type {
  ComponentLabEntry,
  LabPreviewContext,
  LabPreviewMode,
} from '../manifest/component-lab.types';

defineOptions({ name: 'LabPreviewStage' });

const props = defineProps<{
  entry: ComponentLabEntry<Record<string, unknown>>;
  state: Record<string, unknown>;
  previewMode: LabPreviewMode;
  previewContext: LabPreviewContext;
}>();

const matrixStates = computed(() =>
  props.entry.definition.buildMatrixItems(props.state).map((item) => ({
    ...item,
    state: {
      ...props.state,
      ...item.patch,
    },
  }))
);
</script>

<template>
  <section class="lab-stage" :data-lab-preview-mode="props.previewMode">
    <header class="lab-stage__header">
      <p class="lab-stage__eyebrow">{{ props.entry.packageName }} · {{ props.entry.stability }}</p>
      <h2>{{ props.entry.title }}</h2>
      <p>{{ props.entry.definition.description }}</p>
    </header>

    <div
      v-if="props.previewMode === 'single'"
      class="lab-stage__single"
      data-lab-preview-mode="single"
    >
      <component
        :is="props.entry.definition.previewComponent"
        :definition="props.entry.definition"
        :state="props.state"
        :preview-context="props.previewContext"
      />
    </div>

    <div v-else class="lab-stage__matrix" data-lab-preview-mode="matrix">
      <article
        v-for="item in matrixStates"
        :key="item.id"
        class="lab-stage__matrix-item"
        :data-lab-matrix-item="item.id"
      >
        <header class="lab-stage__matrix-header">
          <strong>{{ item.title }}</strong>
          <span v-if="item.description">{{ item.description }}</span>
        </header>
        <component
          :is="props.entry.definition.previewComponent"
          :definition="props.entry.definition"
          :state="item.state"
          :preview-context="props.previewContext"
        />
      </article>
    </div>
  </section>
</template>
