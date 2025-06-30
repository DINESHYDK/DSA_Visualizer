import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw, 
  Play, 
  Pause,
  Zap,
  Clock
} from 'lucide-react';

interface OperationCount {
  comparisons: number;
  swaps?: number;
  arrayAccesses: number;
  other?: number;
}

interface OperationStep {
  type: 'comparison' | 'swap' | 'access' | 'other';
  description: string;
  count: OperationCount;
  elements?: number[];
}

interface OperationCounterProps {
  algorithm: string;
  initialArray: number[];
  currentStep?: number;
  totalSteps?: number;
  operations?: OperationCount;
  className?: string;
}

const OperationCounter: React.FC<OperationCounterProps> = ({
  algorithm,
  initialArray,
  currentStep = 0,
  totalSteps = 0,
  operations = { comparisons: 0, swaps: 0, arrayAccesses: 0 },
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [operationSteps, setOperationSteps] = useState<OperationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [expectedOperations, setExpectedOperations] = useState<OperationCount>({
    comparisons: 0,
    swaps: 0,
    arrayAccesses: 0
  });

  // Generate expected operations based on algorithm and input size
  useEffect(() => {
    const n = initialArray.length;
    const logn = Math.log2(n);
    
    let expected: OperationCount;
    
    switch (algorithm) {
      case 'bubble':
        expected = {
          comparisons: Math.floor(n * n / 2),
          swaps: Math.floor(n * n / 4),
          arrayAccesses: Math.floor(n * n)
        };
        break;
      case 'selection':
        expected = {
          comparisons: Math.floor(n * n / 2),
          swaps: n - 1,
          arrayAccesses: Math.floor(n * n / 2) + (n - 1) * 2
        };
        break;
      case 'insertion':
        expected = {
          comparisons: Math.floor(n * n / 4),
          swaps: Math.floor(n * n / 4),
          arrayAccesses: Math.floor(n * n / 2)
        };
        break;
      case 'merge':
        expected = {
          comparisons: Math.floor(n * logn),
          swaps: 0,
          arrayAccesses: Math.floor(n * logn * 2)
        };
        break;
      case 'quick':
        expected = {
          comparisons: Math.floor(n * logn * 1.5),
          swaps: Math.floor(n * logn / 2),
          arrayAccesses: Math.floor(n * logn * 2)
        };
        break;
      case 'heap':
        expected = {
          comparisons: Math.floor(n * logn * 2),
          swaps: Math.floor(n * logn),
          arrayAccesses: Math.floor(n * logn * 3)
        };
        break;
      case 'binary':
        expected = {
          comparisons: Math.ceil(logn),
          arrayAccesses: Math.ceil(logn),
        };
        break;
      case 'linear':
        expected = {
          comparisons: Math.floor(n / 2), // Average case
          arrayAccesses: Math.floor(n / 2),
        };
        break;
      default:
        expected = {
          comparisons: n,
          swaps: 0,
          arrayAccesses: n
        };
    }
    
    setExpectedOperations(expected);
    
    // Generate simulated operation steps
    generateOperationSteps();
  }, [algorithm, initialArray]);

  // Update current step based on animation progress
  useEffect(() => {
    if (totalSteps > 0) {
      const stepIndex = Math.floor((currentStep / totalSteps) * operationSteps.length);
      setCurrentStepIndex(Math.min(stepIndex, operationSteps.length - 1));
    }
  }, [currentStep, totalSteps, operationSteps.length]);

  // Auto-play animation
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev >= operationSteps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPlaying, operationSteps.length]);

  const generateOperationSteps = () => {
    // This is a simulation - in a real implementation, these would be actual steps from the algorithm
    const steps: OperationStep[] = [];
    const n = initialArray.length;
    
    if (algorithm === 'bubble') {
      let comparisons = 0;
      let swaps = 0;
      let accesses = 0;
      
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          comparisons++;
          accesses += 2;
          
          steps.push({
            type: 'comparison',
            description: `Comparing elements at indices ${j} and ${j+1}`,
            count: { comparisons, swaps, arrayAccesses: accesses },
            elements: [j, j+1]
          });
          
          if (Math.random() < 0.3) { // Simulate some swaps
            swaps++;
            accesses += 2;
            
            steps.push({
              type: 'swap',
              description: `Swapping elements at indices ${j} and ${j+1}`,
              count: { comparisons, swaps, arrayAccesses: accesses },
              elements: [j, j+1]
            });
          }
        }
      }
    } else if (algorithm === 'merge') {
      // Simplified merge sort steps
      const logn = Math.ceil(Math.log2(n));
      let comparisons = 0;
      let accesses = 0;
      
      // Splitting phase
      for (let level = 0; level < logn; level++) {
        const subArraySize = Math.pow(2, level);
        const numSubArrays = Math.ceil(n / subArraySize);
        
        for (let i = 0; i < numSubArrays / 2; i++) {
          steps.push({
            type: 'access',
            description: `Splitting array into subarrays of size ${subArraySize}`,
            count: { comparisons, arrayAccesses: accesses },
            elements: Array.from({ length: Math.min(subArraySize * 2, n) }, (_, idx) => i * subArraySize * 2 + idx)
          });
          
          accesses += Math.min(subArraySize * 2, n);
        }
      }
      
      // Merging phase
      for (let level = logn - 1; level >= 0; level--) {
        const subArraySize = Math.pow(2, level);
        const numSubArrays = Math.ceil(n / subArraySize);
        
        for (let i = 0; i < numSubArrays / 2; i++) {
          const mergeComparisons = Math.min(subArraySize, n - i * subArraySize * 2);
          comparisons += mergeComparisons;
          accesses += mergeComparisons * 2;
          
          steps.push({
            type: 'comparison',
            description: `Merging subarrays of size ${subArraySize}`,
            count: { comparisons, arrayAccesses: accesses },
            elements: Array.from({ length: Math.min(subArraySize * 2, n - i * subArraySize * 2) }, 
                               (_, idx) => i * subArraySize * 2 + idx)
          });
        }
      }
    } else {
      // Generic steps for other algorithms
      const totalOps = operations.comparisons + (operations.swaps || 0) + operations.arrayAccesses;
      const stepCount = Math.min(20, totalOps); // Limit to reasonable number of steps
      
      let currentComparisons = 0;
      let currentSwaps = 0;
      let currentAccesses = 0;
      
      for (let i = 0; i < stepCount; i++) {
        const progress = i / stepCount;
        currentComparisons = Math.floor(operations.comparisons * progress);
        currentSwaps = Math.floor((operations.swaps || 0) * progress);
        currentAccesses = Math.floor(operations.arrayAccesses * progress);
        
        const type = i % 3 === 0 ? 'comparison' : i % 3 === 1 ? 'swap' : 'access';
        const elements = [
          Math.floor(Math.random() * n),
          Math.floor(Math.random() * n)
        ].sort((a, b) => a - b);
        
        steps.push({
          type: type as any,
          description: type === 'comparison' 
            ? `Comparing elements at indices ${elements[0]} and ${elements[1]}`
            : type === 'swap'
              ? `Swapping elements at indices ${elements[0]} and ${elements[1]}`
              : `Accessing elements in the array`,
          count: { 
            comparisons: currentComparisons, 
            swaps: currentSwaps, 
            arrayAccesses: currentAccesses 
          },
          elements
        });
      }
    }
    
    setOperationSteps(steps);
  };

  const getCurrentOperations = () => {
    if (operationSteps.length === 0) return operations;
    return operationSteps[currentStepIndex]?.count || operations;
  };

  const getPercentage = (value: number, max: number) => {
    return Math.min(100, Math.max(0, (value / max) * 100));
  };

  const getOperationTypeColor = (type: string) => {
    switch (type) {
      case 'comparison': return 'text-comparison';
      case 'swap': return 'text-swap';
      case 'access': return 'text-info';
      default: return 'text-text-primary';
    }
  };

  const getOperationTypeIcon = (type: string) => {
    switch (type) {
      case 'comparison': return <ArrowRight className="h-4 w-4 text-comparison" />;
      case 'swap': return <ArrowLeft className="h-4 w-4 text-swap" />;
      case 'access': return <BarChart3 className="h-4 w-4 text-info" />;
      default: return <Zap className="h-4 w-4 text-primary" />;
    }
  };

  const currentOps = getCurrentOperations();

  return (
    <div className={`bg-bg-card rounded-curvy p-6 shadow-curvy ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-semibold text-primary">Operation Counter</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-curvy text-text-muted hover:text-primary hover:bg-accent/20 
                     transition-colors duration-200"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          
          <button
            onClick={() => setCurrentStepIndex(0)}
            className="p-2 rounded-curvy text-text-muted hover:text-primary hover:bg-accent/20 
                     transition-colors duration-200"
            title="Reset"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Current Operation */}
      {operationSteps.length > 0 && (
        <div className="bg-accent/10 rounded-curvy p-4 border border-accent/20 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            {getOperationTypeIcon(operationSteps[currentStepIndex]?.type || 'other')}
            <h4 className={`font-medium ${getOperationTypeColor(operationSteps[currentStepIndex]?.type || 'other')}`}>
              {operationSteps[currentStepIndex]?.description || 'No operation'}
            </h4>
          </div>
          
          <div className="flex justify-between text-sm text-text-muted">
            <span>Step {currentStepIndex + 1} of {operationSteps.length}</span>
            <span>Elements: {operationSteps[currentStepIndex]?.elements?.join(', ') || 'none'}</span>
          </div>
        </div>
      )}

      {/* Operation Counters */}
      <div className="space-y-4">
        {/* Comparisons */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <ArrowRight className="h-4 w-4 text-comparison" />
              <span className="text-sm font-medium text-text-primary">Comparisons</span>
            </div>
            <div className="text-comparison font-medium">
              {currentOps.comparisons.toLocaleString()}
            </div>
          </div>
          
          <div className="w-full bg-accent/20 rounded-curvy h-4 overflow-hidden">
            <div
              className="h-full bg-comparison rounded-curvy transition-all duration-300"
              style={{
                width: `${getPercentage(currentOps.comparisons, expectedOperations.comparisons)}%`
              }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-text-muted">
            <span>0</span>
            <span>Expected: ~{expectedOperations.comparisons.toLocaleString()}</span>
          </div>
        </div>

        {/* Swaps */}
        {currentOps.swaps !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4 text-swap" />
                <span className="text-sm font-medium text-text-primary">Swaps</span>
              </div>
              <div className="text-swap font-medium">
                {currentOps.swaps.toLocaleString()}
              </div>
            </div>
            
            <div className="w-full bg-accent/20 rounded-curvy h-4 overflow-hidden">
              <div
                className="h-full bg-swap rounded-curvy transition-all duration-300"
                style={{
                  width: `${getPercentage(currentOps.swaps, expectedOperations.swaps || 1)}%`
                }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-text-muted">
              <span>0</span>
              <span>Expected: ~{(expectedOperations.swaps || 0).toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Array Accesses */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-info" />
              <span className="text-sm font-medium text-text-primary">Array Accesses</span>
            </div>
            <div className="text-info font-medium">
              {currentOps.arrayAccesses.toLocaleString()}
            </div>
          </div>
          
          <div className="w-full bg-accent/20 rounded-curvy h-4 overflow-hidden">
            <div
              className="h-full bg-info rounded-curvy transition-all duration-300"
              style={{
                width: `${getPercentage(currentOps.arrayAccesses, expectedOperations.arrayAccesses)}%`
              }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-text-muted">
            <span>0</span>
            <span>Expected: ~{expectedOperations.arrayAccesses.toLocaleString()}</span>
          </div>
        </div>

        {/* Total Operations */}
        <div className="space-y-2 pt-2 border-t border-accent/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-text-primary">Total Operations</span>
            </div>
            <div className="text-primary font-medium">
              {(currentOps.comparisons + (currentOps.swaps || 0) + currentOps.arrayAccesses).toLocaleString()}
            </div>
          </div>
          
          <div className="w-full bg-accent/20 rounded-curvy h-4 overflow-hidden">
            <div
              className="h-full bg-primary rounded-curvy transition-all duration-300"
              style={{
                width: `${getPercentage(
                  currentOps.comparisons + (currentOps.swaps || 0) + currentOps.arrayAccesses,
                  expectedOperations.comparisons + (expectedOperations.swaps || 0) + expectedOperations.arrayAccesses
                )}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Theoretical vs. Actual */}
      <div className="mt-6 bg-primary/10 rounded-curvy p-4 border border-primary/20">
        <h4 className="font-medium text-primary mb-3">Theoretical vs. Actual Performance</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-sm font-medium text-text-primary mb-2">Theoretical Complexity</h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Time Complexity:</span>
                <span className="font-mono text-warning">
                  {algorithm === 'bubble' || algorithm === 'selection' || algorithm === 'insertion' 
                    ? 'O(n²)' 
                    : algorithm === 'merge' || algorithm === 'heap' || algorithm === 'quick'
                      ? 'O(n log n)'
                      : algorithm === 'binary'
                        ? 'O(log n)'
                        : 'O(n)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Space Complexity:</span>
                <span className="font-mono text-info">{getSpaceComplexity()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Input Size (n):</span>
                <span className="text-text-secondary">{initialArray.length}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="text-sm font-medium text-text-primary mb-2">Actual Performance</h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Comparisons:</span>
                <span className="text-comparison">{operations.comparisons.toLocaleString()}</span>
              </div>
              {operations.swaps !== undefined && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Swaps:</span>
                  <span className="text-swap">{operations.swaps.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-text-muted">Array Accesses:</span>
                <span className="text-info">{operations.arrayAccesses.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Navigation */}
      {operationSteps.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
            className="px-3 py-2 bg-accent hover:bg-primary hover:text-bg-primary 
                     text-text-primary rounded-curvy transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4 inline mr-1" />
            Previous
          </button>
          
          <div className="text-sm text-text-muted">
            Step {currentStepIndex + 1} of {operationSteps.length}
          </div>
          
          <button
            onClick={() => setCurrentStepIndex(Math.min(operationSteps.length - 1, currentStepIndex + 1))}
            disabled={currentStepIndex === operationSteps.length - 1}
            className="px-3 py-2 bg-accent hover:bg-primary hover:text-bg-primary 
                     text-text-primary rounded-curvy transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ArrowRight className="h-4 w-4 inline ml-1" />
          </button>
        </div>
      )}
    </div>
  );
};

export default OperationCounter;