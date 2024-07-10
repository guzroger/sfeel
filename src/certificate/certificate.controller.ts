import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Req } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { CreateCertificateDto } from "./dto/create-certificate.dto";
import { CertificateOptionsDto } from "./dto/certificate-options.dto";
import { UpdateCertificateDto } from "./dto/update-certificate.dto";
import { CertificateService } from "./certificate.service";

@ApiTags('Certificate')
@Controller("certificate")
export class CertificateController{
  
  constructor(private certificateService:CertificateService){}
  
  @ApiOperation({
    summary: 'Create Certificate',
    description: 'Method from create certificate',
  })
  @Post()
  create(@Body() createCertificateDto: CreateCertificateDto, @Req()  req: Request) {
    
    return this.certificateService.create(createCertificateDto);
  }

  @ApiOperation({
    summary: 'Get Certidicates',
    description: 'Method for get certificates',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll( @Query() certificateOptionsDto:CertificateOptionsDto,  @Req()  req: Request) {
    return this.certificateService.findAll( certificateOptionsDto);
  }

  @ApiOperation({
    summary: 'Get certificates',
    description: 'Method for get Movement',
  })
  @Get(':id')
  @ApiParam({ name : "id"})
  findOne(@Param('id') id: number, @Req()  req: Request) {
    return this.certificateService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Update certificate',
    description: 'Method for update certificate',
  })
  @Put(':id')
  @ApiParam({ name : "id"})
  update(@Param('id') id: number, @Body() updateCertificateDto: UpdateCertificateDto, @Req()  req: Request) {
    return this.certificateService.update(+id, updateCertificateDto);
  }

  @ApiOperation({
    summary: 'Delete certificate',
    description: 'Method for delete certificate',
  })
  @Delete(':id')
  @ApiParam({ name : "id"})
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number, @Req()  req: Request) {
    return this.certificateService.remove(id);
  }
}