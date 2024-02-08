import { Injectable } from "@nestjs/common";
import { WsFacturacionCompraVentaService } from './wsFacturacionCompraVenta.service';
import { WsFacturacionElectronicaService } from './wsFacturacionElectronica.service';
import { WsFacturacionService } from "./WsFacturacion.service";
import { WsFacturacionDocumentoAjusteService } from "./wsFacturacionDocumentoAjusteService";

@Injectable()
export class FacturacionService {
    constructor(private wsFacturacionCompraVentaService:WsFacturacionCompraVentaService, 
                private wsFacturacionElectronicaService:WsFacturacionElectronicaService,
                private wsFacturacionDocumentoAjusteService:WsFacturacionDocumentoAjusteService){}

    getService(serviceName:string):WsFacturacionService {
        return this[serviceName];
    }
}