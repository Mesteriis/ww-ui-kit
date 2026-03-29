<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

defineOptions({ name: 'PrimitiveFocusTrap' });

const props = withDefaults(
  defineProps<{
    active?: boolean;
  }>(),
  {
    active: true
  }
);

const containerRef = ref<HTMLElement | null>(null);

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ');

const getFocusableElements = () =>
  containerRef.value
    ? Array.from(containerRef.value.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (element) => !element.hasAttribute('disabled') && element.tabIndex !== -1
      )
    : [];

watch(
  () => props.active,
  (isActive, _, onCleanup) => {
    if (!isActive || typeof document === 'undefined') {
      return;
    }

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusFirst = async () => {
      await nextTick();
      const [firstElement] = getFocusableElements();
      (firstElement ?? containerRef.value)?.focus();
    };

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') {
        return;
      }

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) {
        event.preventDefault();
        containerRef.value?.focus();
        return;
      }

      const [firstElement] = focusableElements;
      const lastElement = focusableElements.at(-1);
      const activeElement = document.activeElement;

      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    };

    const onFocusIn = (event: FocusEvent) => {
      const container = containerRef.value;
      if (!container || !(event.target instanceof Node) || container.contains(event.target)) {
        return;
      }

      void focusFirst();
    };

    document.addEventListener('keydown', onKeydown);
    document.addEventListener('focusin', onFocusIn);
    void focusFirst();

    onCleanup(() => {
      document.removeEventListener('keydown', onKeydown);
      document.removeEventListener('focusin', onFocusIn);
      previouslyFocused?.focus();
    });
  },
  { immediate: true }
);
</script>

<template>
  <div ref="containerRef" tabindex="-1">
    <slot />
  </div>
</template>
