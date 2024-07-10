import { EbBillDto } from "src/model/dto/ebBill.dto";
import { EbSucursalDto } from "src/model/dto/ebSucursal.dto";
import { EbSystemDto } from "src/model/dto/ebSystem.dto";

export interface TemplatePdf {
  letter( ebBillDto:EbBillDto, ebSystemDto:EbSystemDto, ebSucursalDto: EbSucursalDto, qr:string);
  
  roll( ebBillDto:EbBillDto, ebSystemDto:EbSystemDto, ebSucursalDto: EbSucursalDto, qr:string);
}