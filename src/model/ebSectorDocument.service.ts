import { Injectable, NotFoundException } from '@nestjs/common';
import { ParameterService } from 'src/common/parameter.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ebSectorDocument } from '@prisma/client';
import { EbSectorDocumentDto } from './dto/ebSectorDocument.dto';

@Injectable()
export class EbSectorDocumentService {
  constructor(
    private prismaService: PrismaService,
    private parameterService: ParameterService,
  ) {}

  async findById(sectorCode: string): Promise<EbSectorDocumentDto> {
    const ebSectorDocument =
      await this.prismaService.ebSectorDocument.findUnique({
        where: {
          sectorCode: sectorCode,
        },
      });

    if (ebSectorDocument != null)
      return this.mapEbSectorDocumentDto(ebSectorDocument);
    else
      throw new NotFoundException('Document Sector data not found');

  }

  mapEbSectorDocumentDto(
    ebSectorDocument: ebSectorDocument,
  ): EbSectorDocumentDto {
    const ebSectorDocumentDto = new EbSectorDocumentDto();
    ebSectorDocumentDto.sectorCode = ebSectorDocument.sectorCode;
    ebSectorDocumentDto.description = ebSectorDocument.description;
    ebSectorDocumentDto.urlWsFe = ebSectorDocument.urlWsFe;
    ebSectorDocumentDto.urlWsFec = ebSectorDocument.urlWsFec;
    ebSectorDocumentDto.methodFe = ebSectorDocument.methodFe;
    ebSectorDocumentDto.methodFec = ebSectorDocument.methodFec;
    //ebSectorDocumentDto.xsdFe = ebSectorDocument.xsdFe;
    //ebSectorDocumentDto.xsdFe = ebSectorDocument.xsdFe;

    ebSectorDocumentDto.serviceFe = ebSectorDocument.serviceFe;
    ebSectorDocumentDto.serviceFec = ebSectorDocument.serviceFec;
    ebSectorDocumentDto.documentTaxCode = ebSectorDocument.documentTaxCode;

    return ebSectorDocumentDto;
  }
}
