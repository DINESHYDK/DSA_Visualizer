import React, { useState, useEffect } from 'react';
import { Code, Eye, EyeOff, Maximize2, Minimize2, Copy, Check } from 'lucide-react';

interface CodeDisplayProps {
  algorithm: 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick' | 'heap' | 'linear' | 'binary';
  currentStep?: number;
  totalSteps?: number;
  currentOperation?: string;
  className?: string;
}

interface CodeLine {
  line: number;
  code: string;
  indent: number;
  isActive?: boolean;
  isBreakpoint?: boolean;
  explanation?: string;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({
  algorithm,
  currentStep = 0,
  totalSteps = 0,
  currentOperation = '',
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExplanations, setShowExplanations] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeLines, setActiveLines] = useState<number[]>([]);

  // Algorithm pseudocode definitions
  const algorithmCode: Record<string, CodeLine[]> = {
    bubble: [
      { line: 1, code: 'function bubbleSort(array):', indent: 0, explanation: 'Start of bubble sort algorithm' },
      { line: 2, code: 'n = length(array)', indent: 1, explanation: 'Get the size of the array' },
      { line: 3, code: 'for i = 0 to n-2:', indent: 1, explanation: 'Outer loop for each pass' },
      { line: 4, code: 'swapped = false', indent: 2, explanation: 'Flag to track if any swaps occurred' },
      { line: 5, code: 'for j = 0 to n-i-2:', indent: 2, explanation: 'Inner loop for comparisons' },
      { line: 6, code: 'if array[j] > array[j+1]:', indent: 3, explanation: 'Compare adjacent elements' },
      { line: 7, code: 'swap(array[j], array[j+1])', indent: 4, explanation: 'Swap if they are in wrong order' },
      { line: 8, code: 'swapped = true', indent: 4, explanation: 'Mark that a swap occurred' },
      { line: 9, code: 'if not swapped: break', indent: 2, explanation: 'Early termination if no swaps' },
      { line: 10, code: 'return array', indent: 1, explanation: 'Return the sorted array' }
    ],
    selection: [
      { line: 1, code: 'function selectionSort(array):', indent: 0, explanation: 'Start of selection sort algorithm' },
      { line: 2, code: 'n = length(array)', indent: 1, explanation: 'Get the size of the array' },
      { line: 3, code: 'for i = 0 to n-2:', indent: 1, explanation: 'Outer loop for each position' },
      { line: 4, code: 'minIndex = i', indent: 2, explanation: 'Assume current position has minimum' },
      { line: 5, code: 'for j = i+1 to n-1:', indent: 2, explanation: 'Find minimum in remaining array' },
      { line: 6, code: 'if array[j] < array[minIndex]:', indent: 3, explanation: 'Compare with current minimum' },
      { line: 7, code: 'minIndex = j', indent: 4, explanation: 'Update minimum index' },
      { line: 8, code: 'if minIndex ≠ i:', indent: 2, explanation: 'Check if swap is needed' },
      { line: 9, code: 'swap(array[i], array[minIndex])', indent: 3, explanation: 'Place minimum at correct position' },
      { line: 10, code: 'return array', indent: 1, explanation: 'Return the sorted array' }
    ],
    insertion: [
      { line: 1, code: 'function insertionSort(array):', indent: 0, explanation: 'Start of insertion sort algorithm' },
      { line: 2, code: 'for i = 1 to n-1:', indent: 1, explanation: 'Start from second element' },
      { line: 3, code: 'key = array[i]', indent: 2, explanation: 'Current element to be inserted' },
      { line: 4, code: 'j = i - 1', indent: 2, explanation: 'Start comparing with previous element' },
      { line: 5, code: 'while j ≥ 0 and array[j] > key:', indent: 2, explanation: 'Find correct position for key' },
      { line: 6, code: 'array[j+1] = array[j]', indent: 3, explanation: 'Shift element to the right' },
      { line: 7, code: 'j = j - 1', indent: 3, explanation: 'Move to previous element' },
      { line: 8, code: 'array[j+1] = key', indent: 2, explanation: 'Insert key at correct position' },
      { line: 9, code: 'return array', indent: 1, explanation: 'Return the sorted array' }
    ],
    merge: [
      { line: 1, code: 'function mergeSort(array, left, right):', indent: 0, explanation: 'Recursive merge sort function' },
      { line: 2, code: 'if left < right:', indent: 1, explanation: 'Base case check' },
      { line: 3, code: 'mid = (left + right) / 2', indent: 2, explanation: 'Find middle point' },
      { line: 4, code: 'mergeSort(array, left, mid)', indent: 2, explanation: 'Sort left half' },
      { line: 5, code: 'mergeSort(array, mid+1, right)', indent: 2, explanation: 'Sort right half' },
      { line: 6, code: 'merge(array, left, mid, right)', indent: 2, explanation: 'Merge sorted halves' },
      { line: 7, code: '', indent: 0 },
      { line: 8, code: 'function merge(array, left, mid, right):', indent: 0, explanation: 'Merge two sorted subarrays' },
      { line: 9, code: 'leftArray = array[left...mid]', indent: 1, explanation: 'Copy left subarray' },
      { line: 10, code: 'rightArray = array[mid+1...right]', indent: 1, explanation: 'Copy right subarray' },
      { line: 11, code: 'i = 0, j = 0, k = left', indent: 1, explanation: 'Initialize pointers' },
      { line: 12, code: 'while i < leftSize and j < rightSize:', indent: 1, explanation: 'Merge elements in order' },
      { line: 13, code: 'if leftArray[i] ≤ rightArray[j]:', indent: 2, explanation: 'Compare elements' },
      { line: 14, code: 'array[k] = leftArray[i++]', indent: 3, explanation: 'Take from left array' },
      { line: 15, code: 'else: array[k] = rightArray[j++]', indent: 2, explanation: 'Take from right array' },
      { line: 16, code: 'k++', indent: 2, explanation: 'Move to next position' }
    ],
    quick: [
      { line: 1, code: 'function quickSort(array, low, high):', indent: 0, explanation: 'Recursive quick sort function' },
      { line: 2, code: 'if low < high:', indent: 1, explanation: 'Base case check' },
      { line: 3, code: 'pivotIndex = partition(array, low, high)', indent: 2, explanation: 'Partition around pivot' },
      { line: 4, code: 'quickSort(array, low, pivotIndex-1)', indent: 2, explanation: 'Sort left partition' },
      { line: 5, code: 'quickSort(array, pivotIndex+1, high)', indent: 2, explanation: 'Sort right partition' },
      { line: 6, code: '', indent: 0 },
      { line: 7, code: 'function partition(array, low, high):', indent: 0, explanation: 'Partition function' },
      { line: 8, code: 'pivot = array[high]', indent: 1, explanation: 'Choose last element as pivot' },
      { line: 9, code: 'i = low - 1', indent: 1, explanation: 'Index of smaller element' },
      { line: 10, code: 'for j = low to high-1:', indent: 1, explanation: 'Traverse through array' },
      { line: 11, code: 'if array[j] < pivot:', indent: 2, explanation: 'If element is smaller than pivot' },
      { line: 12, code: 'i++', indent: 3, explanation: 'Increment index of smaller element' },
      { line: 13, code: 'swap(array[i], array[j])', indent: 3, explanation: 'Swap elements' },
      { line: 14, code: 'swap(array[i+1], array[high])', indent: 1, explanation: 'Place pivot in correct position' },
      { line: 15, code: 'return i + 1', indent: 1, explanation: 'Return pivot index' }
    ],
    heap: [
      { line: 1, code: 'function heapSort(array):', indent: 0, explanation: 'Start of heap sort algorithm' },
      { line: 2, code: 'n = length(array)', indent: 1, explanation: 'Get array size' },
      { line: 3, code: 'buildMaxHeap(array)', indent: 1, explanation: 'Build max heap from array' },
      { line: 4, code: 'for i = n-1 down to 1:', indent: 1, explanation: 'Extract elements from heap' },
      { line: 5, code: 'swap(array[0], array[i])', indent: 2, explanation: 'Move max to end' },
      { line: 6, code: 'heapify(array, 0, i)', indent: 2, explanation: 'Restore heap property' },
      { line: 7, code: '', indent: 0 },
      { line: 8, code: 'function heapify(array, root, size):', indent: 0, explanation: 'Maintain heap property' },
      { line: 9, code: 'largest = root', indent: 1, explanation: 'Assume root is largest' },
      { line: 10, code: 'left = 2 * root + 1', indent: 1, explanation: 'Left child index' },
      { line: 11, code: 'right = 2 * root + 2', indent: 1, explanation: 'Right child index' },
      { line: 12, code: 'if left < size and array[left] > array[largest]:', indent: 1, explanation: 'Check left child' },
      { line: 13, code: 'largest = left', indent: 2, explanation: 'Update largest' },
      { line: 14, code: 'if right < size and array[right] > array[largest]:', indent: 1, explanation: 'Check right child' },
      { line: 15, code: 'largest = right', indent: 2, explanation: 'Update largest' },
      { line: 16, code: 'if largest ≠ root:', indent: 1, explanation: 'If heap property violated' },
      { line: 17, code: 'swap(array[root], array[largest])', indent: 2, explanation: 'Swap with largest child' },
      { line: 18, code: 'heapify(array, largest, size)', indent: 2, explanation: 'Recursively heapify' }
    ],
    linear: [
      { line: 1, code: 'function linearSearch(array, target):', indent: 0, explanation: 'Start of linear search algorithm' },
      { line: 2, code: 'n = length(array)', indent: 1, explanation: 'Get the size of the array' },
      { line: 3, code: 'for i = 0 to n-1:', indent: 1, explanation: 'Loop through each element' },
      { line: 4, code: 'if array[i] == target:', indent: 2, explanation: 'Check if current element matches target' },
      { line: 5, code: 'return i', indent: 3, explanation: 'Return index if found' },
      { line: 6, code: 'return -1', indent: 1, explanation: 'Return -1 if not found' }
    ],
    binary: [
      { line: 1, code: 'function binarySearch(array, target):', indent: 0, explanation: 'Start of binary search algorithm' },
      { line: 2, code: 'left = 0', indent: 1, explanation: 'Initialize left boundary' },
      { line: 3, code: 'right = length(array) - 1', indent: 1, explanation: 'Initialize right boundary' },
      { line: 4, code: 'while left ≤ right:', indent: 1, explanation: 'Continue while search space exists' },
      { line: 5, code: 'mid = (left + right) / 2', indent: 2, explanation: 'Calculate middle index' },
      { line: 6, code: 'if array[mid] == target:', indent: 2, explanation: 'Check if middle element is target' },
      { line: 7, code: 'return mid', indent: 3, explanation: 'Return index if found' },
      { line: 8, code: 'else if array[mid] < target:', indent: 2, explanation: 'If middle is less than target' },
      { line: 9, code: 'left = mid + 1', indent: 3, explanation: 'Search right half' },
      { line: 10, code: 'else:', indent: 2, explanation: 'If middle is greater than target' },
      { line: 11, code: 'right = mid - 1', indent: 3, explanation: 'Search left half' },
      { line: 12, code: 'return -1', indent: 1, explanation: 'Return -1 if not found' }
    ]
  };

  // Simulate active line highlighting based on current operation
  useEffect(() => {
    const code = algorithmCode[algorithm] || [];
    const newActiveLines: number[] = [];

    // Simple heuristic to highlight relevant lines based on operation description
    if (currentOperation.toLowerCase().includes('compar')) {
      // Highlighting comparison lines
      const comparisonLines = code.filter(line => 
        line.code.includes('if') && (line.code.includes('>') || line.code.includes('<') || line.code.includes('=='))
      ).map(line => line.line);
      newActiveLines.push(...comparisonLines);
    } else if (currentOperation.toLowerCase().includes('swap')) {
      // Highlighting swap lines
      const swapLines = code.filter(line => 
        line.code.includes('swap')
      ).map(line => line.line);
      newActiveLines.push(...swapLines);
    } else if (currentOperation.toLowerCase().includes('minimum') || currentOperation.toLowerCase().includes('min')) {
      // Highlighting minimum finding lines
      const minLines = code.filter(line => 
        line.code.includes('min') || line.code.includes('j = i+1')
      ).map(line => line.line);
      newActiveLines.push(...minLines);
    } else if (currentOperation.toLowerCase().includes('insert')) {
      // Highlighting insertion lines
      const insertLines = code.filter(line => 
        line.code.includes('key') || line.code.includes('array[j+1]')
      ).map(line => line.line);
      newActiveLines.push(...insertLines);
    } else if (currentOperation.toLowerCase().includes('partition')) {
      // Highlighting partition lines
      const partitionLines = code.filter(line => 
        line.code.includes('pivot') || line.code.includes('partition')
      ).map(line => line.line);
      newActiveLines.push(...partitionLines);
    } else if (currentOperation.toLowerCase().includes('heap')) {
      // Highlighting heap lines
      const heapLines = code.filter(line => 
        line.code.includes('heapify') || line.code.includes('largest')
      ).map(line => line.line);
      newActiveLines.push(...heapLines);
    } else if (currentOperation.toLowerCase().includes('checking') || currentOperation.toLowerCase().includes('search')) {
      // Highlighting search lines
      const searchLines = code.filter(line => 
        line.code.includes('==') || line.code.includes('for') || line.code.includes('while')
      ).map(line => line.line);
      newActiveLines.push(...searchLines);
    } else if (currentOperation.toLowerCase().includes('middle') || currentOperation.toLowerCase().includes('mid')) {
      // Highlighting binary search middle calculation
      const midLines = code.filter(line => 
        line.code.includes('mid') || line.code.includes('left') || line.code.includes('right')
      ).map(line => line.line);
      newActiveLines.push(...midLines);
    }

    setActiveLines(newActiveLines);
  }, [currentOperation, algorithm]);

