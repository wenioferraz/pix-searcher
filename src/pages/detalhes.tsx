import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const VECTOR_API_URL = "https://pay.vectorbrasil.app/api/v1/transaction.getPayment";
const SECRET_KEY = "7b3eb301-557c-46b4-bf3e-2c06f6ed741e";

type PaymentStatus = "PENDING" | "APPROVED" | "REJECTED" | "REFUNDED" | "CHARGEBACK";

interface PaymentInfo {
  id: string;
  pixCode: string;
  qrCode: string;
  amount: string;
  name: string;
  cpf: string;
}

const DetalhesPage = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  
  const id = searchParams.get("id");

  useEffect(() => {
    const storedInfo = sessionStorage.getItem('paymentInfo');
    if (storedInfo) {
      setPaymentInfo(JSON.parse(storedInfo));
    }
  }, []);

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
        const newStatus = data.result.data.status as PaymentStatus;
        
        setPaymentStatus(newStatus);
        setInitialCheckDone(true);

        if (newStatus === "APPROVED" && !initialCheckDone) {
          toast({
            title: "Pagamento Aprovado!",
            description: "Seu pagamento foi processado com sucesso.",
          });
        }
      } catch (error) {
        console.error("Erro ao verificar status:", error);
      } finally {
        setLoading(false);
      }
    };

    // Faz a primeira verificação
    if (id && !initialCheckDone) {
      checkPaymentStatus();
    }
    
    // Configura o intervalo apenas se não estiver aprovado e a verificação inicial já foi feita
    let interval: NodeJS.Timeout;
    if (id && paymentStatus === "PENDING" && initialCheckDone) {
      interval = setInterval(checkPaymentStatus, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [id, paymentStatus, toast, initialCheckDone]);

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

        {paymentStatus === "APPROVED" ? (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <AlertTitle className="text-green-800">Pagamento Aprovado!</AlertTitle>
            <AlertDescription className="text-green-700">
              Seu pagamento foi processado com sucesso.
            </AlertDescription>
          </Alert>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Detalhes do Pagamento PIX
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={`text-center p-3 rounded-lg font-medium ${
              paymentStatus === "APPROVED" ? "bg-green-100 text-green-800" : 
              paymentStatus === "PENDING" ? "bg-yellow-100 text-yellow-800" : 
              "bg-red-100 text-red-800"
            }`}>
              Status: {
                paymentStatus === "APPROVED" ? "Aprovado" :
                paymentStatus === "PENDING" ? "Pendente" :
                paymentStatus === "REJECTED" ? "Rejeitado" :
                paymentStatus === "REFUNDED" ? "Reembolsado" :
                "Estornado"
              }
            </div>

            {paymentInfo && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Nome do Cliente</p>
                  <p className="font-medium">{paymentInfo.name}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">CPF</p>
                  <p className="font-medium">{paymentInfo.cpf}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Valor</p>
                  <p className="font-medium">R$ {paymentInfo.amount}</p>
                </div>
              </div>
            )}
            
            {paymentInfo?.qrCode && paymentStatus !== "APPROVED" && (
              <div className="flex justify-center">
                <img src={paymentInfo.qrCode} alt="QR Code PIX" className="w-64 h-64" />
              </div>
            )}
            
            {paymentStatus !== "APPROVED" && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Código PIX (Copia e Cola)
                  </p>
                  <p className="font-mono text-sm break-all bg-white p-3 rounded border">
                    {paymentInfo?.pixCode}
                  </p>
                </div>
                
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(paymentInfo?.pixCode || "");
                    toast({
                      title: "Código PIX copiado!",
                      description: "O código foi copiado para sua área de transferência.",
                    });
                  }}
                  className="w-full bg-[#1BC11C] hover:bg-[#1BC11C]/90"
                >
                  Copiar Código PIX
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DetalhesPage;