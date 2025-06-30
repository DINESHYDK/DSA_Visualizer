import { ArrayElement, SortingStep } from '../../types';
import { generateId } from '../../utils';

export interface HeapSortResult {
  steps: SortingStep[];
  metrics: {
    comparisons: number;
    swaps: number;
    arrayAccesses: number;
  };
}

export const heapSort = (initialArray: number[]): HeapSortResult => {
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
    description: 'Starting Heap Sort - Building max heap then extracting elements'
  });

  // Helper function to heapify a subtree rooted at index i
  const heapify = (arr: number[], size: number, rootIndex: number) => {
    let largest = rootIndex;
    const left = 2 * rootIndex + 1;
    const right = 2 * rootIndex + 2;

    // Show current node being heapified
    steps.push({
      type: 'highlight',
      indices: [rootIndex],
      values: [...arr],
      description: `Heapifying subtree rooted at index ${rootIndex} (value: ${arr[rootIndex]})`
    });

    // Check if left child exists and is greater than root
    if (left < size) {
      steps.push({
        type: 'compare',
        indices: [left, largest],
        values: [...arr],
        description: `Comparing left child ${arr[left]} at index ${left} with current largest ${arr[largest]}`
      });

      metrics.comparisons++;
      metrics.arrayAccesses += 2;

      if (arr[left] > arr[largest]) {
        largest = left;
        steps.push({
          type: 'highlight',
          indices: [left],
          values: [...arr],
          description: `Left child ${arr[left]} is larger, updating largest to index ${left}`
        });
      }
    }

    // Check if right child exists and is greater than current largest
    if (right < size) {
      steps.push({
        type: 'compare',
        indices: [right, largest],
        values: [...arr],
        description: `Comparing right child ${arr[right]} at index ${right} with current largest ${arr[largest]}`
      });

      metrics.comparisons++;
      metrics.arrayAccesses += 2;

      if (arr[right] > arr[largest]) {
        largest = right;
        steps.push({
          type: 'highlight',
          indices: [right],
          values: [...arr],
          description: `Right child ${arr[right]} is larger, updating largest to index ${right}`
        });
      }
    }

    // If largest is not root, swap and continue heapifying
    if (largest !== rootIndex) {
      steps.push({
        type: 'swap',
        indices: [rootIndex, largest],
        values: [...arr],
        description: `Swapping ${arr[rootIndex]} at index ${rootIndex} with ${arr[largest]} at index ${largest}`
      });

      [arr[rootIndex], arr[largest]] = [arr[largest], arr[rootIndex]];
      metrics.swaps++;
      metrics.arrayAccesses += 2;

      // Show heap property restoration
      steps.push({
        type: 'highlight',
        indices: [rootIndex, largest],
        values: [...arr],
        description: `Heap property restored at index ${rootIndex}, continuing heapify at index ${largest}`
      });

      // Recursively heapify the affected subtree
      heapify(arr, size, largest);
    } else {
      steps.push({
        type: 'highlight',
        indices: [rootIndex],
        values: [...arr],
        description: `Heap property already satisfied at index ${rootIndex}`
      });
    }
  };

  // Build max heap (rearrange array)
  steps.push({
    type: 'highlight',
    indices: Array.from({ length: n }, (_, i) => i),
    values: [...array],
    description: 'Phase 1: Building max heap from bottom up'
  });

  // Start from the last non-leaf node and heapify each node
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    steps.push({
      type: 'highlight',
      indices: [i],
      values: [...array],
      description: `Building heap: Processing node at index ${i} (last non-leaf: ${Math.floor(n / 2) - 1})`
    });
    heapify(array, n, i);
  }

  // Show completed max heap
  steps.push({
    type: 'set',
    indices: Array.from({ length: n }, (_, i) => i),
    values: [...array],
    description: 'Max heap construction complete! Largest element is at root (index 0)'
  });

  // Extract elements from heap one by one
  steps.push({
    type: 'highlight',
    indices: [],
    values: [...array],
    description: 'Phase 2: Extracting elements from heap in sorted order'
  });

  for (let i = n - 1; i > 0; i--) {
    // Move current root (maximum) to end
    steps.push({
      type: 'swap',
      indices: [0, i],
      values: [...array],
      description: `Extracting maximum ${array[0]} from heap root to position ${i}`
    });

    [array[0], array[i]] = [array[i], array[0]];
    metrics.swaps++;
    metrics.arrayAccesses += 2;

    // Mark extracted element as sorted
    steps.push({
      type: 'set',
      indices: [i],
      values: [...array],
      description: `Element ${array[i]} is now in its final sorted position ${i}`
    });

    // Show remaining heap
    if (i > 1) {
      steps.push({
        type: 'highlight',
        indices: Array.from({ length: i }, (_, idx) => idx),
        values: [...array],
        description: `Remaining heap size: ${i}, restoring heap property`
      });
    }

    // Call heapify on the reduced heap
    heapify(array, i, 0);
  }

  // Mark all elements as sorted
  steps.push({
    type: 'set',
    indices: Array.from({ length: n }, (_, i) => i),
    values: [...array],
    description: 'Heap Sort completed! All elements are now sorted.'
  });

  return { steps, metrics };
};

export const createHeapSortElements = (values: number[]): ArrayElement[] => {
  return values.map((value, index) => ({
    value,
    id: generateId(),
    state: 'default',
    index
  }));
};

export const heapSortInfo = {
  name: 'Heap Sort',
  description: 'A comparison-based sorting algorithm that uses a binary heap data structure. It builds a max heap and repeatedly extracts the maximum element.',
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)'
  },
  spaceComplexity: 'O(1)',
  stable: false,
  inPlace: true
};