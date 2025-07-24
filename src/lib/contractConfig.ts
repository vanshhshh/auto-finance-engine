export interface NetworkConfig {
  name: string;
  rpcUrl: string;
  chainId: number;
  currency: string;
  blockExplorer: string;
}

export interface ContractConfig {
  address: string;
  deployedBlock: number;
  abi: any[];
}

export const networks: Record<string, NetworkConfig> = {
  kaleido: {
    name: 'Kaleido',
    rpcUrl: process.env.REACT_APP_KALEIDO_RPC_URL || 'https://your-kaleido-instance.com',
    chainId: parseInt(process.env.REACT_APP_KALEIDO_CHAIN_ID || '101'),
    currency: 'ETH',
    blockExplorer: 'https://your-kaleido-explorer.com',
  },
  localhost: {
    name: 'Local Development',
    rpcUrl: 'http://localhost:8545',
    chainId: 1337,
    currency: 'ETH',
    blockExplorer: 'http://localhost:8545',
  },
};

export const contracts: Record<string, Record<string, ContractConfig>> = {
  kaleido: {
    eINR: {
      address: process.env.REACT_APP_KALEIDO_EINR_CONTRACT || '',
      deployedBlock: parseInt(process.env.REACT_APP_KALEIDO_EINR_BLOCK || '0'),
      abi: [], // Will be populated with actual ABI after deployment
    },
    eUSD: {
      address: process.env.REACT_APP_KALEIDO_EUSD_CONTRACT || '',
      deployedBlock: parseInt(process.env.REACT_APP_KALEIDO_EUSD_BLOCK || '0'),
      abi: [],
    },
    eAED: {
      address: process.env.REACT_APP_KALEIDO_EAED_CONTRACT || '',
      deployedBlock: parseInt(process.env.REACT_APP_KALEIDO_EAED_BLOCK || '0'),
      abi: [],
    },
    ruleEngine: {
      address: process.env.REACT_APP_KALEIDO_RULE_ENGINE_CONTRACT || '',
      deployedBlock: parseInt(process.env.REACT_APP_KALEIDO_RULE_ENGINE_BLOCK || '0'),
      abi: [],
    },
    cbdcWallet: {
      address: process.env.REACT_APP_KALEIDO_CBDC_WALLET_CONTRACT || '',
      deployedBlock: parseInt(process.env.REACT_APP_KALEIDO_CBDC_WALLET_BLOCK || '0'),
      abi: [],
    },
  },
  localhost: {
    eINR: {
      address: process.env.REACT_APP_LOCAL_EINR_CONTRACT || '',
      deployedBlock: 0,
      abi: [],
    },
    eUSD: {
      address: process.env.REACT_APP_LOCAL_EUSD_CONTRACT || '',
      deployedBlock: 0,
      abi: [],
    },
    eAED: {
      address: process.env.REACT_APP_LOCAL_EAED_CONTRACT || '',
      deployedBlock: 0,
      abi: [],
    },
    ruleEngine: {
      address: process.env.REACT_APP_LOCAL_RULE_ENGINE_CONTRACT || '',
      deployedBlock: 0,
      abi: [],
    },
    cbdcWallet: {
      address: process.env.REACT_APP_LOCAL_CBDC_WALLET_CONTRACT || '',
      deployedBlock: 0,
      abi: [],
    },
  },
};

export const getContractConfig = (network: string, contractName: string): ContractConfig | null => {
  return contracts[network]?.[contractName] || null;
};

export const getNetworkConfig = (network: string): NetworkConfig | null => {
  return networks[network] || null;
};

// FireFly/Kaleido specific configuration
export const fireflyConfig = {
  baseUrl: process.env.REACT_APP_FIREFLY_URL || 'https://your-firefly-instance.com',
  namespace: process.env.REACT_APP_FIREFLY_NAMESPACE || 'default',
  apiKey: process.env.REACT_APP_FIREFLY_API_KEY || '',
  endpoints: {
    contracts: '/api/v1/namespaces/{namespace}/contracts',
    contractApis: '/api/v1/namespaces/{namespace}/apis',
    tokens: '/api/v1/namespaces/{namespace}/tokens',
    transfers: '/api/v1/namespaces/{namespace}/tokens/transfers',
    broadcasts: '/api/v1/namespaces/{namespace}/messages/broadcast',
  },
};

// Oracle data sources configuration
export const oracleConfig = {
  fxRates: {
    provider: 'exchangerate-api', // or 'fixer', 'currencyapi'
    apiKey: process.env.REACT_APP_FX_API_KEY || '',
    baseUrl: 'https://api.exchangerate-api.com/v4/latest/',
    supportedPairs: ['INR/USD', 'AED/USD', 'USD/INR', 'USD/AED', 'INR/AED', 'AED/INR'],
  },
  weather: {
    provider: 'openweathermap',
    apiKey: process.env.REACT_APP_WEATHER_API_KEY || '',
    baseUrl: 'https://api.openweathermap.org/data/2.5/',
  },
  location: {
    provider: 'ipgeolocation',
    apiKey: process.env.REACT_APP_LOCATION_API_KEY || '',
    baseUrl: 'https://api.ipgeolocation.io/ipgeo',
  },
};

// Rule templates for common use cases
export const ruleTemplates = {
  fxRateThreshold: {
    ruleType: 'fx_rate' as const,
    description: 'Execute action when FX rate crosses threshold',
    conditionsTemplate: {
      pair: 'USD/INR',
      operator: '>',
      threshold: 80,
    },
    actionTemplate: {
      type: 'transfer',
      amount: '100',
      recipient: '',
    },
  },
  timeBasedPayment: {
    ruleType: 'time_based' as const,
    description: 'Execute payment at specific time',
    conditionsTemplate: {
      schedule: 'daily',
      time: '09:00',
      timezone: 'UTC',
    },
    actionTemplate: {
      type: 'transfer',
      amount: '50',
      recipient: '',
    },
  },
  weatherConditional: {
    ruleType: 'weather' as const,
    description: 'Execute action based on weather conditions',
    conditionsTemplate: {
      location: 'Delhi',
      condition: 'temperature',
      operator: '>',
      value: 35,
    },
    actionTemplate: {
      type: 'split_pay',
      amount: '1000',
      recipients: [],
    },
  },
  locationBased: {
    ruleType: 'location' as const,
    description: 'Execute action when user enters/exits location',
    conditionsTemplate: {
      type: 'geofence',
      latitude: 28.6139,
      longitude: 77.2090,
      radius: 1000, // meters
      action: 'enter', // or 'exit'
    },
    actionTemplate: {
      type: 'mint',
      amount: '10',
      token: 'eINR',
    },
  },
};

export default {
  networks,
  contracts,
  fireflyConfig,
  oracleConfig,
  ruleTemplates,
  getContractConfig,
  getNetworkConfig,
};