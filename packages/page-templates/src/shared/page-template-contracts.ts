export interface PageTemplateLayerRule {
  title: string;
  description: string;
}

export const PAGE_TEMPLATE_LAYER_RULES: PageTemplateLayerRule[] = [
  {
    title: 'Templates are shells',
    description:
      'Page templates define layout slots and composition zones rather than route-level business behavior.'
  },
  {
    title: 'Apps own route pages',
    description:
      'Real route pages remain inside apps where routing, backend integration, and product orchestration belong.'
  },
  {
    title: 'Widgets belong below templates',
    description:
      'Templates can compose widgets, systems, and core blocks, but they do not replace the widget layer.'
  },
  {
    title: 'No backend knowledge',
    description:
      'Templates should not fetch data or encode product-specific API contracts.'
  }
];

export const RESERVED_PAGE_TEMPLATE_NAMESPACES = [
  'auth',
  'workspace',
  'dashboard',
  'marketing',
  'settings'
] as const;
