import React from 'react';
import AnimatedArrayElement from './AnimatedArrayElement';
import { ArrayElement } from '../../types';

interface ArrayVisualizationProps {
  elements: ArrayElement[];
  highlightedIndices?: number[];
  showIndices?: boolean;
  showValues?: boolean;
  elementWidth?: number;
  elementHeight?: number;
  gap?: number;
  onElementClick?: (index: number) => void;
  className?: string;
}

const ArrayVisualization: React.FC<ArrayVisualizationProps> = ({
  elements,
  highlightedIndices = [],
  showIndices = true,
  showValues = true,
  elementWidth = 60,
  elementHeight = 60,
  gap = 8,
  onElementClick,
  className = ''
}) => {
  return (
    <div className={`flex flex-wrap justify-center items-end ${className}`}>
      <div 
        className="flex items-end"
        style={{ gap: `${gap}px` }}
      >
        {elements.map((element, index) => (
          <div
            key={element.id}
            className="transition-all duration-300 ease-in-out"
            style={{
              transform: element.state === 'swapping' ? 'translateY(-10px)' : 'translateY(0px)'
            }}
          >
            <AnimatedArrayElement
              value={element.value}
              index={element.index}
              state={element.state}
              isHighlighted={highlightedIndices.includes(index)}
              showIndex={showIndices}
              showValue={showValues}
              width={elementWidth}
              height={elementHeight}
              onClick={onElementClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArrayVisualization;