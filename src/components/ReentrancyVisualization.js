// src/components/ReentrancyVisualization.js
import React, { useState, useCallback, useMemo, memo, useEffect } from 'react';

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

const CallStackVisualization = memo(({ callStack, currentDepth }) => (
  <div className="bg-gray-900 p-4 rounded-lg text-green-400 font-mono text-sm">
    <div className="text-white mb-2 font-bold">📞 Call Stack Visualization</div>
    {callStack.length > 0 ? (
      <div className="space-y-1">
        {callStack.map((call, index) => (
          <div 
            key={index} 
            className={`flex items-center ${index === currentDepth ? 'text-yellow-300 font-bold' : ''}`}
            style={{ marginLeft: `${index * 20}px` }}
          >
            <span className="mr-2">
              {index === currentDepth ? '▶️' : '📍'}
            </span>
            <span>{call}</span>
            {index === currentDepth && (
              <span className="ml-2 text-yellow-300 animate-pulse">← CURRENT</span>
            )}
          </div>
        ))}
      </div>
    ) : (
      <div className="text-gray-500">No active calls</div>
    )}
  </div>
));

CallStackVisualization.displayName = 'CallStackVisualization';

const ParticipantCard = memo(({ participant, isActive, role, address }) => {
  const getParticipantColor = () => {
    if (isActive) {
      if (role.includes('Attacker') || role.includes('Malicious')) return 'bg-red-600 animate-pulse shadow-lg ring-4 ring-red-300';
      if (participant.type === 'contract') return 'bg-purple-600 animate-pulse shadow-lg ring-4 ring-purple-300';
      return 'bg-blue-600 animate-pulse shadow-lg ring-4 ring-blue-300';
    }
    
    if (role.includes('Attacker') || role.includes('Malicious')) return 'bg-red-500';
    if (participant.type === 'contract') return 'bg-purple-500';
    return 'bg-blue-500';
  };

  return (
    <div className={`${getParticipantColor()} text-white p-4 rounded-lg transition-all duration-500 transform ${isActive ? 'scale-105' : 'scale-100'}`}>
      <div className="text-sm font-medium mb-1">
        {participant.type === 'contract' ? '📝 Contract' : '👤 Account'}
      </div>
      <div className="text-lg font-bold mb-2">{role}</div>
      <div className="font-mono text-xl mb-2">
        Balance: {typeof participant.balance === 'string' ? participant.balance : `${participant.balance} ETH`}
      </div>
      <div className="text-sm opacity-90">{address}</div>
      {participant.deposited && (
        <div className="text-xs opacity-80 mt-1">Deposited: {participant.deposited} ETH</div>
      )}
    </div>
  );
});

ParticipantCard.displayName = 'ParticipantCard';

const ReentrancyVisualization = ({ onNavigationClick, currentPage = 'ReentrancyVisualization' }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [participants, setParticipants] = useState({});
  const [callStack, setCallStack] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [activeParticipant, setActiveParticipant] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState('classic');
  const [callDepth, setCallDepth] = useState(0);

  // Default navigation handler if none provided
  const handleNavigation = useCallback((componentName) => {
    if (onNavigationClick) {
      onNavigationClick(componentName);
    } else {
      console.log(`Navigation to: ${componentName}`);
      alert(`Navigation to ${componentName} - This would use React Router in a full application`);
    }
  }, [onNavigationClick]);

  // Reentrancy scenarios
  const scenarios = useMemo(() => ({
    classic: {
      name: "Classic Reentrancy Attack",
      description: "Traditional reentrancy where external call happens before state update",
      maxSteps: 10,
      participants: {
        contract: { balance: 200, role: 'Vulnerable Contract', type: 'contract', address: '0x1234...5678' },
        victim: { balance: 0, role: 'Honest User', type: 'eoa', deposited: 100, address: '0xABCD...EFAB' },
        attacker: { balance: 0, role: 'Malicious Attacker', type: 'eoa', deposited: 100, address: '0xDEAD...BEEF' }
      },
      steps: [
        { 
          message: "👤 Honest user deposits 100 ETH into contract", 
          type: 'info', 
          actor: 'victim', 
          callStack: ["deposit()"],
          balanceChanges: { victim: { balance: 100 }, contract: { balance: 300 } },
          depth: 0
        },
        { 
          message: "😈 Attacker deposits 100 ETH to establish legitimacy", 
          type: 'info', 
          actor: 'attacker', 
          callStack: ["deposit()"],
          balanceChanges: { attacker: { balance: 100 }, contract: { balance: 400 } },
          depth: 0
        },
        { 
          message: "🚨 Attacker initiates withdrawal of 100 ETH", 
          type: 'warning', 
          actor: 'attacker', 
          callStack: ["withdraw(100)"],
          depth: 0
        },
        { 
          message: "✅ Contract checks: balance >= 100 ETH (PASS)", 
          type: 'info', 
          actor: 'contract', 
          callStack: ["withdraw(100)", "require(balance >= amount)"],
          depth: 1
        },
        { 
          message: "💸 Contract sends 100 ETH to attacker (BEFORE updating balance)", 
          type: 'warning', 
          actor: 'contract', 
          callStack: ["withdraw(100)", "msg.sender.call{value: amount}()"],
          depth: 1
        },
        { 
          message: "⚡ Attacker's receive() function is triggered", 
          type: 'danger', 
          actor: 'attacker', 
          callStack: ["withdraw(100)", "msg.sender.call{value: amount}()", "receive()"],
          depth: 2
        },
        { 
          message: "🔄 Attacker calls withdraw(100) AGAIN from receive()", 
          type: 'danger', 
          actor: 'attacker', 
          callStack: ["withdraw(100)", "msg.sender.call{value: amount}()", "receive()", "withdraw(100)"],
          depth: 3
        },
        { 
          message: "✅ Contract checks: balance >= 100 ETH (STILL PASS - not updated yet!)", 
          type: 'danger', 
          actor: 'contract', 
          callStack: ["withdraw(100)", "msg.sender.call{value: amount}()", "receive()", "withdraw(100)", "require(balance >= amount)"],
          depth: 4
        },
        { 
          message: "💸 Contract sends ANOTHER 100 ETH to attacker", 
          type: 'danger', 
          actor: 'contract', 
          callStack: ["withdraw(100)", "msg.sender.call{value: amount}()", "receive()", "withdraw(100)", "msg.sender.call{value: amount}()"],
          balanceChanges: { attacker: { balance: 300 }, contract: { balance: 200 } },
          depth: 4
        },
        { 
          message: "💔 Attack complete: Attacker drained 200 ETH, victim can only recover 0 ETH", 
          type: 'danger', 
          actor: 'attacker', 
          callStack: [],
          balanceChanges: { victim: { balance: 0 } },
          depth: 0
        }
      ]
    },
    crossFunction: {
      name: "Cross-Function Reentrancy",
      description: "Attack exploiting shared state across multiple functions",
      maxSteps: 8,
      participants: {
        contract: { balance: 300, role: 'Multi-Function Contract', type: 'contract', address: '0x9876...5432' },
        victim: { balance: 0, role: 'Honest User', type: 'eoa', deposited: 200, address: '0xCAFE...BABE' },
        attacker: { balance: 0, role: 'Cross-Function Attacker', type: 'eoa', deposited: 100, address: '0x1337...DEAD' }
      },
      steps: [
        { message: "👤 Victim deposits 200 ETH", type: 'info', actor: 'victim', callStack: ["deposit()"], balanceChanges: { victim: { balance: 200 } }, depth: 0 },
        { message: "😈 Attacker deposits 100 ETH", type: 'info', actor: 'attacker', callStack: ["deposit()"], balanceChanges: { attacker: { balance: 100 } }, depth: 0 },
        { message: "🚨 Attacker calls withdrawAll()", type: 'warning', actor: 'attacker', callStack: ["withdrawAll()"], depth: 0 },
        { message: "💸 Contract starts sending full balance to attacker", type: 'warning', actor: 'contract', callStack: ["withdrawAll()", "transfer()"], depth: 1 },
        { message: "⚡ Attacker's receive() calls transfer() function", type: 'danger', actor: 'attacker', callStack: ["withdrawAll()", "transfer()", "receive()", "transfer()"], depth: 3 },
        { message: "🔄 Shared state allows second transfer", type: 'danger', actor: 'contract', callStack: ["withdrawAll()", "transfer()", "receive()", "transfer()", "send()"], balanceChanges: { attacker: { balance: 400 } }, depth: 4 },
        { message: "💔 Contract drained through cross-function attack", type: 'danger', actor: 'contract', balanceChanges: { contract: { balance: 0 } }, depth: 0 },
        { message: "😱 Victim loses entire deposit", type: 'danger', actor: 'victim', callStack: [], balanceChanges: { victim: { balance: 0 } }, depth: 0 }
      ]
    },
    readOnly: {
      name: "Read-Only Reentrancy",
      description: "Attack exploiting view functions during state updates",
      maxSteps: 7,
      participants: {
        contract: { balance: 500, role: 'DeFi Protocol', type: 'contract', address: '0xDEFI...POOL' },
        victim: { balance: 0, role: 'Liquidity Provider', type: 'eoa', deposited: 300, address: '0xLIQU...IDITY' },
        attacker: { balance: 0, role: 'Read-Only Exploiter', type: 'eoa', deposited: 200, address: '0xREAD...ONLY' }
      },
      steps: [
        { message: "👤 LP provides 300 ETH liquidity", type: 'info', actor: 'victim', callStack: ["addLiquidity()"], balanceChanges: { victim: { balance: 300 } }, depth: 0 },
        { message: "😈 Attacker provides 200 ETH", type: 'info', actor: 'attacker', callStack: ["addLiquidity()"], balanceChanges: { attacker: { balance: 200 } }, depth: 0 },
        { message: "🚨 Attacker initiates large withdrawal", type: 'warning', actor: 'attacker', callStack: ["withdraw()"], depth: 0 },
        { message: "📊 Contract calls price oracle during withdrawal", type: 'warning', actor: 'contract', callStack: ["withdraw()", "updatePrice()"], depth: 1 },
        { message: "⚡ Attacker's callback reads manipulated state", type: 'danger', actor: 'attacker', callStack: ["withdraw()", "updatePrice()", "fallback()", "getBalance()"], depth: 3 },
        { message: "🔍 View function returns incorrect data during update", type: 'danger', actor: 'contract', callStack: ["withdraw()", "updatePrice()", "fallback()", "getBalance()", "view balanceOf()"], balanceChanges: { attacker: { balance: 600 } }, depth: 4 },
        { message: "💀 LP funds drained via read-only manipulation", type: 'danger', actor: 'victim', callStack: [], balanceChanges: { victim: { balance: 0 }, contract: { balance: 0 } }, depth: 0 }
      ]
    }
  }), []);

  const currentScenario = scenarios[selectedScenario];

  // Initialize scenario
  useEffect(() => {
    setParticipants(currentScenario.participants);
    setCurrentStep(0);
    setCallStack([]);
    setActiveParticipant(null);
    setCallDepth(0);
    setLogs([{ message: `🎯 Loaded scenario: ${currentScenario.name}`, time: new Date().toLocaleTimeString(), type: 'system' }]);
  }, [selectedScenario, currentScenario]);

  const addLog = useCallback((message, type = 'info') => {
    setLogs(prevLogs => [...prevLogs, { 
      message, 
      time: new Date().toLocaleTimeString(), 
      type 
    }]);
  }, []);

  const executeStep = useCallback((stepData) => {
    addLog(stepData.message, stepData.type);
    
    if (stepData.actor) {
      setActiveParticipant(stepData.actor);
    }
    
    if (stepData.callStack) {
      setCallStack(stepData.callStack);
      setCallDepth(stepData.depth || 0);
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
    if (currentStep >= currentScenario.maxSteps) return;
    
    const stepData = currentScenario.steps[currentStep];
    executeStep(stepData);
    setCurrentStep(prev => prev + 1);
  }, [currentStep, currentScenario, executeStep]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setParticipants(currentScenario.participants);
    setCallStack([]);
    setActiveParticipant(null);
    setCallDepth(0);
    setIsAutoPlaying(false);
    setLogs([{ message: `🔄 Reset ${currentScenario.name}`, time: new Date().toLocaleTimeString(), type: 'system' }]);
  }, [currentScenario]);

  const autoPlay = useCallback(() => {
    if (isAutoPlaying || currentStep >= currentScenario.maxSteps) return;
    
    setIsAutoPlaying(true);
    const interval = setInterval(() => {
      setCurrentStep(prevStep => {
        if (prevStep >= currentScenario.maxSteps) {
          clearInterval(interval);
          setIsAutoPlaying(false);
          return prevStep;
        }
        
        const stepData = currentScenario.steps[prevStep];
        executeStep(stepData);
        return prevStep + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentStep, currentScenario, speed, executeStep]);

  const getLogColor = (type) => {
    switch(type) {
      case 'danger': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'system': return 'text-blue-400';
      case 'success': return 'text-green-400';
      default: return 'text-green-400';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 rounded-lg shadow-md">
      <NavigationMenu onNavigationClick={handleNavigation} currentPage={currentPage} />

      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
        🎯 Reentrancy Attack Visualization
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Interactive step-by-step visualization of different types of reentrancy attacks with detailed call stack analysis
      </p>

      {/* Scenario Selection */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow border-2 border-red-300">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">🎮 Select Attack Scenario</h2>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {Object.entries(scenarios).map(([key, scenario]) => (
            <button
              key={key}
              onClick={() => setSelectedScenario(key)}
              className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                selectedScenario === key 
                  ? 'border-red-500 bg-red-50 shadow-lg transform scale-105' 
                  : 'border-gray-300 bg-white hover:border-red-300 hover:bg-red-50'
              }`}
            >
              <h3 className="font-bold text-gray-800 mb-2">{scenario.name}</h3>
              <p className="text-sm text-gray-600">{scenario.description}</p>
              <div className="text-xs text-red-600 mt-2">
                {scenario.maxSteps} steps • {Object.keys(scenario.participants).length} participants
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            📊 Attack Progress: {currentScenario.name}
          </h2>
          <div className="text-lg font-bold text-red-600">
            Step {currentStep} of {currentScenario.maxSteps}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-4 mb-6 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-orange-500 via-red-500 to-red-700 h-4 rounded-full transition-all duration-500 shadow-inner" 
            style={{ width: `${(currentStep / currentScenario.maxSteps) * 100}%` }}
          ></div>
        </div>

        <div className="flex justify-center space-x-4 mb-4">
          <button 
            onClick={reset} 
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 shadow-lg"
          >
            🔄 Reset
          </button>
          <button 
            onClick={nextStep} 
            disabled={currentStep >= currentScenario.maxSteps || isAutoPlaying}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg ${
              currentStep >= currentScenario.maxSteps || isAutoPlaying
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            ▶️ Next Step
          </button>
          <button 
            onClick={autoPlay} 
            disabled={currentStep >= currentScenario.maxSteps || isAutoPlaying}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg ${
              currentStep >= currentScenario.maxSteps || isAutoPlaying
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isAutoPlaying ? '⏸️ Auto Playing...' : '🚀 Auto Play'}
          </button>
        </div>

        <div className="flex items-center justify-center">
          <label htmlFor="speed-slider" className="mr-3 text-sm font-medium">Speed:</label>
          <input 
            id="speed-slider" 
            type="range" 
            min="500" 
            max="3000" 
            step="100" 
            value={speed} 
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            disabled={isAutoPlaying}
          />
          <span className="ml-2 text-sm font-medium">{speed}ms</span>
        </div>
      </div>

      {/* Participants Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            👥 Attack Participants
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {Object.entries(participants).map(([key, participant]) => (
              <ParticipantCard
                key={key}
                participant={participant}
                isActive={activeParticipant === key}
                role={participant.role}
                address={participant.address}
              />
            ))}
          </div>
        </div>

        {/* Call Stack Visualization */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">🔍 Call Stack</h2>
          <CallStackVisualization callStack={callStack} currentDepth={callDepth} />
          <div className="mt-4 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Depth:</span>
              <span className="font-bold text-red-600">{callDepth}</span>
            </div>
            <div className="flex justify-between">
              <span>Active Calls:</span>
              <span className="font-bold text-blue-600">{callStack.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attack Analysis */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Real-time Log */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            📋 Attack Log
          </h2>
          <div className="bg-gray-900 p-4 rounded text-sm h-80 overflow-y-auto">
            {logs.length > 0 ? (
              <div className="space-y-1">
                {logs.map((log, index) => (
                  <div key={index} className={getLogColor(log.type)}>
                    <span className="text-gray-500">[{log.time}]</span> {log.message}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-green-400">Attack visualization ready...</div>
            )}
          </div>
        </div>

        {/* Attack Impact Analysis */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            💥 Impact Analysis
          </h2>
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-800 mb-2">🎯 Attack Effectiveness</h3>
              <div className="text-sm text-red-700">
                <div className="flex justify-between">
                  <span>Funds at Risk:</span>
                  <span className="font-bold">
                    {Object.values(participants).reduce((total, p) => 
                      typeof p.balance === 'number' ? total + p.balance : total, 0
                    )} ETH
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Attack Progress:</span>
                  <span className="font-bold">{Math.round((currentStep / currentScenario.maxSteps) * 100)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">🔍 Technical Details</h3>
              <div className="text-sm text-blue-700">
                <div className="flex justify-between">
                  <span>Call Depth:</span>
                  <span className="font-bold">{callDepth}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Functions:</span>
                  <span className="font-bold">{callStack.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Scenario Type:</span>
                  <span className="font-bold">{selectedScenario}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">🛡️ Prevention</h3>
              <div className="text-sm text-green-700">
                <ul className="space-y-1">
                  <li>• Use ReentrancyGuard modifier</li>
                  <li>• Apply Checks-Effects-Interactions</li>
                  <li>• Implement proper access controls</li>
                  <li>• Use pull payment patterns</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          📚 Understanding Reentrancy Attacks
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-xl font-medium mb-3 text-red-700">🎯 Attack Vectors</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">🔄</span>
                <span><strong>Classic:</strong> External call before state update</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">🔀</span>
                <span><strong>Cross-Function:</strong> Shared state vulnerability</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">👁️</span>
                <span><strong>Read-Only:</strong> View function manipulation</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-3 text-blue-700">🛡️ Prevention Methods</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">🔒</span>
                <span><strong>Guards:</strong> ReentrancyGuard modifier</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">📋</span>
                <span><strong>Pattern:</strong> Checks-Effects-Interactions</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">🔄</span>
                <span><strong>Pull:</strong> Withdrawal pattern</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-3 text-green-700">📊 Real-World Impact</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">💰</span>
                <span><strong>DAO Hack:</strong> $60 million (2016)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">🏦</span>
                <span><strong>Cream Finance:</strong> $18.8 million (2021)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">⚡</span>
                <span><strong>Ongoing:</strong> Still active threat</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
          <h3 className="text-lg font-bold mb-2 text-yellow-800">⚠️ Visualization Purpose</h3>
          <p className="text-yellow-700">
            This visualization is designed for educational purposes to help developers understand how reentrancy attacks work. 
            Understanding the attack mechanics is crucial for building secure smart contracts and protecting user funds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReentrancyVisualization;
