import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCertificateDto } from "./dto/create-certificate.dto";
import { CertificateOptionsDto } from "./dto/certificate-options.dto";
import { UpdateCertificateDto } from "./dto/update-certificate.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Parameters } from "src/common/tools/parameters";
import { CertificateType, StorageType } from "@prisma/client";

@Injectable()
export class CertificateService {


  constructor(private prismaService: PrismaService) { }

  async create(createCertificateDto: CreateCertificateDto) {
    
    let buf;
    if(createCertificateDto.certificate)
      buf = new Buffer(createCertificateDto.certificate, 'base64');

    const cert = await this.prismaService.appCertificate.create({
      data: {
        systemCode: Parameters.codigoSistema,
        nit: createCertificateDto.nit,
        certificate: buf,
        certificateType: CertificateType[createCertificateDto.certificateType],
        typeStorage: StorageType[createCertificateDto.typeStorage],
        expirationAt: createCertificateDto.expirationAt,
        idRef: createCertificateDto.idRef,
      }
    });


    return {
      id: cert.id,
      nit: Number(cert.nit),
      certificateType: cert.certificateType,
      typeStorage: cert.typeStorage,
      expirationAt: cert.expirationAt,
      idRef: cert.idRef
    }
  }

  async findAll(uertificateOptionsDto: CertificateOptionsDto) {
    let where = {};
    
    if(uertificateOptionsDto.nit){
      where['nit'] = uertificateOptionsDto.nit;
    }

    const resp = await this.prismaService.appCertificate.findMany({
      where: where
    });

    return resp.map( item => {
      return {
        id: item.id,
        nit: Number(item.nit),
        certificateType: item.certificateType,
        typeStorage: item.typeStorage,
        expirationAt: item.expirationAt,
        idRef: item.idRef
      }
    });
  }

  async findOne(id: number) {
    const resp = await this.prismaService.appCertificate.findUnique({ where: { id: id}});
    if(!resp)
      throw new NotFoundException("Certificate not found");

    return {
      id: resp.id,
      nit: Number(resp.nit),
      certificateType: resp.certificateType,
      typeStorage: resp.typeStorage,
      expirationAt: resp.expirationAt,
      idRef: resp.idRef
    }
  }

  async update(id: number, updateCertificateDto: UpdateCertificateDto) {
    let data = {};
    if(updateCertificateDto.nit)
      data['nit'] = updateCertificateDto.nit;
    if(updateCertificateDto.typeStorage)
      data['typeStorage'] =  StorageType[updateCertificateDto.typeStorage];
    if(updateCertificateDto.certificateType)
      data['certificateType'] =  CertificateType[updateCertificateDto.certificateType];
    if(updateCertificateDto.certificate){
      let buf = new Buffer(updateCertificateDto.certificate, 'base64');
      data['certificate'] =  buf;
    }
    

    const cert = await this.prismaService.appCertificate.update({ where: { id:id}, data: data});

    return {
      id: cert.id,
      nit: Number(cert.nit),
      certificateType: cert.certificateType,
      typeStorage: cert.typeStorage,
      expirationAt: cert.expirationAt,
      idRef: cert.idRef
    };
  }

  async remove(id: number) {
    const entity = await this.findOne(id);

    if(!entity)
      throw new NotFoundException("Entity not found");

    const cert = await this.prismaService.appCertificate.delete({where: { id:id}});

    return {
      id: cert.id,
      nit: Number(cert.nit),
      certificateType: cert.certificateType,
      typeStorage: cert.typeStorage,
      expirationAt: cert.expirationAt,
      idRef: cert.idRef
    };
  }
}