<script setup lang="ts">
import { ref } from 'vue';

import UiImage from './UiImage.vue';
import UiImagePreview, { type UiImagePreviewItem } from './UiImagePreview.vue';

defineOptions({ name: 'UiImagePreviewGroup' });

const props = withDefaults(
  defineProps<{
    items: UiImagePreviewItem[];
    columns?: number;
  }>(),
  {
    columns: 3,
  }
);

const open = ref(false);
const activeIndex = ref(0);

const openPreview = (index: number) => {
  activeIndex.value = index;
  open.value = true;
};
</script>

<template>
  <div class="ui-image-preview-group">
    <slot :items="props.items" :open-preview="openPreview">
      <div
        class="ui-image-preview-group__grid"
        :style="{ '--ui-image-preview-columns': String(Math.max(props.columns, 1)) }"
      >
        <button
          v-for="(item, index) in props.items"
          :key="`${item.src}-${index}`"
          type="button"
          class="ui-image-preview-group__thumb"
          :aria-label="`Preview image ${index + 1}`"
          @click="openPreview(index)"
        >
          <UiImage :src="item.src" :alt="item.alt" rounded bordered />
        </button>
      </div>
    </slot>

    <UiImagePreview v-model:open="open" v-model="activeIndex" :items="props.items" />
  </div>
</template>
