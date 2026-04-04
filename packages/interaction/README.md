# @ww/interaction

`@ww/interaction` is the systems-layer home for coordinated interaction runtimes above `@ww/core`.

It owns:

- form registration and validation runtime
- virtualization and infinite scroll
- hierarchical collection systems such as tree, tree-select, cascader, and transfer
- upload queue orchestration above the core file-picker surface
- guided tour overlays

It does not own:

- backend transport clients
- route or product orchestration
- replacement baseline controls that belong in `@ww/core`

Import styles explicitly:

```ts
import '@ww/interaction/styles.css';
```
