import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EbSucursal } from '@prisma/client';
import { EbSucursalDto } from './dto/ebSucursal.dto';

@Injectable()
export class EbSucursalService {
  constructor(private prismaService: PrismaService) {}

  async findBySucursalCode(sucursalCode: number, systemId: number) {
    const ebSucursal = await this.prismaService.ebSucursal.findFirst({
      where: {
        sucursalCode: sucursalCode,
        systemId: systemId,
      },
      orderBy: [{ id: 'desc' }],
    });

    if (ebSucursal != null) return this.mapEbSucursalDto(ebSucursal);
    else
      throw new NotFoundException('Sucursal data not found');

    return null;
  }

  async findSucursales(systemId:number):Promise<EbSucursalDto[]>{
    const list = await this.prismaService.ebSucursal.findMany({ where: { systemId: systemId }});

    return list.map( item => {
      return this.mapEbSucursalDto(item);
    })
  }

  mapEbSucursalDto(ebSucursal: EbSucursal): EbSucursalDto {
    const ebSucursalDto = new EbSucursalDto();
    ebSucursalDto.id = ebSucursal.id;
    ebSucursalDto.sucursalCode = ebSucursal.sucursalCode;
    ebSucursalDto.description = ebSucursal.description;
    ebSucursalDto.modalityCode = ebSucursal.modalityCode;
    ebSucursalDto.address = ebSucursal.address;
    ebSucursalDto.phone = ebSucursal.phone;
    ebSucursalDto.municipality = ebSucursal.municipality;
    ebSucursalDto.city = ebSucursal.city;
    ebSucursalDto.status = ebSucursal.status;
    ebSucursalDto.systemId = ebSucursal.systemId;

    return ebSucursalDto;
  }
}
