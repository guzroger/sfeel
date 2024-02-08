import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SynActivityDto } from './dto/synActivity.dto';
import { SynActivity } from '@prisma/client';

@Injectable()
export class SynActivityService {
  constructor(private prismaService: PrismaService) {}

  async create(synActivityDto: SynActivityDto): Promise<SynActivityDto> {
    const tmp = await this.findById(synActivityDto);

    if (tmp != null) return tmp;

    const synActivity = await this.prismaService.synActivity.create({
      data: {
        activityCode: synActivityDto.activityCode,
        systemCode: synActivityDto.systemCode,
        nit: Number(synActivityDto.nit),
        sectorDocumentCode: synActivityDto.sectorDocumentCode,
        activityType: synActivityDto.activityType,
        description: synActivityDto.description,
      },
    });

    if (synActivity != null) {
      return this.mapSynActivityDto(synActivity);
    }

    return null;
  }

  async findById(synActivityDto: SynActivityDto): Promise<SynActivityDto> {
    const synActivity = await this.prismaService.synActivity.findUnique({
      where: {
        activityCode_systemCode_nit_sectorDocumentCode_activityType: {
          activityCode: synActivityDto.activityCode,
          systemCode: synActivityDto.systemCode,
          nit: Number(synActivityDto.nit),
          sectorDocumentCode: synActivityDto.sectorDocumentCode,
          activityType: synActivityDto.activityType,
        },
      },
    });

    if (synActivity != null) {
      return this.mapSynActivityDto(synActivity);
    }

    return null;
  }

  async findBySystemCodeNit(
    systemCode: string,
    nit: number,
  ): Promise<SynActivityDto[]> {
    const list = await this.prismaService.synActivity.findMany({
      where: {
        systemCode: systemCode,
        nit: nit,
      },
    });

    return list.map((item) => {
      return this.mapSynActivityDto(item);
    });
  }

  mapSynActivityDto(synActivity: SynActivity): SynActivityDto {
    const synActivityDto = new SynActivityDto();

    synActivityDto.activityCode = synActivity.activityCode;
    synActivityDto.activityType = synActivity.activityType;
    synActivityDto.systemCode = synActivity.systemCode;
    synActivityDto.nit = Number(synActivity.nit);
    synActivityDto.description = synActivity.description;
    synActivityDto.sectorDocumentCode = synActivity.sectorDocumentCode;

    return synActivityDto;
  }
}
