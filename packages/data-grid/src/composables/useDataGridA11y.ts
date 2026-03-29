import { computed, toValue, type MaybeRefOrGetter } from 'vue';

import { useId } from '@ww/primitives';

interface DataGridA11yOptions {
  ariaLabel: MaybeRefOrGetter<string | undefined>;
  caption: MaybeRefOrGetter<string | undefined>;
}

export function useDataGridA11y(options: DataGridA11yOptions) {
  const gridId = useId('data-grid');
  const captionId = useId('data-grid-caption');
  const caption = computed(() => toValue(options.caption));
  const ariaLabel = computed(() => toValue(options.ariaLabel));

  return {
    ariaLabel,
    caption,
    captionId,
    gridId,
    labelledBy: computed(() => (caption.value ? captionId.value : undefined))
  };
}
