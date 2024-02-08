import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EbSalePoint, Status } from '@prisma/client';
import { EbSalePointDto } from './dto/ebSalePoint.dto';
import { EbSystemDto } from './dto/ebSystem.dto';

@Injectable()
export class EbSalePointService {
  constructor(private prismaService: PrismaService) {}

  async create(ebSalePointDto:EbSalePointDto){
    const sucursal = await this.prismaService.ebSucursal.findUnique ({ where: { id: ebSalePointDto.sucursalId}
    });

    const tmp = await this.prismaService.ebSalePoint.create({
      data: {
        salePointCode: ebSalePointDto.salePointCode,
        description: ebSalePointDto.description,
        modalityCode: ebSalePointDto.modalityCode,
        typeSalePoint: ebSalePointDto.typeSalePoint,
        status: Status.ACTIVE,
        sucursalId: sucursal.id,
      }
    });

    if(tmp)
      return this.mapEbSalePointDto(tmp);
    return null;
  }



  async findBySalePointCode(salePointCode: number, sucursalId: number) {
    const ebSalePoint = await this.prismaService.ebSalePoint.findFirst({
      where: {
        salePointCode: salePointCode,
        sucursalId: sucursalId,
      },
      orderBy: [{ id: 'desc' }],
    });

    if (ebSalePoint != null) return this.mapEbSalePointDto(ebSalePoint);
    else{
      const ebSalePointDto = new EbSalePointDto();

      ebSalePointDto.salePointCode = 0;
      ebSalePointDto.description = 'Default';
      ebSalePointDto.modalityCode = 1;
      ebSalePointDto.typeSalePoint = 1;
      ebSalePointDto.status = Status.ACTIVE;
      ebSalePointDto.sucursalId = sucursalId;

      return ebSalePointDto;
    }
  }


  async findSalePoints(sucursalId:number){
    const list = await this.prismaService.ebSalePoint.findMany({ where: { sucursalId: sucursalId }});
    return list.map(ebSalePoint => {
      return this.mapEbSalePointDto(ebSalePoint);
    });
  }
  mapEbSalePointDto(ebSalePoint: EbSalePoint): EbSalePointDto {
    const ebSalePointDto = new EbSalePointDto();

    ebSalePointDto.id = ebSalePoint.id;
    ebSalePointDto.salePointCode = ebSalePoint.salePointCode;
    ebSalePointDto.description = ebSalePoint.description;
    ebSalePointDto.modalityCode = ebSalePoint.modalityCode;
    ebSalePointDto.typeSalePoint = ebSalePoint.typeSalePoint;
    ebSalePointDto.status = ebSalePoint.status;
    ebSalePointDto.createdAt = ebSalePoint.createdAt;
    ebSalePointDto.updatedAt = ebSalePoint.updatedAt;
    ebSalePointDto.sucursalId = ebSalePoint.sucursalId;

    return ebSalePointDto;
  }
}
