import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { FamilyTree } from '@kintales/tree-view';

const people = [
  { id: '1', name: 'Grandpa Ivan', gender: 'male' as const, birthYear: 1940, deathYear: 2020 },
  { id: '2', name: 'Grandma Maria', gender: 'female' as const, birthYear: 1943 },
  { id: '3', name: 'Father Petar', gender: 'male' as const, birthYear: 1965 },
  { id: '4', name: 'Mother Elena', gender: 'female' as const, birthYear: 1968 },
  { id: '5', name: 'Me', gender: 'male' as const, birthYear: 1992 },
];

const relationships = [
  { from: '1', to: '2', type: 'spouse' as const },
  { from: '1', to: '3', type: 'parent' as const },
  { from: '2', to: '3', type: 'parent' as const },
  { from: '3', to: '4', type: 'spouse' as const },
  { from: '3', to: '5', type: 'parent' as const },
  { from: '4', to: '5', type: 'parent' as const },
];

export default function BasicTree() {
  return (
    <View style={styles.container}>
      <FamilyTree
        people={people}
        relationships={relationships}
        rootId="1"
        onPersonTap={(person) => Alert.alert('Tapped', person.name)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
