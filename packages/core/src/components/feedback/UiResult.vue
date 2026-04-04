<script setup lang="ts">
import { computed } from 'vue';

defineOptions({ name: 'UiResult' });

type UiResultStatus = 'info' | 'success' | 'warning' | 'error' | '403' | '404' | '500';
type UiResultAppearance = 'soft' | 'outline';

const props = withDefaults(
  defineProps<{
    status?: UiResultStatus;
    title?: string;
    subtitle?: string;
    appearance?: UiResultAppearance;
  }>(),
  {
    appearance: 'soft',
    status: 'info',
  }
);

const resultIcon = computed(() => {
  switch (props.status) {
    case 'success':
      return '✓';
    case 'warning':
      return '!';
    case 'error':
      return '⨯';
    case '403':
      return '403';
    case '404':
      return '404';
    case '500':
      return '500';
    default:
      return 'i';
  }
});

const resultRole = computed(() =>
  props.status === 'warning' || props.status === 'error' || props.status === '500'
    ? 'alert'
    : 'status'
);
</script>

<template>
  <section
    class="ui-result"
    :class="[`ui-result--${props.status}`, `ui-result--${props.appearance}`]"
    :role="resultRole"
  >
    <div class="ui-result__icon" aria-hidden="true">
      <slot name="icon">{{ resultIcon }}</slot>
    </div>

    <div class="ui-result__body">
      <h2 v-if="props.title || $slots.title" class="ui-result__title">
        <slot name="title">{{ props.title }}</slot>
      </h2>
      <p v-if="props.subtitle || $slots.subtitle" class="ui-result__subtitle">
        <slot name="subtitle">{{ props.subtitle }}</slot>
      </p>
      <div v-if="$slots.default" class="ui-result__content">
        <slot />
      </div>
      <div v-if="$slots.extra" class="ui-result__extra">
        <slot name="extra" />
      </div>
    </div>
  </section>
</template>
