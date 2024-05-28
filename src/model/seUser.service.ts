import { Injectable } from "@nestjs/common";
import { SeUser } from "@prisma/client";
import { CreateUserDto } from "src/auth/dto/create_user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { SeUserDto } from "./dto/seUser.dto";
import { EbSystemService } from "./ebSystem.service";
import { EbSystemDto } from "./dto/ebSystem.dto";

@Injectable()
export class SeUserService {

  constructor(private prismaService:PrismaService, private ebSystemService:EbSystemService){}

  async create(createUserDto:CreateUserDto){
    const seUser = await this.prismaService.seUser.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: createUserDto.password,
        salePointCode: createUserDto.salePointCode,
        systemId: createUserDto.systemId
      },
      include: {
        ebSystem: true
      }
    });
    


    if (seUser != null) {
      return this.mapSeUserDto(seUser, this.ebSystemService.mapEbSystem(seUser.ebSystem));
    }

    return null;
  }

  async findByEmail(email:string){
    const seUser = await this.prismaService.seUser.findUnique({
      where: {
        email: email
      },
      include: {
        ebSystem: true
      }
    });

    if (seUser != null) {
      return this.mapSeUserDto(seUser, this.ebSystemService.mapEbSystem(seUser.ebSystem));
    }

    return null;
  }

  mapSeUserDto(seUser:SeUser, ebSystemDto:EbSystemDto){
    const seUserDto = new SeUserDto();
    seUserDto.id = seUser.id;
    seUserDto.name = seUser.name;
    seUserDto.email = seUser.email;
    seUserDto.password = seUser.password;
    seUserDto.salePointCode = seUser.salePointCode;
    seUserDto.systemId = seUser.systemId;
    
    if(ebSystemDto)
      seUserDto.ebSystemDto = ebSystemDto;
    

    return seUserDto;
  }

}