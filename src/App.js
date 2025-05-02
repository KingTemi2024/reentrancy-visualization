import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReentrancyVisualization from './components/ReentrancyVisualization';

function App() {
  return (
    <BrowserRouter basename="/reentrancy-visualization">
      <Routes>
        <Route path="/" element={<ReentrancyVisualization />} />
        {/* Add more routes here if needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
