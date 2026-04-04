<script setup lang="ts" generic="TItem">
import { computed, nextTick, onMounted, ref, watch } from 'vue';

defineOptions({ name: 'UiVirtualScroll' });

const props = withDefaults(
  defineProps<{
    items: TItem[];
    itemSize: number;
    height: number;
    overscan?: number;
    ariaLabel?: string;
    role?: string;
  }>(),
  {
    ariaLabel: 'Virtual scroll viewport',
    overscan: 4,
    role: 'region',
  }
);

const emit = defineEmits<{
  rangeChange: [payload: { end: number; start: number }];
}>();

const viewportRef = ref<HTMLElement | null>(null);
const scrollTop = ref(0);

const totalHeight = computed(() => props.items.length * props.itemSize);
const startIndex = computed(() =>
  Math.max(0, Math.floor(scrollTop.value / props.itemSize) - props.overscan)
);
const endIndex = computed(() =>
  Math.min(
    props.items.length,
    Math.ceil((scrollTop.value + props.height) / props.itemSize) + props.overscan
  )
);
const visibleItems = computed(() =>
  props.items.slice(startIndex.value, endIndex.value).map((item, offset) => ({
    item,
    index: startIndex.value + offset,
    style: {
      position: 'absolute',
      insetInline: '0',
      top: `${(startIndex.value + offset) * props.itemSize}px`,
      height: `${props.itemSize}px`,
    },
  }))
);

const onScroll = () => {
  scrollTop.value = viewportRef.value?.scrollTop ?? 0;
};

watch([startIndex, endIndex], () => {
  emit('rangeChange', {
    end: endIndex.value,
    start: startIndex.value,
  });
});

watch(
  () => props.items.length,
  async () => {
    await nextTick();
    emit('rangeChange', {
      end: endIndex.value,
      start: startIndex.value,
    });
  }
);

onMounted(() => {
  emit('rangeChange', {
    end: endIndex.value,
    start: startIndex.value,
  });
});

const scrollToIndex = (index: number) => {
  viewportRef.value?.scrollTo({
    top: Math.max(0, index) * props.itemSize,
    behavior: 'auto',
  });
};

defineExpose({
  scrollToIndex,
  viewportEl: viewportRef,
});
</script>

<template>
  <div
    ref="viewportRef"
    class="ui-virtual-scroll"
    :style="{ height: `${props.height}px` }"
    :role="props.role"
    :aria-label="props.ariaLabel"
    @scroll="onScroll"
  >
    <div class="ui-virtual-scroll__spacer" :style="{ height: `${totalHeight}px` }">
      <slot
        v-for="record in visibleItems"
        :key="record.index"
        name="default"
        :item="record.item"
        :index="record.index"
        :style="record.style"
      />
    </div>
  </div>
</template>
