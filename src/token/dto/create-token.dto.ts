import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTokenDto {
  @ApiProperty()
  @IsString()
  token:string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  startAt:Date;
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  expirationAt:Date;

  @ApiProperty()
  nit:number;
  
 
}