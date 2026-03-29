<script setup lang="ts">
import type { SignalGraphDepthState } from '../../types';

defineOptions({ name: 'SignalGraphNodeShell' });

defineProps<{
  label?: string | undefined;
  glass?: boolean | undefined;
  depthState: SignalGraphDepthState;
  hasRecentSignal: boolean;
  isActive: boolean;
  isRelated: boolean;
}>();
</script>

<template>
  <article
    class="ui-signal-graph__node-shell nodrag nowheel"
    :class="{ 'ui-signal-graph__node-shell--glass': glass }"
    :data-ui-depth="depthState"
    :data-ui-active="isActive ? 'true' : undefined"
    :data-ui-related="isRelated ? 'true' : undefined"
    :data-ui-recent-signal="hasRecentSignal ? 'true' : undefined"
  >
    <header class="ui-signal-graph__node-shell-header">
      <span class="ui-signal-graph__node-shell-title">{{ label }}</span>
    </header>
    <div class="ui-signal-graph__node-shell-body">
      <slot />
    </div>
  </article>
</template>
