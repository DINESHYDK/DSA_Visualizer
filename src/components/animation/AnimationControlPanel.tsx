import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  FastForward,
  Rewind,
  Info
} from 'lucide-react';
import { AnimationState, AnimationControls as AnimationControlsType } from '../../types';

interface AnimationControlPanelProps {
  state: AnimationState;
  controls: AnimationControlsType;
  disabled?: boolean;
  showStepControls?: boolean;
  showSpeedControl?: boolean;
  showProgressBar?: boolean;
  showStatusIndicator?: boolean;
  showAdvancedControls?: boolean;
  className?: string;
  onSettingsClick?: () => void;
  onInfoClick?: () => void;
}

const AnimationControlPanel: React.FC<AnimationControlPanelProps> = ({
  state,
  controls,
  disabled = false,
  showStepControls = true,
  showSpeedControl = true,
  showProgressBar = true,
  showStatusIndicator = true,
  showAdvancedControls = false,
  className = '',
  onSettingsClick,
  onInfoClick
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

  const getStatusText = () => {
    if (state.isPlaying) return 'Playing';
    if (state.isPaused) return 'Paused';
    if (state.currentStep >= state.totalSteps) return 'Complete';
    return 'Ready';
  };

  const getStatusColor = () => {
    if (state.isPlaying) return 'text-success';
    if (state.isPaused) return 'text-warning';
    if (state.currentStep >= state.totalSteps) return 'text-info';
    return 'text-text-muted';
  };

  const getProgressPercentage = () => {
    return state.totalSteps > 0 ? (state.currentStep / state.totalSteps) * 100 : 0;
  };

  return (
    <div className={`bg-bg-card rounded-lg border border-border ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Controls</h3>
        <div className="flex items-center space-x-1">
          {onInfoClick && (
            <button
              onClick={onInfoClick}
              className="p-1.5 rounded text-text-muted hover:text-accent hover:bg-bg-elevated
                       transition-colors duration-200"
              aria-label="Algorithm Information"
            >
              <Info className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Main Control Buttons */}
        <div className="flex items-center justify-center space-x-2">
          {/* Skip to Beginning */}
          <button
            onClick={controls.skipToBeginning}
            disabled={disabled || state.currentStep === 0}
            className="p-2.5 rounded border border-border bg-bg-elevated text-text-secondary
                     hover:text-text-primary hover:border-border-hover
                     disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
            aria-label="Skip to Beginning"
          >
            <Rewind className="h-4 w-4" />
          </button>

          {/* Step Backward */}
          {showStepControls && (
            <button
              onClick={controls.stepBackward}
              disabled={disabled || state.currentStep === 0}
              className="p-2.5 rounded border border-border bg-bg-elevated text-text-secondary
                       hover:text-text-primary hover:border-border-hover
                       disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
              aria-label="Step Backward"
            >
              <SkipBack className="h-4 w-4" />
            </button>
          )}

          {/* Play/Pause - Main Button */}
          <button
            onClick={getPlayPauseAction()}
            disabled={disabled}
            className="px-5 py-2.5 rounded bg-accent hover:bg-accent-hover text-white font-medium
                     disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150
                     flex items-center space-x-1.5"
            aria-label={state.isPlaying ? 'Pause' : 'Play'}
          >
            {getPlayPauseIcon()}
            <span className="text-sm">{state.isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          {/* Step Forward */}
          {showStepControls && (
            <button
              onClick={controls.stepForward}
              disabled={disabled || state.currentStep >= state.totalSteps}
              className="p-2.5 rounded border border-border bg-bg-elevated text-text-secondary
                       hover:text-text-primary hover:border-border-hover
                       disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
              aria-label="Step Forward"
            >
              <SkipForward className="h-4 w-4" />
            </button>
          )}

          {/* Skip to End */}
          <button
            onClick={controls.skipToEnd}
            disabled={disabled || state.currentStep >= state.totalSteps}
            className="p-2.5 rounded border border-border bg-bg-elevated text-text-secondary
                     hover:text-text-primary hover:border-border-hover
                     disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
            aria-label="Skip to End"
          >
            <FastForward className="h-4 w-4" />
          </button>

          {/* Reset */}
          <button
            onClick={controls.reset}
            disabled={disabled}
            className="p-2.5 rounded border border-border bg-bg-elevated text-text-muted
                     hover:text-error hover:border-error/50 hover:bg-error/10
                     disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
            aria-label="Reset Animation"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {/* Progress Section */}
        {showProgressBar && (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs text-text-muted">
              <span>Step {state.currentStep} of {state.totalSteps}</span>
              <span>{Math.round(getProgressPercentage())}%</span>
            </div>
            <div className="w-full bg-bg-elevated rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-300 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        )}

        {/* Speed Control */}
        {showSpeedControl && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-text-muted">Speed</label>
              <span className="text-xs font-mono text-accent">{state.speed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={state.speed}
              onChange={handleSpeedChange}
              disabled={disabled}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer
                       disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(to right,
                  var(--color-accent) 0%,
                  var(--color-accent) ${((state.speed - 0.1) / (3.0 - 0.1)) * 100}%,
                  var(--color-bg-elevated) ${((state.speed - 0.1) / (3.0 - 0.1)) * 100}%,
                  var(--color-bg-elevated) 100%)`
              }}
              aria-label="Animation speed"
            />
            <div className="flex justify-between text-xs text-text-muted">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimationControlPanel;