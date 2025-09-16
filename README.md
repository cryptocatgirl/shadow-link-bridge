# Shadow Link Bridge

A privacy-first cross-chain bridge built with FHE (Fully Homomorphic Encryption) technology, enabling secure asset transfers across blockchains while maintaining complete transaction privacy.

## 🔒 Privacy Features

- **FHE Encryption**: All transaction data is encrypted using Fully Homomorphic Encryption
- **Zero-Knowledge Proofs**: Verify transactions without revealing sensitive information
- **Stealth Mode**: Optional privacy mode that encrypts amounts and addresses
- **Cross-Chain Privacy**: Maintain privacy across different blockchain networks

## 🚀 Features

- **Multi-Chain Support**: Bridge assets between Ethereum, Polygon, and other supported chains
- **Real Wallet Integration**: Connect with MetaMask, WalletConnect, and other popular wallets
- **Encrypted Transactions**: All sensitive data remains encrypted until confirmation
- **User Reputation System**: Build trust through encrypted reputation scoring
- **Verification System**: Automated and manual verification for enhanced security

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Wallet Integration**: RainbowKit, Wagmi, Viem
- **Smart Contracts**: Solidity with FHE support
- **Encryption**: Zama's FHEVM for on-chain privacy
- **UI Components**: shadcn/ui with custom privacy-focused components

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/cryptocatgirl/shadow-link-bridge.git
cd shadow-link-bridge
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
# Edit .env.local with your configuration
```

4. Start the development server:
```bash
npm run dev
```

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Chain Configuration
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://1rpc.io/sepolia

# Wallet Connect Configuration
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id_here

# Contract Configuration
VITE_CONTRACT_ADDRESS=your_deployed_contract_address_here

# Infura Configuration (Optional)
VITE_INFURA_API_KEY=your_infura_api_key_here
```

### Required Configuration

- **Wallet Connect Project ID**: Get from [WalletConnect Cloud](https://cloud.walletconnect.com/)
- **Contract Address**: Deploy the smart contract and update the address
- **RPC URL**: Use a reliable RPC provider for the target chain

## 🔧 Smart Contract

The Shadow Link Bridge smart contract implements FHE encryption for:

- **Transaction Amounts**: Encrypted using `euint32` for privacy
- **Chain IDs**: Source and target chain identifiers are encrypted
- **User Reputation**: Encrypted reputation scoring system
- **Verification Status**: Encrypted verification flags

### Key Functions

- `initiateBridge()`: Start a new encrypted bridge transaction
- `completeBridge()`: Complete and verify a bridge transaction
- `getUserProfile()`: Retrieve encrypted user profile data
- `updateUserReputation()`: Update user reputation (verifier only)

## 🌐 Supported Networks

- **Ethereum Sepolia**: Testnet for development and testing
- **Polygon Mumbai**: Testnet for cross-chain testing
- **Additional chains**: Configurable through the admin interface

## 🔐 Security Features

- **FHE Encryption**: All sensitive data encrypted on-chain
- **Access Control**: Role-based permissions for different operations
- **Verification System**: Multi-layer verification for transactions
- **Privacy by Design**: No sensitive data exposed in plaintext

## 📱 Usage

1. **Connect Wallet**: Use the wallet connection interface to link your wallet
2. **Select Chains**: Choose source and target chains for your bridge
3. **Enter Details**: Input amount and recipient address (encrypted in stealth mode)
4. **Initiate Bridge**: Submit the transaction with encrypted data
5. **Monitor Progress**: Track your bridge transaction status
6. **Complete Transfer**: Receive assets on the target chain

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with automatic builds on push

### Manual Deployment

```bash
npm run build
# Deploy the dist/ folder to your hosting provider
```

## 🔍 Development

### Project Structure

```
shadow-link-bridge/
├── contracts/
│   └── ShadowLinkBridge.sol    # FHE smart contract
├── src/
│   ├── components/
│   │   ├── WalletProvider.tsx  # Wallet context provider
│   │   ├── WalletConnect.tsx   # Wallet connection component
│   │   └── BridgeForm.tsx      # Bridge transaction form
│   ├── hooks/
│   │   └── useShadowLinkBridge.ts # Contract interaction hook
│   ├── lib/
│   │   └── wallet.ts           # Wallet configuration
│   └── pages/
│       └── Index.tsx           # Main application page
├── public/
│   ├── favicon.ico             # Browser icons
│   ├── favicon.png
│   └── favicon.svg
└── README.md                   # This file
```

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Repository**: https://github.com/cryptocatgirl/shadow-link-bridge
- **Documentation**: See this README and inline code comments
- **Issues**: Use GitHub issues for bug reports and feature requests

## ⚠️ Disclaimer

This is experimental software. Use at your own risk. Always test thoroughly before using with real assets.

## 🆘 Support

For support and questions:
- Open an issue on GitHub
- Check the documentation
- Review the smart contract code

---

**Project Status**: ✅ Active Development  
**Last Updated**: January 2025  
**Maintainer**: cryptocatgirl