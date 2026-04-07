<script setup lang="ts">
import { computed } from 'vue';

import { UiField } from '@ww/core';

import type {
  LabPreviewContext,
  LabSurfaceDefinition,
} from '../../../../../apps/playground/src/lab/manifest/component-lab.types';

import { DynamicSlotRenderer } from './DynamicSlotRenderer';

defineOptions({ name: 'StorybookLabPreviewCanvas' });

const props = defineProps<{
  definition: LabSurfaceDefinition<Record<string, unknown>>;
  previewContext: LabPreviewContext;
  state: Record<string, unknown>;
}>();

const resolved = computed(
  () =>
    props.definition.buildPreviewProps?.(props.state, props.previewContext) as {
      component: unknown;
      componentProps?: Record<string, unknown>;
      fieldProps?: Record<string, unknown>;
      surfaceClass?: string;
      wrapperAttrs?: Record<string, unknown>;
    }
);

const slots = computed(
  () => props.definition.buildPreviewSlots?.(props.state, props.previewContext) ?? {}
);
</script>

<template>
  <div class="sb-lab-canvas">
    <section
      class="sb-lab-canvas__surface"
      :class="resolved?.surfaceClass"
      v-bind="resolved?.wrapperAttrs ?? {}"
    >
      <UiField v-if="resolved?.fieldProps" v-bind="resolved.fieldProps">
        <component :is="resolved?.component" v-bind="resolved?.componentProps ?? {}">
          <template v-for="(slotRender, slotName) in slots" :key="slotName" #[slotName]="slotProps">
            <DynamicSlotRenderer :render="slotRender" :slot-props="slotProps" />
          </template>
        </component>
      </UiField>

      <component v-else :is="resolved?.component" v-bind="resolved?.componentProps ?? {}">
        <template v-for="(slotRender, slotName) in slots" :key="slotName" #[slotName]="slotProps">
          <DynamicSlotRenderer :render="slotRender" :slot-props="slotProps" />
        </template>
      </component>
    </section>
  </div>
</template>
