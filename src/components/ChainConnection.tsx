import { ArrowDown, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChainConnectionProps {
  isStealthMode: boolean;
}

export const ChainConnection = ({ isStealthMode }: ChainConnectionProps) => {
  return (
    <div className="relative flex items-center justify-center py-4">
      {/* Animated Chain Links */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 border-2 border-primary rounded-sm transform rotate-45 animate-flow`}
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
      
      {/* Center Bridge Icon */}
      <div className="relative z-10 bg-background border border-border rounded-full p-3">
        <Button size="icon" variant="outline" className="rounded-full crypto-glow">
          {isStealthMode ? (
            <Link2 className="h-4 w-4 animate-chain-pulse" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {/* Stealth Mode Indicator */}
      {isStealthMode && (
        <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
          <div className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full animate-pulse">
            Encrypted
          </div>
        </div>
      )}
    </div>
  );
};