import { EReacheICEDetailDto } from "./ebReacheICEDetail.dto";

export class EbReacheICEDto {
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
  specificIceAmount: number;
  amountIcePercentual: number;
  coinCode: number;
  exchangeRate: number;
  amountDiscount: number;
  exceptionDocument: number;
  cafc: string;
  legend: string;
  user: string;
  sectorDocumentCode: string;
  details: EReacheICEDetailDto[];
}
