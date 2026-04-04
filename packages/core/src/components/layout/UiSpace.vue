<script lang="ts">
import { computed, defineComponent, h, useAttrs } from 'vue';

import type { PropType } from 'vue';

import type { UiLayoutAlign, UiLayoutGapToken, UiSpaceDirection } from './layout.types';
import { flattenSlotChildren, resolveFlexAlign, resolveGapToken } from './layout.shared';

export default defineComponent({
  name: 'UiSpace',
  inheritAttrs: false,
  props: {
    direction: {
      type: String as PropType<UiSpaceDirection>,
      default: 'horizontal',
    },
    size: {
      type: String as PropType<UiLayoutGapToken>,
      default: '3',
    },
    align: {
      type: String as PropType<UiLayoutAlign>,
      default: undefined,
    },
    wrap: {
      type: Boolean,
      default: false,
    },
    separator: {
      type: String,
      default: '',
    },
    compact: {
      type: Boolean,
      default: false,
    },
    block: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    const attrs = useAttrs();

    const children = computed(() => flattenSlotChildren(slots.default?.()));
    const hasSeparator = computed(
      () => !props.compact && (Boolean(props.separator) || Boolean(slots.separator))
    );
    const resolvedAlign = computed(
      () => props.align ?? (props.direction === 'horizontal' ? 'center' : 'stretch')
    );
    const spaceStyle = computed(() => ({
      alignItems: resolveFlexAlign(resolvedAlign.value),
      gap: props.compact ? '0px' : resolveGapToken(props.size),
    }));

    return () => {
      const { class: attrsClass, style: attrsStyle, ...restAttrs } = attrs;
      const items = children.value.flatMap((child, index) => {
        const nodes = [
          h(
            'div',
            {
              class: 'ui-space__item',
              key: child.key ?? `item-${index}`,
            },
            [child]
          ),
        ];

        if (hasSeparator.value && index < children.value.length - 1) {
          nodes.push(
            h(
              'span',
              {
                class: 'ui-space__separator',
                'aria-hidden': 'true',
                key: `separator-${index}`,
              },
              slots.separator ? slots.separator() : props.separator
            )
          );
        }

        return nodes;
      });

      return h(
        'div',
        {
          ...restAttrs,
          class: [
            'ui-space',
            `ui-space--${props.direction}`,
            {
              'ui-space--block': props.block,
              'ui-space--compact': props.compact,
              'ui-space--wrap': props.wrap,
            },
            attrsClass,
          ],
          style: [spaceStyle.value, attrsStyle],
        },
        items
      );
    };
  },
});
</script>
