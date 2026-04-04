import type { ThemeResponsiveBreakpoint } from '@ww/themes';

export type UiLayoutGapToken = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16';

export type UiFlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export type UiFlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
export type UiLayoutAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type UiLayoutJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type UiGridItemPlacement = 'start' | 'center' | 'end' | 'stretch';
export type UiSpaceDirection = 'horizontal' | 'vertical';
export type UiScrollAreaOrientation = 'vertical' | 'horizontal' | 'both';
export type UiScrollAreaVisibility = 'auto' | 'always' | 'hover';
export type UiScrollTopPosition = 'bottom-end' | 'bottom-start' | 'top-end' | 'top-start';

export interface UiGridItem {
  [key: string]: unknown;
  key?: number | string;
  span?: number;
  responsive?: Partial<Record<ThemeResponsiveBreakpoint, number>>;
  align?: UiGridItemPlacement;
  justify?: UiGridItemPlacement;
}
