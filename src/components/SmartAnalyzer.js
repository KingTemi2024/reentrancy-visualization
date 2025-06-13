// src/components/SmartAnalyzer.js
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
        className={`px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-colors ${
          currentPage === 'SmartAnalyzer' 
            ? 'bg-yellow-400 text-purple-800 border-2 border-yellow-300 cursor-default'
            : 'bg-white text-green-600 hover:bg-green-50'
        }`}
      >
        🔍 Smart Analyzer {currentPage === 'SmartAnalyzer' && '(CURRENT)'}
      </button>
      <button 
        onClick={() => onNavigationClick('SmartContractVulnerabilityPlatform')}
        className={`px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-colors ${
          currentPage === 'SmartContractVulnerabilityPlatform' 
            ? 'bg-yellow-400 text-purple-800 border-2 border-yellow-300 cursor-default'
            : 'bg-white text-orange-600 hover:bg-orange-50'
        }`}
      >
        🛡️ Vulnerability Platform {currentPage === 'SmartContractVulnerabilityPlatform' && '(CURRENT)'}
      </button>
      <button 
        onClick={() => onNavigationClick('ReentrancyVisualization')}
        className={`px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-colors ${
          currentPage === 'ReentrancyVisualization' 
            ? 'bg-yellow-400 text-purple-800 border-2 border-yellow-300 cursor-default'
            : 'bg-white text-red-600 hover:bg-red-50'
        }`}
      >
        🎯 Reentrancy Viz {currentPage === 'ReentrancyVisualization' && '(CURRENT)'}
      </button>
      <button 
        onClick={() => onNavigationClick('SmartContractPlatform')}
        className={`px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-colors ${
          currentPage === 'SmartContractPlatform' 
            ? 'bg-yellow-400 text-purple-800 border-2 border-yellow-300 cursor-default'
            : 'bg-white text-purple-600 hover:bg-purple-50'
        }`}
      >
        ⚡ Vulnerability Tester {currentPage === 'SmartContractPlatform' && '(CURRENT)'}
      </button>
    </div>
    <p className="text-white text-center mt-4 opacity-90">
      📍 Navigate between different smart contract security tools
    </p>
  </div>
));

NavigationMenu.displayName = 'NavigationMenu';

const CodeMetricsCard = memo(({ title, value, description, color, icon }) => (
  <div className={`bg-white p-4 rounded-lg border-l-4 ${color} shadow-md`}>
    <div className="flex items-center justify-between">
      <div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        <div className="text-sm font-medium text-gray-600">{title}</div>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
    <div className="text-xs text-gray-500 mt-2">{description}</div>
  </div>
));

CodeMetricsCard.displayName = 'CodeMetricsCard';

