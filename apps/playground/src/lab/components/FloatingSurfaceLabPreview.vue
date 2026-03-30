<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { UiButton } from '@ww/core';

import type { LabPreviewContext, LabSurfaceDefinition } from '../manifest/component-lab.types';
import { DynamicSlotRenderer } from './dynamic-slot-renderer';

defineOptions({ name: 'FloatingSurfaceLabPreview' });

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
      bodyText?: string;
      triggerLabel?: string;
      toggleLabel?: string;
      triggerSlot?: 'default' | 'trigger';
    }
);

const localOpen = ref(Boolean(props.state.open));

watch(
  () => props.state.open,
  (nextOpen) => {
    localOpen.value = Boolean(nextOpen);
  }
);

const surfaceProps = computed(() => ({
  ...(resolved.value?.componentProps ?? {}),
  open: localOpen.value,
  'onUpdate:open': (value: boolean) => {
    localOpen.value = value;
  },
}));

const slots = computed(
  () => props.definition.buildPreviewSlots?.(props.state, props.previewContext) ?? {}
);
</script>

<template>
  <div class="lab-preview lab-preview--floating" data-lab-preview-canvas="floating">
    <section class="lab-preview__overlay-surface" v-bind="resolved?.wrapperAttrs ?? {}">
      <div class="lab-preview__overlay-trigger">
        <UiButton variant="secondary" @click="localOpen = !localOpen">
          {{ resolved?.toggleLabel ?? (localOpen ? 'Hide surface' : 'Show surface') }}
        </UiButton>
      </div>

      <component :is="resolved?.component" v-bind="surfaceProps">
        <template v-if="resolved?.triggerSlot === 'trigger'" #trigger>
          <UiButton variant="secondary">
            {{ resolved?.triggerLabel ?? 'Surface anchor' }}
          </UiButton>
        </template>

        <template v-for="(slotRender, slotName) in slots" :key="slotName" #[slotName]="slotProps">
          <DynamicSlotRenderer :render="slotRender" :slot-props="slotProps" />
        </template>

        <UiButton v-if="resolved?.triggerSlot !== 'trigger'" variant="secondary">
          {{ resolved?.triggerLabel ?? 'Surface anchor' }}
        </UiButton>

        <p v-if="resolved?.bodyText" style="margin: 0; max-width: 16rem">
          {{ resolved.bodyText }}
        </p>
      </component>
    </section>
  </div>
</template>
