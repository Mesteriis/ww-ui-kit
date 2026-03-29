<script setup lang="ts">
import { computed } from 'vue';

import { PrimitivePortal } from '@ww/primitives';

import { useOverlay } from './useOverlay';

defineOptions({ name: 'UiDrawer' });

const props = withDefaults(
  defineProps<{
    open: boolean;
    side?: 'left' | 'right';
    title?: string;
    description?: string;
    ariaLabel?: string;
    closeOnOverlayClick?: boolean;
    portalTarget?: string | HTMLElement | null;
  }>(),
  {
    side: 'right',
    closeOnOverlayClick: true
  }
);

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const close = () => emit('update:open', false);
const surfacePreset = computed(() => (props.side === 'left' ? 'drawer-slide-right' : 'drawer-slide-left'));
const {
  anchorRef,
  backdropStyle,
  contentStyle,
  describedBy,
  handleBackdropAfterEnter,
  handleBackdropAfterLeave,
  handleBackdropBeforeEnter,
  handleBackdropBeforeLeave,
  handleSurfaceAfterEnter,
  handleSurfaceAfterLeave,
  handleSurfaceBeforeEnter,
  handleSurfaceBeforeLeave,
  isActive,
  labelledBy,
  panelRef,
  portalTarget,
  titleId,
  descriptionId
} = useOverlay(props, close, {
  prefix: 'drawer',
  surfacePreset: () => surfacePreset.value,
  backdropPreset: 'backdrop-soften'
});
</script>

<template>
  <span ref="anchorRef" hidden data-ui-overlay-anchor="drawer" />
  <PrimitivePortal :to="portalTarget">
    <div v-if="isActive" class="ui-overlay ui-overlay--drawer" :data-ui-state="props.open ? 'open' : 'closed'">
      <Transition
        appear
        name="ui-motion"
        @before-enter="handleBackdropBeforeEnter"
        @after-enter="handleBackdropAfterEnter"
        @before-leave="handleBackdropBeforeLeave"
        @after-leave="handleBackdropAfterLeave"
      >
        <div v-if="props.open" class="ui-overlay__backdrop" :style="backdropStyle" />
      </Transition>

      <Transition
        appear
        name="ui-motion"
        @before-enter="handleSurfaceBeforeEnter"
        @after-enter="handleSurfaceAfterEnter"
        @before-leave="handleSurfaceBeforeLeave"
        @after-leave="handleSurfaceAfterLeave"
      >
        <section
          v-if="props.open"
          ref="panelRef"
          class="ui-overlay__surface ui-drawer"
          :class="`ui-drawer--${props.side}`"
          :style="contentStyle"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="labelledBy"
          :aria-describedby="describedBy"
          :aria-label="!labelledBy ? props.ariaLabel : undefined"
          tabindex="-1"
        >
          <div class="ui-overlay__header">
            <div class="ui-overlay__title-group">
              <slot v-if="$slots.header" name="header" :title-id="titleId" />
              <template v-else>
                <slot v-if="$slots.title" name="title" :title-id="titleId" />
                <h2 v-else-if="props.title" :id="titleId" class="ui-overlay__title">
                  {{ props.title }}
                </h2>
              </template>
            </div>
            <button
              type="button"
              class="ui-overlay__close"
              data-ui-motion="ring-focus-soft"
              aria-label="Close drawer"
              @click="close"
            >
              ×
            </button>
          </div>

          <p v-if="props.description" :id="descriptionId" class="ui-overlay__description">
            {{ props.description }}
          </p>

          <div class="ui-overlay__body">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="ui-overlay__footer">
            <slot name="footer" />
          </footer>
        </section>
      </Transition>
    </div>
  </PrimitivePortal>
</template>
