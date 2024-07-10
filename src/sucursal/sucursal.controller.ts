import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Req } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { SucursalService } from "./sucursal.service";
import { CreateSucursalDto } from "./dto/create-sucursal.dto";
import { SucursalOptionsDto } from "./dto/sucursal-options.dto";
import { UpdateSucursalDto } from "./dto/update-sucursal.dto";

@ApiTags('Sucursal')
@Controller("sucursal")
export class SucursalController{
  
  constructor(private sucursalService:SucursalService){}
  
  @ApiOperation({
    summary: 'Create Surcursal',
    description: 'Method from create surcursal',
  })
  @Post()
  create(@Body() createSucursalDto: CreateSucursalDto, @Req()  req: Request) {
    
    return this.sucursalService.create(createSucursalDto);
  }

  @ApiOperation({
    summary: 'Get Sucursals',
    description: 'Method for get sucursals',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll( @Query() sucursalOptionsDto:SucursalOptionsDto,  @Req()  req: Request) {
    return this.sucursalService.findAll( sucursalOptionsDto);
  }

  @ApiOperation({
    summary: 'Get sucursal',
    description: 'Method for get sucursal',
  })
  @Get(':id')
  @ApiParam({ name : "id"})
  findOne(@Param('id') id: number, @Req()  req: Request) {
    return this.sucursalService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update sucursal',
    description: 'Method for update sucursal',
  })
  @Put(':id')
  @ApiParam({ name : "id"})
  update(@Param('id') id: number, @Body() updateSucursalDto: UpdateSucursalDto, @Req()  req: Request) {
    return this.sucursalService.update(id, updateSucursalDto);
  }

  @ApiOperation({
    summary: 'Delete sucursal',
    description: 'Method for delete sucursal',
  })
  @Delete(':id')
  @ApiParam({ name : "id"})
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number, @Req()  req: Request) {
    return this.sucursalService.remove(id);
  }
}