import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Clock, 
  MemoryStick, 
  Zap, 
  Info, 
  ChevronDown, 
  ChevronUp,
  HelpCircle,
  ArrowRight,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface AlgorithmComplexity {
  name: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  description: string;
  operations: {
    comparisons: number;
    swaps?: number;
    arrayAccesses: number;
    other?: number;
  };
  executionTime: number;
}

interface ComplexityAnalysisProps {
  algorithm: string;
  metrics: {
    comparisons: number;
    swaps?: number;
    arrayAccesses: number;
    timeElapsed: number;
  };
  inputSize: number;
  className?: string;
}

const ComplexityAnalysis: React.FC<ComplexityAnalysisProps> = ({
  algorithm,
  metrics,
  inputSize,
  className = ''
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showExplanations, setShowExplanations] = useState(true);
  const [algorithmData, setAlgorithmData] = useState<AlgorithmComplexity | null>(null);
  const [comparisonData, setComparisonData] = useState<AlgorithmComplexity[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize algorithm data based on selected algorithm
  useEffect(() => {
    const data = getAlgorithmData(algorithm);
    setAlgorithmData({
      ...data,
      operations: {
        comparisons: metrics.comparisons,
        swaps: metrics.swaps || 0,
        arrayAccesses: metrics.arrayAccesses
      },
      executionTime: metrics.timeElapsed
    });

    // Generate comparison data for other algorithms
    const comparisons = ['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap']
      .filter(alg => alg !== algorithm)
      .map(alg => {
        const algData = getAlgorithmData(alg);
        // Simulate metrics for comparison
        const simulatedMetrics = simulateMetrics(alg, inputSize);
        return {
          ...algData,
          operations: simulatedMetrics,
          executionTime: simulatedMetrics.comparisons * 0.1 // Rough estimate
        };
      });
    
    setComparisonData(comparisons);
  }, [algorithm, metrics, inputSize]);

  const getAlgorithmData = (alg: string): AlgorithmComplexity => {
    switch (alg) {
      case 'bubble':
        return {
          name: 'Bubble Sort',
          timeComplexity: {
            best: 'O(n)',
            average: 'O(n²)',
            worst: 'O(n²)'
          },
          spaceComplexity: 'O(1)',
          description: 'Simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
          operations: { comparisons: 0, swaps: 0, arrayAccesses: 0 },
          executionTime: 0
        };
      case 'selection':
        return {
          name: 'Selection Sort',
          timeComplexity: {
            best: 'O(n²)',
            average: 'O(n²)',
            worst: 'O(n²)'
          },
          spaceComplexity: 'O(1)',
          description: 'Divides the input list into sorted and unsorted regions, repeatedly selecting the smallest element from the unsorted region and moving it to the sorted region.',
          operations: { comparisons: 0, swaps: 0, arrayAccesses: 0 },
          executionTime: 0
        };
      case 'insertion':
        return {
          name: 'Insertion Sort',
          timeComplexity: {
            best: 'O(n)',
            average: 'O(n²)',
            worst: 'O(n²)'
          },
          spaceComplexity: 'O(1)',
          description: 'Builds the final sorted array one item at a time, taking each element from the input and inserting it into its correct position.',
          operations: { comparisons: 0, swaps: 0, arrayAccesses: 0 },
          executionTime: 0
        };
      case 'merge':
        return {
          name: 'Merge Sort',
          timeComplexity: {
            best: 'O(n log n)',
            average: 'O(n log n)',
            worst: 'O(n log n)'
          },
          spaceComplexity: 'O(n)',
          description: 'Divide and conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.',
          operations: { comparisons: 0, swaps: 0, arrayAccesses: 0 },
          executionTime: 0
        };
      case 'quick':
        return {
          name: 'Quick Sort',
          timeComplexity: {
            best: 'O(n log n)',
            average: 'O(n log n)',
            worst: 'O(n²)'
          },
          spaceComplexity: 'O(log n)',
          description: 'Divide and conquer algorithm that selects a pivot element and partitions the array around it, then recursively sorts the sub-arrays.',
          operations: { comparisons: 0, swaps: 0, arrayAccesses: 0 },
          executionTime: 0
        };
      case 'heap':
        return {
          name: 'Heap Sort',
          timeComplexity: {
            best: 'O(n log n)',
            average: 'O(n log n)',
            worst: 'O(n log n)'
          },
          spaceComplexity: 'O(1)',
          description: 'Comparison-based sorting algorithm that uses a binary heap data structure to build a max-heap and then repeatedly extracts the maximum element.',
          operations: { comparisons: 0, swaps: 0, arrayAccesses: 0 },
          executionTime: 0
        };
      case 'linear':
        return {
          name: 'Linear Search',
          timeComplexity: {
            best: 'O(1)',
            average: 'O(n)',
            worst: 'O(n)'
          },
          spaceComplexity: 'O(1)',
          description: 'Simple search algorithm that checks each element of the list until the target element is found or the list ends.',
          operations: { comparisons: 0, arrayAccesses: 0 },
          executionTime: 0
        };
      case 'binary':
        return {
          name: 'Binary Search',
          timeComplexity: {
            best: 'O(1)',
            average: 'O(log n)',
            worst: 'O(log n)'
          },
          spaceComplexity: 'O(1)',
          description: 'Efficient search algorithm that works on sorted arrays by repeatedly dividing the search interval in half.',
          operations: { comparisons: 0, arrayAccesses: 0 },
          executionTime: 0
        };
      default:
        return {
          name: algorithm,
          timeComplexity: {
            best: 'O(?)',
            average: 'O(?)',
            worst: 'O(?)'
          },
          spaceComplexity: 'O(?)',
          description: 'Algorithm complexity information not available.',
          operations: { comparisons: 0, swaps: 0, arrayAccesses: 0 },
          executionTime: 0
        };
    }
  };

  // Simulate metrics for comparison algorithms
  const simulateMetrics = (alg: string, size: number) => {
    const n = size;
    const logn = Math.log2(n);
    
    switch (alg) {
      case 'bubble':
        return {
          comparisons: Math.floor(n * n * 0.5),
          swaps: Math.floor(n * n * 0.25),
          arrayAccesses: Math.floor(n * n)
        };
      case 'selection':
        return {
          comparisons: Math.floor(n * n * 0.5),
          swaps: n - 1,
          arrayAccesses: Math.floor(n * n * 0.5) + (n - 1) * 2
        };
      case 'insertion':
        return {
          comparisons: Math.floor(n * n * 0.25),
          swaps: Math.floor(n * n * 0.25),
          arrayAccesses: Math.floor(n * n * 0.5)
        };
      case 'merge':
        return {
          comparisons: Math.floor(n * logn),
          swaps: 0,
          arrayAccesses: Math.floor(n * logn * 2)
        };
      case 'quick':
        return {
          comparisons: Math.floor(n * logn * 1.5),
          swaps: Math.floor(n * logn * 0.5),
          arrayAccesses: Math.floor(n * logn * 2)
        };
      case 'heap':
        return {
          comparisons: Math.floor(n * logn * 2),
          swaps: Math.floor(n * logn),
          arrayAccesses: Math.floor(n * logn * 3)
        };
      default:
        return {
          comparisons: n,
          swaps: 0,
          arrayAccesses: n
        };
    }
  };

  const getComplexityColor = (complexity: string) => {
    if (complexity.includes('1)')) return 'text-success';
    if (complexity.includes('log n)')) return 'text-info';
    if (complexity.includes('n)')) return 'text-warning';
    if (complexity.includes('n²)')) return 'text-error';
    return 'text-text-primary';
  };

  const getComplexityExplanation = (complexity: string) => {
    if (complexity.includes('1)')) {
      return 'Constant time - operations don\'t depend on input size';
    }
    if (complexity.includes('log n)')) {
      return 'Logarithmic time - operations grow logarithmically with input size';
    }
    if (complexity.includes('n)')) {
      return 'Linear time - operations grow linearly with input size';
    }
    if (complexity.includes('n log n)')) {
      return 'Linearithmic time - operations grow at rate of n log n';
    }
    if (complexity.includes('n²)')) {
      return 'Quadratic time - operations grow with square of input size';
    }
    return 'Complexity explanation not available';
  };

  const getOperationPercentage = (value: number, max: number) => {
    return Math.min(100, Math.max(0, (value / max) * 100));
  };

  const getMaxOperations = () => {
    if (!algorithmData || !comparisonData.length) return 1;
    
    const allComparisons = [
      algorithmData.operations.comparisons,
      ...comparisonData.map(data => data.operations.comparisons)
    ];
    
    return Math.max(...allComparisons);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!algorithmData) {
    return (
      <div className={`bg-bg-card rounded-curvy p-6 shadow-curvy ${className}`}>
        <div className="text-center text-text-muted">
          Loading complexity analysis...
        </div>
      </div>
    );
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-bg-primary p-4 overflow-auto' : ''} ${className}`}>
      <div className={`bg-bg-card rounded-curvy shadow-curvy ${isFullscreen ? 'h-full overflow-auto' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-accent/20">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold text-primary">Complexity Analysis</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowExplanations(!showExplanations)}
              className="p-2 rounded-curvy text-text-muted hover:text-primary hover:bg-accent/20 
                       transition-colors duration-200"
              title={showExplanations ? "Hide Explanations" : "Show Explanations"}
            >
              <Info className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-curvy text-text-muted hover:text-primary hover:bg-accent/20 
                       transition-colors duration-200"
              title={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-curvy text-text-muted hover:text-primary hover:bg-accent/20 
                       transition-colors duration-200"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Current Algorithm Complexity */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-text-primary">
              {algorithmData.name} Complexity Analysis
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Time Complexity */}
              <div className="bg-accent/10 rounded-curvy p-4 border border-accent/20">
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <h5 className="font-medium text-text-primary">Time Complexity</h5>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Best Case:</span>
                    <span className={`font-mono font-bold ${getComplexityColor(algorithmData.timeComplexity.best)}`}>
                      {algorithmData.timeComplexity.best}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Average Case:</span>
                    <span className={`font-mono font-bold ${getComplexityColor(algorithmData.timeComplexity.average)}`}>
                      {algorithmData.timeComplexity.average}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Worst Case:</span>
                    <span className={`font-mono font-bold ${getComplexityColor(algorithmData.timeComplexity.worst)}`}>
                      {algorithmData.timeComplexity.worst}
                    </span>
                  </div>
                </div>
                
                {showExplanations && (
                  <div className="mt-4 p-3 bg-bg-secondary/30 rounded-curvy text-xs text-text-muted">
                    <p className="mb-2">
                      <span className="font-medium text-text-secondary">Time Complexity</span> measures how the runtime of an algorithm grows as the input size increases.
                    </p>
                    <p>
                      {getComplexityExplanation(algorithmData.timeComplexity.average)}
                    </p>
                  </div>
                )}
              </div>

              {/* Space Complexity & Operations */}
              <div className="bg-accent/10 rounded-curvy p-4 border border-accent/20">
                <div className="flex items-center space-x-2 mb-3">
                  <MemoryStick className="h-5 w-5 text-info" />
                  <h5 className="font-medium text-text-primary">Space & Operations</h5>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Space Complexity:</span>
                    <span className={`font-mono font-bold ${getComplexityColor(algorithmData.spaceComplexity)}`}>
                      {algorithmData.spaceComplexity}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Comparisons:</span>
                    <span className="text-comparison font-medium">
                      {algorithmData.operations.comparisons.toLocaleString()}
                    </span>
                  </div>
                  
                  {algorithmData.operations.swaps !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-text-muted">Swaps:</span>
                      <span className="text-swap font-medium">
                        {algorithmData.operations.swaps.toLocaleString()}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Array Accesses:</span>
                    <span className="text-info font-medium">
                      {algorithmData.operations.arrayAccesses.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                {showExplanations && (
                  <div className="mt-4 p-3 bg-bg-secondary/30 rounded-curvy text-xs text-text-muted">
                    <p className="mb-2">
                      <span className="font-medium text-text-secondary">Space Complexity</span> measures the additional memory an algorithm needs as input size increases.
                    </p>
                    <p>
                      {getComplexityExplanation(algorithmData.spaceComplexity)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Real-time Metrics */}
            <div className="bg-accent/10 rounded-curvy p-4 border border-accent/20">
              <div className="flex items-center space-x-2 mb-3">
                <Zap className="h-5 w-5 text-warning" />
                <h5 className="font-medium text-text-primary">Real-time Performance Metrics</h5>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Comparisons */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Comparisons:</span>
                    <span className="text-comparison font-medium">
                      {algorithmData.operations.comparisons.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-accent/20 rounded-curvy h-2">
                    <div
                      className="h-full bg-comparison rounded-curvy transition-all duration-500"
                      style={{
                        width: `${getOperationPercentage(algorithmData.operations.comparisons, getMaxOperations())}%`
                      }}
                    />
                  </div>
                  <div className="text-xs text-text-muted">
                    {algorithmData.timeComplexity.average === 'O(n²)' 
                      ? `Expected: ~${Math.floor(inputSize * inputSize / 2)} for n=${inputSize}`
                      : algorithmData.timeComplexity.average === 'O(n log n)'
                        ? `Expected: ~${Math.floor(inputSize * Math.log2(inputSize))} for n=${inputSize}`
                        : ''}
                  </div>
                </div>
                
                {/* Swaps */}
                {algorithmData.operations.swaps !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-text-muted">Swaps:</span>
                      <span className="text-swap font-medium">
                        {algorithmData.operations.swaps.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-accent/20 rounded-curvy h-2">
                      <div
                        className="h-full bg-swap rounded-curvy transition-all duration-500"
                        style={{
                          width: `${getOperationPercentage(algorithmData.operations.swaps, getMaxOperations() / 2)}%`
                        }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Execution Time */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Execution Time:</span>
                    <span className="text-success font-medium">
                      {(algorithmData.executionTime / 1000).toFixed(2)}s
                    </span>
                  </div>
                  <div className="w-full bg-accent/20 rounded-curvy h-2">
                    <div
                      className="h-full bg-success rounded-curvy transition-all duration-500"
                      style={{
                        width: `${getOperationPercentage(algorithmData.executionTime, 5000)}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Big O Notation Explanation */}
          {showExplanations && (
            <div className="bg-primary/10 rounded-curvy p-4 border border-primary/20">
              <div className="flex items-center space-x-2 mb-3">
                <HelpCircle className="h-5 w-5 text-primary" />
                <h5 className="font-medium text-primary">Understanding Big O Notation</h5>
              </div>
              
              <div className="space-y-3 text-sm text-text-secondary">
                <p>
                  Big O notation describes the performance of an algorithm in terms of how its runtime or space requirements grow as the input size increases.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-success">O(1)</span>
                      <ArrowRight className="h-3 w-3 text-text-muted" />
                      <span>Constant time - fastest</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-success">O(log n)</span>
                      <ArrowRight className="h-3 w-3 text-text-muted" />
                      <span>Logarithmic time - very fast</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-warning">O(n)</span>
                      <ArrowRight className="h-3 w-3 text-text-muted" />
                      <span>Linear time - scales with input</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-warning">O(n log n)</span>
                      <ArrowRight className="h-3 w-3 text-text-muted" />
                      <span>Linearithmic time - efficient sorting</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-error">O(n²)</span>
                      <ArrowRight className="h-3 w-3 text-text-muted" />
                      <span>Quadratic time - slow for large inputs</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-error">O(2ⁿ)</span>
                      <ArrowRight className="h-3 w-3 text-text-muted" />
                      <span>Exponential time - very slow</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Algorithm Comparison (Expanded View) */}
          {expanded && (
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-text-primary">
                Algorithm Comparison
              </h4>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-accent/20">
                      <th className="text-left py-3 px-4 text-text-secondary font-semibold">Algorithm</th>
                      <th className="text-left py-3 px-4 text-text-secondary font-semibold">Best Case</th>
                      <th className="text-left py-3 px-4 text-text-secondary font-semibold">Average Case</th>
                      <th className="text-left py-3 px-4 text-text-secondary font-semibold">Worst Case</th>
                      <th className="text-left py-3 px-4 text-text-secondary font-semibold">Space</th>
                      <th className="text-left py-3 px-4 text-text-secondary font-semibold">Comparisons</th>
                      <th className="text-left py-3 px-4 text-text-secondary font-semibold">Swaps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Current Algorithm */}
                    <tr className="border-b border-accent/10 bg-primary/10">
                      <td className="py-3 px-4 font-medium text-primary">{algorithmData.name}</td>
                      <td className="py-3 px-4 font-mono">{algorithmData.timeComplexity.best}</td>
                      <td className="py-3 px-4 font-mono">{algorithmData.timeComplexity.average}</td>
                      <td className="py-3 px-4 font-mono">{algorithmData.timeComplexity.worst}</td>
                      <td className="py-3 px-4 font-mono">{algorithmData.spaceComplexity}</td>
                      <td className="py-3 px-4 text-comparison">{algorithmData.operations.comparisons.toLocaleString()}</td>
                      <td className="py-3 px-4 text-swap">{algorithmData.operations.swaps?.toLocaleString() || 'N/A'}</td>
                    </tr>
                    
                    {/* Comparison Algorithms */}
                    {comparisonData.map((data, index) => (
                      <tr key={index} className="border-b border-accent/10 hover:bg-accent/5">
                        <td className="py-3 px-4 font-medium text-text-secondary">{data.name}</td>
                        <td className="py-3 px-4 font-mono">{data.timeComplexity.best}</td>
                        <td className="py-3 px-4 font-mono">{data.timeComplexity.average}</td>
                        <td className="py-3 px-4 font-mono">{data.timeComplexity.worst}</td>
                        <td className="py-3 px-4 font-mono">{data.spaceComplexity}</td>
                        <td className="py-3 px-4 text-text-muted">{data.operations.comparisons.toLocaleString()}</td>
                        <td className="py-3 px-4 text-text-muted">{data.operations.swaps?.toLocaleString() || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Comparison Chart */}
              <div className="bg-accent/10 rounded-curvy p-4 border border-accent/20">
                <h5 className="font-medium text-text-primary mb-4">Comparison Chart</h5>
                
                <div className="space-y-4">
                  {/* Comparisons Chart */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-text-muted">Comparisons</span>
                      <span className="text-xs text-text-muted">n = {inputSize}</span>
                    </div>
                    
                    <div className="space-y-2">
                      {/* Current algorithm */}
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-primary w-24">{algorithmData.name}</span>
                          <div className="flex-1 bg-accent/20 rounded-curvy h-6 overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-curvy flex items-center px-2 text-xs text-bg-primary font-medium"
                              style={{
                                width: `${getOperationPercentage(algorithmData.operations.comparisons, getMaxOperations())}%`
                              }}
                            >
                              {algorithmData.operations.comparisons.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Comparison algorithms */}
                      {comparisonData.map((data, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-text-secondary w-24">{data.name}</span>
                            <div className="flex-1 bg-accent/20 rounded-curvy h-6 overflow-hidden">
                              <div
                                className="h-full bg-info/70 rounded-curvy flex items-center px-2 text-xs text-bg-primary font-medium"
                                style={{
                                  width: `${getOperationPercentage(data.operations.comparisons, getMaxOperations())}%`
                                }}
                              >
                                {data.operations.comparisons.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Complexity Calculator */}
              <div className="bg-accent/10 rounded-curvy p-4 border border-accent/20">
                <h5 className="font-medium text-text-primary mb-3">Complexity Calculator</h5>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Input Size (n)
                    </label>
                    <input
                      type="number"
                      value={inputSize}
                      readOnly
                      className="w-full p-2 bg-accent/20 border border-accent/40 rounded-curvy
                               text-text-primary focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Expected Operations
                    </label>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-text-muted">O(n):</span>
                        <span className="text-xs font-mono text-warning">{inputSize.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-text-muted">O(n log n):</span>
                        <span className="text-xs font-mono text-warning">
                          {Math.floor(inputSize * Math.log2(inputSize)).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-text-muted">O(n²):</span>
                        <span className="text-xs font-mono text-error">
                          {Math.floor(inputSize * inputSize).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-xs text-text-muted">
                  <p>
                    This calculator shows expected operation counts for different complexity classes with the current input size.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplexityAnalysis;