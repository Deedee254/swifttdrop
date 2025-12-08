'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    // Here you could send the error to an error reporting service
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
          <div className="flex items-center mb-3">
            <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
            <h3 className="font-semibold">Something went wrong</h3>
          </div>
          
          {this.state.error && (
            <p className="text-sm mb-3 font-mono bg-red-100 p-2 rounded overflow-auto">
              {this.state.error.toString()}
            </p>
          )}
          
          <button
            onClick={this.handleReset}
            className="flex items-center text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;