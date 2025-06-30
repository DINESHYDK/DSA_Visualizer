import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Minus, 
  Upload, 
  Download, 
  Save, 
  RefreshCw, 
  Settings, 
  Code, 
  Database,
  GitBranch,
  Network,
  Shuffle,
  Target,
  AlertCircle,
  CheckCircle,
  FileText,
  Layers
} from 'lucide-react';
import { generateId } from '../../utils';

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

interface MultiLevelInputSystemProps {
  onDataStructureChange: (config: DataStructureConfig) => void;
  onScenarioSelect: (scenario: TestScenario) => void;
  className?: string;
}

const MultiLevelInputSystem: React.FC<MultiLevelInputSystemProps> = ({
  onDataStructureChange,
  onScenarioSelect,
  className = ''
}) => {
  const [selectedType, setSelectedType] = useState<'array' | 'linked-list' | 'tree' | 'graph'>('array');
  const [currentConfig, setCurrentConfig] = useState<DataStructureConfig>({
    type: 'array',
    size: 8,
    values: [64, 34, 25, 12, 22, 11, 90, 88]
  });
  const [savedScenarios, setSavedScenarios] = useState<TestScenario[]>([]);
  const [scenarioName, setScenarioName] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [inputError, setInputError] = useState('');

  // Load saved scenarios from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dsa-visualizer-scenarios');
    if (saved) {
      try {
        setSavedScenarios(JSON.parse(saved));
      } catch (error) {
        console.warn('Failed to load saved scenarios:', error);
      }
    }
  }, []);

  // Save scenarios to localStorage
  const saveScenarios = (scenarios: TestScenario[]) => {
    try {
      localStorage.setItem('dsa-visualizer-scenarios', JSON.stringify(scenarios));
      setSavedScenarios(scenarios);
    } catch (error) {
      console.warn('Failed to save scenarios:', error);
    }
  };

  const dataStructureTypes = [
    {
      id: 'array' as const,
      name: 'Array',
      icon: <Database className="h-5 w-5" />,
      description: 'Linear collection with indexed access',
      color: 'text-info'
    },
    {
      id: 'linked-list' as const,
      name: 'Linked List',
      icon: <GitBranch className="h-5 w-5" />,
      description: 'Dynamic structure with pointer connections',
      color: 'text-primary'
    },
    {
      id: 'tree' as const,
      name: 'Tree',
      icon: <Layers className="h-5 w-5" />,
      description: 'Hierarchical structure with parent-child relationships',
      color: 'text-success'
    },
    {
      id: 'graph' as const,
      name: 'Graph',
      icon: <Network className="h-5 w-5" />,
      description: 'Network of nodes with arbitrary connections',
      color: 'text-warning'
    }
  ];

  const predefinedScenarios: TestScenario[] = [
    // Array scenarios
    {
      id: 'array-random',
      name: 'Random Array',
      description: 'Randomly shuffled array for average case testing',
      dataStructure: { type: 'array', size: 10, values: [45, 23, 78, 12, 67, 34, 89, 56, 91, 28] },
      category: 'basic'
    },
    {
      id: 'array-sorted',
      name: 'Sorted Array',
      description: 'Already sorted array for best case testing',
      dataStructure: { type: 'array', size: 8, values: [10, 20, 30, 40, 50, 60, 70, 80] },
      category: 'basic'
    },
    {
      id: 'array-reverse',
      name: 'Reverse Sorted',
      description: 'Reverse sorted array for worst case testing',
      dataStructure: { type: 'array', size: 8, values: [80, 70, 60, 50, 40, 30, 20, 10] },
      category: 'edge-case'
    },
    {
      id: 'array-duplicates',
      name: 'Array with Duplicates',
      description: 'Array containing duplicate values',
      dataStructure: { type: 'array', size: 10, values: [5, 3, 8, 3, 6, 5, 2, 8, 1, 5] },
      category: 'edge-case'
    },
    {
      id: 'array-single',
      name: 'Single Element',
      description: 'Array with only one element',
      dataStructure: { type: 'array', size: 1, values: [42] },
      category: 'edge-case'
    },
    {
      id: 'array-large',
      name: 'Large Array',
      description: 'Large array for performance testing',
      dataStructure: { 
        type: 'array', 
        size: 20, 
        values: Array.from({ length: 20 }, (_, i) => Math.floor(Math.random() * 100) + 1)
      },
      category: 'performance'
    },
    // Tree scenarios
    {
      id: 'tree-balanced',
      name: 'Balanced Tree',
      description: 'Well-balanced binary tree',
      dataStructure: { 
        type: 'tree', 
        size: 7, 
        values: [50, 30, 70, 20, 40, 60, 80],
        properties: { balanced: true }
      },
      category: 'basic'
    },
    {
      id: 'tree-skewed',
      name: 'Skewed Tree',
      description: 'Heavily skewed tree (worst case)',
      dataStructure: { 
        type: 'tree', 
        size: 6, 
        values: [10, 20, 30, 40, 50, 60],
        properties: { skewed: 'right' }
      },
      category: 'edge-case'
    },
    // Graph scenarios
    {
      id: 'graph-connected',
      name: 'Connected Graph',
      description: 'Fully connected graph',
      dataStructure: {
        type: 'graph',
        size: 5,
        values: [1, 2, 3, 4, 5],
        connections: [
          { from: 0, to: 1, weight: 4 },
          { from: 0, to: 2, weight: 2 },
          { from: 1, to: 2, weight: 1 },
          { from: 1, to: 3, weight: 5 },
          { from: 2, to: 3, weight: 8 },
          { from: 2, to: 4, weight: 10 },
          { from: 3, to: 4, weight: 2 }
        ]
      },
      category: 'basic'
    },
    {
      id: 'graph-disconnected',
      name: 'Disconnected Graph',
      description: 'Graph with disconnected components',
      dataStructure: {
        type: 'graph',
        size: 6,
        values: [1, 2, 3, 4, 5, 6],
        connections: [
          { from: 0, to: 1, weight: 3 },
          { from: 1, to: 2, weight: 2 },
          { from: 3, to: 4, weight: 4 },
          { from: 4, to: 5, weight: 1 }
        ]
      },
      category: 'edge-case'
    }
  ];

  const handleTypeChange = (type: 'array' | 'linked-list' | 'tree' | 'graph') => {
    setSelectedType(type);
    const newConfig: DataStructureConfig = {
      type,
      size: type === 'array' ? 8 : type === 'tree' ? 7 : 5,
      values: type === 'array' ? [64, 34, 25, 12, 22, 11, 90, 88] :
              type === 'tree' ? [50, 30, 70, 20, 40, 60, 80] :
              [1, 2, 3, 4, 5]
    };
    
    if (type === 'graph') {
      newConfig.connections = [
        { from: 0, to: 1, weight: 4 },
        { from: 0, to: 2, weight: 2 },
        { from: 1, to: 2, weight: 1 },
        { from: 2, to: 3, weight: 3 },
        { from: 3, to: 4, weight: 2 }
      ];
    }
    
    setCurrentConfig(newConfig);
    onDataStructureChange(newConfig);
  };

  const handleCustomInput = (input: string) => {
    setCustomInput(input);
    
    if (!input.trim()) {
      setInputError('');
      return;
    }

    try {
      const values = input
        .split(',')
        .map(val => val.trim())
        .filter(val => val !== '')
        .map(val => {
          const num = parseFloat(val);
          if (isNaN(num)) {
            throw new Error(`"${val}" is not a valid number`);
          }
          return Math.floor(num);
        });
      
      if (values.length === 0) {
        setInputError('No valid numbers found');
        return;
      }
      
      if (values.length > 50) {
        setInputError('Maximum 50 elements allowed');
        return;
      }
      
      setInputError('');
      const newConfig = {
        ...currentConfig,
        size: values.length,
        values
      };
      setCurrentConfig(newConfig);
      onDataStructureChange(newConfig);
    } catch (error) {
      setInputError((error as Error).message);
    }
  };

  const generateRandomData = () => {
    const size = currentConfig.size;
    let values: number[];
    
    switch (selectedType) {
      case 'array':
      case 'linked-list':
        values = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
        break;
      case 'tree':
        // Generate values that can form a reasonable tree
        values = Array.from({ length: size }, (_, i) => (i + 1) * 10 + Math.floor(Math.random() * 9));
        break;
      case 'graph':
        values = Array.from({ length: size }, (_, i) => i + 1);
        break;
      default:
        values = [1, 2, 3, 4, 5];
    }
    
    const newConfig = { ...currentConfig, values };
    if (selectedType === 'graph') {
      // Generate random connections for graph
      const connections = [];
      for (let i = 0; i < size - 1; i++) {
        for (let j = i + 1; j < size; j++) {
          if (Math.random() < 0.4) { // 40% chance of connection
            connections.push({
              from: i,
              to: j,
              weight: Math.floor(Math.random() * 10) + 1
            });
          }
        }
      }
      newConfig.connections = connections;
    }
    
    setCurrentConfig(newConfig);
    onDataStructureChange(newConfig);
  };

  const saveCurrentScenario = () => {
    if (!scenarioName.trim()) {
      alert('Please enter a name for the scenario');
      return;
    }
    
    const newScenario: TestScenario = {
      id: generateId(),
      name: scenarioName.trim(),
      description: `Custom ${selectedType} scenario`,
      dataStructure: { ...currentConfig },
      category: 'custom'
    };
    
    const updatedScenarios = [...savedScenarios, newScenario];
    saveScenarios(updatedScenarios);
    setScenarioName('');
  };

  const loadScenario = (scenario: TestScenario) => {
    setSelectedType(scenario.dataStructure.type);
    setCurrentConfig(scenario.dataStructure);
    onDataStructureChange(scenario.dataStructure);
    onScenarioSelect(scenario);
  };

  const deleteScenario = (id: string) => {
    const updatedScenarios = savedScenarios.filter(s => s.id !== id);
    saveScenarios(updatedScenarios);
  };

  const exportScenarios = () => {
    const dataStr = JSON.stringify(savedScenarios, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dsa-scenarios.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importScenarios = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (Array.isArray(data)) {
          const importedScenarios = data.filter(item => 
            item.id && item.name && item.dataStructure
          );
          const updatedScenarios = [...savedScenarios, ...importedScenarios];
          saveScenarios(updatedScenarios);
        } else {
          alert('Invalid file format');
        }
      } catch (error) {
        alert('Failed to parse file');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-2">Interactive Playground</h2>
            <p className="text-text-secondary">
              Create custom data structures and test scenarios for comprehensive algorithm analysis.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="p-2 rounded-curvy text-text-muted hover:text-primary hover:bg-accent/20 
                       transition-colors duration-200"
              title="Advanced Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
            
            <label className="p-2 rounded-curvy text-text-muted hover:text-primary hover:bg-accent/20 
                           cursor-pointer transition-colors duration-200" title="Import Scenarios">
              <Upload className="h-5 w-5" />
              <input
                type="file"
                accept=".json"
                onChange={importScenarios}
                className="hidden"
              />
            </label>
            
            <button
              onClick={exportScenarios}
              disabled={savedScenarios.length === 0}
              className="p-2 rounded-curvy text-text-muted hover:text-primary hover:bg-accent/20 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors duration-200"
              title="Export Scenarios"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Data Structure Type Selection */}
      <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
        <h3 className="text-lg font-medium text-text-primary mb-4">Data Structure Type</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dataStructureTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleTypeChange(type.id)}
              className={`p-4 rounded-curvy border-2 transition-all duration-200 text-left hover-lift ${
                selectedType === type.id
                  ? 'bg-primary/20 border-primary text-primary shadow-glow'
                  : 'bg-accent/20 border-accent/40 text-text-secondary hover:bg-primary/10 hover:border-primary/60'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className={`${selectedType === type.id ? 'text-primary' : type.color}`}>
                  {type.icon}
                </div>
                <h4 className="font-semibold">{type.name}</h4>
              </div>
              <p className="text-sm opacity-80">{type.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Custom Input */}
        <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
          <h3 className="text-lg font-medium text-text-primary mb-4">Custom Configuration</h3>
          
          <div className="space-y-4">
            {/* Size Control */}
            <div>
              <label className="text-sm font-medium text-text-secondary mb-2 block">
                Size: {currentConfig.size}
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={currentConfig.size}
                onChange={(e) => {
                  const size = parseInt(e.target.value);
                  const newConfig = { ...currentConfig, size };
                  setCurrentConfig(newConfig);
                  onDataStructureChange(newConfig);
                }}
                className="w-full h-3 bg-accent rounded-curvy appearance-none cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Custom Values Input */}
            <div>
              <label className="text-sm font-medium text-text-secondary mb-2 block">
                Custom Values
              </label>
              <textarea
                value={customInput}
                onChange={(e) => handleCustomInput(e.target.value)}
                placeholder="Enter comma-separated values (e.g., 64, 34, 25, 12, 22, 11, 90)"
                className="w-full p-3 bg-accent/20 border border-accent/40 rounded-curvy
                         text-text-primary placeholder-text-muted resize-none
                         focus:border-primary focus:ring-1 focus:ring-primary/20"
                rows={3}
              />
              
              {inputError && (
                <div className="flex items-center space-x-2 text-error text-sm mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{inputError}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={generateRandomData}
                className="flex-1 px-4 py-2 bg-info hover:bg-info/80 text-white rounded-curvy
                         transition-all duration-200 hover-lift font-medium"
              >
                <Shuffle className="h-4 w-4 inline mr-2" />
                Random
              </button>
              
              <button
                onClick={() => {
                  const newConfig = { ...currentConfig };
                  if (newConfig.values) {
                    newConfig.values.sort((a, b) => a - b);
                    setCurrentConfig(newConfig);
                    onDataStructureChange(newConfig);
                  }
                }}
                className="flex-1 px-4 py-2 bg-success hover:bg-success/80 text-white rounded-curvy
                         transition-all duration-200 hover-lift font-medium"
              >
                <Target className="h-4 w-4 inline mr-2" />
                Sort
              </button>
            </div>
          </div>
        </div>

        {/* Save/Load Scenarios */}
        <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
          <h3 className="text-lg font-medium text-text-primary mb-4">Scenario Management</h3>
          
          <div className="space-y-4">
            {/* Save Current */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                placeholder="Scenario name..."
                className="flex-1 p-2 bg-accent/20 border border-accent/40 rounded-curvy
                         text-text-primary placeholder-text-muted
                         focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
              <button
                onClick={saveCurrentScenario}
                disabled={!scenarioName.trim()}
                className="px-4 py-2 bg-primary hover:bg-hover text-bg-primary rounded-curvy
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 hover-lift font-medium"
              >
                <Save className="h-4 w-4" />
              </button>
            </div>

            {/* Current Configuration Display */}
            <div className="p-3 bg-accent/10 rounded-curvy border border-accent/20">
              <div className="text-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-muted">Current:</span>
                  <span className="text-primary font-medium">{selectedType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Size:</span>
                  <span className="text-text-secondary">{currentConfig.size} elements</span>
                </div>
                {currentConfig.values && (
                  <div className="mt-2 text-xs text-text-muted">
                    Values: [{currentConfig.values.slice(0, 8).join(', ')}{currentConfig.values.length > 8 ? '...' : ''}]
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Predefined Scenarios */}
      <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
        <h3 className="text-lg font-medium text-text-primary mb-4">Predefined Test Scenarios</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {predefinedScenarios
            .filter(scenario => scenario.dataStructure.type === selectedType)
            .map((scenario) => (
              <div
                key={scenario.id}
                className="p-4 bg-accent/10 rounded-curvy border border-accent/20 hover:bg-primary/10 
                         hover:border-primary/40 transition-all duration-200 cursor-pointer"
                onClick={() => loadScenario(scenario)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-text-primary">{scenario.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-curvy ${
                    scenario.category === 'basic' ? 'bg-info/20 text-info' :
                    scenario.category === 'edge-case' ? 'bg-warning/20 text-warning' :
                    scenario.category === 'performance' ? 'bg-error/20 text-error' :
                    'bg-success/20 text-success'
                  }`}>
                    {scenario.category}
                  </span>
                </div>
                <p className="text-sm text-text-muted">{scenario.description}</p>
                <div className="mt-2 text-xs text-text-secondary">
                  Size: {scenario.dataStructure.size} elements
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Saved Scenarios */}
      {savedScenarios.length > 0 && (
        <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
          <h3 className="text-lg font-medium text-text-primary mb-4">Saved Scenarios</h3>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {savedScenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="flex items-center justify-between p-3 bg-accent/10 rounded-curvy border border-accent/20"
              >
                <div className="flex-1 cursor-pointer" onClick={() => loadScenario(scenario)}>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-text-primary">{scenario.name}</h4>
                    <span className="text-xs text-text-muted">({scenario.dataStructure.type})</span>
                  </div>
                  <p className="text-sm text-text-muted">{scenario.description}</p>
                </div>
                <button
                  onClick={() => deleteScenario(scenario.id)}
                  className="p-1 text-error hover:bg-error/20 rounded transition-colors duration-200"
                  title="Delete Scenario"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Advanced Settings */}
      {showAdvanced && (
        <div className="bg-bg-card rounded-curvy p-6 shadow-curvy border border-primary/20">
          <h3 className="text-lg font-medium text-primary mb-4">Advanced Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Graph-specific settings */}
            {selectedType === 'graph' && (
              <div>
                <h4 className="font-medium text-text-primary mb-3">Graph Properties</h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-text-secondary">Directed Graph</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-text-secondary">Weighted Edges</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-text-secondary">Allow Self Loops</span>
                  </label>
                </div>
              </div>
            )}

            {/* Tree-specific settings */}
            {selectedType === 'tree' && (
              <div>
                <h4 className="font-medium text-text-primary mb-3">Tree Properties</h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-text-secondary">Binary Tree</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-text-secondary">Balanced Tree</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-text-secondary">Complete Tree</span>
                  </label>
                </div>
              </div>
            )}

            {/* Performance settings */}
            <div>
              <h4 className="font-medium text-text-primary mb-3">Performance Testing</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-text-secondary">Enable Benchmarking</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-text-secondary">Memory Usage Tracking</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-text-secondary">Step-by-step Analysis</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiLevelInputSystem;