import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SynDateHourDto } from './dto/synDateHour.dto';
import { ParameterService } from '../common/parameter.service';
import { SynDateHour } from '@prisma/client';

@Injectable()
export class SynDateHourService {
  constructor(
    private prismaService: PrismaService,
    private parameterService: ParameterService,
  ) {}

  async create(synDateHourDto: SynDateHourDto): Promise<SynDateHourDto> {    
    const synDateHour = await this.prismaService.synDateHour.create({
      data: {
        dateSystem: synDateHourDto.dateSystem,
        dateSin: synDateHourDto.dateSin,
        systemCode: synDateHourDto.systemCode,
        nit: Number(synDateHourDto.nit),
      },
    });

    if (synDateHour != null) {
      return this.mapSynDateHourDto(synDateHour);
    }

    return null;
  }

  async findBySystemCodeAndNit(
    systemCode: string,
    nit: number,
  ): Promise<SynDateHourDto> {
    const synDateHour = await this.prismaService.synDateHour.findFirst({
      where: { systemCode: systemCode, nit: Number(nit) },
      orderBy: [{ dateSin: 'desc' }],
    });

    if (synDateHour != null) {
      return this.mapSynDateHourDto(synDateHour);
    }
    return null;
  }

  async sisdate(systemCode: string, nit: number): Promise<Date> {
    const synDateHourDto = await this.findBySystemCodeAndNit(systemCode, nit);
    const current_date = this.parameterService.getNow();
    if (synDateHourDto == null) return this.parameterService.getNow();

    return new Date(
      current_date.getTime() +
        (synDateHourDto.dateSin.getTime() -
          synDateHourDto.dateSystem.getTime()),
    );
  }

  mapSynDateHourDto(synDateHour: SynDateHour): SynDateHourDto {
    const synDateHourDto = new SynDateHourDto();
    synDateHourDto.dateSin = synDateHour.dateSin;
    synDateHourDto.dateSystem = synDateHour.dateSystem;
    synDateHourDto.systemCode = synDateHour.systemCode;
    synDateHourDto.nit = Number(synDateHour.nit);

    return synDateHourDto;
  }
}
