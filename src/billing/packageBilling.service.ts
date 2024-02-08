import { Injectable, NotFoundException } from "@nestjs/common";
import { Constants } from "src/common/constants.enum";
import { EbPackageBillDto } from "src/model/dto/ebPackageBill.dto";
import { EbSystemDto } from "src/model/dto/ebSystem.dto";
import { EbBillService } from "src/model/ebBill.service";
import { EbEventService } from "src/model/ebEvent.service";
import { EbPackageBillService } from "src/model/ebPackageBill.service";
import { XmlDocumentBillParser } from "src/xml/xmlDocumentBillParser";
import { EbSectorDocumentService } from "src/model/ebSectorDocument.service";
import { EbSucursalService } from "src/model/ebSucursal.service";
import { EbSalePointService } from "src/model/ebSalePoint.service";
import { SignerXmlService } from "src/common/signerXml.service";
import { CompresorGZIP } from "src/common/compressGZIP";
import { Algorithm } from "src/common/algorithm";
import { BillingCodeService } from "./billingCode.service";
import { ParameterService } from "src/common/parameter.service";
import { EbTransactionDto } from "src/model/dto/ebTransaction.dto";
import { EbTransactionMessageDto } from "src/model/dto/ebTransactionMessage.dto";
import { SendPackageResponseDto } from "src/bill/dto/sendPackageResponse.dto";
import { EbTransactionService } from "src/model/ebTransaction.service";
import { EbBillFileService } from "src/model/ebBillFile.service";
import { EbPackageFileService } from "src/model/ebPackageFile.service";
import { FacturacionService } from "src/webservice/facturacion.service";
import { CertificateType, Prisma, ebEvent } from '@prisma/client';
import { AppCertificateService } from "src/model/appCertificate.service";
import { PrismaService } from "src/prisma/prisma.service";
import { MensajesListDto } from "src/bill/dto/mensajesList.dto";
import { MapperService } from "src/bill/dto/mapper.service";
import { Parameters } from "src/common/parameters";


@Injectable()
export class PackageBillingService {
    constructor(private billingCodeService: BillingCodeService,
        private ebPackageBillService:EbPackageBillService, 
        private ebBillService:EbBillService, 
        private ebEventService:EbEventService,
        private ebSectorDocumentService: EbSectorDocumentService,
        private ebSucursalService: EbSucursalService,
        private ebSalePointService: EbSalePointService,
        private signerXmlService: SignerXmlService,
        private facturacionService: FacturacionService,
        private parameterService: ParameterService,
        private ebTransactionService:EbTransactionService,
        private ebBillFileService:EbBillFileService,
        private ebPackageFileService: EbPackageFileService,
        private appCertificateService: AppCertificateService,
        private mapper:MapperService,
        private prismaService:PrismaService){}

    async createPackages(ebSystemDto:EbSystemDto, sucursalCode:number, salePointCode:number, emitteType:number, sectorDocumentCode:string){
        let list = null;
        
        if(sectorDocumentCode)
            list = await this.ebBillService.getBillWithoutPackageSector(ebSystemDto, sucursalCode, salePointCode, emitteType, -1, sectorDocumentCode);
        else
            list = await this.ebBillService.getBillWithoutPackage(ebSystemDto, sucursalCode, salePointCode, emitteType, -1);
        
        if(!list)
            throw new NotFoundException();

        const listPackages = Array();
        let maxSize = 1;
        if(emitteType === Constants.EmitterTypeContingency)
            maxSize=500;
        if(emitteType === Constants.EmitterTypeMassive)
            maxSize=1000;

        const mapPacakges = new Map();
        let key = new Map();
        let keys = new Map();
        let listBills = Array();
        let numberPackage= 0;
        list.map( item => {
            key = new Map();
            if(listBills.length >= maxSize)
                numberPackage++;
            
            key.set("numberPackage", numberPackage);
            key.set("sectorDocumentCode", item.sectorDocumentCode);

            if(emitteType == Constants.EmitterTypeContingency){
                key.set("cafc", item.cafc);
                key.set("eventoId", item.eventId);
            }
            
            if(!mapPacakges.get(this.toStringMaps(key)) || typeof mapPacakges.get(this.toStringMaps(key)) ===  "undefined" )
                listBills = Array();
            else
                listBills = mapPacakges.get(this.toStringMaps(key));

            listBills.push(item);
            mapPacakges.set(this.toStringMaps(key), listBills);
            keys.set(this.toStringMaps(key), key);

        });

        
        for (let [i, value] of mapPacakges) {
            const ebPackageBillDto = new EbPackageBillDto();
            ebPackageBillDto.systemCode = ebSystemDto.systemCode;
            ebPackageBillDto.nitEmitter = ebSystemDto.nit;
            ebPackageBillDto.sucursalCode = sucursalCode;
            ebPackageBillDto.salePointCode = salePointCode;
            ebPackageBillDto.sectorDocumentCode =  keys.get(i).get("sectorDocumentCode");
            ebPackageBillDto.cafc = keys.get(i).get("cafc");
            
            if(keys.get(i).get("eventoId"))
            {
                const event = await this.ebEventService.findById(keys.get(i).get("eventoId"));
                if(event &&  event.recepcionCode)
                    ebPackageBillDto.eventCode = event.recepcionCode;
            }
            ebPackageBillDto.documentTaxCode = value[0].documentTaxCode;
            ebPackageBillDto.modalityCode = value[0].modalityCode;
            ebPackageBillDto.emitteType = emitteType;            
            ebPackageBillDto.bills = value;

            const packageBill = await this.ebPackageBillService.create(ebPackageBillDto);
            listPackages.push(packageBill);
        }
        
        return listPackages;
    }

    async sendPackage(ebSystemDto:EbSystemDto,packageId:number){
        const ebPackageBill = await this.ebPackageBillService.findById(packageId);
        const ebCuisDto = await this.billingCodeService.getCuis( ebSystemDto, ebPackageBill.sucursalCode, ebPackageBill.salePointCode, ebPackageBill.modalityCode, this.parameterService.getNow());        
        const ebCufdDto = await this.billingCodeService.getCufd( ebSystemDto, ebPackageBill.sucursalCode, ebPackageBill.salePointCode, ebPackageBill.modalityCode, this.parameterService.getNow(),ebCuisDto.cuis);
        
        let cufdEvent = null;
        let ebCufdDtoEvent = null;
    
        const legendList = await this.mapper.getLegendList(ebPackageBill.bills[0], ebSystemDto);

        if(ebPackageBill.eventCode)
        {
            const ebEvent = await this.ebEventService.findEvnetByEventCode(ebSystemDto.systemCode, ebSystemDto.nit, ebPackageBill.eventCode);
            cufdEvent = ebEvent.cufdEvent;
            ebCufdDtoEvent = await this.billingCodeService.getCufdById(cufdEvent);
        }
        
        const ebSectorDocumentDto = await this.ebSectorDocumentService.findById(ebPackageBill.sectorDocumentCode,);
        const sbSucursalDto = await this.ebSucursalService.findBySucursalCode( ebPackageBill.sucursalCode, ebSystemDto.systemId,);
        const ebSalePointDto = await this.ebSalePointService.findBySalePointCode( ebPackageBill.salePointCode != null ? ebPackageBill.salePointCode : 0, sbSucursalDto.id ); 

        const primaryKey = await this.appCertificateService.getValidCertificate(
            ebSystemDto.systemCode,
            ebSystemDto.nit,
            CertificateType.PRIMARY_KEY
          );
          
          const publicKey = await this.appCertificateService.getValidCertificate(
            ebSystemDto.systemCode,
            ebSystemDto.nit,
            CertificateType.PUBLIC_KEY
          );
        
        var tar = require('tar-stream') ;
        var pack = tar.pack();
        var mapXmls = new Map();
        var mapBills = new Map();
       

        await Promise.all(ebPackageBill.bills.map( async (bill) => {
            
            //const ebBillDto =  await this.ebBillService.findById(bill.billId, true);
            const ebBillDto =  bill;
            ebBillDto.exceptionDocument = 1;
            
            if(ebPackageBill.emitteType == Constants.EmitterTypeMassive)
            {
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
            }
            else{
                if(!ebBillDto.cufd)
                    ebBillDto.cufd = cufdEvent;

                if(!ebBillDto.cuf){
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
                      ) + ebCufdDtoEvent.controlCode;
                
                    ebBillDto.cuf = cuf;
                }
            }
            if(!ebBillDto.legend)  
            { 
                const i = Math.floor(Math.random() * (legendList.length - 1));      
                ebBillDto.legend = legendList[i].description ;
            }

            if(!ebBillDto.note)
                ebBillDto.note = Parameters.noteOffLine;    
                
            //1)  Generate  XML file associated with the envoice according to the economic activity.
            let xml = '';
            if(ebBillDto.modalityCode === Constants.ComputerizedOnlineBilling)
            {
                xml = XmlDocumentBillParser[ebSectorDocumentDto.methodFec]( ebBillDto, sbSucursalDto, );
            }
            else{
                xml = XmlDocumentBillParser[ebSectorDocumentDto.methodFe]( ebBillDto, sbSucursalDto,);
            }              
            //2)     Firmar el archivo obtenido conforme estándar XMLDSig (sólo en el caso de la Modalidad Electrónica en Línea).
            if(ebBillDto.modalityCode = Constants.ElectronicOnlineBilling)
            {
                xml = this.signerXmlService.signerBillXmlWithCert( xml, ebSystemDto, primaryKey, publicKey);
            }
            
            pack.entry({name: ebBillDto.cuf}, xml);

            //await this.ebBillFileService.saveXml(ebBillDto.billId, xml); 
            //await this.ebBillService.update(ebBillDto);
            
            mapXmls.set(ebBillDto.billId, xml);
            mapBills.set(ebBillDto.billId, ebBillDto);
            //3)     Validar contra el XSD asociado.
        
        }));
        
        pack.finalize();        
        const endPack = new Promise((resolve, reject)=>{
            let tarData = ''
            pack.on('data', function (d) { tarData += d })
            pack.on('end', function () {   resolve(tarData);  })
            
        });
            
        const tarFile = await endPack as string;
                
        //3 Comprimir con Gzip al archivo del contenedor TAR (ejemplo: paquete.tar.gz),
        const buffer = await CompresorGZIP.compressGzip(tarFile);
        const dataBase64 = buffer.toString('base64');
        
       //4 Obtener el HASH (SHA256) del archivo compreso obtenido en el paso anterior
       const hash = Algorithm.algoritmoHash(buffer);
       
       //we save the compress file
       await this.ebPackageFileService.saveFile(buffer, ebPackageBill.packageId);
       ebPackageBill.cufd = ebCufdDto.cufd;
       //we save xml and bills
       for (let [key, value] of mapBills) {            
            await this.ebBillFileService.saveXml(value.billId, mapXmls.get(key));
            await this.ebBillService.update(value);
        }
       

       const service = this.facturacionService.getService(ebPackageBill.modalityCode==Constants.ElectronicOnlineBilling?ebSectorDocumentDto.serviceFe:ebSectorDocumentDto.serviceFec);
       let response = null
       if(ebPackageBill.emitteType == Constants.EmitterTypeMassive)
            response = await service.recepcionMasivaFactura(ebPackageBill, ebSystemDto, ebCuisDto.cuis, dataBase64, hash, ebPackageBill.modalityCode==Constants.ElectronicOnlineBilling?ebSectorDocumentDto.urlWsFe:ebSectorDocumentDto.urlWsFec);
       else
            response = await service.recepcionPaqueteFactura(ebPackageBill, ebSystemDto, ebCuisDto.cuis, dataBase64, hash, ebPackageBill.modalityCode==Constants.ElectronicOnlineBilling?ebSectorDocumentDto.urlWsFe:ebSectorDocumentDto.urlWsFec);
            
        let tag = 'ns2:recepcionPaqueteFacturaResponse'
        if(ebPackageBill.emitteType===Constants.EmitterTypeMassive) 
            tag = 'ns2:recepcionMasivaFacturaResponse'
                   
       ebPackageBill.receptionCode = response[tag].RespuestaServicioFacturacion.codigoRecepcion;
       ebPackageBill.statusCode = response[tag].RespuestaServicioFacturacion.codigoEstado;
       ebPackageBill.statusDescription = response[tag].RespuestaServicioFacturacion.codigoDescripcion;

       if(ebPackageBill.statusCode==='901')
        ebPackageBill.billStatusId = Constants.BillStatusSentUnconfirmed;
       
       await this.ebPackageBillService.update(ebPackageBill);

       const sendPackageResponseDto = new  SendPackageResponseDto()
       sendPackageResponseDto.receptionCode = ebPackageBill.receptionCode;
       sendPackageResponseDto.statusCode = ebPackageBill.statusCode;
       sendPackageResponseDto.statusDescription = ebPackageBill.statusDescription;
       sendPackageResponseDto.message = ebPackageBill.statusDescription;
       sendPackageResponseDto.mensajesList = response[tag].RespuestaServicioFacturacion.mensajesList;

       this.saveTransactions(ebPackageBill, sendPackageResponseDto, response.soapRequest, response.soapResponse, 'recepcionPaquete');       
       this.updateCodeStatusBill(sendPackageResponseDto.mensajesList, ebPackageBill, '901', 'PENDIENTE', Constants.BillStatusSentUnconfirmed);
       

       return sendPackageResponseDto;
    }

    async updateCodeStatusBill(mensajesList:MensajesListDto[]|MensajesListDto, ebPackageBill:EbPackageBillDto, statusCode:string, statusDescription:string, billStatusId:number){
        let filesObs = []

       if(mensajesList){
            const ebPackageFileDto = await this.ebPackageFileService.findById(ebPackageBill.packageId);
            const files = await CompresorGZIP.getListNameFileTarGzip(ebPackageFileDto.file);
                    
            if(Array.isArray(mensajesList))
            {
                const updateEbBill = Array();
                mensajesList = await Promise.all(mensajesList.map( async item => { 
                    const cuf =files[Number(item.numeroArchivo)];
                    if(cuf)
                    {
                        if(!item.advertencia || item.advertencia==='false'){
                            const ebBillDto = await this.ebBillService.findByCuf(cuf);
                            if(ebBillDto){
                                updateEbBill.push(this.prismaService.ebBill.update({
                                    where: {
                                        billId: Number(ebBillDto.billId),
                                    },
                                    data: {
                                        billStatusId: Number(Constants.BillStatusSent),
                                        receptionCode: ebPackageBill.receptionCode,
                                        statusCode: item.codigo,
                                        statusDescription:  item.descripcion,
                                    },
                                }));

                                item.billId = ebBillDto.billId;
                                filesObs.push(ebBillDto.billId);
                            }
                        }
                    }
                    
                    return item;
                    
                }));

                await this.prismaService.$transaction(updateEbBill);
            }
            else {
                
                if(mensajesList.numeroArchivo && Number(mensajesList.numeroArchivo)>=0){
                    const cuf =files[Number(mensajesList.numeroArchivo)];                
                    const ebBillDto = await this.ebBillService.findByCuf(cuf);
                    if(ebBillDto){
                        const tmp = await this.prismaService.ebBill.update({
                            where: {
                                billId: Number(ebBillDto.billId),
                            },
                            data: {                                
                                billStatusId: Number(Constants.BillStatusSentError),
                                statusCode: mensajesList.codigo,
                                statusDescription: mensajesList.descripcion,
                            },
                        });
                        filesObs.push(ebBillDto.billId);
                        mensajesList.billId = ebBillDto.billId;
                    }
                    
                }

            }
        }

        //register correct bills
        const billIds =   ebPackageBill.bills.map(  ebBillDto => {
            const found = filesObs.find( (element) =>  element === ebBillDto.billId );
        
            if(!found)
                return  ebBillDto.billId;
            else
                return -1;
        
        });

        await this.prismaService.ebBill.updateMany({
            where: { billId : { in:  billIds   } },
            data : {
                statusCode: statusCode,
                statusDescription: statusDescription,
                billStatusId: billStatusId,
                receptionCode: ebPackageBill.receptionCode
            }

        });
        
    }

    saveTransactions(ebPackageBillDto:EbPackageBillDto, sendPackageResponse: SendPackageResponseDto, soapRequest:string, soapResponse:string,  operation:string){
        const ebTransactionDto = new EbTransactionDto();
        ebTransactionDto.referenceId = ebPackageBillDto.packageId;
        ebTransactionDto.receptionCode = sendPackageResponse.receptionCode;
        ebTransactionDto.soapRequest = soapRequest;
        ebTransactionDto.soapResponse = soapResponse;
        ebTransactionDto.statusCode = sendPackageResponse.statusCode;
        ebTransactionDto.statusDescription = sendPackageResponse.statusDescription;
        ebTransactionDto.type = 'Package';
        ebTransactionDto.operation = operation;
        
    
        if(sendPackageResponse.mensajesList!= null){
          if(Array.isArray(sendPackageResponse.mensajesList))
          {
            ebTransactionDto.messages =  sendPackageResponse.mensajesList.map( (item) => {
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
            ebTransactionMessageDto.description = sendPackageResponse.mensajesList.descripcion;
            ebTransactionMessageDto.receptionCode = sendPackageResponse.mensajesList.codigo;
            ebTransactionMessageDto.billId = 0;
    
            ebTransactionDto.messages = Array(ebTransactionMessageDto);
            
          }
    
        }
    
        this.ebTransactionService.create(ebTransactionDto);
      }

    toStringMaps(map:Map<string, any>):string{
        let txt = '';
        for (let [i, value] of map)
        {
            if(value)
                txt = txt + value;           
        }

        return txt;
    }

    async validatePackage(ebSystemDto:EbSystemDto,packageId:number, intend:number=1){
        const ebPackageBill = await this.ebPackageBillService.findById(packageId);
        const ebCuisDto = await this.billingCodeService.getCuis( ebSystemDto, ebPackageBill.sucursalCode, ebPackageBill.salePointCode, ebPackageBill.modalityCode, this.parameterService.getNow());
        const ebSectorDocumentDto = await this.ebSectorDocumentService.findById(ebPackageBill.sectorDocumentCode,);

        const service = this.facturacionService.getService(ebPackageBill.modalityCode==Constants.ElectronicOnlineBilling?ebSectorDocumentDto.serviceFe:ebSectorDocumentDto.serviceFec);
        let response = null;
        if(ebPackageBill.emitteType == Constants.EmitterTypeMassive)
            response = await service.validacionRecepcionMasivaFactura(ebPackageBill,ebSystemDto, ebCuisDto.cuis, ebPackageBill.modalityCode==Constants.ElectronicOnlineBilling?ebSectorDocumentDto.urlWsFe:ebSectorDocumentDto.urlWsFec);
        else
            response = await service.validacionRecepcionPaqueteFactura(ebPackageBill,ebSystemDto, ebCuisDto.cuis, ebPackageBill.modalityCode==Constants.ElectronicOnlineBilling?ebSectorDocumentDto.urlWsFe:ebSectorDocumentDto.urlWsFec);

        let tag = 'ns2:validacionRecepcionPaqueteFacturaResponse'
        if(ebPackageBill.emitteType===Constants.EmitterTypeMassive) 
            tag = 'ns2:validacionRecepcionMasivaFacturaResponse'

        ebPackageBill.statusCode = response[tag].RespuestaServicioFacturacion.codigoEstado;
        ebPackageBill.statusDescription = response[tag].RespuestaServicioFacturacion.codigoDescripcion;
 
        this.ebPackageBillService.update(ebPackageBill);
        const sendPackageResponseDto = new  SendPackageResponseDto()
        sendPackageResponseDto.receptionCode = ebPackageBill.receptionCode;
        sendPackageResponseDto.statusCode = ebPackageBill.statusCode;
        sendPackageResponseDto.statusDescription = ebPackageBill.statusDescription
        sendPackageResponseDto.message = ebPackageBill.statusDescription;
        sendPackageResponseDto.mensajesList = response[tag].RespuestaServicioFacturacion.mensajesList;

        if(sendPackageResponseDto.statusCode==='901' &&  intend <4)
        {
            await new Promise(r => setTimeout(r, 2000));
            return await this.validatePackage(ebSystemDto,packageId, intend+1);
        }
                        
        this.saveTransactions(ebPackageBill, sendPackageResponseDto, response.soapRequest, response.soapResponse, 'validacionPaquete');
        this.updateCodeStatusBill(sendPackageResponseDto.mensajesList, ebPackageBill, '908', 'VALIDADO', Constants.BillStatusSent);
        
        return sendPackageResponseDto;
    }

    async sendPackageCompleteCycle(ebSystemDto:EbSystemDto, sucursalCode:number, salePointCode:number, emitteType:number, sectorDocumentCode:string){
        const listPackages = await this.createPackages(ebSystemDto,sucursalCode,salePointCode,emitteType,sectorDocumentCode);
        
        return await Promise.all( listPackages.map( async item => {
            const respSend = await this.sendPackage(ebSystemDto, item.packageId);

            if(respSend.statusCode == "901")
            {
                const respValidate = await this.validatePackage(ebSystemDto, item.packageId);
                return { "packageID": item.packageId, "statusCode": respValidate.statusCode, "statusDescription": respValidate.statusDescription  }
            }
            else{
                return { "packageID": item.packageId, "statusCode": respSend.statusCode, "statusDescription": respSend.statusDescription  }
            }
        }));
    }

     splitarray(input, spacing)
    {
        var output = [];
        for (var i = 0; i < input.length; i += spacing)
        {
            if(input.slice(i, i + spacing)!=null)
                output[output.length] = input.slice(i, i + spacing);
        }

        return output;
    }
}