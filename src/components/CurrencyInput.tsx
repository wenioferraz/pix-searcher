import React from "react";
import { Input } from "@/components/ui/input";

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const CurrencyInput = ({ value, onChange, disabled }: CurrencyInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove tudo que não é número e vírgula
    let inputValue = e.target.value.replace(/[^\d,]/g, "");
    
    // Substitui vírgula por ponto para fazer o cálculo
    inputValue = inputValue.replace(",", ".");
    
    // Converte para número e divide por 100 para ter o valor em reais
    const numericValue = (parseFloat(inputValue) || 0).toString();
    
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