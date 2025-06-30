import React, { useState, useEffect } from 'react';
import { 
  MemoryStick, 
  Database, 
  Layers, 
  GitBranch, 
  Plus, 
  Minus, 
  RefreshCw,
  HelpCircle,
  Info
} from 'lucide-react';

interface MemoryBlock {
  id: string;
  size: number;
  type: 'input' | 'auxiliary' | 'output' | 'stack' | 'heap';
  label: string;
  color: string;
}

interface SpaceComplexityVisualizerProps {
  algorithm: string;
  inputSize: number;
  className?: string;
}

const SpaceComplexityVisualizer: React.FC<SpaceComplexityVisualizerProps> = ({
  algorithm,
  inputSize,
  className = ''
}) => {
  const [memoryBlocks, setMemoryBlocks] = useState<MemoryBlock[]>([]);
  const [totalMemory, setTotalMemory] = useState(0);
  const [showExplanations, setShowExplanations] = useState(true);
  const [animationStep, setAnimationStep] = useState(0);

  // Initialize memory visualization based on algorithm
  useEffect(() => {
    generateMemoryVisualization();
  }, [algorithm, inputSize]);

  const generateMemoryVisualization = () => {
    const blocks: MemoryBlock[] = [];
    let total = 0;
    
    // Input array - common to all algorithms
    const inputSize_bytes = inputSize * 4; // Assuming 4 bytes per integer
    blocks.push({
      id: 'input',
      size: inputSize_bytes,
      type: 'input',
      label: 'Input Array',
      color: 'bg-info'
    });
    total += inputSize_bytes;

    // Algorithm-specific auxiliary space
    switch (algorithm) {
      case 'bubble':
      case 'selection':
      case 'insertion':
        // O(1) extra space
        blocks.push({
          id: 'aux',
          size: 12, // A few variables
          type: 'auxiliary',
          label: 'Variables',
          color: 'bg-primary'
        });
        total += 12;
        break;
        
      case 'merge':
        // O(n) extra space
        const mergeAuxSize = inputSize_bytes;
        blocks.push({
          id: 'aux',
          size: mergeAuxSize,
          type: 'auxiliary',
          label: 'Auxiliary Array',
          color: 'bg-primary'
        });
        total += mergeAuxSize;
        
        // Call stack for recursion
        const mergeStackSize = Math.ceil(Math.log2(inputSize)) * 20; // log n stack frames
        blocks.push({
          id: 'stack',
          size: mergeStackSize,
          type: 'stack',
          label: 'Call Stack',
          color: 'bg-warning'
        });
        total += mergeStackSize;
        break;
        
      case 'quick':
        // O(log n) stack space for recursion
        const quickStackSize = Math.ceil(Math.log2(inputSize)) * 20; // log n stack frames
        blocks.push({
          id: 'stack',
          size: quickStackSize,
          type: 'stack',
          label: 'Call Stack',
          color: 'bg-warning'
        });
        total += quickStackSize;
        
        // A few variables
        blocks.push({
          id: 'aux',
          size: 16,
          type: 'auxiliary',
          label: 'Partition Variables',
          color: 'bg-primary'
        });
        total += 16;
        break;
        
      case 'heap':
        // O(1) extra space
        blocks.push({
          id: 'aux',
          size: 16,
          type: 'auxiliary',
          label: 'Heap Variables',
          color: 'bg-primary'
        });
        total += 16;
        break;
        
      case 'binary':
        // O(1) extra space
        blocks.push({
          id: 'aux',
          size: 12,
          type: 'auxiliary',
          label: 'Search Variables',
          color: 'bg-primary'
        });
        total += 12;
        break;
        
      default:
        // Generic case
        blocks.push({
          id: 'aux',
          size: 20,
          type: 'auxiliary',
          label: 'Auxiliary Space',
          color: 'bg-primary'
        });
        total += 20;
    }

    // Output space - if applicable
    if (['merge', 'quick', 'heap'].includes(algorithm)) {
      blocks.push({
        id: 'output',
        size: inputSize_bytes,
        type: 'output',
        label: 'Output Array',
        color: 'bg-success'
      });
      total += inputSize_bytes;
    }

    setMemoryBlocks(blocks);
    setTotalMemory(total);
  };

  const getSpaceComplexity = () => {
    switch (algorithm) {
      case 'bubble':
      case 'selection':
      case 'insertion':
      case 'heap':
      case 'binary':
        return 'O(1)';
      case 'quick':
        return 'O(log n)';
      case 'merge':
        return 'O(n)';
      default:
        return 'O(?)';
    }
  };

  const getSpaceComplexityExplanation = () => {
    switch (algorithm) {
      case 'bubble':
      case 'selection':
      case 'insertion':
        return 'Uses a constant amount of extra space regardless of input size. Only a few variables are needed for the algorithm.';
      case 'heap':
        return 'Performs sorting in-place with only a constant amount of extra variables needed.';
      case 'quick':
        return 'Uses O(log n) space for the recursion call stack in the average case. Worst case can be O(n) for skewed partitions.';
      case 'merge':
        return 'Requires O(n) extra space for the auxiliary array used during the merge operation.';
      case 'binary':
        return 'Uses only a constant amount of extra space for variables like left, right, and mid pointers.';
      default:
        return 'Space complexity explanation not available for this algorithm.';
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const getPercentage = (size: number) => {
    return (size / totalMemory) * 100;
  };

  const getNextAnimationStep = () => {
    setAnimationStep(prev => (prev + 1) % (memoryBlocks.length + 1));
  };

  const resetAnimation = () => {
    setAnimationStep(0);
  };

  return (
    <div className={`bg-bg-card rounded-curvy p-6 shadow-curvy ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <MemoryStick className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-semibold text-primary">Space Complexity Visualization</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowExplanations(!showExplanations)}
            className="p-2 rounded-curvy text-text-muted hover:text-primary hover:bg-accent/20 
                     transition-colors duration-200"
            title={showExplanations ? "Hide Explanations" : "Show Explanations"}
          >
            <Info className="h-4 w-4" />
          </button>
          
          <button
            onClick={resetAnimation}
            className="p-2 rounded-curvy text-text-muted hover:text-primary hover:bg-accent/20 
                     transition-colors duration-200"
            title="Reset Animation"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Algorithm Space Complexity */}
      <div className="bg-accent/10 rounded-curvy p-4 border border-accent/20 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-text-primary">
            {algorithm.charAt(0).toUpperCase() + algorithm.slice(1)} Sort - Space Complexity
          </h4>
          <div className="text-lg font-mono font-bold text-primary">
            {getSpaceComplexity()}
          </div>
        </div>
        
        {showExplanations && (
          <p className="text-sm text-text-muted">
            {getSpaceComplexityExplanation()}
          </p>
        )}
      </div>

      {/* Memory Visualization */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-text-primary">Memory Usage Breakdown</h4>
          <div className="text-sm text-text-secondary">
            Total: {formatBytes(totalMemory)}
          </div>
        </div>
        
        {/* Memory Blocks */}
        <div className="space-y-4">
          {memoryBlocks.map((block, index) => (
            <div 
              key={block.id} 
              className={`transition-all duration-500 ${animationStep > index ? 'opacity-100' : 'opacity-40'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  {block.type === 'input' && <Database className="h-4 w-4 text-info" />}
                  {block.type === 'auxiliary' && <Plus className="h-4 w-4 text-primary" />}
                  {block.type === 'output' && <Layers className="h-4 w-4 text-success" />}
                  {block.type === 'stack' && <GitBranch className="h-4 w-4 text-warning" />}
                  <span className="text-sm font-medium text-text-primary">{block.label}</span>
                </div>
                <span className="text-sm text-text-secondary">{formatBytes(block.size)}</span>
              </div>
              
              <div className="w-full bg-accent/20 rounded-curvy h-8 overflow-hidden">
                <div
                  className={`h-full ${block.color} rounded-curvy transition-all duration-500 flex items-center px-3`}
                  style={{
                    width: `${Math.max(5, getPercentage(block.size))}%`
                  }}
                >
                  <span className="text-xs text-bg-primary font-medium">
                    {Math.round(getPercentage(block.size))}%
                  </span>
                </div>
              </div>
              
              {showExplanations && (
                <div className="text-xs text-text-muted mt-1">
                  {block.type === 'input' && 'Original input data that the algorithm processes'}
                  {block.type === 'auxiliary' && 'Additional memory used by the algorithm during execution'}
                  {block.type === 'output' && 'Memory used to store the final result'}
                  {block.type === 'stack' && 'Memory used by the call stack for recursive calls'}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Animation Controls */}
        <div className="flex justify-center mt-6">
          <button
            onClick={getNextAnimationStep}
            className="px-4 py-2 bg-primary hover:bg-hover text-bg-primary rounded-curvy
                     transition-all duration-200 hover-lift font-medium"
          >
            Next Step
          </button>
        </div>
      </div>

      {/* Space Complexity Explanation */}
      {showExplanations && (
        <div className="mt-8 bg-primary/10 rounded-curvy p-4 border border-primary/20">
          <div className="flex items-center space-x-2 mb-3">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h5 className="font-medium text-primary">Understanding Space Complexity</h5>
          </div>
          
          <div className="space-y-3 text-sm text-text-secondary">
            <p>
              Space complexity measures the total amount of memory an algorithm uses relative to the input size.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="space-y-2">
                <h6 className="font-medium text-text-primary">Types of Space Usage</h6>
                <ul className="list-disc list-inside text-xs text-text-muted space-y-1">
                  <li><span className="text-info">Input Space:</span> Memory needed to store the input</li>
                  <li><span className="text-primary">Auxiliary Space:</span> Extra memory used during execution</li>
                  <li><span className="text-warning">Stack Space:</span> Memory used by recursion call stack</li>
                  <li><span className="text-success">Output Space:</span> Memory needed for the result</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h6 className="font-medium text-text-primary">Common Space Complexities</h6>
                <ul className="list-disc list-inside text-xs text-text-muted space-y-1">
                  <li><span className="font-mono text-success">O(1):</span> Constant space (in-place algorithms)</li>
                  <li><span className="font-mono text-info">O(log n):</span> Logarithmic space (balanced recursion)</li>
                  <li><span className="font-mono text-warning">O(n):</span> Linear space (auxiliary arrays)</li>
                  <li><span className="font-mono text-error">O(n²):</span> Quadratic space (matrices, 2D arrays)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpaceComplexityVisualizer;