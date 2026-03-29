<script setup lang="ts">
import type { LabUsageRecord } from '../manifest/component-lab.types';

defineOptions({ name: 'LabUsagePanel' });

const props = defineProps<{
  usage: LabUsageRecord;
}>();
</script>

<template>
  <section class="lab-panel">
    <header class="lab-panel__header">
      <h3>Downstream usage</h3>
      <p>
        Static import scan + manifest references for related stories, harnesses, docs, and direct
        consumers.
      </p>
    </header>

    <div class="lab-panel__section">
      <h4>Downstream packages</h4>
      <ul class="lab-panel__list">
        <li v-for="consumer in props.usage.downstreamPackages" :key="consumer.packageName">
          <strong>{{ consumer.packageName }}</strong>
          <span>{{ consumer.packageLayer }} · {{ consumer.count }} files</span>
        </li>
      </ul>
    </div>

    <div class="lab-panel__section">
      <h4>Repo usage groups</h4>
      <ul class="lab-panel__list">
        <li v-for="group in props.usage.usageGroups" :key="group.area">
          <strong>{{ group.area }}</strong>
          <span>{{ group.count }} files</span>
        </li>
      </ul>
    </div>

    <div class="lab-panel__section">
      <h4>Storybook groups</h4>
      <ul class="lab-panel__list">
        <li v-for="story in props.usage.relatedStorybook" :key="story.file">
          <strong>{{ story.title }}</strong>
          <span>{{ story.variant }}</span>
        </li>
      </ul>
    </div>

    <div class="lab-panel__section">
      <h4>Harness routes</h4>
      <ul class="lab-panel__list">
        <li v-for="harness in props.usage.relatedHarnesses" :key="harness.id">
          <strong>{{ harness.label }}</strong>
          <span>{{ harness.path }}</span>
        </li>
      </ul>
    </div>

    <div class="lab-panel__section">
      <h4>Docs and ADRs</h4>
      <ul class="lab-panel__list">
        <li v-for="artifact in props.usage.relatedDocs" :key="artifact.file">
          <strong>{{ artifact.type }}</strong>
          <span>{{ artifact.file }}</span>
        </li>
      </ul>
    </div>

    <div class="lab-panel__section">
      <h4>Known file usages</h4>
      <ul class="lab-panel__list">
        <li v-for="usageRef in props.usage.knownUsages" :key="usageRef.file">
          <strong>{{ usageRef.area }}</strong>
          <span>{{ usageRef.file }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>
