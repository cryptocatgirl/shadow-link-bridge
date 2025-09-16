import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Lock, Unlock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useShadowLinkBridge } from "@/hooks/useShadowLinkBridge";

interface BridgeFormProps {
  stealthMode: boolean;
  sourceChain: string;
  targetChain: string;
}

export const BridgeForm = ({ stealthMode, sourceChain, targetChain }: BridgeFormProps) => {
  const [amount, setAmount] = useState("");
  const [toAddress, setToAddress] = useState("");
  const { toast } = useToast();
  const { initiateBridge, isPending, isConfirming } = useShadowLinkBridge();

  const handleBridge = async () => {
    if (!amount || !toAddress) {
      toast({
        title: "Missing Information",
        description: "Please fill in both amount and recipient address.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Use FHE encryption for bridge transaction
      await initiateBridge(
        amount,
        sourceChain,
        targetChain,
        toAddress,
        stealthMode,
        "0.001" // Bridge fee in ETH
      );
    } catch (error) {
      console.error('Bridge failed:', error);
    }
  };

  const displayValue = (value: string) => {
    if (!stealthMode) return value;
    return value ? "•".repeat(Math.min(value.length, 8)) : "";
  };

  return (
    <div className="space-y-6">
      {/* Amount Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-muted-foreground">Amount</label>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {stealthMode ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
            {stealthMode ? "Encrypted" : "Visible"}
          </div>
        </div>
        <div className="relative">
          <Input
            type="number"
            placeholder="0.0"
            value={stealthMode ? displayValue(amount) : amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-2xl font-semibold h-16 pr-20"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <span className="text-sm font-medium text-muted-foreground">ETH</span>
          </div>
        </div>
        <div className="text-right text-sm text-muted-foreground">
          Balance: 2.45 ETH
        </div>
      </div>

      {/* Recipient Address */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-muted-foreground">To Address</label>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {stealthMode ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
            {stealthMode ? "Encrypted" : "Visible"}
          </div>
        </div>
        <Input
          placeholder="0x..."
          value={stealthMode ? displayValue(toAddress) : toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          className="font-mono"
        />
      </div>

      {/* Transaction Summary */}
      <Card className="p-4 bg-secondary/50">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Network Fee</span>
            <span>~$2.50</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Bridge Fee</span>
            <span>0.1%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estimated Time</span>
            <span>~5 minutes</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>You will receive</span>
            <span>{stealthMode ? "••••••" : amount || "0.0"} ETH</span>
          </div>
        </div>
      </Card>

      {/* Bridge Button */}
      <Button 
        onClick={handleBridge}
        disabled={isPending || isConfirming || !amount || !toAddress}
        className="w-full h-14 text-lg gap-3"
        size="lg"
      >
        {isPending || isConfirming ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            {isPending ? "Confirming..." : "Processing..."}
          </>
        ) : (
          <>
            {stealthMode ? "Bridge Privately" : "Bridge Assets"}
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </Button>

      {/* Stealth Mode Notice */}
      {stealthMode && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-primary mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-primary">Stealth Mode Active</div>
              <div className="text-muted-foreground mt-1">
                Your transaction details are encrypted and will only be revealed upon confirmation on the target chain.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};