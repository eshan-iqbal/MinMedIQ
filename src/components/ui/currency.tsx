import React from 'react';
import { cn } from '@/lib/utils';

interface CurrencyProps {
  amount: number;
  className?: string;
  showSymbol?: boolean;
  currency?: string;
}

export function Currency({ 
  amount, 
  className, 
  showSymbol = true, 
  currency = '₹' 
}: CurrencyProps) {
  return (
    <span className={cn("font-mono", className)}>
      {showSymbol && currency}
      {amount.toFixed(2)}
    </span>
  );
}

export function CurrencySymbol({ 
  className, 
  currency = '₹' 
}: { className?: string; currency?: string }) {
  return (
    <span className={cn("font-mono font-bold", className)}>
      {currency}
    </span>
  );
} 