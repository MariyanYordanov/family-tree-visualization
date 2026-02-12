import React from 'react';
import { G, Rect, Text } from 'react-native-svg';
import type { Person, TreeTheme } from '../types';
import { PhotoNode } from './PhotoNode';
import { DateLabel } from './DateLabel';

interface TreeNodeProps {
  person: Person;
  x: number;
  y: number;
  width: number;
  height: number;
  theme: TreeTheme;
  showPhotos: boolean;
  showDates: boolean;
  photoShape: 'circle' | 'rounded';
  deceasedStyle: 'dim' | 'sepia' | 'none';
  onTap?: (person: Person) => void;
  onLongPress?: (person: Person) => void;
}

export const TreeNode = React.memo(function TreeNode({
  person,
  x,
  y,
  width,
  height,
  theme,
  showPhotos,
  showDates,
  photoShape,
  deceasedStyle,
}: TreeNodeProps) {
  const padding = 8;
  const photoSize = Math.min(width - padding * 2, 56);
  const isDeceased = person.deathYear != null;

  let opacity = 1;
  if (isDeceased && deceasedStyle === 'dim') {
    opacity = 0.6;
  }

  // Sepia tint: warm brownish overlay for deceased nodes
  const useSepia = isDeceased && deceasedStyle === 'sepia';
  const bgColor = useSepia ? '#F5E6D3' : theme.nodeBackgroundColor;
  const borderColor = useSepia ? '#C4A882' : theme.nodeBorderColor;
  const textColor = useSepia ? '#6B5B4A' : theme.nodeTextColor;

  const photoX = x + (width - photoSize) / 2;
  const photoY = y + padding;

  // Build effective theme with sepia overrides
  const effectiveTheme = useSepia
    ? {
        ...theme,
        nodeBackgroundColor: bgColor,
        nodeBorderColor: borderColor,
        nodeTextColor: textColor,
        photoPlaceholderColor: '#E0D0BE',
      }
    : theme;

  const nameY = showPhotos ? photoY + photoSize + 14 : y + padding + 14;
  const dateY = nameY + effectiveTheme.fontSize + 4;

  return (
    <G opacity={opacity}>
      {/* Node background */}
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={12}
        ry={12}
        fill={bgColor}
        stroke={borderColor}
        strokeWidth={1.5}
      />

      {/* Photo or initials */}
      {showPhotos && (
        <PhotoNode
          name={person.name}
          photo={person.photo}
          x={photoX}
          y={photoY}
          size={photoSize}
          shape={photoShape}
          theme={effectiveTheme}
        />
      )}

      {/* Name */}
      <Text
        x={x + width / 2}
        y={nameY}
        fontSize={effectiveTheme.fontSize}
        fontFamily={effectiveTheme.fontFamily}
        fontWeight="600"
        fill={textColor}
        textAnchor="middle"
      >
        {person.name}
      </Text>

      {/* Date label */}
      {showDates && (
        <DateLabel
          birthYear={person.birthYear}
          deathYear={person.deathYear}
          x={x + width / 2}
          y={dateY}
          theme={effectiveTheme}
        />
      )}
    </G>
  );
});
