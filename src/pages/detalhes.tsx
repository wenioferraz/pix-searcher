import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { PaymentStatus } from "@/components/payment/PaymentStatus";
import { PaymentInfo } from "@/components/payment/PaymentInfo";
import { PaymentQRCode } from "@/components/payment/PaymentQRCode";
import { PaymentInfoType, PaymentStatus as PaymentStatusType } from "@/types/payment";

const VECTOR_API_URL = "https://pay.vectorbrasil.app/api/v1/transaction.getPayment";
const SECRET_KEY = "7b3eb301-557c-46b4-bf3e-2c06f6ed741e";

const DetalhesPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusType | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfoType | null>(null);
  
  const id = searchParams.get("id");

  const checkPaymentStatus = async () => {
    if (!id) {
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
      console.log("API Response:", data);
      
      if (data.result?.data?.status) {
        setPaymentStatus(data.result.data.status);
        
        // Se o status for APPROVED, não precisamos mais verificar
        if (data.result.data.status === "APPROVED") {
          clearInterval(window.statusInterval);
        }
      }
    } catch (error) {
      console.error("Erro ao verificar status:", error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar informações do pagamento do sessionStorage
  useEffect(() => {
    const storedInfo = sessionStorage.getItem('paymentInfo');
    if (storedInfo) {
      setPaymentInfo(JSON.parse(storedInfo));
    }
  }, []);

  // Verificar status do pagamento na API e configurar intervalo
  useEffect(() => {
    checkPaymentStatus();

    // Se o status for PENDING, verificar a cada 5 segundos
    if (paymentStatus === "PENDING") {
      window.statusInterval = setInterval(checkPaymentStatus, 5000);
    }

    return () => {
      if (window.statusInterval) {
        clearInterval(window.statusInterval);
      }
    };
  }, [id, paymentStatus]);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!paymentInfo) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <p className="text-red-500">Informações do pagamento não encontradas</p>
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
            <PaymentStatus status={paymentStatus} />
            <PaymentInfo info={paymentInfo} />
            {paymentStatus === "PENDING" && paymentInfo?.qrCode && (
              <PaymentQRCode paymentInfo={paymentInfo} />
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Versão 1.1.3 - Última atualização: 12/01/2024 às 03:15 (America/Sao_Paulo)
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetalhesPage;