export const playgroundLabUsage = {
  "generatedAt": "generated-at-build",
  "surfaces": {
    "primitive-portal": {
      "id": "primitive-portal",
      "title": "PrimitivePortal",
      "exportName": "PrimitivePortal",
      "packageName": "@ww/primitives",
      "packageLayer": "primitives",
      "stability": "stable",
      "family": "Foundations",
      "labEligible": false,
      "labExemptionReason": "PrimitivePortal is reviewed through Storybook and integration flows because portal targeting and mount timing are behavioral contracts rather than standalone visual tuning.",
      "sourcePublicSurface": "PrimitivePortal / PrimitiveFocusTrap / PrimitiveVisuallyHidden",
      "downstreamPackages": [
        {
          "packageName": "@ww/core",
          "packageLayer": "core",
          "count": 10,
          "files": [
            "packages/core/src/components/fields/UiAutocomplete.vue",
            "packages/core/src/components/fields/UiSelect.vue",
            "packages/core/src/components/overlay/UiContextMenu.vue",
            "packages/core/src/components/overlay/UiDialog.vue",
            "packages/core/src/components/overlay/UiDrawer.vue",
            "packages/core/src/components/overlay/UiDropdown.vue",
            "packages/core/src/components/overlay/UiPopconfirm.vue",
            "packages/core/src/components/overlay/UiPopover.vue"
          ]
        },
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/docs/src/stories/foundations/primitives/Overview.stories.ts"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "core",
          "count": 10,
          "files": [
            "packages/core/src/components/fields/UiAutocomplete.vue",
            "packages/core/src/components/fields/UiSelect.vue",
            "packages/core/src/components/overlay/UiContextMenu.vue",
            "packages/core/src/components/overlay/UiDialog.vue",
            "packages/core/src/components/overlay/UiDrawer.vue",
            "packages/core/src/components/overlay/UiDropdown.vue",
            "packages/core/src/components/overlay/UiPopconfirm.vue",
            "packages/core/src/components/overlay/UiPopover.vue",
            "packages/core/src/components/overlay/UiToast.vue",
            "packages/core/src/components/overlay/UiTooltip.vue"
          ]
        },
        {
          "area": "docs",
          "count": 1,
          "files": [
            "apps/docs/src/stories/foundations/primitives/Overview.stories.ts"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Foundations/Primitives/Overview",
          "file": "apps/docs/src/stories/foundations/primitives/Overview.stories.ts"
        }
      ],
      "relatedHarnesses": [],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/primitives/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit"
      ],
      "tags": [
        "primitives",
        "a11y",
        "overlay"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/foundations/primitives/Overview.stories.ts",
          "area": "docs"
        },
        {
          "file": "packages/core/src/components/fields/UiAutocomplete.vue",
          "area": "core"
        },
        {
          "file": "packages/core/src/components/fields/UiSelect.vue",
          "area": "core"
        },
        {
          "file": "packages/core/src/components/overlay/UiContextMenu.vue",
          "area": "core"
        },
        {
          "file": "packages/core/src/components/overlay/UiDialog.vue",
          "area": "core"
        },
        {
          "file": "packages/core/src/components/overlay/UiDrawer.vue",
          "area": "core"
        },
        {
          "file": "packages/core/src/components/overlay/UiDropdown.vue",
          "area": "core"
        },
        {
          "file": "packages/core/src/components/overlay/UiPopconfirm.vue",
          "area": "core"
        },
        {
          "file": "packages/core/src/components/overlay/UiPopover.vue",
          "area": "core"
        },
        {
          "file": "packages/core/src/components/overlay/UiToast.vue",
          "area": "core"
        },
        {
          "file": "packages/core/src/components/overlay/UiTooltip.vue",
          "area": "core"
        }
      ]
    },
    "primitive-focus-trap": {
      "id": "primitive-focus-trap",
      "title": "PrimitiveFocusTrap",
      "exportName": "PrimitiveFocusTrap",
      "packageName": "@ww/primitives",
      "packageLayer": "primitives",
      "stability": "stable",
      "family": "Foundations",
      "labEligible": false,
      "labExemptionReason": "PrimitiveFocusTrap is reviewed through Storybook and unit tests because keyboard loop and focus restore are interaction contracts rather than matrix-style visual tuning.",
      "sourcePublicSurface": "PrimitivePortal / PrimitiveFocusTrap / PrimitiveVisuallyHidden",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/docs/src/stories/foundations/primitives/Overview.stories.ts"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 1,
          "files": [
            "apps/docs/src/stories/foundations/primitives/Overview.stories.ts"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Foundations/Primitives/Overview",
          "file": "apps/docs/src/stories/foundations/primitives/Overview.stories.ts"
        }
      ],
      "relatedHarnesses": [],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/primitives/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit"
      ],
      "tags": [
        "primitives",
        "a11y",
        "overlay"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/foundations/primitives/Overview.stories.ts",
          "area": "docs"
        }
      ]
    },
    "primitive-visually-hidden": {
      "id": "primitive-visually-hidden",
      "title": "PrimitiveVisuallyHidden",
      "exportName": "PrimitiveVisuallyHidden",
      "packageName": "@ww/primitives",
      "packageLayer": "primitives",
      "stability": "stable",
      "family": "Foundations",
      "labEligible": false,
      "labExemptionReason": "PrimitiveVisuallyHidden is reviewed through Storybook and unit tests because its value is accessible-name behavior instead of standalone visual styling knobs.",
      "sourcePublicSurface": "PrimitivePortal / PrimitiveFocusTrap / PrimitiveVisuallyHidden",
      "downstreamPackages": [
        {
          "packageName": "@ww/core",
          "packageLayer": "core",
          "count": 2,
          "files": [
            "packages/core/src/components/buttons/UiButton.vue",
            "packages/core/src/components/fields/UiRangeSlider.vue"
          ]
        },
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/docs/src/stories/foundations/primitives/Overview.stories.ts"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "core",
          "count": 2,
          "files": [
            "packages/core/src/components/buttons/UiButton.vue",
            "packages/core/src/components/fields/UiRangeSlider.vue"
          ]
        },
        {
          "area": "docs",
          "count": 1,
          "files": [
            "apps/docs/src/stories/foundations/primitives/Overview.stories.ts"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Foundations/Primitives/Overview",
          "file": "apps/docs/src/stories/foundations/primitives/Overview.stories.ts"
        }
      ],
      "relatedHarnesses": [],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/primitives/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit"
      ],
      "tags": [
        "primitives",
        "a11y",
        "overlay"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/foundations/primitives/Overview.stories.ts",
          "area": "docs"
        },
        {
          "file": "packages/core/src/components/buttons/UiButton.vue",
          "area": "core"
        },
        {
          "file": "packages/core/src/components/fields/UiRangeSlider.vue",
          "area": "core"
        }
      ]
    },
    "ui-button": {
      "id": "ui-button",
      "title": "UiButton",
      "exportName": "UiButton",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Actions",
      "labEligible": true,
      "sourcePublicSurface": "UiButton",
      "downstreamPackages": [
        {
          "packageName": "@ww/data-grid",
          "packageLayer": "system",
          "count": 2,
          "files": [
            "packages/data-grid/src/components/UiDataGridBulkActions.vue",
            "packages/data-grid/src/components/UiDataGridPagination.vue"
          ]
        },
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 18,
          "files": [
            "apps/docs/src/stories/Buttons.stories.ts",
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Feedback.stories.ts",
            "apps/docs/src/stories/Layout.stories.ts",
            "apps/docs/src/stories/Overlay.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
            "apps/docs/src/stories/foundations/MotionOverview.stories.ts",
            "apps/docs/src/stories/foundations/OverlayLayers.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 27,
          "files": [
            "apps/playground/src/DataGridShowcase.vue",
            "apps/playground/src/DataTableWidgetShowcase.vue",
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/SignalGraphShowcase.vue",
            "apps/playground/src/TsParticlesShowcase.vue",
            "apps/playground/src/lab/components/DashboardLayoutLabPreview.vue",
            "apps/playground/src/lab/components/DataGridLabPreview.vue",
            "apps/playground/src/lab/components/DataTableWidgetLabPreview.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 18,
          "files": [
            "apps/docs/src/stories/Buttons.stories.ts",
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Feedback.stories.ts",
            "apps/docs/src/stories/Layout.stories.ts",
            "apps/docs/src/stories/Overlay.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
            "apps/docs/src/stories/foundations/MotionOverview.stories.ts",
            "apps/docs/src/stories/foundations/OverlayLayers.stories.ts",
            "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts",
            "apps/docs/src/stories/foundations/ThemeSystemOverview.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 27,
          "files": [
            "apps/playground/src/DataGridShowcase.vue",
            "apps/playground/src/DataTableWidgetShowcase.vue",
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/SignalGraphShowcase.vue",
            "apps/playground/src/TsParticlesShowcase.vue",
            "apps/playground/src/lab/components/DashboardLayoutLabPreview.vue",
            "apps/playground/src/lab/components/DataGridLabPreview.vue",
            "apps/playground/src/lab/components/DataTableWidgetLabPreview.vue",
            "apps/playground/src/lab/components/FloatingSurfaceLabPreview.vue",
            "apps/playground/src/lab/components/LayoutLabPreview.vue"
          ]
        },
        {
          "area": "systems",
          "count": 2,
          "files": [
            "packages/data-grid/src/components/UiDataGridBulkActions.vue",
            "packages/data-grid/src/components/UiDataGridPagination.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Buttons",
          "file": "apps/docs/src/stories/Buttons.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [],
      "relatedDocs": [],
      "requiredTestLayers": [
        "unit",
        "e2e"
      ],
      "tags": [],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/Buttons.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Feedback.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Layout.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Overlay.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/MotionOverview.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/OverlayLayers.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/ThemeSystemOverview.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/primitives/Overview.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/signal-graph/Signals.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/signal-graph/signal-graph-fixtures.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/page-templates/DashboardLayout.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/page-templates/Shell.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/systems/data-grid/data-grid-fixtures.ts",
          "area": "docs"
        }
      ]
    },
    "ui-button-group": {
      "id": "ui-button-group",
      "title": "UiButtonGroup",
      "exportName": "UiButtonGroup",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Actions",
      "labEligible": true,
      "sourcePublicSurface": "UiButtonGroup",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/Buttons.stories.ts",
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 2,
          "files": [
            "apps/playground/src/lab/schemas/ui-button-group.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/Buttons.stories.ts",
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 2,
          "files": [
            "apps/playground/src/lab/schemas/ui-button-group.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Buttons",
          "file": "apps/docs/src/stories/Buttons.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "core-wave",
          "label": "Core Wave",
          "description": "Selection, disclosure, rich fields, menus, steps, display/data surfaces, and one composed consumer-style flow.",
          "path": "/testing#testing-core-wave"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "buttons",
        "group"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/Buttons.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-button-group.lab.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-flex": {
      "id": "ui-flex",
      "title": "UiFlex",
      "exportName": "UiFlex",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Layout",
      "labEligible": true,
      "sourcePublicSurface": "UiGrid / UiSpace / UiFlex",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Layout.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 2,
          "files": [
            "apps/playground/src/lab/schemas/ui-flex.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessLayoutUtilitiesCard.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Layout.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 2,
          "files": [
            "apps/playground/src/lab/schemas/ui-flex.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessLayoutUtilitiesCard.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Layout",
          "file": "apps/docs/src/stories/Layout.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "core-wave",
          "label": "Core Wave",
          "description": "Selection, disclosure, rich fields, menus, steps, display/data surfaces, and one composed consumer-style flow.",
          "path": "/testing#testing-core-wave"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "layout",
        "utilities"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Layout.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-flex.lab.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessLayoutUtilitiesCard.vue",
          "area": "playground"
        }
      ]
    },
    "ui-grid": {
      "id": "ui-grid",
      "title": "UiGrid",
      "exportName": "UiGrid",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Layout",
      "labEligible": false,
      "labExemptionReason": "UiGrid is reviewed through Storybook and the playground harness because responsive spans only make sense against realistic card and metadata compositions.",
      "sourcePublicSurface": "UiGrid / UiSpace / UiFlex",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Layout.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessLayoutUtilitiesCard.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Layout.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessLayoutUtilitiesCard.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Layout",
          "file": "apps/docs/src/stories/Layout.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "core-wave",
          "label": "Core Wave",
          "description": "Selection, disclosure, rich fields, menus, steps, display/data surfaces, and one composed consumer-style flow.",
          "path": "/testing#testing-core-wave"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "layout",
        "utilities"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Layout.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessLayoutUtilitiesCard.vue",
          "area": "playground"
        }
      ]
    },
    "ui-space": {
      "id": "ui-space",
      "title": "UiSpace",
      "exportName": "UiSpace",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Layout",
      "labEligible": true,
      "sourcePublicSurface": "UiGrid / UiSpace / UiFlex",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Layout.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 2,
          "files": [
            "apps/playground/src/lab/schemas/ui-space.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessLayoutUtilitiesCard.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Layout.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 2,
          "files": [
            "apps/playground/src/lab/schemas/ui-space.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessLayoutUtilitiesCard.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Layout",
          "file": "apps/docs/src/stories/Layout.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "core-wave",
          "label": "Core Wave",
          "description": "Selection, disclosure, rich fields, menus, steps, display/data surfaces, and one composed consumer-style flow.",
          "path": "/testing#testing-core-wave"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "layout",
        "utilities"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Layout.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-space.lab.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessLayoutUtilitiesCard.vue",
          "area": "playground"
        }
      ]
    },
    "ui-affix": {
      "id": "ui-affix",
      "title": "UiAffix",
      "exportName": "UiAffix",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Layout",
      "labEligible": false,
      "labExemptionReason": "UiAffix is reviewed through Storybook and the playground harness because sticky-state transitions only make sense against a real scroll container and viewport.",
      "sourcePublicSurface": "UiAffix / UiScrollArea / UiScrollTop / UiAnchor",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Layout.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessLayoutUtilitiesCard.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Layout.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessLayoutUtilitiesCard.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Layout",
          "file": "apps/docs/src/stories/Layout.stories.ts"
        },
        {
          "variant": "overview",
          "title": "Core/Navigation",
          "file": "apps/docs/src/stories/Navigation.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "core-wave",
          "label": "Core Wave",
          "description": "Selection, disclosure, rich fields, menus, steps, display/data surfaces, and one composed consumer-style flow.",
          "path": "/testing#testing-core-wave"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "layout",
        "scroll",
        "navigation"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Layout.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessLayoutUtilitiesCard.vue",
          "area": "playground"
        }
      ]
    },
    "ui-scroll-area": {
      "id": "ui-scroll-area",
      "title": "UiScrollArea",
      "exportName": "UiScrollArea",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Layout",
      "labEligible": true,
      "sourcePublicSurface": "UiAffix / UiScrollArea / UiScrollTop / UiAnchor",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 4,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Layout.stories.ts",
            "apps/docs/src/stories/Navigation.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/playground/src/lab/schemas/ui-scroll-area.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessCoreAnchorProof.vue",
            "apps/playground/src/testing/routes/TestingHarnessLayoutUtilitiesCard.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 4,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Layout.stories.ts",
            "apps/docs/src/stories/Navigation.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 3,
          "files": [
            "apps/playground/src/lab/schemas/ui-scroll-area.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessCoreAnchorProof.vue",
            "apps/playground/src/testing/routes/TestingHarnessLayoutUtilitiesCard.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Layout",
          "file": "apps/docs/src/stories/Layout.stories.ts"
        },
        {
          "variant": "overview",
          "title": "Core/Navigation",
          "file": "apps/docs/src/stories/Navigation.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "core-wave",
          "label": "Core Wave",
          "description": "Selection, disclosure, rich fields, menus, steps, display/data surfaces, and one composed consumer-style flow.",
          "path": "/testing#testing-core-wave"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "layout",
        "scroll",
        "navigation"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Layout.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Navigation.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-scroll-area.lab.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessCoreAnchorProof.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessLayoutUtilitiesCard.vue",
          "area": "playground"
        }
      ]
    },
    "ui-scroll-top": {
      "id": "ui-scroll-top",
      "title": "UiScrollTop",
      "exportName": "UiScrollTop",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Layout",
      "labEligible": false,
      "labExemptionReason": "UiScrollTop is reviewed through Storybook and the playground harness because threshold visibility and target scrolling are interaction contracts instead of static visual tuning.",
      "sourcePublicSurface": "UiAffix / UiScrollArea / UiScrollTop / UiAnchor",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Layout.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessLayoutUtilitiesCard.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Layout.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessLayoutUtilitiesCard.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Layout",
          "file": "apps/docs/src/stories/Layout.stories.ts"
        },
        {
          "variant": "overview",
          "title": "Core/Navigation",
          "file": "apps/docs/src/stories/Navigation.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "core-wave",
          "label": "Core Wave",
          "description": "Selection, disclosure, rich fields, menus, steps, display/data surfaces, and one composed consumer-style flow.",
          "path": "/testing#testing-core-wave"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "layout",
        "scroll",
        "navigation"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Layout.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessLayoutUtilitiesCard.vue",
          "area": "playground"
        }
      ]
    },
    "ui-icon-button": {
      "id": "ui-icon-button",
      "title": "UiIconButton",
      "exportName": "UiIconButton",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Actions",
      "labEligible": true,
      "sourcePublicSurface": "UiIconButton",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/Buttons.stories.ts",
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 4,
          "files": [
            "apps/playground/src/App.vue",
            "apps/playground/src/PlaygroundHomeView.vue",
            "apps/playground/src/lab/schemas/ui-dashboard-layout.lab.ts",
            "apps/playground/src/lab/schemas/ui-icon-button.lab.ts"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/Buttons.stories.ts",
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 4,
          "files": [
            "apps/playground/src/App.vue",
            "apps/playground/src/PlaygroundHomeView.vue",
            "apps/playground/src/lab/schemas/ui-dashboard-layout.lab.ts",
            "apps/playground/src/lab/schemas/ui-icon-button.lab.ts"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Buttons",
          "file": "apps/docs/src/stories/Buttons.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [],
      "relatedDocs": [],
      "requiredTestLayers": [
        "unit",
        "e2e"
      ],
      "tags": [],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/Buttons.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/App.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/PlaygroundHomeView.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-dashboard-layout.lab.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-icon-button.lab.ts",
          "area": "playground"
        }
      ]
    },
    "ui-field": {
      "id": "ui-field",
      "title": "UiField",
      "exportName": "UiField",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Fields",
      "labEligible": false,
      "labExemptionReason": "UiField is reviewed through UiInput, UiTextarea, and UiSelectSimple because it is a wrapper context rather than a standalone styling surface.",
      "sourcePublicSurface": "UiField / UiInput / UiTextarea / UiSelectSimple",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 5,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Fields.stories.ts",
            "apps/docs/src/stories/Selection.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
            "apps/docs/src/stories/foundations/signal-graph/signal-graph-fixtures.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/playground/src/lab/components/FieldSurfaceLabPreview.vue",
            "apps/playground/src/signal-graph-demo.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 5,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Fields.stories.ts",
            "apps/docs/src/stories/Selection.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
            "apps/docs/src/stories/foundations/signal-graph/signal-graph-fixtures.ts"
          ]
        },
        {
          "area": "playground",
          "count": 3,
          "files": [
            "apps/playground/src/lab/components/FieldSurfaceLabPreview.vue",
            "apps/playground/src/signal-graph-demo.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Fields",
          "file": "apps/docs/src/stories/Fields.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [],
      "relatedDocs": [],
      "requiredTestLayers": [
        "unit",
        "e2e"
      ],
      "tags": [],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Fields.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Selection.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/signal-graph/signal-graph-fixtures.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/lab/components/FieldSurfaceLabPreview.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/signal-graph-demo.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-input": {
      "id": "ui-input",
      "title": "UiInput",
      "exportName": "UiInput",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Fields",
      "labEligible": true,
      "sourcePublicSurface": "UiField / UiInput / UiTextarea / UiSelectSimple",
      "downstreamPackages": [
        {
          "packageName": "@ww/data-grid",
          "packageLayer": "system",
          "count": 1,
          "files": [
            "packages/data-grid/src/components/UiDataGridSearch.vue"
          ]
        },
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 5,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Fields.stories.ts",
            "apps/docs/src/stories/Layout.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
            "apps/docs/src/stories/foundations/signal-graph/signal-graph-fixtures.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/playground/src/lab/schemas/ui-input.lab.ts",
            "apps/playground/src/signal-graph-demo.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 5,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Fields.stories.ts",
            "apps/docs/src/stories/Layout.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
            "apps/docs/src/stories/foundations/signal-graph/signal-graph-fixtures.ts"
          ]
        },
        {
          "area": "playground",
          "count": 3,
          "files": [
            "apps/playground/src/lab/schemas/ui-input.lab.ts",
            "apps/playground/src/signal-graph-demo.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        },
        {
          "area": "systems",
          "count": 1,
          "files": [
            "packages/data-grid/src/components/UiDataGridSearch.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Fields",
          "file": "apps/docs/src/stories/Fields.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [],
      "relatedDocs": [],
      "requiredTestLayers": [
        "unit",
        "e2e"
      ],
      "tags": [],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Fields.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Layout.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/signal-graph/signal-graph-fixtures.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-input.lab.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/signal-graph-demo.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        },
        {
          "file": "packages/data-grid/src/components/UiDataGridSearch.vue",
          "area": "systems"
        }
      ]
    },
    "ui-textarea": {
      "id": "ui-textarea",
      "title": "UiTextarea",
      "exportName": "UiTextarea",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Fields",
      "labEligible": true,
      "sourcePublicSurface": "UiField / UiInput / UiTextarea / UiSelectSimple",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Fields.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/playground/src/lab/schemas/ui-textarea.lab.ts"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Fields.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 1,
          "files": [
            "apps/playground/src/lab/schemas/ui-textarea.lab.ts"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Fields",
          "file": "apps/docs/src/stories/Fields.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [],
      "relatedDocs": [],
      "requiredTestLayers": [
        "unit",
        "e2e"
      ],
      "tags": [],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Fields.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-textarea.lab.ts",
          "area": "playground"
        }
      ]
    },
    "ui-select-simple": {
      "id": "ui-select-simple",
      "title": "UiSelectSimple",
      "exportName": "UiSelectSimple",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Fields",
      "labEligible": true,
      "sourcePublicSurface": "UiField / UiInput / UiTextarea / UiSelectSimple",
      "downstreamPackages": [
        {
          "packageName": "@ww/data-grid",
          "packageLayer": "system",
          "count": 2,
          "files": [
            "packages/data-grid/src/components/UiDataGridFilters.vue",
            "packages/data-grid/src/components/UiDataGridPagination.vue"
          ]
        },
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Fields.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/playground/src/lab/schemas/ui-select-simple.lab.ts"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Fields.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 1,
          "files": [
            "apps/playground/src/lab/schemas/ui-select-simple.lab.ts"
          ]
        },
        {
          "area": "systems",
          "count": 2,
          "files": [
            "packages/data-grid/src/components/UiDataGridFilters.vue",
            "packages/data-grid/src/components/UiDataGridPagination.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Fields",
          "file": "apps/docs/src/stories/Fields.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [],
      "relatedDocs": [],
      "requiredTestLayers": [
        "unit",
        "e2e"
      ],
      "tags": [],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Fields.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-select-simple.lab.ts",
          "area": "playground"
        },
        {
          "file": "packages/data-grid/src/components/UiDataGridFilters.vue",
          "area": "systems"
        },
        {
          "file": "packages/data-grid/src/components/UiDataGridPagination.vue",
          "area": "systems"
        }
      ]
    },
    "ui-number-input": {
      "id": "ui-number-input",
      "title": "UiNumberInput",
      "exportName": "UiNumberInput",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Fields",
      "labEligible": true,
      "sourcePublicSurface": "UiNumberInput / UiSelect / UiAutocomplete",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Fields.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 2,
          "files": [
            "apps/playground/src/lab/schemas/ui-number-input.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Fields.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 2,
          "files": [
            "apps/playground/src/lab/schemas/ui-number-input.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Fields",
          "file": "apps/docs/src/stories/Fields.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "core-wave",
          "label": "Core Wave",
          "description": "Selection, disclosure, rich fields, menus, steps, display/data surfaces, and one composed consumer-style flow.",
          "path": "/testing#testing-core-wave"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "fields",
        "numeric",
        "collection"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Fields.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-number-input.lab.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-slider": {
      "id": "ui-slider",
      "title": "UiSlider",
      "exportName": "UiSlider",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Fields",
      "labEligible": true,
      "sourcePublicSurface": "UiSlider / UiRangeSlider",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Fields.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 2,
          "files": [
            "apps/playground/src/lab/schemas/ui-slider.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Fields.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 2,
          "files": [
            "apps/playground/src/lab/schemas/ui-slider.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Fields",
          "file": "apps/docs/src/stories/Fields.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "core-wave",
          "label": "Core Wave",
          "description": "Selection, disclosure, rich fields, menus, steps, display/data surfaces, and one composed consumer-style flow.",
          "path": "/testing#testing-core-wave"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "fields",
        "slider",
        "range"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Fields.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-slider.lab.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-range-slider": {
      "id": "ui-range-slider",
      "title": "UiRangeSlider",
      "exportName": "UiRangeSlider",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Fields",
      "labEligible": false,
      "labExemptionReason": "UiRangeSlider is reviewed through Storybook and the playground harness because two-thumb pointer and keyboard coordination is behavioral rather than matrix-only visual tuning.",
      "sourcePublicSurface": "UiSlider / UiRangeSlider",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Fields.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Fields.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Fields",
          "file": "apps/docs/src/stories/Fields.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "core-wave",
          "label": "Core Wave",
          "description": "Selection, disclosure, rich fields, menus, steps, display/data surfaces, and one composed consumer-style flow.",
          "path": "/testing#testing-core-wave"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "fields",
        "slider",
        "range"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Fields.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-select": {
      "id": "ui-select",
      "title": "UiSelect",
      "exportName": "UiSelect",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Fields",
      "labEligible": true,
      "sourcePublicSurface": "UiNumberInput / UiSelect / UiAutocomplete",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Fields.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 2,
          "files": [
            "apps/playground/src/lab/schemas/ui-select.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Fields.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 2,
          "files": [
            "apps/playground/src/lab/schemas/ui-select.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Fields",
          "file": "apps/docs/src/stories/Fields.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "core-wave",
          "label": "Core Wave",
          "description": "Selection, disclosure, rich fields, menus, steps, display/data surfaces, and one composed consumer-style flow.",
          "path": "/testing#testing-core-wave"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "fields",
        "numeric",
        "collection"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Fields.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-select.lab.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-autocomplete": {
      "id": "ui-autocomplete",
      "title": "UiAutocomplete",
      "exportName": "UiAutocomplete",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Fields",
      "labEligible": false,
      "labExemptionReason": "UiAutocomplete is reviewed through Storybook and the playground harness because filtering, highlight state, and selection semantics are better proven in composed browser flows than in a visual matrix.",
      "sourcePublicSurface": "UiNumberInput / UiSelect / UiAutocomplete",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Fields.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Fields.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Fields",
          "file": "apps/docs/src/stories/Fields.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "core-wave",
          "label": "Core Wave",
          "description": "Selection, disclosure, rich fields, menus, steps, display/data surfaces, and one composed consumer-style flow.",
          "path": "/testing#testing-core-wave"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "fields",
        "numeric",
        "collection"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Fields.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-checkbox": {
      "id": "ui-checkbox",
      "title": "UiCheckbox",
      "exportName": "UiCheckbox",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Selection",
      "labEligible": true,
      "sourcePublicSurface": "UiCheckbox / UiSwitch",
      "downstreamPackages": [
        {
          "packageName": "@ww/data-grid",
          "packageLayer": "system",
          "count": 2,
          "files": [
            "packages/data-grid/src/components/UiDataGridColumnVisibility.vue",
            "packages/data-grid/src/components/UiDataGridTable.vue"
          ]
        },
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Selection.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/playground/src/lab/schemas/ui-checkbox.lab.ts"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Selection.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 1,
          "files": [
            "apps/playground/src/lab/schemas/ui-checkbox.lab.ts"
          ]
        },
        {
          "area": "systems",
          "count": 2,
          "files": [
            "packages/data-grid/src/components/UiDataGridColumnVisibility.vue",
            "packages/data-grid/src/components/UiDataGridTable.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Selection",
          "file": "apps/docs/src/stories/Selection.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [],
      "relatedDocs": [],
      "requiredTestLayers": [
        "unit",
        "e2e"
      ],
      "tags": [],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Selection.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-checkbox.lab.ts",
          "area": "playground"
        },
        {
          "file": "packages/data-grid/src/components/UiDataGridColumnVisibility.vue",
          "area": "systems"
        },
        {
          "file": "packages/data-grid/src/components/UiDataGridTable.vue",
          "area": "systems"
        }
      ]
    },
    "ui-switch": {
      "id": "ui-switch",
      "title": "UiSwitch",
      "exportName": "UiSwitch",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Selection",
      "labEligible": true,
      "sourcePublicSurface": "UiCheckbox / UiSwitch",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 4,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Selection.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
            "apps/docs/src/stories/foundations/signal-graph/signal-graph-fixtures.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/playground/src/lab/schemas/ui-switch.lab.ts",
            "apps/playground/src/signal-graph-demo.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 4,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Selection.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
            "apps/docs/src/stories/foundations/signal-graph/signal-graph-fixtures.ts"
          ]
        },
        {
          "area": "playground",
          "count": 3,
          "files": [
            "apps/playground/src/lab/schemas/ui-switch.lab.ts",
            "apps/playground/src/signal-graph-demo.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Selection",
          "file": "apps/docs/src/stories/Selection.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [],
      "relatedDocs": [],
      "requiredTestLayers": [
        "unit",
        "e2e"
      ],
      "tags": [],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Selection.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/signal-graph/signal-graph-fixtures.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-switch.lab.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/signal-graph-demo.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-radio": {
      "id": "ui-radio",
      "title": "UiRadio",
      "exportName": "UiRadio",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Selection",
      "labEligible": false,
      "labExemptionReason": "UiRadio is tuned through UiRadioGroup because keyboard flow, field wiring, and disabled cascade only make sense in the grouped contract.",
      "sourcePublicSurface": "UiRadio",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Selection.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Selection.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Selection",
          "file": "apps/docs/src/stories/Selection.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "core-wave",
          "label": "Core Wave",
          "description": "Selection, disclosure, rich fields, menus, steps, display/data surfaces, and one composed consumer-style flow.",
          "path": "/testing#testing-core-wave"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "selection"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Selection.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-radio-group": {
      "id": "ui-radio-group",
      "title": "UiRadioGroup",
      "exportName": "UiRadioGroup",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Selection",
      "labEligible": false,
      "labExemptionReason": "UiRadioGroup is reviewed through Storybook and the playground proof harness because its value comes from roving focus and consumer composition rather than isolated visual tuning.",
      "sourcePublicSurface": "UiRadioGroup",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Selection.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Selection.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Selection",
          "file": "apps/docs/src/stories/Selection.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "core-wave",
          "label": "Core Wave",
          "description": "Selection, disclosure, rich fields, menus, steps, display/data surfaces, and one composed consumer-style flow.",
          "path": "/testing#testing-core-wave"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "selection"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Selection.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-badge": {
      "id": "ui-badge",
      "title": "UiBadge",
      "exportName": "UiBadge",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Display",
      "labEligible": true,
      "sourcePublicSurface": "UiBadge / UiCard / UiDivider / UiSpinner / UiSkeleton",
      "downstreamPackages": [
        {
          "packageName": "@ww/data-grid",
          "packageLayer": "system",
          "count": 1,
          "files": [
            "packages/data-grid/src/components/UiDataGridBulkActions.vue"
          ]
        },
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 26,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Display.stories.ts",
            "apps/docs/src/stories/Layout.stories.ts",
            "apps/docs/src/stories/architecture/DataTableWidgetOverview.stories.ts",
            "apps/docs/src/stories/architecture/Layering.stories.ts",
            "apps/docs/src/stories/architecture/PageTemplatesOverview.stories.ts",
            "apps/docs/src/stories/architecture/WidgetsOverview.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 20,
          "files": [
            "apps/playground/src/App.vue",
            "apps/playground/src/DataGridShowcase.vue",
            "apps/playground/src/DataTableWidgetShowcase.vue",
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/SignalGraphShowcase.vue",
            "apps/playground/src/TsParticlesShowcase.vue",
            "apps/playground/src/lab/components/DashboardLayoutLabPreview.vue",
            "apps/playground/src/lab/components/DataGridLabPreview.vue"
          ]
        },
        {
          "packageName": "@ww/widgets",
          "packageLayer": "widget",
          "count": 1,
          "files": [
            "packages/widgets/src/data/data-table-widget/components/DataTableWidgetStatus.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 26,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Display.stories.ts",
            "apps/docs/src/stories/Layout.stories.ts",
            "apps/docs/src/stories/architecture/DataTableWidgetOverview.stories.ts",
            "apps/docs/src/stories/architecture/Layering.stories.ts",
            "apps/docs/src/stories/architecture/PageTemplatesOverview.stories.ts",
            "apps/docs/src/stories/architecture/WidgetsOverview.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
            "apps/docs/src/stories/foundations/MotionOverview.stories.ts",
            "apps/docs/src/stories/foundations/OverlayLayers.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 20,
          "files": [
            "apps/playground/src/App.vue",
            "apps/playground/src/DataGridShowcase.vue",
            "apps/playground/src/DataTableWidgetShowcase.vue",
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/SignalGraphShowcase.vue",
            "apps/playground/src/TsParticlesShowcase.vue",
            "apps/playground/src/lab/components/DashboardLayoutLabPreview.vue",
            "apps/playground/src/lab/components/DataGridLabPreview.vue",
            "apps/playground/src/lab/components/DataTableWidgetLabPreview.vue",
            "apps/playground/src/lab/components/FlowLayoutLabPreview.vue"
          ]
        },
        {
          "area": "systems",
          "count": 1,
          "files": [
            "packages/data-grid/src/components/UiDataGridBulkActions.vue"
          ]
        },
        {
          "area": "widgets",
          "count": 1,
          "files": [
            "packages/widgets/src/data/data-table-widget/components/DataTableWidgetStatus.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Display",
          "file": "apps/docs/src/stories/Display.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [],
      "relatedDocs": [],
      "requiredTestLayers": [
        "unit",
        "e2e"
      ],
      "tags": [],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Display.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Layout.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/architecture/DataTableWidgetOverview.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/architecture/Layering.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/architecture/PageTemplatesOverview.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/architecture/WidgetsOverview.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/MotionOverview.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/OverlayLayers.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/ThemeSystemOverview.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/charts/Interactions.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/charts/ThemeType.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/particles/Overview.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/particles/Responsive.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/particles/States.stories.ts",
          "area": "docs"
        }
      ]
    },
    "ui-card": {
      "id": "ui-card",
      "title": "UiCard",
      "exportName": "UiCard",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Display",
      "labEligible": true,
      "sourcePublicSurface": "UiBadge / UiCard / UiDivider / UiSpinner / UiSkeleton",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 31,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Display.stories.ts",
            "apps/docs/src/stories/Layout.stories.ts",
            "apps/docs/src/stories/Navigation.stories.ts",
            "apps/docs/src/stories/architecture/DataTableWidgetOverview.stories.ts",
            "apps/docs/src/stories/architecture/Layering.stories.ts",
            "apps/docs/src/stories/architecture/PageTemplatesOverview.stories.ts",
            "apps/docs/src/stories/architecture/WidgetsOverview.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 13,
          "files": [
            "apps/playground/src/App.vue",
            "apps/playground/src/DataGridShowcase.vue",
            "apps/playground/src/DataTableWidgetShowcase.vue",
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/PlaygroundHomeView.vue",
            "apps/playground/src/SignalGraphShowcase.vue",
            "apps/playground/src/TsParticlesShowcase.vue",
            "apps/playground/src/lab/components/DashboardLayoutLabPreview.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 31,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Display.stories.ts",
            "apps/docs/src/stories/Layout.stories.ts",
            "apps/docs/src/stories/Navigation.stories.ts",
            "apps/docs/src/stories/architecture/DataTableWidgetOverview.stories.ts",
            "apps/docs/src/stories/architecture/Layering.stories.ts",
            "apps/docs/src/stories/architecture/PageTemplatesOverview.stories.ts",
            "apps/docs/src/stories/architecture/WidgetsOverview.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
            "apps/docs/src/stories/foundations/MotionOverview.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 13,
          "files": [
            "apps/playground/src/App.vue",
            "apps/playground/src/DataGridShowcase.vue",
            "apps/playground/src/DataTableWidgetShowcase.vue",
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/PlaygroundHomeView.vue",
            "apps/playground/src/SignalGraphShowcase.vue",
            "apps/playground/src/TsParticlesShowcase.vue",
            "apps/playground/src/lab/components/DashboardLayoutLabPreview.vue",
            "apps/playground/src/lab/schemas/ui-card.lab.ts",
            "apps/playground/src/lab/schemas/ui-dashboard-layout.lab.ts"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Display",
          "file": "apps/docs/src/stories/Display.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [],
      "relatedDocs": [],
      "requiredTestLayers": [
        "unit",
        "e2e"
      ],
      "tags": [],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Display.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Layout.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Navigation.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/architecture/DataTableWidgetOverview.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/architecture/Layering.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/architecture/PageTemplatesOverview.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/architecture/WidgetsOverview.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/MotionOverview.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/OverlayLayers.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/ThemeSystemOverview.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/charts/ApexOverview.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/charts/Interactions.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/charts/Responsive.stories.ts",
          "area": "docs"
        }
      ]
    },
    "ui-tag": {
      "id": "ui-tag",
      "title": "UiTag",
      "exportName": "UiTag",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Display",
      "labEligible": true,
      "sourcePublicSurface": "UiTag",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 4,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Display.stories.ts",
            "apps/docs/src/stories/Layout.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/playground/src/lab/schemas/ui-tag.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessLayoutUtilitiesCard.vue",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 4,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Display.stories.ts",
            "apps/docs/src/stories/Layout.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 3,
          "files": [
            "apps/playground/src/lab/schemas/ui-tag.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessLayoutUtilitiesCard.vue",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Display",
          "file": "apps/docs/src/stories/Display.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "core-wave",
          "label": "Core Wave",
          "description": "Selection, disclosure, rich fields, menus, steps, display/data surfaces, and one composed consumer-style flow.",
          "path": "/testing#testing-core-wave"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "display"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Display.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Layout.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-tag.lab.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessLayoutUtilitiesCard.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-avatar": {
      "id": "ui-avatar",
      "title": "UiAvatar",
      "exportName": "UiAvatar",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Display",
      "labEligible": true,
      "sourcePublicSurface": "UiAvatar / UiAvatarGroup / UiProgress / UiTable",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Display.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 4,
          "files": [
            "apps/playground/src/App.vue",
            "apps/playground/src/PlaygroundHomeView.vue",
            "apps/playground/src/lab/schemas/ui-avatar.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Display.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 4,
          "files": [
            "apps/playground/src/App.vue",
            "apps/playground/src/PlaygroundHomeView.vue",
            "apps/playground/src/lab/schemas/ui-avatar.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Display",
          "file": "apps/docs/src/stories/Display.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "core-wave",
          "label": "Core Wave",
          "description": "Selection, disclosure, rich fields, menus, steps, display/data surfaces, and one composed consumer-style flow.",
          "path": "/testing#testing-core-wave"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "display",
        "data"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Display.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/App.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/PlaygroundHomeView.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-avatar.lab.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-avatar-group": {
      "id": "ui-avatar-group",
      "title": "UiAvatarGroup",
      "exportName": "UiAvatarGroup",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Display",
      "labEligible": false,
      "labExemptionReason": "UiAvatarGroup is reviewed in stories and the consumer harness because overlap, surplus, and group context only make sense as a composed surface.",
      "sourcePublicSurface": "UiAvatar / UiAvatarGroup / UiProgress / UiTable",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Display.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Display.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Display",
          "file": "apps/docs/src/stories/Display.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "core-wave",
          "label": "Core Wave",
          "description": "Selection, disclosure, rich fields, menus, steps, display/data surfaces, and one composed consumer-style flow.",
          "path": "/testing#testing-core-wave"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "display",
        "data"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Display.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-image": {
      "id": "ui-image",
      "title": "UiImage",
      "exportName": "UiImage",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Display",
      "labEligible": true,
      "sourcePublicSurface": "UiImage",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Display.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 2,
          "files": [
            "apps/playground/src/lab/schemas/ui-image.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Display.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 2,
          "files": [
            "apps/playground/src/lab/schemas/ui-image.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Display",
          "file": "apps/docs/src/stories/Display.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "core-wave",
          "label": "Core Wave",
          "description": "Selection, disclosure, rich fields, menus, steps, display/data surfaces, and one composed consumer-style flow.",
          "path": "/testing#testing-core-wave"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "display",
        "image"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Display.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-image.lab.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-progress": {
      "id": "ui-progress",
      "title": "UiProgress",
      "exportName": "UiProgress",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Feedback",
      "labEligible": true,
      "sourcePublicSurface": "UiAvatar / UiAvatarGroup / UiProgress / UiTable",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Display.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 2,
          "files": [
            "apps/playground/src/lab/schemas/ui-progress.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Display.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 2,
          "files": [
            "apps/playground/src/lab/schemas/ui-progress.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Display",
          "file": "apps/docs/src/stories/Display.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "core-wave",
          "label": "Core Wave",
          "description": "Selection, disclosure, rich fields, menus, steps, display/data surfaces, and one composed consumer-style flow.",
          "path": "/testing#testing-core-wave"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "display",
        "data"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Display.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-progress.lab.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-table": {
      "id": "ui-table",
      "title": "UiTable",
      "exportName": "UiTable",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Display",
      "labEligible": false,
      "labExemptionReason": "UiTable is reviewed through Storybook and the playground harness because semantic markup, cell slots, and scroll framing matter more in realistic data compositions than in an isolated tuning pane.",
      "sourcePublicSurface": "UiAvatar / UiAvatarGroup / UiProgress / UiTable",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Display.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Display.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Display",
          "file": "apps/docs/src/stories/Display.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "core-wave",
          "label": "Core Wave",
          "description": "Selection, disclosure, rich fields, menus, steps, display/data surfaces, and one composed consumer-style flow.",
          "path": "/testing#testing-core-wave"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "display",
        "data"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Display.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-divider": {
      "id": "ui-divider",
      "title": "UiDivider",
      "exportName": "UiDivider",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Display",
      "labEligible": false,
      "labExemptionReason": "UiDivider is intentionally minimal and is reviewed inside higher-order display surfaces instead of receiving a dedicated maintainer workbench tab.",
      "sourcePublicSurface": "UiBadge / UiCard / UiDivider / UiSpinner / UiSkeleton",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 2,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Display.stories.ts"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 2,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Display.stories.ts"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Display",
          "file": "apps/docs/src/stories/Display.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [],
      "relatedDocs": [],
      "requiredTestLayers": [
        "unit",
        "e2e"
      ],
      "tags": [],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Display.stories.ts",
          "area": "docs"
        }
      ]
    },
    "ui-spinner": {
      "id": "ui-spinner",
      "title": "UiSpinner",
      "exportName": "UiSpinner",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Feedback",
      "labEligible": false,
      "labExemptionReason": "UiSpinner is a micro-state primitive with low standalone tuning value; it is reviewed in story states and in system/widget loading flows.",
      "sourcePublicSurface": "UiBadge / UiCard / UiDivider / UiSpinner / UiSkeleton",
      "downstreamPackages": [
        {
          "packageName": "@ww/data-grid",
          "packageLayer": "system",
          "count": 1,
          "files": [
            "packages/data-grid/src/components/UiDataGrid.vue"
          ]
        },
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 2,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Display.stories.ts"
          ]
        },
        {
          "packageName": "@ww/widgets",
          "packageLayer": "widget",
          "count": 2,
          "files": [
            "packages/widgets/src/data/data-table-widget/components/DataTableWidget.vue",
            "packages/widgets/src/shells/UiWidgetShell.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 2,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Display.stories.ts"
          ]
        },
        {
          "area": "systems",
          "count": 1,
          "files": [
            "packages/data-grid/src/components/UiDataGrid.vue"
          ]
        },
        {
          "area": "widgets",
          "count": 2,
          "files": [
            "packages/widgets/src/data/data-table-widget/components/DataTableWidget.vue",
            "packages/widgets/src/shells/UiWidgetShell.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Display",
          "file": "apps/docs/src/stories/Display.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [],
      "relatedDocs": [],
      "requiredTestLayers": [
        "unit",
        "e2e"
      ],
      "tags": [],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Display.stories.ts",
          "area": "docs"
        },
        {
          "file": "packages/data-grid/src/components/UiDataGrid.vue",
          "area": "systems"
        },
        {
          "file": "packages/widgets/src/data/data-table-widget/components/DataTableWidget.vue",
          "area": "widgets"
        },
        {
          "file": "packages/widgets/src/shells/UiWidgetShell.vue",
          "area": "widgets"
        }
      ]
    },
    "ui-skeleton": {
      "id": "ui-skeleton",
      "title": "UiSkeleton",
      "exportName": "UiSkeleton",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Feedback",
      "labEligible": false,
      "labExemptionReason": "UiSkeleton is a micro-state primitive with low standalone tuning value; it is reviewed in story states and complex loading surfaces.",
      "sourcePublicSurface": "UiBadge / UiCard / UiDivider / UiSpinner / UiSkeleton",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 2,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Display.stories.ts"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 2,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Display.stories.ts"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Display",
          "file": "apps/docs/src/stories/Display.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [],
      "relatedDocs": [],
      "requiredTestLayers": [
        "unit",
        "e2e"
      ],
      "tags": [],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Display.stories.ts",
          "area": "docs"
        }
      ]
    },
    "ui-empty-state": {
      "id": "ui-empty-state",
      "title": "UiEmptyState",
      "exportName": "UiEmptyState",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Feedback",
      "labEligible": true,
      "sourcePublicSurface": "UiEmptyState",
      "downstreamPackages": [
        {
          "packageName": "@ww/data-grid",
          "packageLayer": "system",
          "count": 1,
          "files": [
            "packages/data-grid/src/components/UiDataGrid.vue"
          ]
        },
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Feedback.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/playground/src/lab/schemas/ui-empty-state.lab.ts"
          ]
        },
        {
          "packageName": "@ww/widgets",
          "packageLayer": "widget",
          "count": 2,
          "files": [
            "packages/widgets/src/data/data-table-widget/components/DataTableWidget.vue",
            "packages/widgets/src/shells/UiWidgetShell.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Feedback.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 1,
          "files": [
            "apps/playground/src/lab/schemas/ui-empty-state.lab.ts"
          ]
        },
        {
          "area": "systems",
          "count": 1,
          "files": [
            "packages/data-grid/src/components/UiDataGrid.vue"
          ]
        },
        {
          "area": "widgets",
          "count": 2,
          "files": [
            "packages/widgets/src/data/data-table-widget/components/DataTableWidget.vue",
            "packages/widgets/src/shells/UiWidgetShell.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Feedback",
          "file": "apps/docs/src/stories/Feedback.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [],
      "relatedDocs": [],
      "requiredTestLayers": [
        "unit",
        "e2e"
      ],
      "tags": [],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Feedback.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-empty-state.lab.ts",
          "area": "playground"
        },
        {
          "file": "packages/data-grid/src/components/UiDataGrid.vue",
          "area": "systems"
        },
        {
          "file": "packages/widgets/src/data/data-table-widget/components/DataTableWidget.vue",
          "area": "widgets"
        },
        {
          "file": "packages/widgets/src/shells/UiWidgetShell.vue",
          "area": "widgets"
        }
      ]
    },
    "ui-alert": {
      "id": "ui-alert",
      "title": "UiAlert",
      "exportName": "UiAlert",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Feedback",
      "labEligible": true,
      "sourcePublicSurface": "UiAlert",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Feedback.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 2,
          "files": [
            "apps/playground/src/lab/schemas/ui-alert.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Feedback.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 2,
          "files": [
            "apps/playground/src/lab/schemas/ui-alert.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Feedback",
          "file": "apps/docs/src/stories/Feedback.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "core-wave",
          "label": "Core Wave",
          "description": "Selection, disclosure, rich fields, menus, steps, display/data surfaces, and one composed consumer-style flow.",
          "path": "/testing#testing-core-wave"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "feedback"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Feedback.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-alert.lab.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-dialog": {
      "id": "ui-dialog",
      "title": "UiDialog",
      "exportName": "UiDialog",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Overlays",
      "labEligible": true,
      "sourcePublicSurface": "UiDialog / UiDrawer",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 7,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Overlay.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
            "apps/docs/src/stories/foundations/OverlayLayers.stories.ts",
            "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts",
            "apps/docs/src/stories/foundations/ThemeSystemOverview.stories.ts",
            "apps/docs/src/stories/foundations/signal-graph/signal-graph-fixtures.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/playground/src/lab/schemas/ui-dialog.lab.ts",
            "apps/playground/src/signal-graph-demo.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 7,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Overlay.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
            "apps/docs/src/stories/foundations/OverlayLayers.stories.ts",
            "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts",
            "apps/docs/src/stories/foundations/ThemeSystemOverview.stories.ts",
            "apps/docs/src/stories/foundations/signal-graph/signal-graph-fixtures.ts"
          ]
        },
        {
          "area": "playground",
          "count": 3,
          "files": [
            "apps/playground/src/lab/schemas/ui-dialog.lab.ts",
            "apps/playground/src/signal-graph-demo.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Overlay",
          "file": "apps/docs/src/stories/Overlay.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Theme Scoped Overlay",
          "file": "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts"
        },
        {
          "variant": "interactions",
          "title": "Foundations/Overlay Layers",
          "file": "apps/docs/src/stories/foundations/OverlayLayers.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "overlays",
          "label": "Overlays",
          "description": "Motion, layer slots, floating overlays, toasts, dialogs, drawers, and focus restore.",
          "path": "/testing#testing-overlays"
        },
        {
          "id": "composition",
          "label": "Composition",
          "description": "Consumer-proof multi-layer flows composed from layout shells, widgets, systems, and core.",
          "path": "/testing#testing-composition"
        }
      ],
      "relatedDocs": [],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Overlay.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/OverlayLayers.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/ThemeSystemOverview.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/signal-graph/signal-graph-fixtures.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-dialog.lab.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/signal-graph-demo.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-drawer": {
      "id": "ui-drawer",
      "title": "UiDrawer",
      "exportName": "UiDrawer",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Overlays",
      "labEligible": true,
      "sourcePublicSurface": "UiDialog / UiDrawer",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 7,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Overlay.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
            "apps/docs/src/stories/foundations/OverlayLayers.stories.ts",
            "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts",
            "apps/docs/src/stories/foundations/ThemeSystemOverview.stories.ts",
            "apps/docs/src/stories/foundations/signal-graph/signal-graph-fixtures.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/playground/src/lab/schemas/ui-drawer.lab.ts",
            "apps/playground/src/signal-graph-demo.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 7,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Overlay.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
            "apps/docs/src/stories/foundations/OverlayLayers.stories.ts",
            "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts",
            "apps/docs/src/stories/foundations/ThemeSystemOverview.stories.ts",
            "apps/docs/src/stories/foundations/signal-graph/signal-graph-fixtures.ts"
          ]
        },
        {
          "area": "playground",
          "count": 3,
          "files": [
            "apps/playground/src/lab/schemas/ui-drawer.lab.ts",
            "apps/playground/src/signal-graph-demo.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Overlay",
          "file": "apps/docs/src/stories/Overlay.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Theme Scoped Overlay",
          "file": "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts"
        },
        {
          "variant": "interactions",
          "title": "Foundations/Overlay Layers",
          "file": "apps/docs/src/stories/foundations/OverlayLayers.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "overlays",
          "label": "Overlays",
          "description": "Motion, layer slots, floating overlays, toasts, dialogs, drawers, and focus restore.",
          "path": "/testing#testing-overlays"
        },
        {
          "id": "composition",
          "label": "Composition",
          "description": "Consumer-proof multi-layer flows composed from layout shells, widgets, systems, and core.",
          "path": "/testing#testing-composition"
        }
      ],
      "relatedDocs": [],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Overlay.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/OverlayLayers.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/ThemeSystemOverview.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/signal-graph/signal-graph-fixtures.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-drawer.lab.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/signal-graph-demo.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-tooltip": {
      "id": "ui-tooltip",
      "title": "UiTooltip",
      "exportName": "UiTooltip",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Overlays",
      "labEligible": true,
      "sourcePublicSurface": "UiTooltip",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 5,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Overlay.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
            "apps/docs/src/stories/foundations/OverlayLayers.stories.ts",
            "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 2,
          "files": [
            "apps/playground/src/lab/schemas/ui-tooltip.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 5,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Overlay.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
            "apps/docs/src/stories/foundations/OverlayLayers.stories.ts",
            "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 2,
          "files": [
            "apps/playground/src/lab/schemas/ui-tooltip.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Overlay",
          "file": "apps/docs/src/stories/Overlay.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Theme Scoped Overlay",
          "file": "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts"
        },
        {
          "variant": "interactions",
          "title": "Foundations/Overlay Layers",
          "file": "apps/docs/src/stories/foundations/OverlayLayers.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "overlays",
          "label": "Overlays",
          "description": "Motion, layer slots, floating overlays, toasts, dialogs, drawers, and focus restore.",
          "path": "/testing#testing-overlays"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "overlay",
        "floating"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Overlay.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/OverlayLayers.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-tooltip.lab.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-popover": {
      "id": "ui-popover",
      "title": "UiPopover",
      "exportName": "UiPopover",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Overlays",
      "labEligible": true,
      "sourcePublicSurface": "UiPopover",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 5,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Overlay.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
            "apps/docs/src/stories/foundations/OverlayLayers.stories.ts",
            "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 2,
          "files": [
            "apps/playground/src/lab/schemas/ui-popover.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 5,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Overlay.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
            "apps/docs/src/stories/foundations/OverlayLayers.stories.ts",
            "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 2,
          "files": [
            "apps/playground/src/lab/schemas/ui-popover.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Overlay",
          "file": "apps/docs/src/stories/Overlay.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Theme Scoped Overlay",
          "file": "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts"
        },
        {
          "variant": "interactions",
          "title": "Foundations/Overlay Layers",
          "file": "apps/docs/src/stories/foundations/OverlayLayers.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "overlays",
          "label": "Overlays",
          "description": "Motion, layer slots, floating overlays, toasts, dialogs, drawers, and focus restore.",
          "path": "/testing#testing-overlays"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "overlay",
        "floating"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Overlay.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/OverlayLayers.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-popover.lab.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-popconfirm": {
      "id": "ui-popconfirm",
      "title": "UiPopconfirm",
      "exportName": "UiPopconfirm",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Overlays",
      "labEligible": false,
      "labExemptionReason": "UiPopconfirm is reviewed through Storybook and the overlay harness because its value is explicit confirmation flow, focus restore, and dismiss behavior rather than broad visual matrix tuning.",
      "sourcePublicSurface": "UiPopconfirm",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 4,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Overlay.stories.ts",
            "apps/docs/src/stories/foundations/OverlayLayers.stories.ts",
            "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 4,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Overlay.stories.ts",
            "apps/docs/src/stories/foundations/OverlayLayers.stories.ts",
            "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Overlay",
          "file": "apps/docs/src/stories/Overlay.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Theme Scoped Overlay",
          "file": "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts"
        },
        {
          "variant": "interactions",
          "title": "Foundations/Overlay Layers",
          "file": "apps/docs/src/stories/foundations/OverlayLayers.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "overlays",
          "label": "Overlays",
          "description": "Motion, layer slots, floating overlays, toasts, dialogs, drawers, and focus restore.",
          "path": "/testing#testing-overlays"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "overlay",
        "confirmation"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Overlay.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/OverlayLayers.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-dropdown": {
      "id": "ui-dropdown",
      "title": "UiDropdown",
      "exportName": "UiDropdown",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Overlays",
      "labEligible": true,
      "sourcePublicSurface": "UiDropdown",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 5,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Overlay.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
            "apps/docs/src/stories/foundations/OverlayLayers.stories.ts",
            "apps/docs/src/stories/page-templates/DashboardLayout.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 7,
          "files": [
            "apps/playground/src/App.vue",
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/PlaygroundHomeView.vue",
            "apps/playground/src/lab/components/DashboardLayoutLabPreview.vue",
            "apps/playground/src/lab/schemas/ui-dashboard-layout.lab.ts",
            "apps/playground/src/lab/schemas/ui-dropdown.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 5,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Overlay.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
            "apps/docs/src/stories/foundations/OverlayLayers.stories.ts",
            "apps/docs/src/stories/page-templates/DashboardLayout.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 7,
          "files": [
            "apps/playground/src/App.vue",
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/PlaygroundHomeView.vue",
            "apps/playground/src/lab/components/DashboardLayoutLabPreview.vue",
            "apps/playground/src/lab/schemas/ui-dashboard-layout.lab.ts",
            "apps/playground/src/lab/schemas/ui-dropdown.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Overlay",
          "file": "apps/docs/src/stories/Overlay.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Theme Scoped Overlay",
          "file": "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts"
        },
        {
          "variant": "interactions",
          "title": "Foundations/Overlay Layers",
          "file": "apps/docs/src/stories/foundations/OverlayLayers.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "overlays",
          "label": "Overlays",
          "description": "Motion, layer slots, floating overlays, toasts, dialogs, drawers, and focus restore.",
          "path": "/testing#testing-overlays"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "overlay",
        "menu"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Overlay.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/OverlayLayers.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/page-templates/DashboardLayout.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/App.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/LayerScaffoldShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/PlaygroundHomeView.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/components/DashboardLayoutLabPreview.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-dashboard-layout.lab.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-dropdown.lab.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-context-menu": {
      "id": "ui-context-menu",
      "title": "UiContextMenu",
      "exportName": "UiContextMenu",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Overlays",
      "labEligible": false,
      "labExemptionReason": "UiContextMenu is reviewed through Storybook and the overlay harness because pointer anchoring, keyboard invocation, and focus return are interaction contracts rather than static workbench knobs.",
      "sourcePublicSurface": "UiContextMenu",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 4,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Overlay.stories.ts",
            "apps/docs/src/stories/foundations/OverlayLayers.stories.ts",
            "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 4,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Overlay.stories.ts",
            "apps/docs/src/stories/foundations/OverlayLayers.stories.ts",
            "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Overlay",
          "file": "apps/docs/src/stories/Overlay.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Theme Scoped Overlay",
          "file": "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts"
        },
        {
          "variant": "interactions",
          "title": "Foundations/Overlay Layers",
          "file": "apps/docs/src/stories/foundations/OverlayLayers.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "overlays",
          "label": "Overlays",
          "description": "Motion, layer slots, floating overlays, toasts, dialogs, drawers, and focus restore.",
          "path": "/testing#testing-overlays"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "overlay",
        "menu"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Overlay.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/OverlayLayers.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-toast": {
      "id": "ui-toast",
      "title": "UiToast",
      "exportName": "UiToast",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Overlays",
      "labEligible": false,
      "labExemptionReason": "UiToast is an imperative stack runtime, so it is proven through the overlay harness and unit tests instead of a static workbench surface.",
      "sourcePublicSurface": "UiToast",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 4,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Overlay.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
            "apps/docs/src/stories/foundations/OverlayLayers.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 4,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Overlay.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
            "apps/docs/src/stories/foundations/OverlayLayers.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Overlay",
          "file": "apps/docs/src/stories/Overlay.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Theme Scoped Overlay",
          "file": "apps/docs/src/stories/foundations/ThemeScopedOverlay.stories.ts"
        },
        {
          "variant": "interactions",
          "title": "Foundations/Overlay Layers",
          "file": "apps/docs/src/stories/foundations/OverlayLayers.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "overlays",
          "label": "Overlays",
          "description": "Motion, layer slots, floating overlays, toasts, dialogs, drawers, and focus restore.",
          "path": "/testing#testing-overlays"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "overlay",
        "toast"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Overlay.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/OverlayLayers.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-tabs-root": {
      "id": "ui-tabs-root",
      "title": "UiTabs",
      "exportName": "UiTabsRoot",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Navigation",
      "labEligible": true,
      "sourcePublicSurface": "UiTabsRoot / UiTabsList / UiTabsTrigger / UiTabsPanel",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Tabs.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 2,
          "files": [
            "apps/playground/src/lab/components/TabsSurfaceLabPreview.vue",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Tabs.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 2,
          "files": [
            "apps/playground/src/lab/components/TabsSurfaceLabPreview.vue",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Tabs",
          "file": "apps/docs/src/stories/Tabs.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [],
      "relatedDocs": [],
      "requiredTestLayers": [
        "unit",
        "e2e"
      ],
      "tags": [],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Tabs.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/lab/components/TabsSurfaceLabPreview.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-tabs-list": {
      "id": "ui-tabs-list",
      "title": "UiTabsList",
      "exportName": "UiTabsList",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Navigation",
      "labEligible": false,
      "labExemptionReason": "UiTabsList is tuned through the UiTabs composite entry because list, triggers, and panels are only meaningful together.",
      "sourcePublicSurface": "UiTabsRoot / UiTabsList / UiTabsTrigger / UiTabsPanel",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Tabs.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/playground/src/lab/components/TabsSurfaceLabPreview.vue",
            "apps/playground/src/lab/schemas/ui-tabs-root.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Tabs.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 3,
          "files": [
            "apps/playground/src/lab/components/TabsSurfaceLabPreview.vue",
            "apps/playground/src/lab/schemas/ui-tabs-root.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Tabs",
          "file": "apps/docs/src/stories/Tabs.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [],
      "relatedDocs": [],
      "requiredTestLayers": [
        "unit",
        "e2e"
      ],
      "tags": [],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Tabs.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/lab/components/TabsSurfaceLabPreview.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-tabs-root.lab.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-tabs-trigger": {
      "id": "ui-tabs-trigger",
      "title": "UiTabsTrigger",
      "exportName": "UiTabsTrigger",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Navigation",
      "labEligible": false,
      "labExemptionReason": "UiTabsTrigger is tuned through the UiTabs composite entry because list, triggers, and panels are only meaningful together.",
      "sourcePublicSurface": "UiTabsRoot / UiTabsList / UiTabsTrigger / UiTabsPanel",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Tabs.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/playground/src/lab/components/TabsSurfaceLabPreview.vue",
            "apps/playground/src/lab/schemas/ui-tabs-root.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Tabs.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 3,
          "files": [
            "apps/playground/src/lab/components/TabsSurfaceLabPreview.vue",
            "apps/playground/src/lab/schemas/ui-tabs-root.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Tabs",
          "file": "apps/docs/src/stories/Tabs.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [],
      "relatedDocs": [],
      "requiredTestLayers": [
        "unit",
        "e2e"
      ],
      "tags": [],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Tabs.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/lab/components/TabsSurfaceLabPreview.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-tabs-root.lab.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-tabs-panel": {
      "id": "ui-tabs-panel",
      "title": "UiTabsPanel",
      "exportName": "UiTabsPanel",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Navigation",
      "labEligible": false,
      "labExemptionReason": "UiTabsPanel is tuned through the UiTabs composite entry because list, triggers, and panels are only meaningful together.",
      "sourcePublicSurface": "UiTabsRoot / UiTabsList / UiTabsTrigger / UiTabsPanel",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Tabs.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/playground/src/lab/components/TabsSurfaceLabPreview.vue",
            "apps/playground/src/lab/schemas/ui-tabs-root.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Tabs.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 3,
          "files": [
            "apps/playground/src/lab/components/TabsSurfaceLabPreview.vue",
            "apps/playground/src/lab/schemas/ui-tabs-root.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Tabs",
          "file": "apps/docs/src/stories/Tabs.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [],
      "relatedDocs": [],
      "requiredTestLayers": [
        "unit",
        "e2e"
      ],
      "tags": [],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Tabs.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/lab/components/TabsSurfaceLabPreview.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-tabs-root.lab.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-collapse": {
      "id": "ui-collapse",
      "title": "UiCollapse",
      "exportName": "UiCollapse",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Disclosure",
      "labEligible": false,
      "labExemptionReason": "UiCollapse is reviewed through Storybook and the playground harness because the motion and keyboard contract only makes sense with composed panels.",
      "sourcePublicSurface": "UiCollapse",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Feedback.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Feedback.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Feedback",
          "file": "apps/docs/src/stories/Feedback.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "core-wave",
          "label": "Core Wave",
          "description": "Selection, disclosure, rich fields, menus, steps, display/data surfaces, and one composed consumer-style flow.",
          "path": "/testing#testing-core-wave"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "disclosure"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Feedback.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-collapse-panel": {
      "id": "ui-collapse-panel",
      "title": "UiCollapsePanel",
      "exportName": "UiCollapsePanel",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Disclosure",
      "labEligible": false,
      "labExemptionReason": "UiCollapsePanel is tuned through UiCollapse because headers, regions, and roving header focus are not standalone surfaces.",
      "sourcePublicSurface": "UiCollapsePanel",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Feedback.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Feedback.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Feedback",
          "file": "apps/docs/src/stories/Feedback.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "core-wave",
          "label": "Core Wave",
          "description": "Selection, disclosure, rich fields, menus, steps, display/data surfaces, and one composed consumer-style flow.",
          "path": "/testing#testing-core-wave"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "disclosure"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Feedback.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-breadcrumb": {
      "id": "ui-breadcrumb",
      "title": "UiBreadcrumb",
      "exportName": "UiBreadcrumb",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Navigation",
      "labEligible": false,
      "labExemptionReason": "UiBreadcrumb is item-array driven and is better reviewed in story and consumer harness contexts than in an isolated tuning matrix.",
      "sourcePublicSurface": "UiBreadcrumb",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Navigation.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Navigation.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Navigation",
          "file": "apps/docs/src/stories/Navigation.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "core-wave",
          "label": "Core Wave",
          "description": "Selection, disclosure, rich fields, menus, steps, display/data surfaces, and one composed consumer-style flow.",
          "path": "/testing#testing-core-wave"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "navigation"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Navigation.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-anchor": {
      "id": "ui-anchor",
      "title": "UiAnchor",
      "exportName": "UiAnchor",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Navigation",
      "labEligible": false,
      "labExemptionReason": "UiAnchor is reviewed through Storybook and the playground harness because active-section tracking depends on live scroll containers and linked content.",
      "sourcePublicSurface": "UiAffix / UiScrollArea / UiScrollTop / UiAnchor",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Navigation.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessCoreAnchorProof.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Navigation.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessCoreAnchorProof.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Layout",
          "file": "apps/docs/src/stories/Layout.stories.ts"
        },
        {
          "variant": "overview",
          "title": "Core/Navigation",
          "file": "apps/docs/src/stories/Navigation.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "core-wave",
          "label": "Core Wave",
          "description": "Selection, disclosure, rich fields, menus, steps, display/data surfaces, and one composed consumer-style flow.",
          "path": "/testing#testing-core-wave"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "layout",
        "scroll",
        "navigation"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Navigation.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessCoreAnchorProof.vue",
          "area": "playground"
        }
      ]
    },
    "ui-pagination": {
      "id": "ui-pagination",
      "title": "UiPagination",
      "exportName": "UiPagination",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Navigation",
      "labEligible": false,
      "labExemptionReason": "UiPagination is a controlled navigation surface, so current-page semantics and interaction regressions are proven in Storybook and the playground harness instead of the lab.",
      "sourcePublicSurface": "UiPagination",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Navigation.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Navigation.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Navigation",
          "file": "apps/docs/src/stories/Navigation.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "core-wave",
          "label": "Core Wave",
          "description": "Selection, disclosure, rich fields, menus, steps, display/data surfaces, and one composed consumer-style flow.",
          "path": "/testing#testing-core-wave"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "navigation"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Navigation.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-menu": {
      "id": "ui-menu",
      "title": "UiMenu",
      "exportName": "UiMenu",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Navigation",
      "labEligible": false,
      "labExemptionReason": "UiMenu is reviewed through Storybook and the consumer harness because roving focus, typeahead, grouped items, and selection semantics are interaction-heavy rather than matrix-tunable.",
      "sourcePublicSurface": "UiMenu / UiSteps",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Navigation.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Navigation.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Navigation",
          "file": "apps/docs/src/stories/Navigation.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "core-wave",
          "label": "Core Wave",
          "description": "Selection, disclosure, rich fields, menus, steps, display/data surfaces, and one composed consumer-style flow.",
          "path": "/testing#testing-core-wave"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "navigation",
        "menu",
        "steps"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Navigation.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-steps": {
      "id": "ui-steps",
      "title": "UiSteps",
      "exportName": "UiSteps",
      "packageName": "@ww/core",
      "packageLayer": "core",
      "stability": "stable",
      "family": "Navigation",
      "labEligible": false,
      "labExemptionReason": "UiSteps is reviewed through Storybook and the consumer harness because current-step semantics and controlled click behavior are more important than isolated visual tuning.",
      "sourcePublicSurface": "UiMenu / UiSteps",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Navigation.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/CoreShowcase.stories.ts",
            "apps/docs/src/stories/Navigation.stories.ts",
            "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 1,
          "files": [
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Core/Navigation",
          "file": "apps/docs/src/stories/Navigation.stories.ts"
        },
        {
          "variant": "states",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Belovodye Theme",
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "core-wave",
          "label": "Core Wave",
          "description": "Selection, disclosure, rich fields, menus, steps, display/data surfaces, and one composed consumer-style flow.",
          "path": "/testing#testing-core-wave"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/core/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "navigation",
        "menu",
        "steps"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/Navigation.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/BelovodyeTheme.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-apex-chart": {
      "id": "ui-apex-chart",
      "title": "UiApexChart",
      "exportName": "UiApexChart",
      "packageName": "@ww/charts-apex",
      "packageLayer": "third-party-adapter",
      "stability": "incubating",
      "family": "Third-party adapters",
      "labEligible": true,
      "sourcePublicSurface": "UiApexChart",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 6,
          "files": [
            "apps/docs/src/stories/foundations/charts/ApexOverview.stories.ts",
            "apps/docs/src/stories/foundations/charts/Interactions.stories.ts",
            "apps/docs/src/stories/foundations/charts/Responsive.stories.ts",
            "apps/docs/src/stories/foundations/charts/States.stories.ts",
            "apps/docs/src/stories/foundations/charts/ThemeType.stories.ts",
            "apps/docs/src/stories/foundations/charts/Theming.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/playground/src/lab/components/ChartSurfaceLabPreview.vue",
            "apps/playground/src/lab/schemas/ui-apex-chart.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 6,
          "files": [
            "apps/docs/src/stories/foundations/charts/ApexOverview.stories.ts",
            "apps/docs/src/stories/foundations/charts/Interactions.stories.ts",
            "apps/docs/src/stories/foundations/charts/Responsive.stories.ts",
            "apps/docs/src/stories/foundations/charts/States.stories.ts",
            "apps/docs/src/stories/foundations/charts/ThemeType.stories.ts",
            "apps/docs/src/stories/foundations/charts/Theming.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 3,
          "files": [
            "apps/playground/src/lab/components/ChartSurfaceLabPreview.vue",
            "apps/playground/src/lab/schemas/ui-apex-chart.lab.ts",
            "apps/playground/src/testing/routes/TestingHarnessView.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Foundations/Charts/Apex Overview",
          "file": "apps/docs/src/stories/foundations/charts/ApexOverview.stories.ts"
        },
        {
          "variant": "states",
          "title": "Foundations/Charts/States",
          "file": "apps/docs/src/stories/foundations/charts/States.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Charts/Theming",
          "file": "apps/docs/src/stories/foundations/charts/Theming.stories.ts"
        },
        {
          "variant": "responsive",
          "title": "Foundations/Charts/Responsive",
          "file": "apps/docs/src/stories/foundations/charts/Responsive.stories.ts"
        },
        {
          "variant": "interactions",
          "title": "Foundations/Charts/Interactions",
          "file": "apps/docs/src/stories/foundations/charts/Interactions.stories.ts"
        },
        {
          "variant": "theme-type",
          "title": "Foundations/Charts/ThemeType",
          "file": "apps/docs/src/stories/foundations/charts/ThemeType.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "charts",
          "label": "Charts",
          "description": "Vendor-backed chart adapter inside the shared theme and motion model.",
          "path": "/testing#testing-charts"
        },
        {
          "id": "composition",
          "label": "Composition",
          "description": "Consumer-proof multi-layer flows composed from layout shells, widgets, systems, and core.",
          "path": "/testing#testing-composition"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/third-party/charts-apex/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "third-party",
        "charts"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/foundations/charts/ApexOverview.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/charts/Interactions.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/charts/Responsive.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/charts/States.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/charts/ThemeType.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/charts/Theming.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/lab/components/ChartSurfaceLabPreview.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-apex-chart.lab.ts",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/testing/routes/TestingHarnessView.vue",
          "area": "playground"
        }
      ]
    },
    "ui-tsparticles-backdrop": {
      "id": "ui-tsparticles-backdrop",
      "title": "UiTsParticlesBackdrop",
      "exportName": "UiTsParticlesBackdrop",
      "packageName": "@ww/tsparticles",
      "packageLayer": "third-party-adapter",
      "stability": "incubating",
      "family": "Third-party adapters",
      "labEligible": true,
      "sourcePublicSurface": "UiTsParticlesBackdrop",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 4,
          "files": [
            "apps/docs/src/stories/foundations/particles/Overview.stories.ts",
            "apps/docs/src/stories/foundations/particles/Responsive.stories.ts",
            "apps/docs/src/stories/foundations/particles/States.stories.ts",
            "apps/docs/src/stories/foundations/particles/Theming.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 4,
          "files": [
            "apps/playground/src/App.vue",
            "apps/playground/src/PlaygroundHomeView.vue",
            "apps/playground/src/TsParticlesShowcase.vue",
            "apps/playground/src/lab/components/TsParticlesBackdropLabPreview.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 4,
          "files": [
            "apps/docs/src/stories/foundations/particles/Overview.stories.ts",
            "apps/docs/src/stories/foundations/particles/Responsive.stories.ts",
            "apps/docs/src/stories/foundations/particles/States.stories.ts",
            "apps/docs/src/stories/foundations/particles/Theming.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 4,
          "files": [
            "apps/playground/src/App.vue",
            "apps/playground/src/PlaygroundHomeView.vue",
            "apps/playground/src/TsParticlesShowcase.vue",
            "apps/playground/src/lab/components/TsParticlesBackdropLabPreview.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Foundations/Particles/Overview",
          "file": "apps/docs/src/stories/foundations/particles/Overview.stories.ts"
        },
        {
          "variant": "states",
          "title": "Foundations/Particles/States",
          "file": "apps/docs/src/stories/foundations/particles/States.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Particles/Theming",
          "file": "apps/docs/src/stories/foundations/particles/Theming.stories.ts"
        },
        {
          "variant": "responsive",
          "title": "Foundations/Particles/Responsive",
          "file": "apps/docs/src/stories/foundations/particles/Responsive.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "particles",
          "label": "Particles",
          "description": "Neutral tsParticles backdrop wrapper that stays token-driven and layout-safe.",
          "path": "/testing#testing-particles"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/third-party/tsparticles/README.md"
        },
        {
          "type": "architecture-doc",
          "file": "docs/architecture/package-topology.md"
        },
        {
          "type": "architecture-doc",
          "file": "docs/architecture/golden-path.md"
        },
        {
          "type": "adr",
          "file": "docs/decisions/ADR-0014-third-party-topology.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "third-party",
        "particles"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/foundations/particles/Overview.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/particles/Responsive.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/particles/States.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/particles/Theming.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/App.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/PlaygroundHomeView.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/TsParticlesShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/components/TsParticlesBackdropLabPreview.vue",
          "area": "playground"
        }
      ]
    },
    "ui-signal-graph": {
      "id": "ui-signal-graph",
      "title": "UiSignalGraph",
      "exportName": "UiSignalGraph",
      "packageName": "@ww/signal-graph",
      "packageLayer": "system",
      "stability": "experimental",
      "family": "Systems",
      "labEligible": true,
      "sourcePublicSurface": "UiSignalGraph",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 9,
          "files": [
            "apps/docs/src/stories/foundations/signal-graph/FocusAndDepth.stories.ts",
            "apps/docs/src/stories/foundations/signal-graph/NodesAsComponents.stories.ts",
            "apps/docs/src/stories/foundations/signal-graph/OverlaysInNodes.stories.ts",
            "apps/docs/src/stories/foundations/signal-graph/Overview.stories.ts",
            "apps/docs/src/stories/foundations/signal-graph/ReducedMotion.stories.ts",
            "apps/docs/src/stories/foundations/signal-graph/Signals.stories.ts",
            "apps/docs/src/stories/foundations/signal-graph/States.stories.ts",
            "apps/docs/src/stories/foundations/signal-graph/Theming.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/playground/src/SignalGraphShowcase.vue",
            "apps/playground/src/lab/components/SignalGraphLabPreview.vue",
            "apps/playground/src/lab/schemas/ui-signal-graph.lab.ts"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 9,
          "files": [
            "apps/docs/src/stories/foundations/signal-graph/FocusAndDepth.stories.ts",
            "apps/docs/src/stories/foundations/signal-graph/NodesAsComponents.stories.ts",
            "apps/docs/src/stories/foundations/signal-graph/OverlaysInNodes.stories.ts",
            "apps/docs/src/stories/foundations/signal-graph/Overview.stories.ts",
            "apps/docs/src/stories/foundations/signal-graph/ReducedMotion.stories.ts",
            "apps/docs/src/stories/foundations/signal-graph/Signals.stories.ts",
            "apps/docs/src/stories/foundations/signal-graph/States.stories.ts",
            "apps/docs/src/stories/foundations/signal-graph/Theming.stories.ts",
            "apps/docs/src/stories/foundations/signal-graph/UseCases.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 3,
          "files": [
            "apps/playground/src/SignalGraphShowcase.vue",
            "apps/playground/src/lab/components/SignalGraphLabPreview.vue",
            "apps/playground/src/lab/schemas/ui-signal-graph.lab.ts"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Foundations/Signal Graph/Overview",
          "file": "apps/docs/src/stories/foundations/signal-graph/Overview.stories.ts"
        },
        {
          "variant": "states",
          "title": "Foundations/Signal Graph/States",
          "file": "apps/docs/src/stories/foundations/signal-graph/States.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Foundations/Signal Graph/Theming",
          "file": "apps/docs/src/stories/foundations/signal-graph/Theming.stories.ts"
        },
        {
          "variant": "interactions",
          "title": "Foundations/Signal Graph/Signals",
          "file": "apps/docs/src/stories/foundations/signal-graph/Signals.stories.ts"
        },
        {
          "variant": "interactions",
          "title": "Foundations/Signal Graph/Overlays in Nodes",
          "file": "apps/docs/src/stories/foundations/signal-graph/OverlaysInNodes.stories.ts"
        },
        {
          "variant": "focus",
          "title": "Foundations/Signal Graph/Focus and Depth",
          "file": "apps/docs/src/stories/foundations/signal-graph/FocusAndDepth.stories.ts"
        },
        {
          "variant": "reduced-motion",
          "title": "Foundations/Signal Graph/Reduced Motion",
          "file": "apps/docs/src/stories/foundations/signal-graph/ReducedMotion.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "signal-graph",
          "label": "Signal Graph",
          "description": "Feature-first graph runtime with signals, focus/depth, and overlays.",
          "path": "/testing#testing-signal-graph"
        },
        {
          "id": "composition",
          "label": "Composition",
          "description": "Consumer-proof multi-layer flows composed from layout shells, widgets, systems, and core.",
          "path": "/testing#testing-composition"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/signal-graph/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "system",
        "signal-graph"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/foundations/signal-graph/FocusAndDepth.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/signal-graph/NodesAsComponents.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/signal-graph/OverlaysInNodes.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/signal-graph/Overview.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/signal-graph/ReducedMotion.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/signal-graph/Signals.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/signal-graph/States.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/signal-graph/Theming.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/signal-graph/UseCases.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/SignalGraphShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/components/SignalGraphLabPreview.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-signal-graph.lab.ts",
          "area": "playground"
        }
      ]
    },
    "ui-data-grid": {
      "id": "ui-data-grid",
      "title": "UiDataGrid",
      "exportName": "UiDataGrid",
      "packageName": "@ww/data-grid",
      "packageLayer": "system",
      "stability": "incubating",
      "family": "Systems",
      "labEligible": true,
      "sourcePublicSurface": "UiDataGrid / UiDataGridToolbar / UiDataGridSearch / UiDataGridFilters / UiDataGridTable / UiDataGridPagination / UiDataGridBulkActions / UiDataGridColumnVisibility",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/docs/src/stories/systems/data-grid/data-grid-fixtures.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/playground/src/DataGridShowcase.vue",
            "apps/playground/src/lab/components/DataGridLabPreview.vue",
            "apps/playground/src/lab/schemas/ui-data-grid.lab.ts"
          ]
        },
        {
          "packageName": "@ww/widgets",
          "packageLayer": "widget",
          "count": 1,
          "files": [
            "packages/widgets/src/data/data-table-widget/components/DataTableWidget.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 1,
          "files": [
            "apps/docs/src/stories/systems/data-grid/data-grid-fixtures.ts"
          ]
        },
        {
          "area": "playground",
          "count": 3,
          "files": [
            "apps/playground/src/DataGridShowcase.vue",
            "apps/playground/src/lab/components/DataGridLabPreview.vue",
            "apps/playground/src/lab/schemas/ui-data-grid.lab.ts"
          ]
        },
        {
          "area": "widgets",
          "count": 1,
          "files": [
            "packages/widgets/src/data/data-table-widget/components/DataTableWidget.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Systems/Data Grid/Overview",
          "file": "apps/docs/src/stories/systems/data-grid/Overview.stories.ts"
        },
        {
          "variant": "states",
          "title": "Systems/Data Grid/States",
          "file": "apps/docs/src/stories/systems/data-grid/States.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Systems/Data Grid/Theming",
          "file": "apps/docs/src/stories/systems/data-grid/Theming.stories.ts"
        },
        {
          "variant": "interactions",
          "title": "Systems/Data Grid/Bulk Actions",
          "file": "apps/docs/src/stories/systems/data-grid/BulkActions.stories.ts"
        },
        {
          "variant": "interactions",
          "title": "Systems/Data Grid/Column Visibility",
          "file": "apps/docs/src/stories/systems/data-grid/ColumnVisibility.stories.ts"
        },
        {
          "variant": "accessibility",
          "title": "Systems/Data Grid/Accessibility",
          "file": "apps/docs/src/stories/systems/data-grid/Accessibility.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "data-grid-basic",
          "label": "Data Grid Basics",
          "description": "Controlled query model, dense admin surface, search, filters, sorting, and pagination.",
          "path": "/testing#testing-data-grid-basic"
        },
        {
          "id": "data-grid-states",
          "label": "Data Grid States",
          "description": "Loading, empty, no-results, and error surfaces for the system package.",
          "path": "/testing#testing-data-grid-states"
        },
        {
          "id": "data-grid-theming",
          "label": "Data Grid Theming",
          "description": "ThemeName, ThemeType, and subtree theming proof for data-grid surfaces.",
          "path": "/testing#testing-data-grid-theming"
        },
        {
          "id": "data-grid-selection",
          "label": "Data Grid Selection",
          "description": "Controlled selection, bulk actions, and column/query orchestration.",
          "path": "/testing#testing-data-grid-selection"
        },
        {
          "id": "data-grid-composition",
          "label": "Data Grid Composition",
          "description": "System package composed inside widget and layout shells.",
          "path": "/testing#testing-data-grid-composition"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/data-grid/README.md"
        },
        {
          "type": "architecture-doc",
          "file": "docs/architecture/golden-path.md"
        },
        {
          "type": "adr",
          "file": "docs/decisions/ADR-0015-data-grid-system-package.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "system",
        "data-grid"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/systems/data-grid/data-grid-fixtures.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/DataGridShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/components/DataGridLabPreview.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-data-grid.lab.ts",
          "area": "playground"
        },
        {
          "file": "packages/widgets/src/data/data-table-widget/components/DataTableWidget.vue",
          "area": "widgets"
        }
      ]
    },
    "ui-data-grid-toolbar": {
      "id": "ui-data-grid-toolbar",
      "title": "UiDataGridToolbar",
      "exportName": "UiDataGridToolbar",
      "packageName": "@ww/data-grid",
      "packageLayer": "system",
      "stability": "incubating",
      "family": "Systems",
      "labEligible": false,
      "labExemptionReason": "UiDataGridToolbar is tuned through UiDataGrid because it depends on the controlled query model and sibling sub-surfaces.",
      "sourcePublicSurface": "UiDataGrid / UiDataGridToolbar / UiDataGridSearch / UiDataGridFilters / UiDataGridTable / UiDataGridPagination / UiDataGridBulkActions / UiDataGridColumnVisibility",
      "downstreamPackages": [],
      "usageGroups": [],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Systems/Data Grid/Overview",
          "file": "apps/docs/src/stories/systems/data-grid/Overview.stories.ts"
        },
        {
          "variant": "states",
          "title": "Systems/Data Grid/States",
          "file": "apps/docs/src/stories/systems/data-grid/States.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Systems/Data Grid/Theming",
          "file": "apps/docs/src/stories/systems/data-grid/Theming.stories.ts"
        },
        {
          "variant": "interactions",
          "title": "Systems/Data Grid/Bulk Actions",
          "file": "apps/docs/src/stories/systems/data-grid/BulkActions.stories.ts"
        },
        {
          "variant": "interactions",
          "title": "Systems/Data Grid/Column Visibility",
          "file": "apps/docs/src/stories/systems/data-grid/ColumnVisibility.stories.ts"
        },
        {
          "variant": "accessibility",
          "title": "Systems/Data Grid/Accessibility",
          "file": "apps/docs/src/stories/systems/data-grid/Accessibility.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "data-grid-basic",
          "label": "Data Grid Basics",
          "description": "Controlled query model, dense admin surface, search, filters, sorting, and pagination.",
          "path": "/testing#testing-data-grid-basic"
        },
        {
          "id": "data-grid-states",
          "label": "Data Grid States",
          "description": "Loading, empty, no-results, and error surfaces for the system package.",
          "path": "/testing#testing-data-grid-states"
        },
        {
          "id": "data-grid-theming",
          "label": "Data Grid Theming",
          "description": "ThemeName, ThemeType, and subtree theming proof for data-grid surfaces.",
          "path": "/testing#testing-data-grid-theming"
        },
        {
          "id": "data-grid-selection",
          "label": "Data Grid Selection",
          "description": "Controlled selection, bulk actions, and column/query orchestration.",
          "path": "/testing#testing-data-grid-selection"
        },
        {
          "id": "data-grid-composition",
          "label": "Data Grid Composition",
          "description": "System package composed inside widget and layout shells.",
          "path": "/testing#testing-data-grid-composition"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/data-grid/README.md"
        },
        {
          "type": "architecture-doc",
          "file": "docs/architecture/golden-path.md"
        },
        {
          "type": "adr",
          "file": "docs/decisions/ADR-0015-data-grid-system-package.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "system",
        "data-grid"
      ],
      "knownUsages": []
    },
    "ui-data-grid-search": {
      "id": "ui-data-grid-search",
      "title": "UiDataGridSearch",
      "exportName": "UiDataGridSearch",
      "packageName": "@ww/data-grid",
      "packageLayer": "system",
      "stability": "incubating",
      "family": "Systems",
      "labEligible": false,
      "labExemptionReason": "UiDataGridSearch is tuned through UiDataGrid because it depends on the controlled query model and toolbar composition.",
      "sourcePublicSurface": "UiDataGrid / UiDataGridToolbar / UiDataGridSearch / UiDataGridFilters / UiDataGridTable / UiDataGridPagination / UiDataGridBulkActions / UiDataGridColumnVisibility",
      "downstreamPackages": [],
      "usageGroups": [],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Systems/Data Grid/Overview",
          "file": "apps/docs/src/stories/systems/data-grid/Overview.stories.ts"
        },
        {
          "variant": "states",
          "title": "Systems/Data Grid/States",
          "file": "apps/docs/src/stories/systems/data-grid/States.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Systems/Data Grid/Theming",
          "file": "apps/docs/src/stories/systems/data-grid/Theming.stories.ts"
        },
        {
          "variant": "interactions",
          "title": "Systems/Data Grid/Bulk Actions",
          "file": "apps/docs/src/stories/systems/data-grid/BulkActions.stories.ts"
        },
        {
          "variant": "interactions",
          "title": "Systems/Data Grid/Column Visibility",
          "file": "apps/docs/src/stories/systems/data-grid/ColumnVisibility.stories.ts"
        },
        {
          "variant": "accessibility",
          "title": "Systems/Data Grid/Accessibility",
          "file": "apps/docs/src/stories/systems/data-grid/Accessibility.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "data-grid-basic",
          "label": "Data Grid Basics",
          "description": "Controlled query model, dense admin surface, search, filters, sorting, and pagination.",
          "path": "/testing#testing-data-grid-basic"
        },
        {
          "id": "data-grid-states",
          "label": "Data Grid States",
          "description": "Loading, empty, no-results, and error surfaces for the system package.",
          "path": "/testing#testing-data-grid-states"
        },
        {
          "id": "data-grid-theming",
          "label": "Data Grid Theming",
          "description": "ThemeName, ThemeType, and subtree theming proof for data-grid surfaces.",
          "path": "/testing#testing-data-grid-theming"
        },
        {
          "id": "data-grid-selection",
          "label": "Data Grid Selection",
          "description": "Controlled selection, bulk actions, and column/query orchestration.",
          "path": "/testing#testing-data-grid-selection"
        },
        {
          "id": "data-grid-composition",
          "label": "Data Grid Composition",
          "description": "System package composed inside widget and layout shells.",
          "path": "/testing#testing-data-grid-composition"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/data-grid/README.md"
        },
        {
          "type": "architecture-doc",
          "file": "docs/architecture/golden-path.md"
        },
        {
          "type": "adr",
          "file": "docs/decisions/ADR-0015-data-grid-system-package.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "system",
        "data-grid"
      ],
      "knownUsages": []
    },
    "ui-data-grid-filters": {
      "id": "ui-data-grid-filters",
      "title": "UiDataGridFilters",
      "exportName": "UiDataGridFilters",
      "packageName": "@ww/data-grid",
      "packageLayer": "system",
      "stability": "incubating",
      "family": "Systems",
      "labEligible": false,
      "labExemptionReason": "UiDataGridFilters is tuned through UiDataGrid because it depends on filter definitions and toolbar composition.",
      "sourcePublicSurface": "UiDataGrid / UiDataGridToolbar / UiDataGridSearch / UiDataGridFilters / UiDataGridTable / UiDataGridPagination / UiDataGridBulkActions / UiDataGridColumnVisibility",
      "downstreamPackages": [],
      "usageGroups": [],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Systems/Data Grid/Overview",
          "file": "apps/docs/src/stories/systems/data-grid/Overview.stories.ts"
        },
        {
          "variant": "states",
          "title": "Systems/Data Grid/States",
          "file": "apps/docs/src/stories/systems/data-grid/States.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Systems/Data Grid/Theming",
          "file": "apps/docs/src/stories/systems/data-grid/Theming.stories.ts"
        },
        {
          "variant": "interactions",
          "title": "Systems/Data Grid/Bulk Actions",
          "file": "apps/docs/src/stories/systems/data-grid/BulkActions.stories.ts"
        },
        {
          "variant": "interactions",
          "title": "Systems/Data Grid/Column Visibility",
          "file": "apps/docs/src/stories/systems/data-grid/ColumnVisibility.stories.ts"
        },
        {
          "variant": "accessibility",
          "title": "Systems/Data Grid/Accessibility",
          "file": "apps/docs/src/stories/systems/data-grid/Accessibility.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "data-grid-basic",
          "label": "Data Grid Basics",
          "description": "Controlled query model, dense admin surface, search, filters, sorting, and pagination.",
          "path": "/testing#testing-data-grid-basic"
        },
        {
          "id": "data-grid-states",
          "label": "Data Grid States",
          "description": "Loading, empty, no-results, and error surfaces for the system package.",
          "path": "/testing#testing-data-grid-states"
        },
        {
          "id": "data-grid-theming",
          "label": "Data Grid Theming",
          "description": "ThemeName, ThemeType, and subtree theming proof for data-grid surfaces.",
          "path": "/testing#testing-data-grid-theming"
        },
        {
          "id": "data-grid-selection",
          "label": "Data Grid Selection",
          "description": "Controlled selection, bulk actions, and column/query orchestration.",
          "path": "/testing#testing-data-grid-selection"
        },
        {
          "id": "data-grid-composition",
          "label": "Data Grid Composition",
          "description": "System package composed inside widget and layout shells.",
          "path": "/testing#testing-data-grid-composition"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/data-grid/README.md"
        },
        {
          "type": "architecture-doc",
          "file": "docs/architecture/golden-path.md"
        },
        {
          "type": "adr",
          "file": "docs/decisions/ADR-0015-data-grid-system-package.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "system",
        "data-grid"
      ],
      "knownUsages": []
    },
    "ui-data-grid-table": {
      "id": "ui-data-grid-table",
      "title": "UiDataGridTable",
      "exportName": "UiDataGridTable",
      "packageName": "@ww/data-grid",
      "packageLayer": "system",
      "stability": "incubating",
      "family": "Systems",
      "labEligible": false,
      "labExemptionReason": "UiDataGridTable is tuned through UiDataGrid because it depends on controller-derived visibility, sort, and selection state.",
      "sourcePublicSurface": "UiDataGrid / UiDataGridToolbar / UiDataGridSearch / UiDataGridFilters / UiDataGridTable / UiDataGridPagination / UiDataGridBulkActions / UiDataGridColumnVisibility",
      "downstreamPackages": [],
      "usageGroups": [],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Systems/Data Grid/Overview",
          "file": "apps/docs/src/stories/systems/data-grid/Overview.stories.ts"
        },
        {
          "variant": "states",
          "title": "Systems/Data Grid/States",
          "file": "apps/docs/src/stories/systems/data-grid/States.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Systems/Data Grid/Theming",
          "file": "apps/docs/src/stories/systems/data-grid/Theming.stories.ts"
        },
        {
          "variant": "interactions",
          "title": "Systems/Data Grid/Bulk Actions",
          "file": "apps/docs/src/stories/systems/data-grid/BulkActions.stories.ts"
        },
        {
          "variant": "interactions",
          "title": "Systems/Data Grid/Column Visibility",
          "file": "apps/docs/src/stories/systems/data-grid/ColumnVisibility.stories.ts"
        },
        {
          "variant": "accessibility",
          "title": "Systems/Data Grid/Accessibility",
          "file": "apps/docs/src/stories/systems/data-grid/Accessibility.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "data-grid-basic",
          "label": "Data Grid Basics",
          "description": "Controlled query model, dense admin surface, search, filters, sorting, and pagination.",
          "path": "/testing#testing-data-grid-basic"
        },
        {
          "id": "data-grid-states",
          "label": "Data Grid States",
          "description": "Loading, empty, no-results, and error surfaces for the system package.",
          "path": "/testing#testing-data-grid-states"
        },
        {
          "id": "data-grid-theming",
          "label": "Data Grid Theming",
          "description": "ThemeName, ThemeType, and subtree theming proof for data-grid surfaces.",
          "path": "/testing#testing-data-grid-theming"
        },
        {
          "id": "data-grid-selection",
          "label": "Data Grid Selection",
          "description": "Controlled selection, bulk actions, and column/query orchestration.",
          "path": "/testing#testing-data-grid-selection"
        },
        {
          "id": "data-grid-composition",
          "label": "Data Grid Composition",
          "description": "System package composed inside widget and layout shells.",
          "path": "/testing#testing-data-grid-composition"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/data-grid/README.md"
        },
        {
          "type": "architecture-doc",
          "file": "docs/architecture/golden-path.md"
        },
        {
          "type": "adr",
          "file": "docs/decisions/ADR-0015-data-grid-system-package.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "system",
        "data-grid"
      ],
      "knownUsages": []
    },
    "ui-data-grid-pagination": {
      "id": "ui-data-grid-pagination",
      "title": "UiDataGridPagination",
      "exportName": "UiDataGridPagination",
      "packageName": "@ww/data-grid",
      "packageLayer": "system",
      "stability": "incubating",
      "family": "Systems",
      "labEligible": false,
      "labExemptionReason": "UiDataGridPagination is tuned through UiDataGrid because it depends on the controller summary and query model.",
      "sourcePublicSurface": "UiDataGrid / UiDataGridToolbar / UiDataGridSearch / UiDataGridFilters / UiDataGridTable / UiDataGridPagination / UiDataGridBulkActions / UiDataGridColumnVisibility",
      "downstreamPackages": [],
      "usageGroups": [],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Systems/Data Grid/Overview",
          "file": "apps/docs/src/stories/systems/data-grid/Overview.stories.ts"
        },
        {
          "variant": "states",
          "title": "Systems/Data Grid/States",
          "file": "apps/docs/src/stories/systems/data-grid/States.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Systems/Data Grid/Theming",
          "file": "apps/docs/src/stories/systems/data-grid/Theming.stories.ts"
        },
        {
          "variant": "interactions",
          "title": "Systems/Data Grid/Bulk Actions",
          "file": "apps/docs/src/stories/systems/data-grid/BulkActions.stories.ts"
        },
        {
          "variant": "interactions",
          "title": "Systems/Data Grid/Column Visibility",
          "file": "apps/docs/src/stories/systems/data-grid/ColumnVisibility.stories.ts"
        },
        {
          "variant": "accessibility",
          "title": "Systems/Data Grid/Accessibility",
          "file": "apps/docs/src/stories/systems/data-grid/Accessibility.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "data-grid-basic",
          "label": "Data Grid Basics",
          "description": "Controlled query model, dense admin surface, search, filters, sorting, and pagination.",
          "path": "/testing#testing-data-grid-basic"
        },
        {
          "id": "data-grid-states",
          "label": "Data Grid States",
          "description": "Loading, empty, no-results, and error surfaces for the system package.",
          "path": "/testing#testing-data-grid-states"
        },
        {
          "id": "data-grid-theming",
          "label": "Data Grid Theming",
          "description": "ThemeName, ThemeType, and subtree theming proof for data-grid surfaces.",
          "path": "/testing#testing-data-grid-theming"
        },
        {
          "id": "data-grid-selection",
          "label": "Data Grid Selection",
          "description": "Controlled selection, bulk actions, and column/query orchestration.",
          "path": "/testing#testing-data-grid-selection"
        },
        {
          "id": "data-grid-composition",
          "label": "Data Grid Composition",
          "description": "System package composed inside widget and layout shells.",
          "path": "/testing#testing-data-grid-composition"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/data-grid/README.md"
        },
        {
          "type": "architecture-doc",
          "file": "docs/architecture/golden-path.md"
        },
        {
          "type": "adr",
          "file": "docs/decisions/ADR-0015-data-grid-system-package.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "system",
        "data-grid"
      ],
      "knownUsages": []
    },
    "ui-data-grid-bulk-actions": {
      "id": "ui-data-grid-bulk-actions",
      "title": "UiDataGridBulkActions",
      "exportName": "UiDataGridBulkActions",
      "packageName": "@ww/data-grid",
      "packageLayer": "system",
      "stability": "incubating",
      "family": "Systems",
      "labEligible": false,
      "labExemptionReason": "UiDataGridBulkActions is tuned through UiDataGrid because it depends on controlled selection state and bulk action slots.",
      "sourcePublicSurface": "UiDataGrid / UiDataGridToolbar / UiDataGridSearch / UiDataGridFilters / UiDataGridTable / UiDataGridPagination / UiDataGridBulkActions / UiDataGridColumnVisibility",
      "downstreamPackages": [],
      "usageGroups": [],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Systems/Data Grid/Overview",
          "file": "apps/docs/src/stories/systems/data-grid/Overview.stories.ts"
        },
        {
          "variant": "states",
          "title": "Systems/Data Grid/States",
          "file": "apps/docs/src/stories/systems/data-grid/States.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Systems/Data Grid/Theming",
          "file": "apps/docs/src/stories/systems/data-grid/Theming.stories.ts"
        },
        {
          "variant": "interactions",
          "title": "Systems/Data Grid/Bulk Actions",
          "file": "apps/docs/src/stories/systems/data-grid/BulkActions.stories.ts"
        },
        {
          "variant": "interactions",
          "title": "Systems/Data Grid/Column Visibility",
          "file": "apps/docs/src/stories/systems/data-grid/ColumnVisibility.stories.ts"
        },
        {
          "variant": "accessibility",
          "title": "Systems/Data Grid/Accessibility",
          "file": "apps/docs/src/stories/systems/data-grid/Accessibility.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "data-grid-basic",
          "label": "Data Grid Basics",
          "description": "Controlled query model, dense admin surface, search, filters, sorting, and pagination.",
          "path": "/testing#testing-data-grid-basic"
        },
        {
          "id": "data-grid-states",
          "label": "Data Grid States",
          "description": "Loading, empty, no-results, and error surfaces for the system package.",
          "path": "/testing#testing-data-grid-states"
        },
        {
          "id": "data-grid-theming",
          "label": "Data Grid Theming",
          "description": "ThemeName, ThemeType, and subtree theming proof for data-grid surfaces.",
          "path": "/testing#testing-data-grid-theming"
        },
        {
          "id": "data-grid-selection",
          "label": "Data Grid Selection",
          "description": "Controlled selection, bulk actions, and column/query orchestration.",
          "path": "/testing#testing-data-grid-selection"
        },
        {
          "id": "data-grid-composition",
          "label": "Data Grid Composition",
          "description": "System package composed inside widget and layout shells.",
          "path": "/testing#testing-data-grid-composition"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/data-grid/README.md"
        },
        {
          "type": "architecture-doc",
          "file": "docs/architecture/golden-path.md"
        },
        {
          "type": "adr",
          "file": "docs/decisions/ADR-0015-data-grid-system-package.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "system",
        "data-grid"
      ],
      "knownUsages": []
    },
    "ui-data-grid-column-visibility": {
      "id": "ui-data-grid-column-visibility",
      "title": "UiDataGridColumnVisibility",
      "exportName": "UiDataGridColumnVisibility",
      "packageName": "@ww/data-grid",
      "packageLayer": "system",
      "stability": "incubating",
      "family": "Systems",
      "labEligible": false,
      "labExemptionReason": "UiDataGridColumnVisibility is tuned through UiDataGrid because it depends on toolbar composition and query state.",
      "sourcePublicSurface": "UiDataGrid / UiDataGridToolbar / UiDataGridSearch / UiDataGridFilters / UiDataGridTable / UiDataGridPagination / UiDataGridBulkActions / UiDataGridColumnVisibility",
      "downstreamPackages": [],
      "usageGroups": [],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Systems/Data Grid/Overview",
          "file": "apps/docs/src/stories/systems/data-grid/Overview.stories.ts"
        },
        {
          "variant": "states",
          "title": "Systems/Data Grid/States",
          "file": "apps/docs/src/stories/systems/data-grid/States.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Systems/Data Grid/Theming",
          "file": "apps/docs/src/stories/systems/data-grid/Theming.stories.ts"
        },
        {
          "variant": "interactions",
          "title": "Systems/Data Grid/Bulk Actions",
          "file": "apps/docs/src/stories/systems/data-grid/BulkActions.stories.ts"
        },
        {
          "variant": "interactions",
          "title": "Systems/Data Grid/Column Visibility",
          "file": "apps/docs/src/stories/systems/data-grid/ColumnVisibility.stories.ts"
        },
        {
          "variant": "accessibility",
          "title": "Systems/Data Grid/Accessibility",
          "file": "apps/docs/src/stories/systems/data-grid/Accessibility.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "data-grid-basic",
          "label": "Data Grid Basics",
          "description": "Controlled query model, dense admin surface, search, filters, sorting, and pagination.",
          "path": "/testing#testing-data-grid-basic"
        },
        {
          "id": "data-grid-states",
          "label": "Data Grid States",
          "description": "Loading, empty, no-results, and error surfaces for the system package.",
          "path": "/testing#testing-data-grid-states"
        },
        {
          "id": "data-grid-theming",
          "label": "Data Grid Theming",
          "description": "ThemeName, ThemeType, and subtree theming proof for data-grid surfaces.",
          "path": "/testing#testing-data-grid-theming"
        },
        {
          "id": "data-grid-selection",
          "label": "Data Grid Selection",
          "description": "Controlled selection, bulk actions, and column/query orchestration.",
          "path": "/testing#testing-data-grid-selection"
        },
        {
          "id": "data-grid-composition",
          "label": "Data Grid Composition",
          "description": "System package composed inside widget and layout shells.",
          "path": "/testing#testing-data-grid-composition"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/data-grid/README.md"
        },
        {
          "type": "architecture-doc",
          "file": "docs/architecture/golden-path.md"
        },
        {
          "type": "adr",
          "file": "docs/decisions/ADR-0015-data-grid-system-package.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "system",
        "data-grid"
      ],
      "knownUsages": []
    },
    "ui-widget-shell": {
      "id": "ui-widget-shell",
      "title": "UiWidgetShell",
      "exportName": "UiWidgetShell",
      "packageName": "@ww/widgets",
      "packageLayer": "widget",
      "stability": "incubating",
      "family": "Widgets",
      "labEligible": true,
      "sourcePublicSurface": "UiWidgetShell / UiWidgetHeader / UiWidgetBody / UiWidgetFooter",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 4,
          "files": [
            "apps/docs/src/stories/page-templates/DashboardLayout.stories.ts",
            "apps/docs/src/stories/page-templates/Shell.stories.ts",
            "apps/docs/src/stories/systems/data-grid/data-grid-fixtures.ts",
            "apps/docs/src/stories/widgets/Shell.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 6,
          "files": [
            "apps/playground/src/DataGridShowcase.vue",
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/lab/components/DashboardLayoutLabPreview.vue",
            "apps/playground/src/lab/components/LayoutLabPreview.vue",
            "apps/playground/src/lab/components/WidgetShellLabPreview.vue",
            "apps/playground/src/lab/schemas/ui-widget-shell.lab.ts"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 4,
          "files": [
            "apps/docs/src/stories/page-templates/DashboardLayout.stories.ts",
            "apps/docs/src/stories/page-templates/Shell.stories.ts",
            "apps/docs/src/stories/systems/data-grid/data-grid-fixtures.ts",
            "apps/docs/src/stories/widgets/Shell.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 6,
          "files": [
            "apps/playground/src/DataGridShowcase.vue",
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/lab/components/DashboardLayoutLabPreview.vue",
            "apps/playground/src/lab/components/LayoutLabPreview.vue",
            "apps/playground/src/lab/components/WidgetShellLabPreview.vue",
            "apps/playground/src/lab/schemas/ui-widget-shell.lab.ts"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Widgets/Shell",
          "file": "apps/docs/src/stories/widgets/Shell.stories.ts"
        },
        {
          "variant": "composition",
          "title": "Architecture/Widgets/Overview",
          "file": "apps/docs/src/stories/architecture/WidgetsOverview.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "widgets",
          "label": "Widgets",
          "description": "Widget shell layer, placement rules, and real reusable widget surfaces.",
          "path": "/testing#testing-widgets"
        },
        {
          "id": "composition",
          "label": "Composition",
          "description": "Consumer-proof multi-layer flows composed from layout shells, widgets, systems, and core.",
          "path": "/testing#testing-composition"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/widgets/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "widgets"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/page-templates/DashboardLayout.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/page-templates/Shell.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/systems/data-grid/data-grid-fixtures.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/widgets/Shell.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/DataGridShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/LayerScaffoldShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/components/DashboardLayoutLabPreview.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/components/LayoutLabPreview.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/components/WidgetShellLabPreview.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-widget-shell.lab.ts",
          "area": "playground"
        }
      ]
    },
    "ui-widget-header": {
      "id": "ui-widget-header",
      "title": "UiWidgetHeader",
      "exportName": "UiWidgetHeader",
      "packageName": "@ww/widgets",
      "packageLayer": "widget",
      "stability": "incubating",
      "family": "Widgets",
      "labEligible": false,
      "labExemptionReason": "UiWidgetHeader is tuned through UiWidgetShell because header, body, and footer are only meaningful together.",
      "sourcePublicSurface": "UiWidgetShell / UiWidgetHeader / UiWidgetBody / UiWidgetFooter",
      "downstreamPackages": [],
      "usageGroups": [],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Widgets/Shell",
          "file": "apps/docs/src/stories/widgets/Shell.stories.ts"
        },
        {
          "variant": "composition",
          "title": "Architecture/Widgets/Overview",
          "file": "apps/docs/src/stories/architecture/WidgetsOverview.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "widgets",
          "label": "Widgets",
          "description": "Widget shell layer, placement rules, and real reusable widget surfaces.",
          "path": "/testing#testing-widgets"
        },
        {
          "id": "composition",
          "label": "Composition",
          "description": "Consumer-proof multi-layer flows composed from layout shells, widgets, systems, and core.",
          "path": "/testing#testing-composition"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/widgets/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "widgets"
      ],
      "knownUsages": []
    },
    "ui-widget-body": {
      "id": "ui-widget-body",
      "title": "UiWidgetBody",
      "exportName": "UiWidgetBody",
      "packageName": "@ww/widgets",
      "packageLayer": "widget",
      "stability": "incubating",
      "family": "Widgets",
      "labEligible": false,
      "labExemptionReason": "UiWidgetBody is tuned through UiWidgetShell because header, body, and footer are only meaningful together.",
      "sourcePublicSurface": "UiWidgetShell / UiWidgetHeader / UiWidgetBody / UiWidgetFooter",
      "downstreamPackages": [],
      "usageGroups": [],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Widgets/Shell",
          "file": "apps/docs/src/stories/widgets/Shell.stories.ts"
        },
        {
          "variant": "composition",
          "title": "Architecture/Widgets/Overview",
          "file": "apps/docs/src/stories/architecture/WidgetsOverview.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "widgets",
          "label": "Widgets",
          "description": "Widget shell layer, placement rules, and real reusable widget surfaces.",
          "path": "/testing#testing-widgets"
        },
        {
          "id": "composition",
          "label": "Composition",
          "description": "Consumer-proof multi-layer flows composed from layout shells, widgets, systems, and core.",
          "path": "/testing#testing-composition"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/widgets/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "widgets"
      ],
      "knownUsages": []
    },
    "ui-widget-footer": {
      "id": "ui-widget-footer",
      "title": "UiWidgetFooter",
      "exportName": "UiWidgetFooter",
      "packageName": "@ww/widgets",
      "packageLayer": "widget",
      "stability": "incubating",
      "family": "Widgets",
      "labEligible": false,
      "labExemptionReason": "UiWidgetFooter is tuned through UiWidgetShell because header, body, and footer are only meaningful together.",
      "sourcePublicSurface": "UiWidgetShell / UiWidgetHeader / UiWidgetBody / UiWidgetFooter",
      "downstreamPackages": [],
      "usageGroups": [],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Widgets/Shell",
          "file": "apps/docs/src/stories/widgets/Shell.stories.ts"
        },
        {
          "variant": "composition",
          "title": "Architecture/Widgets/Overview",
          "file": "apps/docs/src/stories/architecture/WidgetsOverview.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "widgets",
          "label": "Widgets",
          "description": "Widget shell layer, placement rules, and real reusable widget surfaces.",
          "path": "/testing#testing-widgets"
        },
        {
          "id": "composition",
          "label": "Composition",
          "description": "Consumer-proof multi-layer flows composed from layout shells, widgets, systems, and core.",
          "path": "/testing#testing-composition"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/widgets/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "widgets"
      ],
      "knownUsages": []
    },
    "data-table-widget": {
      "id": "data-table-widget",
      "title": "DataTableWidget",
      "exportName": "DataTableWidget",
      "packageName": "@ww/widgets",
      "packageLayer": "widget",
      "stability": "incubating",
      "family": "Widgets",
      "labEligible": true,
      "sourcePublicSurface": "DataTableWidget",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/docs/src/stories/widgets/data-table-widget-fixtures.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/playground/src/DataTableWidgetShowcase.vue",
            "apps/playground/src/lab/components/DataTableWidgetLabPreview.vue",
            "apps/playground/src/lab/schemas/data-table-widget.lab.ts"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 1,
          "files": [
            "apps/docs/src/stories/widgets/data-table-widget-fixtures.ts"
          ]
        },
        {
          "area": "playground",
          "count": 3,
          "files": [
            "apps/playground/src/DataTableWidgetShowcase.vue",
            "apps/playground/src/lab/components/DataTableWidgetLabPreview.vue",
            "apps/playground/src/lab/schemas/data-table-widget.lab.ts"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Widgets/Data Table Widget/Overview",
          "file": "apps/docs/src/stories/widgets/DataTableWidgetOverview.stories.ts"
        },
        {
          "variant": "states",
          "title": "Widgets/Data Table Widget/States",
          "file": "apps/docs/src/stories/widgets/DataTableWidgetStates.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Widgets/Data Table Widget/Theming",
          "file": "apps/docs/src/stories/widgets/DataTableWidgetTheming.stories.ts"
        },
        {
          "variant": "composition",
          "title": "Widgets/Data Table Widget/Composition",
          "file": "apps/docs/src/stories/widgets/DataTableWidgetComposition.stories.ts"
        },
        {
          "variant": "composition",
          "title": "Widgets/Data Table Widget/Extensibility",
          "file": "apps/docs/src/stories/widgets/DataTableWidgetExtensibility.stories.ts"
        },
        {
          "variant": "overview",
          "title": "Architecture/Widgets/Data Table Widget",
          "file": "apps/docs/src/stories/architecture/DataTableWidgetOverview.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "widget-data-table-basic",
          "label": "Data Table Widget Basics",
          "description": "Reusable widget framing over the data-grid system package with controlled query and selection.",
          "path": "/testing#testing-widgets-data-table-basic"
        },
        {
          "id": "widget-data-table-states",
          "label": "Data Table Widget States",
          "description": "Widget-level loading, empty, no-results, and error framing above the data-grid system package.",
          "path": "/testing#testing-widgets-data-table-states"
        },
        {
          "id": "widget-data-table-theming",
          "label": "Data Table Widget Theming",
          "description": "ThemeName, ThemeType, and subtree theming proof for the data-table widget surface.",
          "path": "/testing#testing-widgets-data-table-theming"
        },
        {
          "id": "widget-data-table-composition",
          "label": "Data Table Widget Composition",
          "description": "Widget composed inside layout shells without duplicating the underlying data-grid engine.",
          "path": "/testing#testing-widgets-data-table-composition"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/widgets/README.md"
        },
        {
          "type": "readme",
          "file": "packages/widgets/src/data/data-table-widget/README.md"
        },
        {
          "type": "adr",
          "file": "docs/decisions/ADR-0010-widgets-and-page-templates-layer.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "widgets",
        "data-grid"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/widgets/data-table-widget-fixtures.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/DataTableWidgetShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/components/DataTableWidgetLabPreview.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/schemas/data-table-widget.lab.ts",
          "area": "playground"
        }
      ]
    },
    "ui-layout": {
      "id": "ui-layout",
      "title": "UiLayout",
      "exportName": "UiLayout",
      "packageName": "@ww/page-templates",
      "packageLayer": "page-template",
      "stability": "incubating",
      "family": "Page Templates",
      "labEligible": true,
      "sourcePublicSurface": "UiLayout / UiLayoutHeader / UiLayoutSider / UiLayoutContent / UiLayoutFooter / UiLayoutSection / UiLayoutToolbar",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 4,
          "files": [
            "apps/docs/src/stories/foundations/particles/Overview.stories.ts",
            "apps/docs/src/stories/page-templates/Shell.stories.ts",
            "apps/docs/src/stories/systems/data-grid/data-grid-fixtures.ts",
            "apps/docs/src/stories/widgets/data-table-widget-fixtures.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 5,
          "files": [
            "apps/playground/src/DataGridShowcase.vue",
            "apps/playground/src/DataTableWidgetShowcase.vue",
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/TsParticlesShowcase.vue",
            "apps/playground/src/lab/components/LayoutLabPreview.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 4,
          "files": [
            "apps/docs/src/stories/foundations/particles/Overview.stories.ts",
            "apps/docs/src/stories/page-templates/Shell.stories.ts",
            "apps/docs/src/stories/systems/data-grid/data-grid-fixtures.ts",
            "apps/docs/src/stories/widgets/data-table-widget-fixtures.ts"
          ]
        },
        {
          "area": "playground",
          "count": 5,
          "files": [
            "apps/playground/src/DataGridShowcase.vue",
            "apps/playground/src/DataTableWidgetShowcase.vue",
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/TsParticlesShowcase.vue",
            "apps/playground/src/lab/components/LayoutLabPreview.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Page Templates/Shell",
          "file": "apps/docs/src/stories/page-templates/Shell.stories.ts"
        },
        {
          "variant": "composition",
          "title": "Architecture/Page Templates/Overview",
          "file": "apps/docs/src/stories/architecture/PageTemplatesOverview.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "page-templates",
          "label": "Page Templates",
          "description": "Page-template layer proving UiDashboardLayout, the generic UiLayout shell family, and directional flow layouts.",
          "path": "/testing#testing-page-templates"
        },
        {
          "id": "composition",
          "label": "Composition",
          "description": "Consumer-proof multi-layer flows composed from layout shells, widgets, systems, and core.",
          "path": "/testing#testing-composition"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/page-templates/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "page-templates"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/foundations/particles/Overview.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/page-templates/Shell.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/systems/data-grid/data-grid-fixtures.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/widgets/data-table-widget-fixtures.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/DataGridShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/DataTableWidgetShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/LayerScaffoldShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/TsParticlesShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/components/LayoutLabPreview.vue",
          "area": "playground"
        }
      ]
    },
    "ui-layout-header": {
      "id": "ui-layout-header",
      "title": "UiLayoutHeader",
      "exportName": "UiLayoutHeader",
      "packageName": "@ww/page-templates",
      "packageLayer": "page-template",
      "stability": "incubating",
      "family": "Page Templates",
      "labEligible": false,
      "labExemptionReason": "UiLayoutHeader is verified through consumer-style layout compositions because header structure only makes sense with surrounding shell context.",
      "sourcePublicSurface": "UiLayout / UiLayoutHeader / UiLayoutSider / UiLayoutContent / UiLayoutFooter / UiLayoutSection / UiLayoutToolbar",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 4,
          "files": [
            "apps/docs/src/stories/foundations/particles/Overview.stories.ts",
            "apps/docs/src/stories/page-templates/Shell.stories.ts",
            "apps/docs/src/stories/systems/data-grid/data-grid-fixtures.ts",
            "apps/docs/src/stories/widgets/data-table-widget-fixtures.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 5,
          "files": [
            "apps/playground/src/DataGridShowcase.vue",
            "apps/playground/src/DataTableWidgetShowcase.vue",
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/TsParticlesShowcase.vue",
            "apps/playground/src/lab/components/LayoutLabPreview.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 4,
          "files": [
            "apps/docs/src/stories/foundations/particles/Overview.stories.ts",
            "apps/docs/src/stories/page-templates/Shell.stories.ts",
            "apps/docs/src/stories/systems/data-grid/data-grid-fixtures.ts",
            "apps/docs/src/stories/widgets/data-table-widget-fixtures.ts"
          ]
        },
        {
          "area": "playground",
          "count": 5,
          "files": [
            "apps/playground/src/DataGridShowcase.vue",
            "apps/playground/src/DataTableWidgetShowcase.vue",
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/TsParticlesShowcase.vue",
            "apps/playground/src/lab/components/LayoutLabPreview.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Page Templates/Shell",
          "file": "apps/docs/src/stories/page-templates/Shell.stories.ts"
        },
        {
          "variant": "composition",
          "title": "Architecture/Page Templates/Overview",
          "file": "apps/docs/src/stories/architecture/PageTemplatesOverview.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "page-templates",
          "label": "Page Templates",
          "description": "Page-template layer proving UiDashboardLayout, the generic UiLayout shell family, and directional flow layouts.",
          "path": "/testing#testing-page-templates"
        },
        {
          "id": "composition",
          "label": "Composition",
          "description": "Consumer-proof multi-layer flows composed from layout shells, widgets, systems, and core.",
          "path": "/testing#testing-composition"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/page-templates/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "page-templates"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/foundations/particles/Overview.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/page-templates/Shell.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/systems/data-grid/data-grid-fixtures.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/widgets/data-table-widget-fixtures.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/DataGridShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/DataTableWidgetShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/LayerScaffoldShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/TsParticlesShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/components/LayoutLabPreview.vue",
          "area": "playground"
        }
      ]
    },
    "ui-vertical-layout": {
      "id": "ui-vertical-layout",
      "title": "UiVerticalLayout",
      "exportName": "UiVerticalLayout",
      "packageName": "@ww/page-templates",
      "packageLayer": "page-template",
      "stability": "incubating",
      "family": "Page Templates",
      "labEligible": true,
      "sourcePublicSurface": "UiVerticalLayout / UiHorizontalLayout",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/foundations/particles/Overview.stories.ts",
            "apps/docs/src/stories/foundations/particles/Responsive.stories.ts",
            "apps/docs/src/stories/page-templates/Shell.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 7,
          "files": [
            "apps/playground/src/App.vue",
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/PlaygroundHomeView.vue",
            "apps/playground/src/TsParticlesShowcase.vue",
            "apps/playground/src/lab/components/FlowLayoutLabPreview.vue",
            "apps/playground/src/lab/components/TsParticlesBackdropLabPreview.vue",
            "apps/playground/src/lab/schemas/ui-vertical-layout.lab.ts"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/foundations/particles/Overview.stories.ts",
            "apps/docs/src/stories/foundations/particles/Responsive.stories.ts",
            "apps/docs/src/stories/page-templates/Shell.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 7,
          "files": [
            "apps/playground/src/App.vue",
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/PlaygroundHomeView.vue",
            "apps/playground/src/TsParticlesShowcase.vue",
            "apps/playground/src/lab/components/FlowLayoutLabPreview.vue",
            "apps/playground/src/lab/components/TsParticlesBackdropLabPreview.vue",
            "apps/playground/src/lab/schemas/ui-vertical-layout.lab.ts"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Page Templates/Shell",
          "file": "apps/docs/src/stories/page-templates/Shell.stories.ts"
        },
        {
          "variant": "composition",
          "title": "Architecture/Page Templates/Overview",
          "file": "apps/docs/src/stories/architecture/PageTemplatesOverview.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Page Templates/Shell",
          "file": "apps/docs/src/stories/page-templates/Shell.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "page-templates",
          "label": "Page Templates",
          "description": "Page-template layer proving UiDashboardLayout, the generic UiLayout shell family, and directional flow layouts.",
          "path": "/testing#testing-page-templates"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/page-templates/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "page-templates",
        "flow-layout"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/foundations/particles/Overview.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/foundations/particles/Responsive.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/page-templates/Shell.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/App.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/LayerScaffoldShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/PlaygroundHomeView.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/TsParticlesShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/components/FlowLayoutLabPreview.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/components/TsParticlesBackdropLabPreview.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-vertical-layout.lab.ts",
          "area": "playground"
        }
      ]
    },
    "ui-horizontal-layout": {
      "id": "ui-horizontal-layout",
      "title": "UiHorizontalLayout",
      "exportName": "UiHorizontalLayout",
      "packageName": "@ww/page-templates",
      "packageLayer": "page-template",
      "stability": "incubating",
      "family": "Page Templates",
      "labEligible": true,
      "sourcePublicSurface": "UiVerticalLayout / UiHorizontalLayout",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 2,
          "files": [
            "apps/docs/src/stories/foundations/particles/Responsive.stories.ts",
            "apps/docs/src/stories/page-templates/Shell.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 7,
          "files": [
            "apps/playground/src/App.vue",
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/PlaygroundHomeView.vue",
            "apps/playground/src/TsParticlesShowcase.vue",
            "apps/playground/src/lab/components/FlowLayoutLabPreview.vue",
            "apps/playground/src/lab/components/TsParticlesBackdropLabPreview.vue",
            "apps/playground/src/lab/schemas/ui-horizontal-layout.lab.ts"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 2,
          "files": [
            "apps/docs/src/stories/foundations/particles/Responsive.stories.ts",
            "apps/docs/src/stories/page-templates/Shell.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 7,
          "files": [
            "apps/playground/src/App.vue",
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/PlaygroundHomeView.vue",
            "apps/playground/src/TsParticlesShowcase.vue",
            "apps/playground/src/lab/components/FlowLayoutLabPreview.vue",
            "apps/playground/src/lab/components/TsParticlesBackdropLabPreview.vue",
            "apps/playground/src/lab/schemas/ui-horizontal-layout.lab.ts"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Page Templates/Shell",
          "file": "apps/docs/src/stories/page-templates/Shell.stories.ts"
        },
        {
          "variant": "composition",
          "title": "Architecture/Page Templates/Overview",
          "file": "apps/docs/src/stories/architecture/PageTemplatesOverview.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Page Templates/Shell",
          "file": "apps/docs/src/stories/page-templates/Shell.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "page-templates",
          "label": "Page Templates",
          "description": "Page-template layer proving UiDashboardLayout, the generic UiLayout shell family, and directional flow layouts.",
          "path": "/testing#testing-page-templates"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/page-templates/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "page-templates",
        "flow-layout"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/foundations/particles/Responsive.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/page-templates/Shell.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/App.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/LayerScaffoldShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/PlaygroundHomeView.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/TsParticlesShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/components/FlowLayoutLabPreview.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/components/TsParticlesBackdropLabPreview.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-horizontal-layout.lab.ts",
          "area": "playground"
        }
      ]
    },
    "ui-layout-sider": {
      "id": "ui-layout-sider",
      "title": "UiLayoutSider",
      "exportName": "UiLayoutSider",
      "packageName": "@ww/page-templates",
      "packageLayer": "page-template",
      "stability": "incubating",
      "family": "Page Templates",
      "labEligible": false,
      "labExemptionReason": "UiLayoutSider is verified through consumer-style layout compositions because sider structure depends on the surrounding shell.",
      "sourcePublicSurface": "UiLayout / UiLayoutHeader / UiLayoutSider / UiLayoutContent / UiLayoutFooter / UiLayoutSection / UiLayoutToolbar",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/docs/src/stories/page-templates/Shell.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 2,
          "files": [
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/lab/components/LayoutLabPreview.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 1,
          "files": [
            "apps/docs/src/stories/page-templates/Shell.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 2,
          "files": [
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/lab/components/LayoutLabPreview.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Page Templates/Shell",
          "file": "apps/docs/src/stories/page-templates/Shell.stories.ts"
        },
        {
          "variant": "composition",
          "title": "Architecture/Page Templates/Overview",
          "file": "apps/docs/src/stories/architecture/PageTemplatesOverview.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "page-templates",
          "label": "Page Templates",
          "description": "Page-template layer proving UiDashboardLayout, the generic UiLayout shell family, and directional flow layouts.",
          "path": "/testing#testing-page-templates"
        },
        {
          "id": "composition",
          "label": "Composition",
          "description": "Consumer-proof multi-layer flows composed from layout shells, widgets, systems, and core.",
          "path": "/testing#testing-composition"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/page-templates/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "page-templates"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/page-templates/Shell.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/LayerScaffoldShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/components/LayoutLabPreview.vue",
          "area": "playground"
        }
      ]
    },
    "ui-layout-content": {
      "id": "ui-layout-content",
      "title": "UiLayoutContent",
      "exportName": "UiLayoutContent",
      "packageName": "@ww/page-templates",
      "packageLayer": "page-template",
      "stability": "incubating",
      "family": "Page Templates",
      "labEligible": false,
      "labExemptionReason": "UiLayoutContent is verified through consumer-style layout compositions because the content region is structural rather than standalone.",
      "sourcePublicSurface": "UiLayout / UiLayoutHeader / UiLayoutSider / UiLayoutContent / UiLayoutFooter / UiLayoutSection / UiLayoutToolbar",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 4,
          "files": [
            "apps/docs/src/stories/foundations/particles/Overview.stories.ts",
            "apps/docs/src/stories/page-templates/Shell.stories.ts",
            "apps/docs/src/stories/systems/data-grid/data-grid-fixtures.ts",
            "apps/docs/src/stories/widgets/data-table-widget-fixtures.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 5,
          "files": [
            "apps/playground/src/DataGridShowcase.vue",
            "apps/playground/src/DataTableWidgetShowcase.vue",
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/TsParticlesShowcase.vue",
            "apps/playground/src/lab/components/LayoutLabPreview.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 4,
          "files": [
            "apps/docs/src/stories/foundations/particles/Overview.stories.ts",
            "apps/docs/src/stories/page-templates/Shell.stories.ts",
            "apps/docs/src/stories/systems/data-grid/data-grid-fixtures.ts",
            "apps/docs/src/stories/widgets/data-table-widget-fixtures.ts"
          ]
        },
        {
          "area": "playground",
          "count": 5,
          "files": [
            "apps/playground/src/DataGridShowcase.vue",
            "apps/playground/src/DataTableWidgetShowcase.vue",
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/TsParticlesShowcase.vue",
            "apps/playground/src/lab/components/LayoutLabPreview.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Page Templates/Shell",
          "file": "apps/docs/src/stories/page-templates/Shell.stories.ts"
        },
        {
          "variant": "composition",
          "title": "Architecture/Page Templates/Overview",
          "file": "apps/docs/src/stories/architecture/PageTemplatesOverview.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "page-templates",
          "label": "Page Templates",
          "description": "Page-template layer proving UiDashboardLayout, the generic UiLayout shell family, and directional flow layouts.",
          "path": "/testing#testing-page-templates"
        },
        {
          "id": "composition",
          "label": "Composition",
          "description": "Consumer-proof multi-layer flows composed from layout shells, widgets, systems, and core.",
          "path": "/testing#testing-composition"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/page-templates/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "page-templates"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/foundations/particles/Overview.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/page-templates/Shell.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/systems/data-grid/data-grid-fixtures.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/widgets/data-table-widget-fixtures.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/DataGridShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/DataTableWidgetShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/LayerScaffoldShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/TsParticlesShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/components/LayoutLabPreview.vue",
          "area": "playground"
        }
      ]
    },
    "ui-layout-footer": {
      "id": "ui-layout-footer",
      "title": "UiLayoutFooter",
      "exportName": "UiLayoutFooter",
      "packageName": "@ww/page-templates",
      "packageLayer": "page-template",
      "stability": "incubating",
      "family": "Page Templates",
      "labEligible": false,
      "labExemptionReason": "UiLayoutFooter is verified through consumer-style layout compositions because footer structure depends on the shell context.",
      "sourcePublicSurface": "UiLayout / UiLayoutHeader / UiLayoutSider / UiLayoutContent / UiLayoutFooter / UiLayoutSection / UiLayoutToolbar",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 2,
          "files": [
            "apps/docs/src/stories/foundations/particles/Overview.stories.ts",
            "apps/docs/src/stories/page-templates/Shell.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/TsParticlesShowcase.vue",
            "apps/playground/src/lab/components/LayoutLabPreview.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 2,
          "files": [
            "apps/docs/src/stories/foundations/particles/Overview.stories.ts",
            "apps/docs/src/stories/page-templates/Shell.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 3,
          "files": [
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/TsParticlesShowcase.vue",
            "apps/playground/src/lab/components/LayoutLabPreview.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Page Templates/Shell",
          "file": "apps/docs/src/stories/page-templates/Shell.stories.ts"
        },
        {
          "variant": "composition",
          "title": "Architecture/Page Templates/Overview",
          "file": "apps/docs/src/stories/architecture/PageTemplatesOverview.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "page-templates",
          "label": "Page Templates",
          "description": "Page-template layer proving UiDashboardLayout, the generic UiLayout shell family, and directional flow layouts.",
          "path": "/testing#testing-page-templates"
        },
        {
          "id": "composition",
          "label": "Composition",
          "description": "Consumer-proof multi-layer flows composed from layout shells, widgets, systems, and core.",
          "path": "/testing#testing-composition"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/page-templates/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "page-templates"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/foundations/particles/Overview.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/page-templates/Shell.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/LayerScaffoldShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/TsParticlesShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/components/LayoutLabPreview.vue",
          "area": "playground"
        }
      ]
    },
    "ui-layout-section": {
      "id": "ui-layout-section",
      "title": "UiLayoutSection",
      "exportName": "UiLayoutSection",
      "packageName": "@ww/page-templates",
      "packageLayer": "page-template",
      "stability": "incubating",
      "family": "Page Templates",
      "labEligible": false,
      "labExemptionReason": "UiLayoutSection is verified through layout stories and playground proofs because its value comes from shell composition rather than isolated tuning.",
      "sourcePublicSurface": "UiLayout / UiLayoutHeader / UiLayoutSider / UiLayoutContent / UiLayoutFooter / UiLayoutSection / UiLayoutToolbar",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 3,
          "files": [
            "apps/docs/src/stories/page-templates/Shell.stories.ts",
            "apps/docs/src/stories/systems/data-grid/data-grid-fixtures.ts",
            "apps/docs/src/stories/widgets/data-table-widget-fixtures.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 4,
          "files": [
            "apps/playground/src/DataGridShowcase.vue",
            "apps/playground/src/DataTableWidgetShowcase.vue",
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/lab/components/LayoutLabPreview.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 3,
          "files": [
            "apps/docs/src/stories/page-templates/Shell.stories.ts",
            "apps/docs/src/stories/systems/data-grid/data-grid-fixtures.ts",
            "apps/docs/src/stories/widgets/data-table-widget-fixtures.ts"
          ]
        },
        {
          "area": "playground",
          "count": 4,
          "files": [
            "apps/playground/src/DataGridShowcase.vue",
            "apps/playground/src/DataTableWidgetShowcase.vue",
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/lab/components/LayoutLabPreview.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Page Templates/Shell",
          "file": "apps/docs/src/stories/page-templates/Shell.stories.ts"
        },
        {
          "variant": "composition",
          "title": "Architecture/Page Templates/Overview",
          "file": "apps/docs/src/stories/architecture/PageTemplatesOverview.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "page-templates",
          "label": "Page Templates",
          "description": "Page-template layer proving UiDashboardLayout, the generic UiLayout shell family, and directional flow layouts.",
          "path": "/testing#testing-page-templates"
        },
        {
          "id": "composition",
          "label": "Composition",
          "description": "Consumer-proof multi-layer flows composed from layout shells, widgets, systems, and core.",
          "path": "/testing#testing-composition"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/page-templates/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "page-templates"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/page-templates/Shell.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/systems/data-grid/data-grid-fixtures.ts",
          "area": "docs"
        },
        {
          "file": "apps/docs/src/stories/widgets/data-table-widget-fixtures.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/DataGridShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/DataTableWidgetShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/LayerScaffoldShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/components/LayoutLabPreview.vue",
          "area": "playground"
        }
      ]
    },
    "ui-layout-toolbar": {
      "id": "ui-layout-toolbar",
      "title": "UiLayoutToolbar",
      "exportName": "UiLayoutToolbar",
      "packageName": "@ww/page-templates",
      "packageLayer": "page-template",
      "stability": "incubating",
      "family": "Page Templates",
      "labEligible": false,
      "labExemptionReason": "UiLayoutToolbar is verified through consumer-style layout compositions because toolbar placement only makes sense inside a larger shell.",
      "sourcePublicSurface": "UiLayout / UiLayoutHeader / UiLayoutSider / UiLayoutContent / UiLayoutFooter / UiLayoutSection / UiLayoutToolbar",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/docs/src/stories/page-templates/Shell.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 2,
          "files": [
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/lab/components/LayoutLabPreview.vue"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 1,
          "files": [
            "apps/docs/src/stories/page-templates/Shell.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 2,
          "files": [
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/lab/components/LayoutLabPreview.vue"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Page Templates/Shell",
          "file": "apps/docs/src/stories/page-templates/Shell.stories.ts"
        },
        {
          "variant": "composition",
          "title": "Architecture/Page Templates/Overview",
          "file": "apps/docs/src/stories/architecture/PageTemplatesOverview.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Core/System Showcase",
          "file": "apps/docs/src/stories/CoreShowcase.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "page-templates",
          "label": "Page Templates",
          "description": "Page-template layer proving UiDashboardLayout, the generic UiLayout shell family, and directional flow layouts.",
          "path": "/testing#testing-page-templates"
        },
        {
          "id": "composition",
          "label": "Composition",
          "description": "Consumer-proof multi-layer flows composed from layout shells, widgets, systems, and core.",
          "path": "/testing#testing-composition"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/page-templates/README.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "page-templates"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/page-templates/Shell.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/LayerScaffoldShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/components/LayoutLabPreview.vue",
          "area": "playground"
        }
      ]
    },
    "ui-dashboard-layout": {
      "id": "ui-dashboard-layout",
      "title": "UiDashboardLayout",
      "exportName": "UiDashboardLayout",
      "packageName": "@ww/page-templates",
      "packageLayer": "page-template",
      "stability": "incubating",
      "family": "Page Templates",
      "labEligible": true,
      "sourcePublicSurface": "UiDashboardLayout",
      "downstreamPackages": [
        {
          "packageName": "@ww/docs",
          "packageLayer": "app",
          "count": 1,
          "files": [
            "apps/docs/src/stories/page-templates/DashboardLayout.stories.ts"
          ]
        },
        {
          "packageName": "@ww/playground",
          "packageLayer": "app",
          "count": 5,
          "files": [
            "apps/playground/src/App.vue",
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/PlaygroundHomeView.vue",
            "apps/playground/src/lab/components/DashboardLayoutLabPreview.vue",
            "apps/playground/src/lab/schemas/ui-dashboard-layout.lab.ts"
          ]
        }
      ],
      "usageGroups": [
        {
          "area": "docs",
          "count": 1,
          "files": [
            "apps/docs/src/stories/page-templates/DashboardLayout.stories.ts"
          ]
        },
        {
          "area": "playground",
          "count": 5,
          "files": [
            "apps/playground/src/App.vue",
            "apps/playground/src/LayerScaffoldShowcase.vue",
            "apps/playground/src/PlaygroundHomeView.vue",
            "apps/playground/src/lab/components/DashboardLayoutLabPreview.vue",
            "apps/playground/src/lab/schemas/ui-dashboard-layout.lab.ts"
          ]
        }
      ],
      "relatedStorybook": [
        {
          "variant": "overview",
          "title": "Dashboards",
          "file": "apps/docs/src/stories/page-templates/DashboardLayout.stories.ts"
        },
        {
          "variant": "composition",
          "title": "Dashboards",
          "file": "apps/docs/src/stories/page-templates/DashboardLayout.stories.ts"
        },
        {
          "variant": "theming",
          "title": "Dashboards",
          "file": "apps/docs/src/stories/page-templates/DashboardLayout.stories.ts"
        }
      ],
      "relatedHarnesses": [
        {
          "id": "page-templates",
          "label": "Page Templates",
          "description": "Page-template layer proving UiDashboardLayout, the generic UiLayout shell family, and directional flow layouts.",
          "path": "/testing#testing-page-templates"
        }
      ],
      "relatedDocs": [
        {
          "type": "readme",
          "file": "packages/page-templates/README.md"
        },
        {
          "type": "architecture-doc",
          "file": "docs/architecture/golden-path.md"
        },
        {
          "type": "architecture-doc",
          "file": "docs/architecture/placement-rules.md"
        }
      ],
      "requiredTestLayers": [
        "unit",
        "e2e",
        "playground"
      ],
      "tags": [
        "page-templates",
        "dashboard"
      ],
      "knownUsages": [
        {
          "file": "apps/docs/src/stories/page-templates/DashboardLayout.stories.ts",
          "area": "docs"
        },
        {
          "file": "apps/playground/src/App.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/LayerScaffoldShowcase.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/PlaygroundHomeView.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/components/DashboardLayoutLabPreview.vue",
          "area": "playground"
        },
        {
          "file": "apps/playground/src/lab/schemas/ui-dashboard-layout.lab.ts",
          "area": "playground"
        }
      ]
    }
  }
};
