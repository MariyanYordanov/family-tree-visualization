import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Circle, Text as SvgText, Rect } from 'react-native-svg';
import { FamilyTree } from '@kintales/tree-view';
import type { Person, NodePosition } from '@kintales/tree-view';

const people = [
  { id: '1', name: 'Alice', gender: 'female' as const },
  { id: '2', name: 'Bob', gender: 'male' as const },
  { id: '3', name: 'Charlie', gender: 'male' as const },
];

const relationships = [
  { from: '1', to: '2', type: 'spouse' as const },
  { from: '1', to: '3', type: 'parent' as const },
  { from: '2', to: '3', type: 'parent' as const },
];

/**
 * Custom node renderer: circular nodes with colored backgrounds.
 */
function renderCustomNode(person: Person, position: NodePosition) {
  const size = Math.min(position.width, position.height);
  const cx = position.x + position.width / 2;
  const cy = position.y + position.height / 2;
  const radius = size / 2 - 4;

  const color = person.gender === 'female' ? '#E8A0BF' : '#7286D3';

  return (
    <>
      <Circle cx={cx} cy={cy} r={radius} fill={color} />
      <SvgText
        x={cx}
        y={cy + 5}
        fontSize={14}
        fontWeight="bold"
        fill="#fff"
        textAnchor="middle"
      >
        {person.name}
      </SvgText>
    </>
  );
}

export default function CustomNodesExample() {
  return (
    <View style={styles.container}>
      <FamilyTree
        people={people}
        relationships={relationships}
        rootId="1"
        renderNode={renderCustomNode}
        onPersonTap={(person) => Alert.alert('Tapped', person.name)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
