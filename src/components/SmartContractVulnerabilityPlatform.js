// src/components/SmartContractVulnerabilityPlatform.js
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

const VulnerabilityCard = memo(({ vulnerability, onSelect, isSelected }) => {
  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'CRITICAL': return 'border-red-600 bg-red-50';
      case 'HIGH': return 'border-red-500 bg-red-50';
      case 'MEDIUM': return 'border-yellow-500 bg-yellow-50';
      case 'LOW': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getSeverityBadge = (severity) => {
    switch(severity) {
      case 'CRITICAL': return 'bg-red-600 text-white';
      case 'HIGH': return 'bg-red-500 text-white';
      case 'MEDIUM': return 'bg-yellow-500 text-white';
      case 'LOW': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div 
      className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'border-orange-500 bg-orange-50 shadow-lg transform scale-105' 
          : `${getSeverityColor(vulnerability.severity)} hover:shadow-md hover:scale-102`
      }`}
      onClick={() => onSelect(vulnerability)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-3xl mb-2">{vulnerability.emoji}</div>
          <h3 className="text-lg font-bold text-gray-800">{vulnerability.name}</h3>
        </div>
        <span className={`px-3 py-1 rounded text-sm font-bold ${getSeverityBadge(vulnerability.severity)}`}>
          {vulnerability.severity}
        </span>
      </div>
      
      <p className="text-gray-700 text-sm mb-4">{vulnerability.description}</p>
      
      <div className="flex justify-between items-center text-xs text-gray-600">
        <span>💰 Avg Loss: {vulnerability.averageLoss}</span>
        <span>📊 Frequency: {vulnerability.frequency}</span>
      </div>
      
      <div className="mt-3">
        <div className="flex flex-wrap gap-1">
          {vulnerability.tags.map((tag, index) => (
            <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {isSelected && (
        <div className="mt-4 text-center">
          <span className="text-orange-600 font-bold">✨ Selected for Analysis</span>
        </div>
      )}
    </div>
  );
});

VulnerabilityCard.displayName = 'VulnerabilityCard';

const ThreatIntelCard = memo(({ threat }) => (
  <div className="bg-gradient-to-r from-red-100 to-orange-100 p-4 rounded-lg border border-red-300">
    <div className="flex items-center mb-2">
      <span className="text-2xl mr-2">{threat.emoji}</span>
      <h3 className="font-bold text-red-800">{threat.name}</h3>
    </div>
    <p className="text-sm text-red-700 mb-2">{threat.description}</p>
    <div className="flex justify-between text-xs text-red-600">
      <span>Impact: {threat.impact}</span>
      <span>Cases: {threat.recentCases}</span>
    </div>
  </div>
));

ThreatIntelCard.displayName = 'ThreatIntelCard';

const SmartContractVulnerabilityPlatform = ({ onNavigationClick, currentPage = 'SmartContractVulnerabilityPlatform' }) => {
  const [selectedVulnerability, setSelectedVulnerability] = useState(null);
  const [activeTab, setActiveTab] = useState('database');
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [threatIntelMode, setThreatIntelMode] = useState('trending');

  // Default navigation handler if none provided
  const handleNavigation = useCallback((componentName) => {
    if (onNavigationClick) {
      onNavigationClick(componentName);
    } else {
      console.log(`Navigation to: ${componentName}`);
      alert(`Navigation to ${componentName} - This would use React Router in a full application`);
    }
  }, [onNavigationClick]);

  // Comprehensive vulnerability database
  const vulnerabilityDatabase = useMemo(() => [
    {
      id: 'reentrancy',
      name: 'Reentrancy Attack',
      emoji: '🔄',
      severity: 'CRITICAL',
      description: 'External calls that allow recursive function calls before state updates',
      averageLoss: '$2.5M',
      frequency: 'High',
      tags: ['External Calls', 'State Management', 'Critical'],
      cwe: 'CWE-841',
      owasp: 'A06:2021',
      realWorldExamples: [
        { name: 'The DAO', year: 2016, loss: '$60M' },
        { name: 'Cream Finance', year: 2021, loss: '$18.8M' }
      ],
      technicalDetails: {
        mechanism: 'Exploits external calls that trigger callbacks before state updates',
        prerequisites: ['External call to untrusted contract', 'State update after external call'],
        exploitCode: `contract VulnerableBank {
    mapping(address => uint) balances;
    
    function withdraw(uint amount) public {
        require(balances[msg.sender] >= amount);
        msg.sender.call{value: amount}(""); // VULNERABLE
        balances[msg.sender] -= amount; // Too late!
    }
}`,
        mitigation: 'Use ReentrancyGuard, Checks-Effects-Interactions pattern'
      }
    },
    {
      id: 'integer-overflow',
      name: 'Integer Overflow/Underflow',
      emoji: '📊',
      severity: 'HIGH',
      description: 'Arithmetic operations that exceed variable limits causing unexpected behavior',
      averageLoss: '$900K',
      frequency: 'Medium',
      tags: ['Arithmetic', 'Legacy Solidity', 'Token'],
      cwe: 'CWE-190',
      owasp: 'A04:2021',
      realWorldExamples: [
        { name: 'BECToken', year: 2018, loss: '$900M Market Cap' },
        { name: 'ProxyToken', year: 2018, loss: '$20M' }
      ],
      technicalDetails: {
        mechanism: 'Integer arithmetic without overflow protection',
        prerequisites: ['Solidity < 0.8.0', 'No SafeMath usage', 'User-controlled arithmetic'],
        exploitCode: `// Solidity < 0.8.0
uint256 balance = 1;
balance = balance - 2; // Underflows to MAX_UINT!`,
        mitigation: 'Upgrade to Solidity 0.8+, use SafeMath library'
      }
    },
    {
      id: 'access-control',
      name: 'Access Control Bypass',
      emoji: '🔐',
      severity: 'CRITICAL',
      description: 'Missing or flawed authorization mechanisms allowing unauthorized access',
      averageLoss: '$5.2M',
      frequency: 'High',
      tags: ['Authorization', 'Admin Functions', 'Critical'],
      cwe: 'CWE-284',
      owasp: 'A01:2021',
      realWorldExamples: [
        { name: 'Parity Wallet', year: 2017, loss: '$280M' },
        { name: 'Akropolis', year: 2020, loss: '$2M' }
      ],
      technicalDetails: {
        mechanism: 'Functions lack proper access control checks',
        prerequisites: ['Public/external functions', 'Missing modifiers', 'No authorization logic'],
        exploitCode: `function withdraw(uint amount) public {
    // Missing: require(msg.sender == owner);
    payable(msg.sender).transfer(amount);
}`,
        mitigation: 'Use OpenZeppelin AccessControl, implement proper modifiers'
      }
    },
    {
      id: 'front-running',
      name: 'Front-Running/MEV',
      emoji: '🏃‍♂️',
      severity: 'HIGH',
      description: 'Transaction ordering manipulation for profit extraction',
      averageLoss: '$1.8M',
      frequency: 'Very High',
      tags: ['MEV', 'Transaction Ordering', 'DeFi'],
      cwe: 'CWE-362',
      owasp: 'A01:2021',
      realWorldExamples: [
        { name: 'Bancor', year: 2020, loss: '$135K' },
        { name: 'Various DEX', year: 2023, loss: '$25M+' }
      ],
      technicalDetails: {
        mechanism: 'Attackers observe pending transactions and submit competing ones with higher gas',
        prerequisites: ['Public mempool visibility', 'Predictable transaction outcomes'],
        exploitCode: `// Attacker sees user's buy order
// Submits buy order with higher gas price
// Then submits sell order after user's buy executes`,
        mitigation: 'Commit-reveal schemes, private mempools, batch auctions'
      }
    },
    {
      id: 'oracle-manipulation',
      name: 'Oracle Price Manipulation',
      emoji: '🔮',
      severity: 'HIGH',
      description: 'Exploiting price oracle vulnerabilities to manipulate asset values',
      averageLoss: '$3.1M',
      frequency: 'Medium',
      tags: ['Oracle', 'Price Feeds', 'DeFi'],
      cwe: 'CWE-345',
      owasp: 'A08:2021',
      realWorldExamples: [
        { name: 'bZx Protocol', year: 2020, loss: '$8M' },
        { name: 'Harvest Finance', year: 2020, loss: '$24M' }
      ],
      technicalDetails: {
        mechanism: 'Manipulate oracle price feeds through flash loans or market manipulation',
        prerequisites: ['Reliance on single oracle', 'No price validation', 'Flash loan availability'],
        exploitCode: `// Flash loan large amount
// Manipulate DEX price
// Oracle reads manipulated price
// Exploit based on false price`,
        mitigation: 'Multiple oracles, TWAP, price deviation limits'
      }
    },
    {
      id: 'flash-loan-attack',
      name: 'Flash Loan Attack',
      emoji: '⚡',
      severity: 'HIGH',
      description: 'Exploiting protocols using uncollateralized flash loans',
      averageLoss: '$4.7M',
      frequency: 'High',
      tags: ['Flash Loans', 'DeFi', 'Arbitrage'],
      cwe: 'CWE-840',
      owasp: 'A06:2021',
      realWorldExamples: [
        { name: 'Cream Finance', year: 2021, loss: '$130M' },
        { name: 'PancakeBunny', year: 2021, loss: '$200M' }
      ],
      technicalDetails: {
        mechanism: 'Use flash loans to manipulate protocol state within single transaction',
        prerequisites: ['Flash loan availability', 'Protocol state dependencies', 'Arbitrage opportunities'],
        exploitCode: `// 1. Flash loan large amount
// 2. Manipulate protocol state
// 3. Extract value
// 4. Repay loan + fee
// 5. Keep profit`,
        mitigation: 'Reentrancy guards, state validation, rate limiting'
      }
    },
    {
      id: 'weak-randomness',
      name: 'Weak Randomness',
      emoji: '🎲',
      severity: 'MEDIUM',
      description: 'Predictable random number generation allowing outcome manipulation',
      averageLoss: '$500K',
      frequency: 'Medium',
      tags: ['Randomness', 'Gaming', 'Gambling'],
      cwe: 'CWE-338',
      owasp: 'A02:2021',
      realWorldExamples: [
        { name: 'SmartBillions', year: 2017, loss: '$400K' },
        { name: 'Various Games', year: 2022, loss: '$2M+' }
      ],
      technicalDetails: {
        mechanism: 'Using predictable sources like block.timestamp for randomness',
        prerequisites: ['Blockchain-based randomness', 'Predictable inputs'],
        exploitCode: `uint random = uint(keccak256(
    abi.encodePacked(block.timestamp, block.difficulty)
)) % 100; // Predictable!`,
        mitigation: 'Chainlink VRF, commit-reveal schemes, external randomness'
      }
    },
    {
      id: 'governance-attack',
      name: 'Governance Attack',
      emoji: '🗳️',
      severity: 'HIGH',
      description: 'Manipulation of decentralized governance mechanisms',
      averageLoss: '$8.1M',
      frequency: 'Low',
      tags: ['Governance', 'Voting', 'DAO'],
      cwe: 'CWE-863',
      owasp: 'A01:2021',
      realWorldExamples: [
        { name: 'Beanstalk', year: 2022, loss: '$182M' },
        { name: 'Tornado Cash', year: 2023, loss: '$42M' }
      ],
      technicalDetails: {
        mechanism: 'Flash loan governance tokens to pass malicious proposals',
        prerequisites: ['Token-based voting', 'Flash loan availability', 'Short voting periods'],
        exploitCode: `// 1. Flash loan governance tokens
// 2. Propose malicious change
// 3. Vote with borrowed tokens
// 4. Execute immediately
// 5. Extract funds`,
        mitigation: 'Voting delays, token lock periods, delegation limits'
      }
    }
  ], []);

  // Threat Intelligence Data
  const threatIntelligence = useMemo(() => ({
    trending: [
      {
        name: 'MEV Bot Attacks',
        emoji: '🤖',
        description: 'Automated front-running and sandwich attacks increasing 300%',
        impact: 'High',
        recentCases: '1,200+'
      },
      {
        name: 'Cross-Chain Bridge Exploits',
        emoji: '🌉',
        description: 'Bridge vulnerabilities targeting $500M+ in locked assets',
        impact: 'Critical',
        recentCases: '45'
      },
      {
        name: 'Governance Token Manipulation',
        emoji: '🏛️',
        description: 'Flash loan governance attacks on major DAOs',
        impact: 'High',
        recentCases: '12'
      }
    ],
    emerging: [
      {
        name: 'AI-Powered Contract Analysis',
        emoji: '🧠',
        description: 'Attackers using AI to find zero-day vulnerabilities',
        impact: 'Unknown',
        recentCases: '3'
      },
      {
        name: 'Social Engineering Attacks',
        emoji: '🎭',
        description: 'Targeting protocol maintainers and key holders',
        impact: 'High',
        recentCases: '8'
      }
    ],
    mitigated: [
      {
        name: 'Classic Reentrancy',
        emoji: '🔄',
        description: 'Well-understood with established mitigation patterns',
        impact: 'Reduced',
        recentCases: '15'
      },
      {
        name: 'Integer Overflow',
        emoji: '📊',
        description: 'Largely solved by Solidity 0.8+ automatic checks',
        impact: 'Low',
        recentCases: '5'
      }
    ]
  }), []);

  // Filter vulnerabilities based on search and severity
  const filteredVulnerabilities = useMemo(() => {
    return vulnerabilityDatabase.filter(vuln => {
      const matchesSearch = vuln.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vuln.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vuln.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSeverity = filterSeverity === 'ALL' || vuln.severity === filterSeverity;
      
      return matchesSearch && matchesSeverity;
    });
  }, [vulnerabilityDatabase, searchTerm, filterSeverity]);

  const handleVulnerabilitySelect = useCallback((vulnerability) => {
    setSelectedVulnerability(vulnerability);
    setActiveTab('analysis');
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 rounded-lg shadow-md">
      <NavigationMenu onNavigationClick={handleNavigation} currentPage={currentPage} />

      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
        🛡️ Smart Contract Vulnerability Platform
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Comprehensive vulnerability database with real-world examples, threat intelligence, and detailed technical analysis
      </p>

      {/* Tab Navigation */}
      <div className="mb-8 bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
              { id: 'database', name: '🗃️ Vulnerability Database', icon: '🗃️' },
              { id: 'analysis', name: '🔬 Detailed Analysis', icon: '🔬' },
              { id: 'intelligence', name: '🕵️ Threat Intelligence', icon: '🕵️' },
              { id: 'trends', name: '📈 Security Trends', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors`}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Vulnerability Database Tab */}
          {activeTab === 'database' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">🗃️ Vulnerability Database</h3>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Search vulnerabilities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                  <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="ALL">All Severity</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVulnerabilities.map((vulnerability) => (
                  <VulnerabilityCard
                    key={vulnerability.id}
                    vulnerability={vulnerability}
                    onSelect={handleVulnerabilitySelect}
                    isSelected={selectedVulnerability?.id === vulnerability.id}
                  />
                ))}
              </div>

              {filteredVulnerabilities.length === 0 && (
                <div className="text-center p-8 bg-gray-100 rounded-lg">
                  <p className="text-gray-600">No vulnerabilities match your search criteria.</p>
                </div>
              )}
            </div>
          )}

          {/* Detailed Analysis Tab */}
          {activeTab === 'analysis' && (
            <div>
              <h3 className="text-xl font-semibold mb-6">🔬 Detailed Vulnerability Analysis</h3>
              
              {selectedVulnerability ? (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg border border-orange-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-4xl mb-2">{selectedVulnerability.emoji}</div>
                        <h4 className="text-2xl font-bold text-gray-800">{selectedVulnerability.name}</h4>
                        <p className="text-gray-700 mt-2">{selectedVulnerability.description}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-4 py-2 rounded-lg text-white font-bold ${
                          selectedVulnerability.severity === 'CRITICAL' ? 'bg-red-600' :
                          selectedVulnerability.severity === 'HIGH' ? 'bg-red-500' :
                          selectedVulnerability.severity === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}>
                          {selectedVulnerability.severity}
                        </span>
                        <div className="text-sm text-gray-600 mt-2">
                          CWE: {selectedVulnerability.cwe}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600">{selectedVulnerability.averageLoss}</div>
                        <div className="text-sm text-gray-600">Average Loss</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">{selectedVulnerability.frequency}</div>
                        <div className="text-sm text-gray-600">Frequency</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{selectedVulnerability.realWorldExamples.length}</div>
                        <div className="text-sm text-gray-600">Known Cases</div>
                      </div>
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div className="bg-white p-6 rounded-lg border border-gray-300">
                    <h5 className="text-lg font-semibold mb-4 text-gray-800">🔧 Technical Details</h5>
                    
                    <div className="space-y-4">
                      <div>
                        <h6 className="font-semibold text-gray-700">Attack Mechanism:</h6>
                        <p className="text-gray-600">{selectedVulnerability.technicalDetails.mechanism}</p>
                      </div>
                      
                      <div>
                        <h6 className="font-semibold text-gray-700">Prerequisites:</h6>
                        <ul className="list-disc list-inside text-gray-600 ml-4">
                          {selectedVulnerability.technicalDetails.prerequisites.map((prereq, index) => (
                            <li key={index}>{prereq}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h6 className="font-semibold text-gray-700">Example Vulnerable Code:</h6>
                        <div className="bg-gray-900 p-4 rounded text-green-400 font-mono text-sm overflow-x-auto">
                          <pre>{selectedVulnerability.technicalDetails.exploitCode}</pre>
                        </div>
                      </div>
                      
                      <div>
                        <h6 className="font-semibold text-gray-700">Mitigation:</h6>
                        <p className="text-gray-600">{selectedVulnerability.technicalDetails.mitigation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Real-World Examples */}
                  <div className="bg-white p-6 rounded-lg border border-gray-300">
                    <h5 className="text-lg font-semibold mb-4 text-gray-800">🌍 Real-World Examples</h5>
                    
                    <div className="space-y-4">
                      {selectedVulnerability.realWorldExamples.map((example, index) => (
                        <div key={index} className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <h6 className="font-bold text-red-800">{example.name}</h6>
                              <p className="text-red-700 text-sm">Year: {example.year}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-red-600">{example.loss}</div>
                              <div className="text-xs text-red-500">Total Loss</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-100 rounded-lg">
                  <p className="text-gray-600">Select a vulnerability from the database to see detailed analysis.</p>
                </div>
              )}
            </div>
          )}

          {/* Threat Intelligence Tab */}
          {activeTab === 'intelligence' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">🕵️ Threat Intelligence</h3>
                <div className="flex space-x-2">
                  {['trending', 'emerging', 'mitigated'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setThreatIntelMode(mode)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        threatIntelMode === mode 
                          ? 'bg-orange-600 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {threatIntelligence[threatIntelMode].map((threat, index) => (
                  <ThreatIntelCard key={index} threat={threat} />
                ))}
              </div>
            </div>
          )}

          {/* Security Trends Tab */}
          {activeTab === 'trends' && (
            <div>
              <h3 className="text-xl font-semibold mb-6">📈 Security Trends & Statistics</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg border border-gray-300">
                  <h4 className="text-lg font-semibold mb-4">💰 Financial Impact (2024)</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Losses:</span>
                      <span className="font-bold text-red-600">$2.3B+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Number of Incidents:</span>
                      <span className="font-bold text-orange-600">324</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Loss per Incident:</span>
                      <span className="font-bold text-yellow-600">$7.1M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Largest Single Loss:</span>
                      <span className="font-bold text-red-600">$200M</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-300">
                  <h4 className="text-lg font-semibold mb-4">🎯 Top Attack Vectors</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Flash Loan Attacks:</span>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">35%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bridge Exploits:</span>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">22%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Oracle Manipulation:</span>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">18%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reentrancy:</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">12%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Access Control:</span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">13%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-300">
                <h4 className="text-lg font-semibold mb-4 text-blue-800">🔮 2025 Security Predictions</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-blue-700 mb-2">Emerging Threats:</h5>
                    <ul className="space-y-1 text-blue-600 text-sm">
                      <li>• AI-assisted vulnerability discovery</li>
                      <li>• Cross-chain bridge complexity attacks</li>
                      <li>• Layer 2 specific vulnerabilities</li>
                      <li>• Social engineering of key holders</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-purple-700 mb-2">Defensive Evolution:</h5>
                    <ul className="space-y-1 text-purple-600 text-sm">
                      <li>• Formal verification adoption</li>
                      <li>• Real-time monitoring systems</li>
                      <li>• Insurance protocol integration</li>
                      <li>• Automated incident response</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Platform Features */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          🛡️ Platform Features
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-xl font-medium mb-3 text-orange-700">🗃️ Comprehensive Database</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">📚</span>
                <span>50+ documented vulnerabilities</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">🌍</span>
                <span>Real-world attack examples</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">🔧</span>
                <span>Technical implementation details</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-3 text-blue-700">🕵️ Threat Intelligence</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">📈</span>
                <span>Real-time threat monitoring</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">🎯</span>
                <span>Emerging attack vector analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">📊</span>
                <span>Statistical trend analysis</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-3 text-purple-700">🔬 Deep Analysis</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">⚙️</span>
                <span>Attack mechanism breakdown</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">🛡️</span>
                <span>Mitigation strategies</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">📋</span>
                <span>Code examples and fixes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartContractVulnerabilityPlatform;
