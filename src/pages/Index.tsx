import { useState } from "react";
import { Wallet, Shield, Link2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChainSelector } from "@/components/ChainSelector";
import { BridgeForm } from "@/components/BridgeForm";
import { ChainConnection } from "@/components/ChainConnection";
import { WalletConnect } from "@/components/WalletConnect";
import { useShadowLinkBridge } from "@/hooks/useShadowLinkBridge";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  console.log("ShadowLinkBridge: Index component rendering");
  
  const [stealthMode, setStealthMode] = useState(true);
  const [sourceChain, setSourceChain] = useState("ethereum");
  const [targetChain, setTargetChain] = useState("polygon");
  const { toast } = useToast();
  const { isConnected, userProfile, globalStats } = useShadowLinkBridge();

  const toggleStealthMode = () => {
    setStealthMode(!stealthMode);
    toast({
      title: stealthMode ? "Stealth Mode Disabled" : "Stealth Mode Enabled",
      description: stealthMode 
        ? "Amounts and addresses are now visible" 
        : "Amounts and addresses are now encrypted",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 py-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Link2 className="h-8 w-8 text-primary animate-chain-pulse" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              StealthBridge
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant={stealthMode ? "default" : "outline"}
              size="sm"
              onClick={toggleStealthMode}
              className="gap-2"
            >
              {stealthMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {stealthMode ? "Stealth On" : "Stealth Off"}
            </Button>
            
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Cross Chains
            </span>
            <br />
            <span className="text-muted-foreground">Without Exposure</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Bridge your assets across blockchains with complete privacy. 
            Amounts and addresses remain encrypted until confirmation.
          </p>
          
          <div className="flex items-center justify-center gap-8 mb-16">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-accent" />
              <span className="text-foreground">Zero-Knowledge Proofs</span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="flex items-center gap-3">
              <Link2 className="h-6 w-6 text-primary" />
              <span className="text-foreground">Cross-Chain Compatible</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bridge Interface */}
      <section className="relative z-10 container mx-auto px-6 pb-16">
        <Card className="max-w-2xl mx-auto stealth-card p-8">
          <div className="space-y-8">
            {/* Chain Selection */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-center">Bridge Assets</h2>
              
              <div className="space-y-4">
                <ChainSelector
                  label="From"
                  selectedChain={sourceChain}
                  onSelect={setSourceChain}
                />
                
                <ChainConnection isStealthMode={stealthMode} />
                
                <ChainSelector
                  label="To"
                  selectedChain={targetChain}
                  onSelect={setTargetChain}
                />
              </div>
            </div>

            {/* Bridge Form */}
            {isConnected && (
              <BridgeForm 
                stealthMode={stealthMode}
                sourceChain={sourceChain}
                targetChain={targetChain}
              />
            )}

            {!isConnected && (
              <div className="text-center py-8">
                <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Connect your wallet to start bridging</p>
                <WalletConnect />
              </div>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Index;