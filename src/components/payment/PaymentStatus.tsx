import { CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type PaymentStatusProps = {
  status: string | null;
};

export const PaymentStatus = ({ status }: PaymentStatusProps) => {
  const getStatusDisplay = (status: string | null) => {
    switch (status) {
      case "APPROVED":
        return { text: "Aprovado", className: "bg-green-100 text-green-800" };
      case "PENDING":
        return { text: "Pendente", className: "bg-yellow-100 text-yellow-800" };
      case "REJECTED":
        return { text: "Rejeitado", className: "bg-red-100 text-red-800" };
      case "REFUNDED":
        return { text: "Reembolsado", className: "bg-orange-100 text-orange-800" };
      case "CHARGEBACK":
        return { text: "Estornado", className: "bg-red-100 text-red-800" };
      default:
        return { text: "Carregando...", className: "bg-gray-100 text-gray-800" };
    }
  };

  const statusDisplay = getStatusDisplay(status);

  return (
    <>
      {status === "APPROVED" && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-6 w-6 text-green-500" />
          <AlertTitle className="text-green-800">Pagamento Aprovado!</AlertTitle>
          <AlertDescription className="text-green-700">
            Seu pagamento foi processado com sucesso.
          </AlertDescription>
        </Alert>
      )}
      
      <div className={`text-center p-3 rounded-lg font-medium ${statusDisplay.className}`}>
        Status: {statusDisplay.text}
      </div>
    </>
  );
};