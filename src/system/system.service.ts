import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateSystemDto } from "./dto/create-system.dto";
import { SystemOptionsDto } from "./dto/system-options.dto";
import { UpdateSystemDto } from "./dto/update-system.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Parameters } from "src/common/tools/parameters";


@Injectable()
export class SystemService {

  constructor(private prismaService: PrismaService) { }

  async create(createSystemDto:CreateSystemDto){
    let buf;
    if(createSystemDto.image)
      buf = new Buffer(createSystemDto.image, 'base64');

    const system = await this.prismaService.ebSystem.findUnique({
      where: {
        systemCode_nit: {
          systemCode: Parameters.codigoSistema,
          nit: createSystemDto.nit,
        }
      }
    });

    if (system)
      throw new ConflictException("System already exists");

    const systemSaved = await this.prismaService.ebSystem.create({ data: {
      systemCode: Parameters.codigoSistema,
      nit: createSystemDto.nit,
      business: createSystemDto.business,
      modalityCode: createSystemDto.modalityCode,
      image: buf
    }});

    return { id: systemSaved.id, business: systemSaved.business, modalityCode: systemSaved.modalityCode, nit: Number(systemSaved.nit)}
  }

  async findAll(systemOptionsDto:SystemOptionsDto){
    let where = {};

    if(systemOptionsDto.business){
      where['business'] = { contains: systemOptionsDto.business };
    }

    if(systemOptionsDto.nit){
      where['nit'] = systemOptionsDto.nit;
    }

    const systems = await this.prismaService.ebSystem.findMany({
      where: where
    });

    return systems.map( item => {
      return { id: item.id, business: item.business, modalityCode: item.modalityCode, nit: Number(item.nit)}
    });
  }

  async findOne(id:number){
    const system =  await  this.prismaService.ebSystem.findUnique({ where: { id: id}});
    return { id: system.id, business: system.business, modalityCode: system.modalityCode, nit: Number(system.nit)}
  }

  async update(id:number, updateSystemDto:UpdateSystemDto){
    let data = {};
    if(updateSystemDto.business)
      data['business'] =  updateSystemDto.business;
    if(updateSystemDto.nit)
      data['nit'] =  updateSystemDto.nit;
    if(updateSystemDto.modalityCode)
      data['modalityCode'] =  updateSystemDto.modalityCode;

    const systemSaved = await this.prismaService.ebSystem.update({ where: { id:id}, data: data});

    return { id: systemSaved.id, business: systemSaved.business, modalityCode: systemSaved.modalityCode, nit: Number(systemSaved.nit)}
  }

  async remove(id:number){
    const entity = await this.findOne(id);

    if(!entity)
      throw new NotFoundException("Entity not found");

    const system = await this.prismaService.ebSystem.delete({where: { id:id}});

    return { id: system.id, business: system.business, modalityCode: system.modalityCode, nit: Number(system.nit)}
  }
}