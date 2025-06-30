import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  BarChart3, 
  Clock, 
  MemoryStick, 
  Zap, 
  RefreshCw,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface ComplexityCalculatorProps {
  className?: string;
}

const ComplexityCalculator: React.FC<ComplexityCalculatorProps> = ({
  className = ''
}) => {
  const [inputSize, setInputSize] = useState<number>(100);
  const [complexityClass, setComplexityClass] = useState<string>('n');
  const [constant, setConstant] = useState<number>(1);
  const [result, setResult] = useState<number>(0);
  const [comparisonResults, setComparisonResults] = useState<{[key: string]: number}>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(true);

  // Calculate result when inputs change
  useEffect(() => {
    calculateResult();
    calculateComparisons();
  }, [inputSize, complexityClass, constant]);

  const calculateResult = () => {
    const n = inputSize;
    let calculatedResult = 0;
    
    switch (complexityClass) {
      case '1':
        calculatedResult = constant;
        break;
      case 'log_n':
        calculatedResult = constant * Math.log2(n);
        break;
      case 'n':
        calculatedResult = constant * n;
        break;
      case 'n_log_n':
        calculatedResult = constant * n * Math.log2(n);
        break;
      case 'n_squared':
        calculatedResult = constant * n * n;
        break;
      case 'n_cubed':
        calculatedResult = constant * n * n * n;
        break;
      case '2_pow_n':
        calculatedResult = constant * Math.pow(2, n);
        break;
      default:
        calculatedResult = 0;
    }
    
    setResult(Math.floor(calculatedResult));
  };

  const calculateComparisons = () => {
    const n = inputSize;
    const results: {[key: string]: number} = {
      'O(1)': constant,
      'O(log n)': Math.floor(constant * Math.log2(n)),
      'O(n)': constant * n,
      'O(n log n)': Math.floor(constant * n * Math.log2(n)),
      'O(n²)': constant * n * n
    };
    
    // Only calculate exponential for small n to avoid overflow
    if (n <= 30) {
      results['O(2ⁿ)'] = constant * Math.pow(2, n);
    } else {
      results['O(2ⁿ)'] = Infinity;
    }
    
    setComparisonResults(results);
  };

  const formatNumber = (num: number): string => {
    if (num === Infinity) return '∞';
    if (num > 1e9) return '> 1 billion';
    if (num > 1e6) return `${(num / 1e6).toFixed(1)} million`;
    if (num > 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const getComplexityColor = (complexity: string): string => {
    switch (complexity) {
      case 'O(1)': return 'text-success';
      case 'O(log n)': return 'text-success';
      case 'O(n)': return 'text-warning';
      case 'O(n log n)': return 'text-warning';
      case 'O(n²)': return 'text-error';
      case 'O(2ⁿ)': return 'text-error';
      default: return 'text-text-primary';
    }
  };

  const getComplexityName = (complexity: string): string => {
    switch (complexity) {
      case '1': return 'Constant - O(1)';
      case 'log_n': return 'Logarithmic - O(log n)';
      case 'n': return 'Linear - O(n)';
      case 'n_log_n': return 'Linearithmic - O(n log n)';
      case 'n_squared': return 'Quadratic - O(n²)';
      case 'n_cubed': return 'Cubic - O(n³)';
      case '2_pow_n': return 'Exponential - O(2ⁿ)';
      default: return '';
    }
  };

  const getComplexityFormula = (complexity: string): string => {
    switch (complexity) {
      case '1': return `${constant}`;
      case 'log_n': return `${constant} × log₂(${inputSize})`;
      case 'n': return `${constant} × ${inputSize}`;
      case 'n_log_n': return `${constant} × ${inputSize} × log₂(${inputSize})`;
      case 'n_squared': return `${constant} × ${inputSize}²`;
      case 'n_cubed': return `${constant} × ${inputSize}³`;
      case '2_pow_n': return `${constant} × 2^${inputSize}`;
      default: return '';
    }
  };

  const getPercentage = (value: number, max: number): number => {
    return Math.min(100, Math.max(0, (value / max) * 100));
  };

  const getMaxValue = (): number => {
    return Math.max(
      ...Object.values(comparisonResults).filter(val => val !== Infinity)
    );
  };

  return (
    <div className={`bg-bg-card rounded-curvy p-6 shadow-curvy ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calculator className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-semibold text-primary">Complexity Calculator</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="p-2 rounded-curvy text-text-muted hover:text-primary hover:bg-accent/20 
                     transition-colors duration-200"
            title={showExplanation ? "Hide Explanation" : "Show Explanation"}
          >
            <HelpCircle className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => {
              setInputSize(100);
              setComplexityClass('n');
              setConstant(1);
            }}
            className="p-2 rounded-curvy text-text-muted hover:text-primary hover:bg-accent/20 
                     transition-colors duration-200"
            title="Reset"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="bg-primary/10 rounded-curvy p-4 border border-primary/20 mb-6">
          <p className="text-sm text-text-secondary">
            This calculator helps you understand how different complexity classes scale with input size.
            Adjust the parameters below to see how the number of operations changes.
          </p>
        </div>
      )}

      {/* Calculator Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Input Size (n)
          </label>
          <input
            type="number"
            value={inputSize}
            onChange={(e) => setInputSize(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            max="1000000"
            className="w-full p-3 bg-accent/20 border border-accent/40 rounded-curvy
                     text-text-primary focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Complexity Class
          </label>
          <select
            value={complexityClass}
            onChange={(e) => setComplexityClass(e.target.value)}
            className="w-full p-3 bg-accent/20 border border-accent/40 rounded-curvy
                     text-text-primary focus:border-primary focus:ring-1 focus:ring-primary/20"
          >
            <option value="1">O(1) - Constant</option>
            <option value="log_n">O(log n) - Logarithmic</option>
            <option value="n">O(n) - Linear</option>
            <option value="n_log_n">O(n log n) - Linearithmic</option>
            <option value="n_squared">O(n²) - Quadratic</option>
            <option value="n_cubed">O(n³) - Cubic</option>
            <option value="2_pow_n">O(2ⁿ) - Exponential</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Constant Factor
          </label>
          <input
            type="number"
            value={constant}
            onChange={(e) => setConstant(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            max="100"
            className="w-full p-3 bg-accent/20 border border-accent/40 rounded-curvy
                     text-text-primary focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Result */}
      <div className="bg-accent/10 rounded-curvy p-4 border border-accent/20 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <h4 className="font-medium text-text-primary">Calculation Result</h4>
          </div>
          <div className="text-lg font-bold text-primary">
            {formatNumber(result)} operations
          </div>
        </div>
        
        <div className="text-sm text-text-muted">
          <div className="flex items-center space-x-2">
            <span>Formula:</span>
            <span className="font-mono">{getComplexityFormula(complexityClass)}</span>
            <ArrowRight className="h-3 w-3" />
            <span className="font-mono">{formatNumber(result)}</span>
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="space-y-4">
        <h4 className="font-medium text-text-primary">Complexity Comparison</h4>
        
        <div className="space-y-3">
          {Object.entries(comparisonResults).map(([complexity, value]) => (
            <div key={complexity} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className={`text-sm font-mono font-medium ${getComplexityColor(complexity)}`}>
                  {complexity}
                </span>
                <span className="text-sm text-text-secondary">
                  {formatNumber(value)}
                </span>
              </div>
              
              <div className="w-full bg-accent/20 rounded-curvy h-4 overflow-hidden">
                <div
                  className={`h-full rounded-curvy transition-all duration-300 ${
                    complexity === 'O(1)' ? 'bg-success' :
                    complexity === 'O(log n)' ? 'bg-success' :
                    complexity === 'O(n)' ? 'bg-warning' :
                    complexity === 'O(n log n)' ? 'bg-warning' :
                    complexity === 'O(n²)' ? 'bg-error' :
                    'bg-error'
                  }`}
                  style={{
                    width: `${value === Infinity ? 100 : getPercentage(value, getMaxValue())}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Practical Implications */}
      <div className="mt-6 bg-accent/10 rounded-curvy p-4 border border-accent/20">
        <h4 className="font-medium text-text-primary mb-3">Practical Implications</h4>
        
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-medium text-text-secondary mb-2">For Input Size n = {inputSize}</h5>
              <div className="space-y-1 text-text-muted">
                <p>
                  {complexityClass === '1' && 'Constant time algorithms are ideal as they perform the same regardless of input size.'}
                  {complexityClass === 'log_n' && 'Logarithmic algorithms are very efficient and scale extremely well with large inputs.'}
                  {complexityClass === 'n' && 'Linear algorithms scale directly with input size - doubling the input doubles the operations.'}
                  {complexityClass === 'n_log_n' && 'Linearithmic algorithms are efficient for sorting and many divide-and-conquer approaches.'}
                  {complexityClass === 'n_squared' && 'Quadratic algorithms become slow with larger inputs - avoid for large datasets.'}
                  {complexityClass === 'n_cubed' && 'Cubic algorithms are very inefficient for large inputs - use only for small datasets.'}
                  {complexityClass === '2_pow_n' && 'Exponential algorithms are impractical for all but the smallest inputs.'}
                </p>
                
                <p className="mt-2">
                  {result > 1e9 
                    ? 'This would be extremely slow or impractical to compute.'
                    : result > 1e6
                      ? 'This would be very slow for most computers.'
                      : result > 1e4
                        ? 'This is computationally intensive but feasible.'
                        : 'This is easily computable on modern hardware.'}
                </p>
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-text-secondary mb-2">Scaling Behavior</h5>
              <div className="space-y-1 text-text-muted">
                <p>
                  If input size doubles to {inputSize * 2}:
                </p>
                <ul className="space-y-1">
                  {complexityClass === '1' && <li>Operations remain constant at {constant}</li>}
                  {complexityClass === 'log_n' && <li>Operations increase by only {Math.floor(constant * (Math.log2(inputSize * 2) - Math.log2(inputSize)))}</li>}
                  {complexityClass === 'n' && <li>Operations double to {constant * inputSize * 2}</li>}
                  {complexityClass === 'n_log_n' && <li>Operations increase to ~{formatNumber(Math.floor(constant * inputSize * 2 * Math.log2(inputSize * 2)))}</li>}
                  {complexityClass === 'n_squared' && <li>Operations quadruple to {constant * inputSize * inputSize * 4}</li>}
                  {complexityClass === 'n_cubed' && <li>Operations increase 8x to {constant * inputSize * inputSize * inputSize * 8}</li>}
                  {complexityClass === '2_pow_n' && <li>Operations square to {formatNumber(constant * Math.pow(2, inputSize) * Math.pow(2, inputSize))}</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplexityCalculator;