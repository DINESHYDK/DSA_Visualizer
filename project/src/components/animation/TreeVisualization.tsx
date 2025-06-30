import React from 'react';
import { ArrayElement } from '../../types';

interface TreeVisualizationProps {
  elements: ArrayElement[];
  highlightedIndices?: number[];
  showIndices?: boolean;
  showValues?: boolean;
  width?: number;
  height?: number;
  onElementClick?: (index: number) => void;
  className?: string;
}

interface TreeNode {
  index: number;
  value: number;
  x: number;
  y: number;
  element: ArrayElement;
}

const TreeVisualization: React.FC<TreeVisualizationProps> = ({
  elements,
  highlightedIndices = [],
  showIndices = true,
  showValues = true,
  width = 800,
  height = 400,
  onElementClick,
  className = ''
}) => {
  // Calculate tree layout positions
  const calculateTreeLayout = (): TreeNode[] => {
    const nodes: TreeNode[] = [];
    const n = elements.length;
    
    if (n === 0) return nodes;

    // Calculate the height of the tree
    const treeHeight = Math.floor(Math.log2(n)) + 1;
    const nodeRadius = 25;
    const levelHeight = (height - 100) / Math.max(1, treeHeight - 1);
    
    for (let i = 0; i < n; i++) {
      const level = Math.floor(Math.log2(i + 1));
      const positionInLevel = i - (Math.pow(2, level) - 1);
      const nodesInLevel = Math.pow(2, level);
      
      // Calculate x position
      const levelWidth = width - 100;
      const nodeSpacing = levelWidth / (nodesInLevel + 1);
      const x = 50 + nodeSpacing * (positionInLevel + 1);
      
      // Calculate y position
      const y = 50 + level * levelHeight;
      
      nodes.push({
        index: i,
        value: elements[i].value,
        x,
        y,
        element: elements[i]
      });
    }
    
    return nodes;
  };

  const nodes = calculateTreeLayout();

  // Get parent index for a given node
  const getParentIndex = (index: number): number => {
    return Math.floor((index - 1) / 2);
  };

  // Get children indices for a given node
  const getChildrenIndices = (index: number): number[] => {
    const left = 2 * index + 1;
    const right = 2 * index + 2;
    const children = [];
    
    if (left < elements.length) children.push(left);
    if (right < elements.length) children.push(right);
    
    return children;
  };

  // Get node color based on state
  const getNodeColor = (element: ArrayElement, isHighlighted: boolean) => {
    if (isHighlighted) {
      return 'var(--color-primary)';
    }
    
    switch (element.state) {
      case 'comparing':
        return 'var(--color-comparison)';
      case 'swapping':
        return 'var(--color-swap)';
      case 'sorted':
        return 'var(--color-sorted)';
      case 'current':
        return 'var(--color-current)';
      case 'pivot':
        return 'var(--color-pivot)';
      default:
        return 'var(--color-accent)';
    }
  };

  // Get edge color
  const getEdgeColor = (parentIndex: number, childIndex: number) => {
    const parentHighlighted = highlightedIndices.includes(parentIndex);
    const childHighlighted = highlightedIndices.includes(childIndex);
    
    if (parentHighlighted || childHighlighted) {
      return 'var(--color-primary)';
    }
    
    return 'var(--color-text-muted)';
  };

  return (
    <div className={`relative ${className}`}>
      <svg
        width={width}
        height={height}
        className="border border-accent/20 rounded-curvy bg-bg-secondary/20"
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* Render edges first (so they appear behind nodes) */}
        {nodes.map((node) => {
          const children = getChildrenIndices(node.index);
          return children.map((childIndex) => {
            const childNode = nodes[childIndex];
            if (!childNode) return null;
            
            return (
              <line
                key={`edge-${node.index}-${childIndex}`}
                x1={node.x}
                y1={node.y}
                x2={childNode.x}
                y2={childNode.y}
                stroke={getEdgeColor(node.index, childIndex)}
                strokeWidth="2"
                className="transition-all duration-300"
              />
            );
          });
        })}

        {/* Render nodes */}
        {nodes.map((node) => {
          const isHighlighted = highlightedIndices.includes(node.index);
          const nodeColor = getNodeColor(node.element, isHighlighted);
          
          return (
            <g key={`node-${node.index}`} className="cursor-pointer">
              {/* Node circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r="25"
                fill={nodeColor}
                stroke={isHighlighted ? 'var(--color-primary)' : 'var(--color-text-muted)'}
                strokeWidth={isHighlighted ? "3" : "2"}
                className="transition-all duration-300 hover:stroke-primary"
                onClick={() => onElementClick?.(node.index)}
              />
              
              {/* Glow effect for highlighted nodes */}
              {isHighlighted && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="30"
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeWidth="1"
                  opacity="0.3"
                  className="animate-pulse-glow"
                />
              )}
              
              {/* Node value */}
              {showValues && (
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  className="text-sm font-bold fill-text-primary pointer-events-none"
                  style={{ fontSize: '14px' }}
                >
                  {node.value}
                </text>
              )}
              
              {/* Node index */}
              {showIndices && (
                <text
                  x={node.x}
                  y={node.y + 45}
                  textAnchor="middle"
                  className="text-xs fill-text-muted pointer-events-none"
                  style={{ fontSize: '10px' }}
                >
                  [{node.index}]
                </text>
              )}
              
              {/* State indicator */}
              {node.element.state !== 'default' && (
                <circle
                  cx={node.x + 18}
                  cy={node.y - 18}
                  r="4"
                  fill={nodeColor}
                  className="animate-pulse"
                />
              )}
            </g>
          );
        })}

        {/* Tree structure labels */}
        <text
          x={20}
          y={30}
          className="text-sm font-medium fill-text-secondary"
          style={{ fontSize: '12px' }}
        >
          Binary Heap Tree Structure
        </text>
        
        {/* Heap property indicator */}
        <text
          x={20}
          y={height - 20}
          className="text-xs fill-text-muted"
          style={{ fontSize: '10px' }}
        >
          Parent ≥ Children (Max Heap Property)
        </text>
      </svg>

      {/* Array representation below tree */}
      <div className="mt-4 p-4 bg-bg-card rounded-curvy border border-accent/20">
        <h4 className="text-sm font-medium text-text-secondary mb-3">Array Representation</h4>
        <div className="flex flex-wrap gap-2 justify-center">
          {elements.map((element, index) => (
            <div
              key={element.id}
              className={`
                w-12 h-12 rounded-curvy border-2 flex items-center justify-center
                text-sm font-semibold cursor-pointer transition-all duration-300
                ${highlightedIndices.includes(index) 
                  ? 'border-primary bg-primary/20 text-primary' 
                  : 'border-accent bg-accent/20 text-text-primary hover:border-primary/60'
                }
              `}
              onClick={() => onElementClick?.(index)}
            >
              <div className="text-center">
                <div className="text-xs">{element.value}</div>
                <div className="text-xs text-text-muted">[{index}]</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Heap relationships */}
        <div className="mt-3 text-xs text-text-muted text-center">
          <div>Parent of index i: ⌊(i-1)/2⌋ | Left child: 2i+1 | Right child: 2i+2</div>
        </div>
      </div>
    </div>
  );
};

export default TreeVisualization;