import { EbTuristAccommodationDetailDto } from "./ebTuristAccommodationDetail.dto";

export class EbTuristAccommodationDto {
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

  reasonSocialTourismOperator: string;
  GuestQuantity: string;
  quantityRooms: string;
  quantityMajors: string;
  minorQuantity: string;
  lodgingEntryDate: Date;

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

  details: EbTuristAccommodationDetailDto[];
}
