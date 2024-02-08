import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SynInvoiceLegendDto } from './dto/synInvoiceLegend.dto';
import { SynInvoiceLegend } from '@prisma/client';

@Injectable()
export class SynInvoiceLegendService {
  constructor(private prismaService: PrismaService) {}

  async create(
    synInvoiceLegendDto: SynInvoiceLegendDto,
  ): Promise<SynInvoiceLegendDto> {
    const tmp = await this.findById(synInvoiceLegendDto);

    if (tmp != null) return tmp;

    const synInvoiceLegend = await this.prismaService.synInvoiceLegend.create({
      data: {
        activityCode: synInvoiceLegendDto.activityCode,
        description: synInvoiceLegendDto.description,
        systemCode: synInvoiceLegendDto.systemCode,
        nit: Number(synInvoiceLegendDto.nit),
      },
    });

    if (synInvoiceLegend != null) {
      return this.mapSynInvoiceLegendDto(synInvoiceLegend);
    }

    return null;
  }

  async findById(
    synInvoiceLegendDto: SynInvoiceLegendDto,
  ): Promise<SynInvoiceLegendDto> {
    const synInvoiceLegend =
      await this.prismaService.synInvoiceLegend.findUnique({
        where: {
          activityCode_description_systemCode_nit: {
            activityCode: synInvoiceLegendDto.activityCode,
            systemCode: synInvoiceLegendDto.systemCode,
            nit: Number(synInvoiceLegendDto.nit),
            description: synInvoiceLegendDto.description,
          },
        },
      });

    if (synInvoiceLegend != null) {
      return this.mapSynInvoiceLegendDto(synInvoiceLegend);
    }

    return null;
  }

  async findBySystemCodeNit(
    systemCode: string,
    nit: number,
  ): Promise<SynInvoiceLegendDto[]> {
    const list = await this.prismaService.synInvoiceLegend.findMany({
      where: {
        systemCode: systemCode,
        nit: nit,
      },
    });

    return list.map((item) => {
      return this.mapSynInvoiceLegendDto(item);
    });
  }

  async findBySystemCodeNitActivityCode(
    systemCode: string,
    nit: number,
    activityCode: string
  ): Promise<SynInvoiceLegendDto[]> {
    const list = await this.prismaService.synInvoiceLegend.findMany({
      where: {
        systemCode: systemCode,
        nit: nit,
        activityCode: activityCode,
      },
    });

    return list.map((item) => {
      return this.mapSynInvoiceLegendDto(item);
    });
  }

  async getRandomLegeng(
    systemCode: string,
    nit: number,
    activityCode: string
  ): Promise<SynInvoiceLegendDto> {
    const list = await this.prismaService.synInvoiceLegend.findMany({
      where: {
        systemCode: systemCode,
        nit: nit,
        activityCode: activityCode,
      },
    });

    if (list != null && list.length > 0) {
      const i = Math.floor(Math.random() * (list.length - 1));
      return this.mapSynInvoiceLegendDto(list[i]);
    }
    return null;
  }

  mapSynInvoiceLegendDto(
    synInvoiceLegend: SynInvoiceLegend,
  ): SynInvoiceLegendDto {
    const synInvoiceLegendDto = new SynInvoiceLegendDto();

    synInvoiceLegendDto.activityCode = synInvoiceLegend.activityCode;
    synInvoiceLegendDto.description = synInvoiceLegend.description;
    synInvoiceLegendDto.systemCode = synInvoiceLegend.systemCode;
    synInvoiceLegendDto.nit = Number(synInvoiceLegend.nit);

    return synInvoiceLegendDto;
  }
}
