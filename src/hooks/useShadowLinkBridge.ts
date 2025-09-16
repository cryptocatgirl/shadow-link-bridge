import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { contractAddresses } from '@/lib/wallet';
import { useToast } from '@/hooks/use-toast';
import { bridgeFHE, fheUtils } from '@/lib/fhe-utils';

// Contract ABI for Shadow Link Bridge with FHE support
const CONTRACT_ABI = [
  {
    "inputs": [
      {"name": "amount", "type": "bytes"},
      {"name": "sourceChainId", "type": "bytes"},
      {"name": "targetChainId", "type": "bytes"},
      {"name": "encryptedData", "type": "string"},
      {"name": "inputProof", "type": "bytes"}
    ],
    "name": "initiateBridge",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "transactionId", "type": "uint256"},
      {"name": "verificationAmount", "type": "bytes"},
      {"name": "inputProof", "type": "bytes"}
    ],
    "name": "completeBridge",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "name", "type": "string"},
      {"name": "rpcUrl", "type": "string"},
      {"name": "bridgeContract", "type": "address"}
    ],
    "name": "addSupportedChain",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "user", "type": "address"},
      {"name": "isVerified", "type": "bytes"}
    ],
    "name": "verifyUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "user", "type": "address"},
      {"name": "reputation", "type": "bytes"}
    ],
    "name": "updateUserReputation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "transactionId", "type": "uint256"}],
    "name": "getTransactionInfo",
    "outputs": [
      {"name": "amount", "type": "uint8"},
      {"name": "sourceChainId", "type": "uint8"},
      {"name": "targetChainId", "type": "uint8"},
      {"name": "isCompleted", "type": "bool"},
      {"name": "isVerified", "type": "bool"},
      {"name": "user", "type": "address"},
      {"name": "timestamp", "type": "uint256"},
      {"name": "encryptedData", "type": "string"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "user", "type": "address"}],
    "name": "getUserProfile",
    "outputs": [
      {"name": "reputation", "type": "uint8"},
      {"name": "totalBridged", "type": "uint8"},
      {"name": "successfulBridges", "type": "uint8"},
      {"name": "isVerified", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "chainId", "type": "uint256"}],
    "name": "getChainConfig",
    "outputs": [
      {"name": "chainIdValue", "type": "uint8"},
      {"name": "isActive", "type": "bool"},
      {"name": "name", "type": "string"},
      {"name": "rpcUrl", "type": "string"},
      {"name": "bridgeContract", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getGlobalStats",
    "outputs": [
      {"name": "totalVolumeValue", "type": "uint8"},
      {"name": "totalTransactionsValue", "type": "uint8"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawFees",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "newVerifier", "type": "address"}],
    "name": "updateVerifier",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export function useShadowLinkBridge() {
  const { address } = useAccount();
  const { toast } = useToast();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Read user profile
  const { data: userProfile, refetch: refetchUserProfile } = useReadContract({
    address: contractAddresses.sepolia as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getUserProfile',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read global stats
  const { data: globalStats, refetch: refetchGlobalStats } = useReadContract({
    address: contractAddresses.sepolia as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getGlobalStats',
    query: {
      enabled: !!contractAddresses.sepolia,
    },
  });

  // Read transaction info
  const getTransactionInfo = (transactionId: number) => {
    return useReadContract({
      address: contractAddresses.sepolia as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'getTransactionInfo',
      args: [BigInt(transactionId)],
      query: {
        enabled: !!contractAddresses.sepolia && transactionId >= 0,
      },
    });
  };

  // Initiate bridge transaction with FHE encryption
  const initiateBridge = async (
    amount: string,
    sourceChainId: string,
    targetChainId: string,
    toAddress: string,
    stealthMode: boolean = true,
    bridgeFee: string = "0.001" // Default bridge fee in ETH
  ) => {
    if (!address) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!contractAddresses.sepolia) {
      toast({
        title: "Error",
        description: "Contract not deployed yet",
        variant: "destructive",
      });
      return;
    }

    try {
      // Encrypt bridge data using FHE
      const bridgeData = {
        amount: parseFloat(amount),
        sourceChainId: parseInt(sourceChainId),
        targetChainId: parseInt(targetChainId),
        toAddress,
        timestamp: Date.now(),
        stealthMode,
      };

      const encryptedData = bridgeFHE.encryptBridgeData(bridgeData);

      await writeContract({
        address: contractAddresses.sepolia as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'initiateBridge',
        args: [
          encryptedData.encryptedAmount as `0x${string}`,
          encryptedData.encryptedSourceChain as `0x${string}`,
          encryptedData.encryptedTargetChain as `0x${string}`,
          encryptedData.encryptedData,
          encryptedData.inputProof as `0x${string}`
        ],
        value: parseEther(bridgeFee),
      });

      toast({
        title: "Bridge Initiated",
        description: stealthMode 
          ? "Your encrypted bridge transaction has been submitted privately"
          : "Your bridge transaction has been submitted",
      });
    } catch (err) {
      console.error('Bridge initiation failed:', err);
      toast({
        title: "Bridge Failed",
        description: "Failed to initiate bridge transaction",
        variant: "destructive",
      });
    }
  };

  // Check transaction status
  const checkTransactionStatus = (transactionId: number) => {
    const { data: transactionInfo, isLoading, error } = getTransactionInfo(transactionId);
    
    return {
      transactionInfo,
      isLoading,
      error,
      refetch: () => getTransactionInfo(transactionId).refetch(),
    };
  };

  // Complete bridge transaction (verifier only)
  const completeBridge = async (
    transactionId: number,
    verificationAmount: number
  ) => {
    if (!address) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      const encryptedVerificationAmount = fheUtils.numberToEncryptedBytes(verificationAmount);
      const inputProof = fheUtils.createProof({ transactionId, verificationAmount });

      await writeContract({
        address: contractAddresses.sepolia as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'completeBridge',
        args: [
          BigInt(transactionId),
          encryptedVerificationAmount,
          inputProof
        ],
      });

      toast({
        title: "Bridge Completed",
        description: "Bridge transaction has been completed and verified",
      });
    } catch (err) {
      console.error('Bridge completion failed:', err);
      toast({
        title: "Bridge Completion Failed",
        description: "Failed to complete bridge transaction",
        variant: "destructive",
      });
    }
  };

  // Update user reputation (verifier only)
  const updateUserReputation = async (
    userAddress: string,
    reputation: number
  ) => {
    if (!address) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      const encryptedReputation = fheUtils.numberToEncryptedBytes(reputation);
      const inputProof = fheUtils.createProof({ userAddress, reputation });

      await writeContract({
        address: contractAddresses.sepolia as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'updateUserReputation',
        args: [
          userAddress as `0x${string}`,
          encryptedReputation
        ],
      });

      toast({
        title: "Reputation Updated",
        description: "User reputation has been updated",
      });
    } catch (err) {
      console.error('Reputation update failed:', err);
      toast({
        title: "Reputation Update Failed",
        description: "Failed to update user reputation",
        variant: "destructive",
      });
    }
  };

  // Verify user (verifier only)
  const verifyUser = async (
    userAddress: string,
    isVerified: boolean
  ) => {
    if (!address) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      const encryptedIsVerified = fheUtils.booleanToEncryptedBytes(isVerified);
      const inputProof = fheUtils.createProof({ userAddress, isVerified });

      await writeContract({
        address: contractAddresses.sepolia as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'verifyUser',
        args: [
          userAddress as `0x${string}`,
          encryptedIsVerified
        ],
      });

      toast({
        title: "User Verified",
        description: `User has been ${isVerified ? 'verified' : 'unverified'}`,
      });
    } catch (err) {
      console.error('User verification failed:', err);
      toast({
        title: "Verification Failed",
        description: "Failed to verify user",
        variant: "destructive",
      });
    }
  };

  // Get chain configuration
  const getChainConfig = (chainId: number) => {
    return useReadContract({
      address: contractAddresses.sepolia as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'getChainConfig',
      args: [BigInt(chainId)],
      query: {
        enabled: !!contractAddresses.sepolia && chainId >= 0,
      },
    });
  };

  return {
    // State
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
    
    // Data
    userProfile,
    globalStats,
    
    // Functions
    initiateBridge,
    completeBridge,
    updateUserReputation,
    verifyUser,
    checkTransactionStatus,
    getChainConfig,
    refetchUserProfile,
    refetchGlobalStats,
    
    // Utils
    isConnected: !!address,
    userAddress: address,
    fheUtils,
  };
}
