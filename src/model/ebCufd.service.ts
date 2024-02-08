import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EbCufdDto } from './dto/ebCufd.dto';
import { EbCufd } from '@prisma/client';
import { ParameterService } from 'src/common/parameter.service';
import { EbSystemDto } from './dto/ebSystem.dto';

@Injectable()
export class EbCufdService {
  constructor(private prismaService: PrismaService, private parameterService:ParameterService) {}

  async create(ebCufdDto: EbCufdDto): Promise<EbCufdDto> {
    const ebCufdTpm = await this.findByCufd(ebCufdDto.cufd);

    if (ebCufdTpm != null) return ebCufdTpm;

    const ebCufd = await this.prismaService.ebCufd.create({
      data: {
        cufd: ebCufdDto.cufd,
        expirationAt: ebCufdDto.expirationAt,
        systemCode: ebCufdDto.systemCode,
        nit: Number(ebCufdDto.nit),
        sucursalCode: ebCufdDto.sucursalCode,
        salePointCode: ebCufdDto.salePointCode,
        controlCode: ebCufdDto.controlCode,
        createdAt: this.parameterService.getNow()
      },
    });

    return this.mapEbCufdDtoDto(ebCufd);
  }

  async findByCufd(cufd: string): Promise<EbCufdDto> {
    const ebCufd = await this.prismaService.ebCufd.findUnique({
      where: {
        cufd: cufd,
      },
    });

    if (ebCufd != null) {
      return this.mapEbCufdDtoDto(ebCufd);
    }

    return null;
  }

  async findByExpirationDate(ebSystemDto:EbSystemDto, sucursalCode:number,salePointCode:number, current: Date): Promise<EbCufdDto> {
    const ebCufd = await this.prismaService.ebCufd.findFirst({
      where: {
        systemCode: ebSystemDto.systemCode,
        nit: Number(ebSystemDto.nit),
        sucursalCode: sucursalCode,
        salePointCode: salePointCode,
        expirationAt: { gte: current },
        createdAt: { lte: current },
      },
      orderBy: [{ expirationAt: 'desc' }],
    });

    if (ebCufd != null) {
      return this.mapEbCufdDtoDto(ebCufd);
    }

    return null;
  }


  mapEbCufdDtoDto(ebCufd: EbCufd): EbCufdDto {
    const ebCufdDto = new EbCufdDto();
    ebCufdDto.cufd = ebCufd.cufd;
    ebCufdDto.expirationAt = ebCufd.expirationAt;
    ebCufdDto.systemCode = ebCufd.systemCode;
    ebCufdDto.nit = Number(ebCufd.nit);
    ebCufdDto.sucursalCode = ebCufd.sucursalCode;
    ebCufdDto.salePointCode = ebCufd.salePointCode;
    ebCufdDto.controlCode = ebCufd.controlCode;

    return ebCufdDto;
  }
}
