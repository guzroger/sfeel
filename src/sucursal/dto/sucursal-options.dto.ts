import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class SucursalOptionsDto{
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  nit:number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sucursalCode:number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description
}