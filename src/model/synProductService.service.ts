import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SynProductServiceDto } from './dto/synProductService.dto';
import { SynProductService } from '@prisma/client';

@Injectable()
export class SynProductServiceService {
  constructor(private prismaService: PrismaService) {}

  async create(
    synProductServiceDto: SynProductServiceDto,
  ): Promise<SynProductServiceDto> {
    const tmp = await this.findById(synProductServiceDto);

    if (tmp != null) return tmp;

    const synProductService = await this.prismaService.synProductService.create(
      {
        data: {
          productCode: synProductServiceDto.productCode,
          systemCode: synProductServiceDto.systemCode,
          nit: Number(synProductServiceDto.nit),
          activityCode: synProductServiceDto.activityCode,
          description: synProductServiceDto.description,
        },
      },
    );

    if (synProductService != null) {
      return this.mapSynProductServiceDto(synProductService);
    }

    return null;
  }

  async findById(
    synProductServiceDto: SynProductServiceDto,
  ): Promise<SynProductServiceDto> {
    const synProductService =
      await this.prismaService.synProductService.findUnique({
        where: {
          productCode_systemCode_nit_activityCode: {
            productCode: synProductServiceDto.productCode,
            systemCode: synProductServiceDto.systemCode,
            nit: Number(synProductServiceDto.nit),
            activityCode: synProductServiceDto.activityCode,
          },
        },
      });

    if (synProductService != null) {
      return this.mapSynProductServiceDto(synProductService);
    }

    return null;
  }

  async findBySystemCodeNit(
    systemCode: string,
    nit: number,
  ): Promise<SynProductServiceDto[]> {
    const list = await this.prismaService.synProductService.findMany({
      where: {
        systemCode: systemCode,
        nit: nit,
      },
    });

    return list.map((item) => {
      return this.mapSynProductServiceDto(item);
    });
  }

  async findBySystemCodeNitVisible(
    systemCode: string,
    nit: number,
  ): Promise<SynProductServiceDto[]> {
    const list = await this.prismaService.synProductService.findMany({
      where: {
        systemCode: systemCode,
        nit: nit,
      },
    });

    return list.map((item) => {
      return this.mapSynProductServiceDto(item);
    });
  }

  async findByProductCode( productCode:string, systemCode:string, nit:number): Promise<SynProductServiceDto> {
    const p= await this.prismaService.synProductService.findFirst({
      where: {
        productCode: productCode,
        systemCode: systemCode,
        nit: nit,
      }
    });
    if(p)
      return this.mapSynProductServiceDto(p);
    else
      throw new NotFoundException('Product ' + productCode +' data not found');
  }


  mapSynProductServiceDto(
    synProductService: SynProductService,
  ): SynProductServiceDto {
    const synProductServiceDto = new SynProductServiceDto();
    
    synProductServiceDto.productCode = synProductService.productCode;
    synProductServiceDto.systemCode = synProductService.systemCode;
    synProductServiceDto.activityCode = synProductService.activityCode;
    synProductServiceDto.nit = Number(synProductService.nit);
    synProductServiceDto.description = synProductService.description;

    return synProductServiceDto;
  }
}
