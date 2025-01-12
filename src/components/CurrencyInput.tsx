import React from "react";
import { Input } from "@/components/ui/input";

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const CurrencyInput = ({ value, onChange, disabled }: CurrencyInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    // Remove tudo exceto números e vírgula
    inputValue = inputValue.replace(/[^\d,]/g, "");
    
    // Garante apenas uma vírgula
    const commaCount = (inputValue.match(/,/g) || []).length;
    if (commaCount > 1) {
      return;
    }
    
    // Limita a dois dígitos após a vírgula
    if (inputValue.includes(',')) {
      const [inteiro, decimal] = inputValue.split(',');
      if (decimal && decimal.length > 2) {
        inputValue = `${inteiro},${decimal.slice(0, 2)}`;
      }
    }
    
    onChange(inputValue);
  };

  const formatDisplayValue = (value: string) => {
    if (!value) return "";
    
    // Remove o R$ e espaços para processar apenas o número
    const numericValue = value.replace(/[^\d,]/g, "");
    
    if (!numericValue) return "";
    
    // Formata o valor para exibição
    return `R$ ${numericValue}`;
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