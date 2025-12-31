import { Injectable, UseInterceptors } from '@nestjs/common';
import { ParameterService } from 'src/common/parameter.service';
import { SoapRequestService } from 'src/common/soapRequest.service';
import { EbSystemDto } from 'src/model/dto/ebSystem.dto';
import { EbBillDto } from '../model/dto/ebBill.dto';
import { RecepcionFacturaResponse } from './dto/recepcionFactura.response';
import { LoggerInterceptor } from 'src/common/interceptor/logger.interceptor';
import { EbPackageBillDto } from 'src/model/dto/ebPackageBill.dto';
import { RecepcionPaqueteFacturaResponse } from './dto/recepcionPaqueteFactura.response';
import { ValidacionRecepcionPaqueteFacturaResponse } from './dto/validacionRecepcionPaqueteFactura.response';
import { AnulacionFacturaResponse } from './dto/anulacionFactura.response';
import { VerificacionEstadoFacturaResponse } from './dto/verificacionEstadoFactura.response';
import { Parameters } from 'src/common/tools/parameters';
import { WsFacturacionService } from './WsFacturacion.service';
import { ReversionAnulacionFacturaResponse } from './dto/reversionAnulacionFactura.response';

@Injectable()
export class WsFacturacionCompraVentaService implements WsFacturacionService {
  /*private URL_WS_FS =
    'https://pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionCompraVenta?wsdl';*/

  constructor(
    private soapRequestService: SoapRequestService,
    private parameterService: ParameterService,
  ) {
    this.init();
  }

  init(): void {}


  //@UseInterceptors(LoggerInterceptor)
  recepcionFactura(ebBillDto:EbBillDto, ebSystemDto: EbSystemDto, cuis:string, xmlBill:string, hash:string, urlService:string):Promise<RecepcionFacturaResponse>{
        let dateEmiite = ebBillDto.dateEmitte.toISOString();
        dateEmiite= dateEmiite.replace('Z', '');

        const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:siat="https://siat.impuestos.gob.bo/">
                    <soapenv:Header/>
                    <soapenv:Body>
                    <siat:recepcionFactura>
                        <SolicitudServicioRecepcionFactura>
                            <codigoAmbiente>${Parameters.ambiente}</codigoAmbiente>
                            <codigoDocumentoSector>${ebBillDto.sectorDocumentCode}</codigoDocumentoSector>
                            <codigoEmision>${ebBillDto.emitteType}</codigoEmision>
                            <codigoModalidad>${ebBillDto.modalityCode}</codigoModalidad>
                            ${ (ebBillDto.salePointCode!=null)? `<codigoPuntoVenta>${ebBillDto.salePointCode}</codigoPuntoVenta>` : '' }
                            <codigoSistema>${ebSystemDto.systemCode}</codigoSistema>
                            <codigoSucursal>${ebBillDto.sucursalCode}</codigoSucursal>
                            <cufd>${ebBillDto.cufd}</cufd>
                            <cuis>${cuis}</cuis>
                            <nit>${ebSystemDto.nit}</nit>
                            <tipoFacturaDocumento>${ebBillDto.documentTaxCode}</tipoFacturaDocumento>
                            <archivo>${xmlBill}</archivo>
                            <fechaEnvio>${dateEmiite}</fechaEnvio>
                            <hashArchivo>${hash}</hashArchivo>
                        </SolicitudServicioRecepcionFactura>
                    </siat:recepcionFactura>
                    </soapenv:Body>
                </soapenv:Envelope>`;
        return this.soapRequestService.callService<RecepcionFacturaResponse>(
          urlService,
            xml,
            ebSystemDto.token.token,
        );
    }

    recepcionPaqueteFactura(ebPackageBillDto:EbPackageBillDto, ebSystemDto: EbSystemDto, cuis:string, archive:string, hash:string, urlService:string):Promise<RecepcionPaqueteFacturaResponse>{
      let dateEmiite = this.parameterService.getNow().toISOString();
        dateEmiite= dateEmiite.replace('Z', '');

        const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:siat="https://siat.impuestos.gob.bo/">
                      <soapenv:Header/>
                      <soapenv:Body>
                        <siat:recepcionPaqueteFactura>
                            <SolicitudServicioRecepcionPaquete>
                              <codigoAmbiente>${Parameters.ambiente}</codigoAmbiente>
                              <codigoDocumentoSector>${ebPackageBillDto.sectorDocumentCode}</codigoDocumentoSector>
                              <codigoEmision>${ebPackageBillDto.emitteType}</codigoEmision>
                              <codigoModalidad>${ebPackageBillDto.modalityCode}</codigoModalidad>
                              ${ (ebPackageBillDto.salePointCode!=null)? `<codigoPuntoVenta>${ebPackageBillDto.salePointCode}</codigoPuntoVenta>` : '' }
                              <codigoSistema>${ebSystemDto.systemCode}</codigoSistema>
                              <codigoSucursal>${ebPackageBillDto.sucursalCode}</codigoSucursal>
                              <cufd>${ebPackageBillDto.cufd}</cufd>
                              <cuis>${cuis}</cuis>
                              <nit>${ebSystemDto.nit}</nit>
                              <tipoFacturaDocumento>${ebPackageBillDto.documentTaxCode}</tipoFacturaDocumento>
                              <archivo>${archive}</archivo>
                              <fechaEnvio>${ dateEmiite }</fechaEnvio>
                              <hashArchivo>${hash}</hashArchivo>
                              ${ (ebPackageBillDto.cafc!=null)? `<cafc>${ebPackageBillDto.cafc}</cafc>` : '' }
                              <cantidadFacturas>${ebPackageBillDto.bills.length}</cantidadFacturas>
                              <codigoEvento>${ebPackageBillDto.eventCode}</codigoEvento>
                            </SolicitudServicioRecepcionPaquete>
                        </siat:recepcionPaqueteFactura>
                      </soapenv:Body>
     </soapenv:Envelope>`;
        return this.soapRequestService.callService<RecepcionPaqueteFacturaResponse>(
          urlService,
            xml,
            ebSystemDto.token.token,
        );
    }
    validacionRecepcionPaqueteFactura(ebPackageBillDto:EbPackageBillDto,  ebSystemDto: EbSystemDto, cuis:string, urlService:string):Promise<ValidacionRecepcionPaqueteFacturaResponse>{
      let dateEmiite = this.parameterService.getNow().toISOString();
      dateEmiite= dateEmiite.replace('Z', '');

        const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:siat="https://siat.impuestos.gob.bo/">
                      <soapenv:Header/>
                      <soapenv:Body>
                        <siat:validacionRecepcionPaqueteFactura>
                            <SolicitudServicioValidacionRecepcionPaquete>
                              <codigoAmbiente>${Parameters.ambiente}</codigoAmbiente>
                              <codigoDocumentoSector>${ebPackageBillDto.sectorDocumentCode}</codigoDocumentoSector>
                              <codigoEmision>${ebPackageBillDto.emitteType}</codigoEmision>
                              <codigoModalidad>${ebPackageBillDto.modalityCode}</codigoModalidad>
                              ${ (ebPackageBillDto.salePointCode!=null)? `<codigoPuntoVenta>${ebPackageBillDto.salePointCode}</codigoPuntoVenta>` : '' }
                              <codigoSistema>${ebSystemDto.systemCode}</codigoSistema>
                              <codigoSucursal>${ebPackageBillDto.sucursalCode}</codigoSucursal>
                              <cufd>${ebPackageBillDto.cufd}</cufd>
                              <cuis>${cuis}</cuis>
                              <nit>${ebSystemDto.nit}</nit>
                              <tipoFacturaDocumento>${ebPackageBillDto.documentTaxCode}</tipoFacturaDocumento>
                              <codigoRecepcion>${ebPackageBillDto.receptionCode}</codigoRecepcion>
                            </SolicitudServicioValidacionRecepcionPaquete>
                        </siat:validacionRecepcionPaqueteFactura>
                      </soapenv:Body>
                  </soapenv:Envelope>`;
        return this.soapRequestService.callService<ValidacionRecepcionPaqueteFacturaResponse>(
          urlService,
            xml,
            ebSystemDto.token.token,
        );
    }
    anulacionFactura(ebBillDto:EbBillDto, ebSystemDto: EbSystemDto, cuis:string, cufd:string, urlService:string ):Promise<AnulacionFacturaResponse> {
        const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:siat="https://siat.impuestos.gob.bo/">
                      <soapenv:Header/>
                      <soapenv:Body>
                        <siat:anulacionFactura>
                            <SolicitudServicioAnulacionFactura>
                              <codigoAmbiente>${Parameters.ambiente}</codigoAmbiente>
                              <codigoDocumentoSector>${ebBillDto.sectorDocumentCode}</codigoDocumentoSector>
                              <codigoEmision>1</codigoEmision>
                              <codigoModalidad>${ebBillDto.modalityCode}</codigoModalidad>
                              ${ (ebBillDto.salePointCode!=null)? `<codigoPuntoVenta>${ebBillDto.salePointCode}</codigoPuntoVenta>` : '' }
                              <codigoSistema>${ebSystemDto.systemCode}</codigoSistema>
                              <codigoSucursal>${ebBillDto.sucursalCode}</codigoSucursal>
                              <cufd>${cufd}</cufd>
                              <cuis>${cuis}</cuis>
                              <nit>${ebSystemDto.nit}</nit>
                              <tipoFacturaDocumento>${ebBillDto.documentTaxCode}</tipoFacturaDocumento>
                              <codigoMotivo>${ebBillDto.voidMotive}</codigoMotivo>
                              <cuf>${ebBillDto.cuf}</cuf>
                            </SolicitudServicioAnulacionFactura>
                        </siat:anulacionFactura>
                      </soapenv:Body>
                  </soapenv:Envelope>`;
        return this.soapRequestService.callService<AnulacionFacturaResponse>(
          urlService,
            xml,
            ebSystemDto.token.token,
        );
    }

    verificacionEstadoFactura(ebBillDto:EbBillDto, ebSystemDto: EbSystemDto, cuis:string, cufd:string, urlService:string ): Promise<VerificacionEstadoFacturaResponse>{      

        const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:siat="https://siat.impuestos.gob.bo/">
                        <soapenv:Header/>
                        <soapenv:Body>
                          <siat:verificacionEstadoFactura>
                              <SolicitudServicioVerificacionEstadoFactura>
                                <codigoAmbiente>${Parameters.ambiente}</codigoAmbiente>
                                <codigoDocumentoSector>${ebBillDto.sectorDocumentCode}</codigoDocumentoSector>
                                <codigoEmision>1</codigoEmision>
                                <codigoModalidad>${ebBillDto.modalityCode}</codigoModalidad>
                                ${ (ebBillDto.salePointCode!=null)? `<codigoPuntoVenta>${ebBillDto.salePointCode}</codigoPuntoVenta>` : '' }
                                <codigoSistema>${ebSystemDto.systemCode}</codigoSistema>
                                <codigoSucursal>${ebBillDto.sucursalCode}</codigoSucursal>
                                <cufd>${cufd}</cufd>
                                <cuis>${cuis}</cuis>
                                <nit>${ebSystemDto.nit}</nit>
                                <tipoFacturaDocumento>${ebBillDto.documentTaxCode}</tipoFacturaDocumento>
                                <cuf>${ebBillDto.cuf}</cuf>
                              </SolicitudServicioVerificacionEstadoFactura>
                          </siat:verificacionEstadoFactura>
                        </soapenv:Body>
                    </soapenv:Envelope>`;
        return this.soapRequestService.callService<VerificacionEstadoFacturaResponse >(
          urlService,
            xml,
            ebSystemDto.token.token,
        );
    }

    recepcionMasivaFactura(ebPackageBillDto:EbPackageBillDto, ebSystemDto: EbSystemDto, cuis:string, archive:string, hash:string, urlService:string):Promise<RecepcionPaqueteFacturaResponse>{
      let dateEmiite = this.parameterService.getNow().toISOString();
        dateEmiite= dateEmiite.replace('Z', '');

        const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:siat="https://siat.impuestos.gob.bo/">
                        <soapenv:Header/>
                        <soapenv:Body>
                          <siat:recepcionMasivaFactura>
                              <SolicitudServicioRecepcionMasiva>
                              <codigoAmbiente>${Parameters.ambiente}</codigoAmbiente>
                              <codigoDocumentoSector>${ebPackageBillDto.sectorDocumentCode}</codigoDocumentoSector>
                              <codigoEmision>${ebPackageBillDto.emitteType}</codigoEmision>
                              <codigoModalidad>${ebPackageBillDto.modalityCode}</codigoModalidad>
                              ${ (ebPackageBillDto.salePointCode!=null)? `<codigoPuntoVenta>${ebPackageBillDto.salePointCode}</codigoPuntoVenta>` : '' }
                              <codigoSistema>${ebSystemDto.systemCode}</codigoSistema>
                              <codigoSucursal>${ebPackageBillDto.sucursalCode}</codigoSucursal>
                              <cufd>${ebPackageBillDto.cufd}</cufd>
                              <cuis>${cuis}</cuis>
                              <nit>${ebSystemDto.nit}</nit>
                              <tipoFacturaDocumento>${ebPackageBillDto.documentTaxCode}</tipoFacturaDocumento>
                              <archivo>${archive}</archivo>
                              <fechaEnvio>${ dateEmiite }</fechaEnvio>
                              <hashArchivo>${hash}</hashArchivo>
                              <cantidadFacturas>${ebPackageBillDto.bills.length}</cantidadFacturas>                              
                              </SolicitudServicioRecepcionMasiva>
                          </siat:recepcionMasivaFactura>
                        </soapenv:Body>
                    </soapenv:Envelope>`;
        return this.soapRequestService.callService<RecepcionPaqueteFacturaResponse>(
          urlService,
            xml,
            ebSystemDto.token.token,
        );
    }

    validacionRecepcionMasivaFactura(ebPackageBillDto:EbPackageBillDto,  ebSystemDto: EbSystemDto, cuis:string, urlService:string):Promise<ValidacionRecepcionPaqueteFacturaResponse>{
      

        const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:siat="https://siat.impuestos.gob.bo/">
                      <soapenv:Header/>
                      <soapenv:Body>
                        <siat:validacionRecepcionMasivaFactura>
                            <SolicitudServicioValidacionRecepcionMasiva>
                              <codigoAmbiente>${Parameters.ambiente}</codigoAmbiente>
                              <codigoDocumentoSector>${ebPackageBillDto.sectorDocumentCode}</codigoDocumentoSector>
                              <codigoEmision>${ebPackageBillDto.emitteType}</codigoEmision>
                              <codigoModalidad>${ebPackageBillDto.modalityCode}</codigoModalidad>
                              ${ (ebPackageBillDto.salePointCode!=null)? `<codigoPuntoVenta>${ebPackageBillDto.salePointCode}</codigoPuntoVenta>` : '' }
                              <codigoSistema>${ebSystemDto.systemCode}</codigoSistema>
                              <codigoSucursal>${ebPackageBillDto.sucursalCode}</codigoSucursal>
                              <cufd>${ebPackageBillDto.cufd}</cufd>
                              <cuis>${cuis}</cuis>
                              <nit>${ebSystemDto.nit}</nit>
                              <tipoFacturaDocumento>${ebPackageBillDto.documentTaxCode}</tipoFacturaDocumento>
                              <codigoRecepcion>${ebPackageBillDto.receptionCode}</codigoRecepcion>
                            </SolicitudServicioValidacionRecepcionMasiva>
                        </siat:validacionRecepcionMasivaFactura>
                      </soapenv:Body>
                  </soapenv:Envelope>`;
        return this.soapRequestService.callService<ValidacionRecepcionPaqueteFacturaResponse>(
          urlService,
            xml,
            ebSystemDto.token.token,
        );
    }

    verificarComunicacion(ebSystemDto: EbSystemDto, urlService:string){
    
        const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:siat="https://siat.impuestos.gob.bo/">
                      <soapenv:Header/>
                      <soapenv:Body>
                        <siat:verificarComunicacion/>
                      </soapenv:Body>
                  </soapenv:Envelope>`;
        return this.soapRequestService.callService<RecepcionFacturaResponse>(
          urlService,
            xml,
            ebSystemDto.token.token,
        );
    }

    recepcionAnexos(ebBillDto:EbBillDto, ebSystemDto: EbSystemDto, cuis:string, xmlBill:string, hash:string, urlService:string){
      let dateEmiite = ebBillDto.dateEmitte.toISOString();
        dateEmiite= dateEmiite.replace('Z', '');

        const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:siat="https://siat.impuestos.gob.bo/">
                      <soapenv:Header/>
                      <soapenv:Body>
                        <siat:recepcionAnexos>
                            <SolicitudRecepcionAnexos>
                              <codigoAmbiente>${Parameters.ambiente}</codigoAmbiente>
                              <codigoDocumentoSector>${ebBillDto.sectorDocumentCode}</codigoDocumentoSector>
                              <codigoEmision>${ebBillDto.emitteType}</codigoEmision>
                              <codigoModalidad>${ebBillDto.modalityCode}</codigoModalidad>
                              ${ (ebBillDto.salePointCode!=null)? `<codigoPuntoVenta>${ebBillDto.salePointCode}</codigoPuntoVenta>` : '' }
                              <codigoSistema>${ebSystemDto.systemCode}</codigoSistema>
                              <codigoSucursal>${ebBillDto.sucursalCode}</codigoSucursal>
                              <cufd>${ebBillDto.cufd}</cufd>
                              <cuis>${cuis}</cuis>
                              <nit>${ebSystemDto.nit}</nit>
                              <tipoFacturaDocumento>${ebBillDto.documentTaxCode}</tipoFacturaDocumento>
                              ${ebBillDto.details.map((item) => {
                                return `<anexosList>
                                            <codigo>?</codigo>
                                            <codigoProducto>?</codigoProducto>
                                            <codigoProductoSin>?</codigoProductoSin>
                                            <tipoCodigo>?</tipoCodigo>
                                        </anexosList>`;}).join(`
                                          `)}   
                              <cuf>${ebBillDto.cuf}</cuf>
                            </SolicitudRecepcionAnexos>
                        </siat:recepcionAnexos>
                      </soapenv:Body>
                  </soapenv:Envelope>`;
        return this.soapRequestService.callService<RecepcionFacturaResponse>(
          urlService,
            xml,
            ebSystemDto.token.token,
        );
    }

    reversionAnulacionFactura(ebBillDto:EbBillDto,ebSystemDto: EbSystemDto,cufd:string, cuis:string, urlService:string): Promise<ReversionAnulacionFacturaResponse> {
      const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:siat="https://siat.impuestos.gob.bo/">
                    <soapenv:Header/>
                    <soapenv:Body>
                      <siat:reversionAnulacionFactura>
                          <SolicitudServicioReversionAnulacionFactura>
                            <codigoAmbiente>${Parameters.ambiente}</codigoAmbiente>
                            <codigoDocumentoSector>${ebBillDto.sectorDocumentCode}</codigoDocumentoSector>
                            <codigoEmision>1</codigoEmision>
                            <codigoModalidad>${ebBillDto.modalityCode}</codigoModalidad>
                            ${ (ebBillDto.salePointCode!=null)? `<codigoPuntoVenta>${ebBillDto.salePointCode}</codigoPuntoVenta>` : '' }
                            <codigoSistema>${ebSystemDto.systemCode}</codigoSistema>
                            <codigoSucursal>${ebBillDto.sucursalCode}</codigoSucursal>
                            <cufd>${cufd}</cufd>
                            <cuis>${cuis}</cuis>
                            <nit>${ebSystemDto.nit}</nit>
                            <tipoFacturaDocumento>${ebBillDto.documentTaxCode}</tipoFacturaDocumento>
                            <cuf>${ebBillDto.cuf}</cuf>
                          </SolicitudServicioReversionAnulacionFactura>
                      </siat:reversionAnulacionFactura>
                    </soapenv:Body>
                </soapenv:Envelope>`;
        return this.soapRequestService.callService<ReversionAnulacionFacturaResponse>(
        urlService,
        xml,
        ebSystemDto.token.token,
        );   
    }

    recepcionAnexosSuministroEnergia(ebBillDto:EbBillDto, ebSystemDto: EbSystemDto, cuis:string, xmlBill:string, hash:string, urlService:string){}
}