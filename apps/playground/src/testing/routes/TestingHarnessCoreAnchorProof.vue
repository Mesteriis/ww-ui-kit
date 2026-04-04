<script setup lang="ts">
import { ref } from 'vue';

import { UiAnchor, UiScrollArea } from '@ww/core';

defineOptions({ name: 'TestingHarnessCoreAnchorProof' });

const activeSection = ref<string | null>('overview');

const items = [
  { key: 'overview', label: 'Overview', href: '#core-wave-anchor-overview' },
  { key: 'contracts', label: 'Contracts', href: '#core-wave-anchor-contracts' },
  { key: 'ship', label: 'Ship', href: '#core-wave-anchor-ship' },
];

const sections = [
  {
    id: 'core-wave-anchor-overview',
    title: 'Overview',
    copy: 'The active section stays in sync with the scroll container.',
  },
  {
    id: 'core-wave-anchor-contracts',
    title: 'Contracts',
    copy: 'Anchor logic remains reusable and governed instead of being app-local.',
  },
  {
    id: 'core-wave-anchor-ship',
    title: 'Ship',
    copy: 'Smooth scrolling stays explicit and container-aware for downstream consumers.',
  },
];
</script>

<template>
  <div class="ui-stack">
    <div
      style="
        display: grid;
        gap: var(--ui-space-4);
        grid-template-columns: minmax(0, 12rem) minmax(0, 1fr);
        align-items: start;
      "
    >
      <UiAnchor
        v-model="activeSection"
        :items="items"
        target="#core-wave-anchor-scroll"
        :offset-top="12"
        aria-label="Core wave section anchor"
      />

      <UiScrollArea
        id="core-wave-anchor-scroll"
        :max-height="240"
        aria-label="Core wave anchor sections"
      >
        <div class="ui-stack" style="padding-inline-end: var(--ui-space-2)">
          <section
            v-for="section in sections"
            :id="section.id"
            :key="section.id"
            style="
              min-block-size: 12rem;
              padding: var(--ui-space-4);
              border: 1px solid var(--ui-border-subtle);
              border-radius: var(--ui-radius-lg);
              background: var(--ui-surface-subtle);
            "
          >
            <h2 style="margin: 0 0 var(--ui-space-2)">{{ section.title }}</h2>
            <p style="margin: 0">{{ section.copy }}</p>
          </section>
        </div>
      </UiScrollArea>
    </div>

    <p style="margin: 0">Active anchor: {{ activeSection ?? 'none' }}</p>
  </div>
</template>
