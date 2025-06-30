import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, CheckCircle, Zap } from 'lucide-react';

interface WebWorkerManagerProps {
  taskFunction: string;
  inputData: any;
  onResult: (result: any) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
  className?: string;
}

const WebWorkerManager: React.FC<WebWorkerManagerProps> = ({
  taskFunction,
  inputData,
  onResult,
  onError,
  onProgress,
  className = ''
}) => {
  const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const workerRef = useRef<Worker | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    // Create a blob URL for the worker script
    const workerScript = `
      self.onmessage = function(e) {
        const { taskFunction, inputData } = e.data;
        
        try {
          // Function to report progress back to main thread
          const reportProgress = (percent) => {
            self.postMessage({ type: 'progress', data: percent });
          };
          
          // Convert string function to actual function
          const taskFn = new Function('data', 'reportProgress', taskFunction);
          
          // Execute the function
          const result = taskFn(inputData, reportProgress);
          
          // Send the result back to the main thread
          self.postMessage({ type: 'result', data: result });
        } catch (error) {
          self.postMessage({ type: 'error', data: error.message });
        }
      };
    `;
    
    const blob = new Blob([workerScript], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    
    // Create the worker
    workerRef.current = new Worker(workerUrl);
    
    // Set up message handler
    workerRef.current.onmessage = (e) => {
      const { type, data } = e.data;
      
      switch (type) {
        case 'result':
          setStatus('completed');
          setExecutionTime(Date.now() - startTimeRef.current);
          onResult(data);
          break;
        case 'error':
          setStatus('error');
          setError(data);
          if (onError) onError(new Error(data));
          break;
        case 'progress':
          setProgress(data);
          if (onProgress) onProgress(data);
          break;
      }
    };
    
    // Clean up
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      URL.revokeObjectURL(workerUrl);
    };
  }, [taskFunction, onResult, onError, onProgress]);

  const executeTask = () => {
    if (workerRef.current) {
      setStatus('running');
      setProgress(0);
      setError(null);
      startTimeRef.current = Date.now();
      
      workerRef.current.postMessage({
        taskFunction,
        inputData
      });
    }
  };

  const cancelTask = () => {
    if (workerRef.current) {
      workerRef.current.terminate();
      
      // Recreate the worker
      const workerScript = `
        self.onmessage = function(e) {
          const { taskFunction, inputData } = e.data;
          
          try {
            const reportProgress = (percent) => {
              self.postMessage({ type: 'progress', data: percent });
            };
            
            const taskFn = new Function('data', 'reportProgress', taskFunction);
            const result = taskFn(inputData, reportProgress);
            
            self.postMessage({ type: 'result', data: result });
          } catch (error) {
            self.postMessage({ type: 'error', data: error.message });
          }
        };
      `;
      
      const blob = new Blob([workerScript], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      
      workerRef.current = new Worker(workerUrl);
      
      workerRef.current.onmessage = (e) => {
        const { type, data } = e.data;
        
        switch (type) {
          case 'result':
            setStatus('completed');
            setExecutionTime(Date.now() - startTimeRef.current);
            onResult(data);
            break;
          case 'error':
            setStatus('error');
            setError(data);
            if (onError) onError(new Error(data));
            break;
          case 'progress':
            setProgress(data);
            if (onProgress) onProgress(data);
            break;
        }
      };
      
      setStatus('idle');
    }
  };

  return (
    <div className={`bg-bg-card rounded-curvy p-4 shadow-curvy ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium text-text-primary">Web Worker Task</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            {status === 'idle' && (
              <button
                onClick={executeTask}
                className="px-4 py-2 bg-primary hover:bg-hover text-bg-primary rounded-curvy
                         transition-all duration-200 hover-lift font-medium"
              >
                Execute Task
              </button>
            )}
            
            {status === 'running' && (
              <button
                onClick={cancelTask}
                className="px-4 py-2 bg-error hover:bg-error/80 text-white rounded-curvy
                         transition-all duration-200 hover-lift font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
        
        {/* Status Display */}
        <div className="bg-accent/10 rounded-curvy p-3 border border-accent/20">
          <div className="flex items-center space-x-2">
            {status === 'idle' && (
              <div className="w-3 h-3 bg-text-muted rounded-full"></div>
            )}
            {status === 'running' && (
              <div className="w-3 h-3 bg-warning rounded-full animate-pulse"></div>
            )}
            {status === 'completed' && (
              <CheckCircle className="h-5 w-5 text-success" />
            )}
            {status === 'error' && (
              <AlertCircle className="h-5 w-5 text-error" />
            )}
            
            <span className="text-sm font-medium text-text-primary">
              Status: {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
          
          {status === 'running' && (
            <div className="mt-2">
              <div className="text-xs text-text-muted mb-1">Progress: {progress}%</div>
              <div className="w-full bg-accent/20 rounded-curvy h-2">
                <div
                  className="h-full bg-primary rounded-curvy transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {status === 'completed' && (
            <div className="text-sm text-success mt-1">
              Task completed in {(executionTime / 1000).toFixed(2)}s
            </div>
          )}
          
          {status === 'error' && error && (
            <div className="text-sm text-error mt-1">
              Error: {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebWorkerManager;