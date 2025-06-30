import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipBack, 
  SkipForward, 
  FastForward,
  Rewind
} from 'lucide-react';
import { AnimationState, AnimationControls as AnimationControlsType } from '../../types';

interface AnimationControlsProps {
  state: AnimationState;
  controls: AnimationControlsType;
  disabled?: boolean;
  showStepControls?: boolean;
  showSpeedControl?: boolean;
  className?: string;
}

const AnimationControls: React.FC<AnimationControlsProps> = ({
  state,
  controls,
  disabled = false,
  showStepControls = true,
  showSpeedControl = true,
  className = ''
}) => {
  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const speed = parseFloat(event.target.value);
    controls.setSpeed(speed);
  };

  const getPlayPauseIcon = () => {
    if (state.isPlaying) {
      return <Pause className="h-5 w-5" />;
    }
    return <Play className="h-5 w-5" />;
  };

  const getPlayPauseAction = () => {
    if (state.isPlaying) {
      return controls.pause;
    }
    return controls.play;
  };

  return (
    <div className={`bg-bg-card rounded-curvy p-4 shadow-curvy ${className}`}>
      <div className="flex flex-col space-y-4">
        {/* Main Controls */}
        <div className="flex items-center justify-center space-x-2">
          {/* Skip to Beginning */}
          <button
            onClick={controls.skipToBeginning}
            disabled={disabled || state.currentStep === 0}
            className="p-2 rounded-curvy bg-accent hover:bg-primary hover:text-secondary 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 text-text-primary"
            title="Skip to Beginning"
          >
            <Rewind className="h-4 w-4" />
          </button>

          {/* Step Backward */}
          {showStepControls && (
            <button
              onClick={controls.stepBackward}
              disabled={disabled || state.currentStep === 0}
              className="p-2 rounded-curvy bg-accent hover:bg-primary hover:text-secondary 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 text-text-primary"
              title="Step Backward"
            >
              <SkipBack className="h-4 w-4" />
            </button>
          )}

          {/* Play/Pause */}
          <button
            onClick={getPlayPauseAction()}
            disabled={disabled}
            className="p-3 rounded-curvy bg-primary hover:bg-hover text-secondary 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 shadow-glow hover:shadow-glow-hover"
            title={state.isPlaying ? 'Pause' : 'Play'}
          >
            {getPlayPauseIcon()}
          </button>

          {/* Step Forward */}
          {showStepControls && (
            <button
              onClick={controls.stepForward}
              disabled={disabled || state.currentStep >= state.totalSteps}
              className="p-2 rounded-curvy bg-accent hover:bg-primary hover:text-secondary 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 text-text-primary"
              title="Step Forward"
            >
              <SkipForward className="h-4 w-4" />
            </button>
          )}

          {/* Skip to End */}
          <button
            onClick={controls.skipToEnd}
            disabled={disabled || state.currentStep >= state.totalSteps}
            className="p-2 rounded-curvy bg-accent hover:bg-primary hover:text-secondary 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 text-text-primary"
            title="Skip to End"
          >
            <FastForward className="h-4 w-4" />
          </button>

          {/* Reset */}
          <button
            onClick={controls.reset}
            disabled={disabled}
            className="p-2 rounded-curvy bg-error hover:bg-error/80 text-white 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
            title="Reset"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-text-muted">
            <span>Step {state.currentStep}</span>
            <span>of {state.totalSteps}</span>
          </div>
          <div className="w-full bg-accent rounded-curvy h-2 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{
                width: `${state.totalSteps > 0 ? (state.currentStep / state.totalSteps) * 100 : 0}%`
              }}
            />
          </div>
        </div>

        {/* Speed Control */}
        {showSpeedControl && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm text-text-secondary font-medium">
                Speed: {state.speed.toFixed(1)}x
              </label>
              <div className="text-xs text-text-muted">
                {state.speed < 1 ? 'Slower' : state.speed > 1 ? 'Faster' : 'Normal'}
              </div>
            </div>
            
            {/* Custom styled range input */}
            <div className="relative">
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={state.speed}
                onChange={handleSpeedChange}
                disabled={disabled}
                className="w-full h-2 bg-accent rounded-curvy appearance-none cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-primary/20
                         disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${((state.speed - 0.1) / (3.0 - 0.1)) * 100}%, var(--color-accent) ${((state.speed - 0.1) / (3.0 - 0.1)) * 100}%, var(--color-accent) 100%)`
                }}
              />
              {/* Custom thumb */}
              <div 
                className="absolute top-1/2 w-4 h-4 bg-primary rounded-full shadow-glow transform -translate-y-1/2 pointer-events-none transition-all duration-200"
                style={{
                  left: `calc(${((state.speed - 0.1) / (3.0 - 0.1)) * 100}% - 8px)`
                }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-text-muted">
              <span>0.1x</span>
              <span>1.0x</span>
              <span>3.0x</span>
            </div>
          </div>
        )}

        {/* Status Indicator */}
        <div className="flex items-center justify-center space-x-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${
            state.isPlaying ? 'bg-success animate-pulse' :
            state.isPaused ? 'bg-warning' :
            'bg-text-muted'
          }`} />
          <span className="text-text-secondary">
            {state.isPlaying ? 'Playing' :
             state.isPaused ? 'Paused' :
             state.currentStep >= state.totalSteps ? 'Complete' :
             'Ready'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnimationControls;