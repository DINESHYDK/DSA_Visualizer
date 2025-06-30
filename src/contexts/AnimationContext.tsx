import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AnimationState, AnimationControls } from '../types';

interface AnimationContextType {
  state: AnimationState;
  controls: AnimationControls;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

type AnimationAction = 
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'STEP_FORWARD' }
  | { type: 'STEP_BACKWARD' }
  | { type: 'SKIP_TO_END' }
  | { type: 'SKIP_TO_BEGINNING' }
  | { type: 'SET_SPEED'; payload: number }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'SET_TOTAL_STEPS'; payload: number }
  | { type: 'UPDATE_STATE'; payload: Partial<AnimationState> };

const initialState: AnimationState = {
  isPlaying: false,
  isPaused: false,
  speed: 1.0,
  currentStep: 0,
  totalSteps: 0,
};

const animationReducer = (state: AnimationState, action: AnimationAction): AnimationState => {
  switch (action.type) {
    case 'PLAY':
      return {
        ...state,
        isPlaying: true,
        isPaused: false,
      };
    
    case 'PAUSE':
      return {
        ...state,
        isPlaying: false,
        isPaused: true,
      };
    
    case 'RESET':
      return {
        ...state,
        isPlaying: false,
        isPaused: false,
        currentStep: 0,
      };
    
    case 'STEP_FORWARD':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.totalSteps),
        isPlaying: false,
        isPaused: true,
      };
    
    case 'STEP_BACKWARD':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0),
        isPlaying: false,
        isPaused: true,
      };
    
    case 'SKIP_TO_END':
      return {
        ...state,
        currentStep: state.totalSteps,
        isPlaying: false,
        isPaused: false,
      };
    
    case 'SKIP_TO_BEGINNING':
      return {
        ...state,
        currentStep: 0,
        isPlaying: false,
        isPaused: false,
      };
    
    case 'SET_SPEED':
      return {
        ...state,
        speed: Math.max(0.1, Math.min(3.0, action.payload)),
      };
    
    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: Math.max(0, Math.min(action.payload, state.totalSteps)),
      };
    
    case 'SET_TOTAL_STEPS':
      return {
        ...state,
        totalSteps: Math.max(0, action.payload),
      };
    
    case 'UPDATE_STATE':
      return {
        ...state,
        ...action.payload,
      };
    
    default:
      return state;
  }
};

interface AnimationProviderProps {
  children: ReactNode;
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(animationReducer, initialState);

  const controls: AnimationControls = {
    play: () => dispatch({ type: 'PLAY' }),
    pause: () => dispatch({ type: 'PAUSE' }),
    reset: () => dispatch({ type: 'RESET' }),
    stepForward: () => dispatch({ type: 'STEP_FORWARD' }),
    stepBackward: () => dispatch({ type: 'STEP_BACKWARD' }),
    skipToEnd: () => dispatch({ type: 'SKIP_TO_END' }),
    skipToBeginning: () => dispatch({ type: 'SKIP_TO_BEGINNING' }),
    setSpeed: (speed: number) => dispatch({ type: 'SET_SPEED', payload: speed }),
  };

  const contextValue: AnimationContextType = {
    state,
    controls,
  };

  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = (): AnimationContextType => {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};