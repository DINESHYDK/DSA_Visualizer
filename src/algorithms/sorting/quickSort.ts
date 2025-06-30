import { ArrayElement, SortingStep } from '../../types';
import { generateId } from '../../utils';

export interface QuickSortResult {
  steps: SortingStep[];
  metrics: {
    comparisons: number;
    swaps: number;
    arrayAccesses: number;
  };
}

export const quickSort = (initialArray: number[]): QuickSortResult => {
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
    description: 'Starting Quick Sort - Partition-based divide and conquer'
  });

  const partition = (arr: number[], low: number, high: number): number => {
    const pivot = arr[high];
    
    // Show pivot selection
    steps.push({
      type: 'highlight',
      indices: [high],
      values: [...arr],
      description: `Selected pivot: ${pivot} at position ${high}`
    });

    let i = low - 1;

    // Show partitioning region
    steps.push({
      type: 'highlight',
      indices: Array.from({ length: high - low + 1 }, (_, idx) => low + idx),
      values: [...arr],
      description: `Partitioning region [${low}...${high}] around pivot ${pivot}`
    });

    for (let j = low; j < high; j++) {
      // Compare with pivot
      steps.push({
        type: 'compare',
        indices: [j, high],
        values: [...arr],
        description: `Comparing ${arr[j]} with pivot ${pivot}`
      });

      metrics.comparisons++;
      metrics.arrayAccesses += 2;

      if (arr[j] < pivot) {
        i++;
        
        if (i !== j) {
          // Swap elements
          steps.push({
            type: 'swap',
            indices: [i, j],
            values: [...arr],
            description: `${arr[j]} < ${pivot}, swapping ${arr[i]} and ${arr[j]}`
          });

          [arr[i], arr[j]] = [arr[j], arr[i]];
          metrics.swaps++;
          metrics.arrayAccesses += 2;
        } else {
          steps.push({
            type: 'highlight',
            indices: [j],
            values: [...arr],
            description: `${arr[j]} < ${pivot}, element already in correct position`
          });
        }
      }
    }

    // Place pivot in correct position
    if (i + 1 !== high) {
      steps.push({
        type: 'swap',
        indices: [i + 1, high],
        values: [...arr],
        description: `Placing pivot ${pivot} in its correct position ${i + 1}`
      });

      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      metrics.swaps++;
      metrics.arrayAccesses += 2;
    }

    // Show pivot in final position
    steps.push({
      type: 'set',
      indices: [i + 1],
      values: [...arr],
      description: `Pivot ${pivot} is now in its final sorted position ${i + 1}`
    });

    return i + 1;
  };

  const quickSortRecursive = (arr: number[], low: number, high: number) => {
    if (low < high) {
      // Show current subarray being sorted
      steps.push({
        type: 'highlight',
        indices: Array.from({ length: high - low + 1 }, (_, i) => low + i),
        values: [...arr],
        description: `Sorting subarray [${low}...${high}]`
      });

      const pivotIndex = partition(arr, low, high);

      // Show partitioned result
      const leftIndices = Array.from({ length: pivotIndex - low }, (_, i) => low + i);
      const rightIndices = Array.from({ length: high - pivotIndex }, (_, i) => pivotIndex + 1 + i);
      
      if (leftIndices.length > 0) {
        steps.push({
          type: 'highlight',
          indices: leftIndices,
          values: [...arr],
          description: `Left partition [${low}...${pivotIndex - 1}]: elements ≤ ${arr[pivotIndex]}`
        });
      }

      if (rightIndices.length > 0) {
        steps.push({
          type: 'highlight',
          indices: rightIndices,
          values: [...arr],
          description: `Right partition [${pivotIndex + 1}...${high}]: elements > ${arr[pivotIndex]}`
        });
      }

      // Recursively sort partitions
      quickSortRecursive(arr, low, pivotIndex - 1);
      quickSortRecursive(arr, pivotIndex + 1, high);
    } else if (low === high) {
      // Single element is already sorted
      steps.push({
        type: 'set',
        indices: [low],
        values: [...arr],
        description: `Single element ${arr[low]} at position ${low} is sorted`
      });
    }
  };

  quickSortRecursive(array, 0, array.length - 1);

  // Mark all elements as sorted
  steps.push({
    type: 'set',
    indices: Array.from({ length: array.length }, (_, i) => i),
    values: [...array],
    description: 'Quick Sort completed! All elements are now sorted.'
  });

  return { steps, metrics };
};

export const createQuickSortElements = (values: number[]): ArrayElement[] => {
  return values.map((value, index) => ({
    value,
    id: generateId(),
    state: 'default',
    index
  }));
};

export const quickSortInfo = {
  name: 'Quick Sort',
  description: 'A divide-and-conquer algorithm that selects a pivot element and partitions the array around it, then recursively sorts the partitions.',
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n²)'
  },
  spaceComplexity: 'O(log n)',
  stable: false,
  inPlace: true
};