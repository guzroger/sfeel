import { Injectable, NotFoundException } from "@nestjs/common";
import { Status, ebDosification } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { EbDosificationDto } from './dto/ebDosification.dto';

@Injectable()
export class EbDosificationService {
    constructor(private prismaService: PrismaService) {}

    async findValid(systemCode:string, nit:number,sectorDocumentCode:string, type:string, modalityCode:number ):Promise<EbDosificationDto>{
        const event = await this.prismaService.ebDosification.findFirst(
            {
                where: {
                    systemCode: systemCode,
                    nit: nit,
                    sectorDocumentCode: sectorDocumentCode,
                    status: Status.ACTIVE,
                    type:type,
                    OR: [  { modalityCode: 0  },
                           { modalityCode: modalityCode} ]
                },
                orderBy: [ { current: 'desc'}]
            }
        );
        return this.mapEbDosification(event);
    }

    async update(ebDosificationDto:EbDosificationDto) :Promise<EbDosificationDto>{
        const tmp = this.findById(ebDosificationDto.code);
            if (tmp == null) return null;
        
        const ebBill = await this.prismaService.ebDosification.update({
            where: {
                code: ebDosificationDto.code,
            },
            data: {
                systemCode: ebDosificationDto.systemCode,
                sectorDocumentCode: ebDosificationDto.sectorDocumentCode,
                begin: ebDosificationDto.begin,
                last: ebDosificationDto.last,
                current: ebDosificationDto.current,
                type: ebDosificationDto.type,
                nit: ebDosificationDto.nit,
            },
            });
    }

    async findById(code:string): Promise<EbDosificationDto> {
        const ebDosification = await this.prismaService.ebDosification.findUnique({
            where: {
              code: code,
            }
          });
          
          if (ebDosification) {
            return this.mapEbDosification(ebDosification);
          }
          return null;
    }

    mapEbDosification(ebDosification:ebDosification):EbDosificationDto {
        const ebDosificationDto = new EbDosificationDto();

        ebDosificationDto.code = ebDosification.code;
        ebDosificationDto.sectorDocumentCode = ebDosification.sectorDocumentCode;
        ebDosificationDto.begin = ebDosification.begin;
        ebDosificationDto.last = ebDosification.begin;
        ebDosificationDto.current = ebDosification.begin;
        ebDosificationDto.type = ebDosification.type;
        ebDosificationDto.nit = Number(ebDosification.nit);
        ebDosificationDto.systemCode = ebDosification.systemCode;
        ebDosificationDto.modalityCode = ebDosification.modalityCode;

        return ebDosificationDto
    }
}