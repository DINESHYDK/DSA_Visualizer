import React, { useState, useEffect } from 'react';
import { Loader, CheckCircle, XCircle, Clock } from 'lucide-react';

interface LoadingState {
  id: string;
  label: string;
  status: 'loading' | 'success' | 'error' | 'waiting';
  progress?: number;
  message?: string;
  startTime?: number;
  endTime?: number;
}

interface LoadingStateManagerProps {
  states: LoadingState[];
  onComplete?: () => void;
  className?: string;
}

const LoadingStateManager: React.FC<LoadingStateManagerProps> = ({
  states,
  onComplete,
  className = ''
}) => {
  const [currentStates, setCurrentStates] = useState<LoadingState[]>(states);
  const [isComplete, setIsComplete] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  // Update elapsed time
  useEffect(() => {
    if (isComplete) return;
    
    const timer = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 100);
    
    return () => clearInterval(timer);
  }, [isComplete, startTime]);

  // Check for completion
  useEffect(() => {
    const allCompleted = currentStates.every(
      state => state.status === 'success' || state.status === 'error'
    );
    
    if (allCompleted && !isComplete) {
      setIsComplete(true);
      if (onComplete) onComplete();
    }
  }, [currentStates, isComplete, onComplete]);

  const updateState = (id: string, updates: Partial<LoadingState>) => {
    setCurrentStates(prev => 
      prev.map(state => 
        state.id === id 
          ? { ...state, ...updates } 
          : state
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'loading':
        return <Loader className="h-4 w-4 text-primary animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-error" />;
      case 'waiting':
        return <Clock className="h-4 w-4 text-text-muted" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'loading':
        return 'text-primary';
      case 'success':
        return 'text-success';
      case 'error':
        return 'text-error';
      case 'waiting':
        return 'text-text-muted';
      default:
        return 'text-text-primary';
    }
  };

  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className={`bg-bg-card rounded-curvy p-4 shadow-curvy ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-text-primary">Loading States</h3>
        
        <div className="text-sm text-text-muted">
          {isComplete ? 'Completed in ' : 'Elapsed: '}
          <span className="font-medium text-primary">{formatTime(elapsedTime)}</span>
        </div>
      </div>
      
      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="text-text-muted">Overall Progress</span>
          <span className="text-text-primary">
            {currentStates.filter(s => s.status === 'success' || s.status === 'error').length} / {currentStates.length}
          </span>
        </div>
        
        <div className="w-full bg-accent/20 rounded-curvy h-2 overflow-hidden">
          <div
            className="h-full bg-primary rounded-curvy transition-all duration-300"
            style={{
              width: `${(currentStates.filter(s => s.status === 'success' || s.status === 'error').length / currentStates.length) * 100}%`
            }}
          ></div>
        </div>
      </div>
      
      {/* Individual States */}
      <div className="space-y-3">
        {currentStates.map((state) => (
          <div key={state.id} className="bg-accent/10 rounded-curvy p-3 border border-accent/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getStatusIcon(state.status)}
                <span className={`font-medium ${getStatusColor(state.status)}`}>
                  {state.label}
                </span>
              </div>
              
              {state.status === 'success' && state.startTime && state.endTime && (
                <span className="text-xs text-success">
                  {formatTime(state.endTime - state.startTime)}
                </span>
              )}
              
              {state.status === 'loading' && (
                <span className="text-xs text-primary animate-pulse">
                  Loading...
                </span>
              )}
            </div>
            
            {state.status === 'loading' && state.progress !== undefined && (
              <div className="w-full bg-accent/20 rounded-curvy h-1 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-curvy transition-all duration-300"
                  style={{ width: `${state.progress}%` }}
                ></div>
              </div>
            )}
            
            {state.message && (
              <div className={`text-xs mt-1 ${getStatusColor(state.status)}`}>
                {state.message}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Demo Controls - For testing only */}
      <div className="mt-6 pt-4 border-t border-accent/20">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              // Reset all states
              setCurrentStates(states.map(state => ({
                ...state,
                status: 'waiting',
                progress: 0,
                message: undefined,
                startTime: undefined,
                endTime: undefined
              })));
              setIsComplete(false);
              setStartTime(Date.now());
              setElapsedTime(0);
              
              // Start the first state
              if (states.length > 0) {
                setTimeout(() => {
                  updateState(states[0].id, { 
                    status: 'loading', 
                    startTime: Date.now(),
                    message: 'Processing...'
                  });
                  
                  // Simulate progress updates
                  let progress = 0;
                  const progressInterval = setInterval(() => {
                    progress += 5;
                    if (progress <= 100) {
                      updateState(states[0].id, { progress });
                    } else {
                      clearInterval(progressInterval);
                      updateState(states[0].id, { 
                        status: 'success', 
                        progress: 100,
                        endTime: Date.now(),
                        message: 'Completed successfully'
                      });
                      
                      // Start the next state if available
                      if (states.length > 1) {
                        updateState(states[1].id, { 
                          status: 'loading', 
                          startTime: Date.now(),
                          message: 'Processing...'
                        });
                        
                        // Simulate error for demonstration
                        setTimeout(() => {
                          updateState(states[1].id, { 
                            status: 'error', 
                            endTime: Date.now(),
                            message: 'Failed to process data'
                          });
                        }, 2000);
                      }
                    }
                  }, 100);
                }, 500);
              }
            }}
            className="px-4 py-2 bg-primary hover:bg-hover text-bg-primary rounded-curvy
                     transition-all duration-200 hover-lift text-sm"
          >
            Simulate Loading
          </button>
          
          <button
            onClick={() => {
              // Complete all states
              setCurrentStates(prev => 
                prev.map(state => ({
                  ...state,
                  status: 'success',
                  progress: 100,
                  message: 'Completed successfully',
                  startTime: state.startTime || Date.now() - 1000,
                  endTime: Date.now()
                }))
              );
            }}
            className="px-4 py-2 bg-success hover:bg-success/80 text-white rounded-curvy
                     transition-all duration-200 hover-lift text-sm"
          >
            Complete All
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoadingStateManager;