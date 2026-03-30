<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';

import {
  PrimitivePortal,
  applyTransitionMotionVariables,
  clearTransitionMotionVariables,
  createTransitionGroupMotionStyle,
  resolveTransitionMotionPreset,
  useOverlaySurface,
} from '@ww/primitives';

defineOptions({ name: 'UiToast' });

type UiToastType = 'info' | 'success' | 'warning' | 'error';
type UiToastPosition =
  | 'top-start'
  | 'top-center'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-center'
  | 'bottom-end';

interface UiToastAction {
  label: string;
  onClick?: () => void;
}

interface UiToastPayload {
  id?: string;
  title: string;
  description?: string;
  type?: UiToastType;
  duration?: number;
  closable?: boolean;
  action?: UiToastAction;
}

interface ToastRecord {
  id: string;
  title: string;
  description?: string;
  type: UiToastType;
  duration: number;
  closable: boolean;
  action?: UiToastAction;
  remainingMs: number;
  startedAt: number | null;
  timerId: number | null;
}

const props = withDefaults(
  defineProps<{
    position?: UiToastPosition;
    duration?: number;
    closable?: boolean;
    maxStack?: number;
    pauseOnHover?: boolean;
    portalTarget?: string | HTMLElement | null;
  }>(),
  {
    closable: true,
    duration: 4000,
    maxStack: 4,
    pauseOnHover: true,
    position: 'top-end',
  }
);

const emit = defineEmits<{
  dismiss: [id: string];
}>();

const hostRef = ref<HTMLElement | null>(null);
const viewportRef = ref<HTMLElement | null>(null);
const toasts = ref<ToastRecord[]>([]);
const transitionPreset = resolveTransitionMotionPreset('fade-up-xs', 'fade-in');

let nextToastId = 0;

const overlaySurface = useOverlaySurface({
  open: computed(() => toasts.value.length > 0),
  kind: 'toast',
  contentRef: viewportRef,
  sourceRef: hostRef,
  portalTarget: computed(() => props.portalTarget),
  dismissOnEscape: false,
  dismissOnFocusOutside: false,
  dismissOnPointerOutside: false,
  containFocus: false,
  lockScroll: false,
  autoFocus: false,
  onDismiss: () => undefined,
});
const toastPortalTarget = overlaySurface.portalTarget;
const toastContentStyle = overlaySurface.contentStyle;

const createToastId = () => {
  nextToastId += 1;
  return `toast-${nextToastId}`;
};

const clearToastTimer = (toast: ToastRecord) => {
  if (toast.timerId !== null) {
    window.clearTimeout(toast.timerId);
    toast.timerId = null;
  }
};

const dismiss = (id: string) => {
  const toast = toasts.value.find((entry) => entry.id === id);
  if (!toast) {
    return;
  }

  clearToastTimer(toast);
  toasts.value = toasts.value.filter((entry) => entry.id !== id);
  emit('dismiss', id);
};

const scheduleToastTimer = (toast: ToastRecord) => {
  clearToastTimer(toast);

  if (toast.duration <= 0 || toast.remainingMs <= 0) {
    return;
  }

  toast.startedAt = Date.now();
  toast.timerId = window.setTimeout(() => {
    toast.timerId = null;
    dismiss(toast.id);
  }, toast.remainingMs);
};

const trimStack = () => {
  if (props.maxStack <= 0) {
    for (const toast of toasts.value) {
      clearToastTimer(toast);
    }
    toasts.value = [];
    return;
  }

  if (toasts.value.length <= props.maxStack) {
    return;
  }

  const removedToasts = toasts.value.slice(0, toasts.value.length - props.maxStack);
  for (const toast of removedToasts) {
    clearToastTimer(toast);
  }

  toasts.value = toasts.value.slice(-props.maxStack);
};

const push = (payload: UiToastPayload) => {
  const toast: ToastRecord = {
    id: payload.id ?? createToastId(),
    title: payload.title,
    type: payload.type ?? 'info',
    duration: Math.max(0, payload.duration ?? props.duration),
    closable: payload.closable ?? props.closable,
    remainingMs: Math.max(0, payload.duration ?? props.duration),
    startedAt: null,
    timerId: null,
    ...(payload.description ? { description: payload.description } : {}),
    ...(payload.action ? { action: payload.action } : {}),
  };

  toasts.value = [...toasts.value, toast];
  trimStack();

  void nextTick(() => {
    const currentToast = toasts.value.find((entry) => entry.id === toast.id);
    if (currentToast) {
      scheduleToastTimer(currentToast);
    }
  });

  return toast.id;
};

const clear = () => {
  for (const toast of toasts.value) {
    clearToastTimer(toast);
  }

  toasts.value = [];
};

const pauseToast = (toast: ToastRecord) => {
  if (!props.pauseOnHover || toast.duration <= 0 || toast.startedAt === null) {
    return;
  }

  const elapsed = Math.max(0, Date.now() - toast.startedAt);
  toast.remainingMs = Math.max(0, toast.remainingMs - elapsed);
  toast.startedAt = null;
  clearToastTimer(toast);
};

const resumeToast = (toast: ToastRecord) => {
  if (!props.pauseOnHover || toast.duration <= 0) {
    return;
  }

  if (toast.remainingMs <= 0) {
    dismiss(toast.id);
    return;
  }

  scheduleToastTimer(toast);
};

const runAction = (toast: ToastRecord) => {
  toast.action?.onClick?.();
  dismiss(toast.id);
};

watch(
  () => props.maxStack,
  () => {
    trimStack();
  }
);

const onBeforeEnter = (element: Element) => {
  if (element instanceof HTMLElement) {
    applyTransitionMotionVariables(element, transitionPreset, 'enter');
  }
};

const onAfterEnter = (element: Element) => {
  if (element instanceof HTMLElement) {
    clearTransitionMotionVariables(element);
  }
};

const onBeforeLeave = (element: Element) => {
  if (element instanceof HTMLElement) {
    applyTransitionMotionVariables(element, transitionPreset, 'leave');
  }
};

const onAfterLeave = (element: Element) => {
  if (element instanceof HTMLElement) {
    clearTransitionMotionVariables(element);
  }
};

defineExpose<{
  clear: () => void;
  dismiss: (id: string) => void;
  push: (payload: UiToastPayload) => string;
}>({
  clear,
  dismiss,
  push,
});
</script>

<template>
  <span ref="hostRef" hidden data-ui-overlay-anchor="toast" />

  <PrimitivePortal :to="toastPortalTarget">
    <div
      v-if="toasts.length > 0"
      ref="viewportRef"
      class="ui-toast-viewport"
      :class="`ui-toast-viewport--${props.position}`"
      :style="toastContentStyle"
      aria-live="off"
      aria-atomic="false"
    >
      <TransitionGroup
        tag="ol"
        class="ui-toast-stack"
        name="ui-motion"
        :style="createTransitionGroupMotionStyle(transitionPreset)"
        @before-enter="onBeforeEnter"
        @after-enter="onAfterEnter"
        @before-leave="onBeforeLeave"
        @after-leave="onAfterLeave"
      >
        <li
          v-for="toast in toasts"
          :key="toast.id"
          class="ui-toast"
          :class="`ui-toast--${toast.type}`"
          :role="toast.type === 'error' || toast.type === 'warning' ? 'alert' : 'status'"
          :aria-live="toast.type === 'error' || toast.type === 'warning' ? 'assertive' : 'polite'"
          aria-atomic="true"
          @pointerenter="pauseToast(toast)"
          @pointerleave="resumeToast(toast)"
        >
          <div class="ui-toast__body">
            <div class="ui-toast__header">
              <div class="ui-toast__title-group">
                <span class="ui-toast__title">{{ toast.title }}</span>
                <span class="ui-toast__type" aria-hidden="true">{{ toast.type }}</span>
              </div>
              <button
                v-if="toast.closable"
                type="button"
                class="ui-toast__close"
                data-ui-motion="ring-focus-soft"
                aria-label="Dismiss toast"
                @click="dismiss(toast.id)"
              >
                ×
              </button>
            </div>
            <p v-if="toast.description" class="ui-toast__description">
              {{ toast.description }}
            </p>
            <div v-if="toast.action" class="ui-toast__actions">
              <button
                type="button"
                class="ui-toast__action"
                data-ui-motion="ring-focus-soft"
                @click="runAction(toast)"
              >
                {{ toast.action.label }}
              </button>
            </div>
          </div>
        </li>
      </TransitionGroup>
    </div>
  </PrimitivePortal>
</template>
