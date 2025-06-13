// src/App.js
import React, { useState, useCallback } from 'react';

// Import all your components
import EnhancedSmartContractPlatform from './components/EnhancedSmartContractPlatform';
import SmartAnalyzer from './components/SmartAnalyzer';
import SmartContractVulnerabilityPlatform from './components/SmartContractVulnerabilityPlatform';
import ReentrancyVisualization from './components/ReentrancyVisualization';
import SmartContractPlatform from './components/SmartContractPlatform';

const App = () => {
  const [currentPage, setCurrentPage] = useState('EnhancedSmartContractPlatform');

  // Navigation handler that updates the current page
  const handleNavigation = useCallback((pageName) => {
    setCurrentPage(pageName);
  }, []);

  // Render the appropriate component based on current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'EnhancedSmartContractPlatform':
        return (
          <EnhancedSmartContractPlatform 
            onNavigationClick={handleNavigation} 
            currentPage={currentPage} 
          />
        );
      case 'SmartAnalyzer':
        return (
          <SmartAnalyzer 
            onNavigationClick={handleNavigation} 
            currentPage={currentPage} 
          />
        );
      case 'SmartContractVulnerabilityPlatform':
        return (
          <SmartContractVulnerabilityPlatform 
            onNavigationClick={handleNavigation} 
            currentPage={currentPage} 
          />
        );
      case 'ReentrancyVisualization':
        return (
          <ReentrancyVisualization 
            onNavigationClick={handleNavigation} 
            currentPage={currentPage} 
          />
        );
      case 'SmartContractPlatform':
        return (
          <SmartContractPlatform 
            onNavigationClick={handleNavigation} 
            currentPage={currentPage} 
          />
        );
      default:
        return (
          <EnhancedSmartContractPlatform 
            onNavigationClick={handleNavigation} 
            currentPage={currentPage} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {renderCurrentPage()}
    </div>
  );
};

export default App;
