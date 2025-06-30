import React, { useState, useEffect } from 'react';
import { Plus, Minus, RotateCcw, ArrowUp, ArrowDown, Eye, Shuffle } from 'lucide-react';
import { useAnimationEngine } from '../../hooks/useAnimationEngine';
import AnimationControls from '../animation/AnimationControls';
import TreeVisualization from '../animation/TreeVisualization';
import { ArrayElement } from '../../types';
import { generateId } from '../../utils';

interface HeapOperation {
  type: 'insert' | 'extract' | 'heapify' | 'build' | 'peek';
  value?: number;
  description: string;
}

interface HeapVisualizationProps {
  heapType?: 'max' | 'min';
  initialValues?: number[];
  className?: string;
}

const HeapVisualization: React.FC<HeapVisualizationProps> = ({
  heapType = 'max',
  initialValues = [90, 80, 70, 60, 50, 40, 30],
  className = ''
}) => {
  const [heap, setHeap] = useState<number[]>([]);
  const [elements, setElements] = useState<ArrayElement[]>([]);
  const [operations, setOperations] = useState<HeapOperation[]>([]);
  const [currentOperation, setCurrentOperation] = useState<string>('');
  const [newValue, setNewValue] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'tree' | 'array'>('tree');

  // Initialize heap
  useEffect(() => {
    buildHeap(initialValues);
  }, [initialValues, heapType]);

  // Helper functions
  const getParentIndex = (index: number): number => Math.floor((index - 1) / 2);
  const getLeftChildIndex = (index: number): number => 2 * index + 1;
  const getRightChildIndex = (index: number): number => 2 * index + 2;

  const hasParent = (index: number): boolean => getParentIndex(index) >= 0;
  const hasLeftChild = (index: number, size: number): boolean => getLeftChildIndex(index) < size;
  const hasRightChild = (index: number, size: number): boolean => getRightChildIndex(index) < size;

  const parent = (heap: number[], index: number): number => heap[getParentIndex(index)];
  const leftChild = (heap: number[], index: number): number => heap[getLeftChildIndex(index)];
  const rightChild = (heap: number[], index: number): number => heap[getRightChildIndex(index)];

  const compare = (a: number, b: number): boolean => {
    return heapType === 'max' ? a > b : a < b;
  };

  const swap = (arr: number[], i: number, j: number): void => {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  };

  const heapifyUp = (heap: number[], index: number): number[] => {
    const newHeap = [...heap];
    let currentIndex = index;

    while (hasParent(currentIndex) && compare(newHeap[currentIndex], parent(newHeap, currentIndex))) {
      const parentIndex = getParentIndex(currentIndex);
      swap(newHeap, currentIndex, parentIndex);
      currentIndex = parentIndex;
    }

    return newHeap;
  };

  const heapifyDown = (heap: number[], index: number, size?: number): number[] => {
    const newHeap = [...heap];
    const heapSize = size || newHeap.length;
    let currentIndex = index;

    while (hasLeftChild(currentIndex, heapSize)) {
      let targetIndex = getLeftChildIndex(currentIndex);
      
      if (hasRightChild(currentIndex, heapSize) && 
          compare(rightChild(newHeap, currentIndex), leftChild(newHeap, currentIndex))) {
        targetIndex = getRightChildIndex(currentIndex);
      }

      if (compare(newHeap[currentIndex], newHeap[targetIndex])) {
        break;
      }

      swap(newHeap, currentIndex, targetIndex);
      currentIndex = targetIndex;
    }

    return newHeap;
  };

  const buildHeap = (values: number[]): void => {
    const newHeap = [...values];
    
    // Start from the last non-leaf node and heapify down
    for (let i = Math.floor(newHeap.length / 2) - 1; i >= 0; i--) {
      const heapified = heapifyDown(newHeap, i);
      newHeap.splice(0, newHeap.length, ...heapified);
    }

    setHeap(newHeap);
    updateElements(newHeap);
  };

  const updateElements = (heapArray: number[]): void => {
    const newElements = heapArray.map((value, index) => ({
      value,
      id: generateId(),
      state: 'default' as const,
      index
    }));
    setElements(newElements);
  };

  // Create animation steps
  const createOperationSteps = (operation: HeapOperation) => {
    const steps = [];
    
    switch (operation.type) {
      case 'insert':
        // Show insertion at end
        steps.push({
          id: `insert-1-${Date.now()}`,
          type: 'highlight' as const,
          indices: [heap.length],
          description: `Inserting ${operation.value} at the end of heap`
        });
        
        // Show bubble up process
        let currentIndex = heap.length;
        while (hasParent(currentIndex) && compare(operation.value!, parent(heap, currentIndex))) {
          const parentIndex = getParentIndex(currentIndex);
          steps.push({
            id: `insert-bubble-${currentIndex}-${Date.now()}`,
            type: 'compare' as const,
            indices: [currentIndex, parentIndex],
            description: `Comparing ${operation.value} with parent ${heap[parentIndex]}: bubble up`
          });
          currentIndex = parentIndex;
        }
        
        steps.push({
          id: `insert-final-${Date.now()}`,
          type: 'set' as const,
          indices: [currentIndex],
          description: `${operation.value} inserted and heap property restored`
        });
        break;

      case 'extract':
        const rootValue = heap[0];
        
        steps.push({
          id: `extract-1-${Date.now()}`,
          type: 'highlight' as const,
          indices: [0],
          description: `Extracting ${heapType === 'max' ? 'maximum' : 'minimum'} value: ${rootValue}`
        });
        
        steps.push({
          id: `extract-2-${Date.now()}`,
          type: 'swap' as const,
          indices: [0, heap.length - 1],
          description: `Moving last element to root and removing ${rootValue}`
        });
        
        // Show bubble down process
        let bubbleIndex = 0;
        const tempHeap = [...heap];
        tempHeap[0] = tempHeap[tempHeap.length - 1];
        tempHeap.pop();
        
        while (hasLeftChild(bubbleIndex, tempHeap.length)) {
          let targetIndex = getLeftChildIndex(bubbleIndex);
          
          if (hasRightChild(bubbleIndex, tempHeap.length) && 
              compare(rightChild(tempHeap, bubbleIndex), leftChild(tempHeap, bubbleIndex))) {
            targetIndex = getRightChildIndex(bubbleIndex);
          }

          if (compare(tempHeap[bubbleIndex], tempHeap[targetIndex])) {
            break;
          }

          steps.push({
            id: `extract-bubble-${bubbleIndex}-${Date.now()}`,
            type: 'compare' as const,
            indices: [bubbleIndex, targetIndex],
            description: `Comparing ${tempHeap[bubbleIndex]} with child ${tempHeap[targetIndex]}: bubble down`
          });
          
          bubbleIndex = targetIndex;
        }
        
        steps.push({
          id: `extract-final-${Date.now()}`,
          type: 'set' as const,
          indices: [bubbleIndex],
          description: `Heap property restored after extracting ${rootValue}`
        });
        break;

      case 'peek':
        if (heap.length > 0) {
          steps.push({
            id: `peek-${Date.now()}`,
            type: 'highlight' as const,
            indices: [0],
            description: `Peeking at ${heapType === 'max' ? 'maximum' : 'minimum'} value: ${heap[0]}`
          });
        } else {
          steps.push({
            id: `peek-empty-${Date.now()}`,
            type: 'highlight' as const,
            indices: [],
            description: 'Heap is empty - nothing to peek'
          });
        }
        break;

      case 'build':
        // Show building heap from bottom up
        for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) {
          steps.push({
            id: `build-${i}-${Date.now()}`,
            type: 'highlight' as const,
            indices: [i],
            description: `Heapifying subtree rooted at index ${i}`
          });
        }
        
        steps.push({
          id: `build-complete-${Date.now()}`,
          type: 'set' as const,
          indices: Array.from({ length: heap.length }, (_, i) => i),
          description: `${heapType === 'max' ? 'Max' : 'Min'} heap construction complete`
        });
        break;
    }
    
    return steps;
  };

  const handleStepChange = (stepIndex: number, stepData: any) => {
    if (!stepData) return;

    setCurrentOperation(stepData.description);
    setHighlightedIndices(stepData.indices || []);
    
    setElements(prevElements => {
      return prevElements.map((element, index) => {
        let newState = element.state;
        
        if (stepData.indices.includes(index)) {
          switch (stepData.type) {
            case 'compare':
              newState = 'comparing';
              break;
            case 'swap':
              newState = 'swapping';
              break;
            case 'highlight':
              newState = 'current';
              break;
            case 'set':
              newState = 'sorted';
              break;
          }
        } else {
          newState = 'default';
        }
        
        return {
          ...element,
          state: newState
        };
      });
    });
  };

  const handleComplete = () => {
    setCurrentOperation('Operation completed');
    setIsAnimating(false);
    setHighlightedIndices([]);
    
    // Reset all element states
    setElements(prevElements =>
      prevElements.map(element => ({
        ...element,
        state: 'default'
      }))
    );
  };

  const { state, controls } = useAnimationEngine({
    steps: operations.flatMap(createOperationSteps),
    onStepChange: handleStepChange,
    onComplete: handleComplete
  });

  // Heap operations
  const insertValue = () => {
    const value = parseInt(newValue);
    if (isNaN(value)) return;

    const operation: HeapOperation = {
      type: 'insert',
      value,
      description: `Insert ${value} into ${heapType} heap`
    };
    
    setOperations([operation]);
    
    // Perform actual insertion after animation starts
    setTimeout(() => {
      const newHeap = [...heap, value];
      const heapified = heapifyUp(newHeap, newHeap.length - 1);
      setHeap(heapified);
      updateElements(heapified);
    }, 500);
    
    setNewValue('');
    setIsAnimating(true);
  };

  const extractRoot = () => {
    if (heap.length === 0) {
      setCurrentOperation('Heap is empty - cannot extract');
      return;
    }

    const operation: HeapOperation = {
      type: 'extract',
      description: `Extract ${heapType === 'max' ? 'maximum' : 'minimum'} from heap`
    };
    
    setOperations([operation]);
    
    // Perform actual extraction after animation
    setTimeout(() => {
      const newHeap = [...heap];
      newHeap[0] = newHeap[newHeap.length - 1];
      newHeap.pop();
      
      if (newHeap.length > 0) {
        const heapified = heapifyDown(newHeap, 0);
        setHeap(heapified);
        updateElements(heapified);
      } else {
        setHeap([]);
        setElements([]);
      }
    }, 1500);
    
    setIsAnimating(true);
  };

  const peekRoot = () => {
    const operation: HeapOperation = {
      type: 'peek',
      description: `Peek at ${heapType === 'max' ? 'maximum' : 'minimum'} value`
    };
    
    setOperations([operation]);
    setIsAnimating(true);
  };

  const randomizeHeap = () => {
    const randomValues = Array.from({ length: 7 }, () => Math.floor(Math.random() * 90) + 10);
    buildHeap(randomValues);
    
    const operation: HeapOperation = {
      type: 'build',
      description: `Build ${heapType} heap from random values`
    };
    
    setOperations([operation]);
    setIsAnimating(true);
  };

  const resetHeap = () => {
    buildHeap(initialValues);
    setOperations([]);
    setCurrentOperation('');
    setHighlightedIndices([]);
    controls.reset();
  };

  const toggleHeapType = () => {
    const newType = heapType === 'max' ? 'min' : 'max';
    buildHeap(heap); // Rebuild with new type
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-2">
              {heapType === 'max' ? 'Max' : 'Min'} Heap
            </h2>
            <p className="text-text-secondary">
              A complete binary tree where each parent node is {heapType === 'max' ? 'greater' : 'less'} than 
              or equal to its children. Efficient for priority queue operations.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode(viewMode === 'tree' ? 'array' : 'tree')}
              className="px-4 py-2 bg-info hover:bg-info/80 text-white rounded-curvy
                       transition-all duration-200 hover-lift font-medium"
            >
              {viewMode === 'tree' ? 'Array View' : 'Tree View'}
            </button>
            
            <button
              onClick={toggleHeapType}
              className="px-4 py-2 bg-warning hover:bg-warning/80 text-white rounded-curvy
                       transition-all duration-200 hover-lift font-medium"
            >
              Switch to {heapType === 'max' ? 'Min' : 'Max'} Heap
            </button>
          </div>
        </div>
      </div>

      {/* Heap Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-bg-card rounded-curvy p-4 shadow-curvy text-center">
          <div className="text-2xl font-bold text-primary">{heap.length}</div>
          <div className="text-sm text-text-muted">Elements</div>
        </div>
        <div className="bg-bg-card rounded-curvy p-4 shadow-curvy text-center">
          <div className="text-2xl font-bold text-info">
            {heap.length > 0 ? Math.floor(Math.log2(heap.length)) + 1 : 0}
          </div>
          <div className="text-sm text-text-muted">Height</div>
        </div>
        <div className="bg-bg-card rounded-curvy p-4 shadow-curvy text-center">
          <div className="text-2xl font-bold text-success">
            {heap.length > 0 ? heap[0] : '-'}
          </div>
          <div className="text-sm text-text-muted">Root ({heapType === 'max' ? 'Max' : 'Min'})</div>
        </div>
        <div className="bg-bg-card rounded-curvy p-4 shadow-curvy text-center">
          <div className="text-2xl font-bold text-text-primary">Complete</div>
          <div className="text-sm text-text-muted">Tree Type</div>
        </div>
      </div>

      {/* Heap Visualization */}
      <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-text-primary">
            {viewMode === 'tree' ? 'Tree Structure' : 'Array Representation'}
          </h3>
          <div className="text-sm text-text-muted">
            Heap Property: Parent {heapType === 'max' ? '≥' : '≤'} Children
          </div>
        </div>
        
        {viewMode === 'tree' ? (
          <TreeVisualization
            elements={elements}
            highlightedIndices={highlightedIndices}
            width={800}
            height={400}
            className="mb-6"
          />
        ) : (
          <div className="space-y-4">
            {/* Array visualization */}
            <div className="flex justify-center">
              <div className="flex space-x-2 flex-wrap justify-center">
                {elements.map((element, index) => (
                  <div
                    key={element.id}
                    className={`
                      w-16 h-16 border-2 rounded-curvy flex items-center justify-center
                      transition-all duration-300 hover-lift relative
                      ${highlightedIndices.includes(index) 
                        ? 'bg-primary/20 border-primary shadow-glow' 
                        : 'bg-accent border-accent/60'
                      }
                    `}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold text-text-primary">{element.value}</div>
                      <div className="text-xs text-text-muted">[{index}]</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Array indices and relationships */}
            <div className="text-center space-y-2">
              <div className="text-sm text-text-muted">
                Parent of index i: ⌊(i-1)/2⌋ | Left child: 2i+1 | Right child: 2i+2
              </div>
              {heap.length > 0 && (
                <div className="text-xs text-text-muted">
                  Array: [{heap.join(', ')}]
                </div>
              )}
            </div>
          </div>
        )}

        {/* Current Operation Display */}
        <div className="mt-6 bg-accent/10 rounded-curvy p-4 border border-accent/20 min-h-[60px] flex items-center justify-center">
          <p className="text-text-primary text-center font-medium">
            {currentOperation || 'Select an operation to begin...'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operation Controls */}
        <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
          <h3 className="text-lg font-medium text-text-primary mb-4">Heap Operations</h3>
          
          <div className="space-y-4">
            {/* Insert */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Insert Element</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Value"
                  className="flex-1 p-3 bg-accent/20 border border-accent/40 rounded-curvy
                           text-text-primary placeholder-text-muted
                           focus:border-primary focus:ring-2 focus:ring-primary/20"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newValue) {
                      insertValue();
                    }
                  }}
                />
                <button
                  onClick={insertValue}
                  disabled={!newValue || isAnimating}
                  className="px-6 py-3 bg-primary hover:bg-hover text-secondary rounded-curvy
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200 hover-lift font-medium"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Extract and Peek */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={extractRoot}
                disabled={heap.length === 0 || isAnimating}
                className="px-4 py-3 bg-error hover:bg-error/80 text-white rounded-curvy
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 hover-lift font-medium"
              >
                <Minus className="h-4 w-4 inline mr-2" />
                Extract {heapType === 'max' ? 'Max' : 'Min'}
              </button>
              
              <button
                onClick={peekRoot}
                disabled={heap.length === 0 || isAnimating}
                className="px-4 py-3 bg-info hover:bg-info/80 text-white rounded-curvy
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 hover-lift font-medium"
              >
                <Eye className="h-4 w-4 inline mr-2" />
                Peek
              </button>
            </div>

            {/* Randomize */}
            <button
              onClick={randomizeHeap}
              disabled={isAnimating}
              className="w-full px-4 py-3 bg-warning hover:bg-warning/80 text-white rounded-curvy
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 hover-lift font-medium"
            >
              <Shuffle className="h-4 w-4 inline mr-2" />
              Randomize Heap
            </button>

            {/* Reset */}
            <button
              onClick={resetHeap}
              className="w-full px-4 py-3 bg-accent hover:bg-primary hover:text-secondary 
                       text-text-primary rounded-curvy transition-all duration-200 hover-lift font-medium"
            >
              <RotateCcw className="h-4 w-4 inline mr-2" />
              Reset Heap
            </button>
          </div>
        </div>

        {/* Animation Controls and Properties */}
        <div className="space-y-6">
          <AnimationControls
            state={state}
            controls={controls}
            disabled={operations.length === 0}
          />
          
          {/* Heap Properties */}
          <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
            <h3 className="text-lg font-medium text-text-primary mb-4">Heap Properties</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Insert:</span>
                <span className="text-success font-mono font-bold">O(log n)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Extract {heapType === 'max' ? 'Max' : 'Min'}:</span>
                <span className="text-success font-mono font-bold">O(log n)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Peek:</span>
                <span className="text-success font-mono font-bold">O(1)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Build Heap:</span>
                <span className="text-warning font-mono font-bold">O(n)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Space:</span>
                <span className="text-info font-mono font-bold">O(n)</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-accent/10 rounded-curvy">
              <p className="text-xs text-text-muted leading-relaxed">
                Heaps are perfect for priority queues. {heapType === 'max' ? 'Max' : 'Min'} heap ensures 
                the {heapType === 'max' ? 'largest' : 'smallest'} element is always at the root.
                Complete binary tree property guarantees O(log n) height.
              </p>
            </div>

            {/* Current heap info */}
            {heap.length > 0 && (
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Current Size:</span>
                  <span className="text-primary font-medium">{heap.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Root Value:</span>
                  <span className="text-primary font-medium">{heap[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Last Element:</span>
                  <span className="text-info font-medium">{heap[heap.length - 1]}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeapVisualization;