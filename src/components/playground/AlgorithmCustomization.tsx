import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Code, 
  Sliders, 
  Target, 
  Zap, 
  RotateCcw, 
  Save, 
  Upload, 
  Download,
  AlertCircle,
  CheckCircle,
  Info,
  Layers,
  GitBranch,
  BarChart3
} from 'lucide-react';

interface AlgorithmParameter {
  id: string;
  name: string;
  description: string;
  type: 'number' | 'boolean' | 'select' | 'range';
  value: any;
  defaultValue: any;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
  step?: number;
  validation?: (value: any) => string | null;
}

interface AlgorithmConfig {
  id: string;
  name: string;
  description: string;
  parameters: AlgorithmParameter[];
  customCode?: string;
  heuristics?: Record<string, any>;
}

interface AlgorithmCustomizationProps {
  algorithm: string;
  onConfigChange: (config: AlgorithmConfig) => void;
  onValidate: (config: AlgorithmConfig) => Promise<{ valid: boolean; errors: string[] }>;
  className?: string;
}

const AlgorithmCustomization: React.FC<AlgorithmCustomizationProps> = ({
  algorithm,
  onConfigChange,
  onValidate,
  className = ''
}) => {
  const [config, setConfig] = useState<AlgorithmConfig | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savedConfigs, setSavedConfigs] = useState<AlgorithmConfig[]>([]);
  const [configName, setConfigName] = useState('');

  // Load saved configurations
  useEffect(() => {
    const saved = localStorage.getItem(`dsa-configs-${algorithm}`);
    if (saved) {
      try {
        setSavedConfigs(JSON.parse(saved));
      } catch (error) {
        console.warn('Failed to load saved configurations:', error);
      }
    }
  }, [algorithm]);

  // Initialize configuration based on algorithm
  useEffect(() => {
    initializeConfig();
  }, [algorithm]);

  const initializeConfig = () => {
    let newConfig: AlgorithmConfig;

    switch (algorithm) {
      case 'quick':
        newConfig = {
          id: 'quicksort-config',
          name: 'QuickSort Configuration',
          description: 'Customize QuickSort pivot selection and partitioning strategy',
          parameters: [
            {
              id: 'pivotStrategy',
              name: 'Pivot Selection Strategy',
              description: 'Method for selecting the pivot element',
              type: 'select',
              value: 'last',
              defaultValue: 'last',
              options: [
                { label: 'Last Element', value: 'last' },
                { label: 'First Element', value: 'first' },
                { label: 'Middle Element', value: 'middle' },
                { label: 'Random Element', value: 'random' },
                { label: 'Median of Three', value: 'median3' }
              ]
            },
            {
              id: 'partitionScheme',
              name: 'Partition Scheme',
              description: 'Partitioning algorithm to use',
              type: 'select',
              value: 'lomuto',
              defaultValue: 'lomuto',
              options: [
                { label: 'Lomuto Partition', value: 'lomuto' },
                { label: 'Hoare Partition', value: 'hoare' }
              ]
            },
            {
              id: 'hybridThreshold',
              name: 'Hybrid Threshold',
              description: 'Switch to insertion sort for small subarrays',
              type: 'range',
              value: 10,
              defaultValue: 10,
              min: 0,
              max: 50,
              step: 1
            },
            {
              id: 'enableHybrid',
              name: 'Enable Hybrid Optimization',
              description: 'Use insertion sort for small subarrays',
              type: 'boolean',
              value: false,
              defaultValue: false
            }
          ]
        };
        break;

      case 'merge':
        newConfig = {
          id: 'mergesort-config',
          name: 'MergeSort Configuration',
          description: 'Customize MergeSort merge strategy and optimizations',
          parameters: [
            {
              id: 'mergeStrategy',
              name: 'Merge Strategy',
              description: 'Method for merging sorted subarrays',
              type: 'select',
              value: 'standard',
              defaultValue: 'standard',
              options: [
                { label: 'Standard Merge', value: 'standard' },
                { label: 'In-place Merge', value: 'inplace' },
                { label: 'Bottom-up Merge', value: 'bottomup' }
              ]
            },
            {
              id: 'insertionThreshold',
              name: 'Insertion Sort Threshold',
              description: 'Use insertion sort for small subarrays',
              type: 'range',
              value: 7,
              defaultValue: 7,
              min: 0,
              max: 30,
              step: 1
            },
            {
              id: 'enableOptimization',
              name: 'Enable Optimizations',
              description: 'Use various merge sort optimizations',
              type: 'boolean',
              value: true,
              defaultValue: true
            }
          ]
        };
        break;

      case 'heap':
        newConfig = {
          id: 'heapsort-config',
          name: 'HeapSort Configuration',
          description: 'Customize heap construction and extraction',
          parameters: [
            {
              id: 'heapType',
              name: 'Heap Type',
              description: 'Type of heap to construct',
              type: 'select',
              value: 'max',
              defaultValue: 'max',
              options: [
                { label: 'Max Heap', value: 'max' },
                { label: 'Min Heap', value: 'min' }
              ]
            },
            {
              id: 'buildMethod',
              name: 'Heap Build Method',
              description: 'Method for building the initial heap',
              type: 'select',
              value: 'bottomup',
              defaultValue: 'bottomup',
              options: [
                { label: 'Bottom-up (Floyd)', value: 'bottomup' },
                { label: 'Top-down (Williams)', value: 'topdown' }
              ]
            },
            {
              id: 'enableSiftOptimization',
              name: 'Enable Sift Optimization',
              description: 'Use optimized sift-down operation',
              type: 'boolean',
              value: true,
              defaultValue: true
            }
          ]
        };
        break;

      case 'binary':
        newConfig = {
          id: 'binarysearch-config',
          name: 'Binary Search Configuration',
          description: 'Customize binary search behavior and optimizations',
          parameters: [
            {
              id: 'searchVariant',
              name: 'Search Variant',
              description: 'Type of binary search to perform',
              type: 'select',
              value: 'standard',
              defaultValue: 'standard',
              options: [
                { label: 'Standard Binary Search', value: 'standard' },
                { label: 'Lower Bound', value: 'lowerbound' },
                { label: 'Upper Bound', value: 'upperbound' },
                { label: 'Interpolation Search', value: 'interpolation' }
              ]
            },
            {
              id: 'midpointCalculation',
              name: 'Midpoint Calculation',
              description: 'Method for calculating the midpoint',
              type: 'select',
              value: 'standard',
              defaultValue: 'standard',
              options: [
                { label: 'Standard: (low + high) / 2', value: 'standard' },
                { label: 'Overflow-safe: low + (high - low) / 2', value: 'safe' }
              ]
            },
            {
              id: 'enableBounds',
              name: 'Enable Bounds Checking',
              description: 'Perform additional bounds validation',
              type: 'boolean',
              value: true,
              defaultValue: true
            }
          ]
        };
        break;

      case 'dijkstra':
        newConfig = {
          id: 'dijkstra-config',
          name: 'Dijkstra Algorithm Configuration',
          description: 'Customize Dijkstra\'s shortest path algorithm',
          parameters: [
            {
              id: 'priorityQueue',
              name: 'Priority Queue Implementation',
              description: 'Data structure for the priority queue',
              type: 'select',
              value: 'binary',
              defaultValue: 'binary',
              options: [
                { label: 'Binary Heap', value: 'binary' },
                { label: 'Fibonacci Heap', value: 'fibonacci' },
                { label: 'Simple Array', value: 'array' }
              ]
            },
            {
              id: 'heuristic',
              name: 'Heuristic Function',
              description: 'Heuristic for A* variant',
              type: 'select',
              value: 'none',
              defaultValue: 'none',
              options: [
                { label: 'None (Pure Dijkstra)', value: 'none' },
                { label: 'Manhattan Distance', value: 'manhattan' },
                { label: 'Euclidean Distance', value: 'euclidean' }
              ]
            },
            {
              id: 'enableEarlyTermination',
              name: 'Enable Early Termination',
              description: 'Stop when target is reached',
              type: 'boolean',
              value: true,
              defaultValue: true
            }
          ]
        };
        break;

      default:
        newConfig = {
          id: `${algorithm}-config`,
          name: `${algorithm} Configuration`,
          description: `Customize ${algorithm} algorithm parameters`,
          parameters: [
            {
              id: 'enableOptimizations',
              name: 'Enable Optimizations',
              description: 'Use algorithm-specific optimizations',
              type: 'boolean',
              value: true,
              defaultValue: true
            }
          ]
        };
    }

    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  const updateParameter = (parameterId: string, value: any) => {
    if (!config) return;

    const updatedConfig = {
      ...config,
      parameters: config.parameters.map(param =>
        param.id === parameterId ? { ...param, value } : param
      )
    };

    setConfig(updatedConfig);
    onConfigChange(updatedConfig);
  };

  const validateConfiguration = async () => {
    if (!config) return;

    setIsValidating(true);
    try {
      const result = await onValidate(config);
      setValidationErrors(result.errors);
    } catch (error) {
      setValidationErrors(['Validation failed: ' + (error as Error).message]);
    } finally {
      setIsValidating(false);
    }
  };

  const resetToDefaults = () => {
    if (!config) return;

    const resetConfig = {
      ...config,
      parameters: config.parameters.map(param => ({
        ...param,
        value: param.defaultValue
      }))
    };

    setConfig(resetConfig);
    onConfigChange(resetConfig);
    setValidationErrors([]);
  };

  const saveConfiguration = () => {
    if (!config || !configName.trim()) {
      alert('Please enter a name for the configuration');
      return;
    }

    const savedConfig = {
      ...config,
      id: `${config.id}-${Date.now()}`,
      name: configName.trim()
    };

    const updatedConfigs = [...savedConfigs, savedConfig];
    setSavedConfigs(updatedConfigs);
    localStorage.setItem(`dsa-configs-${algorithm}`, JSON.stringify(updatedConfigs));
    setConfigName('');
  };

  const loadConfiguration = (savedConfig: AlgorithmConfig) => {
    setConfig(savedConfig);
    onConfigChange(savedConfig);
    setValidationErrors([]);
  };

  const deleteConfiguration = (configId: string) => {
    const updatedConfigs = savedConfigs.filter(c => c.id !== configId);
    setSavedConfigs(updatedConfigs);
    localStorage.setItem(`dsa-configs-${algorithm}`, JSON.stringify(updatedConfigs));
  };

  const exportConfiguration = () => {
    if (!config) return;

    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${algorithm}-config.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importConfiguration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedConfig = JSON.parse(e.target?.result as string);
        if (importedConfig.parameters) {
          setConfig(importedConfig);
          onConfigChange(importedConfig);
          setValidationErrors([]);
        } else {
          alert('Invalid configuration file');
        }
      } catch (error) {
        alert('Failed to parse configuration file');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const renderParameter = (parameter: AlgorithmParameter) => {
    switch (parameter.type) {
      case 'boolean':
        return (
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={parameter.value}
              onChange={(e) => updateParameter(parameter.id, e.target.checked)}
              className="w-4 h-4 text-primary bg-accent border-accent rounded 
                       focus:ring-primary focus:ring-2"
            />
            <span className="text-text-primary">{parameter.name}</span>
          </label>
        );

      case 'select':
        return (
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {parameter.name}
            </label>
            <select
              value={parameter.value}
              onChange={(e) => updateParameter(parameter.id, e.target.value)}
              className="w-full p-3 bg-accent/20 border border-accent/40 rounded-curvy
                       text-text-primary focus:border-primary focus:ring-1 focus:ring-primary/20"
            >
              {parameter.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'range':
        return (
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {parameter.name}: {parameter.value}
            </label>
            <input
              type="range"
              min={parameter.min}
              max={parameter.max}
              step={parameter.step}
              value={parameter.value}
              onChange={(e) => updateParameter(parameter.id, parseInt(e.target.value))}
              className="w-full h-3 bg-accent rounded-curvy appearance-none cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <div className="flex justify-between text-xs text-text-muted mt-1">
              <span>{parameter.min}</span>
              <span>{parameter.max}</span>
            </div>
          </div>
        );

      case 'number':
        return (
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {parameter.name}
            </label>
            <input
              type="number"
              value={parameter.value}
              onChange={(e) => updateParameter(parameter.id, parseFloat(e.target.value))}
              min={parameter.min}
              max={parameter.max}
              step={parameter.step}
              className="w-full p-3 bg-accent/20 border border-accent/40 rounded-curvy
                       text-text-primary focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (!config) {
    return (
      <div className={`bg-bg-card rounded-curvy p-6 shadow-curvy ${className}`}>
        <div className="text-center text-text-muted">
          Loading configuration...
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-2">Algorithm Customization</h2>
            <p className="text-text-secondary">{config.description}</p>
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
                           cursor-pointer transition-colors duration-200" title="Import Configuration">
              <Upload className="h-5 w-5" />
              <input
                type="file"
                accept=".json"
                onChange={importConfiguration}
                className="hidden"
              />
            </label>
            
            <button
              onClick={exportConfiguration}
              className="p-2 rounded-curvy text-text-muted hover:text-primary hover:bg-accent/20 
                       transition-colors duration-200"
              title="Export Configuration"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Parameters */}
      <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
        <h3 className="text-lg font-medium text-text-primary mb-4">Algorithm Parameters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.parameters.map((parameter) => (
            <div key={parameter.id} className="space-y-2">
              {renderParameter(parameter)}
              {parameter.description && (
                <p className="text-xs text-text-muted">{parameter.description}</p>
              )}
            </div>
          ))}
        </div>

        {/* Validation */}
        <div className="mt-6 flex items-center space-x-4">
          <button
            onClick={validateConfiguration}
            disabled={isValidating}
            className="px-4 py-2 bg-info hover:bg-info/80 text-white rounded-curvy
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 hover-lift font-medium"
          >
            {isValidating ? (
              <>
                <Zap className="h-4 w-4 inline mr-2 animate-pulse" />
                Validating...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 inline mr-2" />
                Validate
              </>
            )}
          </button>

          <button
            onClick={resetToDefaults}
            className="px-4 py-2 bg-accent hover:bg-primary hover:text-bg-primary 
                     text-text-primary rounded-curvy transition-all duration-200 hover-lift font-medium"
          >
            <RotateCcw className="h-4 w-4 inline mr-2" />
            Reset to Defaults
          </button>

          {validationErrors.length === 0 && !isValidating && (
            <div className="flex items-center space-x-2 text-success">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Configuration is valid</span>
            </div>
          )}
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mt-4 p-4 bg-error/10 border border-error/20 rounded-curvy">
            <div className="flex items-center space-x-2 text-error mb-2">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Validation Errors:</span>
            </div>
            <ul className="space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm text-error">• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Save/Load Configurations */}
      <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
        <h3 className="text-lg font-medium text-text-primary mb-4">Configuration Management</h3>
        
        <div className="space-y-4">
          {/* Save Current */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={configName}
              onChange={(e) => setConfigName(e.target.value)}
              placeholder="Configuration name..."
              className="flex-1 p-3 bg-accent/20 border border-accent/40 rounded-curvy
                       text-text-primary placeholder-text-muted
                       focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
            <button
              onClick={saveConfiguration}
              disabled={!configName.trim()}
              className="px-4 py-3 bg-primary hover:bg-hover text-bg-primary rounded-curvy
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 hover-lift font-medium"
            >
              <Save className="h-4 w-4" />
            </button>
          </div>

          {/* Saved Configurations */}
          {savedConfigs.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <h4 className="text-md font-medium text-text-secondary">Saved Configurations</h4>
              {savedConfigs.map((savedConfig) => (
                <div
                  key={savedConfig.id}
                  className="flex items-center justify-between p-3 bg-accent/10 rounded-curvy border border-accent/20"
                >
                  <div className="flex-1 cursor-pointer" onClick={() => loadConfiguration(savedConfig)}>
                    <h5 className="font-medium text-text-primary">{savedConfig.name}</h5>
                    <p className="text-sm text-text-muted">{savedConfig.description}</p>
                  </div>
                  <button
                    onClick={() => deleteConfiguration(savedConfig.id)}
                    className="p-1 text-error hover:bg-error/20 rounded transition-colors duration-200"
                    title="Delete Configuration"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Advanced Settings */}
      {showAdvanced && (
        <div className="bg-bg-card rounded-curvy p-6 shadow-curvy border border-primary/20">
          <h3 className="text-lg font-medium text-primary mb-4">Advanced Settings</h3>
          
          <div className="space-y-6">
            {/* Custom Code Editor */}
            <div>
              <h4 className="font-medium text-text-primary mb-3">Custom Implementation</h4>
              <textarea
                value={config.customCode || ''}
                onChange={(e) => setConfig({ ...config, customCode: e.target.value })}
                placeholder="Enter custom algorithm implementation (JavaScript)..."
                className="w-full h-32 p-3 bg-accent/20 border border-accent/40 rounded-curvy
                         text-text-primary placeholder-text-muted font-mono text-sm
                         focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
              <p className="text-xs text-text-muted mt-2">
                Custom code will override default implementation. Use with caution.
              </p>
            </div>

            {/* Performance Tuning */}
            <div>
              <h4 className="font-medium text-text-primary mb-3">Performance Tuning</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="w-4 h-4 text-primary bg-accent border-accent rounded" />
                  <span className="text-text-secondary">Enable Memory Optimization</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="w-4 h-4 text-primary bg-accent border-accent rounded" />
                  <span className="text-text-secondary">Use Parallel Processing</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="w-4 h-4 text-primary bg-accent border-accent rounded" />
                  <span className="text-text-secondary">Cache Intermediate Results</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="w-4 h-4 text-primary bg-accent border-accent rounded" />
                  <span className="text-text-secondary">Enable Debug Mode</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlgorithmCustomization;