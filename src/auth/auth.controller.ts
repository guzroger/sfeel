import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create_user.dto";
import { LoginDto } from "./dto/login.dto";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService:AuthService) {}

  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto){
    console.log(createUserDto);
    return this.authService.register(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto:LoginDto){
    console.log(loginDto);
    return this.authService.login(loginDto);
  }
}