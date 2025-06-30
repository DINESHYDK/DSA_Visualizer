import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipBack, 
  SkipForward, 
  FastForward,
  Rewind,
  Settings,
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
    <div className={`bg-bg-card rounded-curvy shadow-curvy border border-accent/20 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-accent/20">
        <h3 className="text-lg font-semibold text-primary">Animation Controls</h3>
        <div className="flex items-center space-x-2">
          {onInfoClick && (
            <button
              onClick={onInfoClick}
              className="p-2 rounded-curvy text-text-muted hover:text-primary hover:bg-accent/20 
                       transition-colors duration-200"
              title="Algorithm Information"
            >
              <Info className="h-4 w-4" />
            </button>
          )}
          {onSettingsClick && showAdvancedControls && (
            <button
              onClick={onSettingsClick}
              className="p-2 rounded-curvy text-text-muted hover:text-primary hover:bg-accent/20 
                       transition-colors duration-200"
              title="Advanced Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Main Control Buttons */}
        <div className="flex items-center justify-center space-x-3">
          {/* Skip to Beginning */}
          <button
            onClick={controls.skipToBeginning}
            disabled={disabled || state.currentStep === 0}
            className="p-3 rounded-curvy bg-accent hover:bg-primary hover:text-secondary 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 text-text-primary hover-lift
                     shadow-curvy hover:shadow-glow"
            title="Skip to Beginning"
          >
            <Rewind className="h-5 w-5" />
          </button>

          {/* Step Backward */}
          {showStepControls && (
            <button
              onClick={controls.stepBackward}
              disabled={disabled || state.currentStep === 0}
              className="p-3 rounded-curvy bg-accent hover:bg-primary hover:text-secondary 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 text-text-primary hover-lift
                       shadow-curvy hover:shadow-glow"
              title="Step Backward"
            >
              <SkipBack className="h-5 w-5" />
            </button>
          )}

          {/* Play/Pause - Main Button */}
          <button
            onClick={getPlayPauseAction()}
            disabled={disabled}
            className="p-4 rounded-curvy bg-primary hover:bg-hover text-secondary 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 shadow-glow hover:shadow-glow-hover
                     hover-lift scale-110"
            title={state.isPlaying ? 'Pause' : 'Play'}
          >
            {getPlayPauseIcon()}
          </button>

          {/* Step Forward */}
          {showStepControls && (
            <button
              onClick={controls.stepForward}
              disabled={disabled || state.currentStep >= state.totalSteps}
              className="p-3 rounded-curvy bg-accent hover:bg-primary hover:text-secondary 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 text-text-primary hover-lift
                       shadow-curvy hover:shadow-glow"
              title="Step Forward"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          )}

          {/* Skip to End */}
          <button
            onClick={controls.skipToEnd}
            disabled={disabled || state.currentStep >= state.totalSteps}
            className="p-3 rounded-curvy bg-accent hover:bg-primary hover:text-secondary 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 text-text-primary hover-lift
                     shadow-curvy hover:shadow-glow"
            title="Skip to End"
          >
            <FastForward className="h-5 w-5" />
          </button>

          {/* Reset */}
          <button
            onClick={controls.reset}
            disabled={disabled}
            className="p-3 rounded-curvy bg-error hover:bg-error/80 text-white 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 hover-lift shadow-curvy"
            title="Reset Animation"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Section */}
        {showProgressBar && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-text-secondary">Progress</span>
              <span className="text-sm text-text-muted">
                Step {state.currentStep} of {state.totalSteps}
              </span>
            </div>
            
            {/* Enhanced Progress Bar */}
            <div className="relative">
              <div className="w-full bg-accent rounded-curvy h-3 overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-primary to-hover transition-all duration-500 ease-out
                           shadow-glow relative"
                  style={{
                    width: `${getProgressPercentage()}%`
                  }}
                >
                  {/* Progress bar glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                                animate-pulse" />
                </div>
              </div>
              
              {/* Progress percentage text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-text-primary drop-shadow-sm">
                  {Math.round(getProgressPercentage())}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Speed Control */}
        {showSpeedControl && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-text-secondary">
                Animation Speed
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono text-primary">
                  {state.speed.toFixed(1)}x
                </span>
                <div className="text-xs text-text-muted">
                  {state.speed < 0.8 ? 'Slow' : 
                   state.speed > 1.5 ? 'Fast' : 'Normal'}
                </div>
              </div>
            </div>
            
            {/* Enhanced Speed Slider */}
            <div className="relative">
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={state.speed}
                onChange={handleSpeedChange}
                disabled={disabled}
                className="w-full h-3 bg-accent rounded-curvy appearance-none cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-primary/20
                         disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(to right, 
                    var(--color-primary) 0%, 
                    var(--color-primary) ${((state.speed - 0.1) / (3.0 - 0.1)) * 100}%, 
                    var(--color-accent) ${((state.speed - 0.1) / (3.0 - 0.1)) * 100}%, 
                    var(--color-accent) 100%)`
                }}
              />
              
              {/* Speed markers */}
              <div className="flex justify-between text-xs text-text-muted mt-2">
                <span>0.1x</span>
                <span>1.0x</span>
                <span>3.0x</span>
              </div>
            </div>
          </div>
        )}

        {/* Status Indicator */}
        {showStatusIndicator && (
          <div className="flex items-center justify-between p-3 bg-accent/10 rounded-curvy border border-accent/20">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                state.isPlaying ? 'bg-success animate-pulse shadow-glow' :
                state.isPaused ? 'bg-warning' :
                state.currentStep >= state.totalSteps ? 'bg-info' :
                'bg-text-muted'
              }`} />
              <span className="text-sm font-medium text-text-secondary">Status:</span>
              <span className={`text-sm font-semibold ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>
            
            {/* Time indicator */}
            <div className="text-xs text-text-muted">
              {state.isPlaying && (
                <span className="animate-pulse">●</span>
              )}
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts Hint */}
        <div className="text-xs text-text-muted text-center p-2 bg-accent/5 rounded-curvy">
          <span className="font-medium">Keyboard shortcuts:</span> Space (Play/Pause), ← → (Step), R (Reset)
        </div>
      </div>
    </div>
  );
};

export default AnimationControlPanel;