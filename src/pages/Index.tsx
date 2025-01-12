import React, { useState } from "react";
import { CpfInput } from "@/components/CpfInput";
import { CurrencyInput } from "@/components/CurrencyInput";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [cpf, setCpf] = useState("");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchName = async (cpf: string) => {
    if (cpf.length !== 14) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://api.cpfcnpj.com.br/27285dfefe3a9a5d42c531b3ab120e53/2/${cpf.replace(/\D/g, "")}`);
      const data = await response.json();
      
      if (data && data.nome) {
        setName(data.nome);
        toast({
          title: "CPF encontrado",
          description: "Nome preenchido automaticamente",
        });
      } else {
        toast({
          title: "Erro",
          description: "CPF não encontrado ou inválido",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao consultar CPF",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would integrate with the payment API
    toast({
      title: "Sucesso",
      description: "Pagamento gerado com sucesso!",
    });
  };

  const isFormValid = cpf.length === 14 && name && value;

  return (
    <div className="min-h-screen bg-secondary p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <img
            src="https://pay.vectorbrasil.app/_next/image?url=https%3A%2F%2Flogicc-tecnologia-s3.s3.amazonaws.com%2Fplatform%2F9cba7ff9-da7e-453d-98bb-d1acf433bd8c-vector-11-12-2024%20Fundotransparent.png&w=384&q=75"
            alt="Vector Brasil Logo"
            className="h-16 mx-auto mb-4"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Depósito via PIX
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">CPF do Cliente</label>
                <CpfInput
                  value={cpf}
                  onChange={(value) => {
                    setCpf(value);
                    if (value.length === 14) fetchName(value);
                  }}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Cliente</label>
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled
                    placeholder="Nome será preenchido automaticamente"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Valor</label>
                <CurrencyInput
                  value={value}
                  onChange={setValue}
                  disabled={!name}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={!isFormValid}
              >
                Gerar Pagamento
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;