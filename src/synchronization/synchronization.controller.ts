import { Body, Controller, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { SynchronizationService } from "./synchronization.service";

@ApiTags('Manager')
@Controller('mng')
export class SynchronizationController{
  
  constructor(private synchronizationService: SynchronizationService,){}
  
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
}