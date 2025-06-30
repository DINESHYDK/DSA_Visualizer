import React, { useState } from 'react';
import { Shuffle, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { generateRandomArray, generateSortedArray, generateReverseSortedArray, generateNearlySortedArray, validateArrayInput } from '../../utils';

interface CustomInputPanelProps {
  onArrayChange: (array: number[]) => void;
  maxSize?: number;
  minValue?: number;
  maxValue?: number;
}

const CustomInputPanel: React.FC<CustomInputPanelProps> = ({
  onArrayChange,
  maxSize = 20,
  minValue = 1,
  maxValue = 99
}) => {
  const [arraySize, setArraySize] = useState(8);
  const [customInput, setCustomInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [activePreset, setActivePreset] = useState<string>('');

  const handleSizeChange = (newSize: number) => {
    setArraySize(newSize);
    if (activePreset) {
      generatePresetArray(activePreset, newSize);
    }
  };

  const generatePresetArray = (preset: string, size: number = arraySize) => {
    let newArray: number[] = [];
    
    switch (preset) {
      case 'random':
        newArray = generateRandomArray(size, minValue, maxValue);
        break;
      case 'sorted':
        newArray = generateSortedArray(size, minValue, maxValue);
        break;
      case 'reverse':
        newArray = generateReverseSortedArray(size, minValue, maxValue);
        break;
      case 'nearly-sorted':
        newArray = generateNearlySortedArray(size, minValue, maxValue);
        break;
    }
    
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
      setInputError('');
      onArrayChange(validation.values);
    } else {
      setInputError(validation.error || 'Invalid input');
    }
  };

  const presetButtons = [
    {
      id: 'random',
      label: 'Random',
      icon: <Shuffle className="h-4 w-4" />,
      description: 'Randomly shuffled numbers'
    },
    {
      id: 'sorted',
      label: 'Sorted',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Already sorted (best case)'
    },
    {
      id: 'reverse',
      label: 'Reverse',
      icon: <TrendingDown className="h-4 w-4" />,
      description: 'Reverse sorted (worst case)'
    },
    {
      id: 'nearly-sorted',
      label: 'Nearly Sorted',
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'Mostly sorted with few swaps'
    }
  ];

  return (
    <div className="bg-bg-card rounded-curvy p-6 shadow-curvy space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-primary mb-4">Customize Input Data</h3>
        
        {/* Array Size Control */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-text-secondary">
              Array Size: {arraySize}
            </label>
            <span className="text-xs text-text-muted">
              Max: {maxSize}
            </span>
          </div>
          
          <input
            type="range"
            min="3"
            max={maxSize}
            value={arraySize}
            onChange={(e) => handleSizeChange(parseInt(e.target.value))}
            className="w-full h-2 bg-accent rounded-curvy appearance-none cursor-pointer
                     slider-thumb:appearance-none slider-thumb:h-4 slider-thumb:w-4 
                     slider-thumb:rounded-full slider-thumb:bg-primary 
                     slider-thumb:cursor-pointer slider-thumb:shadow-glow"
          />
          
          <div className="flex justify-between text-xs text-text-muted">
            <span>3</span>
            <span>{Math.floor(maxSize / 2)}</span>
            <span>{maxSize}</span>
          </div>
        </div>
      </div>

      {/* Preset Arrays */}
      <div className="space-y-3">
        <h4 className="text-md font-medium text-text-secondary">Quick Presets</h4>
        <div className="grid grid-cols-2 gap-3">
          {presetButtons.map((preset) => (
            <button
              key={preset.id}
              onClick={() => generatePresetArray(preset.id)}
              className={`p-3 rounded-curvy border transition-all duration-200 text-left ${
                activePreset === preset.id
                  ? 'bg-primary/20 border-primary text-primary'
                  : 'bg-accent/20 border-accent/40 text-text-secondary hover:bg-primary/10 hover:border-primary/60'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                {preset.icon}
                <span className="font-medium text-sm">{preset.label}</span>
              </div>
              <p className="text-xs opacity-80">{preset.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Input */}
      <div className="space-y-3">
        <h4 className="text-md font-medium text-text-secondary">Custom Values</h4>
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
            <p className="text-error text-sm">{inputError}</p>
          )}
          
          <p className="text-xs text-text-muted">
            Enter up to {maxSize} numbers between {minValue} and {maxValue}
          </p>
        </div>
      </div>

      {/* Value Range Info */}
      <div className="bg-accent/10 rounded-curvy p-3 border border-accent/20">
        <div className="flex justify-between items-center text-sm">
          <span className="text-text-muted">Value Range:</span>
          <span className="text-text-secondary font-medium">{minValue} - {maxValue}</span>
        </div>
      </div>
    </div>
  );
};

export default CustomInputPanel;