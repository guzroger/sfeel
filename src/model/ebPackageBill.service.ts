import { Injectable } from '@nestjs/common';
import { EbPackageBillDto } from './dto/ebPackageBill.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ebBill, ebBillDetail, ebPackageBill } from '@prisma/client';
import { EbBillService } from './ebBill.service';
import { async } from 'rxjs';
import { EbBillDto } from './dto/ebBill.dto';
import { Constants } from 'src/common/enum/constants.enum';

@Injectable()
export class EbPackageBillService {
    constructor(private prismaService:PrismaService, private ebBillService:EbBillService){}

    async create(ebPackageBillDto: EbPackageBillDto){

        /*await this.prismaService.$transaction(async (tx) => {
            const ebPackageBill = await tx.ebPackageBill.create({
                data:{
                    cufd: ebPackageBillDto.cufd,
                    billStatusId: Number(Constants.BillStatusNew),
                    nitEmitter: ebPackageBillDto.nitEmitter,
                    sucursalCode: ebPackageBillDto.sucursalCode,
                    salePointCode: ebPackageBillDto.salePointCode,
                    emitteType: ebPackageBillDto.emitteType,
                    modalityCode: ebPackageBillDto.modalityCode,
                    sectorDocumentCode: ebPackageBillDto.sectorDocumentCode,
                    documentTaxCode:ebPackageBillDto.documentTaxCode,
                    receptionCode: ebPackageBillDto.receptionCode,
                    statusCode: ebPackageBillDto.receptionCode,
                    statusDescription: ebPackageBillDto.statusDescription,
                    eventCode: ebPackageBillDto.eventCode,
                    cafc: ebPackageBillDto.cafc,
                    systemCode: ebPackageBillDto.systemCode,
                }
            });
            
            for (const item of ebPackageBillDto.bills) {
                await tx.ebBill.update({
                    where: { billId: item.billId },
                    data:{ packageId: ebPackageBill.packageId}
                  });
            }

            await Promise.all(ebPackageBillDto.bills.map( async item => {
                 await tx.ebBill.update({
                    where: { billId: item.billId },
                    data:{ packageId: ebPackageBill.packageId}
                  });
                
            }));
    
            return this.mapEbPackageBillDto(ebPackageBill, null);
        },{
            maxWait: 20000, // default: 2000
            timeout: 60000, // default: 5000
          });*/

        const ebPackageBill = await this.prismaService.ebPackageBill.create({
            data:{
                cufd: ebPackageBillDto.cufd,
                billStatusId: Number(Constants.BillStatusNew),
                nitEmitter: ebPackageBillDto.nitEmitter,
                sucursalCode: ebPackageBillDto.sucursalCode,
                salePointCode: ebPackageBillDto.salePointCode,
                emitteType: ebPackageBillDto.emitteType,
                modalityCode: ebPackageBillDto.modalityCode,
                sectorDocumentCode: ebPackageBillDto.sectorDocumentCode,
                documentTaxCode:ebPackageBillDto.documentTaxCode,
                receptionCode: ebPackageBillDto.receptionCode,
                statusCode: ebPackageBillDto.receptionCode,
                statusDescription: ebPackageBillDto.statusDescription,
                eventCode: ebPackageBillDto.eventCode,
                cafc: ebPackageBillDto.cafc,
                systemCode: ebPackageBillDto.systemCode,
            }   
        });

        const billIds = ebPackageBillDto.bills.map( (item) => { return  item.billId; });

        await this.prismaService.ebBill.updateMany({
            where: { billId : { in:  billIds } },
            data: {
                packageId: ebPackageBill.packageId
            }
        });

        /*Promise.all(ebPackageBillDto.bills.map( async item => {
             await this.prismaService.ebBill.update({
                where: { billId: item.billId },
                data:{ packageId: ebPackageBill.packageId}
              });
            
        }));*/

        return this.mapEbPackageBillDto(ebPackageBill, null);

    }

    async update(ebPackageBillDto: EbPackageBillDto){
        const tmp = this.findById(ebPackageBillDto.packageId);
        if(!tmp) return null;
        
        const ebPackageBillDtoUpdated =  await this.prismaService.ebPackageBill.update({
                                where: { packageId: ebPackageBillDto.packageId, },
                                data:{
                                    cufd: ebPackageBillDto.cufd,
                                    billStatusId: ebPackageBillDto.billStatusId,
                                    nitEmitter: ebPackageBillDto.nitEmitter,
                                    sucursalCode: ebPackageBillDto.sucursalCode,
                                    salePointCode: ebPackageBillDto.salePointCode,
                                    emitteType: ebPackageBillDto.emitteType,
                                    modalityCode: ebPackageBillDto.modalityCode,
                                    sectorDocumentCode: ebPackageBillDto.sectorDocumentCode,
                                    documentTaxCode:ebPackageBillDto.documentTaxCode,
                                    receptionCode: ebPackageBillDto.receptionCode,
                                    statusCode: ebPackageBillDto.statusCode,
                                    statusDescription: ebPackageBillDto.statusDescription,
                                    eventCode: ebPackageBillDto.eventCode,
                                    cafc: ebPackageBillDto.cafc,
                                    systemCode: ebPackageBillDto.systemCode,
                                }
                            });
        return this.mapEbPackageBillDto(ebPackageBillDtoUpdated, null);                    
    }

    async findById(packageId:number){
        const ebPackageBill = await this.prismaService.ebPackageBill.findUnique({
            where: {
              packageId: BigInt(packageId),
            },
            include: {
              bills: {
                include: {
                    details: true
                }
              },
            }
          });
          
          if (ebPackageBill != null) {  
            const bills = ebPackageBill.bills.map(item => { return this.ebBillService.mapEbBillDto(item, item.details) } );          
            return this.mapEbPackageBillDto(ebPackageBill, bills);
          }
      
          return null;
    }


    mapEbPackageBillDto(ebPackageBill:ebPackageBill, bills:EbBillDto[]): EbPackageBillDto {
        const ebPackageBillDto = new EbPackageBillDto();
        ebPackageBillDto.packageId = Number(ebPackageBill.packageId);
        ebPackageBillDto.cufd = ebPackageBill.cufd;
        ebPackageBillDto.billStatusId = ebPackageBill.billStatusId;
        ebPackageBillDto.nitEmitter = Number(ebPackageBill.nitEmitter);
        ebPackageBillDto.sucursalCode = ebPackageBill.sucursalCode;
        ebPackageBillDto.salePointCode = ebPackageBill.salePointCode;
        ebPackageBillDto.emitteType = ebPackageBill.emitteType;
        ebPackageBillDto.modalityCode = ebPackageBill.modalityCode;
        ebPackageBillDto.sectorDocumentCode = ebPackageBill.sectorDocumentCode;
        ebPackageBillDto.documentTaxCode = ebPackageBill.documentTaxCode;
        ebPackageBillDto.receptionCode = ebPackageBill.receptionCode;
        ebPackageBillDto.statusCode = ebPackageBill.receptionCode;
        ebPackageBillDto.statusDescription = ebPackageBill.statusDescription;
        ebPackageBillDto.eventCode = ebPackageBill.eventCode;
        ebPackageBillDto.cafc = ebPackageBill.cafc;
        ebPackageBillDto.systemCode = ebPackageBill.systemCode;

        ebPackageBillDto.bills = bills;
        
        
        return ebPackageBillDto;
    }
}