import { ApiProperty } from "@nestjs/swagger";

export class CreatePackagesDto {
    @ApiProperty()
    nit: number;
    @ApiProperty()
    sucursalCode: number;
    @ApiProperty()
    salePointCode: number;
    @ApiProperty()
    emitteType: number;
    @ApiProperty()
    sectorDocumentCode: string;
}