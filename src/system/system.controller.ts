import { Body, Controller, Delete, FileTypeValidator, Get, HttpCode, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, Query, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { SystemService } from "./system.service";
import { CreateSystemDto } from "./dto/create-system.dto";
import { SystemOptionsDto } from "./dto/system-options.dto";
import { UpdateSystemDto } from "./dto/update-system.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags('System')
@Controller("system")
export class SystemController{
  
  constructor(private systemService:SystemService){}
  
  @ApiOperation({
    summary: 'Create System',
    description: 'Method from create system',
  })
  @Post()
  create(@Body() createSystemDto: CreateSystemDto, @Req()  req: Request) {
    
    return this.systemService.create(createSystemDto);
  }

  @ApiOperation({
    summary: 'Get Systems',
    description: 'Method for get system',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll( @Query() systemOptionsDto:SystemOptionsDto,  @Req()  req: Request) {
    return this.systemService.findAll( systemOptionsDto);
  }

  @ApiOperation({
    summary: 'Get System',
    description: 'Method for get System',
  })
  @Get(':id')
  @ApiParam({ name : "id"})
  findOne(@Param('id') id: number, @Req()  req: Request) {
    return this.systemService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Update System',
    description: 'Method for update system',
  })
  @Put(':id')
  @ApiParam({ name : "id"})
  update(@Param('id') id: number, @Body() updateSystemDto: UpdateSystemDto, @Req()  req: Request) {
    return this.systemService.update(+id, updateSystemDto);
  }

  @ApiOperation({
    summary: 'Delete system',
    description: 'Method for delete system',
  })
  @Delete(':id')
  @ApiParam({ name : "id"})
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number, @Req()  req: Request) {
    return this.systemService.remove(+id);
  }

  @Post('upload1')
  uploadFileAndPassValidation1(@Body() createSystemDto: CreateSystemDto, @UploadedFile( new ParseFilePipe({ validators: [ 
    new MaxFileSizeValidator({ maxSize: 100000 }), 
    new FileTypeValidator({ fileType: 'image/jpeg' }) ]  
    }) ) file: Express.Multer.File) {
    return {
      createSystemDto,
      //file: file.buffer.toString(),
    };
  }

  @Post('upload')
  uploadFileAndPassValidation(@Body() createSystemDto: CreateSystemDto, @UploadedFile() file: Express.Multer.File) {
    return {
      createSystemDto,
      //file: file.buffer.toString(),
    };
  }
}