import React, { useReducer, useEffect } from 'react';
import { useAnimationEngine } from '../../hooks/useAnimationEngine';
import ArrayVisualization from '../animation/ArrayVisualization';
import TreeVisualization from '../animation/TreeVisualization';
import AnimationControlPanel from '../animation/AnimationControlPanel';
import CodeDisplay from './CodeDisplay';
import ComparisonHighlight from '../animation/ComparisonHighlight';
import { ArrayElement, SortingStep, AlgorithmMetrics } from '../../types';
import { generateRandomArray } from '../../utils';

// ── Types ──────────────────────────────────────────────────────────────────────
interface SortingVisualizationProps {
  algorithm: 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick' | 'heap';
  initialArray?: number[];
  onComplete?: () => void;
}

interface VizState {
  elements: ArrayElement[];
  steps: SortingStep[];
  metrics: AlgorithmMetrics;
  highlightedIndices: number[];
  currentOperation: string;
  startTime: number;
  showAlgorithmInfo: boolean;
  showCodeDisplay: boolean;
}

type VizAction =
  | { type: 'INIT'; elements: ArrayElement[]; steps: SortingStep[]; metrics: AlgorithmMetrics }
  | { type: 'APPLY_STEP'; stepIndex: number; now: number }
  | { type: 'COMPLETE' }
  | { type: 'TOGGLE_CODE' }
  | { type: 'TOGGLE_INFO' };

const initialVizState: VizState = {
  elements: [],
  steps: [],
  metrics: { comparisons: 0, swaps: 0, arrayAccesses: 0, timeElapsed: 0 },
  highlightedIndices: [],
  currentOperation: '',
  startTime: 0,
  showAlgorithmInfo: false,
  showCodeDisplay: true,
};

function vizReducer(state: VizState, action: VizAction): VizState {
  switch (action.type) {
    case 'INIT':
      return {
        ...initialVizState,
        elements: action.elements,
        steps: action.steps,
        metrics: { ...action.metrics, timeElapsed: 0 },
        startTime: Date.now(),
        showCodeDisplay: state.showCodeDisplay,
      };

    case 'APPLY_STEP': {
      const { stepIndex, now } = action;
      if (stepIndex >= state.steps.length) return state;
      const step = state.steps[stepIndex];

      const elements = state.elements.map((el, idx) => {
        let newState = el.state;
        if (newState === 'comparing' || newState === 'swapping') newState = 'default';

        if (step.indices.includes(idx)) {
          switch (step.type) {
            case 'compare':   newState = 'comparing'; break;
            case 'swap':      newState = 'swapping';  break;
            case 'set':       newState = 'sorted';    break;
            case 'highlight': newState = stepIndex === state.steps.length - 1 ? 'sorted' : 'current'; break;
          }
        }

        const newValue = step.values ? step.values[idx] : el.value;
        return { ...el, value: newValue, state: newState };
      });

      return {
        ...state,
        elements,
        highlightedIndices: step.indices,
        currentOperation: step.description,
        metrics: { ...state.metrics, timeElapsed: now - state.startTime },
      };
    }

    case 'COMPLETE':
      return {
        ...state,
        currentOperation: 'Sorting completed!',
        highlightedIndices: [],
        elements: state.elements.map((el) => ({ ...el, state: 'sorted' })),
      };

    case 'TOGGLE_CODE':
      return { ...state, showCodeDisplay: !state.showCodeDisplay };

    case 'TOGGLE_INFO':
      return { ...state, showAlgorithmInfo: !state.showAlgorithmInfo };

    default:
      return state;
  }
}

// ── Algorithm meta ─────────────────────────────────────────────────────────────
const ALGO_META: Record<string, { name: string; description: string }> = {
  bubble:    { name: 'Bubble Sort',    description: 'Compares adjacent elements and swaps them if they are in the wrong order.' },
  selection: { name: 'Selection Sort', description: 'Finds the minimum element and places it at the start of the unsorted portion.' },
  insertion: { name: 'Insertion Sort', description: 'Builds the sorted array one element at a time by inserting each into its correct position.' },
  merge:     { name: 'Merge Sort',     description: 'Divides the array in half, sorts each half, then merges them back together.' },
  quick:     { name: 'Quick Sort',     description: 'Selects a pivot, partitions the array around it, then recursively sorts partitions.' },
  heap:      { name: 'Heap Sort',      description: 'Uses a binary heap to repeatedly extract the maximum element.' },
};

// ── Component ──────────────────────────────────────────────────────────────────
export default function SortingVisualization({
  algorithm,
  initialArray,
  onComplete,
}: SortingVisualizationProps) {
  const [viz, dispatch] = useReducer(vizReducer, initialVizState);

  // Load algorithm dynamically on mount / algorithm change
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const array = initialArray || generateRandomArray(8, 10, 99);
      let sortResult: { steps: SortingStep[]; metrics: AlgorithmMetrics };
      let createElements: (arr: number[]) => ArrayElement[];

      switch (algorithm) {
        case 'bubble': {
          const m = await import('../../algorithms/sorting/bubbleSort');
          sortResult = m.bubbleSort(array);
          createElements = m.createBubbleSortElements;
          break;
        }
        case 'selection': {
          const m = await import('../../algorithms/sorting/selectionSort');
          sortResult = m.selectionSort(array);
          createElements = m.createSelectionSortElements;
          break;
        }
        case 'insertion': {
          const m = await import('../../algorithms/sorting/insertionSort');
          sortResult = m.insertionSort(array);
          createElements = m.createInsertionSortElements;
          break;
        }
        case 'merge': {
          const m = await import('../../algorithms/sorting/mergeSort');
          sortResult = m.mergeSort(array);
          createElements = m.createMergeSortElements;
          break;
        }
        case 'quick': {
          const m = await import('../../algorithms/sorting/quickSort');
          sortResult = m.quickSort(array);
          createElements = m.createQuickSortElements;
          break;
        }
        case 'heap': {
          const m = await import('../../algorithms/sorting/heapSort');
          sortResult = m.heapSort(array);
          createElements = m.createHeapSortElements;
          break;
        }
        default:
          throw new Error(`Unknown algorithm: ${algorithm}`);
      }

      if (!cancelled) {
        dispatch({
          type: 'INIT',
          elements: createElements(array),
          steps: sortResult.steps,
          metrics: sortResult.metrics,
        });
      }
    };

    load();
    return () => { cancelled = true; };
  }, [algorithm, initialArray]);

  // Animation engine — reads from viz.steps once they're loaded
  const { state, controls, currentStepData } = useAnimationEngine({
    steps: viz.steps.map((step, index) => ({
      id: `step-${index}`,
      ...step,
    })),
    onStepChange: (stepIndex: number) => {
      dispatch({ type: 'APPLY_STEP', stepIndex, now: Date.now() });
    },
    onComplete: () => {
      dispatch({ type: 'COMPLETE' });
      onComplete?.();
    },
  });

  const getHighlightType = (): 'comparison' | 'swap' | 'highlight' => {
    if (!currentStepData) return 'highlight';
    if (currentStepData.type === 'compare') return 'comparison';
    if (currentStepData.type === 'swap') return 'swap';
    return 'highlight';
  };

  const meta = ALGO_META[algorithm] ?? { name: 'Sorting Algorithm', description: '' };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Space':       e.preventDefault(); state.isPlaying ? controls.pause() : controls.play(); break;
        case 'ArrowLeft':   e.preventDefault(); controls.stepBackward(); break;
        case 'ArrowRight':  e.preventDefault(); controls.stepForward(); break;
        case 'KeyR':        e.preventDefault(); controls.reset(); break;
        case 'KeyC':        e.preventDefault(); dispatch({ type: 'TOGGLE_CODE' }); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [state.isPlaying, controls]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-bg-card border border-border rounded-lg p-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-text-primary">{meta.name}</h3>
          <p className="text-sm text-text-muted mt-0.5">{meta.description}</p>
        </div>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_CODE' })}
          className="btn-secondary px-3 py-1.5 text-sm"
        >
          {viz.showCodeDisplay ? 'Hide Code' : 'Show Code'}
        </button>
      </div>

      {/* Main grid */}
      <div className={`grid gap-4 ${viz.showCodeDisplay ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
        {/* Visualization column */}
        <div className="space-y-4">
          <div className="bg-bg-card border border-border rounded-lg p-6">
            <div className="relative">
              {algorithm === 'heap' ? (
                <TreeVisualization
                  elements={viz.elements}
                  highlightedIndices={viz.highlightedIndices}
                  width={800}
                  height={400}
                  className="mb-6"
                />
              ) : (
                <>
                  <ArrayVisualization
                    elements={viz.elements}
                    highlightedIndices={viz.highlightedIndices}
                    elementWidth={70}
                    elementHeight={70}
                    gap={12}
                    className="mb-6"
                  />
                  {viz.highlightedIndices.length > 0 && (
                    <ComparisonHighlight
                      indices={viz.highlightedIndices}
                      elementWidth={70}
                      elementGap={12}
                      containerWidth={800}
                      type={getHighlightType()}
                      label={viz.currentOperation}
                    />
                  )}
                </>
              )}
            </div>

            {/* Step description */}
            <div className="mt-6 px-4 py-3 bg-bg-secondary border border-border rounded-lg min-h-[56px] flex items-center">
              <p className="text-sm text-text-primary">
                {viz.currentOperation || 'Ready to start — press Play or use arrow keys to step.'}
              </p>
              {viz.currentOperation && (
                <span className="ml-auto text-xs text-text-muted whitespace-nowrap pl-4">
                  {state.currentStep}/{state.totalSteps}
                </span>
              )}
            </div>
          </div>

          {/* Controls */}
          <AnimationControlPanel
            state={state}
            controls={controls}
            showStepControls
            showSpeedControl
            showProgressBar
            showStatusIndicator
            showAdvancedControls
            onInfoClick={() => dispatch({ type: 'TOGGLE_INFO' })}
            onSettingsClick={() => {}}
          />

          {/* Metrics */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Comparisons',    value: viz.metrics.comparisons,    color: 'text-comparison' },
              { label: 'Swaps',          value: viz.metrics.swaps,          color: 'text-swap' },
              { label: 'Array Accesses', value: viz.metrics.arrayAccesses,  color: 'text-info' },
              { label: 'Time',           value: `${(viz.metrics.timeElapsed / 1000).toFixed(1)}s`, color: 'text-success' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-bg-card border border-border rounded-lg p-3 text-center">
                <div className={`text-xl font-bold font-mono ${color}`}>{value}</div>
                <div className="text-xs text-text-muted mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Code column */}
        {viz.showCodeDisplay && (
          <CodeDisplay
            algorithm={algorithm}
            currentStep={state.currentStep}
            totalSteps={state.totalSteps}
            currentOperation={viz.currentOperation}
          />
        )}
      </div>

      {/* Algorithm info panel */}
      {viz.showAlgorithmInfo && (
        <div className="bg-bg-card border border-border rounded-lg p-6 animate-slide-up">
          <h4 className="font-semibold text-text-primary mb-4">Algorithm Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-medium text-text-primary mb-2">Time Complexity</h5>
              <ul className="space-y-1 text-text-muted">
                <li>Best: O(n) – O(n²)</li>
                <li>Average: O(n log n) – O(n²)</li>
                <li>Worst: O(n log n) – O(n²)</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-text-primary mb-2">Properties</h5>
              <ul className="space-y-1 text-text-muted">
                <li>Space: O(1) – O(n)</li>
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
