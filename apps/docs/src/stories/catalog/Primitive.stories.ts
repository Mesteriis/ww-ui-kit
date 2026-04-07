import type { Meta } from '@storybook/vue3-vite';

import { createCatalogStory } from './createCatalogStory';

const meta = {
  title: 'Primitive',
} satisfies Meta;

export default meta;

const createPrimitiveStory = () => createCatalogStory('@ww/primitives');

export const PrimitivePortal = createPrimitiveStory();
export const PrimitiveFocusTrap = createPrimitiveStory();
export const PrimitiveVisuallyHidden = createPrimitiveStory();
