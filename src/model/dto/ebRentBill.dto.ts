import { EbRentBillDetailDto } from "./ebRentBillDetail.dto";

export class EbRentBillDto {
  nitEmitter: string;
  billNameEmitter: string;
  municipality: string;
  billName: string;
  phone: string;
  billNumber: string;
  cuf: string;
  cufd: string;
  sucursalCode: string;
  address: string;
  salePointCode: string;
  dateEmiite: Date;
  documentType: string;
  billDocument: string;
  cardNumber: string;
  clientCode: string;
  billedPeriod: string;
  paymentMethod: string;
  amount: number;
  amountIva: string;
  coinCode: string;
  exchangeRate: number;
  billComplement: string;
  amountDiscount: number;
  exceptionDocument: number;
  cafc: string;
  legend: string;
  user: string;
  sectorDocumentCode: string;
  details: EbRentBillDetailDto[];
}
