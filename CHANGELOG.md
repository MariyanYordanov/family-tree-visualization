# Changelog

## [1.0.0] - 2026-02-12

### Added
- Viewport culling for trees with 50+ nodes (automatic, no configuration needed)
- Performance tests for 100+ and 200+ node trees
- TypeScript declarations (`index.d.ts`, `index.d.mts`)
- CJS + ESM dual-format bundle via tsup
- README with badges, installation, usage examples, API reference
- Example files: BasicTree, ComplexTree, LargeTree, CustomTheme, CustomNodes
- Exported `isNodeVisible`, `cullNodes`, and `Viewport` type for advanced usage

### Changed
- Package version bumped to 1.0.0
- Package exports now list `types` before `import`/`require` for proper resolution

### Fixed
- Unused `React` import in FamilyTree.tsx (JSX transform handles it)
- Unused `Relationship` import in layout types

## [0.3.0] - 2026-02-12

### Added
- Photo support: circular photos with `ClipPath`, initials fallback on colored background
- Multiple marriage layout: children grouped under respective spouse pair
- Deceased styles: `dim` (opacity 0.6) and `sepia` (warm brownish tint)
- Built-in themes: `warm` (earth tones) and `neutral` (clean/modern)
- Complex tree tests: multi-marriage, half-siblings, step-children, 22-person tree

## [0.2.0] - 2026-02-12

### Added
- Pan gesture (drag to move)
- Pinch-to-zoom with min/max clamping
- Double-tap to reset zoom and position
- Tap on node fires `onPersonTap` callback
- Long-press on node fires `onPersonLongPress` callback
- `findTappedNode` accounts for pan/zoom transforms

## [0.1.0] - 2026-02-12

### Added
- Initial release
- Core `FamilyTree` component with SVG rendering
- BFS-based layout algorithm with generation assignment
- Spouse grouping (side by side)
- Parent-child edge routing (L-shaped paths)
- `TreeNode` with name and date labels
- `TreeEdge` with uniform styling for all relationship types
- `computeLayout` pure function for headless usage
- Utility functions: `getInitials`, `formatDateLabel`, `isNodeVisible`, `cullNodes`
- 38 tests covering layout, edge cases, and utilities
