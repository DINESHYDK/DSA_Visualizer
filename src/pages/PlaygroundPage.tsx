import React, { useState } from 'react';
import MultiLevelInputSystem from '../components/playground/MultiLevelInputSystem';
import AdvancedScenarioTesting from '../components/playground/AdvancedScenarioTesting';
import AlgorithmCustomization from '../components/playground/AlgorithmCustomization';
import SortingVisualization from '../components/sorting/SortingVisualization';
import { 
  Play, 
  Settings, 
  TestTube, 
  Code, 
  BarChart3, 
  Zap, 
  Target,
  Layers,
  GitBranch,
  Network,
  Database
} from 'lucide-react';

interface DataStructureConfig {
  type: 'array' | 'linked-list' | 'tree' | 'graph';
  size: number;
  values?: number[];
  connections?: { from: number; to: number; weight?: number }[];
  properties?: Record<string, any>;
}

interface TestScenario {
  id: string;
  name: string;
  description: string;
  dataStructure: DataStructureConfig;
  algorithm?: string;
  expectedResult?: any;
  category: 'basic' | 'edge-case' | 'performance' | 'custom';
}

interface AlgorithmConfig {
  id: string;
  name: string;
  description: string;
  parameters: any[];
  customCode?: string;
  heuristics?: Record<string, any>;
}

const PlaygroundPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'input' | 'testing' | 'customization'>('input');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('bubble');
  const [currentDataStructure, setCurrentDataStructure] = useState<DataStructureConfig>({
    type: 'array',
    size: 8,
    values: [64, 34, 25, 12, 22, 11, 90, 88]
  });
  const [currentScenario, setCurrentScenario] = useState<TestScenario | null>(null);
  const [algorithmConfig, setAlgorithmConfig] = useState<AlgorithmConfig | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const algorithms = [
    { id: 'bubble', name: 'Bubble Sort', category: 'sorting', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'selection', name: 'Selection Sort', category: 'sorting', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'insertion', name: 'Insertion Sort', category: 'sorting', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'merge', name: 'Merge Sort', category: 'sorting', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'quick', name: 'Quick Sort', category: 'sorting', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'heap', name: 'Heap Sort', category: 'sorting', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'linear', name: 'Linear Search', category: 'search', icon: <Target className="h-4 w-4" /> },
    { id: 'binary', name: 'Binary Search', category: 'search', icon: <Target className="h-4 w-4" /> },
    { id: 'bfs', name: 'BFS Traversal', category: 'graph', icon: <Network className="h-4 w-4" /> },
    { id: 'dfs', name: 'DFS Traversal', category: 'graph', icon: <Network className="h-4 w-4" /> },
    { id: 'dijkstra', name: 'Dijkstra\'s Algorithm', category: 'graph', icon: <Network className="h-4 w-4" /> }
  ];

  const tabs = [
    {
      id: 'input' as const,
      name: 'Input System',
      icon: <Database className="h-5 w-5" />,
      description: 'Create and manage custom data structures'
    },
    {
      id: 'testing' as const,
      name: 'Scenario Testing',
      icon: <TestTube className="h-5 w-5" />,
      description: 'Run comprehensive test suites'
    },
    {
      id: 'customization' as const,
      name: 'Algorithm Customization',
      icon: <Code className="h-5 w-5" />,
      description: 'Customize algorithm parameters'
    }
  ];

  const handleDataStructureChange = (config: DataStructureConfig) => {
    setCurrentDataStructure(config);
  };

  const handleScenarioSelect = (scenario: TestScenario) => {
    setCurrentScenario(scenario);
    setCurrentDataStructure(scenario.dataStructure);
  };

  const handleConfigChange = (config: AlgorithmConfig) => {
    setAlgorithmConfig(config);
  };

  const handleValidateConfig = async (config: AlgorithmConfig) => {
    // Simulate validation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const errors: string[] = [];
    
    // Basic validation logic
    config.parameters.forEach(param => {
      if (param.validation) {
        const error = param.validation(param.value);
        if (error) errors.push(error);
      }
    });

    return { valid: errors.length === 0, errors };
  };

  const handleRunTest = async (testCase: any) => {
    // Simulate test execution
    const startTime = performance.now();
    
    // Simulate algorithm execution
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    // Simulate test result
    const passed = Math.random() > 0.1; // 90% pass rate
    
    return {
      testCaseId: testCase.id,
      passed,
      actualOutput: testCase.expectedOutput,
      executionTime,
      memoryUsage: Math.random() * 1024 * 1024, // Random memory usage
      operationCount: Math.floor(Math.random() * 1000) + 100,
      errorMessage: passed ? undefined : 'Test failed due to incorrect output'
    };
  };

  const runVisualization = () => {
    setIsRunning(true);
    // The visualization will handle its own execution
  };

  const renderVisualization = () => {
    const algorithmCategory = algorithms.find(a => a.id === selectedAlgorithm)?.category;
    
    if (algorithmCategory === 'sorting') {
      return (
        <SortingVisualization
          algorithm={selectedAlgorithm as any}
          initialArray={currentDataStructure.values}
          onComplete={() => setIsRunning(false)}
        />
      );
    } else if (algorithmCategory === 'search') {
      return (
        <div className="bg-bg-card rounded-curvy p-12 shadow-curvy text-center">
          <div className="text-text-muted">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Search algorithm visualization coming soon...</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-bg-card rounded-curvy p-12 shadow-curvy text-center">
          <div className="text-text-muted">
            <Network className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Graph algorithm visualization coming soon...</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Interactive Algorithm Playground</h1>
          <p className="text-xl text-text-secondary max-w-4xl mx-auto">
            Advanced testing environment for comprehensive algorithm analysis. Create custom data structures, 
            run extensive test suites, and customize algorithm parameters for deep performance insights.
          </p>
        </div>

        {/* Algorithm Selection */}
        <div className="bg-bg-card rounded-curvy p-6 shadow-curvy mb-8">
          <h2 className="text-lg font-medium text-text-primary mb-4">Select Algorithm</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {algorithms.map((algorithm) => (
              <button
                key={algorithm.id}
                onClick={() => setSelectedAlgorithm(algorithm.id)}
                className={`p-3 rounded-curvy border-2 transition-all duration-200 text-left hover-lift ${
                  selectedAlgorithm === algorithm.id
                    ? 'bg-primary/20 border-primary text-primary shadow-glow'
                    : 'bg-accent/20 border-accent/40 text-text-secondary hover:bg-primary/10 hover:border-primary/60'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {algorithm.icon}
                  <span className="font-medium text-sm">{algorithm.name}</span>
                </div>
                <div className="text-xs opacity-70 capitalize">{algorithm.category}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-bg-card rounded-curvy p-6 shadow-curvy mb-8">
          <div className="flex space-x-1 bg-accent/20 rounded-curvy p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-curvy
                         transition-all duration-200 font-medium ${
                  activeTab === tab.id
                    ? 'bg-primary text-bg-primary shadow-glow'
                    : 'text-text-secondary hover:text-text-primary hover:bg-accent/40'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-text-muted text-sm">
              {tabs.find(t => t.id === activeTab)?.description}
            </p>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2">
            {activeTab === 'input' && (
              <MultiLevelInputSystem
                onDataStructureChange={handleDataStructureChange}
                onScenarioSelect={handleScenarioSelect}
              />
            )}
            
            {activeTab === 'testing' && (
              <AdvancedScenarioTesting
                algorithm={selectedAlgorithm}
                onRunTest={handleRunTest}
              />
            )}
            
            {activeTab === 'customization' && (
              <AlgorithmCustomization
                algorithm={selectedAlgorithm}
                onConfigChange={handleConfigChange}
                onValidate={handleValidateConfig}
              />
            )}
          </div>

          {/* Visualization Panel */}
          <div className="space-y-6">
            {/* Run Controls */}
            <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
              <h3 className="text-lg font-medium text-text-primary mb-4">Visualization</h3>
              
              <div className="space-y-4">
                <button
                  onClick={runVisualization}
                  disabled={isRunning}
                  className="w-full px-6 py-3 bg-primary hover:bg-hover text-bg-primary rounded-curvy
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200 hover-lift font-medium"
                >
                  {isRunning ? (
                    <>
                      <Zap className="h-4 w-4 inline mr-2 animate-pulse" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 inline mr-2" />
                      Run Visualization
                    </>
                  )}
                </button>

                {/* Current Configuration */}
                <div className="p-4 bg-accent/10 rounded-curvy border border-accent/20">
                  <h4 className="font-medium text-text-primary mb-2">Current Setup</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Algorithm:</span>
                      <span className="text-primary font-medium">
                        {algorithms.find(a => a.id === selectedAlgorithm)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Data Type:</span>
                      <span className="text-text-secondary">{currentDataStructure.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Size:</span>
                      <span className="text-text-secondary">{currentDataStructure.size} elements</span>
                    </div>
                    {currentScenario && (
                      <div className="flex justify-between">
                        <span className="text-text-muted">Scenario:</span>
                        <span className="text-info">{currentScenario.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
              <h3 className="text-lg font-medium text-text-primary mb-4">Quick Stats</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Data Elements:</span>
                  <span className="text-primary font-bold">{currentDataStructure.size}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Algorithm Type:</span>
                  <span className="text-text-secondary capitalize">
                    {algorithms.find(a => a.id === selectedAlgorithm)?.category}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Expected Complexity:</span>
                  <span className="text-warning font-mono text-sm">O(n log n)</span>
                </div>
                {algorithmConfig && (
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Custom Config:</span>
                    <span className="text-success">✓ Active</span>
                  </div>
                )}
              </div>
            </div>

            {/* Mini Visualization */}
            <div className="bg-bg-card rounded-curvy p-4 shadow-curvy">
              <h4 className="text-md font-medium text-text-primary mb-3">Preview</h4>
              
              {currentDataStructure.values && (
                <div className="flex space-x-1 justify-center">
                  {currentDataStructure.values.slice(0, 8).map((value, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 bg-accent border border-accent/60 rounded flex items-center justify-center text-xs text-text-primary"
                    >
                      {value}
                    </div>
                  ))}
                  {currentDataStructure.values.length > 8 && (
                    <div className="w-8 h-8 flex items-center justify-center text-xs text-text-muted">
                      ...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full Visualization */}
        <div className="mt-12">
          <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-primary">Live Visualization</h2>
              <div className="text-sm text-text-muted">
                {algorithms.find(a => a.id === selectedAlgorithm)?.name} on {currentDataStructure.type}
              </div>
            </div>
            
            {renderVisualization()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaygroundPage;