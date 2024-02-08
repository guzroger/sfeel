import { BadRequestException, Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { BillingService } from '../billing/billing.service';
import { SendBillDto } from './dto/sendBill.dto';
import { EbSystemService } from 'src/model/ebSystem.service';
import { ParameterService } from 'src/common/parameter.service';
import { Constants } from 'src/common/constants.enum';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SendBillResponseDto } from './dto/sendBillResponse.dto';
import { MapperService } from './dto/mapper.service';
import { Parameters } from 'src/common/parameters';
import { SendNoteDto } from './dto/sendNote.dto';

@ApiTags('bill')
@Controller('bill')
export class BillController {
  constructor(
    private billingService: BillingService,
    private ebSystemService: EbSystemService,    
    private mapper:MapperService
  ) {}
  
  @ApiOperation({
    summary: 'Get list bills',
    description: 'Method for Get list bills',
  })
  @ApiParam({ name : "nit"})
  @ApiQuery({ name : "sucursalCode", required: false})
  @ApiQuery({ name : "salePointCode", required: false})
  @ApiQuery({ name : "dateBegin", required: false})
  @ApiQuery({ name : "dateEnd", required: false})
  @ApiQuery({ name : "billId", required: false})
  @ApiQuery({ name : "cuf", required: false})
  @ApiQuery({ name : "number", required: false})
  @Get(":nit")  
  async getBills(@Param() param:any, @Query() query:any){
    const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit(
      Parameters.codigoSistema, param.nit,
    );
    if(query.cuf && query.number)
      return this.billingService.getBillByCufAndNumber(ebSystemDto, query.cuf, Number(query.number) );

    if(query.billId && param.nit)
      return this.billingService.getBill(ebSystemDto, query.billId );

    if(!query.sucursalCode || !query.dateBegin || !query.dateEnd || !param.nit)
      throw new BadRequestException();  

    return this.billingService.getBills(ebSystemDto, query.sucursalCode, query.salePointCode, query.dateBegin, query.dateEnd);
  } 

  
  
  @ApiOperation({
    summary: 'Send bill to SIN',
    description: 'Method for send bill to SIN',
  })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: SendBillResponseDto,
  })
  @ApiBody({ type: SendBillDto, description: 'Body' })
  @Post('sendBill')
  async sendBill( @Body() sendBillDto: SendBillDto,): Promise<SendBillResponseDto> {
    const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit(
      Parameters.codigoSistema, sendBillDto.business.nit,
    );
    const ebBillDto = await this.mapper.mapEbBillDto(sendBillDto, ebSystemDto);

    //ebBillDto.documentTaxCode = Constants.DocumentTaxCodeBill;
    if(!ebBillDto.emitteType)
      ebBillDto.emitteType = Constants.EmitterTypeOnline;

    return this.billingService.sendBill(ebBillDto, ebSystemDto);
  }

  @ApiOperation({
    summary: 'Send bill to SIN by id',
    description: 'Method for send bill to SIN by id',
  })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: SendBillResponseDto,
  })
  @ApiBody({ type: SendBillDto, description: 'Body' })
  @Post('sendBillById')
  async sendBillById( @Body() sendBillDto: Record<string, any>,): Promise<SendBillResponseDto> {
    const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit(
      Parameters.codigoSistema, sendBillDto.nit,
    );
  
    const ebBillDto = await this.billingService.getBill(ebSystemDto, sendBillDto.billId);
    this.mapper.setLegend(ebBillDto, ebSystemDto);
    
    if(!ebBillDto.emitteType)
      ebBillDto.emitteType = Constants.EmitterTypeOnline;

    return this.billingService.sendBill(ebBillDto, ebSystemDto);
  }
  
  @ApiOperation({
    summary: 'Send note to SIN',
    description: 'Method for send note to SIN',
  })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: SendBillResponseDto,
  })
  @ApiBody({ type: SendNoteDto, description: 'Body' })
  @Post('sendNote')
  async sendNote(@Body() sendNoteDto: SendNoteDto) : Promise<SendBillResponseDto> {
    const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit(
      Parameters.codigoSistema, sendNoteDto.business.nit,);

    const ebBillDtoOriginal = await this.billingService.getBill(ebSystemDto, sendNoteDto.noteData.billIdRef);
    const ebBillDto = await this.mapper.mapSendNoteDtoToEbBillDto(sendNoteDto, ebBillDtoOriginal, ebSystemDto);
    
    const sendBillResponseDto = await this.billingService.sendBill(ebBillDto, ebSystemDto);

    if(sendBillResponseDto.statusCode === "908"){
      await this.billingService.changeStatusAdjustedBill(ebBillDtoOriginal);
    }

    return sendBillResponseDto;
  }


  @ApiOperation({
    summary: 'Annular bill',
    description: 'Method for annular a bill',
  })
  @ApiParam({ name : "nit"})
  @ApiParam({ name : "id"})
  @Put('voidBill/:nit/:id')
  async voidBill(@Param() param:any){
    const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit( Parameters.codigoSistema,param.nit,);
    return this.billingService.voidBill(ebSystemDto, param.id);
  }

  @ApiOperation({
    summary: 'Reverse Annular bill',
    description: 'Method for reverse annular a bill',
  })
  @ApiParam({ name : "nit"})
  @ApiParam({ name : "id"})
  @Put('reverseVoidBill/:nit/:id')
  async reverseVoidBill(@Param() param:any){
    const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit( Parameters.codigoSistema,param.nit,);
    return this.billingService.reverseVoidBill(ebSystemDto, param.id);
  }


  @ApiOperation({
    summary: 'Get xml Bill',
    description: 'Method for get the xml of bill',
  })
  @ApiParam({ name : "id"})
  @ApiParam({ name : "nit"})
  @Get('xml/:nit/:id')
  async getBillXml(@Param() param:any){
    const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit( Parameters.codigoSistema,param.nit,);
    return this.billingService.getXmlBill(ebSystemDto, param.id);
  }


  @ApiOperation({
    summary: 'Get status Bill',
    description: 'Method for get the status of bill',
  })
  @ApiParam({ name : "id"})
  @Get("status/:id")
  async getBillStatus(@Param() param:any){
    return this.billingService.billStatus(param.id);
  }

  @ApiOperation({
    summary: 'Update status Bill from SIN',
    description: 'Method for update the status of bill from SIN',
  })
  @ApiParam({ name : "id"})
  @Put("status/:id")
  async updateBillStatus(@Param() param:any){
    return this.billingService.updateBillStatus(param.id);
  }

 

}

