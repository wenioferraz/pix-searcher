import React from "react";
import { Input } from "@/components/ui/input";

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const CurrencyInput = ({ value, onChange, disabled }: CurrencyInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove todos os caracteres não numéricos, exceto vírgula
    let inputValue = e.target.value.replace(/[^\d,]/g, "");
    
    // Garante que só exista uma vírgula
    const matches = inputValue.match(/,/g);
    if (matches && matches.length > 1) {
      inputValue = inputValue.replace(/,/g, (match, index, original) => 
        index === original.indexOf(',') ? match : ''
      );
    }
    
    // Limita a dois dígitos após a vírgula
    if (inputValue.includes(',')) {
      const [inteiro, decimal] = inputValue.split(',');
      if (decimal && decimal.length > 2) {
        inputValue = `${inteiro},${decimal.slice(0, 2)}`;
      }
    }
    
    // Converte para número (substitui vírgula por ponto)
    const numericValue = inputValue.replace(",", ".");
    
    onChange(numericValue);
  };

  // Formata o valor para exibição no formato brasileiro
  const formatDisplayValue = (value: string) => {
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