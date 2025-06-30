import React, { useEffect, useState } from 'react';
import { ElementState } from '../../types';

interface AnimatedArrayElementProps {
  value: number;
  index: number;
  state: ElementState;
  isHighlighted?: boolean;
  showIndex?: boolean;
  showValue?: boolean;
  height?: number;
  width?: number;
  animationDuration?: number;
  onClick?: (index: number) => void;
}

const AnimatedArrayElement: React.FC<AnimatedArrayElementProps> = ({
  value,
  index,
  state,
  isHighlighted = false,
  showIndex = true,
  showValue = true,
  height = 60,
  width = 60,
  animationDuration = 300,
  onClick
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);

  // Trigger animation when state changes
  useEffect(() => {
    if (state === 'swapping' || state === 'comparing') {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), animationDuration);
      return () => clearTimeout(timer);
    }
  }, [state, animationDuration]);

  // Update display value with animation
  useEffect(() => {
    if (displayValue !== value) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsAnimating(false);
      }, animationDuration / 2);
      return () => clearTimeout(timer);
    }
  }, [value, displayValue, animationDuration]);

  const getElementClasses = () => {
    const baseClasses = `
      relative flex flex-col items-center justify-center
      rounded-curvy border-2 cursor-pointer
      transition-all duration-300 ease-in-out
      font-semibold text-sm
    `;

    const stateClasses = {
      default: 'element-default text-text-primary',
      comparing: 'element-comparing text-text-primary animate-pulse-glow',
      swapping: 'element-swapping text-text-primary',
      sorted: 'element-sorted text-text-primary',
      current: 'element-current text-secondary',
      pivot: 'element-pivot text-text-primary',
      minimum: 'element-minimum text-text-primary',
      maximum: 'element-maximum text-text-primary'
    };

    const highlightClass = isHighlighted ? 'ring-2 ring-primary ring-offset-2 ring-offset-bg-primary' : '';
    const animatingClass = isAnimating ? 'scale-110 rotate-1' : '';

    return `${baseClasses} ${stateClasses[state]} ${highlightClass} ${animatingClass}`;
  };

  const getBarHeight = () => {
    // For bar chart visualization, scale height based on value
    const maxHeight = 200;
    const minHeight = 20;
    const normalizedHeight = Math.max(minHeight, (value / 100) * maxHeight);
    return normalizedHeight;
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Array Element */}
      <div
        className={getElementClasses()}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: isAnimating ? 'scale(1.1) rotate(1deg)' : 'scale(1) rotate(0deg)'
        }}
        onClick={() => onClick?.(index)}
      >
        {showValue && (
          <span className="text-lg font-bold">
            {displayValue}
          </span>
        )}
        
        {/* State indicator dot */}
        <div className={`
          absolute -top-1 -right-1 w-3 h-3 rounded-full
          ${state !== 'default' ? 'opacity-100' : 'opacity-0'}
          transition-opacity duration-200
        `}>
          <div className={`w-full h-full rounded-full ${
            state === 'comparing' ? 'bg-comparison' :
            state === 'swapping' ? 'bg-swap' :
            state === 'sorted' ? 'bg-sorted' :
            state === 'current' ? 'bg-current' :
            state === 'pivot' ? 'bg-pivot' :
            'bg-primary'
          }`} />
        </div>
      </div>

      {/* Index Label */}
      {showIndex && (
        <div className="text-xs text-text-muted font-medium">
          [{index}]
        </div>
      )}

      {/* Bar Visualization (Alternative view) */}
      <div className="hidden group-hover:block absolute bottom-full mb-2">
        <div
          className="bg-primary/20 border border-primary/40 rounded-curvy-sm"
          style={{
            width: '4px',
            height: `${getBarHeight()}px`
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedArrayElement;