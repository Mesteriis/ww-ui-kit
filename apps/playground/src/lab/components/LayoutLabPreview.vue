<script setup lang="ts">
import { computed } from 'vue';

import { UiBadge, UiButton } from '@ww/core';
import {
  UiLayout,
  UiLayoutContent,
  UiLayoutFooter,
  UiLayoutHeader,
  UiLayoutSection,
  UiLayoutSider,
  UiLayoutToolbar,
} from '@ww/page-templates';
import { UiWidgetShell } from '@ww/widgets';

import type { LabPreviewContext, LabSurfaceDefinition } from '../manifest/component-lab.types';

defineOptions({ name: 'LayoutLabPreview' });

const props = defineProps<{
  definition: LabSurfaceDefinition<Record<string, unknown>>;
  state: Record<string, unknown>;
  previewContext: LabPreviewContext;
}>();

const resolved = computed(
  () =>
    props.definition.buildPreviewProps?.(props.state, props.previewContext) as {
      wrapperAttrs?: Record<string, unknown>;
      layoutProps: Record<string, unknown>;
      hasSider: boolean;
      padded: boolean;
      title: string;
      description: string;
      sectionTitle: string;
      sectionDescription: string;
      widgetTitle: string;
      widgetDescription: string;
      sidebarNotes: readonly string[];
      footerText: string;
    }
);
</script>

<template>
  <div class="lab-preview lab-preview--layout" data-lab-preview-canvas="layout">
    <section class="lab-preview__layout-surface" v-bind="resolved?.wrapperAttrs ?? {}">
      <UiLayout v-bind="resolved?.layoutProps ?? {}">
        <template #header>
          <UiLayoutHeader>
            <div style="display: grid; gap: var(--ui-space-2)">
              <h1 style="margin: 0">{{ resolved?.title ?? 'Operations workspace' }}</h1>
              <p style="margin: 0; color: var(--ui-text-secondary)">
                {{ resolved?.description ?? 'Reusable layout shell above widgets and systems.' }}
              </p>
            </div>
            <UiBadge variant="brand">Layout shell</UiBadge>
          </UiLayoutHeader>
        </template>
        <template #toolbar>
          <UiLayoutToolbar>
            <UiButton variant="secondary" size="sm">Toolbar action</UiButton>
            <UiBadge variant="brand">Structural shell</UiBadge>
          </UiLayoutToolbar>
        </template>
        <UiLayoutContent :padded="resolved?.padded ?? true">
          <UiLayoutSection
            :title="resolved?.sectionTitle ?? 'Workspace section'"
            :description="resolved?.sectionDescription ?? 'Reusable shell section'"
          >
            <UiWidgetShell
              :title="resolved?.widgetTitle ?? 'Widget surface'"
              :description="
                resolved?.widgetDescription ?? 'Nested widget shell inside the layout shell.'
              "
              surface="subtle"
            >
              Route pages stay in apps while the layout shell stays reusable.
            </UiWidgetShell>
          </UiLayoutSection>
        </UiLayoutContent>
        <template v-if="resolved?.hasSider" #sider>
          <UiLayoutSider :padded="resolved?.padded ?? true">
            <UiLayoutSection
              title="Sidebar notes"
              description="Layered dependencies visible from the layout shell."
            >
              <div class="ui-stack">
                <UiBadge v-for="note in resolved?.sidebarNotes ?? []" :key="note">
                  {{ note }}
                </UiBadge>
              </div>
            </UiLayoutSection>
          </UiLayoutSider>
        </template>
        <template #footer>
          <UiLayoutFooter>{{ resolved?.footerText }}</UiLayoutFooter>
        </template>
      </UiLayout>
    </section>
  </div>
</template>
