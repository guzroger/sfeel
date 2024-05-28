import { EbSystemDto } from "./ebSystem.dto";

export class SeUserDto {
  id:number;
  name:string;
  email:string;
  password:string;
  salePointCode:number;
  systemId:number;
  ebSystemDto:EbSystemDto;
}