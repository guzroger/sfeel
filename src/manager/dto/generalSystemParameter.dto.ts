import { ApiProperty } from "@nestjs/swagger";

export class GeneralSystemParameterDto {
    @ApiProperty()
    nit:number;
    @ApiProperty()
    sucursalCode:number;
    @ApiProperty()
    salePoint:number;
}