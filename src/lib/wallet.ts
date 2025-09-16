import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

// Get projectId from environment variables
export const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '2ec9743d0d0cd7fb94dee1a7e6d33475';

// Create wagmi config
export const config = getDefaultConfig({
  appName: 'Shadow Link Bridge',
  projectId,
  chains: [sepolia],
  ssr: false, // If your dApp uses server side rendering (SSR)
});

// Chain configuration
export const supportedChains = [sepolia];

// RPC URLs
export const rpcUrls = {
  sepolia: import.meta.env.VITE_RPC_URL || 'https://1rpc.io/sepolia',
};

// Contract addresses (will be set after deployment)
export const contractAddresses = {
  sepolia: import.meta.env.VITE_CONTRACT_ADDRESS || '',
};

// Environment variables validation
export const requiredEnvVars = {
  VITE_WALLET_CONNECT_PROJECT_ID: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
  VITE_RPC_URL: import.meta.env.VITE_RPC_URL,
  VITE_CONTRACT_ADDRESS: import.meta.env.VITE_CONTRACT_ADDRESS,
};

// Validate environment variables
export const validateEnvVars = () => {
  const missing = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
  }
  
  return missing.length === 0;
};
