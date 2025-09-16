// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract ShadowLinkBridge is SepoliaConfig {
    using FHE for *;
    
    struct BridgeTransaction {
        euint32 transactionId;
        euint32 amount;
        euint32 sourceChainId;
        euint32 targetChainId;
        ebool isCompleted;
        ebool isVerified;
        address user;
        uint256 timestamp;
        string encryptedData;
    }
    
    struct ChainConfig {
        euint32 chainId;
        ebool isActive;
        string name;
        string rpcUrl;
        address bridgeContract;
    }
    
    struct UserProfile {
        euint32 reputation;
        euint32 totalBridged;
        euint32 successfulBridges;
        ebool isVerified;
        address user;
    }
    
    mapping(uint256 => BridgeTransaction) public transactions;
    mapping(uint256 => ChainConfig) public supportedChains;
    mapping(address => UserProfile) public userProfiles;
    mapping(address => euint32) public userBalances;
    
    uint256 public transactionCounter;
    uint256 public chainCounter;
    
    address public owner;
    address public verifier;
    euint32 public totalVolume;
    euint32 public totalTransactions;
    
    event BridgeInitiated(uint256 indexed transactionId, address indexed user, uint32 sourceChain, uint32 targetChain);
    event BridgeCompleted(uint256 indexed transactionId, address indexed user, uint32 amount);
    event ChainAdded(uint256 indexed chainId, string name, address bridgeContract);
    event UserVerified(address indexed user, bool isVerified);
    event ReputationUpdated(address indexed user, uint32 reputation);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
        totalVolume = FHE.asEuint32(0);
        totalTransactions = FHE.asEuint32(0);
    }
    
    function initiateBridge(
        externalEuint32 amount,
        externalEuint32 sourceChainId,
        externalEuint32 targetChainId,
        string memory encryptedData,
        bytes calldata inputProof
    ) public payable returns (uint256) {
        require(msg.value > 0, "Bridge fee required");
        
        uint256 transactionId = transactionCounter++;
        
        // Convert external encrypted values to internal
        euint32 internalAmount = FHE.fromExternal(amount, inputProof);
        euint32 internalSourceChain = FHE.fromExternal(sourceChainId, inputProof);
        euint32 internalTargetChain = FHE.fromExternal(targetChainId, inputProof);
        
        transactions[transactionId] = BridgeTransaction({
            transactionId: FHE.asEuint32(0), // Will be set properly later
            amount: internalAmount,
            sourceChainId: internalSourceChain,
            targetChainId: internalTargetChain,
            isCompleted: FHE.asEbool(false),
            isVerified: FHE.asEbool(false),
            user: msg.sender,
            timestamp: block.timestamp,
            encryptedData: encryptedData
        });
        
        // Update user profile
        if (userProfiles[msg.sender].user == address(0)) {
            userProfiles[msg.sender] = UserProfile({
                reputation: FHE.asEuint32(100), // Initial reputation
                totalBridged: internalAmount,
                successfulBridges: FHE.asEuint32(0),
                isVerified: FHE.asEbool(false),
                user: msg.sender
            });
        } else {
            userProfiles[msg.sender].totalBridged = FHE.add(userProfiles[msg.sender].totalBridged, internalAmount);
        }
        
        // Update global stats
        totalVolume = FHE.add(totalVolume, internalAmount);
        totalTransactions = FHE.add(totalTransactions, FHE.asEuint32(1));
        
        emit BridgeInitiated(transactionId, msg.sender, 0, 0); // Values will be decrypted off-chain
        return transactionId;
    }
    
    function completeBridge(
        uint256 transactionId,
        externalEuint32 verificationAmount,
        bytes calldata inputProof
    ) public {
        require(msg.sender == verifier, "Only verifier can complete bridge");
        require(transactions[transactionId].user != address(0), "Transaction does not exist");
        
        euint32 internalVerificationAmount = FHE.fromExternal(verificationAmount, inputProof);
        
        // Mark transaction as completed and verified
        transactions[transactionId].isCompleted = FHE.asEbool(true);
        transactions[transactionId].isVerified = FHE.asEbool(true);
        
        // Update user successful bridges
        userProfiles[transactions[transactionId].user].successfulBridges = 
            FHE.add(userProfiles[transactions[transactionId].user].successfulBridges, FHE.asEuint32(1));
        
        // Increase user reputation
        userProfiles[transactions[transactionId].user].reputation = 
            FHE.add(userProfiles[transactions[transactionId].user].reputation, FHE.asEuint32(10));
        
        emit BridgeCompleted(transactionId, transactions[transactionId].user, 0); // Amount will be decrypted off-chain
    }
    
    function addSupportedChain(
        string memory name,
        string memory rpcUrl,
        address bridgeContract
    ) public {
        require(msg.sender == owner, "Only owner can add chains");
        
        uint256 chainId = chainCounter++;
        
        supportedChains[chainId] = ChainConfig({
            chainId: FHE.asEuint32(0), // Will be set to actual chain ID
            isActive: FHE.asEbool(true),
            name: name,
            rpcUrl: rpcUrl,
            bridgeContract: bridgeContract
        });
        
        emit ChainAdded(chainId, name, bridgeContract);
    }
    
    function verifyUser(address user, ebool isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify users");
        require(user != address(0), "Invalid user address");
        
        if (userProfiles[user].user == address(0)) {
            userProfiles[user] = UserProfile({
                reputation: FHE.asEuint32(50), // Lower initial reputation for unverified
                totalBridged: FHE.asEuint32(0),
                successfulBridges: FHE.asEuint32(0),
                isVerified: isVerified,
                user: user
            });
        } else {
            userProfiles[user].isVerified = isVerified;
        }
        
        emit UserVerified(user, false); // FHE.decrypt(isVerified) - will be decrypted off-chain
    }
    
    function updateUserReputation(address user, euint32 reputation) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(user != address(0), "Invalid user address");
        
        if (userProfiles[user].user == address(0)) {
            userProfiles[user] = UserProfile({
                reputation: reputation,
                totalBridged: FHE.asEuint32(0),
                successfulBridges: FHE.asEuint32(0),
                isVerified: FHE.asEbool(false),
                user: user
            });
        } else {
            userProfiles[user].reputation = reputation;
        }
        
        emit ReputationUpdated(user, 0); // FHE.decrypt(reputation) - will be decrypted off-chain
    }
    
    function getTransactionInfo(uint256 transactionId) public view returns (
        uint8 amount,
        uint8 sourceChainId,
        uint8 targetChainId,
        bool isCompleted,
        bool isVerified,
        address user,
        uint256 timestamp,
        string memory encryptedData
    ) {
        BridgeTransaction storage transaction = transactions[transactionId];
        return (
            0, // FHE.decrypt(transaction.amount) - will be decrypted off-chain
            0, // FHE.decrypt(transaction.sourceChainId) - will be decrypted off-chain
            0, // FHE.decrypt(transaction.targetChainId) - will be decrypted off-chain
            false, // FHE.decrypt(transaction.isCompleted) - will be decrypted off-chain
            false, // FHE.decrypt(transaction.isVerified) - will be decrypted off-chain
            transaction.user,
            transaction.timestamp,
            transaction.encryptedData
        );
    }
    
    function getUserProfile(address user) public view returns (
        uint8 reputation,
        uint8 totalBridged,
        uint8 successfulBridges,
        bool isVerified
    ) {
        UserProfile storage profile = userProfiles[user];
        return (
            0, // FHE.decrypt(profile.reputation) - will be decrypted off-chain
            0, // FHE.decrypt(profile.totalBridged) - will be decrypted off-chain
            0, // FHE.decrypt(profile.successfulBridges) - will be decrypted off-chain
            false // FHE.decrypt(profile.isVerified) - will be decrypted off-chain
        );
    }
    
    function getChainConfig(uint256 chainId) public view returns (
        uint8 chainIdValue,
        bool isActive,
        string memory name,
        string memory rpcUrl,
        address bridgeContract
    ) {
        ChainConfig storage config = supportedChains[chainId];
        return (
            0, // FHE.decrypt(config.chainId) - will be decrypted off-chain
            false, // FHE.decrypt(config.isActive) - will be decrypted off-chain
            config.name,
            config.rpcUrl,
            config.bridgeContract
        );
    }
    
    function getGlobalStats() public view returns (
        uint8 totalVolumeValue,
        uint8 totalTransactionsValue
    ) {
        return (
            0, // FHE.decrypt(totalVolume) - will be decrypted off-chain
            0 // FHE.decrypt(totalTransactions) - will be decrypted off-chain
        );
    }
    
    function withdrawFees() public {
        require(msg.sender == owner, "Only owner can withdraw fees");
        payable(owner).transfer(address(this).balance);
    }
    
    function updateVerifier(address newVerifier) public {
        require(msg.sender == owner, "Only owner can update verifier");
        require(newVerifier != address(0), "Invalid verifier address");
        verifier = newVerifier;
    }
}
