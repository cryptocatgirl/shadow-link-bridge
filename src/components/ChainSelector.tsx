import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Chain {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const chains: Chain[] = [
  { id: "ethereum", name: "Ethereum", icon: "⟠", color: "hsl(220, 100%, 50%)" },
  { id: "polygon", name: "Polygon", icon: "⬟", color: "hsl(260, 100%, 65%)" },
  { id: "arbitrum", name: "Arbitrum", icon: "◆", color: "hsl(210, 100%, 60%)" },
  { id: "optimism", name: "Optimism", icon: "○", color: "hsl(0, 100%, 60%)" },
  { id: "bsc", name: "BNB Chain", icon: "◉", color: "hsl(45, 100%, 50%)" },
  { id: "avalanche", name: "Avalanche", icon: "▲", color: "hsl(0, 100%, 50%)" },
];

interface ChainSelectorProps {
  label: string;
  selectedChain: string;
  onSelect: (chainId: string) => void;
}

export const ChainSelector = ({ label, selectedChain, onSelect }: ChainSelectorProps) => {
  const selectedChainData = chains.find(chain => chain.id === selectedChain);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <Select value={selectedChain} onValueChange={onSelect}>
        <SelectTrigger className="w-full h-16 px-4">
          <SelectValue asChild>
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-glow"
                style={{ backgroundColor: selectedChainData?.color }}
              >
                {selectedChainData?.icon}
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold">{selectedChainData?.name}</div>
                <div className="text-sm text-muted-foreground capitalize">{selectedChain}</div>
              </div>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {chains.map((chain) => (
            <SelectItem key={chain.id} value={chain.id} className="h-14">
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: chain.color }}
                >
                  {chain.icon}
                </div>
                <div>
                  <div className="font-medium">{chain.name}</div>
                  <div className="text-sm text-muted-foreground">{chain.id}</div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};