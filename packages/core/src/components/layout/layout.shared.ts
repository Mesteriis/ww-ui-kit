import { Comment, Fragment, Text, isVNode, type VNode, type VNodeArrayChildren } from 'vue';

import { THEME_RESPONSIVE_BREAKPOINTS, type ThemeResponsiveBreakpoint } from '@ww/themes';

import type {
  UiFlexWrap,
  UiGridItem,
  UiGridItemPlacement,
  UiLayoutAlign,
  UiLayoutGapToken,
  UiLayoutJustify,
} from './layout.types';

const GAP_TOKEN_VALUES = new Set<UiLayoutGapToken>([
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '8',
  '10',
  '12',
  '16',
]);

const FLEX_ALIGN_MAP: Record<UiLayoutAlign, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
};

const GRID_ALIGN_MAP: Record<UiLayoutAlign, string> = {
  start: 'start',
  center: 'center',
  end: 'end',
  stretch: 'stretch',
  baseline: 'baseline',
};

const JUSTIFY_MAP: Record<UiLayoutJustify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

const GRID_ITEM_PLACEMENT_MAP: Record<UiGridItemPlacement, string> = {
  start: 'start',
  center: 'center',
  end: 'end',
  stretch: 'stretch',
};

const RESPONSIVE_BREAKPOINT_ORDER: readonly ThemeResponsiveBreakpoint[] = ['md', 'lg'];

function readRootFontSize() {
  if (typeof window === 'undefined') {
    return 16;
  }

  const parsed = Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 16;
}

function toPixels(length: string) {
  if (length.endsWith('rem')) {
    return Number.parseFloat(length) * readRootFontSize();
  }

  if (length.endsWith('px')) {
    return Number.parseFloat(length);
  }

  const parsed = Number.parseFloat(length);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function resolveGapToken(value: UiLayoutGapToken) {
  return GAP_TOKEN_VALUES.has(value) ? `var(--ui-space-${value})` : 'var(--ui-space-4)';
}

export function resolveFlexAlign(value: UiLayoutAlign) {
  return FLEX_ALIGN_MAP[value];
}

export function resolveGridAlign(value: UiLayoutAlign) {
  return GRID_ALIGN_MAP[value];
}

export function resolveJustify(value: UiLayoutJustify) {
  return JUSTIFY_MAP[value];
}

export function resolveWrap(value: boolean | UiFlexWrap | undefined): UiFlexWrap {
  if (typeof value === 'boolean') {
    return value ? 'wrap' : 'nowrap';
  }

  return value ?? 'nowrap';
}

export function resolveGridItemPlacement(value: UiGridItemPlacement | undefined) {
  return value ? GRID_ITEM_PLACEMENT_MAP[value] : undefined;
}

export function clampGridColumns(value: number | undefined) {
  if (!Number.isFinite(value)) {
    return 12;
  }

  return Math.min(12, Math.max(1, Math.round(value ?? 12)));
}

export function resolveActiveResponsiveBreakpoint(): 'base' | ThemeResponsiveBreakpoint {
  if (typeof window === 'undefined') {
    return 'base' as const;
  }

  const width = window.innerWidth;

  for (let index = RESPONSIVE_BREAKPOINT_ORDER.length - 1; index >= 0; index -= 1) {
    const breakpoint = RESPONSIVE_BREAKPOINT_ORDER[index]!;
    const minWidth = toPixels(THEME_RESPONSIVE_BREAKPOINTS[breakpoint]);
    if (width >= minWidth) {
      return breakpoint;
    }
  }

  return 'base' as const;
}

export function resolveGridItemSpan(
  item: UiGridItem,
  columns: number,
  breakpoint: 'base' | ThemeResponsiveBreakpoint
) {
  const clampToColumns = (value: number) => Math.min(columns, Math.max(1, Math.round(value)));
  const baseSpan = item.span ?? 1;

  if (breakpoint === 'lg') {
    return clampToColumns(item.responsive?.lg ?? item.responsive?.md ?? baseSpan);
  }

  if (breakpoint === 'md') {
    return clampToColumns(item.responsive?.md ?? baseSpan);
  }

  return clampToColumns(baseSpan);
}

export function flattenSlotChildren(nodes: VNodeArrayChildren | undefined): VNode[] {
  if (!nodes) {
    return [];
  }

  const children: VNode[] = [];

  for (const node of nodes) {
    if (!isVNode(node)) {
      continue;
    }

    if (node.type === Comment) {
      continue;
    }

    if (node.type === Text) {
      if (typeof node.children === 'string' && node.children.trim().length === 0) {
        continue;
      }

      children.push(node);
      continue;
    }

    if (node.type === Fragment) {
      children.push(...flattenSlotChildren(Array.isArray(node.children) ? node.children : []));
      continue;
    }

    children.push(node);
  }

  return children;
}
