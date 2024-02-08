import { ApiProperty } from '@nestjs/swagger';
import { MensajesListDto } from './mensajesList.dto';

export class SendBillResponseDto {
  @ApiProperty()
  cuf: string;
  @ApiProperty()
  cufd: string;
  @ApiProperty()
  cuis: string;
  @ApiProperty()
  dateEmitte: Date;
  @ApiProperty()
  receptionCode: string;
  @ApiProperty()
  legend: string;
  @ApiProperty()
  note: string;
  @ApiProperty()
  qr: string;
  @ApiProperty()
  billNumber: number;
  @ApiProperty()
  billId: number;
  @ApiProperty()
  statusCode: string;
  @ApiProperty()
  statusDescription: string;
  @ApiProperty()
  message: string;
  @ApiProperty()
  mensajesList:MensajesListDto[]|MensajesListDto
}
