import { colorPalette } from './colors';
import { motionTokens } from './motion';
import { radiusScale } from './radius';
import { shadowScale } from './shadow';
import { spacingScale } from './spacing';
import { typographyScale } from './typography';
import { zIndexTokens } from './z-index';

import { createCssVariableMap } from '../contracts';

export const baseTokenGroups = {
  ...colorPalette,
  ...spacingScale,
  ...radiusScale,
  ...shadowScale,
  ...typographyScale,
  ...motionTokens,
  ...zIndexTokens
} as const;

const flattenedBaseTokens = Object.values(baseTokenGroups).reduce<Record<string, string>>(
  (accumulator, tokenGroup) => Object.assign(accumulator, tokenGroup),
  {}
);

export const baseTokenValues = Object.freeze(flattenedBaseTokens);
export const baseTokenNames = Object.freeze(Object.keys(baseTokenValues));
export const baseTokenVars = createCssVariableMap(baseTokenNames);

export type BaseTokenName = (typeof baseTokenNames)[number];

export {
  colorPalette,
  motionTokens,
  radiusScale,
  shadowScale,
  spacingScale,
  typographyScale,
  zIndexTokens
};
