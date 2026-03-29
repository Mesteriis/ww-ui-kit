import { computed, getCurrentInstance, useId as useVueId } from 'vue';

function createFallbackId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `fallback-${crypto.randomUUID()}`;
  }

  return `fallback-${Math.random().toString(36).slice(2, 10)}`;
}

export function useId(prefix = 'ui') {
  const id = getCurrentInstance() ? useVueId() : createFallbackId();

  return computed(() => (prefix ? `${prefix}-${id}` : id));
}
