# Dashboard page-template namespace

Dashboard layouts in this namespace stay reusable, slot-driven, and route-agnostic.

Current public surface:

- `UiDashboardLayout`
  Layout-only shell with dedicated aside, header, and main-content slots for dashboard-like
  screens. Page-level scroll stays locked while aside content and main content remain the explicit
  internal scroll regions.
