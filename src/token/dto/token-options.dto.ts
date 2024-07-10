import { ApiProperty } from "@nestjs/swagger";

export class TokenOptionsDto{
  @ApiProperty()
  nit:number;
}