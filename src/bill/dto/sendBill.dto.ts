import { ApiProperty } from '@nestjs/swagger';

export class Business {
  @ApiProperty()
  sucursalCode: number;
  @ApiProperty()
  salePointCode: number;
  @ApiProperty()
  economicActivity: string;
  @ApiProperty()
  nit: number;
}

export class Customer {
  @ApiProperty()
  name: string;
  @ApiProperty()
  document: string;
  @ApiProperty()
  documentType: string;
  @ApiProperty()
  customerCode: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  address: string;
  @ApiProperty()
  documentComplement: string;
}

export class BillDetail {
  @ApiProperty()
  productCode: string;
  @ApiProperty()
  productCodeSin: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  quantity: number;
  @ApiProperty()
  measureCode: string;
  @ApiProperty()
  unitPrice: number;
  @ApiProperty()
  amountDiscount: number;
  @ApiProperty()
  subTotal: number;
}

export class Bill {
  @ApiProperty({ type: [BillDetail] })
  billDetail: BillDetail[];
  @ApiProperty()
  billDate: string;
  @ApiProperty()
  totalDiscountAmount: number;
  @ApiProperty()
  totalAmount: number;
  @ApiProperty()
  totalAmountIva: number;
  @ApiProperty()
  coinType: string;
  @ApiProperty()
  currencyChange: number;
  @ApiProperty()
  billNumber: number;
  @ApiProperty()
  amountGiftCard: number;
}

export class BillData {
  @ApiProperty()
  billedPeriod: string;
  @ApiProperty()
  emitteType: number;
  @ApiProperty()
  sectorDocumentCode: string;
  @ApiProperty()
  cafc: string;
  @ApiProperty()
  exception: string;
  @ApiProperty()
  paymentMethod: string;
  @ApiProperty()
  cardNumber: string;
  @ApiProperty()
  externalCode: string;
  @ApiProperty()
  studentName: string;
  @ApiProperty()
  user: string;
}

export class BillDataAditional {
  @ApiProperty()
  addressBuyer: string;
  @ApiProperty()
  placeDestination: string;
  @ApiProperty()
  codeCountry: string;
  @ApiProperty()
  additionalInformation: string;  
}

export class SendBillDto {
  @ApiProperty({ type: Business })
  business: Business;
  @ApiProperty({ type: Customer })
  customer: Customer;
  @ApiProperty({ type: Bill })
  bill: Bill;
  @ApiProperty({ type: BillData })
  billData: BillData;
  @ApiProperty({ type: BillDataAditional })
  billDataAditional: BillDataAditional;
}
