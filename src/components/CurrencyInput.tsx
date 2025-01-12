import React from "react";
import { Input } from "@/components/ui/input";

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const CurrencyInput = ({ value, onChange, disabled }: CurrencyInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove todos os caracteres não numéricos
    let value = e.target.value.replace(/\D/g, "");
    
    // Converte para número e divide por 100 para ter o valor em reais
    const numericValue = (parseInt(value) || 0) / 100;
    
    // Formata o valor com duas casas decimais
    onChange(numericValue.toFixed(2));
  };

  return (
    <Input
      type="text"
      value={`R$ ${Number(value).toFixed(2)}`}
      onChange={handleChange}
      placeholder="R$ 0,00"
      disabled={disabled}
      className="font-mono"
    />
  );
};