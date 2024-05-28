import { Global, Module } from '@nestjs/common';
import { WsFacturacionCodigosService } from './wsFacturacionCodigos.service';
import { WsFacturacionSincronizacionService } from './wsFacturacionSincronizacion.service';
import { WsFacturacionCompraVentaService } from './wsFacturacionCompraVenta.service';
import { WsEventosSignificativos } from './wsEventosSignificativos.service';
import { FacturacionService } from './facturacion.service';
import { WsFacturacionElectronicaService } from './wsFacturacionElectronica.service';
import { WsFacturacionDocumentoAjusteService } from './wsFacturacionDocumentoAjusteService';
import { WsFacturacionOperacionesService } from './wsFacturacionOperaciones.service';
import { WsFacturacionServiciosBasicos } from './wsFacturacionServiciosBasicos.service';

@Global()
@Module({
  providers: [WsFacturacionCodigosService, WsFacturacionSincronizacionService,WsFacturacionCompraVentaService, 
    WsFacturacionElectronicaService, WsFacturacionDocumentoAjusteService, WsEventosSignificativos, FacturacionService, 
    WsFacturacionOperacionesService, WsFacturacionServiciosBasicos],
  exports: [WsFacturacionCodigosService, WsFacturacionSincronizacionService, WsFacturacionCompraVentaService, 
    WsFacturacionElectronicaService, WsFacturacionDocumentoAjusteService, WsEventosSignificativos, FacturacionService, 
    WsFacturacionOperacionesService, WsFacturacionServiciosBasicos],
})
export class WebServiceModule {}
