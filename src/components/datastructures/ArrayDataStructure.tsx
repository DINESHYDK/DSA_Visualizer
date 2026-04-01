import React, { useState, useEffect } from 'react';
import { Plus, Minus, Search, Edit3, Trash2, RotateCcw, Play, Pause } from 'lucide-react';
import { useAnimationEngine } from '../../hooks/useAnimationEngine';
import AnimatedArrayElement from '../animation/AnimatedArrayElement';
import AnimationControls from '../animation/AnimationControls';
import { ArrayElement, ElementState } from '../../types';
import { generateId } from '../../utils';

interface ArrayOperation {
  type: 'insert' | 'delete' | 'search' | 'update';
  index: number;
  value?: number;
  description: string;
}

interface ArrayVisualizationProps {
  initialArray?: number[];
  maxSize?: number;
  className?: string;
}

const ArrayDataStructure: React.FC<ArrayVisualizationProps> = ({
  initialArray = [10, 20, 30, 40, 50],
  maxSize = 15,
  className = ''
}) => {
  const [elements, setElements] = useState<ArrayElement[]>([]);
  const [operations, setOperations] = useState<ArrayOperation[]>([]);
  const [currentOperation, setCurrentOperation] = useState<string>('');
  const [newValue, setNewValue] = useState<string>('');
  const [insertIndex, setInsertIndex] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize array elements
  useEffect(() => {
    const initElements = initialArray.map((value, index) => ({
      value,
      id: generateId(),
      state: 'default' as ElementState,
      index
    }));
    setElements(initElements);
  }, [initialArray]);

  // Create animation steps for operations
  const createOperationSteps = (operation: ArrayOperation) => {
    const steps = [];
    
    switch (operation.type) {
      case 'insert':
        // Step 1: Highlight insertion point
        steps.push({
          id: `insert-1-${Date.now()}`,
          type: 'highlight' as const,
          indices: [operation.index],
          description: `Inserting ${operation.value} at index ${operation.index}`
        });
        
        // Step 2: Shift elements if needed
        if (operation.index < elements.length) {
          steps.push({
            id: `insert-2-${Date.now()}`,
            type: 'highlight' as const,
            indices: Array.from({ length: elements.length - operation.index }, (_, i) => operation.index + i),
            description: 'Shifting existing elements to the right'
          });
        }
        
        // Step 3: Insert new element
        steps.push({
          id: `insert-3-${Date.now()}`,
          type: 'set' as const,
          indices: [operation.index],
          description: `Element ${operation.value} inserted successfully`
        });
        break;

      case 'delete':
        // Step 1: Highlight element to delete
        steps.push({
          id: `delete-1-${Date.now()}`,
          type: 'highlight' as const,
          indices: [operation.index],
          description: `Deleting element at index ${operation.index}`
        });
        
        // Step 2: Show deletion
        steps.push({
          id: `delete-2-${Date.now()}`,
          type: 'highlight' as const,
          indices: [operation.index],
          description: 'Removing element from array'
        });
        
        // Step 3: Shift remaining elements
        if (operation.index < elements.length - 1) {
          steps.push({
            id: `delete-3-${Date.now()}`,
            type: 'highlight' as const,
            indices: Array.from({ length: elements.length - operation.index - 1 }, (_, i) => operation.index + i + 1),
            description: 'Shifting remaining elements to the left'
          });
        }
        break;

      case 'search':
        // Linear search animation
        for (let i = 0; i < elements.length; i++) {
          steps.push({
            id: `search-${i}-${Date.now()}`,
            type: 'compare' as const,
            indices: [i],
            description: `Checking element at index ${i}: ${elements[i].value} ${elements[i].value === operation.value ? '==' : '!='} ${operation.value}`
          });
          
          if (elements[i].value === operation.value) {
            steps.push({
              id: `search-found-${Date.now()}`,
              type: 'set' as const,
              indices: [i],
              description: `Found ${operation.value} at index ${i}!`
            });
            break;
          }
        }
        
        if (!elements.some(el => el.value === operation.value)) {
          steps.push({
            id: `search-not-found-${Date.now()}`,
            type: 'highlight' as const,
            indices: [],
            description: `Element ${operation.value} not found in array`
          });
        }
        break;

      case 'update':
        // Step 1: Highlight target element
        steps.push({
          id: `update-1-${Date.now()}`,
          type: 'highlight' as const,
          indices: [operation.index],
          description: `Updating element at index ${operation.index}`
        });
        
        // Step 2: Show update
        steps.push({
          id: `update-2-${Date.now()}`,
          type: 'set' as const,
          indices: [operation.index],
          description: `Updated to ${operation.value}`
        });
        break;
    }
    
    return steps;
  };

  const handleStepChange = (stepIndex: number, stepData: any) => {
    if (!stepData) return;

    setCurrentOperation(stepData.description);
    
    setElements(prevElements => {
      return prevElements.map((element, index) => {
        let newState: ElementState = 'default';
        
        if (stepData.indices.includes(index)) {
          switch (stepData.type) {
            case 'compare':
              newState = 'comparing';
              break;
            case 'highlight':
              newState = 'current';
              break;
            case 'set':
              newState = 'sorted';
              break;
          }
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

  // Array operations
  const insertElement = () => {
    const value = parseInt(newValue);
    const index = insertIndex === '' ? elements.length : parseInt(insertIndex);
    
    if (isNaN(value) || index < 0 || index > elements.length || elements.length >= maxSize) {
      return;
    }

    const newElement: ArrayElement = {
      value,
      id: generateId(),
      state: 'default',
      index
    };

    // Update elements array
    const newElements = [...elements];
    newElements.splice(index, 0, newElement);
    
    // Update indices
    newElements.forEach((el, i) => {
      el.index = i;
    });
    
    setElements(newElements);
    
    // Add operation for animation
    const operation: ArrayOperation = {
      type: 'insert',
      index,
      value,
      description: `Insert ${value} at index ${index}`
    };
    
    setOperations([operation]);
    setNewValue('');
    setInsertIndex('');
    setIsAnimating(true);
  };

  const deleteElement = (index: number) => {
    if (index < 0 || index >= elements.length) return;

    const newElements = elements.filter((_, i) => i !== index);
    
    // Update indices
    newElements.forEach((el, i) => {
      el.index = i;
    });
    
    setElements(newElements);
    
    // Add operation for animation
    const operation: ArrayOperation = {
      type: 'delete',
      index,
      description: `Delete element at index ${index}`
    };
    
    setOperations([operation]);
    setIsAnimating(true);
  };

  const searchElement = () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) return;

    const operation: ArrayOperation = {
      type: 'search',
      index: -1,
      value,
      description: `Search for ${value}`
    };
    
    setOperations([operation]);
    setSearchValue('');
    setIsAnimating(true);
  };

  const updateElement = (index: number, newVal: number) => {
    if (index < 0 || index >= elements.length || isNaN(newVal)) return;

    const newElements = [...elements];
    newElements[index] = {
      ...newElements[index],
      value: newVal
    };
    
    setElements(newElements);
    
    const operation: ArrayOperation = {
      type: 'update',
      index,
      value: newVal,
      description: `Update index ${index} to ${newVal}`
    };
    
    setOperations([operation]);
    setIsAnimating(true);
  };

  const resetArray = () => {
    const initElements = initialArray.map((value, index) => ({
      value,
      id: generateId(),
      state: 'default' as ElementState,
      index
    }));
    setElements(initElements);
    setOperations([]);
    setCurrentOperation('');
    setSelectedIndex(-1);
    controls.reset();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
        <h2 className="text-2xl font-semibold text-primary mb-2">Array Data Structure</h2>
        <p className="text-text-secondary">
          Interactive array with insertion, deletion, search, and update operations. 
          Watch how elements are accessed by index and how operations affect memory layout.
        </p>
      </div>

      {/* Array Visualization */}
      <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
        <div className="space-y-6">
          {/* Memory Layout Visualization */}
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-4">Memory Layout</h3>
            <div className="relative">
              {/* Memory addresses */}
              <div className="flex justify-center mb-2">
                <div className="flex space-x-3">
                  {elements.map((_, index) => (
                    <div key={index} className="w-16 text-center">
                      <div className="text-xs text-text-muted font-mono">
                        {(1000 + index * 4).toString(16).toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Array Elements */}
              <div className="flex justify-center">
                <div className="flex space-x-3">
                  {elements.map((element, index) => (
                    <div key={element.id} className="relative">
                      <AnimatedArrayElement
                        value={element.value}
                        index={element.index}
                        state={element.state}
                        isHighlighted={selectedIndex === index}
                        width={64}
                        height={64}
                        onClick={(idx) => setSelectedIndex(idx === selectedIndex ? -1 : idx)}
                      />
                      
                      {/* Index labels */}
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                        <div className="text-xs text-text-muted font-medium">
                          [{index}]
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Array bounds indicator */}
              <div className="flex justify-center mt-4">
                <div className="text-sm text-text-muted">
                  Array size: {elements.length} / {maxSize} | 
                  Memory used: {elements.length * 4} bytes
                </div>
              </div>
            </div>
          </div>

          {/* Current Operation Display */}
          <div className="bg-accent/10 rounded-curvy p-4 border border-accent/20 min-h-[60px] flex items-center justify-center">
            <p className="text-text-primary text-center">
              {currentOperation || 'Select an operation to begin...'}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operation Controls */}
        <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
          <h3 className="text-lg font-medium text-text-primary mb-4">Array Operations</h3>
          
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
                  className="flex-1 p-2 bg-accent/20 border border-accent/40 rounded-curvy
                           text-text-primary placeholder-text-muted
                           focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
                <input
                  type="number"
                  value={insertIndex}
                  onChange={(e) => setInsertIndex(e.target.value)}
                  placeholder="Index (optional)"
                  className="w-24 p-2 bg-accent/20 border border-accent/40 rounded-curvy
                           text-text-primary placeholder-text-muted
                           focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
                <button
                  onClick={insertElement}
                  disabled={!newValue || elements.length >= maxSize || isAnimating}
                  className="px-4 py-2 bg-primary hover:bg-hover text-secondary rounded-curvy
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200 hover-lift"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Search Element</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Value to search"
                  className="flex-1 p-2 bg-accent/20 border border-accent/40 rounded-curvy
                           text-text-primary placeholder-text-muted
                           focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
                <button
                  onClick={searchElement}
                  disabled={!searchValue || isAnimating}
                  className="px-4 py-2 bg-info hover:bg-info/80 text-white rounded-curvy
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200 hover-lift"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Selected Element Operations */}
            {selectedIndex >= 0 && selectedIndex < elements.length && (
              <div className="p-4 bg-primary/10 rounded-curvy border border-primary/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-primary">
                    Selected: Index {selectedIndex} (Value: {elements[selectedIndex].value})
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="New value"
                    className="flex-1 p-2 bg-accent/20 border border-accent/40 rounded-curvy
                             text-text-primary placeholder-text-muted
                             focus:border-primary focus:ring-1 focus:ring-primary/20"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const newVal = parseInt((e.target as HTMLInputElement).value);
                        if (!isNaN(newVal)) {
                          updateElement(selectedIndex, newVal);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                  <button
                    onClick={() => deleteElement(selectedIndex)}
                    disabled={isAnimating}
                    className="px-4 py-2 bg-error hover:bg-error/80 text-white rounded-curvy
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition-all duration-200 hover-lift"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Reset */}
            <button
              onClick={resetArray}
              className="w-full px-4 py-2 bg-accent hover:bg-primary hover:text-secondary 
                       text-text-primary rounded-curvy transition-all duration-200 hover-lift"
            >
              <RotateCcw className="h-4 w-4 inline mr-2" />
              Reset Array
            </button>
          </div>
        </div>

        {/* Animation Controls */}
        <div className="space-y-6">
          <AnimationControls
            state={state}
            controls={controls}
            disabled={operations.length === 0}
          />
          
          {/* Array Properties */}
          <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
            <h3 className="text-lg font-medium text-text-primary mb-4">Array Properties</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Access Time:</span>
                <span className="text-success font-mono">O(1)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Search Time:</span>
                <span className="text-warning font-mono">O(n)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Insert/Delete:</span>
                <span className="text-error font-mono">O(n)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Space Complexity:</span>
                <span className="text-info font-mono">O(n)</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-accent/10 rounded-curvy">
              <p className="text-xs text-text-muted">
                Arrays provide constant-time access to elements by index but require 
                linear time for insertion and deletion due to element shifting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArrayDataStructure;