import { useState } from 'react';

const ReentrancyVisualization = () => {
  const [step, setStep] = useState(0);
  const [showBasics, setShowBasics] = useState(true);
  const [showUseCase, setShowUseCase] = useState(false);
  const [participants, setParticipants] = useState({
    marketplace: { balance: 100, role: 'Smart Contract (Marketplace)', type: 'contract', address: '0x123...abc' },
    merchant: { balance: 15, role: 'Human User (Merchant)', type: 'eoa', earnings: 25, address: '0x456...def' },
    vendor: { balance: 20, role: 'Human User (Vendor)', type: 'eoa', earnings: 30, address: '0x789...ghi' },
    user: { balance: 50, role: 'Human User (Customer)', type: 'eoa', spent: 0, address: '0xabc...123' },
    attacker: { balance: 10, role: 'Human User (Attacker)', type: 'eoa', earnings: 20, address: '0xdef...456' }
  });
  const [callStack, setCallStack] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [activeParticipant, setActiveParticipant] = useState(null);

  const addLog = (message, type = 'info') => {
    setLogs(prevLogs => [...prevLogs, { 
      message, 
      time: new Date().toLocaleTimeString(), 
      type 
    }]);
  };

  const reset = () => {
    setStep(0);
    setParticipants({
      marketplace: { balance: 100, role: 'Smart Contract (Marketplace)', type: 'contract', address: '0x123...abc' },
      merchant: { balance: 15, role: 'Human User (Merchant)', type: 'eoa', earnings: 25, address: '0x456...def' },
      vendor: { balance: 20, role: 'Human User (Vendor)', type: 'eoa', earnings: 30, address: '0x789...ghi' },
      user: { balance: 50, role: 'Human User (Customer)', type: 'eoa', spent: 0, address: '0xabc...123' },
      attacker: { balance: 10, role: 'Human User (Attacker)', type: 'eoa', earnings: 20, address: '0xdef...456' }
    });
    setCallStack([]);
    setLogs([]);
    setIsAutoPlaying(false);
    setActiveParticipant(null);
    addLog("🔄 Ethereum ecosystem reset - All accounts ready", 'system');
    addLog("📋 1 Smart Contract + 4 Human Users + ETH Currency", 'info');
  };

  const nextStep = () => {
    if (step >= 15) return;
    
    setStep(prevStep => {
      const newStep = prevStep + 1;
      executeStep(newStep);
      return newStep;
    });
  };

  const executeStep = (stepNum) => {
    switch(stepNum) {
      case 1:
        addLog("👤 Customer (EOA) sends transaction to Smart Contract", 'info');
        setActiveParticipant('user');
        setParticipants(prev => ({
          ...prev,
          user: { ...prev.user, balance: prev.user.balance - 10, spent: prev.user.spent + 10 },
          marketplace: { ...prev.marketplace, balance: prev.marketplace.balance + 10 }
        }));
        break;
      case 2:
        addLog("🏪 Smart Contract updates merchant's earnings internally", 'info');
        setParticipants(prev => ({
          ...prev,
          merchant: { ...prev.merchant, earnings: prev.merchant.earnings + 10 }
        }));
        setActiveParticipant('merchant');
        break;
      case 3:
        addLog("🚨 ATTACK: Attacker (EOA) calls vulnerable withdraw function", 'danger');
        setActiveParticipant('attacker');
        setCallStack(["Attacker EOA → Smart Contract"]);
        break;
      case 4:
        addLog("🔍 Smart Contract checks: Attacker has 20 ETH earnings (✓)", 'info');
        setCallStack(["Attacker EOA → Smart Contract.withdraw(20)"]);
        break;
      case 5:
        addLog("⚠️ CRITICAL: Smart Contract makes external call to Attacker EOA", 'warning');
        setCallStack(["Attacker EOA → Smart Contract.withdraw(20)", "Smart Contract → Attacker EOA.receive()"]);
        break;
      case 6:
        addLog("🔄 REENTRANCY: Attacker's EOA calls Smart Contract again!", 'danger');
        setCallStack([
          "Attacker EOA → Smart Contract.withdraw(20)", 
          "Smart Contract → Attacker EOA.receive()", 
          "Attacker EOA → Smart Contract.withdraw(20)"
        ]);
        break;
      case 7:
        addLog("🔍 Second check: Smart Contract still shows 20 ETH earnings", 'warning');
        addLog("💡 Why? Smart Contract's state not updated from first call!", 'info');
        setCallStack([
          "Attacker EOA → Smart Contract.withdraw(20)", 
          "Smart Contract → Attacker EOA.receive()", 
          "Attacker EOA → Smart Contract.withdraw(20)",
          "Smart Contract → Attacker EOA.receive()"
        ]);
        break;
      case 8:
        addLog("💰 EXPLOIT: Smart Contract sends 20 ETH to Attacker's EOA", 'danger');
        setParticipants(prev => ({
          ...prev,
          attacker: { ...prev.attacker, balance: prev.attacker.balance + 20 },
          marketplace: { ...prev.marketplace, balance: prev.marketplace.balance - 20 }
        }));
        break;
      case 9:
        addLog("↩️ Second call completes, returns to first call", 'info');
        setCallStack(["Attacker EOA → Smart Contract.withdraw(20)"]);
        break;
      case 10:
        addLog("💰 DOUBLE STEAL: Smart Contract sends another 20 ETH!", 'danger');
        setParticipants(prev => ({
          ...prev,
          attacker: { ...prev.attacker, balance: prev.attacker.balance + 20 },
          marketplace: { ...prev.marketplace, balance: prev.marketplace.balance - 20 }
        }));
        break;
      case 11:
        addLog("🏁 Attack complete - Attacker's EOA now has 50 ETH total", 'danger');
        setCallStack([]);
        setActiveParticipant(null);
        break;
      case 12:
        addLog("😰 Merchant (EOA) tries to withdraw from Smart Contract", 'info');
        setActiveParticipant('merchant');
        break;
      case 13:
        addLog("❌ IMPACT: Smart Contract has insufficient ETH balance!", 'danger');
        addLog("💔 Honest users can't access their ETH stored in contract", 'warning');
        break;
      case 14:
        addLog("🏭 Vendor (EOA) also affected - can't withdraw ETH", 'warning');
        setActiveParticipant('vendor');
        break;
      case 15:
        addLog("📊 RESULT: Smart Contract drained, all honest users lose money", 'danger');
        addLog("⚖️ One vulnerable smart contract affects entire ecosystem", 'warning');
        setActiveParticipant(null);
        break;
      default:
        break;
    }
  };

  const autoPlay = () => {
    if (isAutoPlaying) return;
    
    setIsAutoPlaying(true);
    
    const interval = setInterval(() => {
      setStep(prevStep => {
        if (prevStep >= 15) {
          clearInterval(interval);
          setIsAutoPlaying(false);
          return prevStep;
        }
        
        const newStep = prevStep + 1;
        executeStep(newStep);
        return newStep;
      });
    }, speed);
  };

  const getParticipantColor = (key) => {
    const isActive = activeParticipant === key;
    const isContract = participants[key].type === 'contract';
    
    if (isActive) {
      if (key === 'attacker') return 'bg-red-600 animate-pulse shadow-lg';
      if (isContract) return 'bg-purple-600 animate-pulse shadow-lg';
      return 'bg-blue-600 animate-pulse shadow-lg';
    }
    
    if (key === 'attacker') return 'bg-red-500';
    if (isContract) return 'bg-purple-500';
    return 'bg-blue-500';
  };

  const getLogColor = (type) => {
    switch(type) {
      case 'danger': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'system': return 'text-blue-400';
      default: return 'text-green-400';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
        🛡️ Ethereum Ecosystem: Reentrancy Attack Explained
      </h1>

      {/* Toggle Buttons */}
      <div className="mb-6 text-center space-x-4">
        <button 
          onClick={() => setShowBasics(!showBasics)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {showBasics ? 'Hide' : 'Show'} Ethereum Basics
        </button>
        <button 
          onClick={() => setShowUseCase(!showUseCase)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          {showUseCase ? 'Hide' : 'Show'} Real-World Use Case
        </button>
      </div>

      {/* Ethereum Basics Section */}
      {showBasics && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">🌐 How Ethereum Actually Works</h2>
          
          <div className="mb-6 bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
            <h3 className="text-lg font-bold mb-3 text-yellow-800">🤔 Key Question: "How do humans deposit money into a program?"</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-100 p-3 rounded border-l-4 border-red-400">
                <h4 className="font-bold text-red-800 mb-2">❌ What Smart Contracts Are NOT:</h4>
                <ul className="text-sm space-y-1 text-red-700">
                  <li>• Not physical ATM machines</li>
                  <li>• Not installed on one computer</li>
                  <li>• Not in a bank building</li>
                  <li>• Not controlled by one company</li>
                </ul>
              </div>
              <div className="bg-green-100 p-3 rounded border-l-4 border-green-400">
                <h4 className="font-bold text-green-800 mb-2">✅ What Smart Contracts Actually Are:</h4>
                <ul className="text-sm space-y-1 text-green-700">
                  <li>• Digital programs running on 1000s of computers</li>
                  <li>• Accessible through websites/apps</li>
                  <li>• Have their own "address" like email</li>
                  <li>• Automatically execute when triggered</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-6 bg-blue-50 p-4 rounded-lg border-2 border-blue-300">
            <h3 className="text-lg font-bold mb-3 text-blue-800">📱 How Humans Actually Interact with Smart Contracts</h3>
            <div className="grid md:grid-cols-4 gap-3">
              <div className="text-center">
                <div className="bg-blue-500 text-white p-3 rounded-lg mb-2">
                  <div className="font-bold">1. Website/App</div>
                  <div className="text-xs mt-1">User visits marketplace.com</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-green-500 text-white p-3 rounded-lg mb-2">
                  <div className="font-bold">2. Wallet</div>
                  <div className="text-xs mt-1">MetaMask connects to website</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-purple-500 text-white p-3 rounded-lg mb-2">
                  <div className="font-bold">3. Transaction</div>
                  <div className="text-xs mt-1">Send ETH to contract address</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-orange-500 text-white p-3 rounded-lg mb-2">
                  <div className="font-bold">4. Execution</div>
                  <div className="text-xs mt-1">Contract code runs automatically</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
              <h3 className="text-lg font-bold mb-3 text-blue-800">💰 Ether (ETH)</h3>
              <ul className="text-sm space-y-2 text-blue-700">
                <li>• Digital money (like digital dollars)</li>
                <li>• Stored as numbers in accounts</li>
                <li>• Transferred through transactions</li>
                <li>• <strong>NOT</strong> physical coins or bills</li>
                <li>• Exists only as blockchain records</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
              <h3 className="text-lg font-bold mb-3 text-green-800">👤 Human Wallets (EOAs)</h3>
              <ul className="text-sm space-y-2 text-green-700">
                <li>• Software on your phone/computer</li>
                <li>• Like a digital bank account</li>
                <li>• Examples: MetaMask, Coinbase Wallet</li>
                <li>• You control with your password/keys</li>
                <li>• Can send ETH to any address</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
              <h3 className="text-lg font-bold mb-3 text-purple-800">🤖 Smart Contracts</h3>
              <ul className="text-sm space-y-2 text-purple-700">
                <li>• Programs running on Ethereum network</li>
                <li>• Have their own address (like email)</li>
                <li>• Can receive and send ETH automatically</li>
                <li>• Run on thousands of computers globally</li>
                <li>• No single owner or controller</li>
              </ul>
            </div>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg border-2 border-indigo-300">
            <h3 className="text-lg font-bold mb-3 text-indigo-800">🏦 Think of it Like Online Banking</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Traditional Online Bank:</h4>
                <ul className="text-sm space-y-1">
                  <li>• You visit bank's website</li>
                  <li>• Login with your credentials</li>
                  <li>• Transfer money between accounts</li>
                  <li>• Bank's servers process transactions</li>
                  <li>• Money moves digitally (no physical cash)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Ethereum Smart Contract:</h4>
                <ul className="text-sm space-y-1">
                  <li>• You visit marketplace website</li>
                  <li>• Connect your MetaMask wallet</li>
                  <li>• Send ETH to contract's address</li>
                  <li>• Ethereum network processes transaction</li>
                  <li>• ETH moves digitally to contract</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-World Use Case Section */}
      {showUseCase && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">🏦 Real-World Use Case: "EthLend" DeFi Protocol</h2>
          
          <div className="mb-6 bg-green-50 p-4 rounded-lg border-2 border-green-300">
            <h3 className="text-lg font-bold mb-3 text-green-800">💡 The Business: Decentralized Lending Platform</h3>
            <p className="mb-3 text-green-700">
              <strong>EthLend</strong> is a DeFi protocol where users can lend ETH to earn interest and borrow ETH by providing collateral. 
              It's like a bank, but without traditional banks - everything is automated through smart contracts.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white rounded border">
                <div className="font-bold text-green-600 mb-1">💰 Lenders</div>
                <div className="text-sm">Deposit ETH, earn 5% APY</div>
              </div>
              <div className="text-center p-3 bg-white rounded border">
                <div className="font-bold text-blue-600 mb-1">🏦 Protocol</div>
                <div className="text-sm">Matches lenders & borrowers</div>
              </div>
              <div className="text-center p-3 bg-white rounded border">
                <div className="font-bold text-orange-600 mb-1">📈 Borrowers</div>
                <div className="text-sm">Borrow ETH, pay 8% APY</div>
              </div>
            </div>
          </div>

          <div className="mb-6 bg-red-50 p-4 rounded-lg border-2 border-red-300">
            <h3 className="text-lg font-bold mb-3 text-red-800">🐛 The Vulnerable Code</h3>
            <div className="bg-gray-900 p-4 rounded text-green-400 font-mono text-sm overflow-x-auto">
              <pre>{`// VULNERABLE CODE IN ETHLEND CONTRACT
function withdraw(uint amount) public {
    require(deposits[msg.sender] >= amount, "Insufficient balance");
    
    // 🚨 VULNERABILITY: External call BEFORE state update
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
    
    // 🚨 State updated AFTER external call - TOO LATE!  
    deposits[msg.sender] -= amount;
}`}</pre>
            </div>
          </div>

          <div className="mb-6 bg-purple-50 p-4 rounded-lg border-2 border-purple-300">
            <h3 className="text-lg font-bold mb-3 text-purple-800">🦹‍♀️ Attacker's Malicious Contract</h3>
            <div className="bg-gray-900 p-4 rounded text-green-400 font-mono text-sm overflow-x-auto">
              <pre>{`// ATTACKER'S MALICIOUS CONTRACT
contract MaliciousAttacker {
    EthLend public target;
    uint public attackAmount = 20 ether;
    
    function attack() external {
        target.deposit{value: attackAmount}();
        target.withdraw(attackAmount);
    }
    
    receive() external payable {
        if (address(target).balance >= attackAmount) {
            target.withdraw(attackAmount); // 🔄 REENTRANCY!
        }
    }
}`}</pre>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-3 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Ecosystem Participants</h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {Object.entries(participants).map(([key, participant]) => (
              <div key={key} className={`${getParticipantColor(key)} text-white p-3 rounded-lg transition-all duration-300`}>
                <div className="text-xs font-medium mb-1">
                  {participant.type === 'contract' ? '🤖 Smart Contract' : '👤 Human (EOA)'}
                </div>
                <div className="text-sm font-medium mb-2">{participant.role}</div>
                <div className="font-mono text-lg mb-1">{participant.balance} ETH</div>
                <div className="text-xs opacity-90 mb-1">{participant.address}</div>
                {participant.earnings && (
                  <div className="text-xs opacity-90">
                    Earnings: {participant.earnings} ETH
                  </div>
                )}
                {participant.spent > 0 && (
                  <div className="text-xs opacity-90">
                    Spent: {participant.spent} ETH
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Transaction Flow</h2>
          <div className="bg-gray-900 p-3 rounded text-green-400 font-mono text-xs overflow-x-auto">
            {callStack.length > 0 ? (
              <div className="space-y-1">
                {callStack.map((call, index) => (
                  <div key={index} className="ml-2" style={{ marginLeft: `${index * 0.5}rem` }}>
                    → {call}
                  </div>
                ))}
              </div>
            ) : (
              <div>No active transactions</div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Reentrancy Attack Simulation - Step {step} of 15
        </h2>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
          <div 
            className="bg-gradient-to-r from-blue-500 to-red-500 h-3 rounded-full transition-all duration-500" 
            style={{ width: `${(step / 15) * 100}%` }}
          ></div>
        </div>

        <div className="flex justify-center space-x-4 mb-4">
          <button 
            onClick={reset} 
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            🔄 Reset
          </button>
          <button 
            onClick={nextStep} 
            disabled={step >= 15 || isAutoPlaying}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${(step >= 15 || isAutoPlaying) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            ▶️ Next Step
          </button>
          <button 
            onClick={autoPlay} 
            disabled={step >= 15 || isAutoPlaying}
            className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ${(step >= 15 || isAutoPlaying) ? 'opacity-50 cursor-not-allowed' : ''}`}
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

      {/* Event Logs */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Detailed Transaction Log</h2>
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
            <div className="text-green-400">Ready to simulate Ethereum transactions...</div>
          )}
        </div>
      </div>

      {/* Educational Footer */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          🛡️ The Secure Solution
        </h2>
        <div className="bg-green-50 p-4 rounded font-mono text-sm border-l-4 border-green-500">
          <pre>{`// SECURE PATTERN: Update state BEFORE external calls
function withdraw(uint amount) public {
    require(balances[msg.sender] >= amount);
    
    // 1. Update state FIRST
    balances[msg.sender] -= amount;
    
    // 2. THEN make external call
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
}`}</pre>
        </div>
        
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
            <h4 className="font-medium mb-2">🔍 Checks</h4>
            <p className="text-sm">Validate all conditions and requirements before proceeding.</p>
          </div>
          <div className="bg-green-50 p-4 rounded border-l-4 border-green-500">
            <h4 className="font-medium mb-2">⚡ Effects</h4>
            <p className="text-sm">Update all state variables and internal accounting.</p>
          </div>
          <div className="bg-purple-50 p-4 rounded border-l-4 border-purple-500">
            <h4 className="font-medium mb-2">🌐 Interactions</h4>
            <p className="text-sm">Make external calls to other contracts last.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReentrancyVisualization;
