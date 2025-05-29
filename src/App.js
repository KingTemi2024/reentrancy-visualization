import React, { useState } from 'react';
import './App.css';
import ReentrancyVisualization from './components/ReentrancyVisualization';
import SmartContractVulnerabilityPlatform from './components/SmartContractVulnerabilityPlatform';

function App() {
  const [currentView, setCurrentView] = useState('reentrancy-demo'); // Start with your original demo

  return (
    <div className="App min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold">
                🔐 Smart Contract Security Hub
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button
                  onClick={() => setCurrentView('reentrancy-demo')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    currentView === 'reentrancy-demo'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                  }`}
                >
                  🔄 Reentrancy Demo
                </button>
                <button
                  onClick={() => setCurrentView('vulnerability-platform')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    currentView === 'vulnerability-platform'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                  }`}
                >
                  🔍 Vulnerability Platform
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <select
                value={currentView}
                onChange={(e) => setCurrentView(e.target.value)}
                className="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="reentrancy-demo">🔄 Reentrancy Demo</option>
                <option value="vulnerability-platform">🔍 Vulnerability Platform</option>
              </select>
            </div>
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <main className="flex-1">
        {currentView === 'reentrancy-demo' && <ReentrancyVisualization />}
        {currentView === 'vulnerability-platform' && <SmartContractVulnerabilityPlatform />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Smart Contract Security Hub</h3>
              <p className="text-gray-400 text-sm">
                Educational tools for understanding smart contract vulnerabilities and blockchain security.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• Interactive vulnerability detection</li>
                <li>• Step-by-step attack simulations</li>
                <li>• Educational reentrancy visualization</li>
                <li>• Real smart contract analysis</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Disclaimer</h3>
              <p className="text-gray-400 text-sm">
                This tool is for educational purposes only. Always get professional security audits 
                for production smart contracts.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 KingTemi2024. Built with React & Tailwind CSS. 
              <a 
                href="https://github.com/KingTemi2024/reentrancy-visualization" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                View on GitHub →
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
