<script setup lang="ts">
import { computed } from 'vue';

defineOptions({ name: 'UiWatermark' });

const props = withDefaults(
  defineProps<{
    text?: string;
    content?: string;
    imageSrc?: string;
    rotate?: number;
    opacity?: number;
    gapX?: number;
    gapY?: number;
    offsetX?: number;
    offsetY?: number;
    fontSize?: number;
  }>(),
  {
    text: 'Belovodye',
    rotate: -18,
    opacity: 0.16,
    gapX: 160,
    gapY: 128,
    offsetX: 24,
    offsetY: 24,
    fontSize: 18,
  }
);

const watermarkText = computed(() => props.content ?? props.text);

function encodeSvg(value: string) {
  return encodeURIComponent(value).replace(/%20/g, ' ');
}

const svgMarkup = computed(() => {
  const width = Math.max(props.gapX, 96);
  const height = Math.max(props.gapY, 96);

  if (props.imageSrc) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><g opacity="${props.opacity}" transform="translate(${width / 2} ${height / 2}) rotate(${props.rotate}) translate(${-width / 4} ${-height / 4})"><image href="${props.imageSrc}" width="${width / 2}" height="${height / 2}" preserveAspectRatio="xMidYMid meet" /></g></svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><g opacity="${props.opacity}" transform="translate(${width / 2} ${height / 2}) rotate(${props.rotate})"><text x="0" y="0" text-anchor="middle" dominant-baseline="middle" fill="currentColor" font-size="${props.fontSize}" font-family="inherit">${watermarkText.value}</text></g></svg>`;
});

const overlayStyle = computed<Record<string, string>>(() => ({
  backgroundImage: `url("data:image/svg+xml,${encodeSvg(svgMarkup.value)}")`,
  backgroundPosition: `${props.offsetX}px ${props.offsetY}px`,
  backgroundSize: `${props.gapX}px ${props.gapY}px`,
}));
</script>

<template>
  <div class="ui-watermark">
    <div class="ui-watermark__content">
      <slot />
    </div>
    <div class="ui-watermark__overlay" :style="overlayStyle" aria-hidden="true" />
  </div>
</template>
