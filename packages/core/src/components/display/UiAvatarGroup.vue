<script setup lang="ts">
import { computed } from 'vue';

import UiAvatar, { type UiAvatarShape, type UiAvatarSize, type UiAvatarTone } from './UiAvatar.vue';

defineOptions({ name: 'UiAvatarGroup' });

export interface UiAvatarGroupItem {
  src?: string;
  alt?: string;
  initials?: string;
  icon?: string;
  tone?: UiAvatarTone;
  shape?: UiAvatarShape;
}

const props = withDefaults(
  defineProps<{
    items: UiAvatarGroupItem[];
    size?: UiAvatarSize;
    max?: number;
    overlap?: boolean;
  }>(),
  {
    overlap: true,
    size: 'md',
  }
);

const normalizedMax = computed(() =>
  props.max === undefined ? props.items.length : Math.max(0, Math.floor(props.max))
);
const visibleItems = computed(() => props.items.slice(0, normalizedMax.value));
const surplusCount = computed(() => Math.max(0, props.items.length - visibleItems.value.length));
</script>

<template>
  <div
    class="ui-avatar-group"
    :class="{ 'ui-avatar-group--overlap': props.overlap }"
    role="group"
    aria-label="Avatar group"
  >
    <UiAvatar
      v-for="(item, index) in visibleItems"
      :key="item.alt ?? item.initials ?? `avatar-${index}`"
      :src="item.src"
      :alt="item.alt"
      :initials="item.initials"
      :icon="item.icon"
      :size="props.size"
      :shape="item.shape"
      :tone="item.tone"
    />
    <UiAvatar
      v-if="surplusCount > 0"
      :size="props.size"
      :icon="`+${surplusCount}`"
      tone="neutral"
      :alt="`${surplusCount} more avatars`"
    />
  </div>
</template>
