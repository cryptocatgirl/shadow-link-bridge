import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { fheUtils } from '@/lib/fhe-utils';

interface FHEStatusProps {
  isEncrypted: boolean;
  stealthMode: boolean;
  onToggleStealth?: () => void;
}

export function FHEStatus({ isEncrypted, stealthMode, onToggleStealth }: FHEStatusProps) {
  const encryptionStatus = fheUtils.getEncryptionStatus();

  return (
    <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">FHE Encryption</h3>
              <Badge variant={isEncrypted ? "default" : "secondary"}>
                {isEncrypted ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {encryptionStatus.encryptionType} • {encryptionStatus.keyStrength}
            </p>
          </div>
        </div>
        
        {onToggleStealth && (
          <button
            onClick={onToggleStealth}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              stealthMode 
                ? 'bg-primary/20 text-primary hover:bg-primary/30' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {stealthMode ? (
              <>
                <EyeOff className="h-4 w-4" />
                <span className="text-sm font-medium">Stealth On</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">Stealth Off</span>
              </>
            )}
          </button>
        )}
      </div>
      
      {isEncrypted && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>
              All sensitive data is encrypted using Fully Homomorphic Encryption
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}

export default FHEStatus;
