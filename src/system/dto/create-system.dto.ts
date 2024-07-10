import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSystemDto {
  @ApiProperty()
  @IsNumber()
  nit:number;

  @ApiProperty()
  @IsString()
  business:string;

  @ApiProperty()
  @IsNumber()
  modalityCode:number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image:string;
  
}