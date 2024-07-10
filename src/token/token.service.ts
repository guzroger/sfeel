import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Parameters } from "src/common/tools/parameters";
import { CreateSystemDto } from "src/system/dto/create-system.dto";
import { SystemOptionsDto } from "src/system/dto/system-options.dto";
import { UpdateSystemDto } from "src/system/dto/update-system.dto";
import { CreateTokenDto } from "./dto/create-token.dto";
import { TokenOptionsDto } from "./dto/token-options.dto";
import { UpdateTokenDto } from "./dto/update-token.dto";
import { connect } from "http2";


@Injectable()
export class TokenService {

  constructor(private prismaService: PrismaService) { }

  async create(createTokenDto:CreateTokenDto){
    const system = await this.prismaService.ebSystem.findUnique({
      where: {
        systemCode_nit: {
          systemCode: Parameters.codigoSistema,
          nit: createTokenDto.nit
        }
      }
    });

    if (!system)
      throw new NotFoundException("System not found");

    return await this.prismaService.ebToken.create({ data: {
      token: createTokenDto.token,
      startAt: createTokenDto.startAt,
      expirationAt: createTokenDto.expirationAt,
      systemId: system.id
    }});

  }

  async findAll(tokenOptionsDto:TokenOptionsDto){
    let where = {};
    
    if(tokenOptionsDto.nit){
      const system = await this.prismaService.ebSystem.findUnique({
        where: {
          systemCode_nit: {
            systemCode: Parameters.codigoSistema,
            nit: tokenOptionsDto.nit
          }
        }
      });
      where['systemId'] = system.id;
    }

    
    return this.prismaService.ebToken.findMany({
      where: where
    });


  }

  async findOne(id:number){
    return  this.prismaService.ebToken.findUnique({ where: { id: id}});

  }

  async update(id:number, updateTokenDto:UpdateTokenDto){
    let data = {};
    
    if(updateTokenDto.nit){
      const system = await this.prismaService.ebSystem.findUnique({
        where: {
          systemCode_nit: {
            systemCode: Parameters.codigoSistema,
            nit: updateTokenDto.nit
          }
        }
      });
      data['system'] = {connect: {id: system.id}  };
    }

    
    if(updateTokenDto.token)
      data['token'] =  updateTokenDto.token;
    if(updateTokenDto.startAt)
      data['startAt'] =  updateTokenDto.startAt;
    if(updateTokenDto.expirationAt)
      data['expirationAt'] =  updateTokenDto.expirationAt;

    
    return this.prismaService.ebToken.update({ where: { id:id}, data: data});
  }

  async remove(id:number){
    const entity = await this.findOne(id);

    if(!entity)
      throw new NotFoundException("Entity not found");

    return this.prismaService.ebToken.delete({where: { id:id}});

  
  }
}