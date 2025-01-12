import React from "react";
import { Input } from "@/components/ui/input";

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const CurrencyInput = ({ value, onChange, disabled }: CurrencyInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = (parseInt(value) / 100).toFixed(2);
    onChange(value);
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