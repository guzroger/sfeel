import { EbPreratedDetailDto } from "./ebPreratedDetail.dto";

export class EbPreratedDto {
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
  legend: string;
  user: string;
  sectorDocumentCode: string;
  details: EbPreratedDetailDto[];
}
