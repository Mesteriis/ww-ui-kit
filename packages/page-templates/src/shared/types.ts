export const PAGE_TEMPLATE_WIDTHS = ['full', 'content', 'narrow'] as const;

export type PageTemplateWidth = (typeof PAGE_TEMPLATE_WIDTHS)[number];

export interface PageTemplateProps {
  title?: string;
  description?: string;
  width?: PageTemplateWidth;
  hasSidebar?: boolean;
  padded?: boolean;
}
