import { EbDuttyFreeDetailDto } from "./ebDuttyFreeDetail.dto";

export class EbDuttyFreeDto {
  nitEmitter: string;
  billNameEmitter: string;
  municipality: string;
  phone: string;
  billNumber: string;
  cuf: string;
  cufd: string;
  sucursalCode: string;
  address: string;
  salePointCode: string;
  dateEmiite: Date;
  billName: string;
  documentType: string;
  billDocument: string;
  billComplement: string;
  clientCode: string;
  paymentMethod: string;
  cardNumber: string;
  amount: number;
  amountIva: string;
  coinCode: number;
  exchangeRate: number;
  amountGifCard;
  amountDiscount: number;
  exceptionDocument: number;
  cafc: string;
  legend: string;
  user: string;
  sectorDocumentCode: string;

  details: EbDuttyFreeDetailDto[];
}
