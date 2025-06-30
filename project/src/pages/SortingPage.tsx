import React, { useState } from 'react';
import SortingVisualization from '../components/sorting/SortingVisualization';
import EnhancedCustomInputPanel from '../components/sorting/EnhancedCustomInputPanel';
import AlgorithmComparison from '../components/sorting/AlgorithmComparison';
import { generateRandomArray } from '../utils';

const SortingPage: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'bubble' | 'selection' | 'insertion' | 'merge' | 'quick' | 'heap'>('bubble');
  const [currentArray, setCurrentArray] = useState<number[]>(() => generateRandomArray(8, 10, 99));
  const [key, setKey] = useState(0); // Force re-render of visualization

  const handleAlgorithmChange = (algorithm: 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick' | 'heap') => {
    setSelectedAlgorithm(algorithm);
    setKey(prev => prev + 1); // Force re-render with new algorithm
  };

  const handleArrayChange = (newArray: number[]) => {
    setCurrentArray(newArray);
    setKey(prev => prev + 1); // Force re-render with new array
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Sorting Algorithms</h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Explore how different sorting algorithms work through interactive visualizations. 
            Compare their performance and understand their step-by-step execution.
          </p>
        </div>

        {/* Enhanced Custom Input Panel - Moved to top */}
        <div className="mb-8">
          <EnhancedCustomInputPanel
            onArrayChange={handleArrayChange}
            currentArray={currentArray}
            maxSize={15}
            minValue={5}
            maxValue={95}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Algorithm Selection */}
          <div className="space-y-6">
            <AlgorithmComparison
              selectedAlgorithm={selectedAlgorithm}
              onAlgorithmSelect={handleAlgorithmChange}
            />
          </div>

          {/* Right Column - Visualization */}
          <div className="lg:col-span-2">
            <SortingVisualization
              key={key}
              algorithm={selectedAlgorithm}
              initialArray={currentArray}
              onComplete={() => {
                console.log(`${selectedAlgorithm} sort completed!`);
              }}
            />
          </div>
        </div>

        {/* Educational Content */}
        <div className="mt-12 bg-bg-card rounded-curvy p-6 shadow-curvy">
          <h2 className="text-2xl font-semibold text-primary mb-4">Understanding Sorting Algorithms</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Algorithms */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-info mb-3">Basic Algorithms</h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-text-primary mb-1">Bubble Sort</h4>
                  <ul className="space-y-1 text-text-muted text-sm">
                    <li>• Compares adjacent elements</li>
                    <li>• Simple but inefficient O(n²)</li>
                    <li>• Good for learning concepts</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-text-primary mb-1">Selection Sort</h4>
                  <ul className="space-y-1 text-text-muted text-sm">
                    <li>• Finds minimum element</li>
                    <li>• Minimizes number of swaps</li>
                    <li>• Always O(n²) comparisons</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-text-primary mb-1">Insertion Sort</h4>
                  <ul className="space-y-1 text-text-muted text-sm">
                    <li>• Builds sorted array incrementally</li>
                    <li>• Efficient for small/nearly sorted arrays</li>
                    <li>• Adaptive and stable</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Advanced Algorithms */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-primary mb-3">Advanced Algorithms</h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-text-primary mb-1">Merge Sort</h4>
                  <ul className="space-y-1 text-text-muted text-sm">
                    <li>• Divide and conquer approach</li>
                    <li>• Guaranteed O(n log n) performance</li>
                    <li>• Stable but requires extra space</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-text-primary mb-1">Quick Sort</h4>
                  <ul className="space-y-1 text-text-muted text-sm">
                    <li>• Partition-based sorting</li>
                    <li>• Average O(n log n), worst O(n²)</li>
                    <li>• In-place but not stable</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-text-primary mb-1">Heap Sort</h4>
                  <ul className="space-y-1 text-text-muted text-sm">
                    <li>• Uses binary heap data structure</li>
                    <li>• Guaranteed O(n log n) performance</li>
                    <li>• In-place but not stable</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Performance Comparison */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-success mb-3">Performance Guide</h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-text-primary mb-1">Best for Learning</h4>
                  <p className="text-text-muted text-sm">Bubble, Selection, Insertion sorts are great for understanding basic concepts.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-text-primary mb-1">Best for Performance</h4>
                  <p className="text-text-muted text-sm">Merge, Quick, and Heap sort offer superior O(n log n) performance for large datasets.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-text-primary mb-1">Memory Considerations</h4>
                  <p className="text-text-muted text-sm">Heap and Quick sort are in-place (O(1) space), while Merge sort requires O(n) extra space.</p>
                </div>

                <div>
                  <h4 className="font-medium text-text-primary mb-1">Interactive Features</h4>
                  <p className="text-text-muted text-sm">Use keyboard shortcuts: Space (play/pause), arrows (step), C (toggle code), R (reset).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortingPage;