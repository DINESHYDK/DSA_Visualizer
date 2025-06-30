import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Clock, 
  Zap, 
  ChevronDown, 
  ChevronUp,
  HelpCircle,
  ArrowRight,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface BigONotationGuideProps {
  className?: string;
}

const BigONotationGuide: React.FC<BigONotationGuideProps> = ({
  className = ''
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'time' | 'space' | 'examples'>('time');

  const complexityClasses = [
    {
      name: 'O(1)',
      description: 'Constant Time',
      explanation: 'The algorithm takes the same amount of time regardless of the input size.',
      examples: ['Array access by index', 'Stack push/pop', 'Hash table insertion/lookup (average case)'],
      color: 'text-success',
      graph: [
        { x: 0, y: 1 },
        { x: 100, y: 1 }
      ]
    },
    {
      name: 'O(log n)',
      description: 'Logarithmic Time',
      explanation: 'The algorithm\'s time increases logarithmically as the input size grows. Very efficient for large datasets.',
      examples: ['Binary search', 'Balanced tree operations', 'Divide and conquer algorithms'],
      color: 'text-info',
      graph: [
        { x: 0, y: 0 },
        { x: 10, y: 1 },
        { x: 100, y: 2 },
        { x: 1000, y: 3 }
      ]
    },
    {
      name: 'O(n)',
      description: 'Linear Time',
      explanation: 'The algorithm\'s time increases linearly with the input size. Each element must be processed at least once.',
      examples: ['Linear search', 'Array traversal', 'Counting elements'],
      color: 'text-warning',
      graph: [
        { x: 0, y: 0 },
        { x: 100, y: 100 }
      ]
    },
    {
      name: 'O(n log n)',
      description: 'Linearithmic Time',
      explanation: 'Common in efficient sorting algorithms. Better than quadratic but slower than linear.',
      examples: ['Merge sort', 'Heap sort', 'Quick sort (average case)'],
      color: 'text-warning',
      graph: [
        { x: 0, y: 0 },
        { x: 10, y: 10 * Math.log2(10) },
        { x: 100, y: 100 * Math.log2(100) }
      ]
    },
    {
      name: 'O(n²)',
      description: 'Quadratic Time',
      explanation: 'The algorithm\'s time increases with the square of the input size. Often involves nested iterations.',
      examples: ['Bubble sort', 'Selection sort', 'Insertion sort', 'Simple matrix operations'],
      color: 'text-error',
      graph: [
        { x: 0, y: 0 },
        { x: 10, y: 100 },
        { x: 100, y: 10000 }
      ]
    },
    {
      name: 'O(2ⁿ)',
      description: 'Exponential Time',
      explanation: 'The algorithm\'s time doubles with each additional element. Typically impractical for large inputs.',
      examples: ['Recursive Fibonacci', 'Power set generation', 'Traveling salesman (brute force)'],
      color: 'text-error',
      graph: [
        { x: 0, y: 1 },
        { x: 5, y: 32 },
        { x: 10, y: 1024 }
      ]
    }
  ];

  const spaceComplexityExamples = [
    {
      name: 'O(1)',
      description: 'Constant Space',
      explanation: 'The algorithm uses a fixed amount of memory regardless of input size.',
      examples: ['Iterative algorithms with fixed variables', 'In-place sorting algorithms', 'Math operations'],
      color: 'text-success'
    },
    {
      name: 'O(log n)',
      description: 'Logarithmic Space',
      explanation: 'Memory usage grows logarithmically with input size, often due to recursive call stack.',
      examples: ['Binary search', 'Balanced tree traversal', 'Divide and conquer algorithms'],
      color: 'text-info'
    },
    {
      name: 'O(n)',
      description: 'Linear Space',
      explanation: 'Memory usage grows linearly with input size, typically storing input or output.',
      examples: ['Storing input array', 'Creating result array', 'Hash tables'],
      color: 'text-warning'
    },
    {
      name: 'O(n²)',
      description: 'Quadratic Space',
      explanation: 'Memory usage grows with the square of input size, often for storing all pairs or 2D structures.',
      examples: ['Adjacency matrix for graphs', 'Dynamic programming tables', '2D array creation'],
      color: 'text-error'
    }
  ];

  const algorithmExamples = [
    {
      name: 'Sorting Algorithms',
      algorithms: [
        { name: 'Bubble Sort', time: 'O(n²)', space: 'O(1)', description: 'Simple but inefficient' },
        { name: 'Selection Sort', time: 'O(n²)', space: 'O(1)', description: 'Simple with minimal swaps' },
        { name: 'Insertion Sort', time: 'O(n²)', space: 'O(1)', description: 'Efficient for small or nearly sorted data' },
        { name: 'Merge Sort', time: 'O(n log n)', space: 'O(n)', description: 'Stable, divide and conquer' },
        { name: 'Quick Sort', time: 'O(n log n)*', space: 'O(log n)', description: 'Fast but unstable, *O(n²) worst case' },
        { name: 'Heap Sort', time: 'O(n log n)', space: 'O(1)', description: 'In-place, unstable' }
      ]
    },
    {
      name: 'Search Algorithms',
      algorithms: [
        { name: 'Linear Search', time: 'O(n)', space: 'O(1)', description: 'Simple sequential search' },
        { name: 'Binary Search', time: 'O(log n)', space: 'O(1)', description: 'Requires sorted array' },
        { name: 'Hash Table Lookup', time: 'O(1)*', space: 'O(n)', description: '*Average case, O(n) worst case' }
      ]
    },
    {
      name: 'Graph Algorithms',
      algorithms: [
        { name: 'BFS', time: 'O(V + E)', space: 'O(V)', description: 'Breadth-first traversal' },
        { name: 'DFS', time: 'O(V + E)', space: 'O(V)', description: 'Depth-first traversal' },
        { name: 'Dijkstra', time: 'O((V + E) log V)', space: 'O(V)', description: 'Shortest path algorithm' }
      ]
    }
  ];

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderTimeComplexityTab = () => (
    <div className="space-y-6">
      <p className="text-text-secondary">
        Time complexity measures how the runtime of an algorithm grows as the input size increases.
        It helps us predict performance and compare algorithms.
      </p>
      
      {/* Complexity Classes */}
      <div className="space-y-4">
        {complexityClasses.map((complexity, index) => (
          <div key={index} className="bg-accent/10 rounded-curvy p-4 border border-accent/20">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`font-mono font-bold text-lg ${complexity.color}`}>{complexity.name}</span>
              <span className="text-text-secondary font-medium">{complexity.description}</span>
            </div>
            
            <p className="text-text-muted text-sm mb-3">{complexity.explanation}</p>
            
            <div className="space-y-1">
              <div className="text-xs font-medium text-text-secondary">Examples:</div>
              <ul className="list-disc list-inside text-xs text-text-muted space-y-1">
                {complexity.examples.map((example, i) => (
                  <li key={i}>{example}</li>
                ))}
              </ul>
            </div>
            
            {/* Simple Visualization */}
            <div className="mt-3 h-16 bg-bg-secondary/30 rounded-curvy relative overflow-hidden">
              <div className="absolute inset-0 flex items-end">
                {complexity.graph.map((point, i) => {
                  const x = (point.x / 100) * 100;
                  const y = 100 - Math.min(100, (point.y / (complexity.name === 'O(2ⁿ)' ? 1024 : 10000)) * 100);
                  
                  return (
                    <div
                      key={i}
                      className={`w-1 ${complexity.color} opacity-80`}
                      style={{
                        height: `${100 - y}%`,
                        marginLeft: i === 0 ? `${x}%` : '1%'
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Growth Rate Comparison */}
      <div className="bg-primary/10 rounded-curvy p-4 border border-primary/20">
        <h5 className="font-medium text-primary mb-3">Growth Rate Comparison</h5>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-accent/20">
                <th className="text-left py-2 px-3 text-text-secondary font-semibold">Complexity</th>
                <th className="text-left py-2 px-3 text-text-secondary font-semibold">n=10</th>
                <th className="text-left py-2 px-3 text-text-secondary font-semibold">n=100</th>
                <th className="text-left py-2 px-3 text-text-secondary font-semibold">n=1,000</th>
                <th className="text-left py-2 px-3 text-text-secondary font-semibold">n=1,000,000</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-accent/10">
                <td className="py-2 px-3 font-mono font-medium text-success">O(1)</td>
                <td className="py-2 px-3 text-text-muted">1</td>
                <td className="py-2 px-3 text-text-muted">1</td>
                <td className="py-2 px-3 text-text-muted">1</td>
                <td className="py-2 px-3 text-text-muted">1</td>
              </tr>
              <tr className="border-b border-accent/10">
                <td className="py-2 px-3 font-mono font-medium text-info">O(log n)</td>
                <td className="py-2 px-3 text-text-muted">3</td>
                <td className="py-2 px-3 text-text-muted">7</td>
                <td className="py-2 px-3 text-text-muted">10</td>
                <td className="py-2 px-3 text-text-muted">20</td>
              </tr>
              <tr className="border-b border-accent/10">
                <td className="py-2 px-3 font-mono font-medium text-warning">O(n)</td>
                <td className="py-2 px-3 text-text-muted">10</td>
                <td className="py-2 px-3 text-text-muted">100</td>
                <td className="py-2 px-3 text-text-muted">1,000</td>
                <td className="py-2 px-3 text-text-muted">1,000,000</td>
              </tr>
              <tr className="border-b border-accent/10">
                <td className="py-2 px-3 font-mono font-medium text-warning">O(n log n)</td>
                <td className="py-2 px-3 text-text-muted">33</td>
                <td className="py-2 px-3 text-text-muted">664</td>
                <td className="py-2 px-3 text-text-muted">9,966</td>
                <td className="py-2 px-3 text-text-muted">19,932,122</td>
              </tr>
              <tr className="border-b border-accent/10">
                <td className="py-2 px-3 font-mono font-medium text-error">O(n²)</td>
                <td className="py-2 px-3 text-text-muted">100</td>
                <td className="py-2 px-3 text-text-muted">10,000</td>
                <td className="py-2 px-3 text-text-muted">1,000,000</td>
                <td className="py-2 px-3 text-text-muted">1,000,000,000,000</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-mono font-medium text-error">O(2ⁿ)</td>
                <td className="py-2 px-3 text-text-muted">1,024</td>
                <td className="py-2 px-3 text-text-muted">1.27 × 10³⁰</td>
                <td className="py-2 px-3 text-text-muted">1.07 × 10³⁰¹</td>
                <td className="py-2 px-3 text-text-muted">∞</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSpaceComplexityTab = () => (
    <div className="space-y-6">
      <p className="text-text-secondary">
        Space complexity measures how much additional memory an algorithm needs as the input size increases.
        It helps us understand the memory efficiency of algorithms.
      </p>
      
      {/* Space Complexity Classes */}
      <div className="space-y-4">
        {spaceComplexityExamples.map((complexity, index) => (
          <div key={index} className="bg-accent/10 rounded-curvy p-4 border border-accent/20">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`font-mono font-bold text-lg ${complexity.color}`}>{complexity.name}</span>
              <span className="text-text-secondary font-medium">{complexity.description}</span>
            </div>
            
            <p className="text-text-muted text-sm mb-3">{complexity.explanation}</p>
            
            <div className="space-y-1">
              <div className="text-xs font-medium text-text-secondary">Examples:</div>
              <ul className="list-disc list-inside text-xs text-text-muted space-y-1">
                {complexity.examples.map((example, i) => (
                  <li key={i}>{example}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Space vs Time Tradeoffs */}
      <div className="bg-primary/10 rounded-curvy p-4 border border-primary/20">
        <h5 className="font-medium text-primary mb-3">Space-Time Tradeoffs</h5>
        
        <div className="space-y-3 text-sm text-text-secondary">
          <p>
            Many algorithms can trade space for time or vice versa. Understanding these tradeoffs is crucial for optimization.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="space-y-2">
              <h6 className="font-medium text-text-primary">Using More Space to Save Time</h6>
              <ul className="list-disc list-inside text-xs text-text-muted space-y-1">
                <li>Memoization in dynamic programming</li>
                <li>Hash tables for O(1) lookups</li>
                <li>Precomputing results</li>
                <li>Caching frequently accessed data</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h6 className="font-medium text-text-primary">Using More Time to Save Space</h6>
              <ul className="list-disc list-inside text-xs text-text-muted space-y-1">
                <li>In-place sorting algorithms</li>
                <li>Iterative solutions instead of recursive</li>
                <li>Recomputing values instead of storing</li>
                <li>Stream processing for large datasets</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExamplesTab = () => (
    <div className="space-y-6">
      <p className="text-text-secondary">
        Here are common algorithms and their time/space complexity. Understanding these examples helps build intuition for analyzing new algorithms.
      </p>
      
      {/* Algorithm Examples */}
      {algorithmExamples.map((category, index) => (
        <div key={index} className="bg-accent/10 rounded-curvy p-4 border border-accent/20">
          <h5 className="font-medium text-text-primary mb-3">{category.name}</h5>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-accent/20">
                  <th className="text-left py-2 px-3 text-text-secondary font-semibold">Algorithm</th>
                  <th className="text-left py-2 px-3 text-text-secondary font-semibold">Time Complexity</th>
                  <th className="text-left py-2 px-3 text-text-secondary font-semibold">Space Complexity</th>
                  <th className="text-left py-2 px-3 text-text-secondary font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {category.algorithms.map((algorithm, i) => (
                  <tr key={i} className="border-b border-accent/10 hover:bg-accent/5">
                    <td className="py-2 px-3 font-medium text-text-primary">{algorithm.name}</td>
                    <td className="py-2 px-3 font-mono">{algorithm.time}</td>
                    <td className="py-2 px-3 font-mono">{algorithm.space}</td>
                    <td className="py-2 px-3 text-text-muted text-xs">{algorithm.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Practical Advice */}
      <div className="bg-primary/10 rounded-curvy p-4 border border-primary/20">
        <h5 className="font-medium text-primary mb-3">Practical Complexity Analysis</h5>
        
        <div className="space-y-3 text-sm text-text-secondary">
          <p>
            When analyzing algorithm complexity in practice, consider these tips:
          </p>
          
          <ul className="list-disc list-inside text-xs text-text-muted space-y-2">
            <li>Focus on the dominant term and ignore constants (e.g., 3n² + 2n + 1 becomes O(n²))</li>
            <li>Consider both average and worst-case scenarios</li>
            <li>For small inputs, constants and lower-order terms may matter more than asymptotic complexity</li>
            <li>Real-world performance depends on hardware, language, and implementation details</li>
            <li>Space complexity includes both auxiliary space and input space</li>
            <li>Recursive algorithms often have O(depth) space complexity due to the call stack</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-bg-primary p-4 overflow-auto' : ''} ${className}`}>
      <div className={`bg-bg-card rounded-curvy shadow-curvy ${isFullscreen ? 'h-full overflow-auto' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-accent/20">
          <div className="flex items-center space-x-3">
            <HelpCircle className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold text-primary">Big O Notation Guide</h3>
          </div>
          
          <div className="flex items-center space-x-2">
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

        {/* Tabs */}
        <div className="flex space-x-1 bg-accent/20 rounded-curvy p-1 m-6">
          <button
            onClick={() => setActiveTab('time')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-curvy
                     transition-all duration-200 font-medium ${
              activeTab === 'time'
                ? 'bg-primary text-bg-primary shadow-glow'
                : 'text-text-secondary hover:text-text-primary hover:bg-accent/40'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Time Complexity</span>
          </button>
          
          <button
            onClick={() => setActiveTab('space')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-curvy
                     transition-all duration-200 font-medium ${
              activeTab === 'space'
                ? 'bg-primary text-bg-primary shadow-glow'
                : 'text-text-secondary hover:text-text-primary hover:bg-accent/40'
            }`}
          >
            <Zap className="h-4 w-4" />
            <span>Space Complexity</span>
          </button>
          
          <button
            onClick={() => setActiveTab('examples')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-curvy
                     transition-all duration-200 font-medium ${
              activeTab === 'examples'
                ? 'bg-primary text-bg-primary shadow-glow'
                : 'text-text-secondary hover:text-text-primary hover:bg-accent/40'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Examples</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {activeTab === 'time' && renderTimeComplexityTab()}
          {activeTab === 'space' && renderSpaceComplexityTab()}
          {activeTab === 'examples' && renderExamplesTab()}
        </div>
      </div>
    </div>
  );
};

export default BigONotationGuide;