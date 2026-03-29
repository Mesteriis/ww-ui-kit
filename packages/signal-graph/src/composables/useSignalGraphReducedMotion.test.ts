import { computed, defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useSignalGraphReducedMotion } from './useSignalGraphReducedMotion';

function createMediaQuery(matches: boolean, withEventTarget: boolean) {
  let currentMatches = matches;
  const listeners = new Set<() => void>();
  return {
    get matches() {
      return currentMatches;
    },
    media: '(prefers-reduced-motion: reduce)',
    dispatch(nextMatches: boolean) {
      currentMatches = nextMatches;
      for (const listener of listeners) {
        listener();
      }
    },
    addEventListener: withEventTarget
      ? vi.fn((_type: string, listener: () => void) => listeners.add(listener))
      : undefined,
    removeEventListener: withEventTarget
      ? vi.fn((_type: string, listener: () => void) => listeners.delete(listener))
      : undefined,
    addListener: withEventTarget
      ? undefined
      : vi.fn((listener: () => void) => listeners.add(listener)),
    removeListener: withEventTarget
      ? undefined
      : vi.fn((listener: () => void) => listeners.delete(listener)),
  };
}

describe('useSignalGraphReducedMotion', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('tracks system, full, and reduced modes with addEventListener media queries', async () => {
    const mediaQuery = createMediaQuery(true, true);
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => mediaQuery)
    );

    const Harness = defineComponent({
      props: {
        motionMode: {
          type: String,
          default: undefined,
        },
      },
      setup(props, { expose }) {
        const state = useSignalGraphReducedMotion(
          computed(() => props.motionMode as 'system' | 'full' | 'reduced' | undefined)
        );
        expose(state);
        return () => null;
      },
    });

    const wrapper = mount(Harness);
    const state = wrapper.vm as typeof wrapper.vm & { reducedMotion: boolean };

    expect(state.reducedMotion).toBe(true);

    await wrapper.setProps({ motionMode: 'full' });
    expect(state.reducedMotion).toBe(false);
    mediaQuery.dispatch(true);
    expect(state.reducedMotion).toBe(false);

    await wrapper.setProps({ motionMode: 'reduced' });
    expect(state.reducedMotion).toBe(true);

    await wrapper.setProps({ motionMode: 'system' });
    mediaQuery.dispatch(false);
    expect(state.reducedMotion).toBe(false);

    wrapper.unmount();
    expect(mediaQuery.removeEventListener).toHaveBeenCalled();
  });

  it('supports addListener fallback and missing matchMedia gracefully', () => {
    const legacyMediaQuery = createMediaQuery(false, false);
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => legacyMediaQuery)
    );

    const LegacyHarness = defineComponent({
      setup(_, { expose }) {
        const state = useSignalGraphReducedMotion(computed(() => undefined));
        expose(state);
        return () => null;
      },
    });

    const legacyWrapper = mount(LegacyHarness);
    expect(
      (legacyWrapper.vm as typeof legacyWrapper.vm & { reducedMotion: boolean }).reducedMotion
    ).toBe(false);
    legacyWrapper.unmount();
    expect(legacyMediaQuery.addListener).toHaveBeenCalled();
    expect(legacyMediaQuery.removeListener).toHaveBeenCalled();

    vi.stubGlobal('matchMedia', undefined);

    const MissingHarness = defineComponent({
      setup(_, { expose }) {
        const state = useSignalGraphReducedMotion(computed(() => 'system'));
        expose(state);
        return () => null;
      },
    });

    const missingWrapper = mount(MissingHarness);
    expect(
      (missingWrapper.vm as typeof missingWrapper.vm & { reducedMotion: boolean }).reducedMotion
    ).toBe(false);
  });
});
