export const zIndexTokens = {
  z: {
    'z-overlay-base': '4000',
    'z-overlay-step': '20',
    'z-overlay-slot-backdrop': '0',
    'z-overlay-slot-surface': '2',
    'z-overlay-slot-floating': '4',
    'z-overlay-slot-tooltip': '6',
    'z-overlay-slot-toast': '8',
    'z-layer-header': '100',
    'z-layer-dropdown': 'calc(var(--ui-z-overlay-base) - var(--ui-z-overlay-step))',
    'z-layer-overlay': 'calc(var(--ui-z-overlay-base) + var(--ui-z-overlay-slot-surface))',
  },
} as const;