const SmartAnalyzer = ({ onNavigationClick, currentPage = 'SmartAnalyzer' }) => {
  const [contractCode, setContractCode] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Default navigation handler if none provided
  const handleNavigation = useCallback((componentName) => {
    if (onNavigationClick) {
      onNavigationClick(componentName);
    } else {
      console.log(`Navigation to: ${componentName}`);
    }
  }, [onNavigationClick]);

  // Advanced analysis patterns
  const analysisPatterns = useMemo(() => ({
    complexity: {
      cyclomaticComplexity: /if\s*\(|while\s*\(|for\s*\(|catch\s*\(|\|\||&&/g,
      nestingDepth: /\{[^{}]*\{[^{}]*\{/g,
      functionLength: /function\s+\w+[^{]*\{[^}]*\}/g
    },
    security: {
      externalCalls: /\.call\(|\.delegatecall\(|\.staticcall\(/g,
      stateChanges: /\w+\s*=\s*[^=]/g,
      requireStatements: /require\s*\(/g,
      modifiers: /modifier\s+\w+/g
    },
    gasOptimization: {
      loops: /for\s*\(/g,
      storageReads: /storage\s+\w+/g,
      viewFunctions: /function\s+\w+[^{]*view/g,
      pureFunctions: /function\s+\w+[^{]*pure/g
    },
    codeQuality: {
      comments: /\/\*[\s\S]*?\*\/|\/\/.*$/gm,
      emptyLines: /^\s*$/gm,
      longLines: /^.{120,}$/gm,
      magicNumbers: /\b(?!0|1|2|10|100|1000)\d{3,}\b/g
    }
  }), []);

  const analyzeContract = useCallback(async () => {
    if (!contractCode.trim()) {
      alert("Please paste some smart contract code first");
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lines = contractCode.split('\n');
    const totalLines = lines.length;
    const nonEmptyLines = lines.filter(line => line.trim().length > 0).length;

    // Calculate metrics
    const complexityMetrics = {
      cyclomaticComplexity: (contractCode.match(analysisPatterns.complexity.cyclomaticComplexity) || []).length,
      nestingDepth: Math.max(3, (contractCode.match(analysisPatterns.complexity.nestingDepth) || []).length),
      averageFunctionLength: Math.round(nonEmptyLines / Math.max(1, (contractCode.match(/function/g) || []).length))
    };

    const securityMetrics = {
      externalCalls: (contractCode.match(analysisPatterns.security.externalCalls) || []).length,
      stateChanges: (contractCode.match(analysisPatterns.security.stateChanges) || []).length,
      requireStatements: (contractCode.match(analysisPatterns.security.requireStatements) || []).length,
      modifiers: (contractCode.match(analysisPatterns.security.modifiers) || []).length
    };

    const gasMetrics = {
      loops: (contractCode.match(analysisPatterns.gasOptimization.loops) || []).length,
      storageOperations: (contractCode.match(analysisPatterns.gasOptimization.storageReads) || []).length,
      viewFunctions: (contractCode.match(analysisPatterns.gasOptimization.viewFunctions) || []).length,
      pureFunctions: (contractCode.match(analysisPatterns.gasOptimization.pureFunctions) || []).length
    };

    const qualityMetrics = {
      commentRatio: Math.round(((contractCode.match(analysisPatterns.codeQuality.comments) || []).length / Math.max(1, totalLines)) * 100),
      emptyLines: (contractCode.match(analysisPatterns.codeQuality.emptyLines) || []).length,
      longLines: (contractCode.match(analysisPatterns.codeQuality.longLines) || []).length,
      magicNumbers: (contractCode.match(analysisPatterns.codeQuality.magicNumbers) || []).length
    };

    // Calculate scores
    const complexityScore = Math.max(0, 100 - complexityMetrics.cyclomaticComplexity * 5 - complexityMetrics.nestingDepth * 10);
    const securityScore = Math.min(100, securityMetrics.requireStatements * 10 + securityMetrics.modifiers * 15);
    const gasScore = Math.max(0, 100 - gasMetrics.loops * 10 - gasMetrics.storageOperations * 5);
    const qualityScore = Math.min(100, qualityMetrics.commentRatio * 2 - qualityMetrics.magicNumbers * 5);

    const overallScore = Math.round((complexityScore + securityScore + gasScore + qualityScore) / 4);

    setAnalysisResults({
      overview: {
        totalLines,
        nonEmptyLines,
        functions: (contractCode.match(/function/g) || []).length,
        contracts: (contractCode.match(/contract\s+\w+/g) || []).length,
        overallScore
      },
      complexity: { ...complexityMetrics, score: complexityScore },
      security: { ...securityMetrics, score: securityScore },
      gas: { ...gasMetrics, score: gasScore },
      quality: { ...qualityMetrics, score: qualityScore },
      recommendations: generateRecommendations(complexityScore, securityScore, gasScore, qualityScore)
    });

    setIsAnalyzing(false);
  }, [contractCode, analysisPatterns]);

  const generateRecommendations = useCallback((complexity, security, gas, quality) => {
    const recommendations = [];

    if (complexity < 70) {
      recommendations.push({
        category: 'Complexity',
        priority: 'HIGH',
        title: 'Reduce Code Complexity',
        description: 'Consider breaking down complex functions into smaller, more manageable pieces.',
        impact: 'Improves maintainability and reduces bug potential'
      });
    }

    if (security < 60) {
      recommendations.push({
        category: 'Security',
        priority: 'CRITICAL',
        title: 'Add Security Checks',
        description: 'Implement more require statements and access control modifiers.',
        impact: 'Prevents unauthorized access and validates inputs'
      });
    }

    if (gas < 70) {
      recommendations.push({
        category: 'Gas Optimization',
        priority: 'MEDIUM',
        title: 'Optimize Gas Usage',
        description: 'Reduce loops and unnecessary storage operations.',
        impact: 'Lowers transaction costs for users'
      });
    }

    if (quality < 70) {
      recommendations.push({
        category: 'Code Quality',
        priority: 'LOW',
        title: 'Improve Documentation',
        description: 'Add more comments and replace magic numbers with named constants.',
        impact: 'Enhances code readability and maintainability'
      });
    }

    return recommendations;
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'CRITICAL': return 'bg-red-600';
      case 'HIGH': return 'bg-orange-600';
      case 'MEDIUM': return 'bg-yellow-600';
      case 'LOW': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  const exampleContract = `pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Advanced DeFi Protocol
 * @dev A comprehensive DeFi protocol with multiple features
 */
contract AdvancedDeFiProtocol is Ownable, ReentrancyGuard {
    // State variables
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    
    uint256 private _totalSupply = 1000000 * 10**18;
    uint256 private _stakingReward = 5; // 5% annual reward
    string private _name = "Advanced DeFi Token";
    string private _symbol = "ADT";
    
    // Events
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event Stake(address indexed user, uint256 amount);
    
    /**
     * @dev Initialize the contract
     */
    constructor() {
        _balances[msg.sender] = _totalSupply;
    }
    
    /**
     * @dev Check user balance
     * @param account The account to check
     * @return balance The account balance
     */
    function balanceOf(address account) external view returns (uint256 balance) {
        require(account != address(0), "Invalid address");
        return _balances[account];
    }
    
    /**
     * @dev Deposit funds with reentrancy protection
     */
    function deposit() external payable nonReentrant {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        
        _balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
    
    /**
     * @dev Withdraw funds safely
     * @param amount The amount to withdraw
     */
    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "Withdrawal amount must be greater than 0");
        require(_balances[msg.sender] >= amount, "Insufficient balance");
        
        _balances[msg.sender] -= amount;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");
        
        emit Withdraw(msg.sender, amount);
    }
    
    /**
     * @dev Admin function to set staking reward
     * @param newReward The new reward percentage
     */
    function setStakingReward(uint256 newReward) external onlyOwner {
        require(newReward <= 20, "Reward too high"); // Max 20%
        _stakingReward = newReward;
    }
    
    /**
     * @dev Calculate staking rewards
     * @param amount The staking amount
     * @param duration The staking duration in days
     * @return reward The calculated reward
     */
    function calculateReward(uint256 amount, uint256 duration) 
        external 
        view 
        returns (uint256 reward) 
    {
        if (amount == 0 || duration == 0) {
            return 0;
        }
        
        // Complex calculation with multiple conditions
        if (duration >= 365) {
            reward = (amount * _stakingReward * duration) / (100 * 365);
        } else if (duration >= 30) {
            reward = (amount * (_stakingReward - 1) * duration) / (100 * 365);
        } else {
            reward = (amount * (_stakingReward - 2) * duration) / (100 * 365);
        }
        
        return reward;
    }
}`;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 rounded-lg shadow-md">
      <NavigationMenu onNavigationClick={handleNavigation} currentPage={currentPage} />

      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
        🔍 Smart Contract Code Analyzer
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Comprehensive code analysis with complexity metrics, security assessments, and optimization suggestions
      </p>

      {/* Input Section */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow border-2 border-green-300">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">📝 Contract Code Input</h2>
        
        <div className="mb-4">
          <label htmlFor="contract-code" className="block text-sm font-medium text-gray-700 mb-2">
            Smart Contract Code (Solidity)
          </label>
          <textarea
            id="contract-code"
            value={contractCode}
            onChange={(e) => setContractCode(e.target.value)}
            placeholder="Paste your Solidity contract code here for comprehensive analysis..."
            className="w-full h-80 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="flex justify-between items-center">
          <button 
            onClick={analyzeContract}
            disabled={isAnalyzing}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg ${
              isAnalyzing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white'
            }`}
          >
            {isAnalyzing ? '🔍 Analyzing Code...' : '🚀 Analyze Smart Contract'}
          </button>
          
          <button
            onClick={() => setContractCode(exampleContract)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            📝 Load Example Contract
          </button>
        </div>
      </div>

      {/* Results Dashboard */}
      {analysisResults && (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <CodeMetricsCard
              title="Overall Score"
              value={`${analysisResults.overview.overallScore}/100`}
              description="Comprehensive code quality score"
              color={analysisResults.overview.overallScore >= 80 ? 'border-green-500' : 
                     analysisResults.overview.overallScore >= 60 ? 'border-yellow-500' : 'border-red-500'}
              icon="🎯"
            />
            <CodeMetricsCard
              title="Total Lines"
              value={analysisResults.overview.totalLines}
              description={`${analysisResults.overview.nonEmptyLines} non-empty lines`}
              color="border-blue-500"
              icon="📝"
            />
            <CodeMetricsCard
              title="Functions"
              value={analysisResults.overview.functions}
              description="Total function count"
              color="border-purple-500"
              icon="⚡"
            />
            <CodeMetricsCard
              title="Contracts"
              value={analysisResults.overview.contracts}
              description="Contract definitions found"
              color="border-indigo-500"
              icon="📋"
            />
          </div>

          {/* Detailed Analysis Tabs */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {[
                  { id: 'overview', name: '📊 Overview', icon: '📊' },
                  { id: 'complexity', name: '🧮 Complexity', icon: '🧮' },
                  { id: 'security', name: '🔒 Security', icon: '🔒' },
                  { id: 'gas', name: '⛽ Gas Optimization', icon: '⛽' },
                  { id: 'quality', name: '✨ Code Quality', icon: '✨' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedMetric(tab.id)}
                    className={`${
                      selectedMetric === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors`}
                  >
                    {tab.icon} {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {selectedMetric === 'overview' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">📊 Analysis Overview</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                      <h4 className="text-lg font-semibold text-blue-800 mb-4">📈 Score Breakdown</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Complexity</span>
                          <span className={`px-3 py-1 rounded font-semibold ${getScoreColor(analysisResults.complexity.score)}`}>
                            {analysisResults.complexity.score}/100
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Security</span>
                          <span className={`px-3 py-1 rounded font-semibold ${getScoreColor(analysisResults.security.score)}`}>
                            {analysisResults.security.score}/100
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Gas Optimization</span>
                          <span className={`px-3 py-1 rounded font-semibold ${getScoreColor(analysisResults.gas.score)}`}>
                            {analysisResults.gas.score}/100
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Code Quality</span>
                          <span className={`px-3 py-1 rounded font-semibold ${getScoreColor(analysisResults.quality.score)}`}>
                            {analysisResults.quality.score}/100
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                      <h4 className="text-lg font-semibold text-green-800 mb-4">🎯 Key Recommendations</h4>
                      <div className="space-y-2">
                        {analysisResults.recommendations.slice(0, 3).map((rec, index) => (
                          <div key={index} className="text-sm">
                            <span className={`inline-block px-2 py-1 rounded text-white text-xs mr-2 ${getPriorityColor(rec.priority)}`}>
                              {rec.priority}
                            </span>
                            <span className="text-gray-700">{rec.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Complexity Tab */}
              {selectedMetric === 'complexity' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">🧮 Code Complexity Analysis</h3>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <div className="text-orange-600 font-semibold">Cyclomatic Complexity</div>
                      <div className="text-2xl font-bold text-orange-800">{analysisResults.complexity.cyclomaticComplexity}</div>
                      <div className="text-sm text-gray-600">Decision points in code</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <div className="text-red-600 font-semibold">Nesting Depth</div>
                      <div className="text-2xl font-bold text-red-800">{analysisResults.complexity.nestingDepth}</div>
                      <div className="text-sm text-gray-600">Maximum nesting level</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <div className="text-purple-600 font-semibold">Avg Function Length</div>
                      <div className="text-2xl font-bold text-purple-800">{analysisResults.complexity.averageFunctionLength}</div>
                      <div className="text-sm text-gray-600">Lines per function</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {selectedMetric === 'security' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">🔒 Security Analysis</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <div className="text-red-600 font-semibold">External Calls</div>
                        <div className="text-2xl font-bold text-red-800">{analysisResults.security.externalCalls}</div>
                        <div className="text-sm text-gray-600">Potential attack vectors</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="text-blue-600 font-semibold">State Changes</div>
                        <div className="text-2xl font-bold text-blue-800">{analysisResults.security.stateChanges}</div>
                        <div className="text-sm text-gray-600">Variable modifications</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="text-green-600 font-semibold">Require Statements</div>
                        <div className="text-2xl font-bold text-green-800">{analysisResults.security.requireStatements}</div>
                        <div className="text-sm text-gray-600">Input validation checks</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <div className="text-purple-600 font-semibold">Modifiers</div>
                        <div className="text-2xl font-bold text-purple-800">{analysisResults.security.modifiers}</div>
                        <div className="text-sm text-gray-600">Access control patterns</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Gas Tab */}
              {selectedMetric === 'gas' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">⛽ Gas Optimization Analysis</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <div className="text-yellow-600 font-semibold">Loops</div>
                        <div className="text-2xl font-bold text-yellow-800">{analysisResults.gas.loops}</div>
                        <div className="text-sm text-gray-600">Potential gas intensive operations</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <div className="text-orange-600 font-semibold">Storage Operations</div>
                        <div className="text-2xl font-bold text-orange-800">{analysisResults.gas.storageOperations}</div>
                        <div className="text-sm text-gray-600">Expensive storage reads/writes</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="text-blue-600 font-semibold">View Functions</div>
                        <div className="text-2xl font-bold text-blue-800">{analysisResults.gas.viewFunctions}</div>
                        <div className="text-sm text-gray-600">Read-only functions</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="text-green-600 font-semibold">Pure Functions</div>
                        <div className="text-2xl font-bold text-green-800">{analysisResults.gas.pureFunctions}</div>
                        <div className="text-sm text-gray-600">Gas-efficient functions</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quality Tab */}
              {selectedMetric === 'quality' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">✨ Code Quality Analysis</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="text-green-600 font-semibold">Comment Ratio</div>
                        <div className="text-2xl font-bold text-green-800">{analysisResults.quality.commentRatio}%</div>
                        <div className="text-sm text-gray-600">Documentation coverage</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="text-gray-600 font-semibold">Empty Lines</div>
                        <div className="text-2xl font-bold text-gray-800">{analysisResults.quality.emptyLines}</div>
                        <div className="text-sm text-gray-600">Whitespace lines</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <div className="text-yellow-600 font-semibold">Long Lines</div>
                        <div className="text-2xl font-bold text-yellow-800">{analysisResults.quality.longLines}</div>
                        <div className="text-sm text-gray-600">Lines over 120 characters</div>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <div className="text-red-600 font-semibold">Magic Numbers</div>
                        <div className="text-2xl font-bold text-red-800">{analysisResults.quality.magicNumbers}</div>
                        <div className="text-sm text-gray-600">Unexplained numeric literals</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">💡 Improvement Recommendations</h3>
            
            <div className="space-y-4">
              {analysisResults.recommendations.map((rec, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">{rec.title}</h4>
                      <p className="text-sm text-gray-600">{rec.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded text-white text-sm font-semibold ${getPriorityColor(rec.priority)}`}>
                      {rec.priority}
                    </span>
                  </div>
                  <div className="text-xs text-blue-600">
                    <strong>Impact:</strong> {rec.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Feature Information */}
      <div className="bg-white p-6 rounded-lg shadow mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          🔍 Smart Analyzer Features
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-xl font-medium mb-3 text-green-700">📊 Code Metrics</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">🧮</span>
                <span>Cyclomatic complexity analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">📏</span>
                <span>Function length and nesting depth</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">📈</span>
                <span>Overall quality scoring</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-3 text-blue-700">🔒 Security Analysis</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">🔍</span>
                <span>External call detection</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">🛡️</span>
                <span>Access control pattern analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✅</span>
                <span>Input validation assessment</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-3 text-purple-700">⛽ Optimization</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">⚡</span>
                <span>Gas usage optimization tips</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">🔄</span>
                <span>Loop and storage analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">📊</span>
                <span>Performance recommendations</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartAnalyzer;
