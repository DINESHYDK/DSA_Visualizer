import { ArrayElement, SortingStep } from '../../types';
import { generateId } from '../../utils';

export interface BubbleSortResult {
  steps: SortingStep[];
  metrics: {
    comparisons: number;
    swaps: number;
    arrayAccesses: number;
  };
}

export const bubbleSort = (initialArray: number[]): BubbleSortResult => {
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
    description: 'Starting Bubble Sort - We will compare adjacent elements and swap if they are in wrong order'
  });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    
    // Add step showing current pass
    steps.push({
      type: 'highlight',
      indices: [n - 1 - i],
      values: [...array],
      description: `Pass ${i + 1}: The last ${i} element${i !== 0 ? 's are' : ' is'} already sorted`
    });

    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      steps.push({
        type: 'compare',
        indices: [j, j + 1],
        values: [...array],
        description: `Comparing ${array[j]} and ${array[j + 1]}`
      });
      
      metrics.comparisons++;
      metrics.arrayAccesses += 2;

      if (array[j] > array[j + 1]) {
        // Swap elements
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        
        steps.push({
          type: 'swap',
          indices: [j, j + 1],
          values: [...array],
          description: `${array[j + 1]} > ${array[j]}, swapping them`
        });
        
        metrics.swaps++;
        metrics.arrayAccesses += 2;
        swapped = true;
      }
    }

    // Mark the last element as sorted
    steps.push({
      type: 'set',
      indices: [n - 1 - i],
      values: [...array],
      description: `Element ${array[n - 1 - i]} is now in its correct position`
    });

    // If no swapping occurred, array is sorted
    if (!swapped) {
      steps.push({
        type: 'highlight',
        indices: Array.from({ length: n - i - 1 }, (_, idx) => idx),
        values: [...array],
        description: 'No swaps needed - remaining elements are already sorted!'
      });
      break;
    }
  }

  // Mark all elements as sorted
  steps.push({
    type: 'set',
    indices: Array.from({ length: n }, (_, i) => i),
    values: [...array],
    description: 'Bubble Sort completed! All elements are now sorted.'
  });

  return { steps, metrics };
};

export const createBubbleSortElements = (values: number[]): ArrayElement[] => {
  return values.map((value, index) => ({
    value,
    id: generateId(),
    state: 'default',
    index
  }));
};

export const bubbleSortInfo = {
  name: 'Bubble Sort',
  description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)'
  },
  spaceComplexity: 'O(1)',
  stable: true,
  inPlace: true
};