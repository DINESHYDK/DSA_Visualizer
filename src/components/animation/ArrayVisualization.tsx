import React, { useEffect, useRef, useState } from 'react';
import AnimatedArrayElement from './AnimatedArrayElement';
import { ArrayElement } from '../../types';

// ── R3.4: Simplified swap animation ─────────────────────────────────────────
// When two elements are in 'swapping' state, we temporarily apply a translateX
// offset so they visually glide past each other. After 250ms the CSS transition
// completes and we clear the transform — by then the reducer has already updated
// the actual array values, so the visual matches reality.

interface ArrayVisualizationProps {
  elements: ArrayElement[];
  highlightedIndices?: number[];
  showIndices?: boolean;
  elementWidth?: number;
  elementHeight?: number;
  gap?: number;
  onElementClick?: (index: number) => void;
  className?: string;
}

const TRANSITION_MS = 250; // must match CSS transition duration in index.css

const ArrayVisualization: React.FC<ArrayVisualizationProps> = ({
  elements,
  highlightedIndices = [],
  showIndices = true,
  elementWidth = 60,
  elementHeight = 60,
  gap = 12,
  onElementClick,
  className = '',
}) => {
  // swapOffsets[i] = translateX in px while element i is mid-swap
  const [swapOffsets, setSwapOffsets] = useState<Record<number, number>>({});
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const swappingIndices = elements
      .map((el, i) => (el.state === 'swapping' ? i : -1))
      .filter((i) => i !== -1);

    if (swappingIndices.length === 2) {
      const [a, b] = swappingIndices;
      const stride = elementWidth + gap;
      const offsetAtoB = (b - a) * stride;

      setSwapOffsets({ [a]: offsetAtoB, [b]: -offsetAtoB });

      // Clear after CSS transition finishes
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
      clearTimerRef.current = setTimeout(() => setSwapOffsets({}), TRANSITION_MS + 20);
    } else if (swappingIndices.length === 0) {
      setSwapOffsets({});
    }
  }, [elements, elementWidth, gap]);

  // Cleanup on unmount
  useEffect(() => () => {
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
  }, []);

  return (
    <div className={`flex justify-center items-end ${className}`}>
      <div className="flex items-end" style={{ gap }}>
        {elements.map((element, index) => {
          const offsetX = swapOffsets[index] ?? 0;
          const isSwapping = element.state === 'swapping';

          return (
            <AnimatedArrayElement
              key={element.id}
              value={element.value}
              index={element.index}
              state={element.state}
              isHighlighted={highlightedIndices.includes(index)}
              showIndex={showIndices}
              width={elementWidth}
              height={elementHeight}
              style={{
                transform: isSwapping
                  ? `translateX(${offsetX}px) translateY(-8px)`
                  : offsetX !== 0
                  ? `translateX(${offsetX}px)`
                  : undefined,
                transition: `transform ${TRANSITION_MS}ms ease`,
                zIndex: isSwapping ? 10 : 1,
              }}
              onClick={onElementClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ArrayVisualization;
