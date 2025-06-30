import React, { useState, useEffect } from 'react';
import { useAnimationEngine } from '../../hooks/useAnimationEngine';
import ArrayVisualization from '../animation/ArrayVisualization';
import TreeVisualization from '../animation/TreeVisualization';
import AnimationControlPanel from '../animation/AnimationControlPanel';
import CodeDisplay from './CodeDisplay';
import ComparisonHighlight from '../animation/ComparisonHighlight';
import { ArrayElement, SortingStep, AlgorithmMetrics } from '../../types';
import { generateRandomArray } from '../../utils';

interface SortingVisualizationProps {
  algorithm: 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick' | 'heap';
  initialArray?: number[];
  onComplete?: () => void;
}

export default function SortingVisualization({
  algorithm,
  initialArray,
  onComplete
}: SortingVisualizationProps) {
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
  const [showAlgorithmInfo, setShowAlgorithmInfo] = useState(false);
  const [showCodeDisplay, setShowCodeDisplay] = useState(true);

  // Initialize array and algorithm
  useEffect(() => {
    const initializeAlgorithm = async () => {
      const array = initialArray || generateRandomArray(8, 10, 99);
      
      // Dynamic import based on algorithm
      let sortResult;
      let createElements;
      
      switch (algorithm) {
        case 'bubble':
          const { bubbleSort, createBubbleSortElements } = await import('../../algorithms/sorting/bubbleSort');
          sortResult = bubbleSort(array);
          createElements = createBubbleSortElements;
          break;
        case 'selection':
          const { selectionSort, createSelectionSortElements } = await import('../../algorithms/sorting/selectionSort');
          sortResult = selectionSort(array);
          createElements = createSelectionSortElements;
          break;
        case 'insertion':
          const { insertionSort, createInsertionSortElements } = await import('../../algorithms/sorting/insertionSort');
          sortResult = insertionSort(array);
          createElements = createInsertionSortElements;
          break;
        case 'merge':
          const { mergeSort, createMergeSortElements } = await import('../../algorithms/sorting/mergeSort');
          sortResult = mergeSort(array);
          createElements = createMergeSortElements;
          break;
        case 'quick':
          const { quickSort, createQuickSortElements } = await import('../../algorithms/sorting/quickSort');
          sortResult = quickSort(array);
          createElements = createQuickSortElements;
          break;
        case 'heap':
          const { heapSort, createHeapSortElements } = await import('../../algorithms/sorting/heapSort');
          sortResult = heapSort(array);
          createElements = createHeapSortElements;
          break;
        default:
          throw new Error(`Unknown algorithm: ${algorithm}`);
      }

      setSteps(sortResult.steps);
      setElements(createElements(array));
      setMetrics({
        ...sortResult.metrics,
        timeElapsed: 0
      });
      setStartTime(Date.now());
    };

    initializeAlgorithm();
  }, [algorithm, initialArray]);

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
        if (element.state === 'comparing' || element.state === 'swapping') {
          newState = 'default';
        }

        // Apply new states based on step
        if (step.indices.includes(index)) {
          switch (step.type) {
            case 'compare':
              newState = 'comparing';
              break;
            case 'swap':
              newState = 'swapping';
              break;
            case 'set':
              newState = 'sorted';
              break;
            case 'highlight':
              newState = step.type === 'highlight' && stepIndex === steps.length - 1 ? 'sorted' : 'current';
              break;
          }
        }

        // Update value if it changed
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
    setCurrentOperation('Sorting completed!');
    setHighlightedIndices([]);
    
    // Mark all elements as sorted
    setElements(prevElements =>
      prevElements.map(element => ({
        ...element,
        state: 'sorted'
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

  const getHighlightType = (): 'comparison' | 'swap' | 'highlight' => {
    if (!currentStepData) return 'highlight';
    
    switch (currentStepData.type) {
      case 'compare':
        return 'comparison';
      case 'swap':
        return 'swap';
      default:
        return 'highlight';
    }
  };

  const getAlgorithmName = () => {
    switch (algorithm) {
      case 'bubble':
        return 'Bubble Sort';
      case 'selection':
        return 'Selection Sort';
      case 'insertion':
        return 'Insertion Sort';
      case 'merge':
        return 'Merge Sort';
      case 'quick':
        return 'Quick Sort';
      case 'heap':
        return 'Heap Sort';
      default:
        return 'Sorting Algorithm';
    }
  };

  const getAlgorithmDescription = () => {
    switch (algorithm) {
      case 'bubble':
        return 'Compares adjacent elements and swaps them if they are in wrong order';
      case 'selection':
        return 'Finds the minimum element and places it at the beginning of unsorted portion';
      case 'insertion':
        return 'Builds the sorted array one element at a time by inserting each element into its correct position';
      case 'merge':
        return 'Divides the array into halves, sorts them separately, and merges them back together';
      case 'quick':
        return 'Selects a pivot element and partitions the array around it, then recursively sorts the partitions';
      case 'heap':
        return 'Uses a binary heap data structure to repeatedly extract the maximum element';
      default:
        return 'Sorting algorithm visualization';
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
              {getAlgorithmName()}
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
              {/* Conditional rendering: Tree view for Heap Sort, Array view for others */}
              {algorithm === 'heap' ? (
                <TreeVisualization
                  elements={elements}
                  highlightedIndices={highlightedIndices}
                  width={800}
                  height={400}
                  className="mb-8"
                />
              ) : (
                <>
                  {/* Array Visualization */}
                  <ArrayVisualization
                    elements={elements}
                    highlightedIndices={highlightedIndices}
                    elementWidth={70}
                    elementHeight={70}
                    gap={12}
                    className="mb-8"
                  />

                  {/* Comparison Highlight Overlay */}
                  {highlightedIndices.length > 0 && (
                    <ComparisonHighlight
                      indices={highlightedIndices}
                      elementWidth={70}
                      elementGap={12}
                      containerWidth={800}
                      type={getHighlightType()}
                      label={currentOperation}
                    />
                  )}
                </>
              )}
            </div>

            {/* Current Operation Display - Enhanced */}
            <div className="mt-8 p-6 bg-gradient-to-r from-accent/10 to-primary/10 rounded-curvy border border-primary/20 min-h-[80px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-text-primary text-base font-medium leading-relaxed">
                  {currentOperation || 'Ready to start sorting...'}
                </p>
                {currentOperation && (
                  <div className="mt-2 text-xs text-text-muted">
                    Step {state.currentStep} of {state.totalSteps}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Animation Control Panel */}
          <AnimationControlPanel
            state={state}
            controls={controls}
            showStepControls={true}
            showSpeedControl={true}
            showProgressBar={true}
            showStatusIndicator={true}
            showAdvancedControls={true}
            onInfoClick={() => setShowAlgorithmInfo(!showAlgorithmInfo)}
            onSettingsClick={() => {
              // Future: Open advanced settings modal
              console.log('Advanced settings clicked');
            }}
          />

          {/* Metrics Display - Enhanced */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-bg-card rounded-curvy p-4 shadow-curvy text-center hover-lift">
              <div className="text-2xl font-bold text-primary">{metrics.comparisons}</div>
              <div className="text-sm text-text-muted">Comparisons</div>
              <div className="w-full bg-accent/20 rounded-curvy h-1 mt-2">
                <div className="h-full bg-primary rounded-curvy" style={{ width: '60%' }} />
              </div>
            </div>
            <div className="bg-bg-card rounded-curvy p-4 shadow-curvy text-center hover-lift">
              <div className="text-2xl font-bold text-swap">{metrics.swaps}</div>
              <div className="text-sm text-text-muted">Swaps</div>
              <div className="w-full bg-accent/20 rounded-curvy h-1 mt-2">
                <div className="h-full bg-swap rounded-curvy" style={{ width: '40%' }} />
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
              algorithm={algorithm}
              currentStep={state.currentStep}
              totalSteps={state.totalSteps}
              currentOperation={currentOperation}
            />
          </div>
        )}
      </div>

      {/* Algorithm Information Panel */}
      {showAlgorithmInfo && (
        <div className="bg-bg-card rounded-curvy p-6 shadow-curvy border border-primary/20 animate-slide-up">
          <h4 className="text-lg font-semibold text-primary mb-4">Algorithm Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-medium text-text-primary mb-2">Time Complexity</h5>
              <ul className="space-y-1 text-text-muted">
                <li>Best: O(n) - O(n²)</li>
                <li>Average: O(n log n) - O(n²)</li>
                <li>Worst: O(n log n) - O(n²)</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-text-primary mb-2">Properties</h5>
              <ul className="space-y-1 text-text-muted">
                <li>Space: O(1) - O(n)</li>
                <li>Stable: Varies by algorithm</li>
                <li>In-place: Varies by algorithm</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}