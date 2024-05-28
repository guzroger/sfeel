import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { EbHomologationProductServiceDto } from "./dto/ebHomologationProductService.dto";
import { EbHomologationProductService } from "@prisma/client";

@Injectable()
export class EbHomologationProductServiceService {
    constructor(private prismaService:PrismaService){}

    async create(ebHomologationProductServiceDto:EbHomologationProductServiceDto){
        const ebHomologation = await  this.prismaService.ebHomologationProductService.create({
            data: {
                productCode: ebHomologationProductServiceDto.productCode,
                systemCode: ebHomologationProductServiceDto.systemCode,
                nit: ebHomologationProductServiceDto.nit,
                activityCode: ebHomologationProductServiceDto.activityCode,
                codeHomologated:ebHomologationProductServiceDto.codeHomologated,
                description: ebHomologationProductServiceDto.description,
            }
        });

        if(ebHomologation!=null)
            return this.EbHomologationProductServiceDto(ebHomologation);
        return null;
    }

    async update(ebHomologationProductServiceDto:EbHomologationProductServiceDto){
        const ebHomologationCat = await  this.prismaService.ebHomologationProductService.update({
            where:{
                productCode_systemCode_nit_activityCode: {
                    productCode:ebHomologationProductServiceDto.productCode,
                    systemCode: ebHomologationProductServiceDto.systemCode,
                    nit: ebHomologationProductServiceDto.nit,
                    activityCode: ebHomologationProductServiceDto.activityCode,
                }
            },
            data: {
                productCode:ebHomologationProductServiceDto.productCode,
                systemCode: ebHomologationProductServiceDto.systemCode,
                nit: ebHomologationProductServiceDto.nit,
                activityCode: ebHomologationProductServiceDto.activityCode,
                codeHomologated:ebHomologationProductServiceDto.codeHomologated,
                description: ebHomologationProductServiceDto.description,
            }
        });
    }

    async delete( systemCode:string, nit:number, codeHomologated:string){
        return await this.prismaService.ebHomologationProductService.deleteMany({
            where: {
                systemCode: systemCode,
                nit: nit,
                codeHomologated:  codeHomologated
            }
        });
    }

    async findById(productCode:string, systemCode:string, nit:number, activityCode:string){
        const tmp = await this.prismaService.ebHomologationProductService.findUnique({
            where: {
                productCode_systemCode_nit_activityCode: {
                    productCode:productCode,
                    systemCode: systemCode,
                    nit: nit,
                    activityCode: activityCode,
                }
            }
        });

        if(tmp!=null)
            return this.EbHomologationProductServiceDto(tmp);
        else
            return null;
    }

    async findBySystemCodeNit(systemCode: string, nit: number,): Promise<EbHomologationProductServiceDto[]> {
        const list = await this.prismaService.ebHomologationProductService.findMany({
          where: {
            systemCode: systemCode,
            nit: nit,
          },
        });
    
        return list.map((item) => {
          return this.EbHomologationProductServiceDto(item);
        });
      }

    EbHomologationProductServiceDto(ebHomologationProductService:EbHomologationProductService){
        const ebHomologationProductServiceDto = new EbHomologationProductServiceDto();
        ebHomologationProductServiceDto.productCode = ebHomologationProductService.productCode;
        ebHomologationProductServiceDto.systemCode = ebHomologationProductService.systemCode;
        ebHomologationProductServiceDto.nit = Number(ebHomologationProductService.nit);
        ebHomologationProductServiceDto.codeHomologated = ebHomologationProductService.codeHomologated;
        ebHomologationProductServiceDto.activityCode = ebHomologationProductService.activityCode;
        ebHomologationProductServiceDto.createdAt = ebHomologationProductService.createdAt;
        ebHomologationProductServiceDto.description = ebHomologationProductService.description;

        return ebHomologationProductServiceDto;
    }
}