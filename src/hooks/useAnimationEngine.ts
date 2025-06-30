import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimationState } from '../types';

interface AnimationStep {
  id: string;
  type: 'compare' | 'swap' | 'set' | 'highlight' | 'mark';
  indices: number[];
  values?: number[];
  description: string;
  duration?: number;
}

interface UseAnimationEngineProps {
  steps: AnimationStep[];
  initialSpeed?: number;
  onStepChange?: (step: number, stepData: AnimationStep) => void;
  onComplete?: () => void;
}

export const useAnimationEngine = ({
  steps,
  initialSpeed = 1.0,
  onStepChange,
  onComplete
}: UseAnimationEngineProps) => {
  const [state, setState] = useState<AnimationState>({
    isPlaying: false,
    isPaused: false,
    speed: initialSpeed,
    currentStep: 0,
    totalSteps: steps.length,
  });

  const animationRef = useRef<number | null>(null);
  const lastStepTimeRef = useRef<number>(0);
  const stepDurationRef = useRef<number>(1000); // Base duration in ms

  // Calculate step duration based on speed
  const calculateStepDuration = useCallback((speed: number): number => {
    const baseDuration = 1000; // 1 second base
    return Math.max(100, baseDuration / speed); // Min 100ms, max based on speed
  }, []);

  // Update step duration when speed changes
  useEffect(() => {
    stepDurationRef.current = calculateStepDuration(state.speed);
  }, [state.speed, calculateStepDuration]);

  // Animation loop using requestAnimationFrame
  const animationLoop = useCallback((timestamp: number) => {
    if (!state.isPlaying || state.currentStep >= steps.length) {
      return;
    }

    if (timestamp - lastStepTimeRef.current >= stepDurationRef.current) {
      const nextStep = state.currentStep + 1;
      
      setState(prev => ({
        ...prev,
        currentStep: nextStep
      }));

      // Notify about step change
      if (onStepChange && steps[state.currentStep]) {
        onStepChange(state.currentStep, steps[state.currentStep]);
      }

      // Check if animation is complete
      if (nextStep >= steps.length) {
        setState(prev => ({
          ...prev,
          isPlaying: false,
          isPaused: false
        }));
        
        if (onComplete) {
          onComplete();
        }
        return;
      }

      lastStepTimeRef.current = timestamp;
    }

    animationRef.current = requestAnimationFrame(animationLoop);
  }, [state.isPlaying, state.currentStep, steps, onStepChange, onComplete]);

  // Start animation loop
  useEffect(() => {
    if (state.isPlaying) {
      lastStepTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(animationLoop);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state.isPlaying, animationLoop]);

  // Control functions
  const controls = {
    play: useCallback(() => {
      setState(prev => ({
        ...prev,
        isPlaying: true,
        isPaused: false
      }));
    }, []),

    pause: useCallback(() => {
      setState(prev => ({
        ...prev,
        isPlaying: false,
        isPaused: true
      }));
    }, []),

    reset: useCallback(() => {
      setState(prev => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        currentStep: 0
      }));
    }, []),

    stepForward: useCallback(() => {
      setState(prev => {
        const nextStep = Math.min(prev.currentStep + 1, steps.length);
        
        // Notify about step change
        if (onStepChange && steps[prev.currentStep]) {
          onStepChange(prev.currentStep, steps[prev.currentStep]);
        }

        return {
          ...prev,
          currentStep: nextStep,
          isPlaying: false,
          isPaused: true
        };
      });
    }, [steps, onStepChange]),

    stepBackward: useCallback(() => {
      setState(prev => ({
        ...prev,
        currentStep: Math.max(prev.currentStep - 1, 0),
        isPlaying: false,
        isPaused: true
      }));
    }, []),

    skipToEnd: useCallback(() => {
      setState(prev => ({
        ...prev,
        currentStep: steps.length,
        isPlaying: false,
        isPaused: false
      }));
      
      if (onComplete) {
        onComplete();
      }
    }, [steps.length, onComplete]),

    skipToBeginning: useCallback(() => {
      setState(prev => ({
        ...prev,
        currentStep: 0,
        isPlaying: false,
        isPaused: false
      }));
    }, []),

    setSpeed: useCallback((speed: number) => {
      const clampedSpeed = Math.max(0.1, Math.min(3.0, speed));
      setState(prev => ({
        ...prev,
        speed: clampedSpeed
      }));
    }, []),

    goToStep: useCallback((step: number) => {
      const clampedStep = Math.max(0, Math.min(step, steps.length));
      setState(prev => ({
        ...prev,
        currentStep: clampedStep,
        isPlaying: false,
        isPaused: true
      }));
    }, [steps.length])
  };

  return {
    state,
    controls,
    currentStepData: steps[state.currentStep] || null
  };
};