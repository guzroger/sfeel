import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { EbPackageFileDto } from "./dto/ebPackageFile.dto";
import { ebPackageFile } from "@prisma/client";

@Injectable()
export class EbPackageFileService {
    constructor(private prismaService:PrismaService){}

    async save(ebPackageFileDto:EbPackageFileDto):Promise<EbPackageFileDto>{
        const tmp = await this.findById(ebPackageFileDto.packageId);
        
        if(tmp==null){
            try {
                const ebPackageFile = await this.prismaService.ebPackageFile.create({ 
                    data: {
                        packageId: ebPackageFileDto.packageId,
                        file: ebPackageFileDto.file,
                        createdAt: ebPackageFileDto.createdAt
                    }
                });
                if(!ebPackageFile) return null;

                return this.mapEbPackageFileDto(ebPackageFile);
            }
            catch (error){
                console.log(error);
            }
            return null;
            
        }
        else{
            const ebPackageFile = await this.prismaService.ebPackageFile.update({ 
                where: { packageId: ebPackageFileDto.packageId},
                data: {
                    packageId: ebPackageFileDto.packageId,
                    file: ebPackageFileDto.file,
                    createdAt: ebPackageFileDto.createdAt
                }
            });
            if(!ebPackageFile) return null;

            return this.mapEbPackageFileDto(ebPackageFile);
        }
    }
    async findById(packageId):Promise<EbPackageFileDto>{
        const ebPackageFile = await this.prismaService.ebPackageFile.findUnique({ where: { packageId: packageId }});
        
        if(!ebPackageFile) return null;
        return this.mapEbPackageFileDto(ebPackageFile);
    }

    async saveFile(buffer:Buffer ,packageId:number) {
        const ebPackageFileDto = new EbPackageFileDto();
        ebPackageFileDto.packageId = packageId;
        ebPackageFileDto.file = buffer;
        ebPackageFileDto.createdAt = new Date();

        const c = await this.save(ebPackageFileDto);
        return c;
    }

    mapEbPackageFileDto(ebPackageFile:ebPackageFile):EbPackageFileDto{
        const ebPackageFileDto = new EbPackageFileDto();
        ebPackageFileDto.packageId = Number(ebPackageFile.packageId);
        ebPackageFileDto.file =  ebPackageFile.file;
        ebPackageFileDto.createdAt = ebPackageFile.createdAt;

        return ebPackageFileDto
    }
}