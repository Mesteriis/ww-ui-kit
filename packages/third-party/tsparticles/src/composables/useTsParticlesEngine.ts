import { tsParticles, type Engine } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

let cachedEnginePromise: Promise<Engine> | null = null;
let slimLoaded = false;

function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  return new Error('Failed to load tsParticles.');
}

export async function ensureTsParticlesEngine(): Promise<Engine> {
  if (slimLoaded) {
    return tsParticles;
  }

  if (!cachedEnginePromise) {
    cachedEnginePromise = loadSlim(tsParticles)
      .then(() => {
        slimLoaded = true;
        return tsParticles;
      })
      .catch((error) => {
        cachedEnginePromise = null;
        throw normalizeError(error);
      });
  }

  return cachedEnginePromise;
}
