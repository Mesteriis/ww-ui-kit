import { shallowRef } from 'vue';

export function createSignalNodeReactions() {
  const reactingNodeIds = shallowRef(new Set<string>());
  const reactionTimers = new Map<string, ReturnType<typeof setTimeout>>();

  const clearNodeReaction = (nodeId: string) => {
    const nextSet = new Set(reactingNodeIds.value);
    nextSet.delete(nodeId);
    reactingNodeIds.value = nextSet;
  };

  const triggerNodeReaction = (nodeId: string, durationMs: number) => {
    if (typeof window === 'undefined') {
      return;
    }

    const existingTimer = reactionTimers.get(nodeId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const nextSet = new Set(reactingNodeIds.value);
    nextSet.add(nodeId);
    reactingNodeIds.value = nextSet;

    reactionTimers.set(
      nodeId,
      setTimeout(() => {
        reactionTimers.delete(nodeId);
        clearNodeReaction(nodeId);
      }, durationMs)
    );
  };

  const clearNodeReactions = () => {
    if (typeof window !== 'undefined') {
      for (const timerId of reactionTimers.values()) {
        clearTimeout(timerId);
      }
    }

    reactionTimers.clear();
    reactingNodeIds.value = new Set<string>();
  };

  return {
    clearNodeReactions,
    reactingNodeIds,
    triggerNodeReaction,
  };
}
