import { EbCommercialExportDetailDto } from "./ebComertialExportDetail.dto";

export class EbCommercialExportDto {
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
  addressBuyer: string;
  clientCode: string;
  incoterm: string;
  incotermDetail: string;
  destinationPort: string;
  destinationPlace: string;
  countrycode: string;
  paymentMethod: string;
  cardNumber: string;
  amount: number;
  nationalExpensesCosts: Record<string, number>[];
  totalNationalExpensesFob: number;
  costsInternationalExpenses: Record<string, number>[];
  totalInternationalExpenses: number;
  amountDetail: number;
  amountIva: string;
  coinCode: number;
  exchangeRate: number;
  numberPackageDescriptionPackages: string;
  additionalinformation: string;
  amountDiscount: number;
  exceptionDocument: number;
  cafc: string;
  legend: string;
  user: string;
  sectorDocumentCode: string;

  details: EbCommercialExportDetailDto[];
}
