// src/components/SmartContractPlatform.js
import React, { useState, useCallback, useMemo, memo } from 'react';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Smart Contract Platform Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 max-w-4xl mx-auto bg-red-50 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-800 mb-4">⚠️ Application Error</h2>
          <p className="text-red-700 mb-4">
            Something went wrong with the Smart Contract Platform. Please refresh the page to try again.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            🔄 Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Memoized Navigation Component
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

// Memoized Code Input Component
const CodeInputSection = memo(({ 
  contractCode, 
  setContractCode, 
  onAnalyze, 
  exampleContracts 
}) => (
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
        onClick={onAnalyze}
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
));

CodeInputSection.displayName = 'CodeInputSection';

// Main Smart Contract Platform Component
const SmartContractVulnerabilityTester = ({ onNavigationClick, currentPage = 'SmartContractPlatform' }) => {
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
  const [recommendationMode, setRecommendationMode] = useState('quick');

  // Default navigation handler if none provided
  const handleNavigation = useCallback((componentName) => {
    if (onNavigationClick) {
      onNavigationClick(componentName);
    } else {
      console.log(`Navigation to: ${componentName}`);
      alert(`Navigation to ${componentName} - This would use React Router in a full application`);
    }
  }, [onNavigationClick]);

  // Memoized vulnerability patterns
  const vulnerabilityPatterns = useMemo(() => ({
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
  }), []);

  // Memoized example contracts
  const exampleContracts = useMemo(() => ({
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
  }), []);

  // Callback functions with error handling
  const addLog = useCallback((message, type = 'info') => {
    setLogs(prevLogs => [...prevLogs, { 
      message, 
      time: new Date().toLocaleTimeString(), 
      type 
    }]);
  }, []);

  const analyzeContract = useCallback(() => {
    if (!contractCode.trim()) {
      addLog("❌ Please paste some smart contract code first", 'error');
      return;
    }

    try {
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
        
        setTimeout(() => {
          addLog("💡 Click on any vulnerability below to see an interactive attack simulation!", 'info');
        }, 2000);
      }
    } catch (error) {
      addLog(`❌ Analysis error: ${error.message}`, 'error');
      console.error('Contract analysis error:', error);
    }
  }, [contractCode, vulnerabilityPatterns, addLog]);

  const selectVulnerability = useCallback((vuln) => {
    try {
      const scenario = vuln.createScenario();
      setSelectedVulnerability(vuln);
      setParticipants(scenario.participants);
      setStep(0);
      setCallStack([]);
      setActiveParticipant(null);
      addLog(`🎯 Testing ${vuln.name} vulnerability`, 'info');
      addLog("🎬 Click 'Next Step' to see the attack simulation", 'info');
    } catch (error) {
      addLog(`❌ Error loading vulnerability scenario: ${error.message}`, 'error');
      console.error('Vulnerability selection error:', error);
    }
  }, [addLog]);

  const executeStep = useCallback((stepData, stepNum) => {
    try {
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
    } catch (error) {
      addLog(`❌ Step execution error: ${error.message}`, 'error');
      console.error('Step execution error:', error);
    }
  }, [addLog]);

  const nextStep = useCallback(() => {
    if (!selectedVulnerability || step >= selectedVulnerability.maxSteps) return;
    
    try {
      const scenario = selectedVulnerability.createScenario();
      const currentStep = scenario.steps[step];
      
      setStep(prevStep => {
        const newStep = prevStep + 1;
        executeStep(currentStep, newStep);
        return newStep;
      });
    } catch (error) {
      addLog(`❌ Next step error: ${error.message}`, 'error');
      console.error('Next step error:', error);
    }
  }, [selectedVulnerability, step, executeStep, addLog]);

  const reset = useCallback(() => {
    try {
      setStep(0);
      setCallStack([]);
      setActiveParticipant(null);
      setIsAutoPlaying(false);
      if (selectedVulnerability) {
        const scenario = selectedVulnerability.createScenario();
        setParticipants(scenario.participants);
      }
      addLog("🔄 Simulation reset", 'system');
    } catch (error) {
      addLog(`❌ Reset error: ${error.message}`, 'error');
      console.error('Reset error:', error);
    }
  }, [selectedVulnerability, addLog]);

  const autoPlay = useCallback(() => {
    if (isAutoPlaying || !selectedVulnerability) return;
    
    try {
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
    } catch (error) {
      addLog(`❌ Auto-play error: ${error.message}`, 'error');
      console.error('Auto-play error:', error);
      setIsAutoPlaying(false);
    }
  }, [isAutoPlaying, selectedVulnerability, speed, executeStep, addLog]);

  // Helper functions
  const getParticipantColor = useCallback((key) => {
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
  }, [activeParticipant, participants]);

  const getLogColor = useCallback((type) => {
    switch(type) {
      case 'danger': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'system': return 'text-blue-400';
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-300';
      default: return 'text-green-400';
    }
  }, []);

  const getSeverityColor = useCallback((severity) => {
    switch(severity) {
      case 'CRITICAL': return 'bg-red-600';
      case 'HIGH': return 'bg-red-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className="p-6 max-w-7xl mx-auto bg-gray-50 rounded-lg shadow-md">
        <NavigationMenu onNavigationClick={handleNavigation} currentPage={currentPage} />

        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          ⚡ Smart Contract Vulnerability Tester
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Interactive vulnerability testing with attack simulations and detailed analysis
        </p>

        <CodeInputSection
          contractCode={contractCode}
          setContractCode={setContractCode}
          onAnalyze={analyzeContract}
          exampleContracts={exampleContracts}
        />

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
                {detectedVulnerabilities.map((vuln) => (
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

        {/* Attack Simulation */}
        {selectedVulnerability && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              🎯 Attack Simulation: {selectedVulnerability.name}
            </h2>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-700">Attack Progress</h3>
                <span className="text-sm text-gray-600">Step {step} of {selectedVulnerability.maxSteps}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-to-r from-red-500 to-red-700 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${(step / selectedVulnerability.maxSteps) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button onClick={reset} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                  🔄 Reset
                </button>
                <button 
                  onClick={nextStep} 
                  disabled={step >= selectedVulnerability.maxSteps || isAutoPlaying}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    step >= selectedVulnerability.maxSteps || isAutoPlaying
                      ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  ▶️ Next Step
                </button>
                <button 
                  onClick={autoPlay} 
                  disabled={step >= selectedVulnerability.maxSteps || isAutoPlaying}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    step >= selectedVulnerability.maxSteps || isAutoPlaying
                      ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isAutoPlaying ? '⏸️ Auto Playing...' : '🚀 Auto Play'}
                </button>
              </div>
            </div>

            {/* Participants */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {Object.entries(participants).map(([key, participant]) => (
                <div key={key} className={`${getParticipantColor(key)} text-white p-4 rounded-lg transition-all duration-300`}>
                  <div className="text-sm font-medium mb-1">
                    {participant.type === 'contract' ? '📝 Contract' : 
                     participant.type === 'system' ? '🖥️ System' : '👤 Account'}
                  </div>
                  <div className="text-lg font-bold mb-2">{participant.role}</div>
                  <div className="font-mono text-lg">
                    Balance: {typeof participant.balance === 'string' ? participant.balance : `${participant.balance} ETH`}
                  </div>
                  <div className="text-sm opacity-90">{participant.address}</div>
                </div>
              ))}
            </div>

            {/* Call Stack */}
            {callStack.length > 0 && (
              <div className="mb-6 bg-gray-900 p-4 rounded-lg">
                <h3 className="text-white font-bold mb-2">📞 Call Stack</h3>
                <div className="text-green-400 font-mono text-sm">
                  {callStack.map((call, index) => (
                    <div key={index} className="mb-1" style={{ marginLeft: `${index * 20}px` }}>
                      📍 {call}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Live Activity Log */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">📋 Activity Log</h2>
          
          <div className="bg-gray-900 p-4 rounded-lg h-64 overflow-y-auto">
            {logs.length > 0 ? (
              <div className="space-y-1 font-mono text-sm">
                {logs.map((log, index) => (
                  <div key={index} className={getLogColor(log.type)}>
                    <span className="text-gray-500">[{log.time}]</span> {log.message}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-green-400 font-mono">
                Welcome to the Smart Contract Vulnerability Tester! 
                <br />Paste your contract code above and click "Analyze" to get started.
              </div>
            )}
          </div>
        </div>

        {/* Features Info */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">⚡ Tester Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-xl font-medium mb-3 text-purple-700">🔍 Pattern Detection</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">🔄</span>
                  <span>Reentrancy vulnerabilities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">🔐</span>
                  <span>Access control issues</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">📊</span>
                  <span>Integer overflow/underflow</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-3 text-red-700">🎯 Attack Simulation</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">📺</span>
                  <span>Visual attack demonstrations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">⚡</span>
                  <span>Step-by-step execution</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">💰</span>
                  <span>Impact assessment</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-3 text-green-700">🛡️ Security Recommendations</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">💡</span>
                  <span>Fix suggestions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">📋</span>
                  <span>Best practices</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">🔧</span>
                  <span>Code examples</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default SmartContractVulnerabilityTester;
