import { describe, it, expect } from 'vitest';
import { computeLayout } from '../../src/layout/familyLayout';
import type { Person, Relationship } from '../../src/types';

describe('complex tree scenarios', () => {
  describe('multi-marriage child grouping', () => {
    const people: Person[] = [
      { id: 'p', name: 'Central Person' },
      { id: 's1', name: 'Spouse 1' },
      { id: 's2', name: 'Spouse 2' },
      { id: 'c1a', name: 'Child 1A (P+S1)' },
      { id: 'c1b', name: 'Child 1B (P+S1)' },
      { id: 'c2a', name: 'Child 2A (P+S2)' },
    ];

    const relationships: Relationship[] = [
      { from: 'p', to: 's1', type: 'spouse' },
      { from: 'p', to: 's2', type: 'spouse' },
      // Children of first marriage
      { from: 'p', to: 'c1a', type: 'parent' },
      { from: 's1', to: 'c1a', type: 'parent' },
      { from: 'p', to: 'c1b', type: 'parent' },
      { from: 's1', to: 'c1b', type: 'parent' },
      // Child of second marriage
      { from: 'p', to: 'c2a', type: 'parent' },
      { from: 's2', to: 'c2a', type: 'parent' },
    ];

    it('places all parents in same generation', () => {
      const result = computeLayout(people, relationships, 'p');

      const p = result.nodes.find((n) => n.id === 'p')!;
      const s1 = result.nodes.find((n) => n.id === 's1')!;
      const s2 = result.nodes.find((n) => n.id === 's2')!;

      expect(p.y).toBe(s1.y);
      expect(p.y).toBe(s2.y);
    });

    it('places all children below parents', () => {
      const result = computeLayout(people, relationships, 'p');

      const p = result.nodes.find((n) => n.id === 'p')!;
      const c1a = result.nodes.find((n) => n.id === 'c1a')!;
      const c1b = result.nodes.find((n) => n.id === 'c1b')!;
      const c2a = result.nodes.find((n) => n.id === 'c2a')!;

      expect(c1a.y).toBeGreaterThan(p.y);
      expect(c1b.y).toBeGreaterThan(p.y);
      expect(c2a.y).toBeGreaterThan(p.y);
      // All children same generation
      expect(c1a.y).toBe(c1b.y);
      expect(c1a.y).toBe(c2a.y);
    });

    it('creates correct number of edges', () => {
      const result = computeLayout(people, relationships, 'p');

      // 2 spouse edges + 6 parent edges = 8 total
      // (p→c1a, s1→c1a, p→c1b, s1→c1b, p→c2a, s2→c2a) + (p↔s1, p↔s2)
      const spouseEdges = result.edges.filter((e) => e.type === 'spouse');
      const parentEdges = result.edges.filter((e) => e.type === 'parent');

      expect(spouseEdges).toHaveLength(2);
      expect(parentEdges).toHaveLength(6);
    });
  });

  describe('half-siblings', () => {
    it('handles half-siblings (shared parent, different other parent)', () => {
      const people: Person[] = [
        { id: 'dad', name: 'Dad' },
        { id: 'mom1', name: 'Mom 1' },
        { id: 'mom2', name: 'Mom 2' },
        { id: 'child1', name: 'Child 1 (Dad+Mom1)' },
        { id: 'child2', name: 'Child 2 (Dad+Mom2)' },
      ];

      const relationships: Relationship[] = [
        { from: 'dad', to: 'mom1', type: 'spouse' },
        { from: 'dad', to: 'mom2', type: 'spouse' },
        { from: 'dad', to: 'child1', type: 'parent' },
        { from: 'mom1', to: 'child1', type: 'parent' },
        { from: 'dad', to: 'child2', type: 'parent' },
        { from: 'mom2', to: 'child2', type: 'parent' },
      ];

      const result = computeLayout(people, relationships, 'dad');
      expect(result.nodes).toHaveLength(5);

      const child1 = result.nodes.find((n) => n.id === 'child1')!;
      const child2 = result.nodes.find((n) => n.id === 'child2')!;

      // Both children in same generation
      expect(child1.y).toBe(child2.y);
      // But at different x positions
      expect(child1.x).not.toBe(child2.x);
    });
  });

  describe('step-children', () => {
    it('handles step-parent/step-child relationships', () => {
      const people: Person[] = [
        { id: 'bio_dad', name: 'Bio Dad' },
        { id: 'mom', name: 'Mom' },
        { id: 'step_dad', name: 'Step Dad' },
        { id: 'child', name: 'Child' },
      ];

      const relationships: Relationship[] = [
        { from: 'bio_dad', to: 'child', type: 'parent' },
        { from: 'mom', to: 'child', type: 'parent' },
        { from: 'mom', to: 'step_dad', type: 'spouse' },
        { from: 'step_dad', to: 'child', type: 'step_parent' },
      ];

      const result = computeLayout(people, relationships);
      expect(result.nodes).toHaveLength(4);

      const child = result.nodes.find((n) => n.id === 'child')!;
      const mom = result.nodes.find((n) => n.id === 'mom')!;
      expect(child.y).toBeGreaterThan(mom.y);
    });
  });

  describe('20+ person tree', () => {
    // Build a realistic extended family
    const people: Person[] = [
      // Generation 0 (grandparents)
      { id: 'gp1', name: 'Grandfather 1', gender: 'male', birthYear: 1930, deathYear: 2010 },
      { id: 'gm1', name: 'Grandmother 1', gender: 'female', birthYear: 1932 },
      { id: 'gp2', name: 'Grandfather 2', gender: 'male', birthYear: 1928, deathYear: 2005 },
      { id: 'gm2', name: 'Grandmother 2', gender: 'female', birthYear: 1931 },
      // Generation 1 (parents, aunts, uncles)
      { id: 'dad', name: 'Father', gender: 'male', birthYear: 1955 },
      { id: 'mom', name: 'Mother', gender: 'female', birthYear: 1958 },
      { id: 'uncle1', name: 'Uncle 1', gender: 'male', birthYear: 1953 },
      { id: 'aunt1', name: 'Aunt 1', gender: 'female', birthYear: 1956 },
      { id: 'uncle2', name: 'Uncle 2', gender: 'male', birthYear: 1960 },
      { id: 'aunt2', name: 'Aunt 2', gender: 'female', birthYear: 1957 },
      // Generation 2 (self, siblings, cousins)
      { id: 'me', name: 'Me', gender: 'male', birthYear: 1985 },
      { id: 'sister', name: 'Sister', gender: 'female', birthYear: 1988 },
      { id: 'brother', name: 'Brother', gender: 'male', birthYear: 1990 },
      { id: 'cousin1', name: 'Cousin 1', gender: 'male', birthYear: 1983 },
      { id: 'cousin2', name: 'Cousin 2', gender: 'female', birthYear: 1986 },
      { id: 'cousin3', name: 'Cousin 3', gender: 'male', birthYear: 1989 },
      { id: 'cousin4', name: 'Cousin 4', gender: 'female', birthYear: 1984 },
      // Generation 2 spouses
      { id: 'spouse_me', name: 'My Wife', gender: 'female', birthYear: 1987 },
      { id: 'spouse_c1', name: 'Cousin1 Wife', gender: 'female', birthYear: 1985 },
      // Generation 3 (children)
      { id: 'kid1', name: 'My Child 1', gender: 'female', birthYear: 2015 },
      { id: 'kid2', name: 'My Child 2', gender: 'male', birthYear: 2018 },
      { id: 'kid3', name: 'Cousin1 Child', gender: 'male', birthYear: 2012 },
    ];

    const relationships: Relationship[] = [
      // Grandparent marriages
      { from: 'gp1', to: 'gm1', type: 'spouse' },
      { from: 'gp2', to: 'gm2', type: 'spouse' },
      // Grandparents → parents
      { from: 'gp1', to: 'dad', type: 'parent' },
      { from: 'gm1', to: 'dad', type: 'parent' },
      { from: 'gp1', to: 'uncle1', type: 'parent' },
      { from: 'gm1', to: 'uncle1', type: 'parent' },
      { from: 'gp2', to: 'mom', type: 'parent' },
      { from: 'gm2', to: 'mom', type: 'parent' },
      { from: 'gp2', to: 'aunt2', type: 'parent' },
      { from: 'gm2', to: 'aunt2', type: 'parent' },
      // Parent marriages
      { from: 'dad', to: 'mom', type: 'spouse' },
      { from: 'uncle1', to: 'aunt1', type: 'spouse' },
      { from: 'uncle2', to: 'aunt2', type: 'spouse' },
      // Parents → children
      { from: 'dad', to: 'me', type: 'parent' },
      { from: 'mom', to: 'me', type: 'parent' },
      { from: 'dad', to: 'sister', type: 'parent' },
      { from: 'mom', to: 'sister', type: 'parent' },
      { from: 'dad', to: 'brother', type: 'parent' },
      { from: 'mom', to: 'brother', type: 'parent' },
      { from: 'uncle1', to: 'cousin1', type: 'parent' },
      { from: 'aunt1', to: 'cousin1', type: 'parent' },
      { from: 'uncle1', to: 'cousin2', type: 'parent' },
      { from: 'aunt1', to: 'cousin2', type: 'parent' },
      { from: 'uncle2', to: 'cousin3', type: 'parent' },
      { from: 'aunt2', to: 'cousin3', type: 'parent' },
      { from: 'uncle2', to: 'cousin4', type: 'parent' },
      { from: 'aunt2', to: 'cousin4', type: 'parent' },
      // Gen 2 marriages
      { from: 'me', to: 'spouse_me', type: 'spouse' },
      { from: 'cousin1', to: 'spouse_c1', type: 'spouse' },
      // Gen 2 → Gen 3
      { from: 'me', to: 'kid1', type: 'parent' },
      { from: 'spouse_me', to: 'kid1', type: 'parent' },
      { from: 'me', to: 'kid2', type: 'parent' },
      { from: 'spouse_me', to: 'kid2', type: 'parent' },
      { from: 'cousin1', to: 'kid3', type: 'parent' },
      { from: 'spouse_c1', to: 'kid3', type: 'parent' },
    ];

    it('positions all 22 people without crashing', () => {
      const result = computeLayout(people, relationships, 'gp1');

      expect(result.nodes).toHaveLength(22);
      expect(result.width).toBeGreaterThan(0);
      expect(result.height).toBeGreaterThan(0);
    });

    it('has 4 generations vertically', () => {
      const result = computeLayout(people, relationships, 'gp1');

      const generations = new Set(result.nodes.map((n) => n.generation));
      expect(generations.size).toBeGreaterThanOrEqual(4);
    });

    it('places grandparents above parents above children', () => {
      const result = computeLayout(people, relationships, 'gp1');

      const gp1 = result.nodes.find((n) => n.id === 'gp1')!;
      const dad = result.nodes.find((n) => n.id === 'dad')!;
      const me = result.nodes.find((n) => n.id === 'me')!;
      const kid1 = result.nodes.find((n) => n.id === 'kid1')!;

      expect(gp1.y).toBeLessThan(dad.y);
      expect(dad.y).toBeLessThan(me.y);
      expect(me.y).toBeLessThan(kid1.y);
    });

    it('deceased grandparents have correct metadata', () => {
      const result = computeLayout(people, relationships, 'gp1');

      const gp1 = result.nodes.find((n) => n.id === 'gp1')!;
      expect(gp1.person.deathYear).toBe(2010);

      const gp2 = result.nodes.find((n) => n.id === 'gp2')!;
      expect(gp2.person.deathYear).toBe(2005);
    });

    it('generates edges for all relationships', () => {
      const result = computeLayout(people, relationships, 'gp1');

      const spouseEdges = result.edges.filter((e) => e.type === 'spouse');
      const parentEdges = result.edges.filter((e) => e.type === 'parent');

      // At least 5 spouse pairs (some may be shared through multi-marriage grouping)
      expect(spouseEdges.length).toBeGreaterThanOrEqual(5);
      // Many parent edges
      expect(parentEdges.length).toBeGreaterThanOrEqual(20);
    });

    it('all nodes have finite positions', () => {
      const result = computeLayout(people, relationships, 'gp1');

      for (const node of result.nodes) {
        expect(Number.isFinite(node.x)).toBe(true);
        expect(Number.isFinite(node.y)).toBe(true);
        expect(node.x).toBeGreaterThanOrEqual(0);
        expect(node.y).toBeGreaterThanOrEqual(0);
      }
    });
  });
});
