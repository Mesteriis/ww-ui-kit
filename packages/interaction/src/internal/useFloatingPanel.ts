import { computed, onBeforeUnmount, watch, type CSSProperties, type Ref } from 'vue';

export function useFloatingPanel(options: {
  open: Ref<boolean>;
  triggerRef: Ref<HTMLElement | null>;
  panelRef: Ref<HTMLElement | null>;
  close: () => void;
}) {
  const panelStyle = computed<CSSProperties>(() => {
    const rect = options.triggerRef.value?.getBoundingClientRect();
    if (!rect) {
      return {
        position: 'fixed',
        top: '0px',
        left: '0px',
      };
    }

    return {
      position: 'fixed',
      top: `${rect.bottom + 8}px`,
      left: `${rect.left}px`,
      minWidth: `${rect.width}px`,
      zIndex: 'var(--ui-z-layer-overlay)',
    };
  });

  const onPointerDown = (event: PointerEvent) => {
    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (
      options.panelRef.value?.contains(target) ||
      options.triggerRef.value?.contains(target)
    ) {
      return;
    }

    options.close();
  };

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      options.close();
    }
  };

  watch(options.open, (isOpen) => {
    if (isOpen) {
      window.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('keydown', onKeydown);
      return;
    }

    window.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('keydown', onKeydown);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('keydown', onKeydown);
  });

  return {
    panelStyle,
  };
}
