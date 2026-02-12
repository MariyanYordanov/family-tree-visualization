import React, { useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { FamilyTree } from '@kintales/tree-view';
import type { Person, Relationship } from '@kintales/tree-view';

/**
 * Performance demo: generates a 100+ node family tree.
 * Viewport culling automatically activates for trees with 50+ nodes.
 */
function generateLargeFamily(): {
  people: Person[];
  relationships: Relationship[];
} {
  const people: Person[] = [];
  const relationships: Relationship[] = [];

  people.push(
    { id: 'root_m', name: 'Patriarch', gender: 'male', birthYear: 1900 },
    { id: 'root_f', name: 'Matriarch', gender: 'female', birthYear: 1902 },
  );
  relationships.push({ from: 'root_m', to: 'root_f', type: 'spouse' });

  let count = 2;
  let parents: Array<{ m: string; f: string }> = [
    { m: 'root_m', f: 'root_f' },
  ];

  for (let gen = 1; gen <= 4; gen++) {
    const nextParents: Array<{ m: string; f: string }> = [];
    for (const pair of parents) {
      const numChildren = gen <= 2 ? 4 : 3;
      for (let c = 0; c < numChildren && count < 120; c++) {
        const childId = `p${count++}`;
        const gender = c % 2 === 0 ? 'male' : 'female';
        people.push({
          id: childId,
          name: `Gen${gen} #${c + 1}`,
          gender: gender as 'male' | 'female',
          birthYear: 1900 + gen * 25 + c,
        });
        relationships.push(
          { from: pair.m, to: childId, type: 'parent' },
          { from: pair.f, to: childId, type: 'parent' },
        );

        if (c % 2 === 0 && count < 120) {
          const spouseId = `p${count++}`;
          people.push({
            id: spouseId,
            name: `Spouse ${spouseId}`,
            gender: gender === 'male' ? 'female' : 'male',
            birthYear: 1900 + gen * 25 + c + 1,
          });
          relationships.push({ from: childId, to: spouseId, type: 'spouse' });
          nextParents.push(
            gender === 'male'
              ? { m: childId, f: spouseId }
              : { m: spouseId, f: childId },
          );
        }
      }
    }
    parents = nextParents;
  }

  return { people, relationships };
}

export default function LargeTree() {
  const { people, relationships } = useMemo(() => generateLargeFamily(), []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {people.length} people — viewport culling active
      </Text>
      <FamilyTree
        people={people}
        relationships={relationships}
        rootId="root_m"
        showPhotos={false}
        showDates={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 12,
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f5f5f5',
  },
});
