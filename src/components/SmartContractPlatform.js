// src/components/SmartContractPlatform.js
import { useState, useCallback, useMemo } from 'react';

const SmartContractPlatform = () => {
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

  // Memoized vulnerability patterns to prevent re-creation on each render
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
}`
  }), []);

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

    const vulnerabilities = [];
    
    try {
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
      }
    } catch (error) {
      addLog(`❌ Error analyzing contract: ${error.message}`, 'error');
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
    }
  }, [addLog]);

  const executeStep = useCallback((stepData, stepNum) => {
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
      addLog(`❌ Error executing step: ${error.message}`, 'error');
    }
  }, [selectedVulnerability, step, executeStep, addLog]);

  const reset = useCallback(() => {
    setStep(0);
    setCallStack([]);
    setActiveParticipant(null);
    setIsAutoPlaying(false);
    if (selectedVulnerability) {
      try {
        const scenario = selectedVulnerability.createScenario();
        setParticipants(scenario.participants);
      } catch (error) {
        addLog(`❌ Error resetting simulation: ${error.message}`, 'error');
      }
    }
    addLog("🔄 Simulation reset", 'system');
  }, [selectedVulnerability, addLog]);

  const autoPlay = useCallback(() => {
    if (isAutoPlaying || !selectedVulnerability) return;
    
    setIsAutoPlaying(true);
    
    try {
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
      addLog(`❌ Error starting auto-play: ${error.message}`, 'error');
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
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 rounded-lg shadow-md">
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
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors font-medium"
                >
                  {key}
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

      {/* Simulation Section */}
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

export default SmartContractPlatform;
