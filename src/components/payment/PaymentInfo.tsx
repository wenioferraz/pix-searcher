import { PaymentInfoType } from "@/types/payment";

type PaymentInfoProps = {
  info: PaymentInfoType;
};

export const PaymentInfo = ({ info }: PaymentInfoProps) => (
  <div className="space-y-4">
    <div className="p-4 bg-gray-50 rounded-lg">
      <p className="text-sm font-medium text-gray-600">Nome do Cliente</p>
      <p className="font-medium">{info.name}</p>
    </div>
    
    <div className="p-4 bg-gray-50 rounded-lg">
      <p className="text-sm font-medium text-gray-600">CPF</p>
      <p className="font-medium">{info.cpf}</p>
    </div>

    <div className="p-4 bg-gray-50 rounded-lg">
      <p className="text-sm font-medium text-gray-600">Valor</p>
      <p className="font-medium">R$ {info.amount}</p>
    </div>
  </div>
);