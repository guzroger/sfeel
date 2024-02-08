import { Injectable } from "@nestjs/common";
import { PrismaService } from 'src/prisma/prisma.service';
import { EbTransactionDto } from './dto/ebTransaction.dto';
import { ebTransaction } from "@prisma/client";
import { EbTransactionMessageService } from "./ebTransactionMessage.service";

@Injectable()
export class EbTransactionService {

    constructor(private  prismaService:PrismaService, private ebTransactionMessageService:EbTransactionMessageService){}

    async create(ebTransactionDto:EbTransactionDto){
        
        let numberDetail = 0;
        let listMessages = Array();
        if(ebTransactionDto.messages)
        {
            listMessages = ebTransactionDto.messages.map( (item) => {
                numberDetail++;
                return { 
                    order: numberDetail,
                    receptionCode: item.receptionCode,
                    description: item.description,
                    billId: item.billId,
                }
            } );
        }
        

        const ebTransaction= await this.prismaService.ebTransaction.create({
            data: {
                referenceId: ebTransactionDto.referenceId,
                operation: ebTransactionDto.operation,
                soapRequest: ebTransactionDto.soapRequest,
                soapResponse: ebTransactionDto.soapResponse,
                xml: ebTransactionDto.xml,
                receptionCode: ebTransactionDto.receptionCode,
                statusCode: ebTransactionDto.statusCode,
                statusDescription: ebTransactionDto.statusDescription,
                type: ebTransactionDto.type,
                cuf: ebTransactionDto.cuf,
                user: ebTransactionDto.user,
                messages: {
                    create : listMessages
                }
            }
        });

        if(ebTransaction!=null)           
            return this.mapEbTransactionDto(ebTransaction);
            
        return null;
    }

    mapEbTransactionDto(ebTransaction:ebTransaction):EbTransactionDto{
        const ebTransactionDto = new EbTransactionDto();
        ebTransactionDto.transactionId = Number(ebTransaction.transactionId);
        ebTransactionDto.referenceId = Number(ebTransaction.referenceId);
        ebTransactionDto.operation = ebTransaction.operation;
        ebTransactionDto.soapRequest = ebTransaction.soapRequest;
        ebTransactionDto.soapResponse = ebTransaction.soapResponse;
        ebTransactionDto.xml = ebTransaction.xml;
        ebTransactionDto.receptionCode = ebTransaction.receptionCode;
        ebTransactionDto.statusCode = ebTransaction.statusCode;
        ebTransactionDto.statusDescription = ebTransaction.statusDescription;
        ebTransactionDto.type = ebTransaction.type;
        ebTransactionDto.cuf = ebTransaction.cuf;
        ebTransactionDto.user = ebTransaction.user;
        ebTransactionDto.createdAt = ebTransaction.createdAt;
    

        return ebTransactionDto
    }
}