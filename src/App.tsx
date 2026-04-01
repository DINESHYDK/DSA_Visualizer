import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import SortingPage from './pages/SortingPage';
import DataStructuresPage from './pages/DataStructuresPage';
import TreesPage from './pages/TreesPage';
import PlaygroundPage from './pages/PlaygroundPage';
import ComplexityAnalysisPage from './pages/ComplexityAnalysisPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/sorting" element={<SortingPage />} />
          <Route path="/data-structures" element={<DataStructuresPage />} />
          <Route path="/trees" element={<TreesPage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/complexity" element={<ComplexityAnalysisPage />} />
          {/* Catch-all: redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
