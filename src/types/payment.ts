export type PaymentStatus = "PENDING" | "APPROVED" | "REJECTED" | "REFUNDED" | "CHARGEBACK";

export interface PaymentInfoType {
  id: string;
  pixCode: string;
  qrCode: string;
  amount: string;
  name: string;
  cpf: string;
}