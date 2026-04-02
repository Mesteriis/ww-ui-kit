import type { ISourceOptions } from '@tsparticles/engine';

export type UiTsParticlesBackdropColorVar = `--ui-${string}`;
export type UiTsParticlesBackdropSize = 'auto' | 'fill';
export type UiTsParticlesBackdropOptions = ISourceOptions;

export interface UiTsParticlesBackdropProps {
  options?: UiTsParticlesBackdropOptions;
  size?: UiTsParticlesBackdropSize;
  disabled?: boolean;
  particleColorVar?: UiTsParticlesBackdropColorVar;
  linkColorVar?: UiTsParticlesBackdropColorVar;
}
