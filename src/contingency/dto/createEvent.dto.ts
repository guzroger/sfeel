import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateEventDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    nit:number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    sucursalCode:number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    salePointCode:number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    eventType:number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description:string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    cafc:string;

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    selfManageable:boolean;

    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    beginAt:string;

    @ApiProperty()
    endAt:string;
    
    @ApiProperty()
    sectorDocumentCode:string;
}