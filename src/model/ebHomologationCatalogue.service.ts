import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { EbHomologationCatalogueDto } from "./dto/ebHomologationCatalogue.dto";
import { EbHomologationCatalogue } from "@prisma/client";

@Injectable()
export class EbHomologationCatalogueService {
    constructor(private prismaService:PrismaService){}

    async create(ebHomologationCatalogueDto:EbHomologationCatalogueDto){
        const ebHomologation = await  this.prismaService.ebHomologationCatalogue.create({
            data: {
                code:ebHomologationCatalogueDto.code,
                systemCode: ebHomologationCatalogueDto.systemCode,
                nit: ebHomologationCatalogueDto.nit,
                type: ebHomologationCatalogueDto.type,
                codeHomologated:ebHomologationCatalogueDto.codeHomologated,
                description: ebHomologationCatalogueDto.description,
            }
        });

        if(ebHomologation!=null)
            return this.mapEbHomologationCatalogueDto(ebHomologation);
        return null;
    }

    async update(ebHomologationCatalogueDto:EbHomologationCatalogueDto){
        const ebHomologation = await  this.prismaService.ebHomologationCatalogue.update({
            where:{
                code_type_systemCode_nit: {
                    code:ebHomologationCatalogueDto.code,
                    systemCode: ebHomologationCatalogueDto.systemCode,
                    nit: ebHomologationCatalogueDto.nit,
                    type: ebHomologationCatalogueDto.type,
                }
            },
            data: {
                code:ebHomologationCatalogueDto.code,
                systemCode: ebHomologationCatalogueDto.systemCode,
                nit: ebHomologationCatalogueDto.nit,
                type: ebHomologationCatalogueDto.type,
                codeHomologated:ebHomologationCatalogueDto.codeHomologated,
                description: ebHomologationCatalogueDto.description,
            }
        });

        if(ebHomologation!=null)
            return this.mapEbHomologationCatalogueDto(ebHomologation);
        return null;
    }

    async findById(code:string, systemCode:string, nit:number, type:string){
        const tmp = await this.prismaService.ebHomologationCatalogue.findUnique({
            where: {
                code_type_systemCode_nit: {
                    code:code,
                    systemCode: systemCode,
                    nit: nit,
                    type: type,
                }
            }
        });

        if(tmp!=null)
            return this.mapEbHomologationCatalogueDto(tmp);
        else
            return null;
    }

    async findByTypeSystemCodeNit(type: string,systemCode: string, nit: number,): Promise<EbHomologationCatalogueDto[]> {
        const list = await this.prismaService.ebHomologationCatalogue.findMany({
          where: {
            type: type,
            systemCode: systemCode,
            nit: Number(nit),
          },
        });
        return list.map((item) => {
            return this.mapEbHomologationCatalogueDto(item);
          });
    }

    mapEbHomologationCatalogueDto(ebHomologationCatalogue:EbHomologationCatalogue){
        const ebHomologationCatalogueDto = new EbHomologationCatalogueDto();
        ebHomologationCatalogueDto.code = ebHomologationCatalogue.code;
        ebHomologationCatalogueDto.systemCode = ebHomologationCatalogue.systemCode;
        ebHomologationCatalogueDto.nit = Number(ebHomologationCatalogue.nit);
        ebHomologationCatalogueDto.codeHomologated = ebHomologationCatalogue.codeHomologated;
        ebHomologationCatalogueDto.type = ebHomologationCatalogue.type;
        ebHomologationCatalogueDto.createdAt = ebHomologationCatalogue.createdAt;
        ebHomologationCatalogueDto.description = ebHomologationCatalogue.description;

        return ebHomologationCatalogueDto;
    }
}