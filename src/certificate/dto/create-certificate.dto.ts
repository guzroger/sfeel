import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCertificateDto {
  @ApiProperty({ enum: { PRIMARY_KEY: 'PRIMARY_KEY', PUBLIC_KEY:'PUBLIC_KEY'} , default: 'PRIMARY_KEY' })
  @IsEnum( { PRIMARY_KEY: 'PRIMARY_KEY', PUBLIC_KEY:'PUBLIC_KEY'})
  certificateType:string;

  @ApiProperty({ enum: { TEXT: 'TEXT', X509:'X509', p12:'P12'} , default: 'TEXT' })
  @IsEnum( { TEXT: 'TEXT', X509:'X509', p12:'P12'})
  typeStorage:string;

  @ApiProperty()
  @IsDateString()
  expirationAt:Date;

  @ApiProperty()
  @IsNumber()
  nit:number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  idRef:number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  certificate:string;

}