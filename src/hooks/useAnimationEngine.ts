import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimationState, AnimationStep } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// The previous implementation had a stale-closure bug:
//   animationLoop was memoized with useCallback and closed over
//   state.isPlaying / state.currentStep from useState. Because the callback
//   was recreated every time those values changed, the RAF was constantly
//   cancelled and restarted — causing all steps to fire in the same frame.
//
// Fix: ALL mutable animation state lives in refs. The tick function has an
//   empty dependency array and reads exclusively from refs (never stale).
//   React state is updated once per tick, purely for triggering UI re-renders.
// ─────────────────────────────────────────────────────────────────────────────

interface UseAnimationEngineProps {
  steps: AnimationStep[];
  initialSpeed?: number;
  onStepChange?: (stepIndex: number, stepData: AnimationStep) => void;
  onComplete?: () => void;
  /** Called before replaying all steps during backward navigation.
   *  If provided, backward step will reset to initial state and replay
   *  steps 0..target for correct array reconstruction. */
  onReset?: () => void;
}

export const useAnimationEngine = ({
  steps,
  initialSpeed = 1.0,
  onStepChange,
  onComplete,
  onReset,
}: UseAnimationEngineProps) => {

  // ── Mutable refs — read by RAF, never stale ──────────────────────────────
  const isPlayingRef    = useRef(false);
  const currentStepRef  = useRef(0);
  const speedRef        = useRef(initialSpeed);
  const rafRef          = useRef<number | null>(null);
  const lastTickTimeRef = useRef(0);

  // Keep callback refs current without triggering re-creates of tick
  const stepsRef        = useRef(steps);
  const onStepChangeRef = useRef(onStepChange);
  const onCompleteRef   = useRef(onComplete);
  const onResetRef      = useRef(onReset);

  useEffect(() => { stepsRef.current = steps; },               [steps]);
  useEffect(() => { onStepChangeRef.current = onStepChange; }, [onStepChange]);
  useEffect(() => { onCompleteRef.current = onComplete; },     [onComplete]);
  useEffect(() => { onResetRef.current = onReset; },           [onReset]);

  // ── React state — used only for rendering ────────────────────────────────
  const [uiState, setUiState] = useState<AnimationState>({
    isPlaying:   false,
    isPaused:    false,
    speed:       initialSpeed,
    currentStep: 0,
    totalSteps:  steps.length,
  });

  // Keep totalSteps in sync if steps array changes (e.g. algorithm switch)
  useEffect(() => {
    setUiState(prev => ({ ...prev, totalSteps: steps.length, currentStep: 0 }));
    currentStepRef.current = 0;
    isPlayingRef.current   = false;
    cancelRaf();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps.length]);

  // ── RAF helpers ──────────────────────────────────────────────────────────
  function cancelRaf() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }

  // ── Core tick — EMPTY dep array: reads only refs, never stale ────────────
  const tick = useCallback((timestamp: number) => {
    if (!isPlayingRef.current) return;

    const currentSteps = stepsRef.current;
    const step         = currentStepRef.current;

    if (step >= currentSteps.length) {
      // Reached the end
      isPlayingRef.current = false;
      setUiState(prev => ({ ...prev, isPlaying: false, isPaused: false }));
      onCompleteRef.current?.();
      return;
    }

    // Minimum duration = 400ms so CSS transitions (250ms) complete before next step
    const duration = Math.max(400, 1000 / speedRef.current);

    if (timestamp - lastTickTimeRef.current >= duration) {
      // Fire callback with current step
      onStepChangeRef.current?.(step, currentSteps[step]);

      const next = step + 1;
      currentStepRef.current  = next;
      lastTickTimeRef.current = timestamp;

      // Update UI state (single setState per tick)
      setUiState(prev => ({ ...prev, currentStep: next }));

      if (next >= currentSteps.length) {
        isPlayingRef.current = false;
        setUiState(prev => ({ ...prev, isPlaying: false, isPaused: false }));
        onCompleteRef.current?.();
        return;
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []); // ← intentionally empty — all reads are via refs

  // ── Controls ─────────────────────────────────────────────────────────────

  const play = useCallback(() => {
    if (currentStepRef.current >= stepsRef.current.length) return; // already done
    isPlayingRef.current  = true;
    lastTickTimeRef.current = performance.now() - 1000; // fire first step immediately
    setUiState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
    cancelRaf();
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const pause = useCallback(() => {
    isPlayingRef.current = false;
    cancelRaf();
    setUiState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
  }, []);

  const reset = useCallback(() => {
    isPlayingRef.current   = false;
    currentStepRef.current = 0;
    cancelRaf();
    onResetRef.current?.();
    setUiState(prev => ({
      ...prev,
      isPlaying:   false,
      isPaused:    false,
      currentStep: 0,
    }));
  }, []);

  const stepForward = useCallback(() => {
    const step = currentStepRef.current;
    const currentSteps = stepsRef.current;
    if (step >= currentSteps.length) return;

    isPlayingRef.current = false;
    cancelRaf();

    onStepChangeRef.current?.(step, currentSteps[step]);
    const next = step + 1;
    currentStepRef.current = next;
    setUiState(prev => ({ ...prev, isPlaying: false, isPaused: true, currentStep: next }));

    if (next >= currentSteps.length) {
      setUiState(prev => ({ ...prev, isPaused: false }));
      onCompleteRef.current?.();
    }
  }, []);

  const stepBackward = useCallback(() => {
    const step = currentStepRef.current;
    if (step === 0) return;

    isPlayingRef.current = false;
    cancelRaf();

    const target = step - 1;
    currentStepRef.current = target;

    if (onResetRef.current) {
      // Replay from step 0 → target so the visualizer can reconstruct correct state.
      // React 18 batches all synchronous setState calls — only one re-render occurs.
      onResetRef.current();
      const currentSteps = stepsRef.current;
      for (let i = 0; i <= target; i++) {
        onStepChangeRef.current?.(i, currentSteps[i]);
      }
    } else {
      // Fallback for components that don't provide onReset (best-effort)
      const currentSteps = stepsRef.current;
      onStepChangeRef.current?.(target, currentSteps[target]);
    }

    setUiState(prev => ({ ...prev, isPlaying: false, isPaused: true, currentStep: target }));
  }, []);

  const skipToEnd = useCallback(() => {
    isPlayingRef.current   = false;
    cancelRaf();
    const end = stepsRef.current.length;
    currentStepRef.current = end;
    setUiState(prev => ({ ...prev, isPlaying: false, isPaused: false, currentStep: end }));
    onCompleteRef.current?.();
  }, []);

  const skipToBeginning = useCallback(() => {
    isPlayingRef.current   = false;
    cancelRaf();
    currentStepRef.current = 0;
    onResetRef.current?.();
    setUiState(prev => ({ ...prev, isPlaying: false, isPaused: false, currentStep: 0 }));
  }, []);

  const setSpeed = useCallback((speed: number) => {
    const clamped = Math.max(0.25, Math.min(4.0, speed));
    speedRef.current = clamped;
    setUiState(prev => ({ ...prev, speed: clamped }));
  }, []);

  const goToStep = useCallback((targetStep: number) => {
    const clamped = Math.max(0, Math.min(targetStep, stepsRef.current.length));
    isPlayingRef.current   = false;
    cancelRaf();
    currentStepRef.current = clamped;

    if (onResetRef.current) {
      onResetRef.current();
      const currentSteps = stepsRef.current;
      for (let i = 0; i <= clamped - 1; i++) {
        onStepChangeRef.current?.(i, currentSteps[i]);
      }
    }

    setUiState(prev => ({ ...prev, isPlaying: false, isPaused: true, currentStep: clamped }));
  }, []);

  // Cleanup on unmount
  useEffect(() => () => cancelRaf(), []);

  const controls = { play, pause, reset, stepForward, stepBackward, skipToEnd, skipToBeginning, setSpeed, goToStep };

  return {
    state: uiState,
    controls,
    currentStepData: stepsRef.current[uiState.currentStep] ?? null,
  };
};
