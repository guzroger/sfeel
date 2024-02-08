import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SynCatalogueDto } from './dto/synCatalogue.dto';
import { Status, SynCatalogue } from '@prisma/client';

@Injectable()
export class SynCatalogueService {
  constructor(private prismaService: PrismaService) {}

  async create(synCatalogueDto: SynCatalogueDto): Promise<SynCatalogueDto> {
    const tmp = await this.findById(synCatalogueDto);

    if (tmp != null) return tmp;

    const synCatalogue = await this.prismaService.synCatalogue.create({
      data: {
        code: synCatalogueDto.code,
        type: synCatalogueDto.type,
        systemCode: synCatalogueDto.systemCode,
        nit: Number(synCatalogueDto.nit),
        description: synCatalogueDto.description,
      },
    });

    if (synCatalogue != null) {
      return this.mapSynCatalogueDto(synCatalogue);
    }

    return null;
  }

  async findById(synCatalogueDto: SynCatalogueDto): Promise<SynCatalogueDto> {
    const synCatalogue = await this.prismaService.synCatalogue.findUnique({
      where: {
        code_type_systemCode_nit: {
          code: synCatalogueDto.code,
          type: synCatalogueDto.type,
          systemCode: synCatalogueDto.systemCode,
          nit: Number(synCatalogueDto.nit),
        },
      },
    });

    if (synCatalogue != null) {
      return this.mapSynCatalogueDto(synCatalogue);
    }

    return null;
  }

  async findByTypeSystemCodeNit(
    type: string,
    systemCode: string,
    nit: number,
  ): Promise<SynCatalogueDto[]> {
    const list = await this.prismaService.synCatalogue.findMany({
      where: {
        type: type,
        systemCode: systemCode,
        nit: Number(nit),
      },
    });

    return list.map((item) => {
      return this.mapSynCatalogueDto(item);
    });
  }

  async findByTypeSystemCodeNitVisible(
    type: string,
    systemCode: string,
    nit: number,
  ): Promise<SynCatalogueDto[]> {
    const list = await this.prismaService.synCatalogue.findMany({
      where: {
        type: type,
        systemCode: systemCode,
        nit: Number(nit),
        visible: Status.ACTIVE
      },
    });

    return list.map((item) => {
      return this.mapSynCatalogueDto(item);
    });
  }

  async listTypes(): Promise<string[]>{
    const list = await this.prismaService.synCatalogue.findMany( {
      where:{},
      select: {'type':true},
      distinct: [ 'type' ]
    });
    
    return list.map((item) => {
      return item.type;
    });
  }

  mapSynCatalogueDto(synCatalogue: SynCatalogue): SynCatalogueDto {
    const synCatalogueDto = new SynCatalogueDto();

    synCatalogueDto.code = synCatalogue.code;
    synCatalogueDto.type = synCatalogue.type;
    synCatalogueDto.systemCode = synCatalogue.systemCode;
    synCatalogueDto.nit = Number(synCatalogue.nit);
    synCatalogueDto.description = synCatalogue.description;
    synCatalogueDto.visible = synCatalogue.visible;

    return synCatalogueDto;
  }
}
