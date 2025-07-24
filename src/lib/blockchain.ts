import { ethers } from 'ethers';

// Extend Window interface for MetaMask
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Contract ABIs (simplified for key functions)
const GATE_TOKEN_ABI = [
  "function mint(address to, uint256 amount) external",
  "function burn(address from, uint256 amount) external", 
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function symbol() external view returns (string)",
  "function decimals() external view returns (uint8)",
  "event TokenMinted(address indexed to, uint256 amount, address indexed minter)",
  "event TokenBurned(address indexed from, uint256 amount, address indexed burner)",
  "event TransferExecuted(address indexed from, address indexed to, uint256 amount)"
];

const RULE_ENGINE_ABI = [
  "function createRule(string memory ruleType, string memory conditions, string memory action, string memory actionConfig) external returns (uint256)",
  "function getUserRules(address user) external view returns (uint256[])",
  "function getRule(uint256 ruleId) external view returns (tuple(uint256 id, address owner, string ruleType, string conditions, string action, string actionConfig, bool isActive, uint256 createdAt, uint256 lastExecuted))",
  "function deactivateRule(uint256 ruleId) external",
  "function evaluateRules(address user) external view returns (uint256[])",
  "function updateOracleData(string memory dataType, string memory value) external",
  "function getOracleData(string memory dataType) external view returns (tuple(string dataType, string value, uint256 timestamp, address oracle))",
  "event RuleCreated(uint256 indexed ruleId, address indexed owner, string ruleType)",
  "event RuleExecuted(uint256 indexed ruleId, address indexed owner, bool success, string reason)"
];

const CBDC_WALLET_ABI = [
  "function createWallet() external",
  "function sendToken(address to, address tokenContract, uint256 amount) external",
  "function mintToken(address to, address tokenContract, uint256 amount) external",
  "function burnToken(address from, address tokenContract, uint256 amount) external",
  "function getWalletBalance(address owner, address tokenContract) external view returns (uint256)",
  "function isWalletActive(address owner) external view returns (bool)",
  "function triggerRulesManually(address user) external",
  "event TokenTransferred(address indexed from, address indexed to, address indexed token, uint256 amount)",
  "event TokenMinted(address indexed to, address indexed token, uint256 amount)",
  "event TokenBurned(address indexed from, address indexed token, uint256 amount)",
  "event RuleTriggered(address indexed user, uint256 indexed ruleId, string action)"
];

export interface ContractAddresses {
  eINR: string;
  eUSD: string;
  eAED: string;
  ruleEngine: string;
  cbdcWallet: string;
}

export interface RuleData {
  ruleType: 'fx_rate' | 'time_based' | 'weather' | 'location';
  conditions: string; // JSON string
  action: 'transfer' | 'mint' | 'burn' | 'split_pay';
  actionConfig: string; // JSON string
}

export interface OracleData {
  dataType: string;
  value: string;
  timestamp: number;
  oracle: string;
}

export class BlockchainService {
  private provider: ethers.JsonRpcProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contracts: Partial<ContractAddresses> = {};

  // Kaleido/FireFly configuration
  private fireflyConfig = {
    baseUrl: process.env.REACT_APP_FIREFLY_URL || 'https://your-firefly-instance.com',
    namespace: process.env.REACT_APP_FIREFLY_NAMESPACE || 'default',
    apiKey: process.env.REACT_APP_FIREFLY_API_KEY || ''
  };

  constructor() {
    this.initializeProvider();
  }

  private async initializeProvider() {
    try {
      // For development - use local provider or testnet
      this.provider = new ethers.JsonRpcProvider(
        process.env.REACT_APP_RPC_URL || 'http://localhost:8545'
      );
      
      // Initialize contract addresses (these would be set after deployment)
      this.contracts = {
        eINR: process.env.REACT_APP_EINR_CONTRACT || '',
        eUSD: process.env.REACT_APP_EUSD_CONTRACT || '',
        eAED: process.env.REACT_APP_EAED_CONTRACT || '',
        ruleEngine: process.env.REACT_APP_RULE_ENGINE_CONTRACT || '',
        cbdcWallet: process.env.REACT_APP_CBDC_WALLET_CONTRACT || ''
      };
    } catch (error) {
      console.error('Failed to initialize blockchain provider:', error);
    }
  }

