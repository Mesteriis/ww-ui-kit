<script setup lang="ts">
defineOptions({ name: 'UiCard' });
</script>

<template>
  <section class="ui-card" data-ui-motion="lift-xs">
    <header v-if="$slots.header" class="ui-card__header">
      <slot name="header" />
    </header>
    <div class="ui-card__body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="ui-card__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>
