import { ConflictException, HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { EbEventService } from '../model/ebEvent.service';
import { EbEventDto } from '../model/dto/ebEvent.dto';
import { CreateEventDto } from "./dto/createEvent.dto";
import { EbSystemService } from "src/model/ebSystem.service";
import { ParameterService } from "src/common/parameter.service";
import { EbCufdService } from '../model/ebCufd.service';
import { GeConstantService } from "src/model/geConstant.service";
import { WsEventosSignificativos } from "src/webservice/wsEventosSignificativos.service";
import { BillingCodeService } from "src/billing/billingCode.service";
import { EbSucursalService } from "src/model/ebSucursal.service";
import { EbSalePointService } from "src/model/ebSalePoint.service";
import { Constants } from "src/common/constants.enum";
import { Parameters } from "src/common/parameters";
import { EbDosificationService } from '../model/ebDosification.service';

@Injectable()
export class ContingencyService {
    constructor(private ebEventService:EbEventService, 
        private ebSystemService:EbSystemService, 
        private parameterService:ParameterService, 
        private ebCufdService:EbCufdService, 
        private geConstantService:GeConstantService,
        private wsEventosSignificativos:WsEventosSignificativos,
        private billingCodeService:BillingCodeService,
        private ebSucursalService: EbSucursalService,
        private ebSalePointService: EbSalePointService,
        private ebDosificationService: EbDosificationService ) {

    }

    async createEvent(createEventDto:CreateEventDto):Promise<any>{
        const ebSystemDto =  await this.ebSystemService.findBySystemCodeAndNit(Parameters.codigoSistema, createEventDto.nit);
        
        const beginAt = this.parameterService.parseDate(createEventDto.beginAt);
        
        const events = await this.ebEventService.findEvent(ebSystemDto.systemCode, ebSystemDto.nit, createEventDto.sucursalCode, createEventDto.salePointCode, createEventDto.sectorDocumentCode, beginAt);
        let eventRegistered = false;
        events.map(item => {
            if(item.sectorDocumentCode=== '0')
                eventRegistered=true;
        })

        if(eventRegistered){
            throw new ConflictException("Event already registered");
        }

        //we get the last cufd
        let ebCufdDto = await this.ebCufdService.findByExpirationDate(ebSystemDto, createEventDto.sucursalCode, createEventDto.salePointCode, beginAt);

        if(ebCufdDto==null)
        {
            const geConstantDto = await this.geConstantService.findById(""+createEventDto.eventType, 'TIPO_EVENTO');
            let tmpDate = new Date();
            tmpDate.setDate(beginAt.getDate()- Number(geConstantDto.value));
            ebCufdDto = await this.ebCufdService.findByExpirationDate(ebSystemDto, createEventDto.sucursalCode, createEventDto.salePointCode,tmpDate);

            if(ebCufdDto==null)
                throw new NotFoundException('No cufd found for this event');

                
        }

        const ebEventDto = new EbEventDto();
        ebEventDto.systemCode = ebSystemDto.systemCode;
        ebEventDto.nit = ebSystemDto.nit;
        ebEventDto.sucursalCode = createEventDto.sucursalCode;
        ebEventDto.salePointCode = createEventDto. salePointCode;
        ebEventDto.eventType = createEventDto.eventType;
        ebEventDto.description = createEventDto.description;        
        ebEventDto.cufdEvent = ebCufdDto.cufd;
        ebEventDto.sectorDocumentCode = createEventDto.sectorDocumentCode;
        //ebEventDto.selfManageable        
        ebEventDto.beginAt = beginAt;
        if(createEventDto.endAt!=null)
            ebEventDto.endAt = this.parameterService.parseDate(createEventDto.endAt);

        if(createEventDto.eventType>=5 && createEventDto.cafc)
            ebEventDto.cafc = createEventDto.cafc;
        else if(createEventDto.eventType>=5){
            const ebDosificationDto = await this.ebDosificationService.findValid(ebSystemDto.systemCode, ebSystemDto.nit, createEventDto.sectorDocumentCode, "CAFC");
            if(ebDosificationDto)
                ebEventDto.cafc = ebDosificationDto.code;
        }

        
        return  { "statusCode": 201,
                  "statusDescription": "OK",
                  "message": "OK",
                  "event": this.returnEvent( await this.ebEventService.create(ebEventDto))};
    }

    

    async closeEvent(eventId:number, nit:number):Promise<any>{
        const ebSystemDto =  await this.ebSystemService.findBySystemCodeAndNit(Parameters.codigoSistema, nit);
        const eventDto = await this.ebEventService.findById(eventId);

        if(!eventDto)
            throw new NotFoundException("Event not found");

        if(eventDto.eventStatusId != Constants.EventStatusNew)
            throw new ConflictException("Event already closed")

        const sbSucursalDto = await this.ebSucursalService.findBySucursalCode( eventDto.sucursalCode, ebSystemDto.systemId,);
        const ebSalePointDto = await this.ebSalePointService.findBySalePointCode( eventDto.salePointCode != null ? eventDto.salePointCode : 0, sbSucursalDto.id );
        const now = this.parameterService.getNow();

        const ebCuisDto = await this.billingCodeService.getCuis( ebSystemDto, eventDto.sucursalCode, eventDto.salePointCode, ebSalePointDto.modalityCode, now,);
        const ebCufdDto = await this.billingCodeService.getCufd( ebSystemDto, eventDto.sucursalCode, eventDto.salePointCode, ebSalePointDto.modalityCode, now,ebCuisDto.cuis,true);
        
        if(eventDto.endAt.getTime() === this.parameterService.getDateInfinity().getTime())
            eventDto.endAt = now;

        const resp = await this.wsEventosSignificativos.registroEventoSignificativo(ebSystemDto, eventDto, ebCuisDto.cuis, ebCufdDto.cufd);

        if(resp["ns2:registroEventoSignificativoResponse"].RespuestaListaEventos.transaccion=="true")
        {
            eventDto.recepcionCode = resp["ns2:registroEventoSignificativoResponse"].RespuestaListaEventos.codigoRecepcionEventoSignificativo;
            eventDto.eventStatusId = Constants.EventStatusClose

            const tmp = await this.ebEventService.update(eventDto);

            return  { "statusCode": 201,
                  "statusDescription": "OK",
                  "message": "OK",
                  "event": tmp }
        }
        else
            return   { "statusCode": 409,
                    "statusDescription": "Conflict",
                    "message": "Conflict",
                    "mensajesList": resp["ns2:registroEventoSignificativoResponse"].RespuestaListaEventos.mensajesList }
        
            ;
        
    }

    async queryEventsSIN(dateEvent:Date, sucursalCode:number, salePointCode:number, nit:number):Promise<any>{
        const ebSystemDto =  await this.ebSystemService.findBySystemCodeAndNit(Parameters.codigoSistema, nit);

        const now = this.parameterService.getNow();

        const sbSucursalDto = await this.ebSucursalService.findBySucursalCode( sucursalCode, ebSystemDto.systemId,);
        const ebSalePointDto = await this.ebSalePointService.findBySalePointCode( salePointCode != null ? salePointCode : 0, sbSucursalDto.id );

        const ebCuisDto = await this.billingCodeService.getCuis( ebSystemDto, sucursalCode, salePointCode, ebSalePointDto.modalityCode, now,);
        const ebCufdDto = await this.billingCodeService.getCufd( ebSystemDto, sucursalCode, salePointCode, ebSalePointDto.modalityCode, now,ebCuisDto.cuis);

        const respEvents = await this.wsEventosSignificativos.consultaEventoSignificativo(dateEvent,ebSystemDto, sucursalCode, salePointCode, ebCuisDto.cuis , ebCufdDto.cufd);
        
        const events  =respEvents["ns2:consultaEventoSignificativoResponse"].RespuestaListaEventos
        if(!Array.isArray(events.listaCodigos))
            return  {
                "statusCode": 200,
                "statusDescription": "OK",
                "message": "OK",
                "events": [events.listaCodigos] };
        else
            return  {
                "statusCode": 200,
                "statusDescription": "OK",
                "message": "OK",
                "events":  events.listaCodigos };
        
    }

    async queryEvents(dateBegin:Date, dateEnd:Date, sucursalCode:number, salePointCode:number, nit:number):Promise<any> {
        const ebSystemDto =  await this.ebSystemService.findBySystemCodeAndNit(Parameters.codigoSistema, nit);
        const events = await this.ebEventService.findEvents(Parameters.codigoSistema, nit, sucursalCode, salePointCode, dateBegin, dateEnd);


        return {
            "statusCode": 200,
            "statusDescription": "OK",
            "message": "OK",
            "events" : events.map( item => {
                    return this.returnEvent(item);
                    })};
        
    }

    returnEvent(ebEventDto:EbEventDto) {
        return {
            "eventId": ebEventDto.eventId,
            "description": ebEventDto.description,
            "eventType": ebEventDto.eventType,
            "nit": ebEventDto.nit,
            "sucursalCode": ebEventDto.sucursalCode,
            "salePointCode": ebEventDto.salePointCode,
            "beginAt": ebEventDto.beginAt,
            "endAt": ebEventDto.endAt,
            "cufdEvent": ebEventDto.cufdEvent,
            "receptionCode": ebEventDto.recepcionCode,
            "cafc": ebEventDto.cafc,
            "eventStatusId": ebEventDto.eventStatusId,

            
        }
    }
}