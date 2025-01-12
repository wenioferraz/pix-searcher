import React from "react";
import { Input } from "@/components/ui/input";

interface CpfInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const CpfInput = ({ value, onChange, disabled }: CpfInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let cpf = e.target.value.replace(/\D/g, "");
    if (cpf.length > 11) cpf = cpf.slice(0, 11);
    
    // Apply mask
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    onChange(cpf);
  };

  return (
    <Input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder="000.000.000-00"
      maxLength={14}
      disabled={disabled}
      className="font-mono"
    />
  );
};