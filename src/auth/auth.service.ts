import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from './dto/create_user.dto';
import { LoginDto } from './dto/login.dto';
import { hash, compare } from "bcrypt"
import { EbSystemService } from "src/model/ebSystem.service";
import { Parameters } from "src/common/parameters";
import { SeUserService } from "src/model/seUser.service";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private seUserService:SeUserService,  private ebSystemService:EbSystemService, private jwtService:JwtService){}

    async register(createUserDto:CreateUserDto){
      const { password } = createUserDto
      const plainToHash = await hash(password, 12)

      const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit(Parameters.codigoSistema, createUserDto.nit);
        
      createUserDto = {...createUserDto, systemId: ebSystemDto.systemId,  password: plainToHash}

      return this.seUserService.create(createUserDto);
    }
    async login(loginDto:LoginDto){
      const {email, password} = loginDto;

      const seUserDto = await this.seUserService.findByEmail(email);
      if(!seUserDto)
        throw new NotFoundException("User not found");

      const isEquals = await compare(password, seUserDto.password);

      if(!isEquals)
        throw new ConflictException("The password is invalid");

      const payload = { email: seUserDto.email, id: seUserDto.id };
      const token = this.jwtService.sign(payload); 

      return { user:  seUserDto, token: token };

    }
}