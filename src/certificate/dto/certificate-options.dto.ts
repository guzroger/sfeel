import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class CertificateOptionsDto{
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  nit:number;
}