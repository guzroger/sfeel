import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSucursalDto {
  @ApiProperty()
  @IsString()
  sucursalCode:number;
  @ApiProperty()
  @IsString()
  description:string;
  @ApiProperty()
  @IsNumber()
  modalityCode:number;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address:string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone:string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  municipality:string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city:string;
  
  @ApiProperty()
  nit:number;
 
}