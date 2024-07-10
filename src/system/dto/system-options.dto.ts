import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class SystemOptionsDto{
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  nit:number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  business
}