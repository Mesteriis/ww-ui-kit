<script setup lang="ts">
import { useScrollLock } from '@ww/primitives';

defineOptions({ name: 'UiDashboardLayout' });

defineSlots<{
  'aside-header'?: () => unknown;
  'aside-content'?: () => unknown;
  'aside-actions'?: () => unknown;
  header?: () => unknown;
  'header-actions'?: () => unknown;
  default?: () => unknown;
}>();

useScrollLock(true);
</script>

<template>
  <section class="ui-dashboard-layout" data-ui-region="shell">
    <aside class="ui-dashboard-layout__aside" data-ui-region="aside">
      <div class="ui-dashboard-layout__aside-header" data-ui-slot="aside-header">
        <slot name="aside-header" />
      </div>
      <div class="ui-dashboard-layout__aside-content" data-ui-slot="aside-content">
        <slot name="aside-content" />
      </div>
      <div class="ui-dashboard-layout__aside-actions" data-ui-slot="aside-actions">
        <slot name="aside-actions" />
      </div>
    </aside>

    <section class="ui-dashboard-layout__main" data-ui-region="main">
      <header class="ui-dashboard-layout__header" data-ui-region="header">
        <div class="ui-dashboard-layout__header-content" data-ui-slot="header">
          <slot name="header" />
        </div>
        <div class="ui-dashboard-layout__header-actions" data-ui-slot="header-actions">
          <slot name="header-actions" />
        </div>
      </header>

      <section class="ui-dashboard-layout__content" data-ui-region="content">
        <slot />
      </section>
    </section>
  </section>
</template>
