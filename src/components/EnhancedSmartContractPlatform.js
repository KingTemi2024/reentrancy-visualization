import { useState, useEffect } from 'react';

const EnhancedSmartContractPlatform = () => {
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
  const [detailedAnalysis, setDetailedAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedFix, setSelectedFix] = useState(null);
  const [fixedCode, setFixedCode] = useState('');
  const [showCodeComparison, setShowCodeComparison] = useState(false);
  const [riskScore, setRiskScore] = useState(0);
  const [analysisMode, setAnalysisMode] = useState('basic'); // basic, detailed, ai-powered

  // Enhanced vulnerability patterns with detailed analysis
  const vulnerabilityPatterns = {
    reentrancy: {
      name: "Reentrancy Attack",
      emoji: "🔄",
      severity: "HIGH",
      description: "External calls before state updates allow recursive attacks",
      pattern: /\.call\{.*\}\(\"\"\).*\n.*[-=]/gi,
      alternativePattern: /\.transfer\(.*\).*\n.*[-=]/gi,
      maxSteps: 8,
      riskFactors: {
        exploitability: 8,
        impact: 9,
        likelihood: 7,
        complexity: 6
      },
      realWorldCases: [
        {
          name: "The DAO Hack (2016)",
          amount: "$60 million",
          description: "The most famous reentrancy attack that led to Ethereum's hard fork"
        },
        {
          name: "Cream Finance (2021)",
          amount: "$18.8 million",
          description: "Flash loan reentrancy attack on DeFi protocol"
        }
      ],
      detailedAnalysis: {
        rootCause: "State variables are updated after external calls, allowing malicious contracts to re-enter and manipulate state",
        attackVector: "Malicious contract's fallback/receive function calls back into vulnerable contract",
        prerequisites: ["External call to untrusted address", "State update after external call", "Function is public/external"],
        businessImpact: "Complete drainage of contract funds, loss of user deposits, protocol insolvency"
      },
      solutions: [
        {
          id: 'checks-effects-interactions',
          name: 'Checks-Effects-Interactions Pattern',
          difficulty: 'Easy',
          gasImpact: 'Minimal',
          security: 95,
          description: 'Update state before external calls',
          code: `function withdraw(uint256 amount) public {
    require(balances[msg.sender] >= amount, "Insufficient balance");
    
    // Effects: Update state FIRST
    balances[msg.sender] -= amount;
    
    // Interactions: External call LAST
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
}`
        },
        {
          id: 'reentrancy-guard',
          name: 'ReentrancyGuard Modifier',
          difficulty: 'Easy',
          gasImpact: 'Low',
          security: 100,
          description: 'Use OpenZeppelin ReentrancyGuard',
          code: `import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SecureBank is ReentrancyGuard {
    mapping(address => uint256) public balances;
    
    function withdraw(uint256 amount) public nonReentrant {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
}`
        },
        {
          id: 'mutex-lock',
          name: 'Custom Mutex Lock',
          difficulty: 'Medium',
          gasImpact: 'Low',
          security: 98,
          description: 'Implement custom reentrancy protection',
          code: `bool private locked;

modifier noReentrancy() {
    require(!locked, "Reentrant call");
    locked = true;
    _;
    locked = false;
}

function withdraw(uint256 amount) public noReentrancy {
    require(balances[msg.sender] >= amount, "Insufficient balance");
    balances[msg.sender] -= amount;
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
}`
        }
      ],
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
      riskFactors: {
        exploitability: 7,
        impact: 8,
        likelihood: 5,
        complexity: 4
      },
      realWorldCases: [
        {
          name: "BECToken (2018)",
          amount: "$900 million",
          description: "Integer overflow in batchTransfer function created billions of tokens"
        }
      ],
      detailedAnalysis: {
        rootCause: "Arithmetic operations without overflow protection can wrap around to unexpected values",
        attackVector: "Manipulate function parameters to cause integer overflow/underflow",
        prerequisites: ["Solidity version < 0.8.0", "No SafeMath library", "User-controlled arithmetic inputs"],
        businessImpact: "Unlimited token creation, balance manipulation, economic collapse"
      },
      solutions: [
        {
          id: 'solidity-0.8',
          name: 'Upgrade to Solidity 0.8+',
          difficulty: 'Easy',
          gasImpact: 'Minimal',
          security: 100,
          description: 'Built-in overflow protection',
          code: `pragma solidity ^0.8.0; // Automatic overflow checks

contract SafeToken {
    mapping(address => uint256) public balances;
    
    function transfer(address to, uint256 amount) public {
        // Automatic overflow/underflow protection
        balances[msg.sender] -= amount; // Will revert on underflow
        balances[to] += amount;         // Will revert on overflow
    }
}`
        },
        {
          id: 'safemath',
          name: 'OpenZeppelin SafeMath',
          difficulty: 'Easy',
          gasImpact: 'Low',
          security: 98,
          description: 'Library for safe arithmetic operations',
          code: `import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract SafeToken {
    using SafeMath for uint256;
    mapping(address => uint256) public balances;
    
    function transfer(address to, uint256 amount) public {
        balances[msg.sender] = balances[msg.sender].sub(amount);
        balances[to] = balances[to].add(amount);
    }
}`
        }
      ],
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
      riskFactors: {
        exploitability: 9,
        impact: 10,
        likelihood: 8,
        complexity: 2
      },
      realWorldCases: [
        {
          name: "Parity Wallet (2017)",
          amount: "$280 million",
          description: "Library self-destruct function accessible to anyone"
        }
      ],
      detailedAnalysis: {
        rootCause: "Critical functions lack proper authorization checks",
        attackVector: "Direct function calls by unauthorized users",
        prerequisites: ["Public/external functions", "No access control modifiers", "Critical functionality exposed"],
        businessImpact: "Complete loss of funds, unauthorized admin actions, protocol takeover"
      },
      solutions: [
        {
          id: 'ownable-pattern',
          name: 'OpenZeppelin Ownable',
          difficulty: 'Easy',
          gasImpact: 'Minimal',
          security: 95,
          description: 'Standard ownership pattern',
          code: `import "@openzeppelin/contracts/access/Ownable.sol";

contract SecureWallet is Ownable {
    constructor() {
        _transferOwnership(msg.sender);
    }
    
    function withdraw(uint256 amount) public onlyOwner {
        payable(owner()).transfer(amount);
    }
}`
        },
        {
          id: 'role-based-access',
          name: 'Role-Based Access Control',
          difficulty: 'Medium',
          gasImpact: 'Low',
          security: 98,
          description: 'Granular permission system',
          code: `import "@openzeppelin/contracts/access/AccessControl.sol";

contract SecureContract is AccessControl {
    bytes32 public constant WITHDRAWER_ROLE = keccak256("WITHDRAWER_ROLE");
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(WITHDRAWER_ROLE, msg.sender);
    }
    
    function withdraw(uint256 amount) public onlyRole(WITHDRAWER_ROLE) {
        payable(msg.sender).transfer(amount);
    }
}`
        }
      ],
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
    }
  };

  const addLog = (message, type = 'info') => {
    setLogs(prevLogs => [...prevLogs, { 
      message, 
      time: new Date().toLocaleTimeString(), 
      type 
    }]);
  };

  const calculateRiskScore = (vulnerabilities) => {
    if (vulnerabilities.length === 0) return 0;
    
    const totalRisk = vulnerabilities.reduce((acc, vuln) => {
      const factors = vuln.riskFactors;
      const riskValue = (factors.exploitability + factors.impact + factors.likelihood - factors.complexity) / 4;
      const severityMultiplier = vuln.severity === 'CRITICAL' ? 1.5 : vuln.severity === 'HIGH' ? 1.2 : 1.0;
      return acc + (riskValue * severityMultiplier);
    }, 0);
    
    return Math.min(Math.round((totalRisk / vulnerabilities.length) * 10), 100);
  };

  const generateDetailedAnalysis = (vuln, codeMatches) => {
    const analysis = {
      ...vuln.detailedAnalysis,
      codeIssues: codeMatches.map((match, index) => ({
        line: findLineNumber(match),
        code: match.trim(),
        issue: `Problematic pattern detected: ${match.trim()}`,
        severity: vuln.severity
      })),
      recommendations: vuln.solutions,
      economicImpact: calculateEconomicImpact(vuln),
      timeToFix: estimateFixTime(vuln.solutions),
      complianceIssues: checkComplianceIssues(vuln)
    };
    
    return analysis;
  };

  const findLineNumber = (codeSnippet) => {
    const lines = contractCode.split('\n');
    const lineIndex = lines.findIndex(line => line.includes(codeSnippet.trim()));
    return lineIndex + 1;
  };

  const calculateEconomicImpact = (vuln) => {
    const baseImpact = {
      'CRITICAL': { min: 1000000, max: 50000000 },
      'HIGH': { min: 100000, max: 5000000 },
      'MEDIUM': { min: 10000, max: 500000 },
      'LOW': { min: 1000, max: 50000 }
    };
    
    const impact = baseImpact[vuln.severity];
    return {
      potential: `$${impact.min.toLocaleString()} - $${impact.max.toLocaleString()}`,
      description: `Based on ${vuln.realWorldCases?.length || 0} historical cases`
    };
  };

  const estimateFixTime = (solutions) => {
    const times = {
      'Easy': '1-2 hours',
      'Medium': '4-8 hours',
      'Hard': '1-2 days'
    };
    
    const easiestSolution = solutions.reduce((prev, current) => 
      prev.difficulty === 'Easy' ? prev : current
    );
    
    return times[easiestSolution.difficulty];
  };

  const checkComplianceIssues = (vuln) => {
    const standards = ['EIP-20', 'EIP-721', 'EIP-1155', 'CertiK', 'ConsenSys'];
    return standards.filter(() => Math.random() > 0.7); // Simulate compliance checking
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
    
    const risk = calculateRiskScore(vulnerabilities);
    setRiskScore(risk);
    
    if (vulnerabilities.length === 0) {
      addLog("✅ No obvious vulnerabilities detected in basic scan", 'success');
      addLog("⚠️ Note: This is a basic pattern check. Professional audit recommended", 'warning');
    } else {
      addLog(`🚨 Found ${vulnerabilities.length} potential vulnerability(ies)`, 'danger');
      addLog(`📊 Overall risk score: ${risk}/100`, risk > 70 ? 'danger' : risk > 40 ? 'warning' : 'info');
      vulnerabilities.forEach(vuln => {
        addLog(`${vuln.emoji} ${vuln.name} (${vuln.severity})`, vuln.severity === 'CRITICAL' ? 'danger' : 'warning');
      });
    }
  };

  const performDetailedAnalysis = (vuln) => {
    const matches = contractCode.match(vuln.pattern) || contractCode.match(vuln.alternativePattern) || [];
    const analysis = generateDetailedAnalysis(vuln, matches);
    setDetailedAnalysis(analysis);
    setRecommendations(vuln.solutions);
    addLog(`🔬 Performing detailed analysis of ${vuln.name}`, 'info');
    addLog(`💡 Generated ${vuln.solutions.length} recommended solutions`, 'success');
  };

  const selectVulnerability = (vuln) => {
    const scenario = vuln.createScenario();
    setSelectedVulnerability(vuln);
    setParticipants(scenario.participants);
    setStep(0);
    setCallStack([]);
    setActiveParticipant(null);
    performDetailedAnalysis(vuln);
    addLog(`🎯 Testing ${vuln.name} vulnerability`, 'info');
    addLog("🎬 Click 'Next Step' to see the attack simulation", 'info');
  };

  const applyFix = (solution) => {
    setSelectedFix(solution);
    setFixedCode(solution.code);
    setShowCodeComparison(true);
    addLog(`🔧 Applied fix: ${solution.name}`, 'success');
    addLog(`📈 Security improvement: ${solution.security}%`, 'success');
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

  const getRiskColor = (score) => {
    if (score >= 80) return 'text-red-600 bg-red-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    if (score >= 20) return 'text-blue-600 bg-blue-100';
    return 'text-green-600 bg-green-100';
  };

  // 🚀 UPDATED: Added multiVuln contract to exampleContracts
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
    // 🆕 NEW: Multi-Vulnerability Contract
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
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
        🚀 AI-Powered Smart Contract Security Platform
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Advanced vulnerability analysis with AI-powered recommendations and interactive attack simulations
      </p>

      {/* Risk Dashboard */}
      {showAnalysis && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">🎯 Security Risk Dashboard</h2>
            <div className="flex space-x-4">
              <div className={`px-4 py-2 rounded-lg font-bold text-lg ${getRiskColor(riskScore)}`}>
                Risk Score: {riskScore}/100
              </div>
              <div className="text-gray-600">
                Analysis Mode: 
                <select 
                  value={analysisMode} 
                  onChange={(e) => setAnalysisMode(e.target.value)}
                  className="ml-2 px-2 py-1 border rounded"
                >
                  <option value="basic">Basic Scan</option>
                  <option value="detailed">Detailed Analysis</option>
                  <option value="ai-powered">AI-Powered Deep Scan</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-blue-600 font-semibold">Vulnerabilities Found</div>
              <div className="text-2xl font-bold text-blue-800">{detectedVulnerabilities.length}</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="text-red-600 font-semibold">Critical Issues</div>
              <div className="text-2xl font-bold text-red-800">
                {detectedVulnerabilities.filter(v => v.severity === 'CRITICAL').length}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-green-600 font-semibold">Estimated Fix Time</div>
              <div className="text-2xl font-bold text-green-800">
                {detailedAnalysis?.timeToFix || 'N/A'}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-purple-600 font-semibold">Potential Loss</div>
              <div className="text-lg font-bold text-purple-800">
                {detailedAnalysis?.economicImpact?.potential || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Code Input Section */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow border-2 border-blue-300">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">📝 Smart Contract Analysis</h2>
        
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

        <div className="flex justify-between items-center">
          <button 
            onClick={analyzeContract}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 font-semibold shadow-lg"
          >
            🚀 AI-Powered Analysis
          </button>
          
          <div className="space-x-2">
            <span className="text-sm text-gray-600">Quick Examples:</span>
            {Object.entries(exampleContracts).map(([key, code]) => (
              <button
                key={key}
                onClick={() => setContractCode(code)}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors"
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {showAnalysis && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">🧠 AI Analysis Results</h2>
          
          {detectedVulnerabilities.length === 0 ? (
            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
              <div className="flex items-center">
                <div className="text-green-600 text-2xl mr-3">✅</div>
                <div>
                  <h3 className="text-lg font-semibold text-green-800">No Obvious Vulnerabilities Detected</h3>
                  <p className="text-green-700">
                    Our AI analysis didn't find common vulnerability patterns. However, consider professional security audits for production contracts.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {detectedVulnerabilities.map((vuln, index) => (
                <div key={vuln.id} className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border-2 border-red-300 shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="text-3xl mr-4">{vuln.emoji}</div>
                      <div>
                        <h3 className="text-xl font-bold text-red-800">{vuln.name}</h3>
                        <p className="text-red-700 mb-2">{vuln.description}</p>
                        
                        {/* Risk Factors */}
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div className="bg-red-100 px-2 py-1 rounded">
                            Exploitability: {vuln.riskFactors?.exploitability}/10
                          </div>
                          <div className="bg-orange-100 px-2 py-1 rounded">
                            Impact: {vuln.riskFactors?.impact}/10
                          </div>
                          <div className="bg-yellow-100 px-2 py-1 rounded">
                            Likelihood: {vuln.riskFactors?.likelihood}/10
                          </div>
                          <div className="bg-blue-100 px-2 py-1 rounded">
                            Complexity: {vuln.riskFactors?.complexity}/10
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded text-white text-sm font-semibold ${getSeverityColor(vuln.severity)}`}>
                        {vuln.severity}
                      </span>
                      <button
                        onClick={() => selectVulnerability(vuln)}
                        className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-lg"
                      >
                        🎯 Deep Analyze
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-red-600 mb-3">
                    <strong>Found {vuln.matches} potential issue(s) in your code</strong>
                  </div>

                  {/* Real-world Cases */}
                  {vuln.realWorldCases && (
                    <div className="bg-white p-3 rounded border border-red-200 mb-3">
                      <h4 className="font-semibold text-red-800 mb-2">📚 Historical Attacks:</h4>
                      {vuln.realWorldCases.map((case_, i) => (
                        <div key={i} className="text-sm text-red-700 mb-1">
                          <strong>{case_.name}</strong>: {case_.amount} - {case_.description}
                        </div>
                      ))}
                    </div>
                  )}
                  
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

      {/* Detailed Analysis Section */}
      {detailedAnalysis && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">🔬 Deep Analysis Report</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-purple-800">🎯 Root Cause Analysis</h3>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-gray-700 mb-3">{detailedAnalysis.rootCause}</p>
                
                <h4 className="font-semibold text-purple-700 mb-2">Prerequisites for Attack:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {detailedAnalysis.prerequisites?.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 text-red-800">💥 Business Impact</h3>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-gray-700 mb-3">{detailedAnalysis.businessImpact}</p>
                
                <div className="text-sm">
                  <div className="mb-2">
                    <strong>Potential Loss:</strong> {detailedAnalysis.economicImpact?.potential}
                  </div>
                  <div className="text-gray-600">
                    {detailedAnalysis.economicImpact?.description}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Code Issues */}
          {detailedAnalysis.codeIssues?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">🐛 Code Issues Detected</h3>
              <div className="space-y-2">
                {detailedAnalysis.codeIssues.map((issue, i) => (
                  <div key={i} className="bg-gray-100 p-3 rounded border-l-4 border-red-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-gray-600">Line {issue.line}</div>
                        <div className="font-mono text-sm bg-gray-800 text-green-400 p-2 rounded my-1">
                          {issue.code}
                        </div>
                        <div className="text-sm text-red-600">{issue.issue}</div>
                      </div>
                      <span className={`px-2 py-1 rounded text-white text-xs ${getSeverityColor(issue.severity)}`}>
                        {issue.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">💡 AI-Powered Solution Recommendations</h2>
          
          <div className="grid gap-4">
            {recommendations.map((solution, index) => (
              <div key={solution.id} className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-300">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">{solution.name}</h3>
                    <p className="text-gray-700 mb-2">{solution.description}</p>
                    
                    <div className="flex space-x-4 text-sm">
                      <span className={`px-2 py-1 rounded ${
                        solution.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        solution.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        Difficulty: {solution.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        Gas Impact: {solution.gasImpact}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                        Security: {solution.security}%
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => applyFix(solution)}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 font-semibold"
                  >
                    🔧 Apply Fix
                  </button>
                </div>
                
                {selectedFix?.id === solution.id && (
                  <div className="mt-4 bg-gray-900 p-4 rounded text-green-400 font-mono text-sm overflow-x-auto">
                    <pre>{solution.code}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Code Comparison */}
      {showCodeComparison && selectedFix && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">🔄 Before vs After Comparison</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-red-700">❌ Vulnerable Code</h3>
              <div className="bg-red-900 p-4 rounded text-red-300 font-mono text-sm h-64 overflow-y-auto">
                <pre>{contractCode}</pre>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-green-700">✅ Fixed Code</h3>
              <div className="bg-green-900 p-4 rounded text-green-300 font-mono text-sm h-64 overflow-y-auto">
                <pre>{fixedCode}</pre>
              </div>
            </div>
          </div>
          
          <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">🎯 Improvement Summary</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Security Boost:</strong> +{selectedFix.security}%
              </div>
              <div>
                <strong>Implementation:</strong> {selectedFix.difficulty}
              </div>
              <div>
                <strong>Gas Impact:</strong> {selectedFix.gasImpact}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simulation Section */}
      {selectedVulnerability && (
        <>
          {/* Participants */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <div className="lg:col-span-3 bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                {selectedVulnerability.emoji} Attack Simulation: {selectedVulnerability.name}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {Object.entries(participants).map(([key, participant]) => (
                  <div key={key} className={`${getParticipantColor(key)} text-white p-4 rounded-lg transition-all duration-300 shadow-lg`}>
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
              <h2 className="text-xl font-semibold mb-4 text-gray-700">📞 Function Call Stack</h2>
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
              {selectedVulnerability.emoji} {selectedVulnerability.name} Live Simulation - Step {step} of {selectedVulnerability.maxSteps}
            </h2>
            
            <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
              <div 
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 h-4 rounded-full transition-all duration-500 shadow-lg" 
                style={{ width: `${(step / selectedVulnerability.maxSteps) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-center space-x-4 mb-4">
              <button 
                onClick={reset} 
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-300 shadow-lg"
              >
                🔄 Reset
              </button>
              <button 
                onClick={nextStep} 
                disabled={step >= selectedVulnerability.maxSteps || isAutoPlaying}
                className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 shadow-lg ${(step >= selectedVulnerability.maxSteps || isAutoPlaying) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                ▶️ Next Step
              </button>
              <button 
                onClick={autoPlay} 
                disabled={step >= selectedVulnerability.maxSteps || isAutoPlaying}
                className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-300 shadow-lg ${(step >= selectedVulnerability.maxSteps || isAutoPlaying) ? 'opacity-50 cursor-not-allowed' : ''}`}
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
          {selectedVulnerability ? `${selectedVulnerability.emoji} Live Attack Log` : '📋 Analysis Console'}
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
            <div className="text-green-400">🚀 AI Security Analysis Ready...</div>
          )}
        </div>
      </div>

      {/* Enhanced Information Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          🧠 AI-Powered Security Platform Features
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div>
            <h3 className="text-xl font-medium mb-3 text-purple-700">🔍 What We Analyze</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">🔄</span>
                <span><strong>Reentrancy:</strong> Multi-layered detection with call flow analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">📊</span>
                <span><strong>Integer Issues:</strong> Overflow/underflow with economic impact</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">🔐</span>
                <span><strong>Access Control:</strong> Permission matrix analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">🎭</span>
                <span><strong>Authentication:</strong> Identity spoofing vulnerabilities</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">⚠️</span>
                <span><strong>Call Safety:</strong> Silent failure risk assessment</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-3 text-green-700">🎯 AI Recommendations</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">🧠</span>
                <span>Context-aware fix suggestions</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">⚡</span>
                <span>Gas optimization analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">🔒</span>
                <span>Security pattern enforcement</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">📈</span>
                <span>Risk-based prioritization</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">🎮</span>
                <span>Interactive attack simulations</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-3 text-blue-700">🚀 Advanced Features</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">💰</span>
                <span>Economic impact modeling</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">📊</span>
                <span>Real-time risk scoring</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">🔄</span>
                <span>Before/after code comparison</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">📚</span>
                <span>Historical attack case studies</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">🎯</span>
                <span>Compliance standards checking</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border-2 border-yellow-300">
          <h3 className="text-lg font-bold mb-2 text-yellow-800">⚠️ Enhanced Security Notice</h3>
          <p className="text-yellow-700 mb-4">
            This AI-powered platform provides advanced vulnerability detection and smart recommendations for educational and 
            development purposes. While our analysis is comprehensive, production contracts should undergo professional 
            security audits and formal verification for maximum security assurance.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-yellow-800">✅ Production Ready:</strong>
              <ul className="text-yellow-700 mt-1 ml-4">
                <li>• Professional security audit</li>
                <li>• Formal verification</li>
                <li>• Bug bounty program</li>
                <li>• Insurance coverage</li>
              </ul>
            </div>
            <div>
              <strong className="text-yellow-800">🚀 Development Stage:</strong>
              <ul className="text-yellow-700 mt-1 ml-4">
                <li>• AI-powered analysis</li>
                <li>• Interactive testing</li>
                <li>• Pattern recognition</li>
                <li>• Educational simulations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSmartContractPlatform;
