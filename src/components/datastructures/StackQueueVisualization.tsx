import React, { useState, useEffect } from 'react';
import { Plus, Minus, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Eye, AlertCircle, CheckCircle } from 'lucide-react';
import { useAnimationEngine } from '../../hooks/useAnimationEngine';
import AnimationControls from '../animation/AnimationControls';
import { generateId } from '../../utils';

interface StackQueueElement {
  id: string;
  value: number;
  state: 'default' | 'pushing' | 'popping' | 'current' | 'peeking';
  timestamp?: number;
}

interface StackQueueOperation {
  type: 'push' | 'pop' | 'enqueue' | 'dequeue' | 'peek' | 'overflow' | 'underflow';
  value?: number;
  description: string;
  success: boolean;
}

interface StackQueueVisualizationProps {
  dataStructure: 'stack' | 'queue';
  initialValues?: number[];
  maxSize?: number;
  className?: string;
}

const StackQueueVisualization: React.FC<StackQueueVisualizationProps> = ({
  dataStructure,
  initialValues = [10, 20, 30],
  maxSize = 8,
  className = ''
}) => {
  const [elements, setElements] = useState<StackQueueElement[]>([]);
  const [operations, setOperations] = useState<StackQueueOperation[]>([]);
  const [currentOperation, setCurrentOperation] = useState<string>('');
  const [newValue, setNewValue] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [operationHistory, setOperationHistory] = useState<StackQueueOperation[]>([]);
  const [showOverflowWarning, setShowOverflowWarning] = useState(false);
  const [showUnderflowWarning, setShowUnderflowWarning] = useState(false);

  // Initialize elements
  useEffect(() => {
    const initElements = initialValues.map((value, index) => ({
      id: generateId(),
      value,
      state: 'default' as const,
      timestamp: Date.now() + index
    }));
    setElements(initElements);
  }, [initialValues]);

  // Create animation steps for operations
  const createOperationSteps = (operation: StackQueueOperation) => {
    const steps = [];
    
    switch (operation.type) {
      case 'push':
      case 'enqueue':
        if (operation.success) {
          steps.push({
            id: `${operation.type}-highlight-${Date.now()}`,
            type: 'highlight' as const,
            indices: [elements.length],
            description: `Preparing to ${operation.type} ${operation.value} to the ${dataStructure}`
          });
          
          steps.push({
            id: `${operation.type}-add-${Date.now()}`,
            type: 'set' as const,
            indices: [elements.length],
            description: `${operation.value} successfully ${operation.type === 'push' ? 'pushed' : 'enqueued'}`
          });
        } else {
          steps.push({
            id: `${operation.type}-overflow-${Date.now()}`,
            type: 'highlight' as const,
            indices: [],
            description: `Overflow! Cannot ${operation.type} - ${dataStructure} is full (${maxSize}/${maxSize})`
          });
        }
        break;

      case 'pop':
      case 'dequeue':
        if (operation.success) {
          const removeIndex = operation.type === 'pop' ? elements.length - 1 : 0;
          const elementValue = elements[removeIndex]?.value;
          
          steps.push({
            id: `${operation.type}-highlight-${Date.now()}`,
            type: 'highlight' as const,
            indices: [removeIndex],
            description: `${operation.type === 'pop' ? 'Popping' : 'Dequeuing'} element from the ${dataStructure}`
          });
          
          steps.push({
            id: `${operation.type}-remove-${Date.now()}`,
            type: 'highlight' as const,
            indices: [removeIndex],
            description: `Removed ${elementValue} from ${dataStructure === 'stack' ? 'top' : 'front'}`
          });
        } else {
          steps.push({
            id: `${operation.type}-underflow-${Date.now()}`,
            type: 'highlight' as const,
            indices: [],
            description: `Underflow! Cannot ${operation.type} - ${dataStructure} is empty`
          });
        }
        break;

      case 'peek':
        if (operation.success) {
          const peekIndex = dataStructure === 'stack' ? elements.length - 1 : 0;
          const elementValue = elements[peekIndex]?.value;
          
          steps.push({
            id: `peek-${Date.now()}`,
            type: 'highlight' as const,
            indices: [peekIndex],
            description: `Peeking at ${dataStructure === 'stack' ? 'top' : 'front'}: ${elementValue}`
          });
          
          steps.push({
            id: `peek-show-${Date.now()}`,
            type: 'set' as const,
            indices: [peekIndex],
            description: `${dataStructure === 'stack' ? 'Top' : 'Front'} element is ${elementValue}`
          });
        } else {
          steps.push({
            id: `peek-empty-${Date.now()}`,
            type: 'highlight' as const,
            indices: [],
            description: `Cannot peek - ${dataStructure} is empty`
          });
        }
        break;
    }
    
    return steps;
  };

  const handleStepChange = (stepIndex: number, stepData: any) => {
    if (!stepData) return;

    setCurrentOperation(stepData.description);
    
    setElements(prevElements => {
      return prevElements.map((element, index) => {
        let newState: StackQueueElement['state'] = 'default';
        
        if (stepData.indices.includes(index)) {
          switch (stepData.type) {
            case 'highlight':
              newState = 'current';
              break;
            case 'set':
              newState = 'peeking';
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
    
    // Reset all element states after a delay
    setTimeout(() => {
      setElements(prevElements =>
        prevElements.map(element => ({
          ...element,
          state: 'default'
        }))
      );
    }, 1000);
  };

  const { state, controls } = useAnimationEngine({
    steps: operations.flatMap(createOperationSteps),
    onStepChange: handleStepChange,
    onComplete: handleComplete
  });

  // Stack/Queue operations with proper error handling
  const pushOrEnqueue = () => {
    const value = parseInt(newValue);
    if (isNaN(value)) return;

    // Check for overflow
    if (elements.length >= maxSize) {
      const operation: StackQueueOperation = {
        type: dataStructure === 'stack' ? 'push' : 'enqueue',
        value,
        description: `Overflow: Cannot ${dataStructure === 'stack' ? 'push' : 'enqueue'} ${value}`,
        success: false
      };
      
      setOperations([operation]);
      setOperationHistory(prev => [...prev, operation]);
      setShowOverflowWarning(true);
      setTimeout(() => setShowOverflowWarning(false), 3000);
      setIsAnimating(true);
      return;
    }

    const newElement: StackQueueElement = {
      id: generateId(),
      value,
      state: 'pushing',
      timestamp: Date.now()
    };

    setElements(prev => [...prev, newElement]);
    
    const operation: StackQueueOperation = {
      type: dataStructure === 'stack' ? 'push' : 'enqueue',
      value,
      description: `${dataStructure === 'stack' ? 'Push' : 'Enqueue'} ${value}`,
      success: true
    };
    
    setOperations([operation]);
    setOperationHistory(prev => [...prev, operation]);
    setNewValue('');
    setIsAnimating(true);
  };

  const popOrDequeue = () => {
    // Check for underflow
    if (elements.length === 0) {
      const operation: StackQueueOperation = {
        type: dataStructure === 'stack' ? 'pop' : 'dequeue',
        description: `Underflow: Cannot ${dataStructure === 'stack' ? 'pop' : 'dequeue'} from empty ${dataStructure}`,
        success: false
      };
      
      setOperations([operation]);
      setOperationHistory(prev => [...prev, operation]);
      setShowUnderflowWarning(true);
      setTimeout(() => setShowUnderflowWarning(false), 3000);
      setIsAnimating(true);
      return;
    }

    const removedElement = dataStructure === 'stack' 
      ? elements[elements.length - 1] 
      : elements[0];

    const operation: StackQueueOperation = {
      type: dataStructure === 'stack' ? 'pop' : 'dequeue',
      value: removedElement.value,
      description: `${dataStructure === 'stack' ? 'Pop' : 'Dequeue'} ${removedElement.value}`,
      success: true
    };
    
    setOperations([operation]);
    setOperationHistory(prev => [...prev, operation]);
    
    // Remove element after animation
    setTimeout(() => {
      setElements(prev => {
        if (dataStructure === 'stack') {
          return prev.slice(0, -1); // Remove last (top)
        } else {
          return prev.slice(1); // Remove first (front)
        }
      });
    }, 1500);
    
    setIsAnimating(true);
  };

  const peek = () => {
    // Check if empty
    if (elements.length === 0) {
      const operation: StackQueueOperation = {
        type: 'peek',
        description: `Cannot peek - ${dataStructure} is empty`,
        success: false
      };
      
      setOperations([operation]);
      setOperationHistory(prev => [...prev, operation]);
      setIsAnimating(true);
      return;
    }

    const peekElement = dataStructure === 'stack' 
      ? elements[elements.length - 1] 
      : elements[0];

    const operation: StackQueueOperation = {
      type: 'peek',
      value: peekElement.value,
      description: `Peek at ${dataStructure === 'stack' ? 'top' : 'front'}: ${peekElement.value}`,
      success: true
    };
    
    setOperations([operation]);
    setOperationHistory(prev => [...prev, operation]);
    setIsAnimating(true);
  };

  const reset = () => {
    const initElements = initialValues.map((value, index) => ({
      id: generateId(),
      value,
      state: 'default' as const,
      timestamp: Date.now() + index
    }));
    setElements(initElements);
    setOperations([]);
    setOperationHistory([]);
    setCurrentOperation('');
    setShowOverflowWarning(false);
    setShowUnderflowWarning(false);
    controls.reset();
  };

  const getElementColor = (element: StackQueueElement, index: number) => {
    if (element.state === 'current') {
      return 'bg-current border-primary shadow-glow animate-pulse-glow';
    }
    
    if (element.state === 'peeking') {
      return 'bg-info border-info shadow-glow';
    }
    
    if (element.state === 'pushing') {
      return 'bg-success border-success';
    }
    
    // Highlight top/front element
    if (dataStructure === 'stack' && index === elements.length - 1) {
      return 'bg-primary/30 border-primary/60';
    } else if (dataStructure === 'queue' && index === 0) {
      return 'bg-primary/30 border-primary/60';
    }
    
    return 'bg-accent border-accent/60';
  };

  const getCapacityColor = () => {
    const usage = elements.length / maxSize;
    if (usage >= 1) return 'text-error';
    if (usage >= 0.8) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-2">
              {dataStructure === 'stack' ? 'Stack (LIFO)' : 'Queue (FIFO)'}
            </h2>
            <p className="text-text-secondary">
              {dataStructure === 'stack' 
                ? 'Last In, First Out - Elements are added and removed from the top'
                : 'First In, First Out - Elements are added at the rear and removed from the front'
              }
            </p>
          </div>
          
          {/* Capacity Indicator */}
          <div className="text-right">
            <div className={`text-2xl font-bold ${getCapacityColor()}`}>
              {elements.length}/{maxSize}
            </div>
            <div className="text-sm text-text-muted">Capacity</div>
          </div>
        </div>
        
        {/* Capacity Bar */}
        <div className="mt-4">
          <div className="w-full bg-accent/20 rounded-curvy h-2">
            <div
              className={`h-full rounded-curvy transition-all duration-300 ${
                elements.length >= maxSize ? 'bg-error' :
                elements.length >= maxSize * 0.8 ? 'bg-warning' : 'bg-success'
              }`}
              style={{ width: `${(elements.length / maxSize) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Warning Messages */}
      {showOverflowWarning && (
        <div className="bg-error/20 border border-error rounded-curvy p-4 animate-slide-up">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-error" />
            <span className="text-error font-medium">
              Overflow Error: {dataStructure} is full! Cannot add more elements.
            </span>
          </div>
        </div>
      )}

      {showUnderflowWarning && (
        <div className="bg-warning/20 border border-warning rounded-curvy p-4 animate-slide-up">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            <span className="text-warning font-medium">
              Underflow Error: {dataStructure} is empty! Cannot remove elements.
            </span>
          </div>
        </div>
      )}

      {/* Visualization */}
      <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-text-primary">
            {dataStructure === 'stack' ? 'Stack Structure' : 'Queue Structure'}
          </h3>
          
          {/* Stack Visualization (Vertical) */}
          {dataStructure === 'stack' && (
            <div className="flex flex-col items-center space-y-4">
              {/* Top indicator */}
              <div className="flex items-center space-x-2">
                <ArrowDown className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">TOP (Push/Pop)</span>
                <ArrowDown className="h-5 w-5 text-primary" />
              </div>
              
              {/* Stack elements */}
              <div className="flex flex-col-reverse space-y-reverse space-y-2 min-h-[200px] justify-end">
                {elements.map((element, index) => (
                  <div
                    key={element.id}
                    className={`
                      w-32 h-16 border-2 rounded-curvy flex items-center justify-center
                      transition-all duration-500 hover-lift relative
                      ${getElementColor(element, index)}
                    `}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold text-text-primary">{element.value}</div>
                      <div className="text-xs text-text-muted">[{index}]</div>
                    </div>
                    
                    {/* Top indicator */}
                    {index === elements.length - 1 && (
                      <div className="absolute -top-2 -right-2 bg-primary text-secondary text-xs px-2 py-1 rounded-curvy">
                        TOP
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Base */}
              <div className="w-40 h-3 bg-accent rounded-curvy shadow-inner"></div>
              <span className="text-sm text-text-muted font-medium">Base</span>
            </div>
          )}

          {/* Queue Visualization (Horizontal) */}
          {dataStructure === 'queue' && (
            <div className="space-y-4">
              {/* Direction indicators */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-primary">FRONT (Dequeue)</span>
                  <ArrowLeft className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center space-x-2">
                  <ArrowRight className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary">REAR (Enqueue)</span>
                </div>
              </div>
              
              {/* Queue elements */}
              <div className="flex justify-center min-h-[100px] items-center">
                <div className="flex space-x-2 overflow-x-auto max-w-full">
                  {elements.map((element, index) => (
                    <div
                      key={element.id}
                      className={`
                        w-20 h-20 border-2 rounded-curvy flex items-center justify-center
                        transition-all duration-500 hover-lift flex-shrink-0 relative
                        ${getElementColor(element, index)}
                      `}
                    >
                      <div className="text-center">
                        <div className="text-lg font-bold text-text-primary">{element.value}</div>
                        <div className="text-xs text-text-muted">[{index}]</div>
                      </div>
                      
                      {/* Front indicator */}
                      {index === 0 && (
                        <div className="absolute -top-2 -left-2 bg-primary text-secondary text-xs px-2 py-1 rounded-curvy">
                          FRONT
                        </div>
                      )}
                      
                      {/* Rear indicator */}
                      {index === elements.length - 1 && elements.length > 1 && (
                        <div className="absolute -top-2 -right-2 bg-info text-white text-xs px-2 py-1 rounded-curvy">
                          REAR
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {elements.length === 0 && (
            <div className="text-center py-12">
              <div className="text-text-muted text-lg mb-2">
                {dataStructure === 'stack' ? 'Stack is empty' : 'Queue is empty'}
              </div>
              <div className="text-text-muted text-sm">
                {dataStructure === 'stack' 
                  ? 'Push elements to add them to the top'
                  : 'Enqueue elements to add them to the rear'
                }
              </div>
            </div>
          )}

          {/* Current Operation Display */}
          <div className="bg-accent/10 rounded-curvy p-4 border border-accent/20 min-h-[60px] flex items-center justify-center">
            <p className="text-text-primary text-center font-medium">
              {currentOperation || 'Select an operation to begin...'}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operation Controls */}
        <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
          <h3 className="text-lg font-medium text-text-primary mb-4">
            {dataStructure === 'stack' ? 'Stack' : 'Queue'} Operations
          </h3>
          
          <div className="space-y-4">
            {/* Add element */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">
                {dataStructure === 'stack' ? 'Push Element' : 'Enqueue Element'}
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Value"
                  className="flex-1 p-3 bg-accent/20 border border-accent/40 rounded-curvy
                           text-text-primary placeholder-text-muted
                           focus:border-primary focus:ring-2 focus:ring-primary/20
                           transition-colors duration-200"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newValue) {
                      pushOrEnqueue();
                    }
                  }}
                />
                <button
                  onClick={pushOrEnqueue}
                  disabled={!newValue || isAnimating}
                  className="px-6 py-3 bg-primary hover:bg-hover text-secondary rounded-curvy
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200 hover-lift font-medium"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="text-xs text-text-muted">
                {elements.length >= maxSize 
                  ? `⚠️ ${dataStructure} is full!` 
                  : `Space available: ${maxSize - elements.length} elements`
                }
              </div>
            </div>

            {/* Remove element */}
            <button
              onClick={popOrDequeue}
              disabled={elements.length === 0 || isAnimating}
              className="w-full px-4 py-3 bg-error hover:bg-error/80 text-white rounded-curvy
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 hover-lift font-medium"
            >
              <Minus className="h-4 w-4 inline mr-2" />
              {dataStructure === 'stack' ? 'Pop' : 'Dequeue'}
              {elements.length > 0 && (
                <span className="ml-2 text-sm">
                  ({dataStructure === 'stack' 
                    ? elements[elements.length - 1].value 
                    : elements[0].value
                  })
                </span>
              )}
            </button>

            {/* Peek */}
            <button
              onClick={peek}
              disabled={elements.length === 0 || isAnimating}
              className="w-full px-4 py-3 bg-info hover:bg-info/80 text-white rounded-curvy
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 hover-lift font-medium"
            >
              <Eye className="h-4 w-4 inline mr-2" />
              Peek {dataStructure === 'stack' ? 'Top' : 'Front'}
              {elements.length > 0 && (
                <span className="ml-2 text-sm">
                  ({dataStructure === 'stack' 
                    ? elements[elements.length - 1].value 
                    : elements[0].value
                  })
                </span>
              )}
            </button>

            {/* Reset */}
            <button
              onClick={reset}
              className="w-full px-4 py-3 bg-accent hover:bg-primary hover:text-secondary 
                       text-text-primary rounded-curvy transition-all duration-200 hover-lift font-medium"
            >
              <RotateCcw className="h-4 w-4 inline mr-2" />
              Reset {dataStructure === 'stack' ? 'Stack' : 'Queue'}
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
          
          {/* Properties */}
          <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
            <h3 className="text-lg font-medium text-text-primary mb-4">
              {dataStructure === 'stack' ? 'Stack' : 'Queue'} Properties
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">
                  {dataStructure === 'stack' ? 'Push/Pop:' : 'Enqueue/Dequeue:'}
                </span>
                <span className="text-success font-mono font-bold">O(1)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Peek:</span>
                <span className="text-success font-mono font-bold">O(1)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Search:</span>
                <span className="text-error font-mono font-bold">O(n)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Space:</span>
                <span className="text-info font-mono font-bold">O(n)</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-accent/10 rounded-curvy">
              <p className="text-xs text-text-muted leading-relaxed">
                {dataStructure === 'stack' 
                  ? 'Stacks follow LIFO principle - perfect for function calls, undo operations, expression evaluation, and backtracking algorithms.'
                  : 'Queues follow FIFO principle - ideal for task scheduling, breadth-first search, handling requests, and process management.'
                }
              </p>
            </div>
            
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Current Size:</span>
                <span className="text-primary font-medium">{elements.length} / {maxSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">
                  {dataStructure === 'stack' ? 'Top Element:' : 'Front Element:'}
                </span>
                <span className="text-primary font-medium">
                  {elements.length > 0 
                    ? (dataStructure === 'stack' 
                        ? elements[elements.length - 1].value 
                        : elements[0].value)
                    : 'None'
                  }
                </span>
              </div>
              {dataStructure === 'queue' && elements.length > 1 && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Rear Element:</span>
                  <span className="text-info font-medium">{elements[elements.length - 1].value}</span>
                </div>
              )}
            </div>
          </div>

          {/* Operation History */}
          {operationHistory.length > 0 && (
            <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
              <h3 className="text-lg font-medium text-text-primary mb-4">Operation History</h3>
              
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {operationHistory.slice(-5).map((op, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 p-2 rounded-curvy text-sm ${
                      op.success ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                    }`}
                  >
                    {op.success ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <span className="flex-1">{op.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StackQueueVisualization;