import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Req } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { TokenService } from "./token.service";
import { CreateTokenDto } from "./dto/create-token.dto";
import { TokenOptionsDto } from "./dto/token-options.dto";
import { UpdateTokenDto } from "./dto/update-token.dto";

@ApiTags('Token')
@Controller("token")
export class TokenController{
  
  constructor(private tokenService:TokenService){}
  
  @ApiOperation({
    summary: 'Create Token',
    description: 'Method from create token',
  })
  @Post()
  create(@Body() createTokenDto: CreateTokenDto, @Req()  req: Request) {
    
    return this.tokenService.create(createTokenDto);
  }

  @ApiOperation({
    summary: 'Get Tokens',
    description: 'Method for get tokens',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll( @Query() tokenOptionsDto:TokenOptionsDto,  @Req()  req: Request) {
    return this.tokenService.findAll( tokenOptionsDto);
  }

  @ApiOperation({
    summary: 'Get certificates',
    description: 'Method for get Movement',
  })
  @Get(':id')
  @ApiParam({ name : "id"})
  findOne(@Param('id') id: number, @Req()  req: Request) {
    return this.tokenService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Update certificate',
    description: 'Method for update certificate',
  })
  @Put(':id')
  @ApiParam({ name : "id"})
  update(@Param('id') id: number, @Body() updateTokenDto: UpdateTokenDto, @Req()  req: Request) {
    return this.tokenService.update(+id, updateTokenDto);
  }

  @ApiOperation({
    summary: 'Delete Movement',
    description: 'Method for delete Movement',
  })
  @Delete(':id')
  @ApiParam({ name : "id"})
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number, @Req()  req: Request) {
    return this.tokenService.remove(+id);
  }
}