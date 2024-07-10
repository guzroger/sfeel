import { HttpStatus, Injectable } from "@nestjs/common";
import { HealthService } from "src/common/health.service";
import { EbSalePointDto } from "src/model/dto/ebSalePoint.dto";
import { EbSystemDto } from "src/model/dto/ebSystem.dto";
import { EbEventService } from "src/model/ebEvent.service";
import { EbSalePointService } from "src/model/ebSalePoint.service";
import { EbSucursalService } from "src/model/ebSucursal.service";

import { ParameterService } from '../common/parameter.service';
import { ContingencyService } from '../contingency/contingency.service';
import { EbSucursalDto } from "src/model/dto/ebSucursal.dto";
import { CreatePointSaleDto } from './dto/createPointSale.dto';
import { WsFacturacionOperacionesService } from '../webservice/wsFacturacionOperaciones.service';
import { Parameters } from '../common/tools/parameters';
import { PackageBillingService } from "src/package-billing/packageBilling.service";
import { BillingCodeService } from "src/common/billingCode.service";
import { Constants } from "src/common/enum/constants.enum";

@Injectable()
export class ManagerService {
    constructor(private ebSucursalService:EbSucursalService, 
        private ebSalePointService:EbSalePointService,
        private healthService:HealthService,
        private ebEventService:EbEventService,
        private packageBillingService:PackageBillingService,
        private parameterService:ParameterService,
        private contingencyService:ContingencyService,
        private wsFacturacionOperacionesService:WsFacturacionOperacionesService,
        private billingCodeService: BillingCodeService
         ){}

    async ping(ebSystemDto:EbSystemDto){
        const status = await this.healthService.isConnectionOnLine();
        if(status){
            const listSucursales = await this.ebSucursalService.findSucursales(ebSystemDto.systemId);

            listSucursales.map(async ebSucursalDto => {
                let listSalePoints = await this.ebSalePointService.findSalePoints(ebSucursalDto.id);
                
                if(!listSalePoints || listSalePoints.length==0)
                {
                    const salePoint = new EbSalePointDto();
                    salePoint.salePointCode = 0;

                    listSalePoints = Array(salePoint);
                }
                else{
                    const salePoint = new EbSalePointDto();
                    salePoint.salePointCode = 0;

                    listSalePoints.push(salePoint);
                }
                
                await Promise.all(listSalePoints.map(async ebSalePointDto => {
                    let closedEvent = false;
                    const  events= await this.ebEventService.findEventsOpen(ebSystemDto.systemCode, ebSystemDto.nit, ebSucursalDto.sucursalCode, ebSalePointDto.salePointCode);                
                    for(const ebEventDto of events){
                        const respCloseEvent = await this.contingencyService.closeEvent(ebEventDto.eventId, ebEventDto.nit);
                        if(respCloseEvent.eventId)
                            closedEvent=true;                        
                    }
                    if(closedEvent)
                    {
                        const resp = await this.packageBillingService.sendPackageCompleteCycle(ebSystemDto, ebSalePointDto.sucursalCode, ebSalePointDto.salePointCode, 
                            Constants.EmitterTypeContingency, null);
                    }
                    
                }));
            });

            return { "statusCode": 200,
                  "statusDescription": "OK" };
        }
        else
                return { "statusCode": 502,
                  "statusDescription": "SIN CONEXION" };
        
    }

    async reloadConfig(){
        await this.parameterService.init();
        return {
            "statusCode": HttpStatus.OK,
            "statusDescription": "OK"
        }
    }

    async showConfig(){
        return {
            "ambiente": Parameters.ambiente,
            "codigoSistema": Parameters.codigoSistema,
            "urlQr": Parameters.urlQr,
            "noteOnLine": Parameters.noteOnLine,
            "noteOffLine": Parameters.noteOffLine,
            "urlPingSin": Parameters.urlPingSin,
            "urlPingInternet": Parameters.urlPingInternet,

        }
    }
    async pointSales(sucursalCode:number, ebSystemDto:EbSystemDto): Promise<EbSalePointDto[]> {
        const sbSucursalDto = await this.ebSucursalService.findBySucursalCode( sucursalCode, ebSystemDto.systemId,);
        return this.ebSalePointService.findSalePoints(sbSucursalDto.id);
    }
    async pointSale(sucursalCode:number, salePointCode:number,  ebSystemDto:EbSystemDto): Promise<EbSalePointDto> {
        const sbSucursalDto = await this.ebSucursalService.findBySucursalCode( sucursalCode, ebSystemDto.systemId,);

        return this.ebSalePointService.findBySalePointCode(salePointCode,sbSucursalDto.id )

        
    }

    async sucursales( ebSystemDto:EbSystemDto): Promise<EbSucursalDto[]> {
        return await this.ebSucursalService.findSucursales(ebSystemDto.systemId,);

    }
    async sucursal(sucursalCode:number, ebSystemDto:EbSystemDto): Promise<EbSucursalDto> {
        return this.ebSucursalService.findBySucursalCode( sucursalCode, ebSystemDto.systemId,);
        
    }

    async createPointSale(createPointSaleDto:CreatePointSaleDto, sucursalCode:number, ebSystemDto:EbSystemDto ){
        const sbSucursalDto = await this.ebSucursalService.findBySucursalCode(Number(sucursalCode), ebSystemDto.systemId,);
        const ebSalePointDto = new EbSalePointDto();
        
        ebSalePointDto.typeSalePoint = createPointSaleDto.typeSalePoint;

        if(createPointSaleDto.modalityCode)
            ebSalePointDto.modalityCode = createPointSaleDto.modalityCode;
        else
            ebSalePointDto.modalityCode = ebSystemDto.modalityCode;

        ebSalePointDto.description = createPointSaleDto.description;
        ebSalePointDto.sucursalId =sbSucursalDto.id;
        ebSalePointDto.sucursalCode = sucursalCode;

        const ebCuisDto = await this.billingCodeService.getCuis( ebSystemDto, Number(sucursalCode), 0, ebSystemDto.modalityCode, this.parameterService.getNow());        
        const resp = await this.wsFacturacionOperacionesService.registroPuntoVenta(ebSystemDto, ebSalePointDto, ebCuisDto.cuis);
        
        if(resp["ns2:registroPuntoVentaResponse"].RespuestaRegistroPuntoVenta.transaccion=="true")
        {
            ebSalePointDto.salePointCode = Number(resp["ns2:registroPuntoVentaResponse"].RespuestaRegistroPuntoVenta.codigoPuntoVenta);
            const eb = await this.ebSalePointService.create(ebSalePointDto);
            return eb;
        }
        else
            return {
                "mensajesList": resp["ns2:registroPuntoVentaResponse"].RespuestaRegistroPuntoVenta.mensajesList
            };       

    }

    async pointSalesSin(sucursalCode:number, ebSystemDto:EbSystemDto): Promise<any> {

        const ebCuisDto = await this.billingCodeService.getCuis( ebSystemDto, Number(sucursalCode), 0, ebSystemDto.modalityCode, this.parameterService.getNow());        
        const resp = await this.wsFacturacionOperacionesService.consultaPuntoVenta(ebSystemDto, sucursalCode, ebCuisDto.cuis);

        return resp["ns2:consultaPuntoVentaResponse"].RespuestaConsultaPuntoVenta.listaPuntosVentas;


    }
}