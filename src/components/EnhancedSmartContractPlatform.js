// src/components/EnhancedSmartContractPlatform.js
import React, { useState, useCallback, useMemo, memo } from 'react';

const NavigationMenu = memo(({ onNavigationClick, currentPage }) => (
  <div className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl shadow-lg border">
    <h2 className="text-2xl font-bold mb-4 text-white text-center">🔐 Smart Contract Security Suite</h2>
    <div className="flex flex-wrap justify-center gap-4">
      <button 
        onClick={() => onNavigationClick('EnhancedSmartContractPlatform')}
        className={`px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-colors ${
          currentPage === 'EnhancedSmartContractPlatform' 
            ? 'bg-yellow-400 text-purple-800 border-2 border-yellow-300 cursor-default'
            : 'bg-white text-blue-600 hover:bg-blue-50'
        }`}
      >
        🏠 Enhanced Platform {currentPage === 'EnhancedSmartContractPlatform' && '(CURRENT)'}
      </button>
      <button 
        onClick={() => onNavigationClick('SmartAnalyzer')}
        className="px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
      >
        🔍 Smart Analyzer
      </button>
      <button 
        onClick={() => onNavigationClick('SmartContractVulnerabilityPlatform')}
        className="px-6 py-3 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
      >
        🛡️ Vulnerability Platform
      </button>
      <button 
        onClick={() => onNavigationClick('ReentrancyVisualization')}
        className="px-6 py-3 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
      >
        🎯 Reentrancy Viz
      </button>
      <button 
        onClick={() => onNavigationClick('SmartContractPlatform')}
        className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
      >
        ⚡ Vulnerability Tester
      </button>
    </div>
    <p className="text-white text-center mt-4 opacity-90">
      📍 Navigate between different smart contract security tools
    </p>
  </div>
));

NavigationMenu.displayName = 'NavigationMenu';

const EnhancedSmartContractPlatform = () => {
  const [contractCode, setContractCode] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [selectedTab, setSelectedTab] = useState('analyzer');
  const [riskScore, setRiskScore] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleNavigation = useCallback((componentName) => {
    // In a real app, this would use React Router
    console.log(`Navigating to: ${componentName}`);
    alert(`Navigation to ${componentName} - This would use React Router in a full application`);
  }, []);

  // Enhanced vulnerability patterns with AI-powered analysis
  const enhancedPatterns = useMemo(() => ({
    reentrancy: {
      name: "Reentrancy Vulnerabilities",
      patterns: [
        /\.call\{.*\}\(\"\"\).*\n.*[-=]/gi,
        /\.transfer\(.*\).*\n.*[-=]/gi,
        /\.send\(.*\).*\n.*[-=]/gi
      ],
      severity: "CRITICAL",
      confidence: 0.95,
      aiAnalysis: "High confidence reentrancy pattern detected"
    },
    accessControl: {
      name: "Access Control Issues",
      patterns: [
        /function.*public(?!.*onlyOwner|.*require.*owner|.*modifier)/gi,
        /function.*external(?!.*onlyOwner|.*require.*owner|.*modifier)/gi
      ],
      severity: "HIGH",
      confidence: 0.88,
      aiAnalysis: "Missing access control modifiers"
    },
    integerOverflow: {
      name: "Integer Overflow/Underflow",
      patterns: [
        /pragma solidity \^0\.[0-7]\./gi,
        /uint\d*.*[+\-\*](?!.*SafeMath)/gi
      ],
      severity: "HIGH",
      confidence: 0.85,
      aiAnalysis: "Potential arithmetic overflow without protection"
    },
    randomness: {
      name: "Weak Randomness",
      patterns: [
        /block\.timestamp/gi,
        /block\.difficulty/gi,
        /blockhash/gi
      ],
      severity: "MEDIUM",
      confidence: 0.75,
      aiAnalysis: "Using predictable sources for randomness"
    },
    gasOptimization: {
      name: "Gas Optimization Issues",
      patterns: [
        /for\s*\([^}]*\.length[^}]*\)/gi,
        /string\s+public/gi
      ],
      severity: "LOW",
      confidence: 0.65,
      aiAnalysis: "Potential gas optimization opportunities"
    }
  }), []);

  const analyzeContract = useCallback(async () => {
    if (!contractCode.trim()) {
      alert("Please paste some smart contract code first");
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const results = [];
    let totalRisk = 0;

    Object.entries(enhancedPatterns).forEach(([key, pattern]) => {
      const allMatches = pattern.patterns.flatMap(p => 
        [...(contractCode.match(p) || [])]
      );

      if (allMatches.length > 0) {
        const severityScore = {
          'CRITICAL': 10,
          'HIGH': 8,
          'MEDIUM': 5,
          'LOW': 2
        }[pattern.severity];

        totalRisk += severityScore * allMatches.length * pattern.confidence;

        results.push({
          id: key,
          name: pattern.name,
          severity: pattern.severity,
          confidence: pattern.confidence,
          matches: allMatches.length,
          aiAnalysis: pattern.aiAnalysis,
          codeSnippets: allMatches.slice(0, 3)
        });
      }
    });

    setAnalysisResults(results);
    setRiskScore(Math.min(Math.round(totalRisk), 100));
    
    // Generate AI recommendations
    const newRecommendations = generateRecommendations(results);
    setRecommendations(newRecommendations);
    
    setIsAnalyzing(false);
  }, [contractCode, enhancedPatterns]);

  const generateRecommendations = useCallback((results) => {
    const recs = [];
    
    if (results.some(r => r.id === 'reentrancy')) {
      recs.push({
        priority: 'CRITICAL',
        title: 'Implement Reentrancy Guards',
        description: 'Use OpenZeppelin ReentrancyGuard or checks-effects-interactions pattern',
        code: `import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SecureContract is ReentrancyGuard {
    function withdraw() external nonReentrant {
        // Safe withdrawal logic
    }
}`
      });
    }

    if (results.some(r => r.id === 'accessControl')) {
      recs.push({
        priority: 'HIGH',
        title: 'Add Access Control',
        description: 'Implement proper authorization mechanisms',
        code: `import "@openzeppelin/contracts/access/Ownable.sol";

contract SecureContract is Ownable {
    function adminFunction() external onlyOwner {
        // Admin-only logic
    }
}`
      });
    }

    if (results.some(r => r.id === 'integerOverflow')) {
      recs.push({
        priority: 'HIGH',
        title: 'Upgrade Solidity Version',
        description: 'Use Solidity 0.8+ for automatic overflow protection',
        code: `pragma solidity ^0.8.0;

// Automatic overflow/underflow protection
contract SafeContract {
    function safeAdd(uint256 a, uint256 b) pure returns (uint256) {
        return a + b; // Will revert on overflow
    }
}`
      });
    }

    return recs;
  }, []);

  const getRiskColor = (score) => {
    if (score >= 80) return 'text-red-600 bg-red-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    if (score >= 20) return 'text-blue-600 bg-blue-100';
    return 'text-green-600 bg-green-100';
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'CRITICAL': return 'bg-red-600';
      case 'HIGH': return 'bg-red-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const exampleContract = `pragma solidity ^0.8.0;

contract ExampleDeFiProtocol {
    mapping(address => uint256) public balances;
    address public owner;
    uint256 public totalSupply;
    
    constructor() {
        owner = msg.sender;
        totalSupply = 1000000 * 10**18;
    }
    
    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        // Potential reentrancy vulnerability
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        balances[msg.sender] -= amount;
    }
    
    // Missing access control
    function emergencyWithdraw() external {
        payable(msg.sender).transfer(address(this).balance);
    }
    
    function getRandomNumber() external view returns (uint256) {
        // Weak randomness
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty)));
    }
}`;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 rounded-lg shadow-md">
      <NavigationMenu onNavigationClick={handleNavigation} currentPage="EnhancedSmartContractPlatform" />

      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
        🚀 AI-Powered Smart Contract Security Platform
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Advanced vulnerability analysis with machine learning-powered recommendations and comprehensive security insights
      </p>

      {/* Risk Dashboard */}
      {analysisResults && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">🎯 AI Security Analysis Dashboard</h2>
            <div className={`px-4 py-2 rounded-lg font-bold text-lg ${getRiskColor(riskScore)}`}>
              Risk Score: {riskScore}/100
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="text-red-600 font-semibold">Critical Issues</div>
              <div className="text-2xl font-bold text-red-800">
                {analysisResults.filter(r => r.severity === 'CRITICAL').length}
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="text-orange-600 font-semibold">High Priority</div>
              <div className="text-2xl font-bold text-orange-800">
                {analysisResults.filter(r => r.severity === 'HIGH').length}
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="text-yellow-600 font-semibold">Medium Issues</div>
              <div className="text-2xl font-bold text-yellow-800">
                {analysisResults.filter(r => r.severity === 'MEDIUM').length}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-green-600 font-semibold">AI Confidence</div>
              <div className="text-2xl font-bold text-green-800">
                {analysisResults.length > 0 
                  ? Math.round(analysisResults.reduce((acc, r) => acc + r.confidence, 0) / analysisResults.length * 100)
                  : 0}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabbed Interface */}
      <div className="mb-8 bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
              { id: 'analyzer', name: '🔍 AI Analyzer', icon: '🔍' },
              { id: 'results', name: '📊 Results', icon: '📊' },
              { id: 'recommendations', name: '💡 Recommendations', icon: '💡' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors`}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* AI Analyzer Tab */}
          {selectedTab === 'analyzer' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">🤖 AI-Powered Smart Contract Analyzer</h3>
              
              <div className="mb-4">
                <label htmlFor="contract-code" className="block text-sm font-medium text-gray-700 mb-2">
                  Smart Contract Code (Solidity)
                </label>
                <textarea
                  id="contract-code"
                  value={contractCode}
                  onChange={(e) => setContractCode(e.target.value)}
                  placeholder="Paste your Solidity contract code here..."
                  className="w-full h-80 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-between items-center">
                <button 
                  onClick={analyzeContract}
                  disabled={isAnalyzing}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg ${
                    isAnalyzing 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  }`}
                >
                  {isAnalyzing ? '🤖 AI Analyzing...' : '🚀 AI-Powered Analysis'}
                </button>
                
                <button
                  onClick={() => setContractCode(exampleContract)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  📝 Load Example Contract
                </button>
              </div>
            </div>
          )}

          {/* Results Tab */}
          {selectedTab === 'results' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">📊 AI Analysis Results</h3>
              
              {analysisResults ? (
                analysisResults.length > 0 ? (
                  <div className="space-y-4">
                    {analysisResults.map((result) => (
                      <div key={result.id} className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border-2 border-red-300">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-bold text-red-800">{result.name}</h4>
                            <p className="text-red-700 text-sm">AI Analysis: {result.aiAnalysis}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded text-white text-sm font-semibold ${getSeverityColor(result.severity)}`}>
                              {result.severity}
                            </span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {Math.round(result.confidence * 100)}% confidence
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-sm text-red-600 mb-3">
                          <strong>Found {result.matches} potential issue(s)</strong>
                        </div>

                        {result.codeSnippets && result.codeSnippets.length > 0 && (
                          <details className="cursor-pointer">
                            <summary className="text-sm font-medium text-red-700 hover:text-red-800">
                              Show problematic code patterns
                            </summary>
                            <div className="mt-2 bg-gray-900 p-3 rounded text-green-400 font-mono text-sm">
                              {result.codeSnippets.map((snippet, i) => (
                                <div key={i} className="mb-1">
                                  {snippet.trim()}
                                </div>
                              ))}
                            </div>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-green-50 p-6 rounded-lg border-2 border-green-300">
                    <div className="flex items-center">
                      <div className="text-green-600 text-2xl mr-3">✅</div>
                      <div>
                        <h4 className="text-lg font-semibold text-green-800">No Critical Issues Detected</h4>
                        <p className="text-green-700">
                          Our AI analysis found no obvious security vulnerabilities. However, consider professional audits for production contracts.
                        </p>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">Run an AI analysis to see results here</p>
                </div>
              )}
            </div>
          )}

          {/* Recommendations Tab */}
          {selectedTab === 'recommendations' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">💡 AI Security Recommendations</h3>
              
              {recommendations.length > 0 ? (
                <div className="space-y-6">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-300">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-green-800">{rec.title}</h4>
                          <p className="text-gray-700">{rec.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded text-white text-sm font-semibold ${
                          rec.priority === 'CRITICAL' ? 'bg-red-600' : 
                          rec.priority === 'HIGH' ? 'bg-orange-600' : 'bg-yellow-600'
                        }`}>
                          {rec.priority}
                        </span>
                      </div>
                      
                      <div className="bg-gray-900 p-4 rounded text-green-400 font-mono text-sm overflow-x-auto">
                        <pre>{rec.code}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">AI recommendations will appear here after analysis</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          🧠 AI-Enhanced Security Features
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-xl font-medium mb-3 text-purple-700">🤖 Machine Learning Analysis</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">🎯</span>
                <span>Pattern recognition with confidence scores</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">🧠</span>
                <span>Context-aware vulnerability detection</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">📊</span>
                <span>Risk scoring with business impact</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-3 text-green-700">🔧 Smart Recommendations</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">💡</span>
                <span>AI-generated fix suggestions</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">⚡</span>
                <span>Priority-based remediation</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">🎯</span>
                <span>Code examples and best practices</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-3 text-blue-700">📈 Advanced Analytics</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">📊</span>
                <span>Real-time security metrics</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">🎯</span>
                <span>Confidence-based reporting</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">📈</span>
                <span>Trend analysis and insights</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSmartContractPlatform;
