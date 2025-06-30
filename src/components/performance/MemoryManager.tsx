import React, { useState, useEffect, useRef } from 'react';
import { MemoryStick, Trash2, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

interface MemoryUsage {
  total: number;
  used: number;
  free: number;
  limit: number;
}

interface MemoryManagerProps {
  onCleanup?: () => void;
  memoryLimit?: number; // in MB
  className?: string;
}

const MemoryManager: React.FC<MemoryManagerProps> = ({
  onCleanup,
  memoryLimit = 100, // Default 100MB limit
  className = ''
}) => {
  const [memoryUsage, setMemoryUsage] = useState<MemoryUsage>({
    total: 0,
    used: 0,
    free: 0,
    limit: memoryLimit
  });
  const [isWarning, setIsWarning] = useState(false);
  const [isError, setIsError] = useState(false);
  const [lastCleanup, setLastCleanup] = useState<Date | null>(null);
  const memoryCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // Simulate memory usage monitoring
  useEffect(() => {
    const checkMemory = () => {
      // In a real implementation, we would use performance.memory in Chrome
      // or a custom memory tracking solution
      // Here we'll simulate memory usage
      
      // Simulate memory usage between 10-90% of limit with some fluctuation
      const baseUsage = memoryUsage.used || (memoryLimit * 0.3); // Start at 30% if not set
      const fluctuation = (Math.random() * 0.1 - 0.05) * memoryLimit; // ±5% fluctuation
      const newUsed = Math.max(0, Math.min(memoryLimit, baseUsage + fluctuation));
      
      const newMemoryUsage = {
        total: memoryLimit,
        used: newUsed,
        free: memoryLimit - newUsed,
        limit: memoryLimit
      };
      
      setMemoryUsage(newMemoryUsage);
      
      // Set warning/error states
      setIsWarning(newUsed > memoryLimit * 0.7);
      setIsError(newUsed > memoryLimit * 0.9);
      
      // Auto-cleanup if critical
      if (newUsed > memoryLimit * 0.95 && onCleanup) {
        handleCleanup();
      }
    };
    
    memoryCheckInterval.current = setInterval(checkMemory, 2000);
    
    return () => {
      if (memoryCheckInterval.current) {
        clearInterval(memoryCheckInterval.current);
      }
    };
  }, [memoryLimit, memoryUsage.used, onCleanup]);

  const handleCleanup = () => {
    if (onCleanup) {
      onCleanup();
    }
    
    // Simulate memory cleanup
    setMemoryUsage(prev => ({
      ...prev,
      used: prev.used * 0.5, // Reduce usage by 50%
      free: prev.limit - (prev.used * 0.5)
    }));
    
    setLastCleanup(new Date());
    setIsWarning(false);
    setIsError(false);
  };

  const formatMemory = (bytes: number): string => {
    const mb = bytes.toFixed(1);
    return `${mb} MB`;
  };

  const getUsagePercentage = (): number => {
    return (memoryUsage.used / memoryUsage.limit) * 100;
  };

  const getUsageColor = (): string => {
    const percentage = getUsagePercentage();
    if (percentage > 90) return 'bg-error';
    if (percentage > 70) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className={`bg-bg-card rounded-curvy p-4 shadow-curvy ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MemoryStick className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium text-text-primary">Memory Management</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {isError ? (
            <AlertCircle className="h-5 w-5 text-error animate-pulse" />
          ) : isWarning ? (
            <AlertCircle className="h-5 w-5 text-warning" />
          ) : (
            <CheckCircle className="h-5 w-5 text-success" />
          )}
        </div>
      </div>
      
      {/* Memory Usage Bar */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-text-muted">Memory Usage</span>
          <span className={`font-medium ${isError ? 'text-error' : isWarning ? 'text-warning' : 'text-text-primary'}`}>
            {formatMemory(memoryUsage.used)} / {formatMemory(memoryUsage.limit)}
          </span>
        </div>
        
        <div className="w-full bg-accent/20 rounded-curvy h-3 overflow-hidden">
          <div
            className={`h-full ${getUsageColor()} rounded-curvy transition-all duration-300`}
            style={{ width: `${getUsagePercentage()}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-text-muted">
          <span>0 MB</span>
          <span>{formatMemory(memoryUsage.limit)}</span>
        </div>
      </div>
      
      {/* Memory Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-accent/10 rounded-curvy p-3 border border-accent/20">
          <div className="text-sm text-text-muted mb-1">Used Memory</div>
          <div className="text-lg font-medium text-primary">{formatMemory(memoryUsage.used)}</div>
        </div>
        
        <div className="bg-accent/10 rounded-curvy p-3 border border-accent/20">
          <div className="text-sm text-text-muted mb-1">Free Memory</div>
          <div className="text-lg font-medium text-success">{formatMemory(memoryUsage.free)}</div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={handleCleanup}
          className="flex-1 px-4 py-2 bg-primary hover:bg-hover text-bg-primary rounded-curvy
                   transition-all duration-200 hover-lift font-medium"
        >
          <Trash2 className="h-4 w-4 inline mr-2" />
          Clean Memory
        </button>
        
        <button
          onClick={() => {
            if (memoryCheckInterval.current) {
              clearInterval(memoryCheckInterval.current);
            }
            
            // Reset memory usage simulation
            setMemoryUsage({
              total: memoryLimit,
              used: memoryLimit * 0.3,
              free: memoryLimit * 0.7,
              limit: memoryLimit
            });
            
            setIsWarning(false);
            setIsError(false);
            
            // Restart interval
            memoryCheckInterval.current = setInterval(() => {
              // Simulate memory usage between 10-90% of limit with some fluctuation
              const baseUsage = memoryUsage.used || (memoryLimit * 0.3);
              const fluctuation = (Math.random() * 0.1 - 0.05) * memoryLimit;
              const newUsed = Math.max(0, Math.min(memoryLimit, baseUsage + fluctuation));
              
              const newMemoryUsage = {
                total: memoryLimit,
                used: newUsed,
                free: memoryLimit - newUsed,
                limit: memoryLimit
              };
              
              setMemoryUsage(newMemoryUsage);
              setIsWarning(newUsed > memoryLimit * 0.7);
              setIsError(newUsed > memoryLimit * 0.9);
            }, 2000);
          }}
          className="px-4 py-2 bg-accent hover:bg-primary hover:text-bg-primary 
                   text-text-primary rounded-curvy transition-all duration-200 hover-lift"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
      
      {/* Last Cleanup Info */}
      {lastCleanup && (
        <div className="mt-3 text-xs text-text-muted text-center">
          Last cleanup: {lastCleanup.toLocaleTimeString()}
        </div>
      )}
      
      {/* Warning Message */}
      {isWarning && (
        <div className="mt-3 p-2 bg-warning/10 border border-warning/20 rounded-curvy text-xs text-warning">
          <AlertCircle className="h-3 w-3 inline mr-1" />
          Memory usage is high. Consider cleaning up unused resources.
        </div>
      )}
      
      {/* Error Message */}
      {isError && (
        <div className="mt-3 p-2 bg-error/10 border border-error/20 rounded-curvy text-xs text-error">
          <AlertCircle className="h-3 w-3 inline mr-1" />
          Critical memory usage! Automatic cleanup may occur to prevent crashes.
        </div>
      )}
    </div>
  );
};

export default MemoryManager;