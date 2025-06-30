import { ArrayElement, SortingStep } from '../../types';
import { generateId } from '../../utils';

export interface InsertionSortResult {
  steps: SortingStep[];
  metrics: {
    comparisons: number;
    swaps: number;
    arrayAccesses: number;
  };
}

export const insertionSort = (initialArray: number[]): InsertionSortResult => {
  const array = [...initialArray];
  const steps: SortingStep[] = [];
  const metrics = {
    comparisons: 0,
    swaps: 0,
    arrayAccesses: 0
  };

  const n = array.length;

  // Add initial state
  steps.push({
    type: 'highlight',
    indices: [0],
    values: [...array],
    description: 'Starting Insertion Sort - First element is considered sorted'
  });

  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;

    // Show current element being inserted
    steps.push({
      type: 'highlight',
      indices: [i],
      values: [...array],
      description: `Inserting element ${key} into the sorted portion`
    });

    // Mark sorted and unsorted regions
    steps.push({
      type: 'set',
      indices: Array.from({ length: i }, (_, idx) => idx),
      values: [...array],
      description: `Sorted region: [0...${i-1}], Current element: ${key} at position ${i}`
    });

    metrics.arrayAccesses++;

    // Find the correct position for the key
    while (j >= 0) {
      // Compare key with current element
      steps.push({
        type: 'compare',
        indices: [j, i],
        values: [...array],
        description: `Comparing ${key} with ${array[j]} at position ${j}`
      });

      metrics.comparisons++;
      metrics.arrayAccesses++;

      if (array[j] > key) {
        // Shift element to the right
        steps.push({
          type: 'swap',
          indices: [j, j + 1],
          values: [...array],
          description: `${array[j]} > ${key}, shifting ${array[j]} to the right`
        });

        array[j + 1] = array[j];
        metrics.swaps++;
        metrics.arrayAccesses += 2;
        j--;
      } else {
        // Found the correct position
        steps.push({
          type: 'highlight',
          indices: [j + 1],
          values: [...array],
          description: `Found correct position for ${key} at index ${j + 1}`
        });
        break;
      }
    }

    // Insert the key at the correct position
    array[j + 1] = key;
    metrics.arrayAccesses++;

    steps.push({
      type: 'set',
      indices: [j + 1],
      values: [...array],
      description: `Inserted ${key} at position ${j + 1}`
    });

    // Show updated sorted region
    steps.push({
      type: 'set',
      indices: Array.from({ length: i + 1 }, (_, idx) => idx),
      values: [...array],
      description: `Sorted region expanded: [0...${i}]`
    });
  }

  // Mark all elements as sorted
  steps.push({
    type: 'set',
    indices: Array.from({ length: n }, (_, i) => i),
    values: [...array],
    description: 'Insertion Sort completed! All elements are now sorted.'
  });

  return { steps, metrics };
};

export const createInsertionSortElements = (values: number[]): ArrayElement[] => {
  return values.map((value, index) => ({
    value,
    id: generateId(),
    state: 'default',
    index
  }));
};

export const insertionSortInfo = {
  name: 'Insertion Sort',
  description: 'Builds the final sorted array one element at a time by inserting each element into its correct position within the already sorted portion.',
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)'
  },
  spaceComplexity: 'O(1)',
  stable: true,
  inPlace: true
};