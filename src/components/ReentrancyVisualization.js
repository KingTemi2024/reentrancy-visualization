import { useState } from 'react';

const ReentrancyVisualization = () => {
  const [step, setStep] = useState(0);
  const [attackerBalance, setAttackerBalance] = useState(5);
  const [vulnerableContractBalance, setVulnerableContractBalance] = useState(30);
  const [callStack, setCallStack] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);

  const addLog = (message) => {
    setLogs(prevLogs => [...prevLogs, { message, time: new Date().toLocaleTimeString() }]);
  };

  const reset = () => {
    setStep(0);
    setAttackerBalance(5);
    setVulnerableContractBalance(30);
    setCallStack([]);
    setLogs([]);
    setIsAutoPlaying(false);
    addLog("Simulation reset");
  };

  const nextStep = () => {
    if (step >= 10) return;
    
    setStep(prevStep => {
      const newStep = prevStep + 1;
      
      switch(newStep) {
        case 1:
          addLog("Attacker initiates withdrawal of 5 ETH");
          setCallStack(["Attacker.attack()"]);
          break;
        case 2:
          addLog("Vulnerable contract checks if attacker has 5 ETH balance (they do)");
          setCallStack(["Attacker.attack()", "Vulnerable.withdraw(5)"]);
          break;
        case 3:
          addLog("Vulnerable contract initiates external call to attacker's fallback");
          setCallStack(["Attacker.attack()", "Vulnerable.withdraw(5)", "Attacker.receive()"]);
          break;
        case 4:
          addLog("CRITICAL: Balance check done but funds not yet deducted!");
          break;
        case 5:
          addLog("REENTRANCY: Attacker's fallback function calls withdraw again");
          setCallStack(["Attacker.attack()", "Vulnerable.withdraw(5)", "Attacker.receive()", "Vulnerable.withdraw(5)"]);
          break;
        case 6:
          addLog("Vulnerable contract checks if attacker has 5 ETH balance (appears yes)");
          setCallStack(["Attacker.attack()", "Vulnerable.withdraw(5)", "Attacker.receive()", "Vulnerable.withdraw(5)", "Attacker.receive()"]);
          break;
        case 7:
          addLog("EXPLOIT: Second withdrawal initiated before first completed");
          setAttackerBalance(attackerBalance + 5);
          setVulnerableContractBalance(vulnerableContractBalance - 5);
          break;
        case 8:
          addLog("Second withdrawal completes and returns to first withdrawal");
          setCallStack(["Attacker.attack()", "Vulnerable.withdraw(5)"]);
          break;
        case 9:
          addLog("First withdrawal completes, updating balances again");
          setAttackerBalance(attackerBalance + 5);
          setVulnerableContractBalance(vulnerableContractBalance - 5);
          break;
        case 10:
          addLog("Attack complete - 10 ETH stolen instead of 5 ETH withdrawn");
          setCallStack([]);
          break;
        default:
          break;
      }
      
      return newStep;
    });
  };

  const autoPlay = () => {
    if (isAutoPlaying) return;
    
    setIsAutoPlaying(true);
    
    const interval = setInterval(() => {
      setStep(prevStep => {
        if (prevStep >= 10) {
          clearInterval(interval);
          setIsAutoPlaying(false);
          return prevStep;
        }
        
        const newStep = prevStep + 1;
        
        switch(newStep) {
          case 1:
            addLog("Attacker initiates withdrawal of 5 ETH");
            setCallStack(["Attacker.attack()"]);
            break;
          case 2:
            addLog("Vulnerable contract checks if attacker has 5 ETH balance (they do)");
            setCallStack(["Attacker.attack()", "Vulnerable.withdraw(5)"]);
            break;
          case 3:
            addLog("Vulnerable contract initiates external call to attacker's fallback");
            setCallStack(["Attacker.attack()", "Vulnerable.withdraw(5)", "Attacker.receive()"]);
            break;
          case 4:
            addLog("CRITICAL: Balance check done but funds not yet deducted!");
            break;
          case 5:
            addLog("REENTRANCY: Attacker's fallback function calls withdraw again");
            setCallStack(["Attacker.attack()", "Vulnerable.withdraw(5)", "Attacker.receive()", "Vulnerable.withdraw(5)"]);
            break;
          case 6:
            addLog("Vulnerable contract checks if attacker has 5 ETH balance (appears yes)");
            setCallStack(["Attacker.attack()", "Vulnerable.withdraw(5)", "Attacker.receive()", "Vulnerable.withdraw(5)", "Attacker.receive()"]);
            break;
          case 7:
            addLog("EXPLOIT: Second withdrawal initiated before first completed");
            setAttackerBalance(prevBalance => prevBalance + 5);
            setVulnerableContractBalance(prevBalance => prevBalance - 5);
            break;
          case 8:
            addLog("Second withdrawal completes and returns to first withdrawal");
            setCallStack(["Attacker.attack()", "Vulnerable.withdraw(5)"]);
            break;
          case 9:
            addLog("First withdrawal completes, updating balances again");
            setAttackerBalance(prevBalance => prevBalance + 5);
            setVulnerableContractBalance(prevBalance => prevBalance - 5);
            break;
          case 10:
            addLog("Attack complete - 10 ETH stolen instead of 5 ETH withdrawn");
            setCallStack([]);
            break;
          default:
            break;
        }
        
        return newStep;
      });
    }, speed);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Reentrancy Attack Visualization</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Contract States */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Contract States</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Attacker Balance:</span>
              <span className={`font-mono text-lg ${attackerBalance > 5 ? 'text-green-600 font-bold' : 'text-gray-800'}`}>
                {attackerBalance} ETH
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Vulnerable Contract:</span>
              <span className={`font-mono text-lg ${vulnerableContractBalance < 30 ? 'text-red-600 font-bold' : 'text-gray-800'}`}>
                {vulnerableContractBalance} ETH
              </span>
            </div>
          </div>
        </div>
        
        {/* Call Stack */}
        <div className="bg-white p-4 rounded-lg shadow col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Execution Stack</h2>
          <div className="bg-gray-900 p-3 rounded text-green-400 font-mono text-sm overflow-x-auto">
            {callStack.length > 0 ? (
              <div className="space-y-1">
                {callStack.map((call, index) => (
                  <div key={index} className="ml-4" style={{ marginLeft: `${index * 1.5}rem` }}>
                    ↳ {call}
                  </div>
                ))}
              </div>
            ) : (
              <div>No active calls</div>
            )}
          </div>
        </div>
      </div>
      
      {/* Visualization */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Attack Visualization - Step {step} of 10</h2>
        
        <div className="flex items-center justify-center mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${(step / 10) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-8 relative">
          {/* Attacker */}
          <div className="flex flex-col items-center w-1/4">
            <div className={`w-32 h-32 rounded-lg flex items-center justify-center text-white font-bold ${step > 0 && step < 10 ? 'bg-red-500 animate-pulse' : 'bg-red-500'}`}>
              <div>
                <div className="text-center mb-2">Attacker</div>
                <div className="text-center text-sm">{attackerBalance} ETH</div>
              </div>
            </div>
          </div>
          
          {/* Flow arrows */}
          <div className="flex-1 relative h-10">
            {step >= 1 && (
              <div className="absolute top-0 left-0 w-full flex justify-center">
                <div className={`h-1 bg-blue-500 w-full ${step >= 1 && step < 8 ? 'animate-pulse' : ''}`}></div>
                {step >= 1 && (
                  <div className="absolute right-0 -mr-2 -mt-1.5">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-8 border-l-blue-500 border-b-8 border-b-transparent"></div>
                  </div>
                )}
              </div>
            )}
            
            {step >= 3 && (
              <div className="absolute bottom-0 left-0 w-full flex justify-center">
                <div className={`h-1 bg-red-500 w-full ${step >= 3 && step < 10 ? 'animate-pulse' : ''}`}></div>
                {step >= 3 && (
                  <div className="absolute left-0 -ml-2 -mt-1.5">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-red-500 border-b-8 border-b-transparent"></div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Vulnerable Contract */}
          <div className="flex flex-col items-center w-1/4">
            <div className={`w-32 h-32 rounded-lg flex items-center justify-center text-white font-bold ${step > 1 && step < 10 ? 'bg-blue-500 animate-pulse' : 'bg-blue-500'}`}>
              <div>
                <div className="text-center mb-2">Vulnerable Contract</div>
                <div className="text-center text-sm">{vulnerableContractBalance} ETH</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2 border-t border-gray-200 pt-4">
          <div className="flex space-x-4 justify-center">
            <button 
              onClick={reset} 
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Reset
            </button>
            <button 
              onClick={nextStep} 
              disabled={step >= 10 || isAutoPlaying}
              className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${(step >= 10 || isAutoPlaying) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Next Step
            </button>
            <button 
              onClick={autoPlay} 
              disabled={step >= 10 || isAutoPlaying}
              className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${(step >= 10 || isAutoPlaying) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isAutoPlaying ? 'Playing...' : 'Auto Play'}
            </button>
          </div>
          <div className="flex items-center justify-center mt-4">
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
      </div>
      
      {/* Event Logs */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Event Logs</h2>
        <div className="bg-gray-900 p-3 rounded text-green-400 font-mono text-sm h-64 overflow-y-auto">
          {logs.length > 0 ? (
            <div className="space-y-1">
              {logs.map((log, index) => (
                <div key={index}>
                  <span className="text-gray-500">[{log.time}]</span> {log.message}
                </div>
              ))}
            </div>
          ) : (
            <div>No events logged yet. Start the simulation.</div>
          )}
        </div>
      </div>
      
      {/* Educational Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Understanding Reentrancy Attacks</h2>
        
        <div className="space-y-4 text-gray-700">
          <p>
            A reentrancy attack occurs when a function makes an external call to another untrusted contract before it resolves its own state.
            This can allow an attacker to recursively call back into the original function, potentially draining funds.
          </p>
          
          <h3 className="text-xl font-medium mt-4">The Vulnerable Pattern:</h3>
          <div className="bg-gray-100 p-4 rounded font-mono text-sm">
            <pre>{`// VULNERABLE CODE - DON'T USE THIS
function withdraw(uint amount) public {
    require(balances[msg.sender] >= amount);
    
    // 1. External call is made before state update
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
    
    // 2. State is updated AFTER the external call
    balances[msg.sender] -= amount;
}`}</pre>
          </div>
          
          <h3 className="text-xl font-medium mt-4">The Secure Pattern (Checks-Effects-Interactions):</h3>
          <div className="bg-gray-100 p-4 rounded font-mono text-sm">
            <pre>{`// SECURE CODE - FOLLOW THIS PATTERN
function withdraw(uint amount) public {
    // 1. Checks
    require(balances[msg.sender] >= amount);
    
    // 2. Effects (update state)
    balances[msg.sender] -= amount;
    
    // 3. Interactions (external calls) - AFTER state updates
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
}`}</pre>
          </div>
          
          <h3 className="text-xl font-medium mt-4">Additional Protection:</h3>
          <div className="bg-gray-100 p-4 rounded font-mono text-sm">
            <pre>{`// USING REENTRANCY GUARD
// Add this modifier to functions at risk
modifier nonReentrant() {
    require(!locked, "No reentrancy");
    locked = true;
    _;
    locked = false;
}`}</pre>
          </div>
          
          <div className="mt-6">
            <h3 className="text-xl font-medium">Key Takeaways:</h3>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Always follow the <strong>Checks-Effects-Interactions</strong> pattern</li>
              <li>Update state variables before making external calls</li>
              <li>Consider using reentrancy guards for critical functions</li>
              <li>Be aware of cross-function reentrancy attacks too</li>
              <li>The <code>nonReentrant</code> modifier from OpenZeppelin is widely used</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReentrancyVisualization;
