import { markRaw, onMounted, ref, shallowRef, type Component, type ShallowRef } from 'vue';

let cachedApexComponent: Component | null = null;
let cachedApexComponentPromise: Promise<Component> | null = null;

function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  return new Error('Failed to load ApexCharts.');
}

async function loadApexComponent(): Promise<Component> {
  if (cachedApexComponent) {
    return cachedApexComponent;
  }

  if (!cachedApexComponentPromise) {
    cachedApexComponentPromise = import('vue3-apexcharts')
      .then((module) => {
        cachedApexComponent = markRaw(module.default);
        return cachedApexComponent;
      })
      .catch((error) => {
        cachedApexComponentPromise = null;
        throw error;
      });
  }

  return cachedApexComponentPromise;
}

export function useApexClientOnly() {
  const apexComponent: ShallowRef<Component | null> = shallowRef(cachedApexComponent ?? null);
  const clientReady = ref(false);
  const vendorError = ref<Error | null>(null);

  onMounted(async () => {
    clientReady.value = true;

    try {
      apexComponent.value = await loadApexComponent();
    } catch (error) {
      vendorError.value = normalizeError(error);
    }
  });

  return {
    apexComponent,
    clientReady,
    vendorError,
  };
}
