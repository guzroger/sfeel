import {  BadRequestException, ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { EbBillDto } from '../model/dto/ebBill.dto';
import { EbSystemDto } from '../model/dto/ebSystem.dto';
import { BillingCodeService } from '../common/billingCode.service';
import { ResponseFilterException } from 'src/utils/filterException/responseFilter.exception';
import { SynDateHourService } from '../model/synDateHour.service';
import { EbSectorDocumentService } from 'src/model/ebSectorDocument.service';
import { EbSucursalService } from '../model/ebSucursal.service';
import { EbSalePointService } from '../model/ebSalePoint.service';
import { CompresorGZIP } from 'src/common/tools/compressGZIP';
import { SendBillResponseDto } from 'src/bill/dto/sendBillResponse.dto';
import { EbBillService } from 'src/model/ebBill.service';
import { ParameterService } from 'src/common/parameter.service';
import { EbTransactionDto } from '../model/dto/ebTransaction.dto';
import { EbTransactionService } from '../model/ebTransaction.service';
import { EbTransactionMessageDto } from 'src/model/dto/ebTransactionMessage.dto';
import { EbCufdDto } from '../model/dto/ebCufd.dto';
import { EbEventService } from '../model/ebEvent.service';
import { HealthService } from '../common/health.service';
import { ContingencyService } from 'src/contingency/contingency.service';
import { CreateEventDto } from '../contingency/dto/createEvent.dto';
import { EbBillFileService } from '../model/ebBillFile.service';
import { EbSystemService } from 'src/model/ebSystem.service';
import { Parameters } from 'src/common/tools/parameters';
import { FacturacionService } from 'src/webservice/facturacion.service';
import { SendNoteDto } from 'src/bill/dto/sendNote.dto';
import { EbDosificationService } from '../model/ebDosification.service';
import { BillPageOptionsDto } from 'src/bill/dto/billPageOptions.dto';
import { DocumentBillService } from '../common/document-bill.service';
import { SendMailDto } from 'src/common/dto/mail.interface';
import { MailerService } from '../common/mailer.service';
import { ConfigService } from '@nestjs/config';
import { Constants } from 'src/common/enum/constants.enum';
import { Algorithm } from 'src/common/tools/algorithm';
import { BillXmlService } from 'src/common/bill-xml.service';
import { AppLogService } from 'src/common/app-log.service';


@Injectable()
export class BillService {
  constructor(
    private billingCodeService: BillingCodeService,
    private synDateHourService: SynDateHourService,
    private ebSectorDocumentService: EbSectorDocumentService,
    private ebSucursalService: EbSucursalService,
    private ebSalePointService: EbSalePointService,
    private facturacionService: FacturacionService,
    private ebBillService: EbBillService,
    private parameterService: ParameterService,
    private ebTransactionService:EbTransactionService,
    private ebEventService:EbEventService,
    private healthService:HealthService, 
    private contingencyService:ContingencyService,
    private ebBillFileService:EbBillFileService,
    private ebSystemService:EbSystemService,
    private ebDosificationService:EbDosificationService,
    private documentBillService:DocumentBillService,
    private mailerService:MailerService,
    private configService:ConfigService,
    private billXmlService:BillXmlService,
    private appLogService:AppLogService
  ) {}
  
  findAll(billPageOptionsDto:BillPageOptionsDto, ebSystemDto:EbSystemDto) {
    return  this.ebBillService.findAll(billPageOptionsDto, ebSystemDto);
  }

  async getBills(ebSystemDto:EbSystemDto, sucursalCode:number, salePointSale:number, begin:string, end:string){
    const dateBegin = new Date(begin + "T00:00:00.000Z");
    const dateEnd = new Date(end + "T23:59:59.000Z");
    if(salePointSale!=null)
      return this.ebBillService.findByDateEmitter( ebSystemDto, Number(sucursalCode), Number(salePointSale), dateBegin, dateEnd);
    else
      return this.ebBillService.findByDateEmitter( ebSystemDto, Number(sucursalCode), null, dateBegin, dateEnd);
  }

  async getBill(ebSystemDto:EbSystemDto, billId:number){

    const bill = await this.ebBillService.findById(  billId, true);    
    if(bill.nitEmitter != ebSystemDto.nit )
      throw new BadRequestException("Bill is from another business");

    return bill;
  }

  async getBillByCufAndNumber(ebSystemDto:EbSystemDto, cuf:string, numberFact:number){
    const bill = await this.ebBillService.findByCufAndNumber(  cuf, numberFact, ebSystemDto.nit, true);    
    if(bill.nitEmitter != ebSystemDto.nit )
      throw new BadRequestException("Bill is from another business");

    return bill;
  }

  async parseNote(sendNoteDto: SendNoteDto, ebSystemDto: EbSystemDto){
    const ebBillDtoOriginal = await this.getBill(ebSystemDto, sendNoteDto.noteData.billIdRef); 
    if(!ebBillDtoOriginal)
      throw new BadRequestException("Bill reference no validate");
  }

  async sendBillMassive(ebBillDto: EbBillDto, ebSystemDto: EbSystemDto,): Promise<SendBillResponseDto> {
    const sendBillResponseDto = new SendBillResponseDto();

    const tranId = -1;
    const userId = -1;
    const serviceName = "bill.sendBillMassive";
    const paramIn = `billNumber: ${ebBillDto.billNumber}|emitteType: ${ebBillDto.emitteType}|dateEmitte: ${ebBillDto.dateEmitte}|billDocument: ${ebBillDto.billDocument}`;
    let messageError = "OK";
    let idError = 0;
    
    if ( ebBillDto.billStatusId === Constants.BillStatusSent && ebBillDto.receptionCode != null ) {
      messageError= 'The bill has already sent, Date ' + ebBillDto.dateEmitte;
      idError = HttpStatus.CONFLICT;
      await this.appLogService.create(serviceName, paramIn, "",tranId, userId, idError, messageError, "");
      throw new ResponseFilterException( messageError, idError );
    }
    
    try{  
      //We find the type of emission by the point sale
      ebBillDto.systemCode = ebSystemDto.systemCode;
      const ebSucursalDto = await this.ebSucursalService.findBySucursalCode( ebBillDto.sucursalCode, ebSystemDto.systemId,);
      const ebSalePointDto = await this.ebSalePointService.findBySalePointCode( ebBillDto.salePointCode != null ? ebBillDto.salePointCode : 0, ebSucursalDto.id );
      const ebSectorDocumentDto = await this.ebSectorDocumentService.findById(ebBillDto.sectorDocumentCode,);
      ebBillDto.modalityCode = ebSalePointDto.modalityCode;
      ebBillDto.municipality = ebSucursalDto.municipality;    
      ebBillDto.documentTaxCode = ebSectorDocumentDto.documentTaxCode;
  
      if(ebBillDto.documentTaxCode==Constants.DocumentTaxCodeBillWithoitIva)
        ebBillDto.amountIva = 0;
  
      if(!ebBillDto.dateEmitte)
        ebBillDto.dateEmitte = await this.synDateHourService.sisdate( ebSystemDto.systemCode, ebSystemDto.nit,);
      
      //We get the CUIS
      const ebCuisDto = await this.billingCodeService.getCuis( ebSystemDto, ebBillDto.sucursalCode, ebBillDto.salePointCode, ebBillDto.modalityCode, ebBillDto.dateEmitte,);
      let ebCufdDto = null;

      if(!ebBillDto.billNumber){
        const ebDosificationDto = await this.ebDosificationService.findValid(ebSystemDto.systemCode, ebSystemDto.nit, 
          '0', Constants.TypeDosification, ebBillDto.modalityCode);
        if(!ebDosificationDto){
          messageError= "Dosification not found, is necessary for to number.";
          idError = HttpStatus.CONFLICT;
          await this.appLogService.create(serviceName, paramIn, "",tranId, userId, idError, messageError, "");
          throw new ConflictException(messageError);
        }
          
        ebBillDto.billNumber = ebDosificationDto.current;
        ebDosificationDto.current = ebDosificationDto.current + 1;
        await this.ebDosificationService.update(ebDosificationDto);
      }
      
      ebBillDto.emitteType = Constants.EmitterTypeMassive
      ebCufdDto = await this.billingCodeService.getCufd( ebSystemDto, ebBillDto.sucursalCode, ebBillDto.salePointCode, ebBillDto.modalityCode, this.parameterService.getNow(),ebCuisDto.cuis,);
      messageError= "Bill offilne Masive.";
      idError = HttpStatus.ACCEPTED;
      await this.appLogService.create(serviceName, paramIn, "",tranId, userId, idError, messageError, "");
      return this.sendBillOffLine( ebBillDto, ebSystemDto, ebCufdDto,  Constants.EmitterTypeMassive);
      
    }
    catch(e){  
      messageError= e.message;
      idError = HttpStatus.CONFLICT;
      await this.appLogService.create(serviceName, paramIn, "",tranId, userId, idError, messageError, "");    
      throw e;
    }
    
  }
  async sendBill( ebBillDto: EbBillDto, ebSystemDto: EbSystemDto,): Promise<SendBillResponseDto> {
    const sendBillResponseDto = new SendBillResponseDto();

    const tranId = -1;
    const userId = -1;
    const serviceName = " ";
    const paramIn = `billNumber: ${ebBillDto.billNumber}|emitteType: ${ebBillDto.emitteType}|dateEmitte: ${ebBillDto.dateEmitte}|billDocument: ${ebBillDto.billDocument}`;
    let messageError = "OK";
    let idError = 0;
    
    if ( ebBillDto.billStatusId === Constants.BillStatusSent && ebBillDto.receptionCode != null ) {
      messageError= 'The bill has already sent, Date ' + ebBillDto.dateEmitte;
      idError = HttpStatus.CONFLICT;
      await this.appLogService.create(serviceName, paramIn, "",tranId, userId, idError, messageError, "");
      throw new ResponseFilterException( serviceName + ":" +  messageError, idError );
    }
    
    try{  
      //We find the type of emission by the point sale
      ebBillDto.systemCode = ebSystemDto.systemCode;
      const ebSucursalDto = await this.ebSucursalService.findBySucursalCode( ebBillDto.sucursalCode, ebSystemDto.systemId,);
      const ebSalePointDto = await this.ebSalePointService.findBySalePointCode( ebBillDto.salePointCode != null ? ebBillDto.salePointCode : 0, ebSucursalDto.id );
      const ebSectorDocumentDto = await this.ebSectorDocumentService.findById(ebBillDto.sectorDocumentCode,);
      ebBillDto.modalityCode = ebSalePointDto.modalityCode;
      ebBillDto.municipality = ebSucursalDto.municipality;    
      ebBillDto.documentTaxCode = ebSectorDocumentDto.documentTaxCode;
  
      if(ebBillDto.documentTaxCode==Constants.DocumentTaxCodeBillWithoitIva)
        ebBillDto.amountIva = 0;
  
      if (ebBillDto.emitteType == Constants.EmitterTypeOnline)
        ebBillDto.dateEmitte = await this.synDateHourService.sisdate( ebSystemDto.systemCode, ebSystemDto.nit,);
      if(!ebBillDto.dateEmitte)
        ebBillDto.dateEmitte = await this.synDateHourService.sisdate( ebSystemDto.systemCode, ebSystemDto.nit,);
      
      //We get the CUIS
      const ebCuisDto = await this.billingCodeService.getCuis( ebSystemDto, ebBillDto.sucursalCode, ebBillDto.salePointCode, ebBillDto.modalityCode, ebBillDto.dateEmitte,);
      let ebCufdDto = null;

      if(!ebBillDto.billNumber){
        const ebDosificationDto = await this.ebDosificationService.findValid(ebSystemDto.systemCode, ebSystemDto.nit, 
          '0', Constants.TypeDosification, ebBillDto.modalityCode);
        if(!ebDosificationDto){
          messageError= "Dosification not found, is necessary for to number.";
          idError = HttpStatus.CONFLICT;
          await this.appLogService.create(serviceName, paramIn, "",tranId, userId, idError, messageError, "");
          throw new ConflictException(messageError);
        }
          
        ebBillDto.billNumber = ebDosificationDto.current;
        ebDosificationDto.current = ebDosificationDto.current + 1;
        await this.ebDosificationService.update(ebDosificationDto);
      }
      
      if(ebBillDto.emitteType === Constants.EmitterTypeMassive)
      {
        if(!ebBillDto.dateEmitte)
          ebBillDto.dateEmitte = await this.synDateHourService.sisdate( ebSystemDto.systemCode, ebSystemDto.nit,);
  
        ebCufdDto = await this.billingCodeService.getCufd( ebSystemDto, ebBillDto.sucursalCode, ebBillDto.salePointCode, ebBillDto.modalityCode, this.parameterService.getNow(),ebCuisDto.cuis,);
        idError = HttpStatus.ACCEPTED;
        messageError = "Bill Offline Massive";
        await this.appLogService.create(serviceName, paramIn, "",tranId, userId, idError, messageError, "");
        return this.sendBillOffLine( ebBillDto, ebSystemDto, ebCufdDto,  Constants.EmitterTypeMassive);
      }
      

      //We search if exits event
      const events = await this.ebEventService.findEvent(ebSystemDto.systemCode, ebSystemDto.nit, ebBillDto.sucursalCode, ebBillDto.salePointCode, ebBillDto.sectorDocumentCode, ebBillDto.dateEmitte);
      
      if(events.length>0)
      {
        ebCufdDto = await this.billingCodeService.getCufdById(events[0].cufdEvent);
        ebBillDto.eventId = events[0].eventId;
        //We set the bill number if have cafc
        if(events[0].cafc && events[0].sectorDocumentCode === ebBillDto.sectorDocumentCode) 
        {
          ebBillDto.cafc = events[0].cafc;
          const ebDosificationDto = await  this.ebDosificationService.findById(ebBillDto.cafc);
          ebBillDto.billNumber = ebDosificationDto.current + 1;
          ebDosificationDto.current = ebDosificationDto.current + 1;

          await this.ebDosificationService.update(ebDosificationDto);
        }

        idError = HttpStatus.ACCEPTED;
        messageError = "Bill Offline Event";
        await this.appLogService.create(serviceName, paramIn, "",tranId, userId, idError, messageError, "");
        return this.sendBillOffLine( ebBillDto, ebSystemDto, ebCufdDto, Constants.EmitterTypeContingency);
      }
      
      //we check connection
      const check = await this.checkConnection(ebBillDto);
      if(!check)  
      {
        ebCufdDto = await this.billingCodeService.getCufd( ebSystemDto, ebBillDto.sucursalCode, ebBillDto.salePointCode, ebBillDto.modalityCode, ebBillDto.dateEmitte,ebCuisDto.cuis,);
        idError = HttpStatus.ACCEPTED;
        messageError = "Bill Offline Event";
        await this.appLogService.create(serviceName, paramIn, "",tranId, userId, idError, messageError, "");
        return this.sendBillOffLine( ebBillDto, ebSystemDto, ebCufdDto, Constants.EmitterTypeContingency);
      }
      
      ebCufdDto = await this.billingCodeService.getCufd( ebSystemDto, ebBillDto.sucursalCode, ebBillDto.salePointCode, ebBillDto.modalityCode, ebBillDto.dateEmitte,ebCuisDto.cuis,);    
  
      //we set the document exception, If NIT not valid = 1
      ebBillDto.exceptionDocument = 0;
      if (ebBillDto.documentType === Constants.DocumentTypeNit) {
        const verificarNit = await this.billingCodeService.verificarNit( ebSystemDto, ebBillDto.sucursalCode, ebBillDto.modalityCode, ebCuisDto.cuis, ebBillDto.billDocument.trim(),);        
        if (!verificarNit) ebBillDto.exceptionDocument = 1;
      }
      const cuf = Algorithm.getCuf(
          ebSystemDto.nit,
          ebBillDto.dateEmitte,
          ebBillDto.sucursalCode,
          ebBillDto.salePointCode,
          ebBillDto.modalityCode,
          ebBillDto.emitteType,
          ebBillDto.sectorDocumentCode,
          ebBillDto.documentTaxCode,
          ebBillDto.billNumber,
        ) + ebCufdDto.controlCode;
  
      ebBillDto.cuf = cuf;
      ebBillDto.cufd = ebCufdDto.cufd;
      
  
      //1)  Generate  XML file associated with the envoice according to the economic activity.
      //2)     Firmar el archivo obtenido conforme estándar XMLDSig (sólo en el caso de la Modalidad Electrónica en Línea).  
      const xml = await this.billXmlService.createBillXml(ebSystemDto, ebBillDto, ebSectorDocumentDto, ebSucursalDto, );
      
      //3)     Validar contra el XSD asociado.
  
      //4)     Comprimir el archivo XML en formato Gzip, mismo que debe ser enviado en la etiqueta archivo.
      const buffer = await CompresorGZIP.compressGzip(xml);
      const dataBase64 = buffer.toString('base64');
  
      //5)   Obtener el HASH (SHA256) del archivo compreso obtenido en el paso anterior, mismo que debe ser enviado en la etiqueta hashArchivo.
      const hash = Algorithm.algoritmoHash(buffer);
  
      const service = this.facturacionService.getService(ebBillDto.modalityCode==Constants.ElectronicOnlineBilling?ebSectorDocumentDto.serviceFe:ebSectorDocumentDto.serviceFec);
      const response = await service.recepcionFactura(
          ebBillDto,
          ebSystemDto,
          ebCuisDto.cuis,
          dataBase64,
          hash,
          ebBillDto.modalityCode==Constants.ElectronicOnlineBilling?ebSectorDocumentDto.urlWsFe:ebSectorDocumentDto.urlWsFec
        );
  
      ebBillDto.qr = this.getQr( ebBillDto.nitEmitter, ebBillDto.cuf, ebBillDto.billNumber, );
      ebBillDto.note = Parameters.noteOnLine;
  
      //response.then((data)=> { console.log(data)});
      let tagResponse = 'ns2:recepcionFacturaResponse';
      if(ebBillDto.documentTaxCode==3)
        tagResponse='ns2:recepcionDocumentoAjusteResponse'
      
      sendBillResponseDto.statusCode = response[tagResponse].RespuestaServicioFacturacion.codigoEstado;
      sendBillResponseDto.statusDescription = response[tagResponse].RespuestaServicioFacturacion.codigoDescripcion;
      sendBillResponseDto.message = response[tagResponse].RespuestaServicioFacturacion.codigoDescripcion;
      sendBillResponseDto.receptionCode = response[tagResponse].RespuestaServicioFacturacion.codigoRecepcion;
      sendBillResponseDto.mensajesList = response[tagResponse].RespuestaServicioFacturacion.mensajesList;
      
      ebBillDto.statusCode = sendBillResponseDto.statusCode;
      ebBillDto.statusDescription = sendBillResponseDto.statusDescription;
      ebBillDto.receptionCode = sendBillResponseDto.receptionCode;
      
      if(sendBillResponseDto.statusCode === "908")
        ebBillDto.billStatusId  = Constants.BillStatusSent;
      else
        ebBillDto.billStatusId  = Constants.BillStatusSentError;
      
      let ebBillDtoSave = null;
      if(!ebBillDto.billId)  
        ebBillDtoSave = await this.ebBillService.create(ebBillDto);
      else
        ebBillDtoSave = await this.ebBillService.update(ebBillDto);
  
      this.saveTransactions(ebBillDtoSave, sendBillResponseDto, response.soapRequest, response.soapResponse, xml, 'recepcionFactura');
      this.ebBillFileService.saveXml(ebBillDtoSave.billId, xml);
  
      if(sendBillResponseDto.statusCode === "908"){
        sendBillResponseDto.cuf = ebBillDto.cuf;
        sendBillResponseDto.cufd = ebBillDto.cufd;
        sendBillResponseDto.billNumber = ebBillDto.billNumber;
        sendBillResponseDto.billId = ebBillDtoSave.billId;
        sendBillResponseDto.dateEmitte = ebBillDto.dateEmitte;
        sendBillResponseDto.legend = ebBillDto.legend;
        sendBillResponseDto.qr = ebBillDto.qr;
        sendBillResponseDto.note = ebBillDto.note;
      }
    }
    catch(e){
      //console.log(e);
      if(e.status == 502 ){                
        let dateEmiite = ebBillDto.dateEmitte.toISOString();
        dateEmiite= dateEmiite.replace('Z', '');

        const createEventDto = new CreateEventDto();
        createEventDto.beginAt = dateEmiite;
        createEventDto.eventType = 1;
        createEventDto.description = "Sin conexión";
        createEventDto.nit = ebBillDto.nitEmitter;
        createEventDto.sucursalCode = ebBillDto.sucursalCode;
        createEventDto.salePointCode = ebBillDto.salePointCode;
        
        await this.contingencyService.createEvent(createEventDto);

        const ebCuisDto = await this.billingCodeService.getCuis( ebSystemDto, ebBillDto.sucursalCode, ebBillDto.salePointCode, ebBillDto.modalityCode, ebBillDto.dateEmitte,);
        const ebCufdDto = await this.billingCodeService.getCufd( ebSystemDto, ebBillDto.sucursalCode, ebBillDto.salePointCode, ebBillDto.modalityCode, ebBillDto.dateEmitte,ebCuisDto.cuis,);

        idError = HttpStatus.GATEWAY_TIMEOUT;
        messageError = "Bill Offline Timeout";
        await this.appLogService.create(serviceName, paramIn, "",tranId, userId, idError, messageError, "");
        return this.sendBillOffLine( ebBillDto, ebSystemDto, ebCufdDto, Constants.EmitterTypeContingency);
      }
      ebBillDto.statusCode = String(e.status);
      ebBillDto.statusDescription = e.message;
      
      let ebBillDtoSave = null;
      if(!ebBillDto.billId)  
        ebBillDtoSave = await this.ebBillService.create(ebBillDto);
      else
        ebBillDtoSave = await this.ebBillService.update(ebBillDto);


      throw e;
    }
    return sendBillResponseDto;
  }

  
  
  async changeStatusAdjustedBill(ebBillDto:EbBillDto){
    ebBillDto.billStatusId = Constants.BillStatusAdjusted;
    this.ebBillService.update(ebBillDto);
  }

  async checkConnection(ebBillDto:EbBillDto):Promise<boolean> {
    let dateEmiite = this.parameterService.getNow().toISOString();
    dateEmiite= dateEmiite.replace('Z', '');

    const check = await this.healthService.isConnectionOnLine();
    if(! check)
    {
      const createEventDto = new CreateEventDto();
      createEventDto.beginAt = dateEmiite;
      createEventDto.eventType = 1;
      createEventDto.description = "Sin conexión a internet";
      createEventDto.nit = ebBillDto.nitEmitter;
      createEventDto.sucursalCode = ebBillDto.sucursalCode;
      createEventDto.salePointCode = ebBillDto.salePointCode;
      
      const e = await this.contingencyService.createEvent(createEventDto);
      if(e.event && e.event.eventId)
        ebBillDto.eventId= e.event.eventId;
      return false;
    }

    const checkSin = await this.healthService.isConnectionOnLineSin();
    if(!checkSin)
    {
      const createEventDto = new CreateEventDto();
      createEventDto.beginAt = dateEmiite;
      createEventDto.eventType = 2;
      createEventDto.description = "Sin conexión a Impuestos";
      createEventDto.nit = ebBillDto.nitEmitter;
      createEventDto.sucursalCode = ebBillDto.sucursalCode;
      createEventDto.salePointCode = ebBillDto.salePointCode;
      
      const e = await this.contingencyService.createEvent(createEventDto);
      if(e.event && e.event.eventId)
        ebBillDto.eventId= e.event.eventId;
      return false;
    }

    return true;
  }

  async sendBillOffLine( ebBillDto: EbBillDto, ebSystemDto: EbSystemDto, ebCufdDto:EbCufdDto,  emitteType:number): Promise<SendBillResponseDto> {
    
    const ebSucursalDto = await this.ebSucursalService.findBySucursalCode( ebBillDto.sucursalCode, ebSystemDto.systemId,);    
    const ebSectorDocumentDto = await this.ebSectorDocumentService.findById(ebBillDto.sectorDocumentCode,);

    ebBillDto.emitteType = emitteType;
    if(emitteType === Constants.EmitterTypeMassive)
      ebBillDto.note = Parameters.noteOnLine;    
    if(emitteType === Constants.EmitterTypeContingency)
      ebBillDto.note = Parameters.noteOffLine;
    
    if(!ebBillDto.dateEmitte)
      ebBillDto.dateEmitte = await this.synDateHourService.sisdate( ebSystemDto.systemCode, ebSystemDto.nit,);

    ebBillDto.exceptionDocument = 0;
    if (ebBillDto.documentType === Constants.DocumentTypeNit) {
      ebBillDto.exceptionDocument = 1;
    }

    const sendBillResponseDto = new SendBillResponseDto();
        
    const cuf = Algorithm.getCuf(
        ebSystemDto.nit,
        ebBillDto.dateEmitte,
        ebBillDto.sucursalCode,
        ebBillDto.salePointCode,
        ebBillDto.modalityCode,
        ebBillDto.emitteType,
        ebBillDto.sectorDocumentCode,
        ebBillDto.documentTaxCode,
        ebBillDto.billNumber,
      ) + ebCufdDto.controlCode;

    ebBillDto.cuf = cuf;
    ebBillDto.cufd = ebCufdDto.cufd;
    ebBillDto.qr = this.getQr( ebBillDto.nitEmitter, ebBillDto.cuf, ebBillDto.billNumber, );
    
    const xml = await this.billXmlService.createBillXml(ebSystemDto, ebBillDto, ebSectorDocumentDto, ebSucursalDto);  

    let ebBillDtoSave = await this.ebBillService.create(ebBillDto); 
    this.ebBillFileService.saveXml(ebBillDtoSave.billId, xml);
    
    sendBillResponseDto.statusCode = "908";
    sendBillResponseDto.statusDescription = "Documento fuera de linea";
    sendBillResponseDto.cuf = ebBillDto.cuf;
    sendBillResponseDto.cufd = ebBillDto.cufd;
    sendBillResponseDto.billNumber = ebBillDto.billNumber;
    sendBillResponseDto.billId = ebBillDto.billId;
    sendBillResponseDto.dateEmitte = ebBillDto.dateEmitte;
    sendBillResponseDto.legend = ebBillDto.legend;
    sendBillResponseDto.qr = ebBillDto.qr;
    sendBillResponseDto.note = ebBillDto.note;
    sendBillResponseDto.billId = ebBillDtoSave.billId;

    return sendBillResponseDto;
  }

  async getBillById(billId:number):Promise<EbBillDto> {
    const ebBillDto = await this.ebBillService.findById(billId);
    
    if(!ebBillDto)
      throw new NotFoundException("Bill data not found");

      return ebBillDto
  }

  async voidBill(ebSystemDto: EbSystemDto, billId:number){
    const ebBillDto = await this.ebBillService.findById(billId);
    
    if(!ebBillDto)
      throw new NotFoundException("Bill data not found");

    if(ebBillDto.annulled && ebBillDto.annulled==="1")
      throw new NotFoundException("The bill cannot be cancelled");

    const ebCuisDto = await this.billingCodeService.getCuis( ebSystemDto, ebBillDto.sucursalCode, ebBillDto.salePointCode, ebBillDto.modalityCode, this.parameterService.getNow());
    const ebCufdDto = await this.billingCodeService.getCufd( ebSystemDto, ebBillDto.sucursalCode, ebBillDto.salePointCode, ebBillDto.modalityCode, ebBillDto.dateEmitte,ebCuisDto.cuis,);
    const ebSectorDocumentDto = await this.ebSectorDocumentService.findById(ebBillDto.sectorDocumentCode,); 

    const service = this.facturacionService.getService(ebBillDto.modalityCode==Constants.ElectronicOnlineBilling?ebSectorDocumentDto.serviceFe:ebSectorDocumentDto.serviceFec);
    const resp = await service.anulacionFactura(ebBillDto, ebSystemDto, ebCuisDto.cuis, ebCufdDto.cufd,   ebBillDto.modalityCode==Constants.ElectronicOnlineBilling?ebSectorDocumentDto.urlWsFe:ebSectorDocumentDto.urlWsFec);

    let tagResponse = 'ns2:anulacionFacturaResponse';
    if(ebBillDto.documentTaxCode==3)
      tagResponse='ns2:anulacionDocumentoAjusteResponse'

      ebBillDto.statusCode = resp[tagResponse].RespuestaServicioFacturacion.codigoEstado;
      ebBillDto.statusDescription = resp[tagResponse].RespuestaServicioFacturacion.codigoDescripcion;

    if(resp[tagResponse].RespuestaServicioFacturacion.codigoEstado==='905')
    {
      ebBillDto.billStatusId = Constants.BillStatusAnnulled
      ebBillDto.annulled = "1";
    }

    let ebBillDtoSave = await this.ebBillService.update(ebBillDto); 

    return { "statusCode": resp[tagResponse].RespuestaServicioFacturacion.codigoEstado,
            "message" : resp[tagResponse].RespuestaServicioFacturacion.codigoDescripcion,
            "statusDescription" : resp[tagResponse].RespuestaServicioFacturacion.codigoDescripcion,
          "mensajesList":  resp[tagResponse].RespuestaServicioFacturacion.mensajesList }
    
  }

  async getXmlBill(ebSystemDto: EbSystemDto, billId:number){
    const ebBillDto = await this.ebBillService.findById(billId);
  
    if(!ebBillDto)
      throw new NotFoundException("Bill data not found");

     const iBillFileDto = await this.ebBillFileService.findById(billId);

    return {
      billId:  billId,
      cuf: ebBillDto.cuf,
      xml: iBillFileDto?iBillFileDto.xml:""
    }
  }

  async getPdfBill(ebSystemDto: EbSystemDto, billId:number, type:string){
    const ebBillDto = await this.ebBillService.findById(billId, true);
    
    if(!ebBillDto)
      throw new NotFoundException("Bill data not found");
    
    const ebSucursalDto = await this.ebSucursalService.findBySucursalCode( ebBillDto.sucursalCode, ebSystemDto.systemId,);
    return this.documentBillService.getBillPdf(ebBillDto, ebSystemDto, ebSucursalDto, type);

  }

  async billStatus( billId:number){
    
    const ebBillDto = await this.ebBillService.findById(billId);

    const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit( Parameters.codigoSistema,ebBillDto.nitEmitter);
    const ebCuisDto = await this.billingCodeService.getCuis( ebSystemDto, ebBillDto.sucursalCode, ebBillDto.salePointCode, ebBillDto.modalityCode, this.parameterService.getNow());
    const ebCufdDto = await this.billingCodeService.getCufd( ebSystemDto, ebBillDto.sucursalCode, ebBillDto.salePointCode, ebBillDto.modalityCode, ebBillDto.dateEmitte,ebCuisDto.cuis,);
    const ebSectorDocumentDto = await this.ebSectorDocumentService.findById(ebBillDto.sectorDocumentCode,);

    const service = this.facturacionService.getService(ebBillDto.modalityCode==Constants.ElectronicOnlineBilling?ebSectorDocumentDto.serviceFe:ebSectorDocumentDto.serviceFec);
    const statusBill = await service.verificacionEstadoFactura(ebBillDto, ebSystemDto,ebCuisDto.cuis,ebCufdDto.cufd, ebBillDto.modalityCode==Constants.ElectronicOnlineBilling?ebSectorDocumentDto.urlWsFe:ebSectorDocumentDto.urlWsFec);


    let tagResponse = 'ns2:verificacionEstadoFacturaResponse';
    if(ebBillDto.documentTaxCode==3)
      tagResponse='ns2:verificacionEstadoDocumentoAjusteResponse'

    return { "statusCode": statusBill[tagResponse].RespuestaServicioFacturacion.codigoEstado,
              "message": statusBill[tagResponse].RespuestaServicioFacturacion.codigoDescripcion, 
              "statusDescription": statusBill[tagResponse].RespuestaServicioFacturacion.codigoDescripcion, 
              "receptionCode": statusBill[tagResponse].RespuestaServicioFacturacion.codigoRecepcion,
              "mensajesList":  statusBill[tagResponse].RespuestaServicioFacturacion.mensajesList};
          
  }


  async reverseVoidBill(ebSystemDto: EbSystemDto, billId:number){
    const ebBillDto = await this.ebBillService.findById(billId);
    
    if(!ebBillDto)
      throw new NotFoundException("Bill data not found");

    const ebCuisDto = await this.billingCodeService.getCuis( ebSystemDto, ebBillDto.sucursalCode, ebBillDto.salePointCode, ebBillDto.modalityCode, this.parameterService.getNow());
    const ebCufdDto = await this.billingCodeService.getCufd( ebSystemDto, ebBillDto.sucursalCode, ebBillDto.salePointCode, ebBillDto.modalityCode, ebBillDto.dateEmitte,ebCuisDto.cuis,);
    const ebSectorDocumentDto = await this.ebSectorDocumentService.findById(ebBillDto.sectorDocumentCode,); 

    const service = this.facturacionService.getService(ebBillDto.modalityCode==Constants.ElectronicOnlineBilling?ebSectorDocumentDto.serviceFe:ebSectorDocumentDto.serviceFec);
    const resp = await service.reversionAnulacionFactura(ebBillDto, ebSystemDto, ebCufdDto.cufd,  ebCuisDto.cuis, ebBillDto.modalityCode==Constants.ElectronicOnlineBilling?ebSectorDocumentDto.urlWsFe:ebSectorDocumentDto.urlWsFec);
    
    let tagResponse = 'ns2:reversionAnulacionFacturaResponse';
    if(ebBillDto.documentTaxCode==3)
      tagResponse='ns2:reversionAnulacionDocumentoAjusteResponse'

    ebBillDto.statusCode = resp[tagResponse].RespuestaServicioFacturacion.codigoEstado;
    ebBillDto.statusDescription = resp[tagResponse].RespuestaServicioFacturacion.codigoDescripcion;

    if(resp[tagResponse].RespuestaServicioFacturacion.codigoEstado==='907')
    {
      ebBillDto.billStatusId = Constants.BillStatusSent;
      ebBillDto.statusCode = '908';
    }

    let ebBillDtoSave = await this.ebBillService.update(ebBillDto); 

    return { "statusCode": resp[tagResponse].RespuestaServicioFacturacion.codigoEstado,
            "message" : resp[tagResponse].RespuestaServicioFacturacion.codigoDescripcion,
            "statusDescription" : resp[tagResponse].RespuestaServicioFacturacion.codigoDescripcion,
          "mensajesList":  resp[tagResponse].RespuestaServicioFacturacion.mensajesList }
    
  }

  

  async updateBillStatus(billId:number){
    const ebBillDto = await this.ebBillService.findById(billId);
    

    if(!ebBillDto)
      throw new NotFoundException("Bill data not found");

    const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit( Parameters.codigoSistema,ebBillDto.nitEmitter);
    const ebCuisDto = await this.billingCodeService.getCuis( ebSystemDto, ebBillDto.sucursalCode, ebBillDto.salePointCode, ebBillDto.modalityCode, this.parameterService.getNow());
    const ebCufdDto = await this.billingCodeService.getCufd( ebSystemDto, ebBillDto.sucursalCode, ebBillDto.salePointCode, ebBillDto.modalityCode, ebBillDto.dateEmitte,ebCuisDto.cuis,);
    const ebSectorDocumentDto = await this.ebSectorDocumentService.findById(ebBillDto.sectorDocumentCode,);

    const service = this.facturacionService.getService(ebBillDto.modalityCode==Constants.ElectronicOnlineBilling?ebSectorDocumentDto.serviceFe:ebSectorDocumentDto.serviceFec);
    const statusBill = await service.verificacionEstadoFactura(ebBillDto, ebSystemDto,ebCuisDto.cuis,ebCufdDto.cufd, ebBillDto.modalityCode==Constants.ElectronicOnlineBilling?ebSectorDocumentDto.urlWsFe:ebSectorDocumentDto.urlWsFec);

    let tagResponse = 'ns2:verificacionEstadoFacturaResponse';
    if(ebBillDto.documentTaxCode==3)
      tagResponse='ns2:verificacionEstadoDocumentoAjusteResponse'

    let codeStatus = statusBill[tagResponse].RespuestaServicioFacturacion.codigoEstado;
    if(codeStatus=="690")
      codeStatus = "908";

    if(ebBillDto.statusCode!=codeStatus || 
      ebBillDto.statusDescription!= statusBill[tagResponse].RespuestaServicioFacturacion.codigoDescripcion ||
      ebBillDto.receptionCode != statusBill[tagResponse].RespuestaServicioFacturacion.codigoRecepcion)
    {
      ebBillDto.statusCode = codeStatus;
      ebBillDto.statusDescription = statusBill[tagResponse].RespuestaServicioFacturacion.codigoDescripcion;
      ebBillDto.receptionCode = statusBill[tagResponse].RespuestaServicioFacturacion.codigoRecepcion;
    }

    let ebBillDtoSave = await this.ebBillService.update(ebBillDto); 

    return { "statusCode": statusBill[tagResponse].RespuestaServicioFacturacion.codigoEstado,
              "message": statusBill[tagResponse].RespuestaServicioFacturacion.codigoDescripcion, 
              "statusDescription": statusBill[tagResponse].RespuestaServicioFacturacion.codigoDescripcion, 
              "receptionCode": statusBill[tagResponse].RespuestaServicioFacturacion.codigoRecepcion,
              "mensajesList":  statusBill[tagResponse].RespuestaServicioFacturacion.mensajesList};
  }

  async saveTransactions(ebBillDto:EbBillDto, sendBillResponseDto: SendBillResponseDto, soapRequest:string, soapResponse:string, xml:string, operation:string){
    const ebTransactionDto = new EbTransactionDto();
    ebTransactionDto.referenceId = ebBillDto.billId;
    ebTransactionDto.receptionCode = sendBillResponseDto.receptionCode;
    ebTransactionDto.soapRequest = soapRequest;
    ebTransactionDto.soapResponse = soapResponse;
    ebTransactionDto.xml = xml;
    ebTransactionDto.statusCode = sendBillResponseDto.statusCode;
    ebTransactionDto.statusDescription = sendBillResponseDto.statusDescription;
    ebTransactionDto.type = 'Document';
    ebTransactionDto.operation = operation;
    ebTransactionDto.cuf = ebBillDto.cuf;

    if(sendBillResponseDto.mensajesList!= null){
      if(Array.isArray(sendBillResponseDto.mensajesList))
      {
        ebTransactionDto.messages =  sendBillResponseDto.mensajesList.map( (item) => {
          const ebTransactionMessageDto = new EbTransactionMessageDto();
          ebTransactionMessageDto.description = item.descripcion;
          ebTransactionMessageDto.receptionCode = item.codigo;
          ebTransactionMessageDto.billId = 0;
          return ebTransactionMessageDto;
        });
      }
      else
      {
        const ebTransactionMessageDto = new EbTransactionMessageDto();
        ebTransactionMessageDto.description = sendBillResponseDto.mensajesList.descripcion;
        ebTransactionMessageDto.receptionCode = sendBillResponseDto.mensajesList.codigo;
        ebTransactionMessageDto.billId = 0;

        ebTransactionDto.messages = Array(ebTransactionMessageDto);
        
      }

    }

    await this.ebTransactionService.create(ebTransactionDto);
  }

  async sendMail(ebSystemDto: EbSystemDto, billId:number){
    const ebBillDto = await this.ebBillService.findById(billId, true);

    const ebSucursalDto = await this.ebSucursalService.findBySucursalCode( ebBillDto.sucursalCode, ebSystemDto.systemId,);
    const bill = await this.documentBillService.getBillPdf(ebBillDto, ebSystemDto, ebSucursalDto, null);
    const iBillFileDto = await this.ebBillFileService.findById(billId);

    let dateEmiite = ebBillDto.dateEmitte.toISOString();
    dateEmiite= dateEmiite.replace('Z', '');
    dateEmiite= dateEmiite.replace('T', ' ');
    dateEmiite= dateEmiite.substr(0, dateEmiite.indexOf('.') );

    let message = "";
    if(ebBillDto.statusCode === '908' && ebBillDto.statusDescription === 'REVERSION DE ANULACION CONFIRMADA')
      message= `Señor/Señora/Señores <b>${ebBillDto.billName}</b>: <br><br> Su factura/nota Nro. <b>${ebBillDto.billNumber}</b> <br> CUF:${ebBillDto.cuf} <br> Emitida en fecha ${dateEmiite}, <b>fue restablecida</b> <br><br> Que tenga buen dia.`
    else if(ebBillDto.statusCode === '908')
      message=`Señor/Señora/Señores <b>${ebBillDto.billName}</b>: <br><br> Su factura/nota Nro. <b>${ebBillDto.billNumber}</b> <br> CUF: ${ebBillDto.cuf}  <br> Emitida en fecha ${dateEmiite}, ya esta disponible <br><br> Que tenga buen dia.`;
    else if(ebBillDto.statusCode === '905')
      message= `Señor/Señora/Señores <b>${ebBillDto.billName}</b>: <br><br> Su factura/nota Nro. <b>${ebBillDto.billNumber}</b> <br> CUF:${ebBillDto.cuf} <br> Emitida en fecha ${dateEmiite}, fue anulada por <b>POR ERROR DE EMISION</b> <br><br> Que tenga buen dia.`


    const dto: SendMailDto = {
      from: { name: this.configService.get<string>('APP_NAME'), address: this.configService.get<string>('DEFAULT_MAIL_FROM')},
      recipients: [ { name: ebBillDto.billName,  address: ebBillDto.email }],
      subject: "Factura " + this.configService.get<string>('APP_NAME'), 
      html: message, 
      attachments: [ {filename: billId + ".pdf" , content:  bill.bill ,     encoding: 'base64'},
                     {filename: billId + ".xml" , content:  iBillFileDto.xml  }      ]

    }
    const resp = await this.mailerService.sendMail(dto);

    return {
      "response": resp.response
    }
  }

  async verfificarNit(ebSystemDto:EbSystemDto,  modalityCode:number, billDocument:string){
    const ebCuisDto = await this.billingCodeService.getCuis( ebSystemDto, 0, 0, modalityCode, new Date());
    return this.billingCodeService.verificarNit( ebSystemDto, 0, modalityCode, ebCuisDto.cuis, billDocument.trim());        
    
  }

  getQr(nit: number, cuf: string, numero: number): string {
    return (Parameters.urlQr +'?nit=' + nit + '&cuf=' + cuf + '&numero=' + numero + '&t=2');
  }
}
