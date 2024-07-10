import { ApiProperty } from "@nestjs/swagger";
import { MensajesListDto } from "src/common/dto/mensajesList.dto";


export class SendPackageResponseDto{
    @ApiProperty()
    receptionCode: string;
    @ApiProperty()
    statusCode: string;
    @ApiProperty()
    statusDescription: string;
    @ApiProperty()
    message: string;
    @ApiProperty()
    mensajesList:MensajesListDto[]|MensajesListDto
}