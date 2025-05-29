import React, { useState } from 'react';
import './App.css';
import ReentrancyVisualization from './components/ReentrancyVisualization';
import SmartContractVulnerabilityPlatform from './components/SmartContractVulnerabilityPlatform';

function App() {
  const [currentView, setCurrentView] = useState('vulnerability-platform');

  return (
    <div className="App">
      {/* Navigation Header */}
      <nav className="bg-gray-900 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🔐 Smart Contract Security Hub</h1>
          <div className="space-x-4">
            <button
              onClick={() => setCurrentView('vulnerability-platform')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentView === 'vulnerability-platform'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🔍 Vulnerability Platform
            </button>
            <button
              onClick={() => setCurrentView('reentrancy-demo')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentView === 'reentrancy-demo'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🔄 Reentrancy Demo
            </button>
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <main className="min-h-screen bg-gray-100">
        {currentView === 'vulnerability-platform' && <SmartContractVulnerabilityPlatform />}
        {currentView === 'reentrancy-demo' && <ReentrancyVisualization />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p className="text-sm text-gray-400">
          Educational tool for understanding smart contract vulnerabilities. 
          Always get professional audits for production contracts.
        </p>
      </footer>
    </div>
  );
}

export default App;
