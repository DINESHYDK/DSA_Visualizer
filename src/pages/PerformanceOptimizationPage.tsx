import React, { useState, useEffect } from 'react';
import WebWorkerManager from '../components/performance/WebWorkerManager';
import ProgressiveRenderer from '../components/performance/ProgressiveRenderer';
import MemoryManager from '../components/performance/MemoryManager';
import LoadingStateManager from '../components/performance/LoadingStateManager';
import ErrorBoundary from '../components/performance/ErrorBoundary';
import ResponsiveScaler from '../components/performance/ResponsiveScaler';
import { 
  Zap, 
  Layers, 
  MemoryStick, 
  AlertCircle, 
  Smartphone,
  RefreshCw,
  Code,
  Clock,
  Cpu
} from 'lucide-react';

const PerformanceOptimizationPage: React.FC = () => {
  const [largeDataset, setLargeDataset] = useState<any[]>([]);
  const [webWorkerResult, setWebWorkerResult] = useState<any>(null);
  const [errorTrigger, setErrorTrigger] = useState(false);

  // Generate large dataset for testing
  useEffect(() => {
    generateLargeDataset();
  }, []);

  const generateLargeDataset = () => {
    const data = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      value: Math.floor(Math.random() * 1000),
      description: `This is a description for item ${i} with some random text to make it longer.`,
      timestamp: Date.now() - Math.floor(Math.random() * 1000000)
    }));
    
    setLargeDataset(data);
  };

  // Example web worker task function
  const heavyComputationTask = `
    function(data, reportProgress) {
      // Simulate a heavy computation
      const result = [];
      const total = data.length;
      
      for (let i = 0; i < total; i++) {
        // Simulate processing each item
        const item = data[i];
        
        // Do some "heavy" work
        let sum = 0;
        for (let j = 0; j < 100000; j++) {
          sum += Math.sqrt(j * item.value);
        }
        
        result.push({
          id: item.id,
          name: item.name,
          processedValue: sum,
          category: sum > 5000000 ? 'high' : sum > 2000000 ? 'medium' : 'low'
        });
        
        // Report progress
        const progress = Math.floor((i + 1) / total * 100);
        reportProgress(progress);
        
        // Small delay to simulate longer processing
        const start = Date.now();
        while (Date.now() - start < 10) {}
      }
      
      return {
        processedItems: result,
        totalProcessed: result.length,
        processingTime: Date.now()
      };
    }
  `;

  // Loading states for demo
  const loadingStates = [
    {
      id: 'data-fetch',
      label: 'Fetching Data',
      status: 'waiting' as const
    },
    {
      id: 'data-process',
      label: 'Processing Data',
      status: 'waiting' as const
    },
    {
      id: 'render-prep',
      label: 'Preparing Visualization',
      status: 'waiting' as const
    }
  ];

  // Component that will trigger an error for ErrorBoundary demo
  const ErrorComponent = () => {
    if (errorTrigger) {
      throw new Error('This is a demo error to show the ErrorBoundary in action');
    }
    
    return (
      <div className="bg-bg-card rounded-curvy p-4 shadow-curvy">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium text-text-primary">Error Boundary Demo</h3>
          </div>
        </div>
        
        <p className="text-text-secondary mb-4">
          This component will throw an error when the button below is clicked. The error will be caught by the ErrorBoundary component.
        </p>
        
        <button
          onClick={() => setErrorTrigger(true)}
          className="px-4 py-2 bg-error hover:bg-error/80 text-white rounded-curvy
                   transition-all duration-200 hover-lift font-medium"
        >
          Trigger Error
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Performance Optimization</h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Advanced techniques for optimizing application performance, memory management, and user experience.
          </p>
        </div>

        {/* Performance Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Web Worker */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <Cpu className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-primary">Web Worker Processing</h2>
            </div>
            
            <p className="text-text-secondary">
              Web Workers enable heavy computations to run in a background thread, keeping the UI responsive.
            </p>
            
            <WebWorkerManager
              taskFunction={heavyComputationTask}
              inputData={largeDataset.slice(0, 100)}
              onResult={(result) => setWebWorkerResult(result)}
              onError={(error) => console.error('Worker error:', error)}
            />
            
            {webWorkerResult && (
              <div className="bg-accent/10 rounded-curvy p-4 border border-accent/20">
                <h4 className="font-medium text-text-primary mb-2">Worker Result</h4>
                <div className="text-sm text-text-muted">
                  <div>Processed {webWorkerResult.totalProcessed} items</div>
                  <div>Categories: {
                    Object.entries(
                      webWorkerResult.processedItems.reduce((acc: any, item: any) => {
                        acc[item.category] = (acc[item.category] || 0) + 1;
                        return acc;
                      }, {})
                    ).map(([category, count]) => `${category}: ${count}`).join(', ')
                  }</div>
                </div>
              </div>
            )}
          </div>

          {/* Memory Management */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <MemoryStick className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-primary">Memory Management</h2>
            </div>
            
            <p className="text-text-secondary">
              Efficient memory management prevents leaks and optimizes application performance.
            </p>
            
            <MemoryManager
              onCleanup={() => {
                // Simulate memory cleanup
                console.log('Cleaning up memory...');
                // In a real app, we would clear caches, dispose resources, etc.
              }}
            />
          </div>

          {/* Progressive Rendering */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <Layers className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-primary">Progressive Rendering</h2>
            </div>
            
            <p className="text-text-secondary">
              Render large datasets in batches to keep the UI responsive and provide a better user experience.
            </p>
            
            <ProgressiveRenderer
              data={largeDataset}
              renderItem={(item) => (
                <div className="bg-accent/10 rounded-curvy p-3 border border-accent/20 hover:bg-accent/20 transition-colors duration-200">
                  <div className="flex justify-between">
                    <span className="font-medium text-text-primary">{item.name}</span>
                    <span className="text-primary">{item.value}</span>
                  </div>
                  <p className="text-xs text-text-muted mt-1">{item.description}</p>
                </div>
              )}
              batchSize={15}
              batchDelay={100}
              loadingPlaceholder={
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-accent/10 rounded-curvy p-3 border border-accent/20 animate-pulse">
                      <div className="flex justify-between">
                        <div className="w-24 h-4 bg-accent/30 rounded"></div>
                        <div className="w-12 h-4 bg-accent/30 rounded"></div>
                      </div>
                      <div className="w-full h-3 bg-accent/30 rounded mt-2"></div>
                    </div>
                  ))}
                </div>
              }
            />
          </div>

          {/* Loading States */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-primary">Loading States</h2>
            </div>
            
            <p className="text-text-secondary">
              Manage complex loading sequences with progress indicators for better user feedback.
            </p>
            
            <LoadingStateManager
              states={loadingStates}
              onComplete={() => console.log('All loading states completed')}
            />
          </div>
        </div>

        {/* Error Handling & Responsive Scaling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Error Boundary */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-primary">Error Boundary</h2>
            </div>
            
            <p className="text-text-secondary">
              Gracefully handle component errors to prevent entire application crashes.
            </p>
            
            <ErrorBoundary
              onError={(error, errorInfo) => {
                console.log('Error caught by boundary:', error, errorInfo);
              }}
            >
              <ErrorComponent />
            </ErrorBoundary>
          </div>

          {/* Responsive Scaling */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <Smartphone className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-primary">Responsive Scaling</h2>
            </div>
            
            <p className="text-text-secondary">
              Dynamically scale content based on device size for optimal viewing experience.
            </p>
            
            <ResponsiveScaler>
              <div className="bg-bg-card rounded-curvy p-6 shadow-curvy border border-primary/20 w-full">
                <h3 className="text-xl font-semibold text-primary mb-4">Responsive Content</h3>
                <p className="text-text-secondary mb-4">
                  This content will scale based on the device size or manual controls.
                  Try using the controls above to see how it works.
                </p>
                
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-accent/10 rounded-curvy p-3 border border-accent/20">
                      <div className="text-center">
                        <div className="text-lg font-medium text-primary">Item {i+1}</div>
                        <div className="text-sm text-text-muted">Scaled content</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ResponsiveScaler>
          </div>
        </div>

        {/* Performance Best Practices */}
        <div className="bg-bg-card rounded-curvy p-6 shadow-curvy mb-12">
          <h2 className="text-2xl font-semibold text-primary mb-6">Performance Best Practices</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Cpu className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium text-text-primary">Computation Optimization</h3>
              </div>
              
              <ul className="space-y-2 text-sm text-text-muted">
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>Use Web Workers for CPU-intensive tasks</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>Implement memoization for expensive calculations</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>Debounce and throttle event handlers</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>Avoid unnecessary re-renders with React.memo</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>Use efficient algorithms with appropriate time complexity</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MemoryStick className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium text-text-primary">Memory Management</h3>
              </div>
              
              <ul className="space-y-2 text-sm text-text-muted">
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>Clean up event listeners and subscriptions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>Implement virtualization for long lists</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>Use object pooling for frequently created objects</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>Avoid closure-related memory leaks</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>Implement progressive loading for large datasets</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium text-text-primary">Rendering Optimization</h3>
              </div>
              
              <ul className="space-y-2 text-sm text-text-muted">
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>Implement code splitting and lazy loading</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>Use windowing techniques for large lists</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>Optimize images and assets</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>Minimize DOM manipulations</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>Use CSS transitions instead of JS animations when possible</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Implementation Details */}
        <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
          <div className="flex items-center space-x-2 mb-6">
            <Code className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold text-primary">Implementation Details</h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-accent/10 rounded-curvy p-4 border border-accent/20">
              <h3 className="font-medium text-text-primary mb-3">Web Worker Implementation</h3>
              <p className="text-sm text-text-muted mb-3">
                Web Workers run JavaScript in background threads, allowing CPU-intensive tasks to execute without blocking the UI.
              </p>
              <pre className="bg-bg-secondary/50 rounded-curvy p-3 text-xs text-text-secondary overflow-auto">
{`// Create a Web Worker
const workerScript = \`
  self.onmessage = function(e) {
    const { taskFunction, inputData } = e.data;
    
    try {
      // Convert string function to actual function
      const taskFn = new Function('data', 'reportProgress', taskFunction);
      
      // Execute the function
      const result = taskFn(inputData, (progress) => {
        self.postMessage({ type: 'progress', data: progress });
      });
      
      // Send the result back
      self.postMessage({ type: 'result', data: result });
    } catch (error) {
      self.postMessage({ type: 'error', data: error.message });
    }
  };
\`;

const blob = new Blob([workerScript], { type: 'application/javascript' });
const workerUrl = URL.createObjectURL(blob);
const worker = new Worker(workerUrl);

// Set up message handler
worker.onmessage = (e) => {
  const { type, data } = e.data;
  // Handle different message types (result, error, progress)
};

// Start the worker
worker.postMessage({ taskFunction, inputData });`}
              </pre>
            </div>
            
            <div className="bg-accent/10 rounded-curvy p-4 border border-accent/20">
              <h3 className="font-medium text-text-primary mb-3">Progressive Rendering Technique</h3>
              <p className="text-sm text-text-muted mb-3">
                Progressive rendering improves perceived performance by rendering content in batches, keeping the UI responsive.
              </p>
              <pre className="bg-bg-secondary/50 rounded-curvy p-3 text-xs text-text-secondary overflow-auto">
{`// Progressive rendering with React hooks
const ProgressiveRenderer = ({ data, renderItem, batchSize = 10, batchDelay = 50 }) => {
  const [renderedItems, setRenderedItems] = useState([]);
  
  useEffect(() => {
    let mounted = true;
    let timeoutId = null;
    
    const renderNextBatch = () => {
      setRenderedItems(prev => {
        const nextIndex = prev.length;
        if (nextIndex >= data.length) return prev;
        
        const endIndex = Math.min(nextIndex + batchSize, data.length);
        return [...prev, ...data.slice(nextIndex, endIndex)];
      });
      
      timeoutId = setTimeout(() => {
        if (mounted && renderedItems.length < data.length) {
          renderNextBatch();
        }
      }, batchDelay);
    };
    
    renderNextBatch();
    
    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [data, batchSize, batchDelay]);
  
  return (
    <div>
      {renderedItems.map(renderItem)}
      {renderedItems.length < data.length && <LoadingIndicator />}
    </div>
  );
};`}
              </pre>
            </div>
            
            <div className="bg-accent/10 rounded-curvy p-4 border border-accent/20">
              <h3 className="font-medium text-text-primary mb-3">Error Boundary Pattern</h3>
              <p className="text-sm text-text-muted mb-3">
                Error boundaries catch JavaScript errors in child components, preventing the entire application from crashing.
              </p>
              <pre className="bg-bg-secondary/50 rounded-curvy p-3 text-xs text-text-secondary overflow-auto">
{`class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Log error or send to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h3>Something went wrong</h3>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceOptimizationPage;