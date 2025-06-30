import React, { useEffect, useState } from 'react';

interface SwapAnimationProps {
  fromIndex: number;
  toIndex: number;
  elementWidth: number;
  elementGap: number;
  duration?: number;
  onComplete?: () => void;
}

export const SwapAnimation: React.FC<SwapAnimationProps> = ({
  fromIndex,
  toIndex,
  elementWidth,
  elementGap,
  duration = 600,
  onComplete
}) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isAnimating) return null;

  const fromPos = fromIndex * (elementWidth + elementGap);
  const toPos = toIndex * (elementWidth + elementGap);
  const distance = toPos - fromPos;

  return (
    <div className="absolute pointer-events-none">
      {/* Swap arc animation */}
      <svg
        className="absolute"
        style={{
          left: `${Math.min(fromPos, toPos)}px`,
          top: '-20px',
          width: `${Math.abs(distance) + elementWidth}px`,
          height: '40px'
        }}
      >
        <path
          d={`M ${fromIndex < toIndex ? 0 : Math.abs(distance)} 20 
              Q ${Math.abs(distance) / 2} 0 
              ${fromIndex < toIndex ? Math.abs(distance) : 0} 20`}
          stroke="var(--color-swap)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,5"
          className="animate-pulse"
        />
        
        {/* Arrow indicators */}
        <circle
          cx={fromIndex < toIndex ? 0 : Math.abs(distance)}
          cy="20"
          r="3"
          fill="var(--color-swap)"
          className="animate-pulse"
        />
        <circle
          cx={fromIndex < toIndex ? Math.abs(distance) : 0}
          cy="20"
          r="3"
          fill="var(--color-swap)"
          className="animate-pulse"
        />
      </svg>
    </div>
  );
};

interface SlideAnimationProps {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  duration?: number;
  children: React.ReactNode;
}

export const SlideAnimation: React.FC<SlideAnimationProps> = ({
  direction,
  distance,
  duration = 300,
  children
}) => {
  const getTransform = () => {
    switch (direction) {
      case 'left':
        return `translateX(-${distance}px)`;
      case 'right':
        return `translateX(${distance}px)`;
      case 'up':
        return `translateY(-${distance}px)`;
      case 'down':
        return `translateY(${distance}px)`;
      default:
        return 'translate(0)';
    }
  };

  return (
    <div
      className="transition-transform ease-in-out"
      style={{
        transform: getTransform(),
        transitionDuration: `${duration}ms`
      }}
    >
      {children}
    </div>
  );
};

interface PulseEffectProps {
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
  duration?: number;
  children: React.ReactNode;
}

export const PulseEffect: React.FC<PulseEffectProps> = ({
  color = 'var(--color-primary)',
  intensity = 'medium',
  duration = 1000,
  children
}) => {
  const getIntensityClass = () => {
    switch (intensity) {
      case 'low':
        return 'animate-pulse opacity-80';
      case 'medium':
        return 'animate-pulse-glow';
      case 'high':
        return 'animate-pulse-glow scale-105';
      default:
        return 'animate-pulse';
    }
  };

  return (
    <div
      className={getIntensityClass()}
      style={{
        animationDuration: `${duration}ms`,
        filter: `drop-shadow(0 0 8px ${color}40)`
      }}
    >
      {children}
    </div>
  );
};

interface GlowEffectProps {
  color?: string;
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

export const GlowEffect: React.FC<GlowEffectProps> = ({
  color = 'var(--color-primary)',
  size = 'medium',
  children
}) => {
  const getSizeValue = () => {
    switch (size) {
      case 'small':
        return '4px';
      case 'medium':
        return '8px';
      case 'large':
        return '12px';
      default:
        return '8px';
    }
  };

  return (
    <div
      style={{
        filter: `drop-shadow(0 0 ${getSizeValue()} ${color}60)`,
        transition: 'filter 0.3s ease'
      }}
    >
      {children}
    </div>
  );
};