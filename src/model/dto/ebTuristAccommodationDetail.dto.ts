export class EbTuristAccommodationDetailDto {
  economicActivity: string;
  productCodeSin: string;
  productCode: string;
  description: string;
  quantity: number;
  measureCode: string;
  unitPrice: number;
  amountDiscount: number;
  subtotal: number;

  roomTypeCode: string;
  guestDetail: Record<string, string>[];
}
