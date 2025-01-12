import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PaymentInfoType } from "@/types/payment";

type PaymentQRCodeProps = {
  paymentInfo: PaymentInfoType;
};

export const PaymentQRCode = ({ paymentInfo }: PaymentQRCodeProps) => {
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <img src={paymentInfo.qrCode} alt="QR Code PIX" className="w-64 h-64" />
      </div>
      
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium text-gray-600 mb-2">
          Código PIX (Copia e Cola)
        </p>
        <p className="font-mono text-sm break-all bg-white p-3 rounded border">
          {paymentInfo.pixCode}
        </p>
      </div>
      
      <Button
        onClick={() => {
          navigator.clipboard.writeText(paymentInfo.pixCode);
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
  );
};