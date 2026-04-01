// ============================================================
// Animation Types
// ============================================================
export interface AnimationState {
  isPlaying: boolean;
  isPaused: boolean;
  speed: number;
  currentStep: number;
  totalSteps: number;
}

export interface AnimationControls {
  play: () => void;
  pause: () => void;
  reset: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  skipToEnd: () => void;
  skipToBeginning: () => void;
  setSpeed: (speed: number) => void;
  goToStep?: (step: number) => void;
}

// ============================================================
// Array / Sorting Types
// ============================================================
export type ElementState =
  | 'default'
  | 'comparing'
  | 'swapping'
  | 'sorted'
  | 'current'
  | 'pivot'
  | 'minimum'
  | 'maximum'
  | 'found';

export interface ArrayElement {
  value: number;
  id: string;
  state: ElementState;
  index: number;
}

// Single canonical step type used by both sorting algorithms and the animation engine
export interface AnimationStep {
  id: string;
  type: 'compare' | 'swap' | 'set' | 'highlight' | 'mark';
  indices: number[];
  values?: number[];
  description: string;
  duration?: number;
}

// Alias used by sorting algorithm files (they don't carry id/duration)
export type SortingStep = Omit<AnimationStep, 'id' | 'duration'>;

export interface AlgorithmMetrics {
  comparisons: number;
  swaps: number;
  arrayAccesses: number;
  timeElapsed: number;
}

// ============================================================
// Algorithm Info
// ============================================================
export interface AlgorithmInfo {
  name: string;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  stable: boolean;
  inPlace: boolean;
}

// ============================================================
// Tree Types
// ============================================================
export type NodeState =
  | 'default'
  | 'current'
  | 'visited'
  | 'comparing'
  | 'found'
  | 'inserting'
  | 'deleting';

export interface TreeNode {
  id: string;
  value: number;
  left?: TreeNode;
  right?: TreeNode;
  parent?: TreeNode;
  x?: number;
  y?: number;
  state: NodeState;
}

// ============================================================
// Graph Types
// ============================================================
export type EdgeState = 'default' | 'active' | 'visited' | 'shortest-path';

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  state: NodeState;
  distance?: number;
  previous?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight?: number;
  state: EdgeState;
}

// ============================================================
// Component Props
// ============================================================
export interface ControlPanelProps {
  animationState: AnimationState;
  controls: AnimationControls;
  metrics?: AlgorithmMetrics;
  algorithmInfo?: AlgorithmInfo;
}

// ============================================================
// Input Types
// ============================================================
export interface CustomInputConfig {
  arraySize: number;
  minValue: number;
  maxValue: number;
  preset: 'random' | 'sorted' | 'reverse' | 'nearly-sorted' | 'custom';
  customValues?: number[];
}

// ============================================================
// Animation Engine
// ============================================================
export interface AnimationEngine {
  state: AnimationState;
  controls: AnimationControls;
  currentStepData: AnimationStep | null;
}

// ============================================================
// Visual Element Types
// ============================================================
export interface VisualElement {
  id: string;
  type: 'array-element' | 'tree-node' | 'graph-node' | 'graph-edge';
  position: { x: number; y: number };
  size: { width: number; height: number };
  state: ElementState | NodeState | EdgeState;
  data: Record<string, unknown>;
}

// ============================================================
// Transition Types
// ============================================================
export interface TransitionConfig {
  duration: number;
  easing: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  delay?: number;
}

export interface SwapTransition extends TransitionConfig {
  type: 'swap';
  fromIndex: number;
  toIndex: number;
}

export interface HighlightTransition extends TransitionConfig {
  type: 'highlight';
  indices: number[];
  color?: string;
}

export interface ComparisonTransition extends TransitionConfig {
  type: 'comparison';
  indices: number[];
  result?: 'greater' | 'less' | 'equal';
}
