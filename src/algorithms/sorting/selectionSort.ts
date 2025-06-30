import { ArrayElement, SortingStep } from '../../types';
import { generateId } from '../../utils';

export interface SelectionSortResult {
  steps: SortingStep[];
  metrics: {
    comparisons: number;
    swaps: number;
    arrayAccesses: number;
  };
}

export const selectionSort = (initialArray: number[]): SelectionSortResult => {
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
    indices: [],
    values: [...array],
    description: 'Starting Selection Sort - We will find the minimum element and place it at the beginning'
  });

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    
    // Show current position being filled
    steps.push({
      type: 'highlight',
      indices: [i],
      values: [...array],
      description: `Finding minimum element for position ${i}`
    });

    // Mark current minimum
    steps.push({
      type: 'compare',
      indices: [minIndex],
      values: [...array],
      description: `Current minimum: ${array[minIndex]} at position ${minIndex}`
    });

    // Find minimum element in remaining unsorted array
    for (let j = i + 1; j < n; j++) {
      // Compare with current minimum
      steps.push({
        type: 'compare',
        indices: [minIndex, j],
        values: [...array],
        description: `Comparing minimum ${array[minIndex]} with ${array[j]}`
      });
      
      metrics.comparisons++;
      metrics.arrayAccesses += 2;

      if (array[j] < array[minIndex]) {
        // Update minimum index
        minIndex = j;
        
        steps.push({
          type: 'highlight',
          indices: [minIndex],
          values: [...array],
          description: `New minimum found: ${array[minIndex]} at position ${minIndex}`
        });
      }
    }

    // Swap if minimum is not at current position
    if (minIndex !== i) {
      steps.push({
        type: 'swap',
        indices: [i, minIndex],
        values: [...array],
        description: `Swapping ${array[i]} at position ${i} with minimum ${array[minIndex]} at position ${minIndex}`
      });

      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      metrics.swaps++;
      metrics.arrayAccesses += 2;
    } else {
      steps.push({
        type: 'highlight',
        indices: [i],
        values: [...array],
        description: `${array[i]} is already in correct position`
      });
    }

    // Mark current position as sorted
    steps.push({
      type: 'set',
      indices: [i],
      values: [...array],
      description: `Position ${i} is now sorted with value ${array[i]}`
    });
  }

  // Mark all elements as sorted
  steps.push({
    type: 'set',
    indices: Array.from({ length: n }, (_, i) => i),
    values: [...array],
    description: 'Selection Sort completed! All elements are now sorted.'
  });

  return { steps, metrics };
};

export const createSelectionSortElements = (values: number[]): ArrayElement[] => {
  return values.map((value, index) => ({
    value,
    id: generateId(),
    state: 'default',
    index
  }));
};

export const selectionSortInfo = {
  name: 'Selection Sort',
  description: 'A sorting algorithm that divides the list into sorted and unsorted regions, repeatedly selecting the smallest element from the unsorted region.',
  timeComplexity: {
    best: 'O(n²)',
    average: 'O(n²)',
    worst: 'O(n²)'
  },
  spaceComplexity: 'O(1)',
  stable: false,
  inPlace: true
};