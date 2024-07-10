import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateSucursalDto } from "./dto/create-sucursal.dto";
import { SucursalOptionsDto } from "./dto/sucursal-options.dto";
import { UpdateSucursalDto } from "./dto/update-sucursal.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Parameters } from "src/common/tools/parameters";

@Injectable()
export class SucursalService {

  constructor(private prismaService: PrismaService) { }

  async create(createSucursalDto: CreateSucursalDto) {
    const system = await this.prismaService.ebSystem.findUnique({
      where: {
        systemCode_nit: {
          systemCode: Parameters.codigoSistema,
          nit: createSucursalDto.nit
        }
      }
    });

    if (!system)
      throw new NotFoundException("System not found");

    const tmp = await this.prismaService.ebSucursal.findFirst({
      where: {
        systemId: system.id,
        sucursalCode: createSucursalDto.sucursalCode
      }
    });

    if (tmp)
      throw new NotFoundException("The sucursalCode already exists");

    const sucural = this.prismaService.ebSucursal.create({
      data: {
        sucursalCode: createSucursalDto.sucursalCode,
        description: createSucursalDto.description,
        modalityCode: createSucursalDto.modalityCode,
        address: createSucursalDto.address,
        phone: createSucursalDto.phone,
        municipality: createSucursalDto.municipality,
        city: createSucursalDto.city,
        systemId:  system.id
      }
    });

    return sucural;
  }

  async findAll(sucursalOptionsDto: SucursalOptionsDto) {
    let where = {};
    
    if(sucursalOptionsDto.nit){
      const system = await this.prismaService.ebSystem.findUnique({
        where: {
          systemCode_nit: {
            systemCode: Parameters.codigoSistema,
            nit: sucursalOptionsDto.nit
          }
        }
      });
      where['systemId'] = system.id;
    }

    if(sucursalOptionsDto.description){
      where['description'] = { contains: sucursalOptionsDto.description };
    }

    if(sucursalOptionsDto.sucursalCode===0 || sucursalOptionsDto.sucursalCode){
      where['sucursalCode'] = sucursalOptionsDto.sucursalCode;
    }

    return this.prismaService.ebSucursal.findMany({
      where: where
    });
  }

  findOne(id: number) {
    return this.prismaService.ebSucursal.findUnique({ where: { id: id}})
  }

  update(id: number, updateSucursalDto: UpdateSucursalDto) {
    let data = {};
    if(updateSucursalDto.address)
      data['address'] =  updateSucursalDto.address;
    if(updateSucursalDto.city)
      data['city'] =  updateSucursalDto.city;
    if(updateSucursalDto.description)
      data['description'] =  updateSucursalDto.description;
    if(updateSucursalDto.modalityCode)
      data['modalityCode'] =  updateSucursalDto.modalityCode;
    if(updateSucursalDto.municipality)
      data['municipality'] =  updateSucursalDto.municipality;
    if(updateSucursalDto.nit)
      data['nit'] =  updateSucursalDto.nit;
    if(updateSucursalDto.phone)
      data['phone'] =  updateSucursalDto.phone;
    if(updateSucursalDto.sucursalCode===0 || updateSucursalDto.sucursalCode)
      data['sucursalCode'] =  updateSucursalDto.sucursalCode;

    return this.prismaService.ebSucursal.update({ where: { id:id}, data: data});
  }

  async remove(id: number) {
    const entity = await this.findOne(id);

    if(!entity)
      throw new NotFoundException("Entity not found");

    return this.prismaService.ebSucursal.delete({where: { id:id}})
  }
}