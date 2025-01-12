import React from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const DetalhesPage = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const pixCode = searchParams.get("pixCode");
  const qrCode = searchParams.get("qrCode");

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