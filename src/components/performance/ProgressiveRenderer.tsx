import React, { useState, useEffect, useRef } from 'react';
import { Layers, Zap, Pause, Play } from 'lucide-react';

interface ProgressiveRendererProps {
  data: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  batchSize?: number;
  batchDelay?: number;
  loadingPlaceholder?: React.ReactNode;
  className?: string;
}

const ProgressiveRenderer: React.FC<ProgressiveRendererProps> = ({
  data,
  renderItem,
  batchSize = 10,
  batchDelay = 50,
  loadingPlaceholder = null,
  className = ''
}) => {
  const [renderedItems, setRenderedItems] = useState<any[]>([]);
  const [isRendering, setIsRendering] = useState(true);
  const [progress, setProgress] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset when data changes
  useEffect(() => {
    setRenderedItems([]);
    setProgress(0);
    setIsRendering(true);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data]);

  // Progressive rendering effect
  useEffect(() => {
    if (!isRendering || !data.length) return;
    
    const renderNextBatch = () => {
      setRenderedItems(prev => {
        const nextIndex = prev.length;
        if (nextIndex >= data.length) {
          setIsRendering(false);
          setProgress(100);
          return prev;
        }
        
        const endIndex = Math.min(nextIndex + batchSize, data.length);
        const newProgress = Math.floor((endIndex / data.length) * 100);
        setProgress(newProgress);
        
        return [...prev, ...data.slice(nextIndex, endIndex)];
      });
      
      timeoutRef.current = setTimeout(renderNextBatch, batchDelay);
    };
    
    timeoutRef.current = setTimeout(renderNextBatch, 0);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, batchSize, batchDelay, isRendering]);

  const toggleRendering = () => {
    setIsRendering(prev => !prev);
  };

  return (
    <div className={className}>
      {/* Header with controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Layers className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium text-text-primary">Progressive Rendering</h3>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-text-secondary">
            {renderedItems.length} of {data.length} items ({progress}%)
          </div>
          
          <button
            onClick={toggleRendering}
            className="p-2 rounded-curvy text-text-muted hover:text-primary hover:bg-accent/20 
                     transition-colors duration-200"
            title={isRendering ? "Pause Rendering" : "Resume Rendering"}
          >
            {isRendering ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-accent/20 rounded-curvy h-1 mb-4">
        <div
          className="h-full bg-primary rounded-curvy transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Rendered content */}
      <div className="space-y-2">
        {renderedItems.map((item, index) => (
          <React.Fragment key={index}>
            {renderItem(item, index)}
          </React.Fragment>
        ))}
        
        {/* Loading placeholders */}
        {isRendering && renderedItems.length < data.length && (
          <div className="animate-pulse">
            {loadingPlaceholder || (
              <div className="space-y-2">
                {Array.from({ length: Math.min(batchSize, data.length - renderedItems.length) }).map((_, i) => (
                  <div key={i} className="bg-accent/20 rounded-curvy h-16"></div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressiveRenderer;