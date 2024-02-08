import { EbHotelDetailDto } from "./ebHotelDetail.dto";

export class EbHotelDto {
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

  quantityGuests: number;
  quantityRooms: number;
  quantityMajors: number;
  quantityMinors: number;
  AccommodationEntryDate: Date;

  paymentMethod: string;
  cardNumber: string;
  amount: number;
  amountIva: string;
  coinCode: number;
  exchangeRate: number;
  amountGifCard: number;
  amountDiscount: number;
  exceptionDocument: number;
  cafc: string;
  legend: string;
  user: string;
  sectorDocumentCode: string;
  details: EbHotelDetailDto[];
}
