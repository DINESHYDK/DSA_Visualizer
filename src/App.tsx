import React, { useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import SortingPage from './pages/SortingPage';
import DataStructuresPage from './pages/DataStructuresPage';
import TreesPage from './pages/TreesPage';
import PlaygroundPage from './pages/PlaygroundPage';
import ComplexityAnalysisPage from './pages/ComplexityAnalysisPage';
import PerformanceOptimizationPage from './pages/PerformanceOptimizationPage';
import { AnimationProvider } from './contexts/AnimationContext';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'sorting' | 'data-structures' | 'trees' | 'graphs' | 'playground' | 'complexity' | 'performance'>('home');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'sorting':
        return <SortingPage />;
      case 'data-structures':
        return <DataStructuresPage />;
      case 'trees':
        return <TreesPage />;
      case 'playground':
        return <PlaygroundPage />;
      case 'complexity':
        return <ComplexityAnalysisPage />;
      case 'performance':
        return <PerformanceOptimizationPage />;
      case 'graphs':
        return (
          <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-primary">Graph Algorithms</h1>
              <p className="text-text-secondary">Coming soon...</p>
            </div>
          </div>
        );
      case 'home':
      default:
        return (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center space-y-6 max-w-2xl mx-auto">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-primary">
                  DSA Visualizer
                </h1>
                <p className="text-xl md:text-2xl text-text-secondary">
                  Interactive Algorithm Learning Platform
                </p>
              </div>
              
              <div className="space-y-4">
                <p className="text-text-muted leading-relaxed">
                  Explore data structures and algorithms through beautiful, interactive visualizations. 
                  Learn by doing with our comprehensive collection of sorting algorithms, search techniques, 
                  data structure operations, and graph algorithms.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center items-center">
                <button 
                  onClick={() => setCurrentPage('sorting')}
                  className="btn-primary px-6 py-3 rounded-curvy font-semibold transition-all duration-200"
                >
                  Sorting Algorithms
                </button>
                <div className="btn-secondary px-6 py-3 rounded-curvy font-semibold transition-all duration-200 opacity-50 cursor-not-allowed">
                  Search Algorithms
                  <span className="block text-xs mt-1">Coming Soon</span>
                </div>
                <button 
                  onClick={() => setCurrentPage('data-structures')}
                  className="btn-secondary px-6 py-3 rounded-curvy font-semibold transition-all duration-200"
                >
                  Data Structures
                </button>
                <button 
                  onClick={() => setCurrentPage('trees')}
                  className="btn-secondary px-6 py-3 rounded-curvy font-semibold transition-all duration-200"
                >
                  Tree Structures
                </button>
                <button 
                  onClick={() => setCurrentPage('graphs')}
                  className="btn-secondary px-6 py-3 rounded-curvy font-semibold transition-all duration-200"
                >
                  Graph Algorithms
                </button>
                <button 
                  onClick={() => setCurrentPage('playground')}
                  className="btn-primary px-6 py-3 rounded-curvy font-semibold transition-all duration-200"
                >
                  Interactive Playground
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-bg-card p-6 rounded-curvy shadow-curvy hover-lift">
                  <h3 className="text-lg font-semibold text-primary mb-2">Interactive Visualizations</h3>
                  <p className="text-text-muted text-sm">
                    Watch algorithms come to life with step-by-step animations and real-time code execution.
                  </p>
                </div>
                
                <div className="bg-bg-card p-6 rounded-curvy shadow-curvy hover-lift" onClick={() => setCurrentPage('complexity')}>
                  <h3 className="text-lg font-semibold text-primary mb-2">Complexity Analysis</h3>
                  <p className="text-text-muted text-sm">
                    Understand time and space complexity with real-time metrics and comparison tools.
                  </p>
                </div>
                
                <div className="bg-bg-card p-6 rounded-curvy shadow-curvy hover-lift" onClick={() => setCurrentPage('performance')}>
                  <h3 className="text-lg font-semibold text-primary mb-2">Performance Optimization</h3>
                  <p className="text-text-muted text-sm">
                    Learn advanced techniques for optimizing application performance and memory usage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <AnimationProvider>
      {currentPage === 'home' ? (
        <MainLayout>
          {renderCurrentPage()}
        </MainLayout>
      ) : (
        renderCurrentPage()
      )}
    </AnimationProvider>
  );
}

export default App;