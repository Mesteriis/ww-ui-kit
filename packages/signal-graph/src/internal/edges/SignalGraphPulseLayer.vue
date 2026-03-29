<script setup lang="ts">
import { computed } from 'vue';

import type { RuntimeSignalEntry } from '../context';

defineOptions({ name: 'SignalGraphPulseLayer' });

const props = defineProps<{
  path: string;
  signal: RuntimeSignalEntry;
  reducedMotion: boolean;
}>();

const pulseStyle = computed(() => ({
  '--ui-signal-delay': `${props.signal.delayMs}ms`,
  '--ui-signal-duration': `${props.signal.durationMs}ms`,
}));
</script>

<template>
  <path
    class="ui-signal-graph__pulse"
    :class="[
      `ui-signal-graph__pulse--${signal.variant}`,
      `ui-signal-graph__pulse--${signal.intensity}`,
      { 'ui-signal-graph__pulse--reduced': reducedMotion },
    ]"
    :style="pulseStyle"
    :d="path"
    fill="none"
  />
</template>
