import { ApiProperty } from "@nestjs/swagger"

export class SendPackage {
    @ApiProperty()
    packageId:number
    @ApiProperty()
    nit:number
}