  const copyCode = () => {
    const code = algorithmCode[algorithm] || [];
    const codeText = code.map(line => '  '.repeat(line.indent) + line.code).join('\n');
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const code = algorithmCode[algorithm] || [];

  const getAlgorithmDisplayName = () => {
    switch (algorithm) {
      case 'linear':
        return 'Linear Search';
      case 'binary':
        return 'Binary Search';
      default:
        return algorithm.charAt(0).toUpperCase() + algorithm.slice(1) + ' Sort';
    }
  };

  return (
    <div className={`bg-bg-card rounded-curvy shadow-curvy border border-accent/20 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-accent/20">
        <div className="flex items-center space-x-3">
          <Code className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-primary">
            {getAlgorithmDisplayName()} - Pseudocode
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Copy Button */}
          <button
            onClick={copyCode}
            className="p-2 rounded-curvy text-text-muted hover:text-primary hover:bg-accent/20 
                     transition-colors duration-200"
            title="Copy Code"
          >
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          </button>
          
          {/* Toggle Explanations */}
          <button
            onClick={() => setShowExplanations(!showExplanations)}
            className="p-2 rounded-curvy text-text-muted hover:text-primary hover:bg-accent/20 
                     transition-colors duration-200"
            title={showExplanations ? "Hide Explanations" : "Show Explanations"}
          >
            {showExplanations ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          
          {/* Expand/Collapse */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-curvy text-text-muted hover:text-primary hover:bg-accent/20 
                     transition-colors duration-200"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="px-4 py-2 bg-accent/10 border-b border-accent/20">
        <div className="flex justify-between items-center text-sm">
          <span className="text-text-muted">Execution Progress:</span>
          <span className="text-primary font-medium">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <div className="w-full bg-accent/20 rounded-curvy h-1 mt-2">
          <div
            className="h-full bg-primary rounded-curvy transition-all duration-300"
            style={{
              width: `${totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0}%`
            }}
          />
        </div>
      </div>

      {/* Current Operation */}
      {currentOperation && (
        <div className="px-4 py-3 bg-primary/10 border-b border-primary/20">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary">Current Operation:</span>
          </div>
          <p className="text-sm text-text-primary mt-1">{currentOperation}</p>
        </div>
      )}

      {/* Code Display */}
      <div className={`transition-all duration-300 ${isExpanded ? 'max-h-none' : 'max-h-96'} overflow-y-auto`}>
        <div className="p-4 font-mono text-sm">
          {code.map((line, index) => (
            <div key={index} className="group">
              <div
                className={`flex items-start space-x-3 py-1 px-2 rounded transition-all duration-200 ${
                  activeLines.includes(line.line)
                    ? 'bg-primary/20 border-l-4 border-primary shadow-glow'
                    : 'hover:bg-accent/10'
                }`}
              >
                {/* Line Number */}
                <span className="text-text-muted text-xs w-6 text-right flex-shrink-0 mt-0.5">
                  {line.code ? line.line : ''}
                </span>
                
                {/* Code */}
                <div className="flex-1">
                  <pre
                    className={`text-text-primary whitespace-pre-wrap ${
                      activeLines.includes(line.line) ? 'font-semibold text-primary' : ''
                    }`}
                    style={{ paddingLeft: `${line.indent * 16}px` }}
                  >
                    {line.code}
                  </pre>
                  
                  {/* Explanation */}
                  {showExplanations && line.explanation && (
                    <div className="text-xs text-text-muted mt-1 italic">
                      // {line.explanation}
                    </div>
                  )}
                </div>
                
                {/* Active Indicator */}
                {activeLines.includes(line.line) && (
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-accent/20 bg-accent/5">
        <div className="flex justify-between items-center text-xs text-text-muted">
          <span>
            {activeLines.length > 0 ? `${activeLines.length} line(s) active` : 'No active lines'}
          </span>
          <span>
            {code.filter(line => line.code).length} lines total
          </span>
        </div>
      </div>
    </div>
  );
};

export default CodeDisplay;