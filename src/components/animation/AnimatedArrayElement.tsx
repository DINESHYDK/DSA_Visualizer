import React from 'react';
import { ElementState } from '../../types';

// ── R3.3: Pure CSS transitions — no internal state, no timers ────────────────
// Visual state is driven entirely by the `state` prop via CSS classes defined
// in index.css (.element-default, .element-comparing, etc.).
// All transitions (color, border, transform) are handled by CSS transition
// rules on those classes — no JS needed.

interface AnimatedArrayElementProps {
  value: number;
  index: number;
  state: ElementState;
  isHighlighted?: boolean;
  showIndex?: boolean;
  width?: number;
  height?: number;
  style?: React.CSSProperties;  // allows parent to inject translateX for swap animation
  onClick?: (index: number) => void;
}

const stateClass: Record<ElementState, string> = {
  default:   'element-default',
  comparing: 'element-comparing',
  swapping:  'element-swapping',
  sorted:    'element-sorted',
  current:   'element-current',
  pivot:     'element-pivot',
  minimum:   'element-default',
  maximum:   'element-default',
  found:     'element-found',
};

const AnimatedArrayElement: React.FC<AnimatedArrayElementProps> = ({
  value,
  index,
  state,
  isHighlighted = false,
  showIndex = true,
  width = 60,
  height = 60,
  style,
  onClick,
}) => {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`
          relative flex items-center justify-center
          rounded-md font-bold text-sm cursor-pointer
          ${stateClass[state]}
          ${isHighlighted ? 'ring-2 ring-accent ring-offset-1 ring-offset-bg-primary' : ''}
        `}
        style={{ width, height, ...style }}
        onClick={() => onClick?.(index)}
      >
        {value}
      </div>

      {showIndex && (
        <span className="text-xs text-text-muted font-medium">[{index}]</span>
      )}
    </div>
  );
};

export default AnimatedArrayElement;
