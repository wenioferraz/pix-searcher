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
  const [apiLoaded, setApiLoaded] = useState(false);
  
  const id = searchParams.get("id");

  useEffect(() => {
    const storedInfo = sessionStorage.getItem('paymentInfo');
    if (storedInfo) {
      setPaymentInfo(JSON.parse(storedInfo));
    }
  }, []);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!id) return;

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
        }
        setApiLoaded(true);
      } catch (error) {
        console.error("Erro ao verificar status:", error);
        setApiLoaded(true);
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [id]);

  if (loading || !apiLoaded) {
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
            <PaymentStatus status={paymentStatus} />
            {paymentInfo && <PaymentInfo info={paymentInfo} />}
            {paymentInfo?.qrCode && paymentStatus === "PENDING" && (
              <PaymentQRCode paymentInfo={paymentInfo} />
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Versão 1.1.1 - Última atualização: 12/01/2024 às 02:30 (America/Sao_Paulo)
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetalhesPage;