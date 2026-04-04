<script setup lang="ts">
import type { ComponentLabCatalogEntry } from '../manifest/component-lab.types';

defineOptions({ name: 'LabNavigation' });

const props = defineProps<{
  families: readonly {
    family: string;
    entries: readonly ComponentLabCatalogEntry[];
  }[];
  selectedId: string;
}>();

const emit = defineEmits<{
  select: [surfaceId: string];
}>();
</script>

<template>
  <nav class="lab-navigation" aria-label="Component lab surfaces">
    <section v-for="group in props.families" :key="group.family" class="lab-navigation__group">
      <h2 class="lab-navigation__title">{{ group.family }}</h2>
      <div class="lab-navigation__items">
        <button
          v-for="entry in group.entries"
          :key="entry.id"
          type="button"
          class="lab-navigation__item"
          :data-lab-nav-item="entry.id"
          :class="{ 'is-active': entry.id === props.selectedId }"
          :aria-current="entry.id === props.selectedId ? 'page' : undefined"
          @click="emit('select', entry.id)"
        >
          <strong>{{ entry.title }}</strong>
          <span>{{ entry.packageName }}</span>
        </button>
      </div>
    </section>
  </nav>
</template>
