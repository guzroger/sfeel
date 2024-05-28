import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty()
  @IsEmail({}, {message: "Email invalido"})
  @IsNotEmpty({ message: "El email no puede ser vacio"})
  email: string;
  
  @ApiProperty()
  @MinLength(6, {message: "El password debe de tener mínimo 6 carácteres"})
  @MaxLength(25, {message: "El password debe de tener máximo 25 carácteres"})
  @IsNotEmpty({ message: "El password no puede ser vacio"})
  password:string;
}