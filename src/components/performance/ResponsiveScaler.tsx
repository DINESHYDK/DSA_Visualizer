import React, { useState, useEffect } from 'react';
import { Smartphone, Tablet, Monitor, Maximize, Minimize } from 'lucide-react';

interface ResponsiveScalerProps {
  children: React.ReactNode;
  minScale?: number;
  maxScale?: number;
  breakpoints?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
  className?: string;
}

const ResponsiveScaler: React.FC<ResponsiveScalerProps> = ({
  children,
  minScale = 0.5,
  maxScale = 1.0,
  breakpoints = { sm: 640, md: 768, lg: 1024 },
  className = ''
}) => {
  const [scale, setScale] = useState(1.0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isAutoScale, setIsAutoScale] = useState(true);
  const [devicePreview, setDevicePreview] = useState<'auto' | 'mobile' | 'tablet' | 'desktop'>('auto');

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      setContainerWidth(window.innerWidth);
    };
    
    // Initial width
    updateWidth();
    
    // Add resize listener
    window.addEventListener('resize', updateWidth);
    
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Calculate scale based on container width and breakpoints
  useEffect(() => {
    if (!isAutoScale) return;
    
    let newScale = 1.0;
    
    if (devicePreview === 'mobile') {
      newScale = 0.6;
    } else if (devicePreview === 'tablet') {
      newScale = 0.8;
    } else if (devicePreview === 'desktop') {
      newScale = 1.0;
    } else {
      // Auto scaling based on container width
      if (containerWidth < breakpoints.sm!) {
        // Mobile
        newScale = minScale;
      } else if (containerWidth < breakpoints.md!) {
        // Tablet
        const range = breakpoints.md! - breakpoints.sm!;
        const position = containerWidth - breakpoints.sm!;
        const scaleFactor = position / range;
        newScale = minScale + scaleFactor * (maxScale - minScale);
      } else {
        // Desktop
        newScale = maxScale;
      }
    }
    
    setScale(newScale);
  }, [containerWidth, breakpoints, minScale, maxScale, isAutoScale, devicePreview]);

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAutoScale(false);
    setScale(parseFloat(e.target.value));
  };

  const resetScale = () => {
    setIsAutoScale(true);
    setDevicePreview('auto');
  };

  return (
    <div className={`${className}`}>
      {/* Controls */}
      <div className="bg-bg-card rounded-curvy p-3 shadow-curvy mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-text-secondary">Scale:</span>
              <span className="text-sm font-medium text-primary">{scale.toFixed(2)}x</span>
            </div>
            
            <div className="w-32">
              <input
                type="range"
                min="0.2"
                max="1.5"
                step="0.05"
                value={scale}
                onChange={handleScaleChange}
                className="w-full h-2 bg-accent rounded-curvy appearance-none cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => { setIsAutoScale(false); setDevicePreview('mobile'); setScale(0.6); }}
              className={`p-2 rounded-curvy ${
                devicePreview === 'mobile' 
                  ? 'bg-primary text-bg-primary' 
                  : 'text-text-muted hover:text-primary hover:bg-accent/20'
              } transition-colors duration-200`}
              title="Mobile Preview"
            >
              <Smartphone className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => { setIsAutoScale(false); setDevicePreview('tablet'); setScale(0.8); }}
              className={`p-2 rounded-curvy ${
                devicePreview === 'tablet' 
                  ? 'bg-primary text-bg-primary' 
                  : 'text-text-muted hover:text-primary hover:bg-accent/20'
              } transition-colors duration-200`}
              title="Tablet Preview"
            >
              <Tablet className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => { setIsAutoScale(false); setDevicePreview('desktop'); setScale(1.0); }}
              className={`p-2 rounded-curvy ${
                devicePreview === 'desktop' 
                  ? 'bg-primary text-bg-primary' 
                  : 'text-text-muted hover:text-primary hover:bg-accent/20'
              } transition-colors duration-200`}
              title="Desktop Preview"
            >
              <Monitor className="h-4 w-4" />
            </button>
            
            <button
              onClick={resetScale}
              className={`p-2 rounded-curvy ${
                devicePreview === 'auto' && isAutoScale
                  ? 'bg-primary text-bg-primary' 
                  : 'text-text-muted hover:text-primary hover:bg-accent/20'
              } transition-colors duration-200`}
              title="Auto Scale"
            >
              <Maximize className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Scaled Content */}
      <div className="flex justify-center">
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            width: `${100 / scale}%`,
            height: `${100 / scale}%`
          }}
          className="transition-transform duration-300"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveScaler;