const nodeModulesSegment = '/node_modules/';

function includesPath(id: string, segment: string): boolean {
  return id.includes(segment);
}

function resolveSharedVendorChunk(id: string): string | undefined {
  if (!includesPath(id, nodeModulesSegment)) {
    return undefined;
  }

  if (includesPath(id, '/node_modules/apexcharts/')) {
    return 'vendor-apexcharts';
  }

  if (includesPath(id, '/node_modules/vue3-apexcharts/')) {
    return 'vendor-vue3-apexcharts';
  }

  if (includesPath(id, '/node_modules/@vue-flow/')) {
    return 'vendor-vue-flow';
  }

  if (includesPath(id, '/node_modules/vue/')) {
    return 'vendor-vue';
  }

  return undefined;
}

export const PLAYGROUND_CHUNK_WARNING_LIMIT = 600;
export const STORYBOOK_CHUNK_WARNING_LIMIT = 1200;

export function resolvePlaygroundManualChunk(id: string): string | undefined {
  const sharedVendorChunk = resolveSharedVendorChunk(id);
  if (sharedVendorChunk) {
    return sharedVendorChunk;
  }

  if (
    includesPath(id, '/apps/playground/src/testing/routes/TestingHarnessCoreAnchorProof.vue') ||
    includesPath(id, '/apps/playground/src/testing/routes/TestingHarnessLayoutUtilitiesCard.vue')
  ) {
    return 'playground-testing-core-wave';
  }

  if (includesPath(id, '/apps/playground/src/testing/')) {
    return 'playground-testing';
  }

  if (
    includesPath(id, '/apps/playground/src/DataGridShowcase.vue') ||
    includesPath(id, '/apps/playground/src/DataTableWidgetShowcase.vue') ||
    includesPath(id, '/apps/playground/src/LayerScaffoldShowcase.vue') ||
    includesPath(id, '/apps/playground/src/SignalGraphShowcase.vue')
  ) {
    return 'playground-showcases';
  }

  if (includesPath(id, '/apps/playground/src/lab/')) {
    return 'playground-lab';
  }

  return undefined;
}

export function resolveStorybookManualChunk(id: string): string | undefined {
  const sharedVendorChunk = resolveSharedVendorChunk(id);
  if (sharedVendorChunk) {
    return sharedVendorChunk;
  }

  if (includesPath(id, '/node_modules/axe-core/')) {
    return 'vendor-axe';
  }

  return undefined;
}
