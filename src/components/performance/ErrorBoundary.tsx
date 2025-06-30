import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Code, ChevronDown, ChevronUp } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Log error to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // Reset error state if props change and resetOnPropsChange is true
    if (
      this.props.resetOnPropsChange &&
      this.state.hasError &&
      prevProps !== this.props
    ) {
      this.resetErrorBoundary();
    }
  }

  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    });
  };

  toggleDetails = (): void => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default error UI
      return (
        <div className="bg-error/10 rounded-curvy p-6 border border-error/30 shadow-curvy">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="h-6 w-6 text-error" />
            <h3 className="text-xl font-semibold text-error">Something went wrong</h3>
          </div>
          
          <p className="text-text-primary mb-4">
            An error occurred while rendering this component. You can try refreshing the page or resetting the component.
          </p>
          
          {this.state.error && (
            <div className="bg-bg-secondary/50 rounded-curvy p-4 mb-4">
              <div className="text-error font-medium mb-2">Error:</div>
              <div className="text-text-secondary font-mono text-sm">
                {this.state.error.toString()}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <button
              onClick={this.resetErrorBoundary}
              className="px-4 py-2 bg-primary hover:bg-hover text-bg-primary rounded-curvy
                       transition-all duration-200 hover-lift font-medium"
            >
              <RefreshCw className="h-4 w-4 inline mr-2" />
              Reset Component
            </button>
            
            <button
              onClick={this.toggleDetails}
              className="flex items-center space-x-2 text-text-muted hover:text-text-primary"
            >
              <Code className="h-4 w-4" />
              <span>
                {this.state.showDetails ? 'Hide Details' : 'Show Details'}
              </span>
              {this.state.showDetails ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
          
          {this.state.showDetails && this.state.errorInfo && (
            <div className="mt-4 bg-bg-secondary/50 rounded-curvy p-4 overflow-auto max-h-64">
              <div className="text-text-secondary font-medium mb-2">Component Stack:</div>
              <pre className="text-text-muted font-mono text-xs whitespace-pre-wrap">
                {this.state.errorInfo.componentStack}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;