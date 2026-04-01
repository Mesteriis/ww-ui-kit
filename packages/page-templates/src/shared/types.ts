export const LAYOUT_WIDTHS = ['full', 'content', 'narrow'] as const;

export type LayoutWidth = (typeof LAYOUT_WIDTHS)[number];

export interface UiLayoutProps {
  width?: LayoutWidth;
}

export interface UiFlowLayoutProps {
  gap?: string;
  scroll?: boolean;
}
