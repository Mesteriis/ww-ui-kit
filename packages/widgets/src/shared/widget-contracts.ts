export interface WidgetLayerRule {
  title: string;
  description: string;
}

export const WIDGET_LAYER_RULES: WidgetLayerRule[] = [
  {
    title: 'Black-box composition',
    description:
      'Widgets package together core components and optional systems into reusable UI blocks.',
  },
  {
    title: 'No backend ownership',
    description:
      'Widgets do not fetch data directly and do not embed transport or backend concerns.',
  },
  {
    title: 'No routing ownership',
    description:
      'Widgets can be placed inside many apps or route pages, but they do not initiate product routing.',
  },
  {
    title: 'Systems stay below widgets',
    description:
      'Grid engines, graph engines, and chart adapters remain systems packages. Widgets may compose them, not replace them.',
  },
];

export const RESERVED_WIDGET_NAMESPACES = [
  'auth/login-window',
  'dashboard',
  'entity',
  'feedback',
] as const;
