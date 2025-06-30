import React, { useState, useEffect } from 'react';
import ComplexityAnalysis from '../components/educational/ComplexityAnalysis';
import BigONotationGuide from '../components/educational/BigONotationGuide';
import PerformanceComparisonChart from '../components/educational/PerformanceComparisonChart';
import SpaceComplexityVisualizer from '../components/educational/SpaceComplexityVisualizer';
import OperationCounter from '../components/educational/OperationCounter';
import ComplexityCalculator from '../components/educational/ComplexityCalculator';
import { 
  BarChart3, 
  Clock, 
  MemoryStick, 
  Zap, 
  HelpCircle, 
  Calculator,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { generateRandomArray } from '../utils';

const ComplexityAnalysisPage: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('bubble');
  const [inputSize, setInputSize] = useState<number>(20);
  const [currentArray, setCurrentArray] = useState<number[]>([]);
  const [metrics, setMetrics] = useState({
    comparisons: 0,
    swaps: 0,
    arrayAccesses: 0,
    timeElapsed: 0
  });
  const [algorithmPerformance, setAlgorithmPerformance] = useState<any[]>([]);

  // Initialize data
  useEffect(() => {
    generateNewArray();
    simulateAlgorithmPerformance();
  }, [selectedAlgorithm, inputSize]);

  const generateNewArray = () => {
    const newArray = generateRandomArray(inputSize, 1, 100);
    setCurrentArray(newArray);
    
    // Simulate metrics for the selected algorithm
    const simulatedMetrics = simulateMetrics(selectedAlgorithm, inputSize);
    setMetrics(simulatedMetrics);
  };

  const simulateMetrics = (alg: string, size: number) => {
    const n = size;
    const logn = Math.log2(n);
    
    // Add some randomness to make it look realistic
    const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    
    switch (alg) {
      case 'bubble':
        return {
          comparisons: Math.floor(n * n * 0.5 * randomFactor),
          swaps: Math.floor(n * n * 0.25 * randomFactor),
          arrayAccesses: Math.floor(n * n * randomFactor),
          timeElapsed: Math.floor(n * n * 0.5 * randomFactor)
        };
      case 'selection':
        return {
          comparisons: Math.floor(n * n * 0.5 * randomFactor),
          swaps: Math.floor(n * randomFactor),
          arrayAccesses: Math.floor(n * n * 0.5 * randomFactor) + Math.floor(n * 2 * randomFactor),
          timeElapsed: Math.floor(n * n * 0.4 * randomFactor)
        };
      case 'insertion':
        return {
          comparisons: Math.floor(n * n * 0.25 * randomFactor),
          swaps: Math.floor(n * n * 0.25 * randomFactor),
          arrayAccesses: Math.floor(n * n * 0.5 * randomFactor),
          timeElapsed: Math.floor(n * n * 0.3 * randomFactor)
        };
      case 'merge':
        return {
          comparisons: Math.floor(n * logn * randomFactor),
          swaps: 0,
          arrayAccesses: Math.floor(n * logn * 2 * randomFactor),
          timeElapsed: Math.floor(n * logn * 2 * randomFactor)
        };
      case 'quick':
        return {
          comparisons: Math.floor(n * logn * 1.5 * randomFactor),
          swaps: Math.floor(n * logn * 0.5 * randomFactor),
          arrayAccesses: Math.floor(n * logn * 2 * randomFactor),
          timeElapsed: Math.floor(n * logn * 1.5 * randomFactor)
        };
      case 'heap':
        return {
          comparisons: Math.floor(n * logn * 2 * randomFactor),
          swaps: Math.floor(n * logn * randomFactor),
          arrayAccesses: Math.floor(n * logn * 3 * randomFactor),
          timeElapsed: Math.floor(n * logn * 2.5 * randomFactor)
        };
      case 'binary':
        return {
          comparisons: Math.floor(logn * randomFactor),
          swaps: 0,
          arrayAccesses: Math.floor(logn * randomFactor),
          timeElapsed: Math.floor(logn * 5 * randomFactor)
        };
      case 'linear':
        return {
          comparisons: Math.floor(n * 0.5 * randomFactor),
          swaps: 0,
          arrayAccesses: Math.floor(n * 0.5 * randomFactor),
          timeElapsed: Math.floor(n * 0.5 * randomFactor)
        };
      default:
        return {
          comparisons: Math.floor(n * randomFactor),
          swaps: 0,
          arrayAccesses: Math.floor(n * randomFactor),
          timeElapsed: Math.floor(n * randomFactor)
        };
    }
  };

  const simulateAlgorithmPerformance = () => {
    const algorithms = ['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap'];
    const performance = algorithms.map(alg => {
      const metrics = simulateMetrics(alg, inputSize);
      
      return {
        name: alg.charAt(0).toUpperCase() + alg.slice(1) + ' Sort',
        category: 'sorting',
        metrics: {
          comparisons: metrics.comparisons,
          swaps: metrics.swaps,
          arrayAccesses: metrics.arrayAccesses,
          executionTime: metrics.timeElapsed,
          memoryUsage: alg === 'merge' ? inputSize * 4 : 16 // Simulated memory usage
        },
        complexity: {
          time: {
            best: alg === 'bubble' || alg === 'insertion' ? 'O(n)' : 
                  alg === 'selection' ? 'O(n²)' : 'O(n log n)',
            average: alg === 'bubble' || alg === 'selection' || alg === 'insertion' ? 
                     'O(n²)' : 'O(n log n)',
            worst: alg === 'bubble' || alg === 'selection' || alg === 'insertion' ? 
                   'O(n²)' : alg === 'quick' ? 'O(n²)' : 'O(n log n)'
          },
          space: alg === 'merge' ? 'O(n)' : alg === 'quick' ? 'O(log n)' : 'O(1)'
        }
      };
    });
    
    setAlgorithmPerformance(performance);
  };

  const algorithms = [
    { id: 'bubble', name: 'Bubble Sort', category: 'sorting', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'selection', name: 'Selection Sort', category: 'sorting', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'insertion', name: 'Insertion Sort', category: 'sorting', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'merge', name: 'Merge Sort', category: 'sorting', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'quick', name: 'Quick Sort', category: 'sorting', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'heap', name: 'Heap Sort', category: 'sorting', icon: <BarChart3 className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Complexity Analysis</h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Understand algorithm performance through comprehensive complexity analysis, 
            real-time metrics, and interactive visualizations.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-bg-card rounded-curvy p-6 shadow-curvy mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-medium text-text-primary mb-4">Analysis Configuration</h2>
              
              <div className="flex flex-wrap items-center gap-4">
                {/* Algorithm Selection */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Algorithm
                  </label>
                  <select
                    value={selectedAlgorithm}
                    onChange={(e) => setSelectedAlgorithm(e.target.value)}
                    className="p-2 bg-accent/20 border border-accent/40 rounded-curvy text-text-primary
                             focus:border-primary focus:ring-1 focus:ring-primary/20"
                  >
                    {algorithms.map((alg) => (
                      <option key={alg.id} value={alg.id}>
                        {alg.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Input Size */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Input Size: {inputSize}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={inputSize}
                    onChange={(e) => setInputSize(parseInt(e.target.value))}
                    className="w-48 h-3 bg-accent rounded-curvy appearance-none cursor-pointer
                             focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                
                {/* Regenerate Button */}
                <div className="self-end">
                  <button
                    onClick={generateNewArray}
                    className="px-4 py-2 bg-primary hover:bg-hover text-bg-primary rounded-curvy
                             transition-all duration-200 hover-lift font-medium"
                  >
                    <RefreshCw className="h-4 w-4 inline mr-2" />
                    Regenerate Data
                  </button>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-text-muted mb-1">Current Array:</div>
              <div className="text-text-secondary text-xs">
                [{currentArray.slice(0, 10).join(', ')}{currentArray.length > 10 ? '...' : ''}]
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Complexity Analysis */}
            <ComplexityAnalysis
              algorithm={selectedAlgorithm}
              metrics={metrics}
              inputSize={inputSize}
            />
            
            {/* Operation Counter */}
            <OperationCounter
              algorithm={selectedAlgorithm}
              initialArray={currentArray}
              currentStep={10}
              totalSteps={20}
              operations={metrics}
            />
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            {/* Big O Notation Guide */}
            <BigONotationGuide />
            
            {/* Space Complexity Visualizer */}
            <SpaceComplexityVisualizer
              algorithm={selectedAlgorithm}
              inputSize={inputSize}
            />
          </div>
        </div>

        {/* Performance Comparison Chart */}
        <div className="mb-8">
          <PerformanceComparisonChart
            algorithms={algorithmPerformance}
            inputSize={inputSize}
            onRefresh={simulateAlgorithmPerformance}
          />
        </div>

        {/* Complexity Calculator */}
        <div className="mb-8">
          <ComplexityCalculator />
        </div>

        {/* Educational Content */}
        <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
          <h2 className="text-2xl font-semibold text-primary mb-6">Understanding Algorithm Complexity</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Time Complexity */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-primary flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Time Complexity</span>
              </h3>
              
              <div className="space-y-3">
                <p className="text-text-secondary text-sm">
                  Time complexity measures how the runtime of an algorithm grows as the input size increases.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-success font-bold">O(1)</span>
                    <ArrowRight className="h-3 w-3 text-text-muted" />
                    <span className="text-sm text-text-muted">Constant time (fastest)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-success font-bold">O(log n)</span>
                    <ArrowRight className="h-3 w-3 text-text-muted" />
                    <span className="text-sm text-text-muted">Logarithmic time (very fast)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-warning font-bold">O(n)</span>
                    <ArrowRight className="h-3 w-3 text-text-muted" />
                    <span className="text-sm text-text-muted">Linear time (scales with input)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-warning font-bold">O(n log n)</span>
                    <ArrowRight className="h-3 w-3 text-text-muted" />
                    <span className="text-sm text-text-muted">Linearithmic time (efficient sorting)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-error font-bold">O(n²)</span>
                    <ArrowRight className="h-3 w-3 text-text-muted" />
                    <span className="text-sm text-text-muted">Quadratic time (slow for large inputs)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Space Complexity */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-info flex items-center space-x-2">
                <MemoryStick className="h-5 w-5" />
                <span>Space Complexity</span>
              </h3>
              
              <div className="space-y-3">
                <p className="text-text-secondary text-sm">
                  Space complexity measures how much additional memory an algorithm needs as the input size increases.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-success font-bold">O(1)</span>
                    <ArrowRight className="h-3 w-3 text-text-muted" />
                    <span className="text-sm text-text-muted">Constant space (in-place)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-success font-bold">O(log n)</span>
                    <ArrowRight className="h-3 w-3 text-text-muted" />
                    <span className="text-sm text-text-muted">Logarithmic space (recursion)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-warning font-bold">O(n)</span>
                    <ArrowRight className="h-3 w-3 text-text-muted" />
                    <span className="text-sm text-text-muted">Linear space (auxiliary arrays)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-error font-bold">O(n²)</span>
                    <ArrowRight className="h-3 w-3 text-text-muted" />
                    <span className="text-sm text-text-muted">Quadratic space (matrices)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Practical Considerations */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-warning flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Practical Considerations</span>
              </h3>
              
              <div className="space-y-3">
                <p className="text-text-secondary text-sm">
                  When analyzing algorithms, consider these practical factors beyond just Big O notation.
                </p>
                
                <ul className="space-y-2 text-sm text-text-muted list-disc list-inside">
                  <li>Constants matter for small inputs</li>
                  <li>Cache efficiency affects real-world performance</li>
                  <li>Memory access patterns impact speed</li>
                  <li>Algorithm simplicity affects maintainability</li>
                  <li>Hardware characteristics influence performance</li>
                  <li>Space-time tradeoffs may be necessary</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="mt-8 bg-accent/10 rounded-curvy p-4 border border-accent/20">
            <h3 className="text-lg font-medium text-text-primary mb-3">Additional Resources</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-bg-secondary/30 rounded-curvy p-3">
                <h4 className="font-medium text-primary mb-2">Books</h4>
                <ul className="space-y-1 text-sm text-text-muted">
                  <li>• "Introduction to Algorithms" by CLRS</li>
                  <li>• "Algorithm Design Manual" by Skiena</li>
                  <li>• "Grokking Algorithms" by Bhargava</li>
                </ul>
              </div>
              
              <div className="bg-bg-secondary/30 rounded-curvy p-3">
                <h4 className="font-medium text-primary mb-2">Online Courses</h4>
                <ul className="space-y-1 text-sm text-text-muted">
                  <li>• MIT OpenCourseWare - Algorithms</li>
                  <li>• Stanford Algorithms Specialization</li>
                  <li>• Khan Academy - Algorithms</li>
                </ul>
              </div>
              
              <div className="bg-bg-secondary/30 rounded-curvy p-3">
                <h4 className="font-medium text-primary mb-2">Interactive Tools</h4>
                <ul className="space-y-1 text-sm text-text-muted">
                  <li>• VisuAlgo.net</li>
                  <li>• Big-O Cheat Sheet</li>
                  <li>• Algorithm Visualizer</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplexityAnalysisPage;