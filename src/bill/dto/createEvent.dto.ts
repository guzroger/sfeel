import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

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

    @ApiProperty()
    @IsString()
    cafc:string;

    @ApiProperty()
    @IsBoolean()
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