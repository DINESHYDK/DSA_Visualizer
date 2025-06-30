import React from 'react';

interface ComparisonHighlightProps {
  indices: number[];
  elementWidth: number;
  elementGap: number;
  containerWidth: number;
  type: 'comparison' | 'swap' | 'highlight';
  label?: string;
  color?: string;
}

const ComparisonHighlight: React.FC<ComparisonHighlightProps> = ({
  indices,
  elementWidth,
  elementGap,
  containerWidth,
  type,
  label,
  color
}) => {
  if (indices.length === 0) return null;

  const getHighlightColor = () => {
    if (color) return color;
    
    switch (type) {
      case 'comparison':
        return 'var(--color-comparison)';
      case 'swap':
        return 'var(--color-swap)';
      case 'highlight':
        return 'var(--color-current)';
      default:
        return 'var(--color-primary)';
    }
  };

  const getHighlightPositions = () => {
    return indices.map(index => {
      const elementCenter = index * (elementWidth + elementGap) + elementWidth / 2;
      return elementCenter;
    });
  };

  const positions = getHighlightPositions();
  const highlightColor = getHighlightColor();

  // For single element highlight
  if (indices.length === 1) {
    return (
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${positions[0] - elementWidth / 2 - 4}px`,
          top: '-4px',
          width: `${elementWidth + 8}px`,
          height: `${elementWidth + 8}px`,
          border: `2px solid ${highlightColor}`,
          borderRadius: 'var(--radius-lg)',
          backgroundColor: `${highlightColor}20`,
          animation: type === 'comparison' ? 'pulseGlow 1s ease-in-out infinite' : 'none'
        }}
      >
        {label && (
          <div
            className="absolute -top-6 left-1/2 transform -translate-x-1/2
                     text-xs font-medium px-2 py-1 rounded-curvy-sm
                     bg-bg-card text-text-primary shadow-curvy"
            style={{ color: highlightColor }}
          >
            {label}
          </div>
        )}
      </div>
    );
  }

  // For multiple elements (comparison/swap)
  if (indices.length === 2) {
    const [pos1, pos2] = positions;
    const leftPos = Math.min(pos1, pos2) - elementWidth / 2 - 4;
    const rightPos = Math.max(pos1, pos2) + elementWidth / 2 + 4;
    const width = rightPos - leftPos;

    return (
      <div className="absolute pointer-events-none">
        {/* Connection line */}
        <div
          className="absolute"
          style={{
            left: `${leftPos}px`,
            top: `${elementWidth / 2}px`,
            width: `${width}px`,
            height: '2px',
            backgroundColor: highlightColor,
            animation: type === 'swap' ? 'pulseGlow 0.5s ease-in-out' : 'none'
          }}
        />
        
        {/* Individual element highlights */}
        {positions.map((pos, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              left: `${pos - elementWidth / 2 - 4}px`,
              top: '-4px',
              width: `${elementWidth + 8}px`,
              height: `${elementWidth + 8}px`,
              border: `2px solid ${highlightColor}`,
              borderRadius: 'var(--radius-lg)',
              backgroundColor: `${highlightColor}20`,
              animation: type === 'swap' ? 'pulseGlow 0.5s ease-in-out' : 
                        type === 'comparison' ? 'pulseGlow 1s ease-in-out infinite' : 'none'
            }}
          />
        ))}

        {/* Label */}
        {label && (
          <div
            className="absolute -top-8 text-xs font-medium px-2 py-1 rounded-curvy-sm
                     bg-bg-card text-text-primary shadow-curvy"
            style={{
              left: `${(leftPos + rightPos) / 2}px`,
              transform: 'translateX(-50%)',
              color: highlightColor
            }}
          >
            {label}
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default ComparisonHighlight;