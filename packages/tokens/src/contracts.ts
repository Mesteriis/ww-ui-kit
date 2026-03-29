export const CSS_VARIABLE_PREFIX = '--ui' as const;

export const toCssVariableName = <TName extends string>(tokenName: TName) =>
  `${CSS_VARIABLE_PREFIX}-${tokenName}` as const;

export const createCssVariableMap = <const TNames extends readonly string[]>(tokenNames: TNames) =>
  Object.freeze(
    Object.fromEntries(tokenNames.map((tokenName) => [tokenName, toCssVariableName(tokenName)]))
  ) as { readonly [K in TNames[number]]: `--ui-${K}` };

export type TokenScale = Readonly<Record<string, string>>;
export type BaseTokenGroup = Readonly<Record<string, TokenScale>>;

export type FlattenTokenNames<TGroup extends BaseTokenGroup> = {
  [K in keyof TGroup]: keyof TGroup[K];
}[keyof TGroup];

export type ThemeTokenMap<TName extends string> = Readonly<Record<TName, string>>;
