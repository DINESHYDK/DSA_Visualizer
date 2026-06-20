import React from 'react';
import { Clock, Zap, MemoryStick, CheckCircle, XCircle } from 'lucide-react';
import { bubbleSortInfo } from '../../algorithms/sorting/bubbleSort';
import { selectionSortInfo } from '../../algorithms/sorting/selectionSort';
import { insertionSortInfo } from '../../algorithms/sorting/insertionSort';
import { mergeSortInfo } from '../../algorithms/sorting/mergeSort';
import { quickSortInfo } from '../../algorithms/sorting/quickSort';
import { heapSortInfo } from '../../algorithms/sorting/heapSort';

interface AlgorithmComparisonProps {
  selectedAlgorithm?: 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick' | 'heap';
  onAlgorithmSelect: (algorithm: 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick' | 'heap') => void;
}

const AlgorithmComparison: React.FC<AlgorithmComparisonProps> = ({
  selectedAlgorithm,
  onAlgorithmSelect
}) => {
  const algorithms = [
    { id: 'bubble' as const, info: bubbleSortInfo, category: 'Basic' },
    { id: 'selection' as const, info: selectionSortInfo, category: 'Basic' },
    { id: 'insertion' as const, info: insertionSortInfo, category: 'Basic' },
    { id: 'merge' as const, info: mergeSortInfo, category: 'Advanced' },
    { id: 'quick' as const, info: quickSortInfo, category: 'Advanced' },
    { id: 'heap' as const, info: heapSortInfo, category: 'Advanced' }
  ];

  const getComplexityColor = (complexity: string) => {
    if (complexity.includes('n²')) return 'text-error';
    if (complexity.includes('n log n')) return 'text-success';
    if (complexity.includes('n')) return 'text-info';
    return 'text-text-secondary';
  };

  const getCategoryColor = (category: string) => {
    return category === 'Advanced' ? 'text-primary' : 'text-info';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-primary">Algorithm Selection</h3>
      
      <div className="grid grid-cols-1 gap-3">
        {algorithms.map((algorithm) => (
          <div
            key={algorithm.id}
            className={`bg-bg-card rounded-lg p-4 border-2 cursor-pointer
                       transition-colors duration-150 ${
              selectedAlgorithm === algorithm.id
                ? 'border-accent bg-accent/5'
                : 'border-border hover:border-border-hover'
            }`}
            onClick={() => onAlgorithmSelect(algorithm.id)}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <h4 className="text-sm font-semibold text-text-primary">
                  {algorithm.info.name}
                </h4>
                <span className={`text-xs px-2 py-0.5 rounded bg-bg-elevated ${getCategoryColor(algorithm.category)}`}>
                  {algorithm.category}
                </span>
              </div>
              {selectedAlgorithm === algorithm.id && (
                <div className="w-2 h-2 bg-accent rounded-full" />
              )}
            </div>

            {/* Description */}
            <p className="text-text-muted text-xs mb-3 leading-relaxed">
              {algorithm.info.description}
            </p>

            {/* Complexity Info */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Time Complexity */}
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <Clock className="h-3 w-3 text-accent" />
                  <span className="text-text-muted">Time</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Avg:</span>
                    <span className={`font-mono font-semibold ${getComplexityColor(algorithm.info.timeComplexity.average)}`}>
                      {algorithm.info.timeComplexity.average}
                    </span>
                  </div>
                </div>
              </div>

              {/* Space & Properties */}
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <MemoryStick className="h-3 w-3 text-info" />
                  <span className="text-text-muted">Space</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Space:</span>
                    <span className={`font-mono font-semibold ${getComplexityColor(algorithm.info.spaceComplexity)}`}>
                      {algorithm.info.spaceComplexity}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Properties */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  {algorithm.info.stable ? (
                    <CheckCircle className="h-3 w-3 text-success" />
                  ) : (
                    <XCircle className="h-3 w-3 text-error" />
                  )}
                  <span className="text-xs text-text-muted">Stable</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  {algorithm.info.inPlace ? (
                    <CheckCircle className="h-3 w-3 text-success" />
                  ) : (
                    <XCircle className="h-3 w-3 text-error" />
                  )}
                  <span className="text-xs text-text-muted">In-place</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selection Indicator */}
      {selectedAlgorithm && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg p-3">
          <p className="text-sm text-accent font-medium">
            {algorithms.find(alg => alg.id === selectedAlgorithm)?.info.name} selected
          </p>
        </div>
      )}
    </div>
  );
};

export default AlgorithmComparison;