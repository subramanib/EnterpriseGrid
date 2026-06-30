# @enterprisegrid/grid

A high-performance, responsive, and completely feature-rich React Data Grid component. It comes with out-of-the-box support for AI-insights querying, visual sparklines, high-contrast heatmaps, dynamic calendar layout, geospatial map routing, local history time-travel, customizable multi-view boards, and responsive swiping.

## Features

- ⚡ **High-Performance**: Handles thousands of rows smoothly with fast state managers.
- 🎨 **Visual Heatmaps & Sparklines**: Micro-visualize trends inside cell margins with zero boilerplate.
- 📅 **Interactive Calendar View**: Toggle from grid list layout straight to responsive visual calendars.
- 🗺️ **Geospatial Map View**: Plot locations automatically on nested maps using robust geolocation pins.
- 🕒 **Undo/Redo & Time Travel**: Built-in historic activity recording for complete state restoration.
- 📋 **Integrated AI Sandbox**: Playgrounds configured with code-editor compilation to test custom configurations interactively.

---

## Installation

Install `@enterprisegrid/grid` along with its required peer dependencies:

```bash
npm install @enterprisegrid/grid react react-dom motion lucide-react leaflet react-leaflet react-big-calendar date-fns
```

Make sure to import the CSS styles in your main entry file (e.g., `main.tsx` or `App.tsx`):

```typescript
import '@enterprisegrid/grid/dist/enterprisegrid.css';
```

---

## Basic Usage

Here is a quick setup guide to mount the grid component in your React application:

```tsx
import React from 'react';
import { DataTable } from '@enterprisegrid/grid';
import '@enterprisegrid/grid/dist/enterprisegrid.css';

const columns = [
  {
    id: 'name',
    name: 'Product Name',
    selector: (row) => row.name,
    sortable: true,
  },
  {
    id: 'price',
    name: 'Price ($)',
    selector: (row) => row.price,
    sortable: true,
    right: true,
  }
];

const data = [
  { id: 1, name: 'Premium Coffee Beans', price: 18.50 },
  { id: 2, name: 'Espresso Maker Pro', price: 299.99 },
];

export default function MyDashboard() {
  return (
    <div style={{ padding: '2rem' }}>
      <DataTable
        title="Inventory Manager"
        columns={columns}
        data={data}
        pagination
        searchable
      />
    </div>
  );
}
```

---

## Technical Specifications

### Package Exports
- **ESM**: `dist/enterprisegrid.mjs`
- **UMD/CJS**: `dist/enterprisegrid.cjs`
- **Styles**: `dist/enterprisegrid.css`
- **Typings**: Fully typed out-of-the-box (`dist/index.d.ts`)

### Configuration Props

| Prop Name | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | The header title for the grid container. |
| `columns` | `TableColumn<T>[]` | Column structure config (width, alignment, sparklines, heatmap, formats). |
| `data` | `T[]` | Data records array. |
| `pagination` | `boolean` | Enable or disable pagination helper controls. |
| `searchable` | `boolean` | Enable global column filtering. |

---

## Maintaining Versioning & Releases

A standardized workflow is set up to automate semantic version bumps and prepare changelogs for publication.

### How to Release a New Version

From the `packages/enterprisegrid` directory, you can run the interactive `release` script:

```bash
# Bump version by a patch (e.g., 1.0.0 -> 1.0.1)
npm run release patch

# Bump version by a minor feature set (e.g., 1.0.0 -> 1.1.0)
npm run release minor

# Bump version by a major breaking change (e.g., 1.0.0 -> 2.0.0)
npm run release major

# Specify a custom exact version
npm run release 1.0.5-beta.0
```

### What the Release Script Does Automatically

1. **Calculates & Validates** the targeted semver value.
2. **Updates package.json** with the newly bumped version.
3. **Prepend placeholders in CHANGELOG.md** under a fresh timestamped section.
4. **Triggers a bundle compile verification** to ensure your codebase builds flawlessly before staging a release.

Once the verification build completes, open `CHANGELOG.md`, update the bulleted lists with your latest features or fixes, and run `npm publish` to publish to your registry.

---

## License

Released under the **MIT License**.
