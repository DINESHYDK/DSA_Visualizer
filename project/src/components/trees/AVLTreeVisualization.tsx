import React, { useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';

interface AVLNode {
  value: number;
  left: AVLNode | null;
  right: AVLNode | null;
  height: number;
}

interface AVLTreeVisualizationProps {
  className?: string;
}

const AVLTreeVisualization: React.FC<AVLTreeVisualizationProps> = ({ className = '' }) => {
  const [root, setRoot] = useState<AVLNode | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const getHeight = (node: AVLNode | null): number => {
    return node ? node.height : 0;
  };

  const getBalance = (node: AVLNode | null): number => {
    return node ? getHeight(node.left) - getHeight(node.right) : 0;
  };

  const updateHeight = (node: AVLNode): void => {
    node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
  };

  const rotateRight = (y: AVLNode): AVLNode => {
    const x = y.left!;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    updateHeight(y);
    updateHeight(x);

    return x;
  };

  const rotateLeft = (x: AVLNode): AVLNode => {
    const y = x.right!;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    updateHeight(x);
    updateHeight(y);

    return y;
  };

  const insertNode = (node: AVLNode | null, value: number): AVLNode => {
    if (!node) {
      return { value, left: null, right: null, height: 1 };
    }

    if (value < node.value) {
      node.left = insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = insertNode(node.right, value);
    } else {
      return node; // Duplicate values not allowed
    }

    updateHeight(node);

    const balance = getBalance(node);

    // Left Left Case
    if (balance > 1 && value < node.left!.value) {
      return rotateRight(node);
    }

    // Right Right Case
    if (balance < -1 && value > node.right!.value) {
      return rotateLeft(node);
    }

    // Left Right Case
    if (balance > 1 && value > node.left!.value) {
      node.left = rotateLeft(node.left!);
      return rotateRight(node);
    }

    // Right Left Case
    if (balance < -1 && value < node.right!.value) {
      node.right = rotateRight(node.right!);
      return rotateLeft(node);
    }

    return node;
  };

  const findMinValueNode = (node: AVLNode): AVLNode => {
    let current = node;
    while (current.left) {
      current = current.left;
    }
    return current;
  };

  const deleteNode = (node: AVLNode | null, value: number): AVLNode | null => {
    if (!node) return node;

    if (value < node.value) {
      node.left = deleteNode(node.left, value);
    } else if (value > node.value) {
      node.right = deleteNode(node.right, value);
    } else {
      if (!node.left || !node.right) {
        const temp = node.left || node.right;
        if (!temp) {
          return null;
        } else {
          return temp;
        }
      } else {
        const temp = findMinValueNode(node.right);
        node.value = temp.value;
        node.right = deleteNode(node.right, temp.value);
      }
    }

    updateHeight(node);

    const balance = getBalance(node);

    // Left Left Case
    if (balance > 1 && getBalance(node.left) >= 0) {
      return rotateRight(node);
    }

    // Left Right Case
    if (balance > 1 && getBalance(node.left) < 0) {
      node.left = rotateLeft(node.left!);
      return rotateRight(node);
    }

    // Right Right Case
    if (balance < -1 && getBalance(node.right) <= 0) {
      return rotateLeft(node);
    }

    // Right Left Case
    if (balance < -1 && getBalance(node.right) > 0) {
      node.right = rotateRight(node.right!);
      return rotateLeft(node);
    }

    return node;
  };

  const handleInsert = useCallback(() => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      setIsAnimating(true);
      setTimeout(() => {
        setRoot(prevRoot => insertNode(prevRoot, value));
        setInputValue('');
        setIsAnimating(false);
      }, 300);
    }
  }, [inputValue]);

  const handleDelete = useCallback(() => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      setIsAnimating(true);
      setTimeout(() => {
        setRoot(prevRoot => deleteNode(prevRoot, value));
        setInputValue('');
        setIsAnimating(false);
      }, 300);
    }
  }, [inputValue]);

  const handleReset = useCallback(() => {
    setRoot(null);
    setInputValue('');
    setIsAnimating(false);
  }, []);

  const renderNode = (node: AVLNode | null, x: number, y: number, level: number): JSX.Element[] => {
    if (!node) return [];

    const elements: JSX.Element[] = [];
    const horizontalSpacing = Math.max(120 / (level + 1), 40);

    // Draw connections first (so they appear behind nodes)
    if (node.left) {
      const leftX = x - horizontalSpacing;
      const leftY = y + 80;
      elements.push(
        <line
          key={`line-left-${node.value}-${x}-${y}`}
          x1={x}
          y1={y}
          x2={leftX}
          y2={leftY}
          stroke="#6b7280"
          strokeWidth="2"
          className="transition-all duration-300"
        />
      );
      elements.push(...renderNode(node.left, leftX, leftY, level + 1));
    }

    if (node.right) {
      const rightX = x + horizontalSpacing;
      const rightY = y + 80;
      elements.push(
        <line
          key={`line-right-${node.value}-${x}-${y}`}
          x1={x}
          y1={y}
          x2={rightX}
          y2={rightY}
          stroke="#6b7280"
          strokeWidth="2"
          className="transition-all duration-300"
        />
      );
      elements.push(...renderNode(node.right, rightX, rightY, level + 1));
    }

    // Draw the node
    const balance = getBalance(node);
    const nodeColor = Math.abs(balance) > 1 ? '#ef4444' : '#3b82f6';

    elements.push(
      <g key={`node-${node.value}-${x}-${y}`} className="transition-all duration-300">
        <circle
          cx={x}
          cy={y}
          r="20"
          fill={nodeColor}
          stroke="#1f2937"
          strokeWidth="2"
          className="transition-colors duration-300"
        />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="14"
          fontWeight="bold"
        >
          {node.value}
        </text>
        <text
          x={x + 25}
          y={y - 25}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#6b7280"
          fontSize="10"
        >
          {balance}
        </text>
      </g>
    );

    return elements;
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">AVL Tree Visualization</h3>
        
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <div className="flex gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isAnimating}
            />
            <button
              onClick={handleInsert}
              disabled={isAnimating || !inputValue}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <Plus size={16} />
              Insert
            </button>
            <button
              onClick={handleDelete}
              disabled={isAnimating || !inputValue}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <Minus size={16} />
              Delete
            </button>
          </div>
          
          <button
            onClick={handleReset}
            disabled={isAnimating}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          <p><strong>Balance Factor:</strong> Numbers next to nodes show balance factor (left height - right height)</p>
          <p><strong>Red nodes:</strong> Indicate imbalanced nodes (|balance| &gt; 1)</p>
          <p><strong>Blue nodes:</strong> Balanced nodes</p>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[400px] flex items-center justify-center">
        {root ? (
          <svg width="800" height="400" className="overflow-visible">
            {renderNode(root, 400, 50, 0)}
          </svg>
        ) : (
          <div className="text-gray-500 text-center">
            <p className="text-lg mb-2">Empty AVL Tree</p>
            <p className="text-sm">Insert a value to start building the tree</p>
          </div>
        )}
      </div>

      {isAnimating && (
        <div className="mt-4 flex items-center justify-center">
          <div className="flex items-center gap-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AVLTreeVisualization;