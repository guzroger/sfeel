import { EbBillDto } from './ebBill.dto';
export class EbPackageBillDto {
  packageId: number;
  cufd: string;
  billStatusId: number;
  nitEmitter: number;
  sucursalCode: number;
  salePointCode: number;
  emitteType: number;
  modalityCode: number;
  sectorDocumentCode: string;
  documentTaxCode:number;
  receptionCode: string;
  statusCode: string;
  statusDescription: string;
  eventCode: string;
  cafc: string;
  systemCode: string;
  bills: EbBillDto[];
}
