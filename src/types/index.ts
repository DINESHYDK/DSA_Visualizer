// Animation Types
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
}

// Data Structure Types
export interface ArrayElement {
  value: number;
  id: string;
  state: ElementState;
  index: number;
}

export type ElementState = 
  | 'default'
  | 'comparing'
  | 'swapping'
  | 'sorted'
  | 'current'
  | 'pivot'
  | 'minimum'
  | 'maximum';

export interface SortingStep {
  type: 'compare' | 'swap' | 'set' | 'highlight';
  indices: number[];
  values?: number[];
  description: string;
}

// Algorithm Types
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

export interface AlgorithmMetrics {
  comparisons: number;
  swaps: number;
  arrayAccesses: number;
  timeElapsed: number;
}

// Tree Node Types
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

export type NodeState = 
  | 'default'
  | 'current'
  | 'visited'
  | 'comparing'
  | 'found'
  | 'inserting'
  | 'deleting';

// Graph Types
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

export type EdgeState = 
  | 'default'
  | 'active'
  | 'visited'
  | 'shortest-path';

// Component Props Types
export interface VisualizationProps {
  data: any[];
  animationState: AnimationState;
  onAnimationUpdate: (state: Partial<AnimationState>) => void;
}

export interface ControlPanelProps {
  animationState: AnimationState;
  controls: AnimationControls;
  metrics?: AlgorithmMetrics;
  algorithmInfo?: AlgorithmInfo;
}

// Input Types
export interface CustomInputConfig {
  arraySize: number;
  minValue: number;
  maxValue: number;
  preset: 'random' | 'sorted' | 'reverse' | 'nearly-sorted' | 'custom';
  customValues?: number[];
}

// Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  success: string;
  warning: string;
  error: string;
}

// Animation Engine Types
export interface AnimationStep {
  id: string;
  type: 'compare' | 'swap' | 'set' | 'highlight' | 'mark';
  indices: number[];
  values?: number[];
  description: string;
  duration?: number;
}

export interface AnimationEngine {
  state: AnimationState;
  controls: AnimationControls;
  currentStepData: AnimationStep | null;
}

// Visual Element Types
export interface VisualElement {
  id: string;
  type: 'array-element' | 'tree-node' | 'graph-node' | 'graph-edge';
  position: { x: number; y: number };
  size: { width: number; height: number };
  state: ElementState | NodeState | EdgeState;
  data: any;
}

// Transition Types
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