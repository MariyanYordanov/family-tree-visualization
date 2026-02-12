# @kintales/tree-view

[![npm version](https://img.shields.io/npm/v/@kintales/tree-view)](https://www.npmjs.com/package/@kintales/tree-view)
[![license](https://img.shields.io/npm/l/@kintales/tree-view)](https://github.com/MariyanYordanov/kintales-tree-view/blob/main/LICENSE)

Interactive family tree visualization for React Native. Pan, zoom, pinch gestures. Supports multiple marriages, step-children, half-siblings. Built on `react-native-svg`.

Works on **iOS**, **Android**, and **Web** (via react-native-web).

## Installation

```bash
npm install @kintales/tree-view
```

### Peer dependencies

```bash
npm install react-native-svg react-native-gesture-handler react-native-reanimated
```

Follow the installation guides for each peer dependency:
- [react-native-svg](https://github.com/software-mansion/react-native-svg#installation)
- [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation)
- [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started)

## Quick start

```jsx
import { FamilyTree } from '@kintales/tree-view';

const people = [
  { id: '1', name: 'Grandpa Ivan', birthYear: 1940, deathYear: 2020 },
  { id: '2', name: 'Grandma Maria', birthYear: 1943 },
  { id: '3', name: 'Father Petar', birthYear: 1965 },
  { id: '4', name: 'Mother Elena', birthYear: 1968 },
  { id: '5', name: 'Me', birthYear: 1992 },
];

const relationships = [
  { from: '1', to: '2', type: 'spouse' },
  { from: '1', to: '3', type: 'parent' },
  { from: '2', to: '3', type: 'parent' },
  { from: '3', to: '4', type: 'spouse' },
  { from: '3', to: '5', type: 'parent' },
  { from: '4', to: '5', type: 'parent' },
];

<FamilyTree
  people={people}
  relationships={relationships}
  rootId="1"
  onPersonTap={(person) => console.log('Tapped:', person.name)}
/>
```

## Features

- Automatic layout: parents above, children below, spouses side by side
- Multiple marriages with per-spouse child grouping
- Step-children, half-siblings, adopted children (all rendered identically)
- Pan, pinch-to-zoom, double-tap to reset
- Tap and long-press callbacks on nodes
- Circular photos with initials fallback
- Birth/death year labels
- Built-in themes: `warm` (earth tones) and `neutral` (clean/modern)
- Custom themes and custom node/edge renderers
- Viewport culling for large trees (50+ nodes)
- TypeScript support with full type declarations

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `people` | `Person[]` | required | Array of people to display |
| `relationships` | `Relationship[]` | required | Array of relationships between people |
| `rootId` | `string` | first person | Center the tree on this person |
| `onPersonTap` | `(person: Person) => void` | — | Callback when a node is tapped |
| `onPersonLongPress` | `(person: Person) => void` | — | Callback on long press |
| `nodeWidth` | `number` | `120` | Width of each node in pixels |
| `nodeHeight` | `number` | `160` | Height of each node in pixels |
| `horizontalSpacing` | `number` | `40` | Horizontal gap between nodes |
| `verticalSpacing` | `number` | `80` | Vertical gap between generations |
| `theme` | `'warm' \| 'neutral' \| 'custom'` | `'warm'` | Built-in theme or custom |
| `customTheme` | `TreeTheme` | — | Custom theme object (requires `theme='custom'`) |
| `showPhotos` | `boolean` | `true` | Show photo/initials circle |
| `showDates` | `boolean` | `true` | Show birth/death year labels |
| `photoShape` | `'circle' \| 'rounded'` | `'circle'` | Shape of photo area |
| `deceasedStyle` | `'dim' \| 'sepia' \| 'none'` | `'none'` | Visual style for deceased people |
| `enablePan` | `boolean` | `true` | Enable drag to pan |
| `enableZoom` | `boolean` | `true` | Enable pinch to zoom |
| `minZoom` | `number` | `0.3` | Minimum zoom level |
| `maxZoom` | `number` | `3.0` | Maximum zoom level |
| `initialZoom` | `number` | `1.0` | Starting zoom level |
| `renderNode` | `(person, position) => ReactNode` | — | Custom node renderer |
| `renderEdge` | `(from, to, type) => ReactNode` | — | Custom edge renderer |

## Types

```typescript
interface Person {
  id: string;
  name: string;
  gender?: 'male' | 'female' | 'other';
  photo?: string;
  birthYear?: number;
  deathYear?: number;
  [key: string]: unknown;
}

interface Relationship {
  from: string;
  to: string;
  type: 'parent' | 'spouse' | 'sibling' | 'step_parent' | 'step_child'
       | 'step_sibling' | 'adopted' | 'guardian' | string;
  marriageYear?: number;
  divorceYear?: number;
}

interface TreeTheme {
  backgroundColor: string;
  nodeBackgroundColor: string;
  nodeBorderColor: string;
  nodeTextColor: string;
  edgeColor: string;
  edgeWidth: number;
  fontFamily: string;
  fontSize: number;
  photoPlaceholderColor: string;
}
```

## Advanced: headless layout

Use the layout algorithm without rendering:

```typescript
import { computeLayout } from '@kintales/tree-view';

const layout = computeLayout(people, relationships, 'root-id');
// layout.nodes: { id, person, x, y, generation }[]
// layout.edges: { fromId, toId, type, points }[]
// layout.width, layout.height
```

## Custom node renderer

```jsx
import { Circle, Text } from 'react-native-svg';

<FamilyTree
  people={people}
  relationships={relationships}
  renderNode={(person, pos) => (
    <Circle
      cx={pos.x + pos.width / 2}
      cy={pos.y + pos.height / 2}
      r={40}
      fill={person.gender === 'female' ? '#E8A0BF' : '#7286D3'}
    />
  )}
/>
```

## Performance

- Trees with 50+ nodes automatically enable viewport culling
- Only visible nodes and their connecting edges are rendered
- `React.memo` on all SVG components prevents unnecessary re-renders
- `useMemo` on layout computation and node/edge lists
- Tested with 200+ node trees

## Design principles

1. All relationship types have identical visual style (no different colors/dashes for step-parent vs biological)
2. No built-in gendered coloring (use `renderNode` for customization)
3. Deceased people have no special treatment by default (`deceasedStyle: 'none'`)
4. No assumptions about family structure (0-N spouses, 0-N parents)
5. Zero opinion on data source

## Examples

See the [examples/](./examples) directory:
- `BasicTree.tsx` — Minimal 3-generation tree
- `ComplexTree.tsx` — Multiple marriages, half-siblings, 4 generations
- `LargeTree.tsx` — 100+ nodes performance demo
- `CustomTheme.tsx` — Dark theme example
- `CustomNodes.tsx` — Custom circular node renderer

## License

MIT
