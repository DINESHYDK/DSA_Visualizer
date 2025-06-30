import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Zap, 
  MemoryStick,
  RefreshCw,
  Download,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface AlgorithmPerformance {
  name: string;
  category: string;
  metrics: {
    comparisons: number;
    swaps?: number;
    arrayAccesses: number;
    executionTime: number;
    memoryUsage?: number;
  };
  complexity: {
    time: {
      best: string;
      average: string;
      worst: string;
    };
    space: string;
  };
}

interface PerformanceComparisonChartProps {
  algorithms: AlgorithmPerformance[];
  inputSize: number;
  onRefresh?: () => void;
  className?: string;
}

const PerformanceComparisonChart: React.FC<PerformanceComparisonChartProps> = ({
  algorithms,
  inputSize,
  onRefresh,
  className = ''
}) => {
  const [chartType, setChartType] = useState<'comparisons' | 'time' | 'memory'>('comparisons');
  const [sortBy, setSortBy] = useState<'name' | 'performance'>('performance');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sortedAlgorithms, setSortedAlgorithms] = useState<AlgorithmPerformance[]>([]);

  useEffect(() => {
    sortAlgorithms();
  }, [algorithms, chartType, sortBy]);

  const sortAlgorithms = () => {
    const sorted = [...algorithms].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        // Sort by performance (lower is better)
        if (chartType === 'comparisons') {
          return a.metrics.comparisons - b.metrics.comparisons;
        } else if (chartType === 'time') {
          return a.metrics.executionTime - b.metrics.executionTime;
        } else {
          return (a.metrics.memoryUsage || 0) - (b.metrics.memoryUsage || 0);
        }
      }
    });
    
    setSortedAlgorithms(sorted);
  };

  const getMaxValue = () => {
    if (chartType === 'comparisons') {
      return Math.max(...algorithms.map(alg => alg.metrics.comparisons));
    } else if (chartType === 'time') {
      return Math.max(...algorithms.map(alg => alg.metrics.executionTime));
    } else {
      return Math.max(...algorithms.map(alg => alg.metrics.memoryUsage || 0));
    }
  };

  const getPercentage = (value: number) => {
    const max = getMaxValue();
    return max > 0 ? (value / max) * 100 : 0;
  };

  const getBarColor = (algorithm: AlgorithmPerformance) => {
    const category = algorithm.category;
    
    if (category === 'sorting') {
      if (algorithm.name.includes('Bubble') || algorithm.name.includes('Selection') || algorithm.name.includes('Insertion')) {
        return 'bg-warning';
      } else {
        return 'bg-success';
      }
    } else if (category === 'search') {
      return 'bg-info';
    } else {
      return 'bg-primary';
    }
  };

  const getMetricValue = (algorithm: AlgorithmPerformance) => {
    if (chartType === 'comparisons') {
      return algorithm.metrics.comparisons.toLocaleString();
    } else if (chartType === 'time') {
      return `${(algorithm.metrics.executionTime / 1000).toFixed(2)}s`;
    } else {
      return `${((algorithm.metrics.memoryUsage || 0) / 1024).toFixed(1)}KB`;
    }
  };

  const getMetricIcon = () => {
    if (chartType === 'comparisons') {
      return <BarChart3 className="h-5 w-5 text-primary" />;
    } else if (chartType === 'time') {
      return <Clock className="h-5 w-5 text-warning" />;
    } else {
      return <MemoryStick className="h-5 w-5 text-info" />;
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const exportData = () => {
    const data = {
      algorithms: algorithms.map(alg => ({
        name: alg.name,
        category: alg.category,
        metrics: alg.metrics,
        complexity: alg.complexity
      })),
      inputSize,
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'algorithm-performance.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-bg-primary p-4 overflow-auto' : ''} ${className}`}>
      <div className={`bg-bg-card rounded-curvy shadow-curvy ${isFullscreen ? 'h-full overflow-auto' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-accent/20">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold text-primary">Performance Comparison</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 rounded-curvy text-text-muted hover:text-primary hover:bg-accent/20 
                         transition-colors duration-200"
                title="Refresh Data"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            )}
            
            <button
              onClick={exportData}
              className="p-2 rounded-curvy text-text-muted hover:text-primary hover:bg-accent/20 
                       transition-colors duration-200"
              title="Export Data"
            >
              <Download className="h-4 w-4" />
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-curvy text-text-muted hover:text-primary hover:bg-accent/20 
                       transition-colors duration-200"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-accent/20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-text-secondary">
                <span className="font-medium">Input Size:</span> {inputSize} elements
              </div>
              
              <div className="text-sm text-text-secondary">
                <span className="font-medium">Algorithms:</span> {algorithms.length} compared
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Chart Type Selector */}
              <div>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value as any)}
                  className="p-2 bg-accent/20 border border-accent/40 rounded-curvy text-text-primary
                           focus:border-primary focus:ring-1 focus:ring-primary/20"
                >
                  <option value="comparisons">Comparisons</option>
                  <option value="time">Execution Time</option>
                  <option value="memory">Memory Usage</option>
                </select>
              </div>
              
              {/* Sort Order */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="p-2 bg-accent/20 border border-accent/40 rounded-curvy text-text-primary
                           focus:border-primary focus:ring-1 focus:ring-primary/20"
                >
                  <option value="performance">Sort by Performance</option>
                  <option value="name">Sort by Name</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            {getMetricIcon()}
            <h4 className="text-lg font-medium text-text-primary">
              {chartType === 'comparisons' ? 'Comparison Operations' : 
               chartType === 'time' ? 'Execution Time' : 'Memory Usage'}
            </h4>
          </div>
          
          <div className="space-y-4">
            {sortedAlgorithms.map((algorithm, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-text-primary">{algorithm.name}</span>
                    <span className="text-xs text-text-muted capitalize">({algorithm.category})</span>
                  </div>
                  <span className="text-sm font-medium text-text-secondary">
                    {getMetricValue(algorithm)}
                  </span>
                </div>
                
                <div className="w-full bg-accent/20 rounded-curvy h-6 overflow-hidden">
                  <div
                    className={`h-full ${getBarColor(algorithm)} rounded-curvy transition-all duration-500 flex items-center px-2`}
                    style={{
                      width: `${Math.max(5, getPercentage(
                        chartType === 'comparisons' ? algorithm.metrics.comparisons :
                        chartType === 'time' ? algorithm.metrics.executionTime :
                        algorithm.metrics.memoryUsage || 0
                      ))}%`
                    }}
                  >
                    <span className="text-xs text-bg-primary font-medium truncate">
                      {getMetricValue(algorithm)}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between text-xs text-text-muted">
                  <span>
                    {chartType === 'comparisons' && algorithm.metrics.swaps !== undefined && 
                      `Swaps: ${algorithm.metrics.swaps.toLocaleString()}`}
                    {chartType === 'time' && 
                      `Complexity: ${algorithm.complexity.time.average}`}
                    {chartType === 'memory' && 
                      `Space: ${algorithm.complexity.space}`}
                  </span>
                  <span>
                    {chartType === 'comparisons' && 
                      `Accesses: ${algorithm.metrics.arrayAccesses.toLocaleString()}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="p-6 border-t border-accent/20 bg-accent/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-accent/10 rounded-curvy p-3 border border-accent/20">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingDown className="h-4 w-4 text-success" />
                <h5 className="font-medium text-text-primary text-sm">Best Performance</h5>
              </div>
              
              {sortedAlgorithms.length > 0 && (
                <div className="text-sm">
                  <div className="font-medium text-success">{sortedAlgorithms[0].name}</div>
                  <div className="text-xs text-text-muted">
                    {chartType === 'comparisons' 
                      ? `${sortedAlgorithms[0].metrics.comparisons.toLocaleString()} comparisons` 
                      : chartType === 'time'
                        ? `${(sortedAlgorithms[0].metrics.executionTime / 1000).toFixed(2)}s`
                        : `${((sortedAlgorithms[0].metrics.memoryUsage || 0) / 1024).toFixed(1)}KB`}
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-accent/10 rounded-curvy p-3 border border-accent/20">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-error" />
                <h5 className="font-medium text-text-primary text-sm">Worst Performance</h5>
              </div>
              
              {sortedAlgorithms.length > 0 && (
                <div className="text-sm">
                  <div className="font-medium text-error">{sortedAlgorithms[sortedAlgorithms.length - 1].name}</div>
                  <div className="text-xs text-text-muted">
                    {chartType === 'comparisons' 
                      ? `${sortedAlgorithms[sortedAlgorithms.length - 1].metrics.comparisons.toLocaleString()} comparisons` 
                      : chartType === 'time'
                        ? `${(sortedAlgorithms[sortedAlgorithms.length - 1].metrics.executionTime / 1000).toFixed(2)}s`
                        : `${((sortedAlgorithms[sortedAlgorithms.length - 1].metrics.memoryUsage || 0) / 1024).toFixed(1)}KB`}
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-accent/10 rounded-curvy p-3 border border-accent/20">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="h-4 w-4 text-primary" />
                <h5 className="font-medium text-text-primary text-sm">Performance Ratio</h5>
              </div>
              
              {sortedAlgorithms.length > 1 && (
                <div className="text-sm">
                  <div className="font-medium text-primary">
                    {chartType === 'comparisons' 
                      ? (sortedAlgorithms[sortedAlgorithms.length - 1].metrics.comparisons / 
                         Math.max(1, sortedAlgorithms[0].metrics.comparisons)).toFixed(1) + 'x'
                      : chartType === 'time'
                        ? (sortedAlgorithms[sortedAlgorithms.length - 1].metrics.executionTime / 
                           Math.max(1, sortedAlgorithms[0].metrics.executionTime)).toFixed(1) + 'x'
                        : (((sortedAlgorithms[sortedAlgorithms.length - 1].metrics.memoryUsage || 0) / 
                           Math.max(1, (sortedAlgorithms[0].metrics.memoryUsage || 1)))).toFixed(1) + 'x'}
                  </div>
                  <div className="text-xs text-text-muted">
                    Worst vs. Best
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceComparisonChart;