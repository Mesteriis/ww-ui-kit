<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue';

import UiIcon from './UiIcon.vue';

defineOptions({ name: 'UiAvatar' });

export type UiAvatarShape = 'circle' | 'square';
export type UiAvatarSize = 'sm' | 'md' | 'lg' | number;
export type UiAvatarTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

const props = withDefaults(
  defineProps<{
    src?: string | undefined;
    alt?: string | undefined;
    initials?: string | undefined;
    icon?: string | undefined;
    size?: UiAvatarSize | undefined;
    shape?: UiAvatarShape | undefined;
    tone?: UiAvatarTone | undefined;
  }>(),
  {
    shape: 'circle',
    size: 'md',
    tone: 'neutral',
  }
);

const emit = defineEmits<{
  error: [event: Event];
}>();

const slots = useSlots();
const imageFailed = ref(false);

const normalizedInitials = computed(() => props.initials?.trim().slice(0, 2).toUpperCase() ?? '');
const showImage = computed(() => Boolean(props.src) && !imageFailed.value);
const showInitials = computed(() => !showImage.value && normalizedInitials.value.length > 0);
const showIcon = computed(
  () => !showImage.value && !showInitials.value && (Boolean(props.icon) || Boolean(slots.icon))
);
const accessibleFallbackLabel = computed(() =>
  !showImage.value ? (props.alt ?? (normalizedInitials.value || undefined)) : undefined
);
const customSizeStyle = computed<Record<string, string> | undefined>(() =>
  typeof props.size === 'number' ? { '--ui-avatar-size': `${props.size}px` } : undefined
);

watch(
  () => props.src,
  () => {
    imageFailed.value = false;
  }
);

const onImageError = (event: Event) => {
  imageFailed.value = true;
  emit('error', event);
};
</script>

<template>
  <span
    class="ui-avatar"
    :class="[
      `ui-avatar--${typeof props.size === 'number' ? 'custom' : props.size}`,
      `ui-avatar--${props.shape}`,
      `ui-avatar--${props.tone}`,
    ]"
    :style="customSizeStyle"
    :role="accessibleFallbackLabel ? 'img' : undefined"
    :aria-label="accessibleFallbackLabel"
  >
    <img
      v-if="showImage"
      class="ui-avatar__image"
      :src="props.src"
      :alt="props.alt ?? ''"
      @error="onImageError"
    />
    <span v-else-if="showInitials" class="ui-avatar__initials" aria-hidden="true">
      {{ normalizedInitials }}
    </span>
    <UiIcon v-else-if="showIcon" class="ui-avatar__icon" decorative>
      <slot name="icon">
        {{ props.icon }}
      </slot>
    </UiIcon>
    <span v-else class="ui-avatar__default" aria-hidden="true">◌</span>
  </span>
</template>
