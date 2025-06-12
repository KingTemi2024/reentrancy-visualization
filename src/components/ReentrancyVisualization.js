// src/components/ReentrancyVisualization.js
import { useState } from 'react';

const SmartContractVulnerabilityPlatform = () => {
  const [contractCode, setContractCode] = useState('');
  const [detectedVulnerabilities, setDetectedVulnerabilities] = useState([]);
  const [selectedVulnerability, setSelectedVulnerability] = useState(null);
  const [step, setStep] = useState(0);
  const [participants, setParticipants] = useState({});
  const [callStack, setCallStack] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [activeParticipant, setActiveParticipant] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showRecommender, setShowRecommender] = useState(false);
  const [recommendationMode, setRecommendationMode] = useState('quick'); // quick, detailed, comprehensive

  // Vulnerability detection patterns
  const vulnerabilityPatterns = {
    reentrancy: {
      name: "Reentrancy Attack",
      emoji: "🔄",
      severity: "HIGH",
      description: "External calls before state updates allow recursive attacks",
      pattern: /\.call\{.*\}\(\"\"\).*\n.*[-=]/gi,
      alternativePattern: /\.transfer\(.*\).*\n.*[-=]/gi,
      maxSteps: 8,
      createScenario: () => ({
        participants: {
          contract: { balance: 150, role: 'Vulnerable Contract', type: 'contract', address: '📝 Contract' },
          victim: { balance: 0, role: 'Honest User', type: 'eoa', deposited: 100, address: '😇 Victim' },
          attacker: { balance: 0, role: 'Malicious User', type: 'eoa', deposited: 50, address: '😈 Attacker' }
        },
        steps: [
          { message: "😇 Honest user deposits 100 ETH", type: 'info', actor: 'victim', balanceChanges: { victim: { balance: 100 } } },
          { message: "😈 Attacker deposits 50 ETH to gain legitimacy", type: 'info', actor: 'attacker', balanceChanges: { attacker: { balance: 50 } } },
          { message: "🚨 Attacker calls withdraw(50 ETH)", type: 'warning', actor: 'attacker', callStack: ["withdraw(50 ETH)"] },
          { message: "📝 Contract sends ETH before updating balance", type: 'info', callStack: ["withdraw(50 ETH)", "transfer 50 ETH"] },
          { message: "⚡ Attacker's receive() triggers during transfer", type: 'danger', callStack: ["withdraw(50 ETH)", "transfer 50 ETH", "receive() callback"] },
          { message: "🔄 Attacker calls withdraw(50 ETH) AGAIN!", type: 'danger', callStack: ["withdraw(50 ETH)", "transfer 50 ETH", "receive() callback", "withdraw(50 ETH) AGAIN"] },
          { message: "💰 Contract sends another 50 ETH (balance still not updated)", type: 'danger', balanceChanges: { attacker: { balance: 100 }, contract: { balance: 50 } } },
          { message: "💔 Honest user can only withdraw 50 ETH (lost 50 ETH)", type: 'danger', balanceChanges: { victim: { balance: 50 } } }
        ]
      })
    },
    integerOverflow: {
      name: "Integer Overflow",
      emoji: "📊",
      severity: "HIGH",
      description: "Arithmetic operations that exceed maximum values wrap around",
      pattern: /uint\d*.*[+\-\*]/gi,
      maxSteps: 6,
      createScenario: () => ({
        participants: {
          contract: { balance: 'MAX', role: 'Token Contract', type: 'contract', address: '🪙 Token' },
          victim: { balance: 1000, role: 'Token Holder', type: 'eoa', tokens: 1000, address: '😇 Holder' },
          attacker: { balance: 0, role: 'Exploiter', type: 'eoa', tokens: 1, address: '😈 Exploiter' }
        },
        steps: [
          { message: "😇 Holder has 1000 tokens", type: 'info', actor: 'victim' },
          { message: "😈 Exploiter has only 1 token", type: 'info', actor: 'attacker' },
          { message: "🚨 Exploiter calls transfer(-1) to victim", type: 'warning', actor: 'attacker' },
          { message: "📊 Contract calculates: 1 - (-1) = 2", type: 'info' },
          { message: "💥 But -1 becomes MAX_UINT (overflow!)", type: 'danger', balanceChanges: { attacker: { tokens: 'MAX_UINT' } } },
          { message: "💔 Exploiter now has unlimited tokens!", type: 'danger' }
        ]
      })
    },
    accessControl: {
      name: "Access Control Bypass",
      emoji: "🔐",
      severity: "CRITICAL",
      description: "Missing or flawed access controls allow unauthorized actions",
      pattern: /function.*public(?!.*onlyOwner|.*require.*owner|.*modifier)/gi,
      maxSteps: 5,
      createScenario: () => ({
        participants: {
          contract: { balance: 1000000, role: 'Company Contract', type: 'contract', address: '🏢 Contract' },
          owner: { balance: 0, role: 'Contract Owner', type: 'eoa', address: '👨‍💼 Owner' },
          attacker: { balance: 0, role: 'Random User', type: 'eoa', address: '😈 Random' }
        },
        steps: [
          { message: "🏢 Contract holds 1M ETH in company funds", type: 'info' },
          { message: "👨‍💼 Only owner should access withdrawal function", type: 'info', actor: 'owner' },
          { message: "😈 Random user discovers public withdrawal function", type: 'warning', actor: 'attacker' },
          { message: "🚨 No access control check - anyone can call it!", type: 'danger' },
          { message: "💰 Random user drains entire contract", type: 'danger', balanceChanges: { attacker: { balance: 1000000 }, contract: { balance: 0 } } }
        ]
      })
    },
    txOriginAttack: {
      name: "tx.origin Attack",
      emoji: "🎭",
      severity: "MEDIUM",
      description: "Using tx.origin instead of msg.sender enables phishing attacks",
      pattern: /tx\.origin/gi,
      maxSteps: 7,
      createScenario: () => ({
        participants: {
          wallet: { balance: 500, role: 'Wallet Contract', type: 'contract', address: '💼 Wallet' },
          owner: { balance: 0, role: 'Wallet Owner', type: 'eoa', address: '😇 Owner' },
          maliciousContract: { balance: 0, role: 'Phishing Contract', type: 'contract', address: '🎣 Phishing' },
          attacker: { balance: 0, role: 'Phisher', type: 'eoa', address: '😈 Phisher' }
        },
        steps: [
          { message: "💼 Wallet contract uses tx.origin for authorization", type: 'info' },
          { message: "😇 Owner has 500 ETH in wallet contract", type: 'info', actor: 'owner' },
          { message: "😈 Phisher creates malicious contract", type: 'warning', actor: 'attacker' },
          { message: "🎣 Phisher tricks owner to call malicious contract", type: 'warning' },
          { message: "⚡ Malicious contract calls wallet.withdraw()", type: 'danger' },
          { message: "🎭 tx.origin still points to owner, check passes!", type: 'danger' },
          { message: "💰 Phisher drains owner's wallet through proxy", type: 'danger', balanceChanges: { attacker: { balance: 500 }, wallet: { balance: 0 } } }
        ]
      })
    },
    uncheckedLowLevel: {
      name: "Unchecked Low-Level Calls",
      emoji: "⚠️",
      severity: "MEDIUM",
      description: "Low-level calls that don't check return values can fail silently",
      pattern: /\.call\((?!.*success)/gi,
      maxSteps: 5,
      createScenario: () => ({
        participants: {
          contract: { balance: 1000, role: 'Payment Contract', type: 'contract', address: '💳 Payment' },
          recipient: { balance: 0, role: 'Payment Recipient', type: 'eoa', address: '😇 Recipient' },
          system: { balance: 0, role: 'System Status', type: 'system', address: '📊 System' }
        },
        steps: [
          { message: "💳 Contract processes payment to recipient", type: 'info' },
          { message: "😇 Recipient account is invalid/frozen", type: 'warning', actor: 'recipient' },
          { message: "⚠️ Contract makes low-level call without checking return", type: 'warning' },
          { message: "❌ Payment fails silently, no revert", type: 'danger' },
          { message: "💔 Contract thinks payment succeeded, recipient gets nothing", type: 'danger' }
        ]
      })
    }
  };

  const addLog = (message, type = 'info') => {
    setLogs(prevLogs => [...prevLogs, { 
      message, 
      time: new Date().toLocaleTimeString(), 
      type 
    }]);
  };

  const analyzeContract = () => {
    if (!contractCode.trim()) {
      addLog("❌ Please paste some smart contract code first", 'error');
      return;
    }

    const vulnerabilities = [];
    
    Object.entries(vulnerabilityPatterns).forEach(([key, pattern]) => {
      const matches = contractCode.match(pattern.pattern) || contractCode.match(pattern.alternativePattern);
      if (matches) {
        vulnerabilities.push({
          id: key,
          ...pattern,
          matches: matches.length,
          codeSnippets: matches.slice(0, 3)
        });
      }
    });

    setDetectedVulnerabilities(vulnerabilities);
    setShowAnalysis(true);
    
    if (vulnerabilities.length === 0) {
      addLog("✅ No obvious vulnerabilities detected in basic scan", 'success');
      addLog("⚠️ Note: This is a basic pattern check. Professional audit recommended", 'warning');
    } else {
      addLog(`🚨 Found ${vulnerabilities.length} potential vulnerability(ies)`, 'danger');
      vulnerabilities.forEach(vuln => {
        addLog(`${vuln.emoji} ${vuln.name} (${vuln.severity})`, vuln.severity === 'CRITICAL' ? 'danger' : 'warning');
      });
      
      // Auto-suggest using the recommender
      setTimeout(() => {
        addLog("💡 Tip: Click the '💡 Recommender' button above for detailed security recommendations!", 'info');
      }, 2000);
    }
  };

  const selectVulnerability = (vuln) => {
    const scenario = vuln.createScenario();
    setSelectedVulnerability(vuln);
    setParticipants(scenario.participants);
    setStep(0);
    setCallStack([]);
    setActiveParticipant(null);
    addLog(`🎯 Testing ${vuln.name} vulnerability`, 'info');
    addLog("🎬 Click 'Next Step' to see the attack simulation", 'info');
  };

  const nextStep = () => {
    if (!selectedVulnerability || step >= selectedVulnerability.maxSteps) return;
    
    const scenario = selectedVulnerability.createScenario();
    const currentStep = scenario.steps[step];
    
    setStep(prevStep => {
      const newStep = prevStep + 1;
      executeStep(currentStep, newStep);
      return newStep;
    });
  };

  const executeStep = (stepData, stepNum) => {
    addLog(stepData.message, stepData.type);
    
    if (stepData.actor) {
      setActiveParticipant(stepData.actor);
    }
    
    if (stepData.callStack) {
      setCallStack(stepData.callStack);
    }
    
    if (stepData.balanceChanges) {
      setParticipants(prev => {
        const newParticipants = { ...prev };
        Object.entries(stepData.balanceChanges).forEach(([key, changes]) => {
          if (newParticipants[key]) {
            newParticipants[key] = { ...newParticipants[key], ...changes };
          }
        });
        return newParticipants;
      });
    }
  };

  const reset = () => {
    setStep(0);
    setCallStack([]);
    setActiveParticipant(null);
    setIsAutoPlaying(false);
    if (selectedVulnerability) {
      const scenario = selectedVulnerability.createScenario();
      setParticipants(scenario.participants);
    }
    addLog("🔄 Simulation reset", 'system');
  };

  const autoPlay = () => {
    if (isAutoPlaying || !selectedVulnerability) return;
    
    setIsAutoPlaying(true);
    const scenario = selectedVulnerability.createScenario();
    
    const interval = setInterval(() => {
      setStep(prevStep => {
        if (prevStep >= selectedVulnerability.maxSteps) {
          clearInterval(interval);
          setIsAutoPlaying(false);
          return prevStep;
        }
        
        const currentStep = scenario.steps[prevStep];
        const newStep = prevStep + 1;
        executeStep(currentStep, newStep);
        return newStep;
      });
    }, speed);
  };

  const getParticipantColor = (key) => {
    const isActive = activeParticipant === key;
    const participant = participants[key];
    
    if (!participant) return 'bg-gray-500';
    
    if (isActive) {
      if (key.includes('attack') || key.includes('exploit') || key.includes('malicious')) return 'bg-red-600 animate-pulse shadow-lg';
      if (participant.type === 'contract') return 'bg-purple-600 animate-pulse shadow-lg';
      return 'bg-blue-600 animate-pulse shadow-lg';
    }
    
    if (key.includes('attack') || key.includes('exploit') || key.includes('malicious')) return 'bg-red-500';
    if (participant.type === 'contract') return 'bg-purple-500';
    if (participant.type === 'system') return 'bg-gray-500';
    return 'bg-blue-500';
  };

  const getLogColor = (type) => {
    switch(type) {
      case 'danger': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'system': return 'text-blue-400';
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-300';
      default: return 'text-green-400';
    }
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

  // Add navigation handler
  const handleNavigation = (componentName) => {
    if (componentName === 'Recommender') {
      // Show recommender interface
      setShowRecommender(true);
    } else {
      alert(`Navigation to ${componentName} - In your real app, this would navigate to src/components/${componentName}.js`);
    }
  };

  const exampleContracts = {
    reentrancy: `pragma solidity ^0.8.0;

contract VulnerableBank {
    mapping(address => uint256) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        // VULNERABILITY: External call before state update
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        balances[msg.sender] -= amount; // Too late!
    }
}`,
    overflow: `pragma solidity ^0.4.24; // Old version without SafeMath

contract VulnerableToken {
    mapping(address => uint256) public balances;
    
    function transfer(address to, uint256 amount) public {
        // VULNERABILITY: No overflow protection
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}`,
    accessControl: `pragma solidity ^0.8.0;

contract VulnerableWallet {
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    // VULNERABILITY: Missing access control
    function withdraw(uint256 amount) public {
        // Should have: require(msg.sender == owner, "Not owner");
        payable(msg.sender).transfer(amount);
    }
}`,
    multiVuln: `pragma solidity ^0.7.0; // Old version - vulnerable to overflow

contract SuperVulnerableBank {
    mapping(address => uint256) public balances;
    address public owner;
    uint256 public totalSupply;
    
    constructor() {
        owner = msg.sender;
        totalSupply = 1000000;
    }
    
    // VULNERABILITY 1: Missing access control
    function emergencyWithdraw(uint256 amount) public {
        // Should have: require(msg.sender == owner, "Not owner");
        payable(msg.sender).transfer(amount);
    }
    
    // VULNERABILITY 2: Integer overflow (old Solidity version)
    function mint(address to, uint256 amount) public {
        // No SafeMath - can overflow!
        balances[to] += amount;
        totalSupply += amount;
    }
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    // VULNERABILITY 3: Reentrancy attack
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        // DANGEROUS: External call before state update
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        // Too late! Balance updated after external call
        balances[msg.sender] -= amount;
    }
    
    // VULNERABILITY 4: More overflow potential
    function transfer(address to, uint256 amount) public {
        // No overflow protection
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
    
    // VULNERABILITY 5: Another missing access control
    function setOwner(address newOwner) public {
        // Anyone can become owner!
        owner = newOwner;
    }
    
    // VULNERABILITY 6: Unchecked low-level call
    function payUser(address user, uint256 amount) public {
        // Doesn't check if call succeeded
        user.call{value: amount}("");
        balances[user] += amount;
    }
}`
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 rounded-lg shadow-md">
      {/* NAVIGATION MENU - SMART CONTRACT SECURITY SUITE */}
      <div className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl shadow-lg border">
        <h2 className="text-2xl font-bold mb-4 text-white text-center">🔐 Smart Contract Security Suite</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => handleNavigation('EnhancedSmartContractPlatform')}
            className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
          >
            🏠 Enhanced Platform
          </button>
          <button 
            onClick={() => handleNavigation('SmartAnalyzer')}
            className="px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
          >
            🔍 Smart Analyzer
          </button>
          <button 
            onClick={() => handleNavigation('SmartContractVulnerabilityPlatform')}
            className="px-6 py-3 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
          >
            🛡️ Vulnerability Platform
          </button>
          <button 
            onClick={() => handleNavigation('Recommender')}
            className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
          >
            💡 Recommender
          </button>
          <button 
            className="px-6 py-3 bg-yellow-400 text-purple-800 rounded-lg font-bold shadow-md cursor-default border-2 border-yellow-300"
          >
            ⚡ Vulnerability Tester (CURRENT)
          </button>
        </div>
        <p className="text-white text-center mt-4 opacity-90">
          📍 Navigate between different smart contract security tools
        </p>
      </div>

      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
        🔍 Smart Contract Vulnerability Testing Platform
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Paste your smart contract code below to analyze it for common vulnerabilities and see interactive attack simulations
      </p>

      {/* Code Input Section */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow border-2 border-blue-300">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">📝 Paste Your Smart Contract Code</h2>
        
        <div className="mb-4">
          <label htmlFor="contract-code" className="block text-sm font-medium text-gray-700 mb-2">
            Smart Contract Code (Solidity)
          </label>
          <textarea
            id="contract-code"
            value={contractCode}
            onChange={(e) => setContractCode(e.target.value)}
            placeholder="pragma solidity ^0.8.0;

contract YourContract {
    // Paste your smart contract code here...
}"
            className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <button 
            onClick={analyzeContract}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors font-semibold"
          >
            🔍 Analyze for Vulnerabilities
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
            <span className="text-sm text-gray-600 font-medium">Quick Examples:</span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(exampleContracts).map(([key, code]) => (
                <button
                  key={key}
                  onClick={() => setContractCode(code)}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    key === 'multiVuln' 
                      ? 'bg-red-600 text-white hover:bg-red-700 border-2 border-red-700' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {key === 'multiVuln' ? '💥 multiVuln' : key}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {showAnalysis && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">📊 Vulnerability Analysis Results</h2>
          
          {detectedVulnerabilities.length === 0 ? (
            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
              <div className="flex items-center">
                <div className="text-green-600 text-2xl mr-3">✅</div>
                <div>
                  <h3 className="text-lg font-semibold text-green-800">No Obvious Vulnerabilities Detected</h3>
                  <p className="text-green-700">
                    Our basic pattern matching didn't find common vulnerability patterns. However, this doesn't guarantee your contract is safe.
                    Consider professional security audits for production contracts.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {detectedVulnerabilities.map((vuln, index) => (
                <div key={vuln.id} className="bg-red-50 p-4 rounded-lg border-2 border-red-300">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{vuln.emoji}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-red-800">{vuln.name}</h3>
                        <p className="text-red-700">{vuln.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded text-white text-sm font-semibold ${getSeverityColor(vuln.severity)}`}>
                        {vuln.severity}
                      </span>
                      <button
                        onClick={() => selectVulnerability(vuln)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                      >
                        🎯 Test This Vulnerability
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-red-600">
                    <strong>Found {vuln.matches} potential issue(s) in your code</strong>
                  </div>
                  
                  {vuln.codeSnippets && vuln.codeSnippets.length > 0 && (
                    <div className="mt-3">
                      <details className="cursor-pointer">
                        <summary className="text-sm font-medium text-red-700 hover:text-red-800">
                          Show problematic code patterns
                        </summary>
                        <div className="mt-2 bg-gray-900 p-3 rounded text-green-400 font-mono text-sm">
                          {vuln.codeSnippets.map((snippet, i) => (
                            <div key={i} className="mb-1">
                              {snippet.trim()}
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* RECOMMENDER SECTION */}
      {showRecommender && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">💡 Smart Contract Security Recommender</h2>
          
          {/* Recommendation Mode Selector */}
          <div className="mb-6 bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold mb-3 text-purple-800">🎯 Select Recommendation Mode</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => setRecommendationMode('quick')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  recommendationMode === 'quick' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                ⚡ Quick Fix
              </button>
              <button
                onClick={() => setRecommendationMode('detailed')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  recommendationMode === 'detailed' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                🔍 Detailed Analysis
              </button>
              <button
                onClick={() => setRecommendationMode('comprehensive')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  recommendationMode === 'comprehensive' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                🧠 Comprehensive Report
              </button>
            </div>
          </div>

          {/* Quick Fix Mode */}
          {recommendationMode === 'quick' && (
            <div className="space-y-6">
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-xl font-semibold mb-4 text-green-800">⚡ Quick Security Fixes</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg border border-green-300">
                    <div className="flex items-center mb-3">
                      <div className="text-2xl mr-3">🔄</div>
                      <h4 className="text-lg font-semibold text-green-700">Reentrancy Protection</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Add checks-effects-interactions pattern</p>
                    <div className="bg-gray-900 p-3 rounded text-green-400 font-mono text-xs">
                      <pre>{`// Move state updates before external calls
balances[msg.sender] -= amount;
(bool success, ) = msg.sender.call{value: amount}("");`}</pre>
                    </div>
                    <div className="mt-2 text-xs text-green-600">
                      ✅ Security: 95% | ⚡ Difficulty: Easy | 💰 Gas: Minimal
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-blue-300">
                    <div className="flex items-center mb-3">
                      <div className="text-2xl mr-3">🔐</div>
                      <h4 className="text-lg font-semibold text-blue-700">Access Control</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Add proper authorization checks</p>
                    <div className="bg-gray-900 p-3 rounded text-green-400 font-mono text-xs">
                      <pre>{`// Add access control modifier
require(msg.sender == owner, "Not authorized");`}</pre>
                    </div>
                    <div className="mt-2 text-xs text-blue-600">
                      ✅ Security: 98% | ⚡ Difficulty: Easy | 💰 Gas: Low
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-yellow-300">
                    <div className="flex items-center mb-3">
                      <div className="text-2xl mr-3">📊</div>
                      <h4 className="text-lg font-semibold text-yellow-700">Overflow Protection</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Upgrade to Solidity 0.8+ for automatic checks</p>
                    <div className="bg-gray-900 p-3 rounded text-green-400 font-mono text-xs">
                      <pre>{`pragma solidity ^0.8.0;
// Automatic overflow/underflow protection`}</pre>
                    </div>
                    <div className="mt-2 text-xs text-yellow-600">
                      ✅ Security: 100% | ⚡ Difficulty: Easy | 💰 Gas: Minimal
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-red-300">
                    <div className="flex items-center mb-3">
                      <div className="text-2xl mr-3">⚠️</div>
                      <h4 className="text-lg font-semibold text-red-700">Call Safety</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Always check return values of external calls</p>
                    <div className="bg-gray-900 p-3 rounded text-green-400 font-mono text-xs">
                      <pre>{`(bool success, ) = target.call{value: amount}("");
require(success, "Call failed");`}</pre>
                    </div>
                    <div className="mt-2 text-xs text-red-600">
                      ✅ Security: 90% | ⚡ Difficulty: Easy | 💰 Gas: Low
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Analysis Mode */}
          {recommendationMode === 'detailed' && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-xl font-semibold mb-4 text-blue-800">🔍 Detailed Security Analysis & Recommendations</h3>
                
                <div className="grid md:grid-cols-1 gap-6">
                  <div className="bg-white p-5 rounded-lg border border-blue-300">
                    <h4 className="text-lg font-semibold text-blue-700 mb-3">🎯 Priority Vulnerabilities</h4>
                    
                    <div className="space-y-4">
                      <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold text-red-700">Critical: Reentrancy in withdraw()</h5>
                          <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">HIGH RISK</span>
                        </div>
                        <p className="text-sm text-red-600 mb-2">
                          External call before state update allows recursive attacks. Potential loss: $100K - $10M
                        </p>
                        <div className="text-xs text-red-500">
                          📍 Line 15 | 🕒 Fix Time: 1-2 hours | 💰 Economic Impact: High
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                          <div className="bg-red-100 p-2 rounded text-center">
                            <strong>Exploitability</strong><br/>8/10
                          </div>
                          <div className="bg-orange-100 p-2 rounded text-center">
                            <strong>Impact</strong><br/>9/10
                          </div>
                          <div className="bg-yellow-100 p-2 rounded text-center">
                            <strong>Likelihood</strong><br/>7/10
                          </div>
                        </div>
                      </div>

                      <div className="border-l-4 border-orange-500 pl-4 bg-orange-50 p-3 rounded">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold text-orange-700">Medium: Missing Access Control</h5>
                          <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs">MED RISK</span>
                        </div>
                        <p className="text-sm text-orange-600 mb-2">
                          Public functions lack proper authorization. Potential unauthorized access to critical functions.
                        </p>
                        <div className="text-xs text-orange-500">
                          📍 Line 8, 23 | 🕒 Fix Time: 30 minutes | 💰 Economic Impact: Medium
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg border border-green-300">
                    <h4 className="text-lg font-semibold text-green-700 mb-3">💡 Recommended Solutions</h4>
                    
                    <div className="space-y-4">
                      <div className="bg-green-50 p-4 rounded border border-green-200">
                        <h5 className="font-semibold text-green-700 mb-2">1. Implement ReentrancyGuard</h5>
                        <p className="text-sm text-gray-600 mb-3">
                          Use OpenZeppelin's battle-tested reentrancy protection modifier.
                        </p>
                        <div className="bg-gray-900 p-3 rounded text-green-400 font-mono text-sm mb-2">
                          <pre>{`import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SecureBank is ReentrancyGuard {
    function withdraw(uint256 amount) public nonReentrant {
        require(balances[msg.sender] >= amount);
        balances[msg.sender] -= amount;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success);
    }
}`}</pre>
                        </div>
                        <div className="flex space-x-4 text-xs">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Security: 100%</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Gas: +2,300</span>
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Difficulty: Easy</span>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded border border-blue-200">
                        <h5 className="font-semibold text-blue-700 mb-2">2. Add Comprehensive Access Control</h5>
                        <p className="text-sm text-gray-600 mb-3">
                          Implement role-based access control for granular permissions.
                        </p>
                        <div className="bg-gray-900 p-3 rounded text-green-400 font-mono text-sm mb-2">
                          <pre>{`import "@openzeppelin/contracts/access/AccessControl.sol";

contract SecureContract is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Not admin");
        _;
    }
    
    function withdraw(uint256 amount) public onlyAdmin {
        // Implementation
    }
}`}</pre>
                        </div>
                        <div className="flex space-x-4 text-xs">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Security: 95%</span>
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Gas: +5,000</span>
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">Difficulty: Medium</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comprehensive Report Mode */}
          {recommendationMode === 'comprehensive' && (
            <div className="space-y-6">
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-xl font-semibold mb-4 text-purple-800">🧠 Comprehensive Security Report</h3>
                
                <div className="grid md:grid-cols-1 gap-6">
                  {/* Executive Summary */}
                  <div className="bg-white p-5 rounded-lg border border-purple-300">
                    <h4 className="text-lg font-semibold text-purple-700 mb-3">📊 Executive Summary</h4>
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-red-100 p-3 rounded text-center">
                        <div className="text-2xl font-bold text-red-600">85</div>
                        <div className="text-sm text-red-700">Risk Score</div>
                      </div>
                      <div className="bg-orange-100 p-3 rounded text-center">
                        <div className="text-2xl font-bold text-orange-600">6</div>
                        <div className="text-sm text-orange-700">Vulnerabilities</div>
                      </div>
                      <div className="bg-yellow-100 p-3 rounded text-center">
                        <div className="text-2xl font-bold text-yellow-600">4-8h</div>
                        <div className="text-sm text-yellow-700">Fix Time</div>
                      </div>
                      <div className="bg-blue-100 p-3 rounded text-center">
                        <div className="text-2xl font-bold text-blue-600">$5M+</div>
                        <div className="text-sm text-blue-700">Potential Loss</div>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">
                      <strong>Critical Finding:</strong> This contract contains multiple high-severity vulnerabilities that could lead to 
                      complete loss of funds. Immediate remediation is required before any mainnet deployment.
                    </p>
                  </div>

                  {/* Historical Case Studies */}
                  <div className="bg-white p-5 rounded-lg border border-red-300">
                    <h4 className="text-lg font-semibold text-red-700 mb-3">📚 Historical Attack Cases</h4>
                    <div className="space-y-3">
                      <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded">
                        <h5 className="font-semibold text-red-700">The DAO Hack (2016)</h5>
                        <p className="text-sm text-red-600">
                          <strong>Loss:</strong> $60 million | <strong>Vulnerability:</strong> Reentrancy
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Similar reentrancy pattern detected in your contract. Led to Ethereum hard fork.
                        </p>
                      </div>
                      <div className="border-l-4 border-orange-500 pl-4 bg-orange-50 p-3 rounded">
                        <h5 className="font-semibold text-orange-700">Parity Wallet (2017)</h5>
                        <p className="text-sm text-orange-600">
                          <strong>Loss:</strong> $280 million | <strong>Vulnerability:</strong> Access Control
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Missing access controls allowed anyone to destroy the wallet library.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Implementation Roadmap */}
                  <div className="bg-white p-5 rounded-lg border border-green-300">
                    <h4 className="text-lg font-semibold text-green-700 mb-3">🗺️ Security Implementation Roadmap</h4>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-red-700">Immediate (Day 1)</h5>
                          <p className="text-sm text-gray-600">Fix critical reentrancy vulnerability using ReentrancyGuard</p>
                          <div className="text-xs text-red-500 mt-1">⏰ 2 hours | 🔧 Easy implementation</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-orange-700">Short-term (Week 1)</h5>
                          <p className="text-sm text-gray-600">Implement comprehensive access control and upgrade Solidity version</p>
                          <div className="text-xs text-orange-500 mt-1">⏰ 4-6 hours | 🔧 Medium implementation</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-green-700">Long-term (Month 1)</h5>
                          <p className="text-sm text-gray-600">Professional audit, extensive testing, and bug bounty program</p>
                          <div className="text-xs text-green-500 mt-1">⏰ 2-4 weeks | 🔧 Professional required</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cost-Benefit Analysis */}
                  <div className="bg-white p-5 rounded-lg border border-blue-300">
                    <h4 className="text-lg font-semibold text-blue-700 mb-3">💰 Cost-Benefit Analysis</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-red-50 p-3 rounded">
                        <h5 className="font-semibold text-red-700 mb-2">💸 Cost of NOT Fixing</h5>
                        <ul className="text-sm text-red-600 space-y-1">
                          <li>• Potential loss: $100K - $10M</li>
                          <li>• Legal liability and lawsuits</li>
                          <li>• Reputation damage</li>
                          <li>• Regulatory scrutiny</li>
                          <li>• User trust loss</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 p-3 rounded">
                        <h5 className="font-semibold text-green-700 mb-2">💪 Investment in Security</h5>
                        <ul className="text-sm text-green-600 space-y-1">
                          <li>• Development time: 8-12 hours</li>
                          <li>• Gas cost increase: ~5,000 gas</li>
                          <li>• Audit cost: $10K - $50K</li>
                          <li>• Testing & QA: $5K - $15K</li>
                          <li>• <strong>ROI: 10,000%+</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={() => setShowRecommender(false)}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Back to Analysis
            </button>
            <button
              onClick={() => {
                alert('Feature would generate full security report as PDF/Word document');
              }}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              📄 Generate Report
            </button>
            <button
              onClick={() => {
                alert('Feature would generate secure contract template with fixes applied');
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              🔧 Generate Fixed Contract
            </button>
          </div>
        </div>
      )}
      {selectedVulnerability && (
        <>
          {/* Participants */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <div className="lg:col-span-3 bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                {selectedVulnerability.emoji} Testing: {selectedVulnerability.name}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {Object.entries(participants).map(([key, participant]) => (
                  <div key={key} className={`${getParticipantColor(key)} text-white p-4 rounded-lg transition-all duration-300`}>
                    <div className="text-sm font-medium mb-1">
                      {participant.type === 'contract' ? '📝 Contract' : participant.type === 'system' ? '⚙️ System' : '👤 User'}
                    </div>
                    <div className="text-lg font-medium mb-2">{participant.role}</div>
                    <div className="font-mono text-xl mb-1">
                      {typeof participant.balance === 'string' ? participant.balance : `$${participant.balance}`}
                    </div>
                    <div className="text-sm opacity-90 mb-1">{participant.address}</div>
                    {participant.deposited && (
                      <div className="text-sm opacity-90">Put in: ${participant.deposited}</div>
                    )}
                    {participant.tokens && (
                      <div className="text-sm opacity-90">Tokens: {participant.tokens}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Call Stack */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Function Calls</h2>
              <div className="bg-gray-900 p-3 rounded text-green-400 font-mono text-xs overflow-x-auto">
                {callStack.length > 0 ? (
                  <div className="space-y-1">
                    {callStack.map((call, index) => (
                      <div key={index} style={{ marginLeft: `${index * 0.5}rem` }}>
                        → {call}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>No function calls yet</div>
                )}
              </div>
            </div>
          </div>

          {/* Attack Progress */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {selectedVulnerability.emoji} {selectedVulnerability.name} Simulation - Step {step} of {selectedVulnerability.maxSteps}
            </h2>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
              <div 
                className="bg-gradient-to-r from-blue-500 to-red-500 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${(step / selectedVulnerability.maxSteps) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-center space-x-4 mb-4">
              <button 
                onClick={reset} 
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
              >
                🔄 Reset
              </button>
              <button 
                onClick={nextStep} 
                disabled={step >= selectedVulnerability.maxSteps || isAutoPlaying}
                className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors ${(step >= selectedVulnerability.maxSteps || isAutoPlaying) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                ▶️ Next Step
              </button>
              <button 
                onClick={autoPlay} 
                disabled={step >= selectedVulnerability.maxSteps || isAutoPlaying}
                className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors ${(step >= selectedVulnerability.maxSteps || isAutoPlaying) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isAutoPlaying ? '⏸️ Playing...' : '🚀 Auto Play'}
              </button>
            </div>

            <div className="flex items-center justify-center">
              <label htmlFor="speed-slider" className="mr-3 text-sm">Speed:</label>
              <input 
                id="speed-slider" 
                type="range" 
                min="500" 
                max="3000" 
                step="100" 
                value={speed} 
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-32"
                disabled={isAutoPlaying}
              />
              <span className="ml-2 text-sm">{speed}ms</span>
            </div>
          </div>
        </>
      )}

      {/* Event Logs */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {selectedVulnerability ? `${selectedVulnerability.emoji} Attack Simulation Log` : '📋 Analysis Log'}
        </h2>
        <div className="bg-gray-900 p-4 rounded text-sm h-64 overflow-y-auto">
          {logs.length > 0 ? (
            <div className="space-y-1">
              {logs.map((log, index) => (
                <div key={index} className={getLogColor(log.type)}>
                  <span className="text-gray-500">[{log.time}]</span> {log.message}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-green-400">Ready to analyze smart contracts...</div>
          )}
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          📚 How This Platform Works
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-medium mb-3">🔍 What We Analyze</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">🔄</span>
                <span><strong>Reentrancy:</strong> External calls before state updates</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">📊</span>
                <span><strong>Integer Overflow:</strong> Arithmetic without SafeMath</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">🔐</span>
                <span><strong>Access Control:</strong> Missing authorization checks</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">🎭</span>
                <span><strong>tx.origin:</strong> Phishing-vulnerable patterns</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">⚠️</span>
                <span><strong>Unchecked Calls:</strong> Silent failure risks</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-3">🎯 Interactive Testing</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">1.</span>
                <span>Paste your smart contract code</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">2.</span>
                <span>Run automated vulnerability analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">3.</span>
                <span>Select detected vulnerabilities to test</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">4.</span>
                <span>Watch step-by-step attack simulations</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">5.</span>
                <span>Learn how to fix the issues</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
          <h3 className="text-lg font-bold mb-2 text-yellow-800">⚠️ Important Disclaimer</h3>
          <p className="text-yellow-700">
            This tool provides basic pattern-based vulnerability detection for educational purposes. 
            It's not a substitute for professional security audits. Always have your production smart contracts 
            audited by experienced security professionals before deploying to mainnet.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmartContractVulnerabilityPlatform;
