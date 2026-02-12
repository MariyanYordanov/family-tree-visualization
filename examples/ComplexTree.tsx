import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { FamilyTree } from '@kintales/tree-view';

/**
 * Complex tree example: multiple marriages, step-children, half-siblings,
 * and 4 generations with 20+ people.
 */
const people = [
  // Generation 0 (grandparents)
  { id: 'gp1', name: 'Grandfather', gender: 'male' as const, birthYear: 1930, deathYear: 2010 },
  { id: 'gm1', name: 'Grandmother', gender: 'female' as const, birthYear: 1932 },
  // Generation 1 (parents + multiple marriages)
  { id: 'dad', name: 'Father', gender: 'male' as const, birthYear: 1955 },
  { id: 'mom1', name: 'First Wife', gender: 'female' as const, birthYear: 1958 },
  { id: 'mom2', name: 'Second Wife', gender: 'female' as const, birthYear: 1962 },
  { id: 'uncle', name: 'Uncle', gender: 'male' as const, birthYear: 1957 },
  { id: 'aunt', name: 'Aunt', gender: 'female' as const, birthYear: 1959 },
  // Generation 2 (children, half-siblings, cousins)
  { id: 'child1', name: 'Child 1 (Wife 1)', gender: 'female' as const, birthYear: 1980 },
  { id: 'child2', name: 'Child 2 (Wife 1)', gender: 'male' as const, birthYear: 1983 },
  { id: 'child3', name: 'Child 3 (Wife 2)', gender: 'female' as const, birthYear: 1990 },
  { id: 'cousin1', name: 'Cousin 1', gender: 'male' as const, birthYear: 1985 },
  { id: 'cousin2', name: 'Cousin 2', gender: 'female' as const, birthYear: 1988 },
  // Spouses of gen 2
  { id: 'spouse_c1', name: 'Child1 Husband', gender: 'male' as const, birthYear: 1979 },
  // Generation 3
  { id: 'grandkid1', name: 'Grandkid 1', gender: 'male' as const, birthYear: 2010 },
  { id: 'grandkid2', name: 'Grandkid 2', gender: 'female' as const, birthYear: 2013 },
];

const relationships = [
  // Grandparent marriage
  { from: 'gp1', to: 'gm1', type: 'spouse' as const },
  // Grandparents -> Gen 1
  { from: 'gp1', to: 'dad', type: 'parent' as const },
  { from: 'gm1', to: 'dad', type: 'parent' as const },
  { from: 'gp1', to: 'uncle', type: 'parent' as const },
  { from: 'gm1', to: 'uncle', type: 'parent' as const },
  // Dad's two marriages
  { from: 'dad', to: 'mom1', type: 'spouse' as const },
  { from: 'dad', to: 'mom2', type: 'spouse' as const },
  { from: 'uncle', to: 'aunt', type: 'spouse' as const },
  // Children of first marriage
  { from: 'dad', to: 'child1', type: 'parent' as const },
  { from: 'mom1', to: 'child1', type: 'parent' as const },
  { from: 'dad', to: 'child2', type: 'parent' as const },
  { from: 'mom1', to: 'child2', type: 'parent' as const },
  // Child of second marriage (half-sibling)
  { from: 'dad', to: 'child3', type: 'parent' as const },
  { from: 'mom2', to: 'child3', type: 'parent' as const },
  // Cousins
  { from: 'uncle', to: 'cousin1', type: 'parent' as const },
  { from: 'aunt', to: 'cousin1', type: 'parent' as const },
  { from: 'uncle', to: 'cousin2', type: 'parent' as const },
  { from: 'aunt', to: 'cousin2', type: 'parent' as const },
  // Gen 2 marriage
  { from: 'child1', to: 'spouse_c1', type: 'spouse' as const },
  // Grandkids
  { from: 'child1', to: 'grandkid1', type: 'parent' as const },
  { from: 'spouse_c1', to: 'grandkid1', type: 'parent' as const },
  { from: 'child1', to: 'grandkid2', type: 'parent' as const },
  { from: 'spouse_c1', to: 'grandkid2', type: 'parent' as const },
];

export default function ComplexTree() {
  return (
    <View style={styles.container}>
      <FamilyTree
        people={people}
        relationships={relationships}
        rootId="gp1"
        showDates={true}
        deceasedStyle="sepia"
        onPersonTap={(person) => Alert.alert('Tapped', person.name)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
