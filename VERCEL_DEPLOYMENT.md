# Vercel Deployment Guide for Shadow Link Bridge

This guide provides step-by-step instructions for deploying the Shadow Link Bridge application to Vercel.

## Prerequisites

- Vercel account (free tier available)
- GitHub repository with the Shadow Link Bridge code
- Environment variables configured

## Step-by-Step Deployment

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project" or "Import Project"

### 2. Import Repository

1. Select "Import Git Repository"
2. Choose `cryptocatgirl/shadow-link-bridge` from your repositories
3. Click "Import"

### 3. Configure Project Settings

1. **Project Name**: `shadow-link-bridge` (or your preferred name)
2. **Framework Preset**: Select "Vite"
3. **Root Directory**: Leave as default (`.`)
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Install Command**: `npm install`

### 4. Set Environment Variables

In the Vercel dashboard, go to "Environment Variables" and add the following:

#### Required Variables

```env
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://1rpc.io/sepolia
VITE_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
VITE_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
```

#### Optional Variables

```env
VITE_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE
```

### 5. Deploy

1. Click "Deploy" button
2. Wait for the build process to complete
3. Your application will be available at the provided Vercel URL

## Environment Variables Configuration

### Production Environment

Set these variables for production deployment:

```env
# Chain Configuration
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990

# Wallet Connect Configuration
VITE_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475

# Infura Configuration
VITE_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990

# Contract Configuration (Update after deployment)
VITE_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE
```

### Development Environment

For development builds, you can use the same variables or create separate ones:

```env
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://1rpc.io/sepolia
VITE_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
VITE_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
VITE_CONTRACT_ADDRESS=YOUR_DEV_CONTRACT_ADDRESS_HERE
```

## Custom Domain Setup

### 1. Add Custom Domain

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Click "Add Domain"
4. Enter your custom domain (e.g., `bridge.yourdomain.com`)

### 2. Configure DNS

Add the following DNS records to your domain provider:

```
Type: CNAME
Name: bridge (or your subdomain)
Value: cname.vercel-dns.com
```

### 3. SSL Certificate

Vercel automatically provides SSL certificates for custom domains.

## Build Configuration

### Vercel Configuration File

Create a `vercel.json` file in your project root (optional):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "env": {
    "VITE_CHAIN_ID": "11155111",
    "VITE_RPC_URL": "https://1rpc.io/sepolia"
  }
}
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Ensure environment variables are set correctly
   - Verify build command and output directory

2. **Environment Variables Not Working**
   - Make sure variables start with `VITE_` for Vite projects
   - Check that variables are set for the correct environment (Production/Preview/Development)
   - Redeploy after adding new environment variables

3. **Wallet Connection Issues**
   - Verify WalletConnect Project ID is correct
   - Check that RPC URL is accessible
   - Ensure contract address is deployed and correct

### Build Logs

Check build logs in Vercel dashboard:
1. Go to your project
2. Click on the latest deployment
3. View build logs for any errors

### Performance Optimization

1. **Enable Edge Functions** (if needed)
2. **Configure Caching** for static assets
3. **Optimize Images** and assets
4. **Enable Compression** for better performance

## Monitoring and Analytics

### Vercel Analytics

1. Enable Vercel Analytics in project settings
2. Monitor performance and user behavior
3. Track Core Web Vitals

### Error Monitoring

Consider integrating error monitoring services:
- Sentry
- LogRocket
- Bugsnag

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to the repository
2. **API Keys**: Use environment variables for all API keys
3. **HTTPS**: Vercel provides HTTPS by default
4. **CORS**: Configure CORS settings if needed

## Updates and Maintenance

### Automatic Deployments

Vercel automatically deploys when you push to the main branch.

### Manual Deployments

1. Go to your project dashboard
2. Click "Deployments"
3. Click "Redeploy" on the latest deployment

### Rollback

If needed, you can rollback to a previous deployment:
1. Go to "Deployments"
2. Find the deployment you want to rollback to
3. Click "Promote to Production"

## Support

For Vercel-specific issues:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Vercel Support](https://vercel.com/support)

For project-specific issues:
- Check the main README.md
- Open an issue on GitHub
- Review the smart contract documentation

---

**Deployment Status**: ✅ Ready for Production  
**Last Updated**: January 2025  
**Maintainer**: cryptocatgirl
