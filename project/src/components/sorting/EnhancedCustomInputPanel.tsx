import React, { useState, useEffect } from 'react';
import { 
  Shuffle, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Upload,
  Download,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Settings,
  Zap
} from 'lucide-react';
import { generateRandomArray, generateSortedArray, generateReverseSortedArray, generateNearlySortedArray, validateArrayInput } from '../../utils';

interface EnhancedCustomInputPanelProps {
  onArrayChange: (array: number[]) => void;
  maxSize?: number;
  minValue?: number;
  maxValue?: number;
  currentArray?: number[];
}

interface PresetConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  generator: (size: number, min: number, max: number) => number[];
  complexity: 'best' | 'average' | 'worst';
}

const EnhancedCustomInputPanel: React.FC<EnhancedCustomInputPanelProps> = ({
  onArrayChange,
  maxSize = 20,
  minValue = 1,
  maxValue = 99,
  currentArray = []
}) => {
  const [arraySize, setArraySize] = useState(8);
  const [customInput, setCustomInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [activePreset, setActivePreset] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customMinValue, setCustomMinValue] = useState(minValue);
  const [customMaxValue, setCustomMaxValue] = useState(maxValue);
  const [savedArrays, setSavedArrays] = useState<{ name: string; array: number[] }[]>([]);
  const [arrayName, setArrayName] = useState('');

  // Load saved arrays from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dsa-visualizer-saved-arrays');
    if (saved) {
      try {
        setSavedArrays(JSON.parse(saved));
      } catch (error) {
        console.warn('Failed to load saved arrays:', error);
      }
    }
  }, []);

  // Save arrays to localStorage
  const saveSavedArrays = (arrays: { name: string; array: number[] }[]) => {
    try {
      localStorage.setItem('dsa-visualizer-saved-arrays', JSON.stringify(arrays));
      setSavedArrays(arrays);
    } catch (error) {
      console.warn('Failed to save arrays:', error);
    }
  };

  const presetConfigs: PresetConfig[] = [
    {
      id: 'random',
      label: 'Random',
      icon: <Shuffle className="h-4 w-4" />,
      description: 'Randomly shuffled numbers (average case)',
      generator: generateRandomArray,
      complexity: 'average'
    },
    {
      id: 'sorted',
      label: 'Sorted',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Already sorted array (best case)',
      generator: generateSortedArray,
      complexity: 'best'
    },
    {
      id: 'reverse',
      label: 'Reverse',
      icon: <TrendingDown className="h-4 w-4" />,
      description: 'Reverse sorted array (worst case)',
      generator: generateReverseSortedArray,
      complexity: 'worst'
    },
    {
      id: 'nearly-sorted',
      label: 'Nearly Sorted',
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'Mostly sorted with few swaps needed',
      generator: generateNearlySortedArray,
      complexity: 'average'
    }
  ];

  const handleSizeChange = (newSize: number) => {
    setArraySize(newSize);
    if (activePreset) {
      generatePresetArray(activePreset, newSize);
    }
  };

  const generatePresetArray = (preset: string, size: number = arraySize) => {
    const config = presetConfigs.find(p => p.id === preset);
    if (!config) return;
    
    const newArray = config.generator(size, customMinValue, customMaxValue);
    setActivePreset(preset);
    setCustomInput('');
    setInputError('');
    onArrayChange(newArray);
  };

  const handleCustomInput = (input: string) => {
    setCustomInput(input);
    setActivePreset('');
    
    if (!input.trim()) {
      setInputError('');
      return;
    }

    const validation = validateArrayInput(input);
    
    if (validation.isValid && validation.values) {
      if (validation.values.length > maxSize) {
        setInputError(`Maximum ${maxSize} elements allowed`);
        return;
      }
      
      if (validation.values.some(v => v < customMinValue || v > customMaxValue)) {
        setInputError(`Values must be between ${customMinValue} and ${customMaxValue}`);
        return;
      }
      
      setInputError('');
      onArrayChange(validation.values);
    } else {
      setInputError(validation.error || 'Invalid input');
    }
  };

  const handleValueRangeChange = (min: number, max: number) => {
    setCustomMinValue(min);
    setCustomMaxValue(max);
    
    // Regenerate current preset if active
    if (activePreset) {
      generatePresetArray(activePreset);
    }
  };

  const saveCurrentArray = () => {
    if (!arrayName.trim()) {
      alert('Please enter a name for the array');
      return;
    }
    
    if (currentArray.length === 0) {
      alert('No array to save');
      return;
    }

    const newSavedArray = { name: arrayName.trim(), array: [...currentArray] };
    const updatedArrays = [...savedArrays, newSavedArray];
    saveSavedArrays(updatedArrays);
    setArrayName('');
  };

  const loadSavedArray = (array: number[]) => {
    setActivePreset('');
    setCustomInput(array.join(', '));
    onArrayChange(array);
  };

  const deleteSavedArray = (index: number) => {
    const updatedArrays = savedArrays.filter((_, i) => i !== index);
    saveSavedArrays(updatedArrays);
  };

  const exportArray = () => {
    if (currentArray.length === 0) return;
    
    const dataStr = JSON.stringify(currentArray);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'array-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importArray = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (Array.isArray(data) && data.every(item => typeof item === 'number')) {
          handleCustomInput(data.join(', '));
        } else {
          setInputError('Invalid file format');
        }
      } catch (error) {
        setInputError('Failed to parse file');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const getComplexityColor = (complexity: 'best' | 'average' | 'worst') => {
    switch (complexity) {
      case 'best': return 'text-success';
      case 'average': return 'text-warning';
      case 'worst': return 'text-error';
      default: return 'text-text-muted';
    }
  };

  const getComplexityLabel = (complexity: 'best' | 'average' | 'worst') => {
    switch (complexity) {
      case 'best': return 'Best Case';
      case 'average': return 'Average Case';
      case 'worst': return 'Worst Case';
      default: return '';
    }
  };

  return (
    <div className="bg-bg-card rounded-curvy p-6 shadow-curvy space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-primary">Custom Input System</h3>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="p-2 rounded-curvy text-text-muted hover:text-primary hover:bg-accent/20 
                   transition-colors duration-200"
          title="Advanced Settings"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
      
      {/* Array Size Control */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-text-secondary">
            Array Size: {arraySize}
          </label>
          <div className="flex items-center space-x-2 text-xs text-text-muted">
            <span>Range: 3-{maxSize}</span>
            {currentArray.length > 0 && (
              <span className="text-primary">Current: {currentArray.length}</span>
            )}
          </div>
        </div>
        
        <input
          type="range"
          min="3"
          max={maxSize}
          value={arraySize}
          onChange={(e) => handleSizeChange(parseInt(e.target.value))}
          className="w-full h-3 bg-accent rounded-curvy appearance-none cursor-pointer
                   focus:outline-none focus:ring-2 focus:ring-primary/20"
          style={{
            background: `linear-gradient(to right, 
              var(--color-primary) 0%, 
              var(--color-primary) ${((arraySize - 3) / (maxSize - 3)) * 100}%, 
              var(--color-accent) ${((arraySize - 3) / (maxSize - 3)) * 100}%, 
              var(--color-accent) 100%)`
          }}
        />
        
        <div className="flex justify-between text-xs text-text-muted">
          <span>3</span>
          <span>{Math.floor(maxSize / 2)}</span>
          <span>{maxSize}</span>
        </div>
      </div>

      {/* Advanced Settings */}
      {showAdvanced && (
        <div className="space-y-4 p-4 bg-accent/10 rounded-curvy border border-accent/20">
          <h4 className="text-md font-medium text-text-secondary">Advanced Settings</h4>
          
          {/* Value Range Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-text-muted">Min Value</label>
              <input
                type="number"
                value={customMinValue}
                onChange={(e) => handleValueRangeChange(parseInt(e.target.value) || 1, customMaxValue)}
                className="w-full p-2 bg-accent/20 border border-accent/40 rounded-curvy
                         text-text-primary focus:border-primary focus:ring-1 focus:ring-primary/20"
                min="1"
                max={customMaxValue - 1}
              />
            </div>
            <div>
              <label className="text-sm text-text-muted">Max Value</label>
              <input
                type="number"
                value={customMaxValue}
                onChange={(e) => handleValueRangeChange(customMinValue, parseInt(e.target.value) || 99)}
                className="w-full p-2 bg-accent/20 border border-accent/40 rounded-curvy
                         text-text-primary focus:border-primary focus:ring-1 focus:ring-primary/20"
                min={customMinValue + 1}
                max="999"
              />
            </div>
          </div>
        </div>
      )}

      {/* Quick Presets */}
      <div className="space-y-3">
        <h4 className="text-md font-medium text-text-secondary">Quick Presets</h4>
        <div className="grid grid-cols-2 gap-3">
          {presetConfigs.map((preset) => (
            <button
              key={preset.id}
              onClick={() => generatePresetArray(preset.id)}
              className={`p-3 rounded-curvy border transition-all duration-200 text-left hover-lift ${
                activePreset === preset.id
                  ? 'bg-primary/20 border-primary text-primary'
                  : 'bg-accent/20 border-accent/40 text-text-secondary hover:bg-primary/10 hover:border-primary/60'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                {preset.icon}
                <span className="font-medium text-sm">{preset.label}</span>
                <span className={`text-xs px-1 py-0.5 rounded ${getComplexityColor(preset.complexity)} bg-current/10`}>
                  {getComplexityLabel(preset.complexity)}
                </span>
              </div>
              <p className="text-xs opacity-80 leading-relaxed">{preset.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-medium text-text-secondary">Custom Values</h4>
          <div className="flex items-center space-x-2">
            {/* Import */}
            <label className="p-2 rounded-curvy text-text-muted hover:text-primary hover:bg-accent/20 
                           cursor-pointer transition-colors duration-200" title="Import Array">
              <Upload className="h-4 w-4" />
              <input
                type="file"
                accept=".json"
                onChange={importArray}
                className="hidden"
              />
            </label>
            
            {/* Export */}
            <button
              onClick={exportArray}
              disabled={currentArray.length === 0}
              className="p-2 rounded-curvy text-text-muted hover:text-primary hover:bg-accent/20 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors duration-200"
              title="Export Array"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <textarea
            value={customInput}
            onChange={(e) => handleCustomInput(e.target.value)}
            placeholder="Enter comma-separated numbers (e.g., 64, 34, 25, 12, 22, 11, 90)"
            className="w-full p-3 bg-accent/20 border border-accent/40 rounded-curvy
                     text-text-primary placeholder-text-muted resize-none
                     focus:border-primary focus:ring-1 focus:ring-primary/20
                     transition-colors duration-200"
            rows={3}
          />
          
          {inputError && (
            <div className="flex items-center space-x-2 text-error text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{inputError}</span>
            </div>
          )}
          
          {!inputError && customInput && (
            <div className="flex items-center space-x-2 text-success text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>Valid input - {customInput.split(',').length} elements</span>
            </div>
          )}
          
          <p className="text-xs text-text-muted">
            Enter up to {maxSize} numbers between {customMinValue} and {customMaxValue}
          </p>
        </div>
      </div>

      {/* Save/Load Arrays */}
      <div className="space-y-3">
        <h4 className="text-md font-medium text-text-secondary">Save & Load Arrays</h4>
        
        {/* Save Current Array */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={arrayName}
            onChange={(e) => setArrayName(e.target.value)}
            placeholder="Array name..."
            className="flex-1 p-2 bg-accent/20 border border-accent/40 rounded-curvy
                     text-text-primary placeholder-text-muted
                     focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
          <button
            onClick={saveCurrentArray}
            disabled={!arrayName.trim() || currentArray.length === 0}
            className="px-4 py-2 bg-primary hover:bg-hover text-secondary rounded-curvy
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 hover-lift"
          >
            <Save className="h-4 w-4" />
          </button>
        </div>

        {/* Saved Arrays List */}
        {savedArrays.length > 0 && (
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {savedArrays.map((saved, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-accent/10 rounded-curvy border border-accent/20"
              >
                <div className="flex-1">
                  <div className="text-sm font-medium text-text-primary">{saved.name}</div>
                  <div className="text-xs text-text-muted">
                    {saved.array.length} elements: [{saved.array.slice(0, 5).join(', ')}{saved.array.length > 5 ? '...' : ''}]
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => loadSavedArray(saved.array)}
                    className="p-1 text-primary hover:bg-primary/20 rounded transition-colors duration-200"
                    title="Load Array"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => deleteSavedArray(index)}
                    className="p-1 text-error hover:bg-error/20 rounded transition-colors duration-200"
                    title="Delete Array"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current Array Info */}
      <div className="bg-accent/10 rounded-curvy p-3 border border-accent/20">
        <div className="flex justify-between items-center text-sm">
          <span className="text-text-muted">Current Array:</span>
          <div className="flex items-center space-x-2">
            <span className="text-text-secondary font-medium">
              {currentArray.length} elements
            </span>
            {currentArray.length > 0 && (
              <span className="text-primary">
                Range: {Math.min(...currentArray)}-{Math.max(...currentArray)}
              </span>
            )}
          </div>
        </div>
        {currentArray.length > 0 && (
          <div className="mt-2 text-xs text-text-muted">
            [{currentArray.slice(0, 10).join(', ')}{currentArray.length > 10 ? '...' : ''}]
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedCustomInputPanel;