import { Body, Controller, Get, Inject, Param, Post, Req } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { BillingCodeService } from "src/billing/billingCode.service";
import { SynchronizationService } from "src/billing/synchronization.service";
import { ParameterService } from "src/common/parameter.service";
import { EbSystemService } from "src/model/ebSystem.service";
import { GeneralSystemParameterDto } from "./dto/generalSystemParameter.dto";
import { EbSalePointService } from "src/model/ebSalePoint.service";
import { EbSucursalService } from "src/model/ebSucursal.service";
import { ManagerService } from "./manager.service";
import { CufdParameterDto } from "./dto/cufdParameter.dto";
import { Parameters } from "src/common/parameters";
import { CreatePointSaleDto } from "./dto/createPointSale.dto";

@ApiTags('Manager')
@Controller('mng')
export class ManagerController {

   constructor(
        private billingCodeService: BillingCodeService,
        private synchronizationService: SynchronizationService,
        private ebSystemService:EbSystemService,
        private ebSalePointService:EbSalePointService,
        private ebSucursalService:EbSucursalService,
        private managerService:ManagerService,
      ) {}

  @Post('cuis')
  @ApiOperation({
    summary: 'Get cuis',
    description: 'Method for send bill to SIN',
  })
  @ApiBody({ type: GeneralSystemParameterDto, description: 'Body' })
  async getCuis(@Body() generalSystemParameterDto:GeneralSystemParameterDto): Promise<any> {
    //console.log(req)
    const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit(
      Parameters.codigoSistema,
      generalSystemParameterDto.nit,
    );
   
    return  {"statusCode": 200, "descriptionCode": "OK", 
    "cuis": await   this.billingCodeService.getCuis(ebSystemDto, generalSystemParameterDto.sucursalCode, generalSystemParameterDto.salePoint, ebSystemDto.modalityCode, new Date())};
  }

  @Post('cufd')
  @ApiOperation({
    summary: 'Get CUFD',
    description: 'Method for send bill to SIN',
  })
  @ApiBody({ type: CufdParameterDto, description: 'Body' })
  async getCufd(@Body() cufdParameterDto:CufdParameterDto): Promise<any> {
    //console.log(req)

    const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit(Parameters.codigoSistema,cufdParameterDto.nit,);
    
    const sbSucursalDto = await this.ebSucursalService.findBySucursalCode(cufdParameterDto.sucursalCode,ebSystemDto.systemId,);
    const ebSalePointDto = await this.ebSalePointService.findBySalePointCode(
      cufdParameterDto.salePoint != null ? cufdParameterDto.salePoint : 0,
      sbSucursalDto.id,
    );

    let modalityCode = 1;
    if (ebSalePointDto != null) {
      modalityCode = ebSalePointDto.modalityCode;
    }

    const ebCuisDto = await this.billingCodeService.getCuis(
      ebSystemDto,
      cufdParameterDto.sucursalCode, cufdParameterDto.salePoint,
      modalityCode,
      new Date(),
    );
    return {"statusCode": 200, "descriptionCode": "OK", "cufd": await  this.billingCodeService.getCufd(
            ebSystemDto,
            cufdParameterDto.sucursalCode, cufdParameterDto.salePoint,
            modalityCode,
            new Date(),
            ebCuisDto.cuis,
            cufdParameterDto.force!=null?cufdParameterDto.force=='Y':false
          )};
  }
  
  @ApiOperation({
    summary: 'Send bill to SIN',
    description: 'Method for send bill to SIN',
  })
  @ApiParam({ name : "nit"})
  @Post('/sync/:nit')
  async sync(@Param() params: any, @Body() body:any ): Promise<any> {
    
    return this.synchronizationService.sincronizarCatalogo(
      params.nit,
      body.sucursal?body.sucursal:0,
      body.salePoint?body.salePoint:0,
      body.modality?body.modality:1
    );
  }

  @ApiOperation({
    summary: 'Ping service',
    description: 'Method for send test ping to service',
  })
  @ApiParam({ name : "nit"})
  @Get('/ping/:nit')
  async pinService(@Param() params: any){
    const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit(Parameters.codigoSistema, params.nit,);
     return this.managerService.ping(ebSystemDto);
  }

  @ApiOperation({
    summary: 'Reload Config',
    description: 'Reload Config',
  })
  @Get('/reloadConfig')
  async reloadConfig(){
     return this.managerService.reloadConfig();
  }

  @ApiOperation({
    summary: 'Show Config',
    description: 'Show Config',
  })
  @Get('/showConfig')
  async showConfig(){
     return this.managerService.showConfig();
  }

  
  @ApiOperation({
    summary: 'Get Systems',
    description: 'Get Systems',
  })
  @ApiParam({ name : "nit", required: false})
  @Get(['system/:nit', 'system'])
  async system(@Param() params: any) {
    if(params.nit)
      return this.ebSystemService.findBySystemCodeAndNit(Parameters.codigoSistema, params.nit,);
    return this.ebSystemService.findSystems();
    
  }

  @ApiOperation({
    summary: 'Get Point Sales',
    description: 'Get Point Sales',
  })
  @ApiParam({ name : "nit"})
  @ApiParam({ name : "sucursalCode"})
  @ApiParam({ name : "salePointCode", required: false})
  @Get(['pointSale/:nit/:sucursalCode','pointSale/:nit/:sucursalCode/:salePointCode' ])
  async pointSale(@Param() params: any){
    const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit(Parameters.codigoSistema, params.nit,);

    if(params.salePointCode)
      return this.managerService.pointSale(Number(params.sucursalCode), Number(params.salePointCode), ebSystemDto)
    else
      return this.managerService.pointSales(Number(params.sucursalCode), ebSystemDto);
      
  }

  @ApiOperation({
    summary: 'Get Point Sales',
    description: 'Get Point Sales',
  })
  @ApiParam({ name : "nit"})
  @ApiParam({ name : "sucursalCode"})
  @ApiParam({ name : "salePointCode", required: false})
  @Get('pointSaleSin/:nit/:sucursalCode' )
  async pointSaleSin(@Param() params: any){
    const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit(Parameters.codigoSistema, params.nit,);
    return this.managerService.pointSalesSin(Number(params.sucursalCode), ebSystemDto );
    
      
  }
  

  @ApiOperation({
    summary: 'Create Point Sales',
    description: 'Create Point Sales',
  })
  @ApiParam({ name : "nit"})
  @ApiParam({ name : "sucursalCode"})
  @ApiBody({ type: CreatePointSaleDto, description: 'Body' })
  @Post('pointSale/:nit/:sucursalCode')
  async createPointSale(@Body() createPointSaleDto:CreatePointSaleDto, @Param() params: any){
    const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit(Parameters.codigoSistema, params.nit,);

    return this.managerService.createPointSale(createPointSaleDto, params.sucursalCode, ebSystemDto);
      
  }



  @ApiOperation({
    summary: 'Get Sucursal',
    description: 'Get Sucursal',
  })
  @ApiParam({ name : "nit"})
  @ApiParam({ name : "sucursalCode", required: false})
  @Get(['sucursal/:nit/:sucursalCode','sucursal/:nit' ])
  async sucursal(@Param() params: any){
    const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit(Parameters.codigoSistema, params.nit,);
    
    if(params.sucursalCode)
      return this.managerService.sucursal  (Number(params.sucursalCode), ebSystemDto)
    else
      return this.managerService.sucursales( ebSystemDto);
      
  }

}