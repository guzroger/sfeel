import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EbCuis } from '@prisma/client';
import { EbCuisDto } from './dto/ebCuis.dto';
import { ParameterService } from '../common/parameter.service';
import { EbSystemDto } from './dto/ebSystem.dto';

@Injectable()
export class EbCuisService {
  constructor(private prismaService: PrismaService, private parameterService:ParameterService) {}

  async create(ebCuisDto: EbCuisDto): Promise<EbCuisDto> {
    const ebCuisTpm = await this.findByCuis(ebCuisDto.cuis);

    if (ebCuisTpm != null) return ebCuisTpm;

    const ebCuis = await this.prismaService.ebCuis.create({
      data: {
        cuis: ebCuisDto.cuis,
        expirationAt: ebCuisDto.expirationAt,
        systemCode: ebCuisDto.systemCode,
        nit: Number(ebCuisDto.nit),
        sucursalCode: ebCuisDto.sucursalCode,
        salePointCode: ebCuisDto.salePointCode,
        createdAt: this.parameterService.getNow()
      },
    });

    return this.mapEbCuisDto(ebCuis);
  }
  async findByCuis(cuis: string): Promise<EbCuisDto> {
    const ebCuis = await this.prismaService.ebCuis.findUnique({
      where: {
        cuis: cuis,
      },
    });

    if (ebCuis != null) {
      return this.mapEbCuisDto(ebCuis);
    }
    return null;
  }
  async findByExpirationDate(ebSystemDto:EbSystemDto, sucursalCode:number,salePointCode:number,  current: Date): Promise<EbCuisDto> {
    const ebCuis = await this.prismaService.ebCuis.findFirst({
      where: {
        systemCode: ebSystemDto.systemCode,
        nit: ebSystemDto.nit,
        sucursalCode: sucursalCode,
        salePointCode:salePointCode,
        expirationAt: { gte: current },
        createdAt: { lte: current },
      },
      orderBy: [{ expirationAt: 'desc' }],
    });

    if (ebCuis != null) {
      return this.mapEbCuisDto(ebCuis);
    }
    return null;
  }

  mapEbCuisDto(ebCuis: EbCuis): EbCuisDto {
    const ebCuisDto = new EbCuisDto();
    ebCuisDto.cuis = ebCuis.cuis;
    ebCuisDto.expirationAt = ebCuis.expirationAt;
    ebCuisDto.systemCode = ebCuis.systemCode;
    ebCuisDto.nit = Number(ebCuis.nit);
    ebCuisDto.sucursalCode = ebCuis.sucursalCode;
    ebCuisDto.salePointCode = ebCuis.salePointCode;

    return ebCuisDto;
  }
}
