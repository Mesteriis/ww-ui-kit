import { afterEach, describe, expect, it, vi } from 'vitest';

async function importEnsureTsParticlesEngine() {
  const module = await import('./useTsParticlesEngine');
  return module.ensureTsParticlesEngine;
}

describe('ensureTsParticlesEngine', () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock('@tsparticles/engine');
    vi.doUnmock('@tsparticles/slim');
  });

  it('loads the slim vendor bundle once and caches the engine', async () => {
    const mockEngine = {
      load: vi.fn(),
    };
    const loadSlim = vi.fn(async () => undefined);

    vi.doMock('@tsparticles/engine', () => ({
      tsParticles: mockEngine,
    }));
    vi.doMock('@tsparticles/slim', () => ({
      loadSlim,
    }));

    const ensureTsParticlesEngine = await importEnsureTsParticlesEngine();
    const first = await ensureTsParticlesEngine();
    const second = await ensureTsParticlesEngine();

    expect(first).toBe(mockEngine);
    expect(second).toBe(mockEngine);
    expect(loadSlim).toHaveBeenCalledTimes(1);
    expect(loadSlim).toHaveBeenCalledWith(mockEngine);
  });

  it('normalizes non-Error vendor failures and retries the loader on the next call', async () => {
    const mockEngine = {
      load: vi.fn(),
    };
    const loadSlim = vi
      .fn()
      .mockRejectedValueOnce('broken vendor')
      .mockResolvedValueOnce(undefined);

    vi.doMock('@tsparticles/engine', () => ({
      tsParticles: mockEngine,
    }));
    vi.doMock('@tsparticles/slim', () => ({
      loadSlim,
    }));

    const ensureTsParticlesEngine = await importEnsureTsParticlesEngine();

    await expect(ensureTsParticlesEngine()).rejects.toThrow('Failed to load tsParticles.');

    const resolved = await ensureTsParticlesEngine();
    expect(resolved).toBe(mockEngine);
    expect(loadSlim).toHaveBeenCalledTimes(2);
  });

  it('rethrows Error instances without replacing their message', async () => {
    const mockEngine = {
      load: vi.fn(),
    };
    const vendorError = new Error('tsParticles bundle failed');
    const loadSlim = vi.fn().mockRejectedValueOnce(vendorError).mockResolvedValueOnce(undefined);

    vi.doMock('@tsparticles/engine', () => ({
      tsParticles: mockEngine,
    }));
    vi.doMock('@tsparticles/slim', () => ({
      loadSlim,
    }));

    const ensureTsParticlesEngine = await importEnsureTsParticlesEngine();

    await expect(ensureTsParticlesEngine()).rejects.toBe(vendorError);

    const resolved = await ensureTsParticlesEngine();
    expect(resolved).toBe(mockEngine);
    expect(loadSlim).toHaveBeenCalledTimes(2);
  });
});
