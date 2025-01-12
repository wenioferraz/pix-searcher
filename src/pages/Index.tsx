import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CpfInput } from "@/components/CpfInput";
import { CurrencyInput } from "@/components/CurrencyInput";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const VECTOR_API_URL = "https://pay.vectorbrasil.app/api/trpc/transaction.purchase";
const SECRET_KEY = "7b3eb301-557c-46b4-bf3e-2c06f6ed741e";
const EMAIL = "wenioferraz@gmail.com";
const PHONE = "41988454645";

const Index = () => {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState("");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
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
    setProcessing(true);

    try {
      const valorCentavos = Math.round(parseFloat(value) * 100);
      
      const paymentData = {
        json: {
          name,
          email: EMAIL,
          cpf: cpf.replace(/\D/g, ""),
          phone: PHONE,
          paymentMethod: "PIX",
          amount: valorCentavos,
          traceable: true,
          items: [
            {
              unitPrice: valorCentavos,
              title: "Pagamento",
              quantity: 1,
              tangible: true
            }
          ]
        }
      };

      console.log("Enviando dados:", paymentData);

      const response = await fetch(VECTOR_API_URL, {
        method: "POST",
        headers: {
          "Authorization": SECRET_KEY,
          "Content-Type": "application/json",
          "Accept": "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          "User-Agent": "PostmanRuntime/7.43.0",
          "Connection": "keep-alive",
          "Postman-Token": `${Math.random().toString(36).substring(7)}`,
          "Host": "pay.vectorbrasil.app"
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response:", result);
      
      if (result.result?.data?.id) {
        navigate(`/detalhes?id=${result.result.data.id}&pixCode=${encodeURIComponent(result.result.data.pixCode)}&qrCode=${encodeURIComponent(result.result.data.pixQrCode)}`);
      } else {
        throw new Error("Resposta inválida da API");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PIX no momento. Tente novamente em alguns minutos.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
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
                  disabled={loading || processing}
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
                  disabled={!name || processing}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#1BC11C] hover:bg-[#1BC11C]/90"
                disabled={!isFormValid || processing}
              >
                {processing ? <LoadingSpinner /> : "Gerar Pagamento"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Rodapé com versão e horário */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Versão 1.0.4 - Última atualização:{" "}
            {new Date().toLocaleString("pt-BR", {
              timeZone: "America/Sao_Paulo",
              dateStyle: "short",
              timeStyle: "medium"
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;