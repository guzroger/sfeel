import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppCertificateDto } from './dto/appCertificate.dto';
import { CertificateType, Status, appCertificate } from '@prisma/client';
import { ParameterService } from 'src/common/parameter.service';

@Injectable()
export class AppCertificateService {
  constructor(
    private prismaService: PrismaService,
    private parameterService: ParameterService,
  ) {}

  async findById(id: number): Promise<AppCertificateDto> {
    const appCertificateDto =
      await this.prismaService.appCertificate.findUnique({
        where: {
          id: id,
        },
      });

    if (appCertificateDto != null) {
      return this.mapAppCertificateDto(appCertificateDto);
    }
    return null;
  }

  async findBySystemCodeAndNitType(
    systemCode: string,
    nit: number,
    type: CertificateType,
  ): Promise<AppCertificateDto> {
    const appCertificateDto = await this.prismaService.appCertificate.findFirst(
      {
        where: {
          systemCode: systemCode,
          nit: nit,
          certificateType: type,
        },
        orderBy: [{ expirationAt: 'desc' }],
      },
    );

    if (appCertificateDto != null) {
      return this.mapAppCertificateDto(appCertificateDto);
    }
    return null;
  }

  async getValidCertificate(
    systemCode: string,
    nit: number,
    type: CertificateType,
  ): Promise<AppCertificateDto> {
    const currentDate = this.parameterService.getNow();

    const appCertificateDto = await this.prismaService.appCertificate.findFirst(
      {
        where: {
          systemCode: systemCode,
          nit: nit,
          certificateType: type,
          createdAt: { lte: currentDate },
          expirationAt: { gte: currentDate },
          status: Status.ACTIVE,
        },
        orderBy: [{ expirationAt: 'desc' }],
      },
    );

    if (appCertificateDto != null) {
      return this.mapAppCertificateDto(appCertificateDto);
    }
    return null;
  }

  mapAppCertificateDto(appCertificate: appCertificate): AppCertificateDto {
    const appCertificateDto = new AppCertificateDto();
    appCertificateDto.id = appCertificate.id;
    appCertificateDto.systemCode = appCertificate.systemCode;
    appCertificateDto.nit = Number(appCertificate.nit);
    appCertificateDto.certificate = appCertificate.certificate;
    appCertificateDto.certificateType = appCertificate.certificateType;
    appCertificateDto.typeStorage = appCertificate.typeStorage;
    appCertificateDto.status = appCertificate.status;
    appCertificateDto.createdAt = appCertificate.createdAt;
    appCertificateDto.expirationAt = appCertificate.expirationAt;
    appCertificateDto.idRef = appCertificate.idRef;

    return appCertificateDto;
  }
}
