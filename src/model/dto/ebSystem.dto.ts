import { EbTokenDto } from './ebToken.dto';

export class EbSystemDto {
  systemId: number;
  systemCode: string;
  nit: number;
  business: string;
  modalityCode: number;
  image: string;
  token: EbTokenDto;
}
