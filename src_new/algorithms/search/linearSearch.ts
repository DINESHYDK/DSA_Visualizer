import { ArrayElement, SortingStep } from '../../types';
import { generateId } from '../../utils';

export interface LinearSearchResult {
  steps: SortingStep[];
  metrics: {
    comparisons: number;
    arrayAccesses: number;
    found: boolean;
    foundIndex: number;
  };
}

export const linearSearch = (initialArray: number[], target: number): LinearSearchResult => {
  const array = [...initialArray];
  const steps: SortingStep[] = [];
  const metrics = {
    comparisons: 0,
    arrayAccesses: 0,
    found: false,
    foundIndex: -1
  };

  // Add initial state
  steps.push({
    type: 'highlight',
    indices: [],
    values: [...array],
    description: `Starting Linear Search for target value: ${target}`
  });

  // Search through each element
  for (let i = 0; i < array.length; i++) {
    // Highlight current element being checked
    steps.push({
      type: 'compare',
      indices: [i],
      values: [...array],
      description: `Checking element at index ${i}: ${array[i]} ${array[i] === target ? '==' : '!='} ${target}`
    });

    metrics.comparisons++;
    metrics.arrayAccesses++;

    if (array[i] === target) {
      // Found the target
      steps.push({
        type: 'set',
        indices: [i],
        values: [...array],
        description: `Target ${target} found at index ${i}!`
      });
      
      metrics.found = true;
      metrics.foundIndex = i;
      break;
    } else {
      // Continue searching
      steps.push({
        type: 'highlight',
        indices: [i],
        values: [...array],
        description: `${array[i]} ≠ ${target}, continue searching...`
      });
    }
  }

  // Add completion message
  if (metrics.found) {
    steps.push({
      type: 'set',
      indices: [metrics.foundIndex],
      values: [...array],
      description: `Linear Search completed! Target ${target} found at index ${metrics.foundIndex}.`
    });
  } else {
    steps.push({
      type: 'highlight',
      indices: [],
      values: [...array],
      description: `Linear Search completed! Target ${target} not found in the array.`
    });
  }

  return { steps, metrics };
};

export const createLinearSearchElements = (values: number[]): ArrayElement[] => {
  return values.map((value, index) => ({
    value,
    id: generateId(),
    state: 'default',
    index
  }));
};

export const linearSearchInfo = {
  name: 'Linear Search',
  description: 'A simple search algorithm that checks each element sequentially until the target is found or the end is reached.',
  timeComplexity: {
    best: 'O(1)',
    average: 'O(n)',
    worst: 'O(n)'
  },
  spaceComplexity: 'O(1)',
  stable: true,
  inPlace: true
};