import React from "react";
import { Input } from "@/components/ui/input";

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const CurrencyInput = ({ value, onChange, disabled }: CurrencyInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.replace(/\D/g, "");
    inputValue = (parseInt(inputValue) / 100).toFixed(2);
    onChange(inputValue);
  };

  const formattedValue = value ? `R$ ${Number(value).toFixed(2)}` : "R$ 0,00";

  return (
    <Input
      type="text"
      value={formattedValue}
      onChange={handleChange}
      placeholder="R$ 0,00"
      disabled={disabled}
      className="font-mono"
    />
  );
};