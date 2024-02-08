import { OmitType } from "@nestjs/swagger";
import { EbBillDetailDto } from "./ebBillDetail.dto";

export class EbRentBillDetailDto extends OmitType(EbBillDetailDto, [
  "order",
  "serieNumber",
  "imeiNumber",
]) {}
