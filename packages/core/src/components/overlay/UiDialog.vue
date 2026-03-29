<script setup lang="ts">
import { PrimitivePortal } from '@ww/primitives';

import { useOverlay } from './useOverlay';

defineOptions({ name: 'UiDialog' });

const props = withDefaults(
  defineProps<{
    open: boolean;
    title?: string;
    description?: string;
    ariaLabel?: string;
    closeOnOverlayClick?: boolean;
    portalTarget?: string | HTMLElement | null;
  }>(),
  {
    closeOnOverlayClick: true
  }
);

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const close = () => emit('update:open', false);
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
  prefix: 'dialog',
  surfacePreset: 'modal-fade-scale',
  backdropPreset: 'backdrop-soften'
});
</script>

<template>
  <span ref="anchorRef" hidden data-ui-overlay-anchor="dialog" />
  <PrimitivePortal :to="portalTarget">
    <div v-if="isActive" class="ui-overlay ui-overlay--dialog" :data-ui-state="props.open ? 'open' : 'closed'">
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
          class="ui-overlay__surface ui-dialog"
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
              aria-label="Close dialog"
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
