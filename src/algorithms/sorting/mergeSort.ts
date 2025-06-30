import { ArrayElement, SortingStep } from '../../types';
import { generateId } from '../../utils';

export interface MergeSortResult {
  steps: SortingStep[];
  metrics: {
    comparisons: number;
    swaps: number;
    arrayAccesses: number;
  };
}

export const mergeSort = (initialArray: number[]): MergeSortResult => {
  const array = [...initialArray];
  const steps: SortingStep[] = [];
  const metrics = {
    comparisons: 0,
    swaps: 0,
    arrayAccesses: 0
  };

  // Add initial state
  steps.push({
    type: 'highlight',
    indices: [],
    values: [...array],
    description: 'Starting Merge Sort - Divide and conquer approach'
  });

  const merge = (arr: number[], left: number, mid: number, right: number) => {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    
    // Show the arrays being merged
    steps.push({
      type: 'highlight',
      indices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      values: [...arr],
      description: `Merging subarrays: [${left}...${mid}] and [${mid + 1}...${right}]`
    });

    let i = 0, j = 0, k = left;

    // Merge the two arrays
    while (i < leftArr.length && j < rightArr.length) {
      steps.push({
        type: 'compare',
        indices: [left + i, mid + 1 + j],
        values: [...arr],
        description: `Comparing ${leftArr[i]} and ${rightArr[j]}`
      });

      metrics.comparisons++;
      metrics.arrayAccesses += 2;

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        steps.push({
          type: 'set',
          indices: [k],
          values: [...arr],
          description: `Placing ${leftArr[i]} at position ${k}`
        });
        i++;
      } else {
        arr[k] = rightArr[j];
        steps.push({
          type: 'set',
          indices: [k],
          values: [...arr],
          description: `Placing ${rightArr[j]} at position ${k}`
        });
        j++;
      }
      
      metrics.arrayAccesses++;
      k++;
    }

    // Copy remaining elements from left array
    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      steps.push({
        type: 'set',
        indices: [k],
        values: [...arr],
        description: `Copying remaining element ${leftArr[i]} from left array`
      });
      metrics.arrayAccesses++;
      i++;
      k++;
    }

    // Copy remaining elements from right array
    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      steps.push({
        type: 'set',
        indices: [k],
        values: [...arr],
        description: `Copying remaining element ${rightArr[j]} from right array`
      });
      metrics.arrayAccesses++;
      j++;
      k++;
    }

    // Show merged result
    steps.push({
      type: 'set',
      indices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      values: [...arr],
      description: `Merged subarray [${left}...${right}] is now sorted`
    });
  };

  const mergeSortRecursive = (arr: number[], left: number, right: number) => {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);

      // Show division
      steps.push({
        type: 'highlight',
        indices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        values: [...arr],
        description: `Dividing array [${left}...${right}] at position ${mid}`
      });

      // Recursively sort both halves
      mergeSortRecursive(arr, left, mid);
      mergeSortRecursive(arr, mid + 1, right);

      // Merge the sorted halves
      merge(arr, left, mid, right);
    }
  };

  mergeSortRecursive(array, 0, array.length - 1);

  // Mark all elements as sorted
  steps.push({
    type: 'set',
    indices: Array.from({ length: array.length }, (_, i) => i),
    values: [...array],
    description: 'Merge Sort completed! All elements are now sorted.'
  });

  return { steps, metrics };
};

export const createMergeSortElements = (values: number[]): ArrayElement[] => {
  return values.map((value, index) => ({
    value,
    id: generateId(),
    state: 'default',
    index
  }));
};

export const mergeSortInfo = {
  name: 'Merge Sort',
  description: 'A divide-and-conquer algorithm that divides the array into halves, sorts them separately, and then merges them back together.',
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)'
  },
  spaceComplexity: 'O(n)',
  stable: true,
  inPlace: false
};