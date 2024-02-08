import { EbTransactionMessageDto } from './ebTransactionMessage.dto';

export class EbTransactionDto {
  transactionId: number;
  referenceId: number;
  operation: string;
  soapRequest: string;
  soapResponse: string;
  xml: string;
  receptionCode: string;
  statusCode: string;
  statusDescription: string;
  type: string;
  cuf: string;
  user: string;
  createdAt: Date;
  messages: EbTransactionMessageDto[];
}
