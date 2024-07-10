import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PageOptionsDto } from "src/common/dto/pageOptions.dt";
import { BillFieldEnum } from "../enum/bill-filed-enum";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class BillPageOptionsDto extends PageOptionsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  sucursalCode:number;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  salePointCode:number;

  @ApiPropertyOptional()
  dateBegin:string;
  @ApiPropertyOptional()
  dateEnd:string;
  @ApiPropertyOptional()
  billId:number;
  @ApiPropertyOptional()
  cuf:string;
  @ApiPropertyOptional()
  number:number;

  @ApiPropertyOptional({ enum: BillFieldEnum , default: BillFieldEnum.dateEmitte })
  @IsEnum(BillFieldEnum)
  @IsOptional()
  readonly orderBy?:BillFieldEnum = BillFieldEnum.dateEmitte;
}