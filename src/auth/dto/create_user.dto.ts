import { IsEmail, IsNotEmpty, IsNumber, MaxLength, MinLength } from "class-validator";
import { LoginDto } from "./login.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto extends LoginDto {
  @ApiProperty()
  @IsNotEmpty({ message: "El nombre no puede ser vacio"})
  name:string;

  @ApiProperty()
  @IsNotEmpty({ message: "El código de punto de venta no puede ser vacio"})
  @IsNumber({}, { message: "El código de punto de venta debe ser numérico"})
  salePointCode:number;

  @ApiProperty()
  @IsNotEmpty({ message: "El NIT no puede ser vacio"})
  @IsNumber({}, { message: "El NIT debe ser numérico"})
  nit:number;

  systemId?:number;
}