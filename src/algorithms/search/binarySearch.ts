import { ArrayElement, SortingStep } from '../../types';
import { generateId } from '../../utils';

export interface BinarySearchResult {
  steps: SortingStep[];
  metrics: {
    comparisons: number;
    arrayAccesses: number;
    found: boolean;
    foundIndex: number;
  };
}

export const binarySearch = (initialArray: number[], target: number): BinarySearchResult => {
  const array = [...initialArray];
  const steps: SortingStep[] = [];
  const metrics = {
    comparisons: 0,
    arrayAccesses: 0,
    found: false,
    foundIndex: -1
  };

  // Check if array is sorted
  const isSorted = array.every((val, i) => i === 0 || array[i - 1] <= val);
  
  if (!isSorted) {
    steps.push({
      type: 'highlight',
      indices: [],
      values: [...array],
      description: 'Warning: Array must be sorted for Binary Search to work correctly!'
    });
    // Sort the array for demonstration
    array.sort((a, b) => a - b);
    steps.push({
      type: 'set',
      indices: Array.from({ length: array.length }, (_, i) => i),
      values: [...array],
      description: 'Array has been sorted for Binary Search demonstration'
    });
  }

  // Add initial state
  steps.push({
    type: 'highlight',
    indices: [],
    values: [...array],
    description: `Starting Binary Search for target value: ${target}`
  });

  let left = 0;
  let right = array.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    // Show current search range
    const rangeIndices = Array.from({ length: right - left + 1 }, (_, i) => left + i);
    steps.push({
      type: 'highlight',
      indices: rangeIndices,
      values: [...array],
      description: `Search range: [${left}...${right}], checking middle element at index ${mid}`
    });

    // Highlight middle element
    steps.push({
      type: 'compare',
      indices: [mid],
      values: [...array],
      description: `Comparing middle element: ${array[mid]} ${array[mid] === target ? '==' : array[mid] < target ? '<' : '>'} ${target}`
    });

    metrics.comparisons++;
    metrics.arrayAccesses++;

    if (array[mid] === target) {
      // Found the target
      steps.push({
        type: 'set',
        indices: [mid],
        values: [...array],
        description: `Target ${target} found at index ${mid}!`
      });
      
      metrics.found = true;
      metrics.foundIndex = mid;
      break;
    } else if (array[mid] < target) {
      // Target is in the right half
      steps.push({
        type: 'highlight',
        indices: [mid],
        values: [...array],
        description: `${array[mid]} < ${target}, search right half [${mid + 1}...${right}]`
      });
      left = mid + 1;
    } else {
      // Target is in the left half
      steps.push({
        type: 'highlight',
        indices: [mid],
        values: [...array],
        description: `${array[mid]} > ${target}, search left half [${left}...${mid - 1}]`
      });
      right = mid - 1;
    }
  }

  // Add completion message
  if (metrics.found) {
    steps.push({
      type: 'set',
      indices: [metrics.foundIndex],
      values: [...array],
      description: `Binary Search completed! Target ${target} found at index ${metrics.foundIndex}.`
    });
  } else {
    steps.push({
      type: 'highlight',
      indices: [],
      values: [...array],
      description: `Binary Search completed! Target ${target} not found in the array.`
    });
  }

  return { steps, metrics };
};

export const createBinarySearchElements = (values: number[]): ArrayElement[] => {
  return values.map((value, index) => ({
    value,
    id: generateId(),
    state: 'default',
    index
  }));
};

export const binarySearchInfo = {
  name: 'Binary Search',
  description: 'An efficient search algorithm that works on sorted arrays by repeatedly dividing the search interval in half.',
  timeComplexity: {
    best: 'O(1)',
    average: 'O(log n)',
    worst: 'O(log n)'
  },
  spaceComplexity: 'O(1)',
  stable: true,
  inPlace: true
};