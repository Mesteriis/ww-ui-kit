export const WIDGET_SURFACES = ['default', 'subtle', 'elevated'] as const;

export type WidgetSurface = (typeof WIDGET_SURFACES)[number];

export type WidgetErrorState = boolean | string;

export interface WidgetShellProps {
  title?: string;
  description?: string;
  loading?: boolean;
  error?: WidgetErrorState;
  surface?: WidgetSurface;
  padded?: boolean;
}
