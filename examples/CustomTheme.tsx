import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FamilyTree } from '@kintales/tree-view';
import type { TreeTheme } from '@kintales/tree-view';

const darkTheme: TreeTheme = {
  backgroundColor: '#1a1a2e',
  nodeBackgroundColor: '#16213e',
  nodeBorderColor: '#0f3460',
  nodeTextColor: '#e0e0e0',
  edgeColor: '#0f3460',
  edgeWidth: 2,
  fontFamily: 'System',
  fontSize: 13,
  photoPlaceholderColor: '#1a1a40',
};

const people = [
  { id: '1', name: 'Ada Lovelace', gender: 'female' as const, birthYear: 1815, deathYear: 1852 },
  { id: '2', name: 'Lord Byron', gender: 'male' as const, birthYear: 1788, deathYear: 1824 },
  { id: '3', name: 'Anne Milbanke', gender: 'female' as const, birthYear: 1792, deathYear: 1860 },
];

const relationships = [
  { from: '2', to: '3', type: 'spouse' as const },
  { from: '2', to: '1', type: 'parent' as const },
  { from: '3', to: '1', type: 'parent' as const },
];

export default function CustomThemeExample() {
  return (
    <View style={styles.container}>
      <FamilyTree
        people={people}
        relationships={relationships}
        rootId="2"
        theme="custom"
        customTheme={darkTheme}
        deceasedStyle="dim"
        showDates={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
