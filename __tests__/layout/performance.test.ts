import { describe, it, expect } from 'vitest';
import { computeLayout } from '../../src/layout/familyLayout';
import type { Person, Relationship } from '../../src/types';

/**
 * Generate a large family tree for performance testing.
 * Structure: multiple generations with branching families.
 */
function generateLargeTree(nodeCount: number): {
  people: Person[];
  relationships: Relationship[];
} {
  const people: Person[] = [];
  const relationships: Relationship[] = [];

  // Generation 0: root couple
  people.push(
    { id: 'root_m', name: 'Root Father', gender: 'male', birthYear: 1920 },
    { id: 'root_f', name: 'Root Mother', gender: 'female', birthYear: 1922 },
  );
  relationships.push({ from: 'root_m', to: 'root_f', type: 'spouse' });

  let personCount = 2;
  let generation = 1;
  let parentPairs: Array<{ father: string; mother: string }> = [
    { father: 'root_m', mother: 'root_f' },
  ];

  while (personCount < nodeCount) {
    const nextPairs: Array<{ father: string; mother: string }> = [];
    const childrenPerPair = Math.max(2, Math.min(4, Math.ceil((nodeCount - personCount) / parentPairs.length / 2)));

    for (const pair of parentPairs) {
      if (personCount >= nodeCount) break;

      for (let c = 0; c < childrenPerPair; c++) {
        if (personCount >= nodeCount) break;

        const childId = `p${personCount}`;
        const childGender = c % 2 === 0 ? 'male' : 'female';
        people.push({
          id: childId,
          name: `Person ${personCount}`,
          gender: childGender,
          birthYear: 1920 + generation * 25 + c,
        });
        relationships.push(
          { from: pair.father, to: childId, type: 'parent' },
          { from: pair.mother, to: childId, type: 'parent' },
        );
        personCount++;

        // Give every other child a spouse (if we have room)
        if (c % 2 === 0 && personCount < nodeCount) {
          const spouseId = `p${personCount}`;
          people.push({
            id: spouseId,
            name: `Spouse of ${personCount - 1}`,
            gender: childGender === 'male' ? 'female' : 'male',
            birthYear: 1920 + generation * 25 + c + 1,
          });
          relationships.push({ from: childId, to: spouseId, type: 'spouse' });
          personCount++;

          nextPairs.push(
            childGender === 'male'
              ? { father: childId, mother: spouseId }
              : { father: spouseId, mother: childId },
          );
        }
      }
    }

    parentPairs = nextPairs;
    generation++;

    // Safety: if no parent pairs remain, stop
    if (parentPairs.length === 0) break;
  }

  return { people, relationships };
}

describe('performance tests', () => {
  it('handles 100-node tree without crashing', () => {
    const { people, relationships } = generateLargeTree(100);

    expect(people.length).toBeGreaterThanOrEqual(100);

    const result = computeLayout(people, relationships, 'root_m');

    expect(result.nodes.length).toBe(people.length);
    expect(result.width).toBeGreaterThan(0);
    expect(result.height).toBeGreaterThan(0);
  });

  it('100-node layout computes in under 500ms', () => {
    const { people, relationships } = generateLargeTree(100);

    const start = performance.now();
    computeLayout(people, relationships, 'root_m');
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(500);
  });

  it('200-node layout computes in under 2000ms', () => {
    const { people, relationships } = generateLargeTree(200);

    expect(people.length).toBeGreaterThanOrEqual(200);

    const start = performance.now();
    const result = computeLayout(people, relationships, 'root_m');
    const elapsed = performance.now() - start;

    expect(result.nodes.length).toBe(people.length);
    expect(elapsed).toBeLessThan(2000);
  });

  it('all nodes in 150-node tree have valid finite positions', () => {
    const { people, relationships } = generateLargeTree(150);

    const result = computeLayout(people, relationships, 'root_m');

    for (const node of result.nodes) {
      expect(Number.isFinite(node.x)).toBe(true);
      expect(Number.isFinite(node.y)).toBe(true);
      expect(node.x).toBeGreaterThanOrEqual(0);
      expect(node.y).toBeGreaterThanOrEqual(0);
    }
  });

  it('generates correct multi-generation structure for large trees', () => {
    const { people, relationships } = generateLargeTree(100);

    const result = computeLayout(people, relationships, 'root_m');

    const generations = new Set(result.nodes.map((n) => n.generation));
    // Should have at least 3 generations for a 100-node tree
    expect(generations.size).toBeGreaterThanOrEqual(3);

    // Should have both spouse and parent edges
    const spouseEdges = result.edges.filter((e) => e.type === 'spouse');
    const parentEdges = result.edges.filter((e) => e.type === 'parent');
    expect(spouseEdges.length).toBeGreaterThan(0);
    expect(parentEdges.length).toBeGreaterThan(0);
  });
});
