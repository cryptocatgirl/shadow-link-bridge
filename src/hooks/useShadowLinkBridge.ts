import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { contractAddresses } from '@/lib/wallet';
import { useToast } from '@/hooks/use-toast';

// Contract ABI (simplified for demonstration)
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
    "inputs": [],
    "name": "getGlobalStats",
    "outputs": [
      {"name": "totalVolumeValue", "type": "uint8"},
      {"name": "totalTransactionsValue", "type": "uint8"}
    ],
    "stateMutability": "view",
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

  // Initiate bridge transaction
  const initiateBridge = async (
    amount: string,
    sourceChainId: string,
    targetChainId: string,
    encryptedData: string,
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
      // In a real implementation, you would encrypt the data using FHE
      // For now, we'll use placeholder encrypted data
      const encryptedAmount = "0x" + Buffer.from(amount).toString('hex');
      const encryptedSourceChain = "0x" + Buffer.from(sourceChainId).toString('hex');
      const encryptedTargetChain = "0x" + Buffer.from(targetChainId).toString('hex');
      const inputProof = "0x" + Buffer.from("proof").toString('hex');

      await writeContract({
        address: contractAddresses.sepolia as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'initiateBridge',
        args: [
          encryptedAmount as `0x${string}`,
          encryptedSourceChain as `0x${string}`,
          encryptedTargetChain as `0x${string}`,
          encryptedData,
          inputProof as `0x${string}`
        ],
        value: parseEther(bridgeFee),
      });

      toast({
        title: "Bridge Initiated",
        description: "Your bridge transaction has been submitted",
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
    checkTransactionStatus,
    refetchUserProfile,
    refetchGlobalStats,
    
    // Utils
    isConnected: !!address,
    userAddress: address,
  };
}
