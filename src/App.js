// src/App.js
import React, { useState } from 'react';
import './App.css';

// Import all your available components
import EnhancedSmartContractPlatform from './components/EnhancedSmartContractPlatform';
import SmartAnalyzer from './components/SmartAnalyzer';
import SmartContractVulnerabilityPlatform from './components/SmartContractVulnerabilityPlatform';
import ReentrancyVisualization from './components/ReentrancyVisualization';
import SmartContractPlatform from './components/SmartContractPlatform';

function App() {
  const [currentComponent, setCurrentComponent] = useState('EnhancedSmartContractPlatform');

  const handleNavigation = (componentName) => {
    console.log(`Navigating to: ${componentName}`);
    setCurrentComponent(componentName);
  };

  const renderComponent = () => {
    switch(currentComponent) {
      case 'EnhancedSmartContractPlatform':
        return (
          <EnhancedSmartContractPlatform 
            onNavigationClick={handleNavigation}
            currentPage={currentComponent}
          />
        );
        
      case 'SmartAnalyzer':
        return (
          <SmartAnalyzer 
            onNavigationClick={handleNavigation}
            currentPage={currentComponent}
          />
        );
        
      case 'SmartContractVulnerabilityPlatform':
        return (
          <SmartContractVulnerabilityPlatform 
            onNavigationClick={handleNavigation}
            currentPage={currentComponent}
          />
        );
        
      case 'ReentrancyVisualization':
        return (
          <ReentrancyVisualization 
            onNavigationClick={handleNavigation}
            currentPage={currentComponent}
          />
        );
        
      case 'SmartContractPlatform':
        return (
          <SmartContractPlatform 
            onNavigationClick={handleNavigation}
            currentPage={currentComponent}
          />
        );
        
      default:
        return (
          <EnhancedSmartContractPlatform 
            onNavigationClick={handleNavigation}
            currentPage="EnhancedSmartContractPlatform"
          />
        );
    }
  };

  return (
    <div className="App">
      {renderComponent()}
    </div>
  );
}

export default App;
