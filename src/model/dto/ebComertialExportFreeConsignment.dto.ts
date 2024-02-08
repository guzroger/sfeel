import { EbCommercialExportFreeConsignmentDetailDto } from "./ebComertialExportFreeConsignmentDetail.dto";

export class EbCommercialExportFreeConsignmentDto {
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
  addressBuyer: string;
  clientCode: string;
  destinationPort: string;
  countrycode: string;
  paymentMethod: string;
  cardNumber: string;
  amount: number;
  amountIva: string;
  coinCode: number;
  exchangeRate: number;
  exceptionDocument: number;
  cafc: string;
  legend: string;
  user: string;
  sectorDocumentCode: string;

  details: EbCommercialExportFreeConsignmentDetailDto[];
}
