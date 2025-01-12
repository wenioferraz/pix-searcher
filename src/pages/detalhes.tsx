import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
}

const DetalhesPage = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [shouldPoll, setShouldPoll] = useState(true);
  
  const id = searchParams.get("id");
  const pixCode = searchParams.get("pixCode");
  const qrCode = searchParams.get("qrCode");

  useEffect(() => {
    const checkPaymentStatus = async () => {
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
        const newPaymentData = {
          status: data.result.data.status,
          name: data.result.data.name,
          amount: data.result.data.amount / 100, // Convertendo centavos para reais
        };
        
        setPaymentData(newPaymentData);
        
        // Se o pagamento foi aprovado, para de fazer polling
        if (newPaymentData.status === "APPROVED") {
          setShouldPoll(false);
        }
      } catch (error) {
        console.error("Erro ao verificar status:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id && shouldPoll) {
      checkPaymentStatus();
      const interval = setInterval(checkPaymentStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [id, shouldPoll]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixCode || "");
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
            {paymentData && (
              <>
                <div className={`text-center p-3 rounded-lg font-medium ${
                  paymentData.status === "APPROVED" ? "bg-green-100 text-green-800" : 
                  paymentData.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : 
                  "bg-red-100 text-red-800"
                }`}>
                  Status: {
                    paymentData.status === "APPROVED" ? "Aprovado" :
                    paymentData.status === "PENDING" ? "Pendente" :
                    paymentData.status === "REJECTED" ? "Rejeitado" :
                    paymentData.status === "REFUNDED" ? "Reembolsado" :
                    "Estornado"
                  }
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">{paymentData.name}</span>
                  <span className="font-medium">
                    R$ {paymentData.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                
                {paymentData.status === "PENDING" && (
                  <>
                    {qrCode && (
                      <div className="flex justify-center">
                        <img src={qrCode} alt="QR Code PIX" className="w-64 h-64" />
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          Código PIX (Copia e Cola)
                        </p>
                        <p className="font-mono text-sm break-all bg-white p-3 rounded border">
                          {pixCode}
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
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DetalhesPage;