import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { EbSystemDto } from './dto/ebSystem.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EbTokenDto } from './dto/ebToken.dto';
import { ParameterService } from '../common/parameter.service';
import { EbSystem, Status } from '@prisma/client';

@Injectable()
export class EbSystemService {
  constructor(
    private prismaService: PrismaService,
    private parameterService: ParameterService,
  ) {}

  async create(ebSystemDto: EbSystemDto): Promise<EbSystemDto> {
    try{
      const tmp = await this.findBySystemCodeAndNit(
        ebSystemDto.systemCode,
        ebSystemDto.nit,
      );

      if (tmp != null) return tmp;
    } catch(NotFoundException){
      
    }

    return null;
  }

  async findBySystemCodeAndNit(
    systemCode: string,
    nit: number,
  ): Promise<EbSystemDto> {
    const currentDate = this.parameterService.getNow();
    
    const ebSystem = await this.prismaService.ebSystem.findUnique({
      where: {
        systemCode_nit: { systemCode: systemCode, nit: Number(nit) },
        status: 'ACTIVE'
      },
      include: {
        tokens: {
          where: {
            startAt: { lte: currentDate },
            expirationAt: { gte: currentDate },
          },
        },
      },
    });

    if (ebSystem != null) {
      
      const ebSystemDto = this.mapEbSystem(ebSystem);
      
      ebSystem.tokens.forEach((token) => {
        const ebTokenDto = new EbTokenDto();
        ebTokenDto.tokenId = token.id;
        ebTokenDto.token = token.token;
        ebTokenDto.startAt = token.startAt;
        ebTokenDto.expirationAt = token.expirationAt;

        ebSystemDto.token = ebTokenDto;
      });

      if(!ebSystemDto.token)
        throw new NotFoundException('Token is not found or it has expired');

      return ebSystemDto;
    }
    else{
      throw new NotFoundException('Bussines data not found');
    }

    return null;
  }

  async findSystems(): Promise<EbSystemDto[]>{
    const list = await this.prismaService.ebSystem.findMany({  where: { 
      status: Status.ACTIVE
    } });

    return list.map( item => {
      return this.mapEbSystem(item);
    })
  }

  mapEbSystem(ebSystem: EbSystem): EbSystemDto {
    const ebSystemDto = new EbSystemDto();

    ebSystemDto.systemId = ebSystem.id;
    ebSystemDto.systemCode = ebSystem.systemCode;
    ebSystemDto.nit = Number(ebSystem.nit);
    ebSystemDto.modalityCode = ebSystem.modalityCode;
    ebSystemDto.business = ebSystem.business;

    return ebSystemDto;
  }
}
