import { ref } from 'vue';
import { describe, expect, it } from 'vitest';

import { useMotionPresence } from './presence';

describe('motion presence', () => {
  it('stays active through multiple leave phases until all transitions finish', () => {
    const open = ref(true);
    const presence = useMotionPresence(() => open.value);

    open.value = false;
    presence.handleBeforeLeave();
    presence.handleBeforeLeave();

    expect(presence.isActive.value).toBe(true);
    expect(presence.isLeaving.value).toBe(true);

    presence.handleAfterLeave();
    expect(presence.isActive.value).toBe(true);

    presence.handleAfterLeave();
    expect(presence.isActive.value).toBe(false);
    expect(presence.isLeaving.value).toBe(false);
  });

  it('resets leave state on enter handlers', () => {
    const open = ref(false);
    const presence = useMotionPresence(() => open.value);

    presence.handleBeforeLeave();
    expect(presence.isLeaving.value).toBe(true);

    presence.handleBeforeEnter();
    expect(presence.isLeaving.value).toBe(false);
    expect(presence.isActive.value).toBe(false);

    open.value = true;
    presence.handleAfterEnter();
    expect(presence.isLeaving.value).toBe(false);
    expect(presence.isActive.value).toBe(true);
  });

  it('can force-complete a leave cycle when a transition finalizer never arrives', () => {
    const open = ref(false);
    const presence = useMotionPresence(() => open.value);

    presence.handleBeforeLeave();
    expect(presence.isLeaving.value).toBe(true);

    presence.forceCompleteLeave();
    expect(presence.isLeaving.value).toBe(false);
    expect(presence.isActive.value).toBe(false);
  });
});
