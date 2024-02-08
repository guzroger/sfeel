import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { GeConstantDto } from './dto/geConstant.dto';
import { GeConstant } from "@prisma/client";

@Injectable()
export class GeConstantService {
    constructor(private prismaService:PrismaService){}

    async findById(code:string, codeGroup:string):Promise<GeConstantDto>{
        
        const geConstant = await this.prismaService.geConstant.findUnique({
            where: {
                code_codeGroup: { code: code, codeGroup: codeGroup },
            }
        });

        if(geConstant!=null)
            return this.mapGeConstantDto(geConstant);

        return null;
    }

    mapGeConstantDto(geConstant:GeConstant):GeConstantDto {
        const geConstantDto = new GeConstantDto(); 

        geConstantDto.code = geConstant.code;
        geConstantDto.codeGroup = geConstant.codeGroup;
        geConstantDto.value = geConstant.value
        geConstantDto.description = geConstant.description;
        geConstantDto.observation = geConstant.observation;
        
        return geConstantDto;
    }

}