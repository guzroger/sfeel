import { Injectable } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { EbTransactionMessageDto } from './dto/ebTransactionMessage.dto';
import { ebTransactionMessage } from "@prisma/client";

@Injectable()
export class EbTransactionMessageService {
    constructor(private  prismaService:PrismaService){}

    async create(ebTransactionMessageDto:EbTransactionMessageDto):Promise<EbTransactionMessageDto> {

        const ebTransactionMessage = await  this.prismaService.ebTransactionMessage.create({
            data: {
                transactionId: ebTransactionMessageDto.transactionId,
                order: ebTransactionMessageDto.order,
                receptionCode: ebTransactionMessageDto.receptionCode,
                description: ebTransactionMessageDto.description,
                billId: ebTransactionMessageDto.billId,
            }
        });

        return this.mapEbTransactionMessageDto(ebTransactionMessage);
    }

    mapEbTransactionMessageDto(ebTransactionMessage:ebTransactionMessage): EbTransactionMessageDto{
        const ebTransactionMessageDto = new EbTransactionMessageDto();
        ebTransactionMessageDto.transactionId = Number(ebTransactionMessage.transactionId);
        ebTransactionMessageDto.order = ebTransactionMessage.order;
        ebTransactionMessageDto.receptionCode = ebTransactionMessage.receptionCode;
        ebTransactionMessageDto.description = ebTransactionMessage.description;
        ebTransactionMessageDto.billId = Number(ebTransactionMessage.billId);

        return ebTransactionMessageDto;
    }
}