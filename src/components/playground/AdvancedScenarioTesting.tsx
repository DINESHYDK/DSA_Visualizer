import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  Clock,
  MemoryStick,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Layers,
  GitBranch
} from 'lucide-react';

interface TestCase {
  id: string;
  name: string;
  description: string;
  input: any;
  expectedOutput?: any;
  category: 'best-case' | 'average-case' | 'worst-case' | 'edge-case' | 'stress-test';
  complexity: {
    time: string;
    space: string;
  };
}

interface TestResult {
  testCaseId: string;
  passed: boolean;
  actualOutput: any;
  executionTime: number;
  memoryUsage: number;
  operationCount: number;
  errorMessage?: string;
}

interface PerformanceMetrics {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  averageExecutionTime: number;
  maxExecutionTime: number;
  minExecutionTime: number;
  totalOperations: number;
  memoryPeak: number;
}

interface AdvancedScenarioTestingProps {
  algorithm: string;
  onRunTest: (testCase: TestCase) => Promise<TestResult>;
  className?: string;
}

const AdvancedScenarioTesting: React.FC<AdvancedScenarioTestingProps> = ({
  algorithm,
  onRunTest,
  className = ''
}) => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stressTestSize, setStressTestSize] = useState(1000);

  // Generate test cases based on algorithm
  useEffect(() => {
    generateTestCases();
  }, [algorithm]);

  const generateTestCases = () => {
    const cases: TestCase[] = [];

    // Sorting algorithm test cases
    if (['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap'].includes(algorithm)) {
      cases.push(
        {
          id: 'sort-best',
          name: 'Already Sorted',
          description: 'Array is already in sorted order (best case)',
          input: [1, 2, 3, 4, 5, 6, 7, 8],
          expectedOutput: [1, 2, 3, 4, 5, 6, 7, 8],
          category: 'best-case',
          complexity: { time: 'O(n)', space: 'O(1)' }
        },
        {
          id: 'sort-average',
          name: 'Random Array',
          description: 'Randomly shuffled array (average case)',
          input: [64, 34, 25, 12, 22, 11, 90, 88],
          expectedOutput: [11, 12, 22, 25, 34, 64, 88, 90],
          category: 'average-case',
          complexity: { time: 'O(n log n)', space: 'O(1)' }
        },
        {
          id: 'sort-worst',
          name: 'Reverse Sorted',
          description: 'Array sorted in reverse order (worst case)',
          input: [8, 7, 6, 5, 4, 3, 2, 1],
          expectedOutput: [1, 2, 3, 4, 5, 6, 7, 8],
          category: 'worst-case',
          complexity: { time: 'O(n²)', space: 'O(1)' }
        },
        {
          id: 'sort-duplicates',
          name: 'Array with Duplicates',
          description: 'Array containing duplicate values',
          input: [5, 2, 8, 2, 9, 1, 5, 5],
          expectedOutput: [1, 2, 2, 5, 5, 5, 8, 9],
          category: 'edge-case',
          complexity: { time: 'O(n log n)', space: 'O(1)' }
        },
        {
          id: 'sort-single',
          name: 'Single Element',
          description: 'Array with only one element',
          input: [42],
          expectedOutput: [42],
          category: 'edge-case',
          complexity: { time: 'O(1)', space: 'O(1)' }
        },
        {
          id: 'sort-empty',
          name: 'Empty Array',
          description: 'Empty array edge case',
          input: [],
          expectedOutput: [],
          category: 'edge-case',
          complexity: { time: 'O(1)', space: 'O(1)' }
        },
        {
          id: 'sort-stress',
          name: 'Large Array',
          description: `Stress test with ${stressTestSize} elements`,
          input: Array.from({ length: stressTestSize }, () => Math.floor(Math.random() * 1000)),
          expectedOutput: null, // Will be calculated
          category: 'stress-test',
          complexity: { time: 'O(n log n)', space: 'O(1)' }
        }
      );
    }

    // Search algorithm test cases
    if (['linear', 'binary'].includes(algorithm)) {
      cases.push(
        {
          id: 'search-found-first',
          name: 'Target at Beginning',
          description: 'Target element is at the first position',
          input: { array: [10, 20, 30, 40, 50], target: 10 },
          expectedOutput: 0,
          category: 'best-case',
          complexity: { time: 'O(1)', space: 'O(1)' }
        },
        {
          id: 'search-found-middle',
          name: 'Target in Middle',
          description: 'Target element is in the middle of array',
          input: { array: [10, 20, 30, 40, 50], target: 30 },
          expectedOutput: 2,
          category: 'average-case',
          complexity: { time: 'O(log n)', space: 'O(1)' }
        },
        {
          id: 'search-found-last',
          name: 'Target at End',
          description: 'Target element is at the last position',
          input: { array: [10, 20, 30, 40, 50], target: 50 },
          expectedOutput: 4,
          category: 'worst-case',
          complexity: { time: 'O(n)', space: 'O(1)' }
        },
        {
          id: 'search-not-found',
          name: 'Target Not Found',
          description: 'Target element is not in the array',
          input: { array: [10, 20, 30, 40, 50], target: 25 },
          expectedOutput: -1,
          category: 'worst-case',
          complexity: { time: 'O(n)', space: 'O(1)' }
        },
        {
          id: 'search-empty',
          name: 'Empty Array',
          description: 'Search in empty array',
          input: { array: [], target: 10 },
          expectedOutput: -1,
          category: 'edge-case',
          complexity: { time: 'O(1)', space: 'O(1)' }
        },
        {
          id: 'search-single-found',
          name: 'Single Element Found',
          description: 'Single element array with target found',
          input: { array: [42], target: 42 },
          expectedOutput: 0,
          category: 'edge-case',
          complexity: { time: 'O(1)', space: 'O(1)' }
        }
      );
    }

    // Tree algorithm test cases
    if (['bst', 'heap', 'avl'].includes(algorithm)) {
      cases.push(
        {
          id: 'tree-balanced',
          name: 'Balanced Tree',
          description: 'Well-balanced tree structure',
          input: [50, 30, 70, 20, 40, 60, 80],
          expectedOutput: null,
          category: 'best-case',
          complexity: { time: 'O(log n)', space: 'O(n)' }
        },
        {
          id: 'tree-skewed',
          name: 'Skewed Tree',
          description: 'Heavily skewed tree (worst case)',
          input: [10, 20, 30, 40, 50, 60, 70],
          expectedOutput: null,
          category: 'worst-case',
          complexity: { time: 'O(n)', space: 'O(n)' }
        }
      );
    }

    setTestCases(cases);
  };

  const runSingleTest = async (testCase: TestCase) => {
    setCurrentTest(testCase.name);
    try {
      const result = await onRunTest(testCase);
      setTestResults(prev => [...prev.filter(r => r.testCaseId !== testCase.id), result]);
      return result;
    } catch (error) {
      const errorResult: TestResult = {
        testCaseId: testCase.id,
        passed: false,
        actualOutput: null,
        executionTime: 0,
        memoryUsage: 0,
        operationCount: 0,
        errorMessage: (error as Error).message
      };
      setTestResults(prev => [...prev.filter(r => r.testCaseId !== testCase.id), errorResult]);
      return errorResult;
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    const results: TestResult[] = [];
    const filteredTests = selectedCategory === 'all' 
      ? testCases 
      : testCases.filter(tc => tc.category === selectedCategory);

    for (const testCase of filteredTests) {
      const result = await runSingleTest(testCase);
      results.push(result);
      
      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Calculate performance metrics
    const metrics: PerformanceMetrics = {
      totalTests: results.length,
      passedTests: results.filter(r => r.passed).length,
      failedTests: results.filter(r => !r.passed).length,
      averageExecutionTime: results.reduce((sum, r) => sum + r.executionTime, 0) / results.length,
      maxExecutionTime: Math.max(...results.map(r => r.executionTime)),
      minExecutionTime: Math.min(...results.map(r => r.executionTime)),
      totalOperations: results.reduce((sum, r) => sum + r.operationCount, 0),
      memoryPeak: Math.max(...results.map(r => r.memoryUsage))
    };

    setPerformanceMetrics(metrics);
    setCurrentTest('');
    setIsRunning(false);
  };

  const resetTests = () => {
    setTestResults([]);
    setPerformanceMetrics(null);
    setCurrentTest('');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'best-case': return <TrendingUp className="h-4 w-4 text-success" />;
      case 'average-case': return <BarChart3 className="h-4 w-4 text-info" />;
      case 'worst-case': return <TrendingDown className="h-4 w-4 text-error" />;
      case 'edge-case': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'stress-test': return <Zap className="h-4 w-4 text-primary" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'best-case': return 'text-success';
      case 'average-case': return 'text-info';
      case 'worst-case': return 'text-error';
      case 'edge-case': return 'text-warning';
      case 'stress-test': return 'text-primary';
      default: return 'text-text-muted';
    }
  };

  const getResultIcon = (result: TestResult) => {
    if (result.passed) {
      return <CheckCircle className="h-5 w-5 text-success" />;
    } else {
      return <XCircle className="h-5 w-5 text-error" />;
    }
  };

  const filteredTestCases = selectedCategory === 'all' 
    ? testCases 
    : testCases.filter(tc => tc.category === selectedCategory);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-2">Advanced Scenario Testing</h2>
            <p className="text-text-secondary">
              Comprehensive testing suite for {algorithm} algorithm with performance analysis and edge case validation.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {isRunning && (
              <div className="flex items-center space-x-2 text-primary">
                <Activity className="h-5 w-5 animate-pulse" />
                <span className="text-sm font-medium">Testing: {currentTest}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-text-primary">Test Controls</h3>
          
          <div className="flex items-center space-x-4">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 bg-accent/20 border border-accent/40 rounded-curvy text-text-primary
                       focus:border-primary focus:ring-1 focus:ring-primary/20"
            >
              <option value="all">All Categories</option>
              <option value="best-case">Best Case</option>
              <option value="average-case">Average Case</option>
              <option value="worst-case">Worst Case</option>
              <option value="edge-case">Edge Cases</option>
              <option value="stress-test">Stress Tests</option>
            </select>

            {/* Stress Test Size */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-text-secondary">Stress Size:</label>
              <input
                type="number"
                value={stressTestSize}
                onChange={(e) => setStressTestSize(parseInt(e.target.value) || 1000)}
                min="100"
                max="10000"
                step="100"
                className="w-20 p-2 bg-accent/20 border border-accent/40 rounded-curvy text-text-primary
                         focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={runAllTests}
            disabled={isRunning || filteredTestCases.length === 0}
            className="px-6 py-3 bg-primary hover:bg-hover text-bg-primary rounded-curvy
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 hover-lift font-medium"
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4 inline mr-2" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 inline mr-2" />
                Run All Tests ({filteredTestCases.length})
              </>
            )}
          </button>

          <button
            onClick={resetTests}
            disabled={isRunning}
            className="px-4 py-3 bg-accent hover:bg-primary hover:text-bg-primary 
                     text-text-primary rounded-curvy transition-all duration-200 hover-lift font-medium"
          >
            <RotateCcw className="h-4 w-4 inline mr-2" />
            Reset
          </button>

          <div className="text-sm text-text-muted">
            {filteredTestCases.length} test{filteredTestCases.length !== 1 ? 's' : ''} selected
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      {performanceMetrics && (
        <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
          <h3 className="text-lg font-medium text-text-primary mb-4">Performance Summary</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{performanceMetrics.passedTests}</div>
              <div className="text-sm text-text-muted">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-error">{performanceMetrics.failedTests}</div>
              <div className="text-sm text-text-muted">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-info">{performanceMetrics.averageExecutionTime.toFixed(2)}ms</div>
              <div className="text-sm text-text-muted">Avg Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{performanceMetrics.maxExecutionTime.toFixed(2)}ms</div>
              <div className="text-sm text-text-muted">Max Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{performanceMetrics.totalOperations}</div>
              <div className="text-sm text-text-muted">Operations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-text-primary">{(performanceMetrics.memoryPeak / 1024).toFixed(1)}KB</div>
              <div className="text-sm text-text-muted">Peak Memory</div>
            </div>
          </div>

          {/* Success Rate Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-text-muted mb-2">
              <span>Success Rate</span>
              <span>{((performanceMetrics.passedTests / performanceMetrics.totalTests) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-accent/20 rounded-curvy h-3">
              <div
                className="h-full bg-success rounded-curvy transition-all duration-500"
                style={{
                  width: `${(performanceMetrics.passedTests / performanceMetrics.totalTests) * 100}%`
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Test Cases */}
      <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
        <h3 className="text-lg font-medium text-text-primary mb-4">Test Cases</h3>
        
        <div className="space-y-4">
          {filteredTestCases.map((testCase) => {
            const result = testResults.find(r => r.testCaseId === testCase.id);
            const isCurrentTest = currentTest === testCase.name;
            
            return (
              <div
                key={testCase.id}
                className={`p-4 rounded-curvy border transition-all duration-200 ${
                  isCurrentTest 
                    ? 'border-primary bg-primary/10 shadow-glow' 
                    : result?.passed 
                      ? 'border-success/40 bg-success/5'
                      : result?.passed === false
                        ? 'border-error/40 bg-error/5'
                        : 'border-accent/40 bg-accent/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getCategoryIcon(testCase.category)}
                    <div>
                      <h4 className="font-medium text-text-primary">{testCase.name}</h4>
                      <p className="text-sm text-text-muted">{testCase.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {/* Complexity Info */}
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-xs text-text-muted">
                        <Clock className="h-3 w-3" />
                        <span>{testCase.complexity.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-text-muted">
                        <MemoryStick className="h-3 w-3" />
                        <span>{testCase.complexity.space}</span>
                      </div>
                    </div>

                    {/* Result */}
                    {result && (
                      <div className="flex items-center space-x-2">
                        {getResultIcon(result)}
                        <div className="text-right">
                          <div className="text-sm font-medium text-text-primary">
                            {result.executionTime.toFixed(2)}ms
                          </div>
                          <div className="text-xs text-text-muted">
                            {result.operationCount} ops
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Run Single Test */}
                    <button
                      onClick={() => runSingleTest(testCase)}
                      disabled={isRunning}
                      className="px-3 py-2 bg-info hover:bg-info/80 text-white rounded-curvy
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition-all duration-200 hover-lift text-sm"
                    >
                      <Play className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {result?.errorMessage && (
                  <div className="mt-3 p-3 bg-error/10 border border-error/20 rounded-curvy">
                    <div className="flex items-center space-x-2 text-error text-sm">
                      <XCircle className="h-4 w-4" />
                      <span>{result.errorMessage}</span>
                    </div>
                  </div>
                )}

                {/* Test Details */}
                {result && !result.errorMessage && (
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-text-muted">Input Size:</span>
                      <span className="ml-2 text-text-primary">
                        {Array.isArray(testCase.input) ? testCase.input.length : 
                         testCase.input?.array?.length || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-text-muted">Execution:</span>
                      <span className="ml-2 text-text-primary">{result.executionTime.toFixed(2)}ms</span>
                    </div>
                    <div>
                      <span className="text-text-muted">Operations:</span>
                      <span className="ml-2 text-text-primary">{result.operationCount}</span>
                    </div>
                    <div>
                      <span className="text-text-muted">Memory:</span>
                      <span className="ml-2 text-text-primary">{(result.memoryUsage / 1024).toFixed(1)}KB</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdvancedScenarioTesting;