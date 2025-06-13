// src/App.js
import React, { useState, useCallback, useEffect } from 'react';
import './App.css';

// Import all your available components
import EnhancedSmartContractPlatform from './components/EnhancedSmartContractPlatform';
import SmartAnalyzer from './components/SmartAnalyzer';
import SmartContractVulnerabilityPlatform from './components/SmartContractVulnerabilityPlatform';
import ReentrancyVisualization from './components/ReentrancyVisualization';
import SmartContractPlatform from './components/SmartContractPlatform';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Smart Contract Security Suite Error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-6">
          <div className="max-w-2xl bg-white rounded-lg shadow-lg p-8 border-l-4 border-red-500">
            <h1 className="text-2xl font-bold text-red-800 mb-4">
              🚨 Application Error
            </h1>
            <p className="text-red-700 mb-4">
              Something went wrong with the Smart Contract Security Suite. Please refresh the page to try again.
            </p>
            <div className="bg-red-100 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-red-800 mb-2">Error Details:</h3>
              <pre className="text-sm text-red-700 overflow-auto">
                {this.state.error && this.state.error.toString()}
              </pre>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                🔄 Refresh Page
              </button>
              <button 
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })} 
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                🔙 Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-700">Loading Security Suite...</h2>
      <p className="text-gray-500 mt-2">Initializing smart contract analysis tools</p>
    </div>
  </div>
);

// Main App Component
function App() {
  const [currentComponent, setCurrentComponent] = useState('EnhancedSmartContractPlatform');
  const [isLoading, setIsLoading] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState(['EnhancedSmartContractPlatform']);

  // Available components mapping
  const components = {
    'EnhancedSmartContractPlatform': {
      component: EnhancedSmartContractPlatform,
      name: '🏠 Enhanced Platform',
      description: 'AI-Powered Smart Contract Security Platform'
    },
    'SmartAnalyzer': {
      component: SmartAnalyzer,
      name: '🔍 Smart Analyzer',
      description: 'Smart Contract Code Analyzer'
    },
    'SmartContractVulnerabilityPlatform': {
      component: SmartContractVulnerabilityPlatform,
      name: '🛡️ Vulnerability Platform',
      description: 'Smart Contract Vulnerability Platform'
    },
    'ReentrancyVisualization': {
      component: ReentrancyVisualization,
      name: '🎯 Reentrancy Viz',
      description: 'Reentrancy Attack Visualization'
    },
    'SmartContractPlatform': {
      component: SmartContractPlatform,
      name: '⚡ Vulnerability Tester',
      description: 'Smart Contract Vulnerability Testing Platform'
    }
  };

  // Navigation handler with loading state and history
  const handleNavigation = useCallback((componentName) => {
    console.log(`Navigating to: ${componentName}`);
    
    // Don't navigate if already on the same component
    if (componentName === currentComponent) {
      console.log('Already on this component');
      return;
    }

    // Validate component exists
    if (!components[componentName]) {
      console.error(`Component ${componentName} not found`);
      return;
    }

    setIsLoading(true);

    // Add to navigation history
    setNavigationHistory(prev => {
      const newHistory = [...prev, componentName];
      // Keep only last 10 items in history
      return newHistory.slice(-10);
    });

    // Simulate component loading (optional - remove if not needed)
    setTimeout(() => {
      setCurrentComponent(componentName);
      setIsLoading(false);
      
      // Update document title
      const componentInfo = components[componentName];
      document.title = `${componentInfo.name} - Smart Contract Security Suite`;
      
      // Scroll to top when navigating
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  }, [currentComponent, components]);

  // Set initial document title
  useEffect(() => {
    const componentInfo = components[currentComponent];
    document.title = `${componentInfo.name} - Smart Contract Security Suite`;
  }, [currentComponent, components]);

  // Keyboard navigation (optional feature)
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Alt + number keys to navigate
      if (event.altKey) {
        const componentKeys = Object.keys(components);
        const keyNumber = parseInt(event.key);
        
        if (keyNumber >= 1 && keyNumber <= componentKeys.length) {
          const targetComponent = componentKeys[keyNumber - 1];
          handleNavigation(targetComponent);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleNavigation, components]);

  // Back navigation function
  const goBack = useCallback(() => {
    if (navigationHistory.length > 1) {
      const previousComponent = navigationHistory[navigationHistory.length - 2];
      setNavigationHistory(prev => prev.slice(0, -1));
      setCurrentComponent(previousComponent);
    }
  }, [navigationHistory]);

  // Render the current component
  const renderComponent = () => {
    const componentInfo = components[currentComponent];
    
    if (!componentInfo) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              ❌ Component Not Found
            </h1>
            <p className="text-gray-600 mb-4">
              The component "{currentComponent}" could not be found.
            </p>
            <button 
              onClick={() => handleNavigation('EnhancedSmartContractPlatform')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              🏠 Go to Home
            </button>
          </div>
        </div>
      );
    }

    const ComponentToRender = componentInfo.component;
    
    return (
      <ComponentToRender 
        onNavigationClick={handleNavigation}
        currentPage={currentComponent}
        goBack={navigationHistory.length > 1 ? goBack : null}
        navigationHistory={navigationHistory}
      />
    );
  };

  // Show loading spinner if loading
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <div className="App min-h-screen bg-gray-100">
        {/* Development helper - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 z-50 bg-black bg-opacity-75 text-white p-2 rounded text-xs">
            <div>Current: {currentComponent}</div>
            <div>History: {navigationHistory.length}</div>
            <div className="text-xs opacity-75 mt-1">
              Alt+1-5: Quick navigate
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="w-full">
          {renderComponent()}
        </main>

        {/* Hidden preloader for better performance (optional) */}
        <div className="sr-only">
          {Object.keys(components).map(componentName => (
            <span key={componentName}>{componentName}</span>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
