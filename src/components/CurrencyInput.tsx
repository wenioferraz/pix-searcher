import React from "react";
import { Input } from "@/components/ui/input";

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const CurrencyInput = ({ value, onChange, disabled }: CurrencyInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.replace(/[^\d,]/g, "");
    
    if (inputValue.includes(',')) {
      const [inteiro, decimal] = inputValue.split(',');
      if (decimal && decimal.length > 2) {
        inputValue = `${inteiro},${decimal.slice(0, 2)}`;
      }
    }
    
    const numericValue = inputValue.replace(",", ".");
    onChange(numericValue);
  };

  const formatDisplayValue = (value: string) => {
    if (!value) return "";
    const numericValue = parseFloat(value) || 0;
    return numericValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <Input
      type="text"
      value={formatDisplayValue(value)}
      onChange={handleChange}
      placeholder="R$ 0,00"
      disabled={disabled}
      className="font-mono"
    />
  );
};