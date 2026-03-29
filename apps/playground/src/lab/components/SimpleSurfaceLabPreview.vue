<script setup lang="ts">
import { computed } from 'vue';

import type { LabPreviewContext, LabSurfaceDefinition } from '../manifest/component-lab.types';
import { DynamicSlotRenderer } from './dynamic-slot-renderer';

defineOptions({ name: 'SimpleSurfaceLabPreview' });

const props = defineProps<{
  definition: LabSurfaceDefinition<Record<string, unknown>>;
  state: Record<string, unknown>;
  previewContext: LabPreviewContext;
}>();

const resolved = computed(
  () =>
    props.definition.buildPreviewProps?.(props.state, props.previewContext) as {
      component: unknown;
      componentProps?: Record<string, unknown>;
      wrapperAttrs?: Record<string, unknown>;
      stageClass?: string;
      surfaceClass?: string;
    }
);

const slots = computed(
  () => props.definition.buildPreviewSlots?.(props.state, props.previewContext) ?? {}
);
</script>

<template>
  <div
    class="lab-preview lab-preview--simple"
    :class="resolved?.stageClass"
    data-lab-preview-canvas="simple"
  >
    <div
      class="lab-preview__surface"
      :class="resolved?.surfaceClass"
      v-bind="resolved?.wrapperAttrs ?? {}"
    >
      <component :is="resolved?.component" v-bind="resolved?.componentProps ?? {}">
        <template v-for="(slotRender, slotName) in slots" :key="slotName" #[slotName]="slotProps">
          <DynamicSlotRenderer :render="slotRender" :slot-props="slotProps" />
        </template>
      </component>
    </div>
  </div>
</template>
