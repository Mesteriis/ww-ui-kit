<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

defineOptions({ name: 'PrimitivePortal' });

const props = withDefaults(
  defineProps<{
    to?: string | HTMLElement | null;
    disabled?: boolean;
  }>(),
  {
    to: 'body',
    disabled: false,
  }
);

const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});

const canTeleport = computed(() => isMounted.value && !props.disabled && Boolean(props.to));
</script>

<template>
  <Teleport v-if="canTeleport" :to="props.to">
    <slot />
  </Teleport>
  <slot v-else />
</template>
