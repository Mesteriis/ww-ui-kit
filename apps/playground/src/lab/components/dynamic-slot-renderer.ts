import { defineComponent, type PropType } from 'vue';

import type { LabSlotRenderer } from '../manifest/component-lab.types';

export const DynamicSlotRenderer = defineComponent({
  name: 'DynamicSlotRenderer',
  props: {
    render: {
      type: Function as PropType<LabSlotRenderer>,
      required: true,
    },
    slotProps: {
      type: Object as PropType<Record<string, unknown>>,
      default: () => ({}),
    },
  },
  setup(props) {
    return () => props.render(props.slotProps);
  },
});
