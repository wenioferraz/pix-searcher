import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const VECTOR_API_URL = "https://pay.vectorbrasil.app/api/v1/transaction.getPayment";
const SECRET_KEY = "7b3eb301-557c-46b4-bf3e-2c06f6ed741e";

type PaymentStatus = "PENDING" | "APPROVED" | "REJECTED" | "REFUNDED" | "CHARGEBACK";

interface PaymentData {
  status: PaymentStatus;
  name: string;
  amount: number;
  pixCode?: string;
  pixQrCode?: string;
}

const DetalhesPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [shouldPoll, setShouldPoll] = useState(true);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!id) {
        toast({
          title: "Erro",
          description: "ID do pagamento não encontrado",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${VECTOR_API_URL}?id=${id}`, {
          headers: {
            "Authorization": SECRET_KEY
          }
        });
        
        if (!response.ok) {
          throw new Error("Erro ao verificar status do pagamento");
        }
        
        const data = await response.json();
        console.log("Resposta da API:", data);
        
        if (!data.result?.data) {
          throw new Error("Dados do pagamento não encontrados");
        }

        const newPaymentData = {
          status: data.result.data.status,
          name: data.result.data.name,
          amount: data.result.data.amount / 100,
          pixCode: data.result.data.pixCode,
          pixQrCode: data.result.data.pixQrCode,
        };
        
        setPaymentData(newPaymentData);
        
        if (newPaymentData.status !== "PENDING") {
          setShouldPoll(false);
        }
      } catch (error) {
        console.error("Erro ao verificar status:", error);
        toast({
          title: "Erro",
          description: "Erro ao carregar os detalhes do pagamento",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (shouldPoll) {
      checkPaymentStatus();
      const interval = setInterval(checkPaymentStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [id, shouldPoll, toast]);

  const handleCopy = async () => {
    if (!paymentData?.pixCode) return;
    
    try {
      await navigator.clipboard.writeText(paymentData.pixCode);
      toast({
        title: "Sucesso",
        description: "Código PIX copiado para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o código PIX",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-center text-red-600">Pagamento não encontrado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              Detalhes do Pagamento PIX
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={`text-center p-3 rounded-lg font-medium ${
              paymentData.status === "APPROVED" ? "bg-green-100 text-green-800" : 
              paymentData.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : 
              "bg-red-100 text-red-800"
            }`}>
              Status: {
                paymentData.status === "APPROVED" ? "Pagamento Aprovado" :
                paymentData.status === "PENDING" ? "Aguardando Pagamento" :
                paymentData.status === "REJECTED" ? "Pagamento Rejeitado" :
                paymentData.status === "REFUNDED" ? "Pagamento Reembolsado" :
                "Pagamento Estornado"
              }
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">{paymentData.name}</span>
              <span className="font-medium">
                R$ {paymentData.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            
            {paymentData.status === "PENDING" && paymentData.pixQrCode && paymentData.pixCode && (
              <>
                <div className="flex justify-center">
                  <img 
                    src={paymentData.pixQrCode} 
                    alt="QR Code PIX" 
                    className="w-64 h-64"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Código PIX (Copia e Cola)
                    </p>
                    <p className="font-mono text-sm break-all bg-white p-3 rounded border">
                      {paymentData.pixCode}
                    </p>
                  </div>
                  
                  <Button
                    onClick={handleCopy}
                    className="w-full bg-[#1BC11C] hover:bg-[#1BC11C]/90"
                  >
                    Copiar Código PIX
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DetalhesPage;