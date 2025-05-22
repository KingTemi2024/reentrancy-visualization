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
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
        Ethereum Ecosystem: Reentrancy Attack Explained
      </h1>

      {/* Basics Toggle */}
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
          
          {/* Physical vs Digital Reality */}
          <div className="mb-6 bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
            <h3 className="text-lg font-bold mb-3 text-yellow-800">🤔 Your Question: "How do humans deposit money into a program?"</h3>
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

          {/* How Interaction Works */}
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

          {/* Real World Analogy */}
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

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-3 text-gray-800">🎭 Who is Who in Our Scenario:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Smart Contract (1):</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• <strong>Marketplace Contract:</strong> Holds everyone's ETH, executes business logic</li>
                  <li>• Has vulnerable withdrawal function</li>
                  <li>• No human owner - runs automatically</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Human Users with EOAs (4):</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• <strong>Merchant:</strong> Sells products, earns ETH</li>
                  <li>• <strong>Vendor:</strong> Supplies goods, expects payment</li>
                  <li>• <strong>Customer:</strong> Buys products, spends ETH</li>
                  <li>• <strong>Attacker:</strong> Exploits contract vulnerability</li>
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
          
          {/* The Business Model */}
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

          {/* The Actors Involved */}
          <div className="mb-6 bg-blue-50 p-4 rounded-lg border-2 border-blue-300">
            <h3 className="text-lg font-bold mb-3 text-blue-800">👥 Key Actors in This Ecosystem</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-700 mb-3">🛠️ Development & Security Actors:</h4>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border-l-4 border-purple-400">
                    <div className="font-semibold">Smart Contract Developer</div>
                    <div className="text-sm text-gray-600">Writes the lending protocol code</div>
                    <div className="text-xs text-red-600">⚠️ May introduce vulnerability accidentally</div>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
                    <div className="font-semibold">Security Auditor</div>
                    <div className="text-sm text-gray-600">Reviews code for vulnerabilities</div>
                    <div className="text-xs text-red-600">⚠️ May miss the reentrancy bug</div>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-green-400">
                    <div className="font-semibold">Protocol Team</div>
                    <div className="text-sm text-gray-600">Deploys contract to mainnet</div>
                    <div className="text-xs text-red-600">⚠️ Launches without proper testing</div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-700 mb-3">👨‍💼 User Actors:</h4>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                    <div className="font-semibold">Alice (Lender)</div>
                    <div className="text-sm text-gray-600">Deposits 50 ETH to earn interest</div>
                    <div className="text-xs text-green-600">✅ Honest user, victim of attack</div>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-orange-400">
                    <div className="font-semibold">Bob (Borrower)</div>
                    <div className="text-sm text-gray-600">Borrows 30 ETH for trading</div>
                    <div className="text-xs text-green-600">✅ Honest user, victim of attack</div>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-red-400">
                    <div className="font-semibold">Eve (Attacker)</div>
                    <div className="text-sm text-gray-600">Hacker who finds the vulnerability</div>
                    <div className="text-xs text-red-600">❌ Malicious actor, exploits the bug</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline of Events */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
            <h3 className="text-lg font-bold mb-3 text-gray-800">📅 Timeline: How the Vulnerability Develops</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <div className="font-semibold">Week 1: Development Phase</div>
                  <div className="text-sm text-gray-600">Developer creates withdrawal function but uses wrong pattern (external call before state update)</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <div className="font-semibold">Week 2: Audit Phase</div>
                  <div className="text-sm text-gray-600">Security auditor reviews code but focuses on other issues, misses reentrancy vulnerability</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <div className="font-semibold">Week 3: Launch Phase</div>
                  <div className="text-sm text-gray-600">Protocol launches, Alice deposits 50 ETH, Bob borrows 30 ETH - everything works normally</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <div className="font-semibold">Week 4: Attack Phase</div>
                  <div className="text-sm text-gray-600">Eve discovers vulnerability, performs reentrancy attack, drains the protocol</div>
                </div>
              </div>
            </div>
          </div>

          {/* The Vulnerable Code */}
          <div className="mb-6 bg-red-50 p-4 rounded-lg border-2 border-red-300">
            <h3 className="text-lg font-bold mb-3 text-red-800">🐛 Where the Vulnerability Comes In</h3>
            <p className="mb-3 text-red-700">
              The developer wrote the withdrawal function incorrectly. Here's the vulnerable code in the EthLend smart contract:
            </p>
            <div className="bg-gray-900 p-4 rounded text-green-400 font-mono text-sm overflow-x-auto">
              <pre>{`// VULNERABLE CODE IN ETHLEND CONTRACT
contract EthLend {
    mapping(address => uint) public deposits;
    mapping(address => uint) public borrowings;
    
    function withdraw(uint amount) public {
        require(deposits[msg.sender] >= amount, "Insufficient balance");
        
        // 🚨 VULNERABILITY: External call BEFORE state update
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        // 🚨 State updated AFTER external call - TOO LATE!  
        deposits[msg.sender] -= amount;
    }
}`}</pre>
            </div>
            <div className="mt-3 text-sm text-red-700">
              <strong>The Problem:</strong> When Eve withdraws ETH, the contract sends her the money BEFORE updating her balance. 
              This means she can call withdraw() again while her balance still shows the original amount.
            </div>
          </div>

          {/* Attack Mechanism Step by Step */}
          <div className="mb-6 bg-orange-50 p-4 rounded-lg border-2 border-orange-300">
            <h3 className="text-lg font-bold mb-3 text-orange-800">⚔️ Step-by-Step Attack Mechanism</h3>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded border-l-4 border-blue-400">
                <div className="font-semibold mb-2">🎯 Pre-Attack Setup:</div>
                <ul className="text-sm space-y-1">
                  <li>• Alice (honest lender) deposits 50 ETH into EthLend</li>
                  <li>• Bob (honest borrower) borrows 30 ETH</li>
                  <li>• Eve (attacker) deposits 20 ETH to gain legitimacy</li>
                  <li>• Protocol now holds 70 ETH total (50 + 20)</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded border-l-4 border-red-400">
                <div className="font-semibold mb-2">💥 The Attack Sequence:</div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium text-red-600 mb-2">Phase 1: Initial Call</div>
                    <ol className="text-sm space-y-1 list-decimal list-inside">
                      <li>Eve calls withdraw(20 ETH)</li>
                      <li>Contract checks: Eve has 20 ETH ✅</li>
                      <li>Contract sends 20 ETH to Eve</li>
                      <li>🚨 Eve's receive() function triggers</li>
                    </ol>
                  </div>
                  <div>
                    <div className="font-medium text-red-600 mb-2">Phase 2: Reentrancy</div>
                    <ol className="text-sm space-y-1 list-decimal list-inside">
                      <li>Eve's contract calls withdraw(20 ETH) again</li>
                      <li>Contract checks: Eve STILL shows 20 ETH ✅</li>
                      <li>Contract sends another 20 ETH to Eve</li>
                      <li>Now Eve has received 40 ETH total</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded border-l-4 border-gray-400">
                <div className="font-semibold mb-2">📊 Attack Result:</div>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-red-600">Eve (Attacker)</div>
                    <div>Withdrew: 40 ETH</div>
                    <div>Should have gotten: 20 ETH</div>
                    <div className="text-red-600">Profit: +20 ETH</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-orange-600">Protocol</div>
                    <div>Remaining: 30 ETH</div>
                    <div>Should have: 50 ETH</div>
                    <div className="text-red-600">Loss: -20 ETH</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-blue-600">Alice (Lender)</div>
                    <div>Can withdraw: ~15 ETH</div>
                    <div>Should get: 50 ETH</div>
                    <div className="text-red-600">Loss: -35 ETH</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Eve's Attack Contract */}
          <div className="mb-6 bg-purple-50 p-4 rounded-lg border-2 border-purple-300">
            <h3 className="text-lg font-bold mb-3 text-purple-800">🦹‍♀️ Eve's Attack Contract Code</h3>
            <p className="mb-3 text-purple-700">
              Eve didn't just use a regular wallet - she deployed her own malicious smart contract to perform the attack:
            </p>
            <div className="bg-gray-900 p-4 rounded text-green-400 font-mono text-sm overflow-x-auto">
              <pre>{`// EVE'S MALICIOUS CONTRACT
contract MaliciousAttacker {
    EthLend public target;
    uint public attackAmount = 20 ether;
    
    constructor(address _target) {
        target = EthLend(_target);
    }
    
    function attack() external {
        // First deposit to establish legitimacy
        target.deposit{value: attackAmount}();
        
        // Then trigger the reentrancy attack
        target.withdraw(attackAmount);
    }
    
    // This function gets called when receiving ETH
    receive() external payable {
        // If target still has ETH and we haven't drained it
        if (address(target).balance >= attackAmount) {
            target.withdraw(attackAmount); // 🔄 REENTRANCY!
        }
    }
}`}</pre>
            </div>
          </div>

          {/* Actors' Roles in Enabling Attack */}
          <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
            <h3 className="text-lg font-bold mb-3 text-yellow-800">🎭 How Each Actor Enabled the Attack</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-red-700 mb-2">❌ Actors Who Failed:</h4>
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Developer:</strong> Used wrong pattern, didn't follow security best practices
                  </div>
                  <div className="text-sm">
                    <strong>Auditor:</strong> Failed to catch critical vulnerability during review
                  </div>
                  <div className="text-sm">
                    <strong>Protocol Team:</strong> Rushed to market without thorough testing
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-green-700 mb-2">✅ Actors Who Were Victims:</h4>
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Alice & Bob:</strong> Trusted the protocol, lost their funds
                  </div>
                  <div className="text-sm">
                    <strong>DeFi Community:</strong> Lost trust in new protocols
                  </div>
                  <div className="text-sm">
                    <strong>Ethereum Ecosystem:</strong> Reputation damage from hack
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Participants */}
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

        {/* Call Stack */}
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

      {/* Attack Progress */}
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
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
          >
            🔄 Reset
          </button>
          <button 
            onClick={nextStep} 
            disabled={step >= 15 || isAutoPlaying}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors ${(step >= 15 || isAutoPlaying) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            ▶️ Next Step
          </button>
          <button 
            onClick={autoPlay} 
            disabled={step >= 15 || isAutoPlaying}
            className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors ${(step >= 15 || isAutoPlaying) ? 'opacity-50 cursor-not-allowed' : ''}`}
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

      {/* Enhanced Educational Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          🎓 Understanding the Fundamental Components
        </h2>
        
        <div className="space-y-6 text-gray-700">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-medium mb-3">❓ Key Questions Answered</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                  <p><strong>Q: Is Ether the smart contract?</strong></p>
                  <p className="text-sm mt-1">A: No! Ether (ETH) is the currency that flows between accounts and smart contracts. Think of ETH as digital money.</p>
                </div>
                
                <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                  <p><strong>Q: Who owns the wallet?</strong></p>
                  <p className="text-sm mt-1">A: Humans own wallets (EOAs) with private keys. Smart contracts have no owners - they're autonomous programs.</p>
                </div>
                
                <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-500">
                  <p><strong>Q: Are merchants different users?</strong></p>
                  <p className="text-sm mt-1">A: Yes! Each merchant, vendor, customer is a separate human with their own wallet address.</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-3">🏗️ The Architecture</h3>
              <div className="bg-gray-50 p-4 rounded">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                    <span><strong>Ethereum Blockchain:</strong> The foundation layer</span>
                  </div>
                  <div className="flex items-center ml-4">
                    <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                    <span><strong>ETH Currency:</strong> Flows between accounts</span>
                  </div>
                  <div className="flex items-center ml-4">
                    <div className="w-4 h-4 bg-purple-500 rounded mr-3"></div>
                    <span><strong>Smart Contracts:</strong> Autonomous programs</span>
                  </div>
                  <div className="flex items-center ml-4">
                    <div className="w-4 h-4 bg-orange-500 rounded mr-3"></div>
                    <span><strong>EOAs (Wallets):</strong> Human-controlled accounts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-3">⚡ How the Attack Works</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-red-50 p-4 rounded border-l-4 border-red-500">
                <h4 className="font-medium mb-2">1. Initial Setup</h4>
                <p className="text-sm">
                  Humans deposit ETH into smart contract. Contract tracks balances internally but makes vulnerable external calls.
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-500">
                <h4 className="font-medium mb-2">2. The Exploit</h4>
                <p className="text-sm">
                  Attacker's wallet receives ETH from contract, then immediately calls back into the same contract before it updates its internal records.
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded border-l-4 border-orange-500">
                <h4 className="font-medium mb-2">3. The Damage</h4>
                <p className="text-sm">
                  Contract sends ETH multiple times to attacker's wallet, draining the contract and affecting all other users.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 p-4 rounded border-l-4 border-indigo-500">
            <h3 className="text-xl font-medium mb-3">🧠 Better Analogy: Online Banking Glitch</h3>
            <p className="mb-3">
              Imagine an online banking website (smart contract) with a flawed withdrawal system. When you request money online, the system transfers funds to your account but updates its internal records AFTER the transfer completes.
            </p>
            <p className="mb-3">
              A clever hacker (attacker) realizes they can rapidly click "withdraw" multiple times while the first request is still processing, effectively getting the same money sent to their account multiple times.
            </p>
            <p className="mb-3">
              <strong>Key Point:</strong> No physical ATM machine exists - it's all happening through websites and digital transactions, just like how you bank online today.
            </p>
            <p>
              The banking system's digital vault (smart contract) gets drained, and other customers (honest users) can't access their funds.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded border-l-4 border-gray-500">
            <h3 className="text-xl font-medium mb-3">🌍 Where Does This Actually Happen?</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Physical Reality:</h4>
                <ul className="text-sm space-y-1">
                  <li>• You sit at your computer/phone</li>
                  <li>• Visit a website (like Uniswap, OpenSea)</li>
                  <li>• Website connects to your MetaMask wallet</li>
                  <li>• You click "Deposit ETH" or "Buy Item"</li>
                  <li>• Your wallet sends transaction to Ethereum</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Behind the Scenes:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Transaction broadcast to Ethereum network</li>
                  <li>• Thousands of computers process it</li>
                  <li>• Smart contract code executes automatically</li>
                  <li>• ETH balance updated in contract's memory</li>
                  <li>• All records stored on blockchain forever</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-3">🛡️ The Solution: Secure Smart Contract Pattern</h3>
            <div className="bg-green-50 p-4 rounded font-mono text-sm border-l-4 border-green-500">
              <pre>{`// SECURE PATTERN: Update internal records BEFORE sending ETH
function withdraw(uint amount) public {
    require(balances[msg.sender] >= amount);
    
    // 1. Update the smart contract's internal records FIRST
    balances[msg.sender] -= amount;
    
    // 2. THEN send ETH to the user's wallet
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
}`}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReentrancyVisualization;
