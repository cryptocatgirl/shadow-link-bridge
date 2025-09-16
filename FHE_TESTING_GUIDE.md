# FHE Encryption Testing Guide

## Overview
This guide explains how to test the Fully Homomorphic Encryption (FHE) functionality for private data on-chain in the Shadow Link Bridge.

## Prerequisites
- MetaMask or compatible wallet connected to Sepolia testnet
- Sepolia ETH for gas fees
- Deployed Shadow Link Bridge contract on Sepolia

## FHE Features Implemented

### 1. Encrypted Bridge Transactions
- **Amount encryption**: Bridge amounts are encrypted using FHE
- **Address encryption**: Recipient addresses are encrypted
- **Metadata encryption**: Timestamps and stealth mode flags are encrypted
- **Proof generation**: Cryptographic proofs for encrypted data

### 2. Encrypted User Data
- **Reputation encryption**: User reputation scores are encrypted
- **Transaction history**: Bridge transaction counts are encrypted
- **Verification status**: User verification status is encrypted

### 3. Privacy Features
- **Stealth mode**: Hide sensitive data in UI while maintaining functionality
- **Encrypted storage**: All sensitive data stored encrypted on-chain
- **Zero-knowledge proofs**: Verify data without revealing it

## Testing Steps

### Step 1: Connect Wallet
1. Open the Shadow Link Bridge application
2. Click "Connect Wallet" button
3. Select your wallet (MetaMask, etc.)
4. Approve connection to Sepolia network

### Step 2: Verify FHE Status
1. Check the FHE Status card at the top of the bridge interface
2. Verify "FHE Encryption: Active" badge is displayed
3. Confirm encryption type shows "FHE (Fully Homomorphic Encryption)"
4. Verify key strength shows "256-bit"

### Step 3: Test Stealth Mode
1. Toggle the stealth mode button in the FHE Status card
2. When stealth mode is ON:
   - Amount field shows dots (••••••••) instead of actual values
   - Address field shows dots (••••••••) instead of actual addresses
   - All sensitive data is visually hidden
3. When stealth mode is OFF:
   - All values are displayed normally
   - Data is still encrypted on-chain regardless of UI display

### Step 4: Initiate Encrypted Bridge Transaction
1. Fill in the bridge form:
   - **Amount**: Enter any amount (e.g., "1.5")
   - **To Address**: Enter a valid Ethereum address
   - **Source Chain**: Select "Ethereum Sepolia"
   - **Target Chain**: Select "Ethereum Sepolia"
2. Ensure stealth mode is enabled for maximum privacy
3. Click "Initiate Bridge" button
4. Approve the transaction in your wallet
5. Wait for transaction confirmation

### Step 5: Verify On-Chain Encryption
1. Check the transaction on Sepolia Etherscan
2. Verify that the transaction data contains encrypted values:
   - Amount should be encrypted (not readable)
   - Address should be encrypted (not readable)
   - Additional data should be encrypted
3. Confirm that only the contract can decrypt the data

### Step 6: Test User Profile Encryption
1. After completing a bridge transaction
2. Check your user profile data:
   - Reputation score should be encrypted
   - Total bridged amount should be encrypted
   - Successful bridges count should be encrypted
   - Verification status should be encrypted

### Step 7: Test Bridge Completion (Verifier Role)
1. If you have verifier permissions:
2. Use the `completeBridge` function with encrypted verification data
3. Verify that the completion process uses encrypted amounts
4. Confirm that proofs are generated for encrypted data

## Expected Behavior

### Encryption Status
- ✅ FHE encryption should always be active
- ✅ All sensitive data should be encrypted before on-chain storage
- ✅ UI should show encryption status clearly

### Stealth Mode
- ✅ When enabled: sensitive data hidden in UI
- ✅ When disabled: data visible in UI but still encrypted on-chain
- ✅ Toggle should work smoothly without affecting functionality

### Transaction Flow
- ✅ Bridge initiation should encrypt all sensitive data
- ✅ Transaction should be submitted with encrypted parameters
- ✅ On-chain data should be unreadable without decryption keys
- ✅ Proofs should be generated for all encrypted data

### Error Handling
- ✅ Invalid data should be rejected before encryption
- ✅ Failed transactions should not expose sensitive data
- ✅ Error messages should not contain sensitive information

## Troubleshooting

### Common Issues

1. **"Contract not deployed yet" error**
   - Solution: Deploy the Shadow Link Bridge contract to Sepolia first
   - Update the contract address in environment variables

2. **"Wallet not connected" error**
   - Solution: Ensure wallet is connected to Sepolia network
   - Check that the correct account is selected

3. **"Insufficient funds" error**
   - Solution: Ensure you have enough Sepolia ETH for gas fees
   - Bridge fee is 0.001 ETH by default

4. **Encryption not working**
   - Solution: Check browser console for FHE-related errors
   - Ensure all FHE dependencies are properly installed

### Debug Information
- Check browser console for FHE encryption logs
- Verify contract ABI includes all FHE functions
- Confirm environment variables are set correctly
- Test with small amounts first to verify functionality

## Security Notes

### Important Security Considerations
- This is a demonstration implementation using simulated FHE
- In production, use Zama's official FHEVM library
- Never use this demo code for real funds
- Always test thoroughly before mainnet deployment

### Production Requirements
- Use official FHEVM SDK for real FHE encryption
- Implement proper key management
- Add comprehensive audit trails
- Include formal verification of encryption

## Next Steps
1. Deploy contract to Sepolia testnet
2. Test all FHE functionality thoroughly
3. Implement real FHEVM integration
4. Add comprehensive error handling
5. Prepare for mainnet deployment

## Support
For issues or questions about FHE implementation:
- Check the console logs for detailed error information
- Verify all dependencies are correctly installed
- Ensure contract is properly deployed and configured
- Test with small amounts first to verify functionality
