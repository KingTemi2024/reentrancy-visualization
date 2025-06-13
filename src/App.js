// src/App.js
import React, { useState } from 'react';
import './App.css';

// Import your components
import EnhancedSmartContractPlatform from './components/EnhancedSmartContractPlatform';
import SmartAnalyzer from './components/SmartAnalyzer';
import SmartContractVulnerabilityPlatform from './components/SmartContractVulnerabilityPlatform';
import ReentrancyVisualization from './components/ReentrancyVisualization';
import SmartContractPlatform from './components/SmartContractPlatform';

function App() {
  const [currentComponent, setCurrentComponent] = useState('EnhancedSmartContractPlatform');

  const handleNavigation = (componentName) => {
    setCurrentComponent(componentName);
  };

  const renderComponent = () => {
    switch(currentComponent) {
      case 'EnhancedSmartContractPlatform':
        return <EnhancedSmartContractPlatform onNavigationClick={handleNavigation} />;
      case 'SmartAnalyzer':
        return <SmartAnalyzer onNavigationClick={handleNavigation} />;
      case 'SmartContractVulnerabilityPlatform':
        return <SmartContractVulnerabilityPlatform onNavigationClick={handleNavigation} />;
      case 'ReentrancyVisualization':
        return <ReentrancyVisualization onNavigationClick={handleNavigation} />;
      case 'SmartContractPlatform':
        return <SmartContractPlatform onNavigationClick={handleNavigation} />;
      default:
        return <EnhancedSmartContractPlatform onNavigationClick={handleNavigation} />;
    }
  };

  return (
    <div className="App">
      {renderComponent()}
    </div>
  );
}

export default App;
