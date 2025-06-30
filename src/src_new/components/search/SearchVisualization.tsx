import React, { useState, useEffect } from 'react';
import { useAnimationEngine } from '../../hooks/useAnimationEngine';
import ArrayVisualization from '../animation/ArrayVisualization';
import AnimationControlPanel from '../animation/AnimationControlPanel';
import CodeDisplay from '../sorting/CodeDisplay';
import { ArrayElement, SortingStep, AlgorithmMetrics } from '../../types';
import { generateRandomArray } from '../../utils';

interface SearchVisualizationProps {
  algorithm: 'linear' | 'binary';
  initialArray?: number[];
  targetValue?: number;
  onComplete?: () => void;
}

export default function SearchVisualization({
  algorithm,
  initialArray,
  targetValue,
  onComplete
}: SearchVisualizationProps) {
  const [elements, setElements] = useState<ArrayElement[]>([]);
  const [steps, setSteps] = useState<SortingStep[]>([]);
  const [metrics, setMetrics] = useState<AlgorithmMetrics>({
    comparisons: 0,
    swaps: 0,
    arrayAccesses: 0,
    timeElapsed: 0
  });
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [currentOperation, setCurrentOperation] = useState<string>('');
  const [startTime, setStartTime] = useState<number>(0);
  const [showCodeDisplay, setShowCodeDisplay] = useState(true);
  const [target, setTarget] = useState<number>(targetValue || 30);

  // Initialize array and algorithm
  useEffect(() => {
    const initializeAlgorithm = async () => {
      let array = initialArray || generateRandomArray(8, 10, 99);
      
      // For binary search, ensure array is sorted
      if (algorithm === 'binary') {
        array = [...array].sort((a, b) => a - b);
      }
      
      // Dynamic import based on algorithm
      let searchResult;
      let createElements;
      
      switch (algorithm) {
        case 'linear':
          const { linearSearch, createLinearSearchElements } = await import('../../algorithms/search/linearSearch');
          searchResult = linearSearch(array, target);
          createElements = createLinearSearchElements;
          break;
        case 'binary':
          const { binarySearch, createBinarySearchElements } = await import('../../algorithms/search/binarySearch');
          searchResult = binarySearch(array, target);
          createElements = createBinarySearchElements;
          break;
        default:
          throw new Error(`Unknown algorithm: ${algorithm}`);
      }

      setSteps(searchResult.steps);
      setElements(createElements(array));
      setMetrics({
        comparisons: searchResult.metrics.comparisons,
        swaps: 0, // Search algorithms don't swap
        arrayAccesses: searchResult.metrics.arrayAccesses,
        timeElapsed: 0
      });
      setStartTime(Date.now());
    };

    initializeAlgorithm();
  }, [algorithm, initialArray, target]);

  // Handle step changes
  const handleStepChange = (stepIndex: number, stepData: any) => {
    if (!stepData || stepIndex >= steps.length) return;

    const step = steps[stepIndex];
    setCurrentOperation(step.description);
    setHighlightedIndices(step.indices);

    // Update element states based on step type
    setElements(prevElements => {
      return prevElements.map((element, index) => {
        let newState = element.state;

        // Reset previous states
        if (element.state === 'comparing' || element.state === 'current') {
          newState = 'default';
        }

        // Apply new states based on step
        if (step.indices.includes(index)) {
          switch (step.type) {
            case 'compare':
              newState = 'comparing';
              break;
            case 'set':
              newState = 'found';
              break;
            case 'highlight':
              newState = 'current';
              break;
          }
        }

        // Update value if it changed (for sorted arrays)
        const newValue = step.values ? step.values[index] : element.value;

        return {
          ...element,
          value: newValue,
          state: newState
        };
      });
    });

    // Update elapsed time
    setMetrics(prev => ({
      ...prev,
      timeElapsed: Date.now() - startTime
    }));
  };

  const handleComplete = () => {
    setCurrentOperation('Search completed!');
    setHighlightedIndices([]);
    
    // Keep found elements highlighted
    setElements(prevElements =>
      prevElements.map(element => ({
        ...element,
        state: element.state === 'found' ? 'found' : 'default'
      }))
    );

    onComplete?.();
  };

  const { state, controls, currentStepData } = useAnimationEngine({
    steps: steps.map((step, index) => ({
      id: `step-${index}`,
      type: step.type,
      indices: step.indices,
      values: step.values,
      description: step.description
    })),
    onStepChange: handleStepChange,
    onComplete: handleComplete
  });

  const getAlgorithmName = () => {
    switch (algorithm) {
      case 'linear':
        return 'Linear Search';
      case 'binary':
        return 'Binary Search';
      default:
        return 'Search Algorithm';
    }
  };

  const getAlgorithmDescription = () => {
    switch (algorithm) {
      case 'linear':
        return 'Searches through each element sequentially until the target is found';
      case 'binary':
        return 'Efficiently searches sorted arrays by repeatedly dividing the search interval in half';
      default:
        return 'Search algorithm visualization';
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'Space':
          event.preventDefault();
          if (state.isPlaying) {
            controls.pause();
          } else {
            controls.play();
          }
          break;
        case 'ArrowLeft':
          event.preventDefault();
          controls.stepBackward();
          break;
        case 'ArrowRight':
          event.preventDefault();
          controls.stepForward();
          break;
        case 'KeyR':
          event.preventDefault();
          controls.reset();
          break;
        case 'KeyC':
          event.preventDefault();
          setShowCodeDisplay(!showCodeDisplay);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [state.isPlaying, controls, showCodeDisplay]);

  return (
    <div className="space-y-6">
      {/* Algorithm Info */}
      <div className="bg-bg-card rounded-curvy p-4 shadow-curvy">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-2">
              {getAlgorithmName()} - Target: {target}
            </h3>
            <p className="text-text-secondary text-sm">
              {getAlgorithmDescription()}
            </p>
          </div>
          <button
            onClick={() => setShowCodeDisplay(!showCodeDisplay)}
            className="px-4 py-2 bg-primary hover:bg-hover text-secondary rounded-curvy
                     transition-all duration-200 hover-lift"
          >
            {showCodeDisplay ? 'Hide Code' : 'Show Code'}
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={`grid gap-6 ${showCodeDisplay ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
        {/* Visualization Column */}
        <div className="space-y-6">
          {/* Visualization Area */}
          <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
            <div className="relative">
              {/* Array Visualization */}
              <ArrayVisualization
                elements={elements}
                highlightedIndices={highlightedIndices}
                elementWidth={70}
                elementHeight={70}
                gap={12}
                className="mb-8"
              />
            </div>

            {/* Current Operation Display */}
            <div className="mt-8 p-6 bg-gradient-to-r from-accent/10 to-primary/10 rounded-curvy border border-primary/20 min-h-[80px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-text-primary text-base font-medium leading-relaxed">
                  {currentOperation || 'Ready to start searching...'}
                </p>
                {currentOperation && (
                  <div className="mt-2 text-xs text-text-muted">
                    Step {state.currentStep} of {state.totalSteps}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Animation Control Panel */}
          <AnimationControlPanel
            state={state}
            controls={controls}
            showStepControls={true}
            showSpeedControl={true}
            showProgressBar={true}
            showStatusIndicator={true}
            showAdvancedControls={true}
          />

          {/* Metrics Display */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-bg-card rounded-curvy p-4 shadow-curvy text-center hover-lift">
              <div className="text-2xl font-bold text-primary">{metrics.comparisons}</div>
              <div className="text-sm text-text-muted">Comparisons</div>
              <div className="w-full bg-accent/20 rounded-curvy h-1 mt-2">
                <div className="h-full bg-primary rounded-curvy" style={{ width: '60%' }} />
              </div>
            </div>
            <div className="bg-bg-card rounded-curvy p-4 shadow-curvy text-center hover-lift">
              <div className="text-2xl font-bold text-info">{metrics.arrayAccesses}</div>
              <div className="text-sm text-text-muted">Array Accesses</div>
              <div className="w-full bg-accent/20 rounded-curvy h-1 mt-2">
                <div className="h-full bg-info rounded-curvy" style={{ width: '80%' }} />
              </div>
            </div>
            <div className="bg-bg-card rounded-curvy p-4 shadow-curvy text-center hover-lift">
              <div className="text-2xl font-bold text-success">{(metrics.timeElapsed / 1000).toFixed(1)}s</div>
              <div className="text-sm text-text-muted">Time Elapsed</div>
              <div className="w-full bg-accent/20 rounded-curvy h-1 mt-2">
                <div className="h-full bg-success rounded-curvy" style={{ width: '30%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Code Display Column */}
        {showCodeDisplay && (
          <div className="space-y-6">
            <CodeDisplay
              algorithm={algorithm as any}
              currentStep={state.currentStep}
              totalSteps={state.totalSteps}
              currentOperation={currentOperation}
            />
          </div>
        )}
      </div>

      {/* Algorithm Comparison */}
      <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
        <h4 className="text-lg font-semibold text-primary mb-4">Search Algorithm Comparison</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-accent/20">
                <th className="text-left py-3 px-4 text-text-secondary font-semibold">Algorithm</th>
                <th className="text-left py-3 px-4 text-text-secondary font-semibold">Best Case</th>
                <th className="text-left py-3 px-4 text-text-secondary font-semibold">Average Case</th>
                <th className="text-left py-3 px-4 text-text-secondary font-semibold">Worst Case</th>
                <th className="text-left py-3 px-4 text-text-secondary font-semibold">Space</th>
                <th className="text-left py-3 px-4 text-text-secondary font-semibold">Prerequisite</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-accent/10 hover:bg-accent/5">
                <td className="py-3 px-4 font-medium text-primary">Linear Search</td>
                <td className="py-3 px-4 text-success font-mono">O(1)</td>
                <td className="py-3 px-4 text-warning font-mono">O(n)</td>
                <td className="py-3 px-4 text-error font-mono">O(n)</td>
                <td className="py-3 px-4 text-info font-mono">O(1)</td>
                <td className="py-3 px-4 text-text-muted text-xs">None</td>
              </tr>
              <tr className="hover:bg-accent/5">
                <td className="py-3 px-4 font-medium text-success">Binary Search</td>
                <td className="py-3 px-4 text-success font-mono">O(1)</td>
                <td className="py-3 px-4 text-success font-mono">O(log n)</td>
                <td className="py-3 px-4 text-success font-mono">O(log n)</td>
                <td className="py-3 px-4 text-info font-mono">O(1)</td>
                <td className="py-3 px-4 text-text-muted text-xs">Sorted array</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}