  async connectWallet() {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.signer = await provider.getSigner();
        return await this.signer.getAddress();
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        throw error;
      }
    }
    throw new Error('MetaMask not found');
  }

  private getTokenContract(tokenSymbol: 'eINR' | 'eUSD' | 'eAED') {
    if (!this.signer || !this.contracts[tokenSymbol]) {
      throw new Error(`Contract not initialized for ${tokenSymbol}`);
    }
    return new ethers.Contract(this.contracts[tokenSymbol]!, GATE_TOKEN_ABI, this.signer);
  }

  private getRuleEngineContract() {
    if (!this.signer || !this.contracts.ruleEngine) {
      throw new Error('Rule engine contract not initialized');
    }
    return new ethers.Contract(this.contracts.ruleEngine, RULE_ENGINE_ABI, this.signer);
  }

  private getCBDCWalletContract() {
    if (!this.signer || !this.contracts.cbdcWallet) {
      throw new Error('CBDC wallet contract not initialized');
    }
    return new ethers.Contract(this.contracts.cbdcWallet, CBDC_WALLET_ABI, this.signer);
  }

  // Token operations
  async mintToken(tokenSymbol: 'eINR' | 'eUSD' | 'eAED', to: string, amount: string) {
    try {
      const walletContract = this.getCBDCWalletContract();
      const tokenContract = this.getTokenContract(tokenSymbol);
      
      const amountWei = ethers.parseUnits(amount, 18);
      const tx = await walletContract.mintToken(to, tokenContract.target, amountWei);
      
      const receipt = await tx.wait();
      return {
        success: true,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Mint token failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async burnToken(tokenSymbol: 'eINR' | 'eUSD' | 'eAED', from: string, amount: string) {
    try {
      const walletContract = this.getCBDCWalletContract();
      const tokenContract = this.getTokenContract(tokenSymbol);
      
      const amountWei = ethers.parseUnits(amount, 18);
      const tx = await walletContract.burnToken(from, tokenContract.target, amountWei);
      
      const receipt = await tx.wait();
      return {
        success: true,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Burn token failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async transferToken(tokenSymbol: 'eINR' | 'eUSD' | 'eAED', to: string, amount: string) {
    try {
      const walletContract = this.getCBDCWalletContract();
      const tokenContract = this.getTokenContract(tokenSymbol);
      
      const amountWei = ethers.parseUnits(amount, 18);
      const tx = await walletContract.sendToken(to, tokenContract.target, amountWei);
      
      const receipt = await tx.wait();
      return {
        success: true,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Transfer token failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getTokenBalance(tokenSymbol: 'eINR' | 'eUSD' | 'eAED', address: string) {
    try {
      const tokenContract = this.getTokenContract(tokenSymbol);
      const balance = await tokenContract.balanceOf(address);
      return ethers.formatUnits(balance, 18);
    } catch (error) {
      console.error('Get balance failed:', error);
      return '0';
    }
  }

  // Rule operations
  async createRule(ruleData: RuleData) {
    try {
      const ruleEngine = this.getRuleEngineContract();
      
      const tx = await ruleEngine.createRule(
        ruleData.ruleType,
        ruleData.conditions,
        ruleData.action,
        ruleData.actionConfig
      );
      
      const receipt = await tx.wait();
      
      // Extract rule ID from events
      const event = receipt.logs.find((log: any) => 
        log.fragment && log.fragment.name === 'RuleCreated'
      );
      
      const ruleId = event ? event.args[0] : null;
      
      return {
        success: true,
        ruleId: ruleId ? ruleId.toString() : null,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('Create rule failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getUserRules(userAddress: string) {
    try {
      const ruleEngine = this.getRuleEngineContract();
      const ruleIds = await ruleEngine.getUserRules(userAddress);
      
      const rules = [];
      for (const ruleId of ruleIds) {
        const rule = await ruleEngine.getRule(ruleId);
        rules.push({
          id: rule.id.toString(),
          owner: rule.owner,
          ruleType: rule.ruleType,
          conditions: rule.conditions,
          action: rule.action,
          actionConfig: rule.actionConfig,
          isActive: rule.isActive,
          createdAt: Number(rule.createdAt),
          lastExecuted: Number(rule.lastExecuted)
        });
      }
      
      return { success: true, rules };
    } catch (error) {
      console.error('Get user rules failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        rules: []
      };
    }
  }

  async evaluateRules(userAddress: string) {
    try {
      const ruleEngine = this.getRuleEngineContract();
      const eligibleRuleIds = await ruleEngine.evaluateRules(userAddress);
      
      return {
        success: true,
        eligibleRuleIds: eligibleRuleIds.map((id: any) => id.toString())
      };
    } catch (error) {
      console.error('Evaluate rules failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        eligibleRuleIds: []
      };
    }
  }

  async updateOracleData(dataType: string, value: string) {
    try {
      const ruleEngine = this.getRuleEngineContract();
      const tx = await ruleEngine.updateOracleData(dataType, value);
      
      const receipt = await tx.wait();
      return {
        success: true,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('Update oracle data failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getOracleData(dataType: string): Promise<OracleData | null> {
    try {
      const ruleEngine = this.getRuleEngineContract();
      const data = await ruleEngine.getOracleData(dataType);
      
      return {
        dataType: data.dataType,
        value: data.value,
        timestamp: Number(data.timestamp),
        oracle: data.oracle
      };
    } catch (error) {
      console.error('Get oracle data failed:', error);
      return null;
    }
  }

  // Wallet operations
  async createWallet() {
    try {
      const walletContract = this.getCBDCWalletContract();
      const tx = await walletContract.createWallet();
      
      const receipt = await tx.wait();
      return {
        success: true,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('Create wallet failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async isWalletActive(address: string) {
    try {
      const walletContract = this.getCBDCWalletContract();
      return await walletContract.isWalletActive(address);
    } catch (error) {
      console.error('Check wallet active failed:', error);
      return false;
    }
  }

  // Utility methods
  setContractAddresses(addresses: Partial<ContractAddresses>) {
    this.contracts = { ...this.contracts, ...addresses };
  }

  getContractAddresses() {
    return this.contracts;
  }

  isInitialized() {
    return !!this.signer && Object.values(this.contracts).some(addr => !!addr);
  }
}

// Singleton instance
export const blockchainService = new BlockchainService();