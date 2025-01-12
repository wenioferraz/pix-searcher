import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const VECTOR_API_URL = "https://pay.vectorbrasil.app/api/v1/transaction.getPayment";
const SECRET_KEY = "7b3eb301-557c-46b4-bf3e-2c06f6ed741e";

const DetalhesPage = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState("");
  
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
        setPaymentStatus(data.status);
      } catch (error) {
        console.error("Erro ao verificar status:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      checkPaymentStatus();
      // Verificar status a cada 30 segundos
      const interval = setInterval(checkPaymentStatus, 30000);
      return () => clearInterval(interval);
    }
  }, [id]);

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
            {paymentStatus && (
              <div className={`text-center p-2 rounded ${
                paymentStatus === "PAID" ? "bg-green-100 text-green-800" : 
                paymentStatus === "PENDING" ? "bg-yellow-100 text-yellow-800" : 
                "bg-red-100 text-red-800"
              }`}>
                Status: {paymentStatus === "PAID" ? "Pago" : 
                        paymentStatus === "PENDING" ? "Pendente" : 
                        "Cancelado"}
              </div>
            )}
            
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DetalhesPage;