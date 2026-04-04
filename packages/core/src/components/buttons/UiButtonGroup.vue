<script setup lang="ts">
import { computed } from 'vue';

defineOptions({ name: 'UiButtonGroup' });

type UiButtonGroupOrientation = 'horizontal' | 'vertical';

const props = withDefaults(
  defineProps<{
    orientation?: UiButtonGroupOrientation;
    attached?: boolean;
    wrap?: boolean;
    block?: boolean;
    ariaLabel?: string;
    ariaLabelledby?: string;
  }>(),
  {
    attached: true,
    block: false,
    orientation: 'horizontal',
    wrap: false,
  }
);

const attachedState = computed(() => props.attached && !props.wrap);
</script>

<template>
  <div
    class="ui-button-group"
    :class="[
      `ui-button-group--${props.orientation}`,
      {
        'ui-button-group--attached': attachedState,
        'ui-button-group--block': props.block,
        'ui-button-group--wrap': props.wrap,
      },
    ]"
    role="group"
    :aria-label="props.ariaLabel"
    :aria-labelledby="props.ariaLabelledby"
  >
    <slot />
  </div>
</template>
