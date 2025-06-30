import React, { useState } from 'react';
import SearchVisualization from '../components/search/SearchVisualization';
import EnhancedCustomInputPanel from '../components/sorting/EnhancedCustomInputPanel';
import { Search, Target, Zap, CheckCircle, XCircle } from 'lucide-react';
import { generateRandomArray, generateSortedArray } from '../utils';

const SearchPage: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'linear' | 'binary'>('linear');
  const [currentArray, setCurrentArray] = useState<number[]>(() => generateRandomArray(8, 10, 99));
  const [targetValue, setTargetValue] = useState<number>(30);
  const [key, setKey] = useState(0); // Force re-render of visualization

  const algorithms = [
    {
      id: 'linear' as const,
      name: 'Linear Search',
      icon: <Search className="h-6 w-6" />,
      description: 'Sequential search through each element',
      complexity: 'O(n) average case',
      color: 'text-primary',
      features: ['Works on unsorted arrays', 'Simple implementation', 'No preprocessing required']
    },
    {
      id: 'binary' as const,
      name: 'Binary Search',
      icon: <Target className="h-6 w-6" />,
      description: 'Divide and conquer search on sorted arrays',
      complexity: 'O(log n) guaranteed',
      color: 'text-success',
      features: ['Requires sorted array', 'Very efficient', 'Logarithmic time complexity']
    }
  ];

  const handleAlgorithmChange = (algorithm: 'linear' | 'binary') => {
    setSelectedAlgorithm(algorithm);
    
    // If switching to binary search, ensure array is sorted
    if (algorithm === 'binary') {
      const sortedArray = [...currentArray].sort((a, b) => a - b);
      setCurrentArray(sortedArray);
    }
    
    setKey(prev => prev + 1); // Force re-render with new algorithm
  };

  const handleArrayChange = (newArray: number[]) => {
    // If binary search is selected, sort the array
    if (selectedAlgorithm === 'binary') {
      const sortedArray = [...newArray].sort((a, b) => a - b);
      setCurrentArray(sortedArray);
    } else {
      setCurrentArray(newArray);
    }
    setKey(prev => prev + 1); // Force re-render with new array
  };

  const handleTargetChange = (newTarget: number) => {
    setTargetValue(newTarget);
    setKey(prev => prev + 1); // Force re-render with new target
  };

  const generatePresetArray = (type: 'random' | 'sorted' | 'with-target' | 'without-target') => {
    let newArray: number[];
    let newTarget = targetValue;

    switch (type) {
      case 'random':
        newArray = generateRandomArray(10, 10, 99);
        break;
      case 'sorted':
        newArray = generateSortedArray(10, 10, 99);
        break;
      case 'with-target':
        newArray = generateRandomArray(9, 10, 99);
        newArray.push(targetValue);
        if (selectedAlgorithm === 'binary') {
          newArray.sort((a, b) => a - b);
        }
        break;
      case 'without-target':
        newArray = generateRandomArray(10, 10, 99).filter(val => val !== targetValue);
        if (selectedAlgorithm === 'binary') {
          newArray.sort((a, b) => a - b);
        }
        break;
      default:
        return;
    }

    setCurrentArray(newArray);
    setKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Search Algorithms</h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Explore different search algorithms and understand how they find elements in arrays. 
            Compare linear and binary search performance and see when each is most effective.
          </p>
        </div>

        {/* Algorithm Selection */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {algorithms.map((algorithm) => (
              <button
                key={algorithm.id}
                onClick={() => handleAlgorithmChange(algorithm.id)}
                className={`p-6 rounded-curvy border-2 transition-all duration-200 text-left hover-lift ${
                  selectedAlgorithm === algorithm.id
                    ? 'bg-primary/20 border-primary text-primary shadow-glow'
                    : 'bg-bg-card border-accent/40 text-text-secondary hover:bg-primary/10 hover:border-primary/60'
                }`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`${selectedAlgorithm === algorithm.id ? 'text-primary' : algorithm.color}`}>
                    {algorithm.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{algorithm.name}</h3>
                </div>
                
                <p className="text-sm opacity-80 mb-3 leading-relaxed">{algorithm.description}</p>
                <p className="text-xs font-mono opacity-70 mb-3">{algorithm.complexity}</p>
                
                <div className="space-y-1">
                  {algorithm.features.map((feature, index) => (
                    <div key={index} className="text-xs opacity-70 flex items-center">
                      <span className="w-1 h-1 bg-current rounded-full mr-2"></span>
                      {feature}
                    </div>
                  ))}
                </div>
                
                {selectedAlgorithm === algorithm.id && (
                  <div className="mt-3 text-xs text-primary font-medium">
                    ✓ Currently Active
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Target Value Control */}
          <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
            <h3 className="text-lg font-medium text-text-primary mb-4">Search Target</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-text-secondary mb-2 block">
                  Target Value: {targetValue}
                </label>
                <input
                  type="range"
                  min="10"
                  max="99"
                  value={targetValue}
                  onChange={(e) => handleTargetChange(parseInt(e.target.value))}
                  className="w-full h-3 bg-accent rounded-curvy appearance-none cursor-pointer
                           focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <div className="flex justify-between text-xs text-text-muted mt-2">
                  <span>10</span>
                  <span>99</span>
                </div>
              </div>

              <div>
                <input
                  type="number"
                  value={targetValue}
                  onChange={(e) => handleTargetChange(parseInt(e.target.value) || 10)}
                  min="10"
                  max="99"
                  className="w-full p-3 bg-accent/20 border border-accent/40 rounded-curvy
                           text-text-primary focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <div className="text-xs text-text-muted">
                {currentArray.includes(targetValue) ? (
                  <div className="flex items-center text-success">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Target exists in array
                  </div>
                ) : (
                  <div className="flex items-center text-warning">
                    <XCircle className="h-4 w-4 mr-1" />
                    Target not in array
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Array Presets */}
          <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
            <h3 className="text-lg font-medium text-text-primary mb-4">Quick Scenarios</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => generatePresetArray('random')}
                className="px-3 py-2 bg-info hover:bg-info/80 text-white rounded-curvy
                         transition-all duration-200 hover-lift text-sm"
              >
                Random Array
              </button>
              
              <button
                onClick={() => generatePresetArray('sorted')}
                className="px-3 py-2 bg-success hover:bg-success/80 text-white rounded-curvy
                         transition-all duration-200 hover-lift text-sm"
              >
                Sorted Array
              </button>
              
              <button
                onClick={() => generatePresetArray('with-target')}
                className="px-3 py-2 bg-primary hover:bg-hover text-secondary rounded-curvy
                         transition-all duration-200 hover-lift text-sm"
              >
                With Target
              </button>
              
              <button
                onClick={() => generatePresetArray('without-target')}
                className="px-3 py-2 bg-warning hover:bg-warning/80 text-white rounded-curvy
                         transition-all duration-200 hover-lift text-sm"
              >
                Without Target
              </button>
            </div>
          </div>

          {/* Array Info */}
          <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
            <h3 className="text-lg font-medium text-text-primary mb-4">Array Information</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Size:</span>
                <span className="text-primary font-medium">{currentArray.length} elements</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Range:</span>
                <span className="text-primary font-medium">
                  {Math.min(...currentArray)} - {Math.max(...currentArray)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Sorted:</span>
                <span className={`font-medium ${
                  currentArray.every((val, i) => i === 0 || currentArray[i - 1] <= val) 
                    ? 'text-success' : 'text-warning'
                }`}>
                  {currentArray.every((val, i) => i === 0 || currentArray[i - 1] <= val) ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Target Present:</span>
                <span className={`font-medium ${currentArray.includes(targetValue) ? 'text-success' : 'text-error'}`}>
                  {currentArray.includes(targetValue) ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            {selectedAlgorithm === 'binary' && !currentArray.every((val, i) => i === 0 || currentArray[i - 1] <= val) && (
              <div className="mt-4 p-3 bg-warning/20 rounded-curvy border border-warning/40">
                <p className="text-xs text-warning">
                  ⚠️ Binary search requires a sorted array. The array will be sorted automatically.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Custom Input Panel */}
        <div className="mb-8">
          <EnhancedCustomInputPanel
            onArrayChange={handleArrayChange}
            currentArray={currentArray}
            maxSize={15}
            minValue={10}
            maxValue={99}
          />
        </div>

        {/* Visualization */}
        <div className="mb-12">
          <SearchVisualization
            key={key}
            algorithm={selectedAlgorithm}
            initialArray={currentArray}
            targetValue={targetValue}
            onComplete={() => {
              console.log(`${selectedAlgorithm} search completed!`);
            }}
          />
        </div>

        {/* Educational Content */}
        <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
          <h2 className="text-2xl font-semibold text-primary mb-6">Understanding Search Algorithms</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Linear Search */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-primary flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Linear Search</span>
              </h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-text-primary mb-2">How it Works</h4>
                  <ul className="space-y-1 text-text-muted text-sm">
                    <li>• Checks each element sequentially</li>
                    <li>• Starts from the beginning</li>
                    <li>• Stops when target is found or end is reached</li>
                    <li>• Works on any array (sorted or unsorted)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-text-primary mb-2">Best Use Cases</h4>
                  <ul className="space-y-1 text-text-muted text-sm">
                    <li>• Small arrays (< 100 elements)</li>
                    <li>• Unsorted data</li>
                    <li>• When simplicity is important</li>
                    <li>• One-time searches</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Binary Search */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-success flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Binary Search</span>
              </h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-text-primary mb-2">How it Works</h4>
                  <ul className="space-y-1 text-text-muted text-sm">
                    <li>• Divides search space in half each step</li>
                    <li>• Compares target with middle element</li>
                    <li>• Eliminates half of remaining elements</li>
                    <li>• Requires sorted array</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-text-primary mb-2">Best Use Cases</h4>
                  <ul className="space-y-1 text-text-muted text-sm">
                    <li>• Large sorted arrays</li>
                    <li>• Frequent searches</li>
                    <li>• When performance is critical</li>
                    <li>• Database indexing</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Performance Comparison */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-info flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Performance Analysis</span>
              </h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-text-primary mb-2">Time Complexity</h4>
                  <ul className="space-y-1 text-text-muted text-sm">
                    <li>• <strong className="text-primary">Linear:</strong> O(n) average</li>
                    <li>• <strong className="text-success">Binary:</strong> O(log n) always</li>
                    <li>• Binary is exponentially faster</li>
                    <li>• For 1M elements: 1M vs 20 comparisons</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-text-primary mb-2">Trade-offs</h4>
                  <ul className="space-y-1 text-text-muted text-sm">
                    <li>• Binary requires sorted data</li>
                    <li>• Sorting cost: O(n log n)</li>
                    <li>• Linear works on any data</li>
                    <li>• Choose based on search frequency</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* When to Use Each Algorithm */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-accent/10 rounded-curvy p-4">
              <h4 className="text-md font-medium text-primary mb-3">When to Use Linear Search</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                <li><strong className="text-primary">Small datasets:</strong> Overhead of sorting not worth it</li>
                <li><strong className="text-primary">Unsorted data:</strong> No preprocessing available</li>
                <li><strong className="text-primary">One-time search:</strong> Won't search again</li>
                <li><strong className="text-primary">Simple implementation:</strong> Easy to understand and debug</li>
                <li><strong className="text-primary">Dynamic data:</strong> Frequently changing arrays</li>
              </ul>
            </div>
            
            <div className="bg-accent/10 rounded-curvy p-4">
              <h4 className="text-md font-medium text-success mb-3">When to Use Binary Search</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                <li><strong className="text-success">Large datasets:</strong> Significant performance gain</li>
                <li><strong className="text-success">Sorted data:</strong> Already have sorted array</li>
                <li><strong className="text-success">Frequent searches:</strong> Will search many times</li>
                <li><strong className="text-success">Performance critical:</strong> Speed is essential</li>
                <li><strong className="text-success">Database systems:</strong> Indexing and lookups</li>
              </ul>
            </div>
          </div>

          {/* Real-world Applications */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-text-primary mb-4">Real-World Applications</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-primary/10 rounded-curvy p-4 border border-primary/20">
                <h4 className="font-medium text-primary mb-2">Linear Search</h4>
                <ul className="space-y-1 text-sm text-text-muted">
                  <li>• Finding items in shopping lists</li>
                  <li>• Searching through emails</li>
                  <li>• Looking through small contact lists</li>
                  <li>• Game inventory searches</li>
                </ul>
              </div>
              
              <div className="bg-success/10 rounded-curvy p-4 border border-success/20">
                <h4 className="font-medium text-success mb-2">Binary Search</h4>
                <ul className="space-y-1 text-sm text-text-muted">
                  <li>• Dictionary/phone book lookups</li>
                  <li>• Database indexing</li>
                  <li>• Finding files in sorted directories</li>
                  <li>• Version control systems</li>
                </ul>
              </div>
              
              <div className="bg-info/10 rounded-curvy p-4 border border-info/20">
                <h4 className="font-medium text-info mb-2">Hybrid Approaches</h4>
                <ul className="space-y-1 text-sm text-text-muted">
                  <li>• Search engines (multiple algorithms)</li>
                  <li>• Auto-complete features</li>
                  <li>• Recommendation systems</li>
                  <li>• Data analytics platforms</li>
                </ul>
              </div>
              
              <div className="bg-warning/10 rounded-curvy p-4 border border-warning/20">
                <h4 className="font-medium text-warning mb-2">Advanced Variants</h4>
                <ul className="space-y-1 text-sm text-text-muted">
                  <li>• Interpolation search</li>
                  <li>• Exponential search</li>
                  <li>• Ternary search</li>
                  <li>• Hash table lookups</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;