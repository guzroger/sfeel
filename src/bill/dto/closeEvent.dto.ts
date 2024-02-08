import { ApiProperty } from "@nestjs/swagger";

export class CloseEventDto {
    @ApiProperty()
    eventId:number;
    @ApiProperty()
    nit:number;
}