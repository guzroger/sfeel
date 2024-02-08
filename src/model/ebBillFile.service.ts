import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { EbBillFileDto } from "./dto/ebBillFile.dto";
import { ebBillFile } from "@prisma/client";


@Injectable()
export class EbBillFileService {
    constructor(private prismaService:PrismaService){}

    async save(ebBillFileDto:EbBillFileDto, tx:any = this.prismaService){
        const tmp = await this.findById(ebBillFileDto.billId);

        if(!tmp){
            const ebBillFile =  await tx.ebBillFile.create({
                data: {
                    billId: ebBillFileDto.billId,
                    xml:ebBillFileDto.xml,
                    createdAt: new Date()
                }
            });

            if(!ebBillFile) return null;        

            return this.mapEbBillFileDto(ebBillFile);
        }
        else {
            const ebBillFile =  await  tx.ebBillFile.update({
                where: { billId: ebBillFileDto.billId},
                data: {
                    xml:ebBillFileDto.xml,
                    createdAt: new Date()
                }
            });

            if(!ebBillFile) return null;        

            return this.mapEbBillFileDto(ebBillFile);
        }
        
        
    }

    async findById(billId:number, tx = this.prismaService) {
        const ebBillFile = await tx.ebBillFile.findUnique({
            where: {
                billId: billId
            }
        });

        if(!ebBillFile) return null;

        return this.mapEbBillFileDto(ebBillFile);
    }

    async saveXml(billId:number, xml:string,  tx:any = this.prismaService ){
        const ebBillFileDto = new EbBillFileDto();
        ebBillFileDto.billId = billId;
        ebBillFileDto.xml = xml;
    
        const tmp = await this.save(ebBillFileDto, tx);
        return tmp;
      }

    mapEbBillFileDto(ebBillFile:ebBillFile){
        const ebBillFileDto = new EbBillFileDto();
        ebBillFileDto.billId = Number(ebBillFile.billId);
        ebBillFileDto.xml = ebBillFile.xml;
        ebBillFileDto.createdAt = ebBillFile.createdAt;

        return ebBillFileDto;
    }
}