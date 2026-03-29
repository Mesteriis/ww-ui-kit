<script setup lang="ts">
import { computed } from 'vue';

import { UiField } from '@ww/core';

import type { LabPreviewContext, LabSurfaceDefinition } from '../manifest/component-lab.types';
import { DynamicSlotRenderer } from './dynamic-slot-renderer';

defineOptions({ name: 'FieldSurfaceLabPreview' });

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
      fieldProps?: Record<string, unknown>;
      wrapperAttrs?: Record<string, unknown>;
      stageClass?: string;
    }
);

const slots = computed(
  () => props.definition.buildPreviewSlots?.(props.state, props.previewContext) ?? {}
);
</script>

<template>
  <div
    class="lab-preview lab-preview--field"
    :class="resolved?.stageClass"
    data-lab-preview-canvas="field"
  >
    <section class="lab-preview__field-surface" v-bind="resolved?.wrapperAttrs ?? {}">
      <UiField v-bind="resolved?.fieldProps ?? {}">
        <component :is="resolved?.component" v-bind="resolved?.componentProps ?? {}">
          <template v-for="(slotRender, slotName) in slots" :key="slotName" #[slotName]="slotProps">
            <DynamicSlotRenderer :render="slotRender" :slot-props="slotProps" />
          </template>
        </component>
      </UiField>
    </section>
  </div>
</template>
