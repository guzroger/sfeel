import { Injectable, UseInterceptors } from '@nestjs/common';
import { ParameterService } from 'src/common/parameter.service';
import { SoapRequestService } from 'src/common/soapRequest.service';
import { EbSystemDto } from 'src/model/dto/ebSystem.dto';
import { EbBillDto } from '../model/dto/ebBill.dto';
import { RecepcionFacturaResponse } from './dto/recepcionFactura.response';
import { LoggerInterceptor } from 'src/common/logger.interceptor';
import { EbPackageBillDto } from 'src/model/dto/ebPackageBill.dto';
import { RecepcionPaqueteFacturaResponse } from './dto/recepcionPaqueteFactura.response';
import { ValidacionRecepcionPaqueteFacturaResponse } from './dto/validacionRecepcionPaqueteFactura.response';
import { AnulacionFacturaResponse } from './dto/anulacionFactura.response';
import { VerificacionEstadoFacturaResponse } from './dto/verificacionEstadoFactura.response';
import { Parameters } from 'src/common/parameters';
import { WsFacturacionService } from './WsFacturacion.service';
import { ReversionAnulacionFacturaResponse } from './dto/reversionAnulacionFactura.response';

@Injectable()
export class WsFacturacionDocumentoAjusteService implements WsFacturacionService {
  /*private URL_WS_FS =
    'https://pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionDocumentoAjuste?wsdl';*/

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
                    <siat:recepcionDocumentoAjuste>
                        <SolicitudServicioRecepcionDocumentoAjuste>
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
                        </SolicitudServicioRecepcionDocumentoAjuste>
                    </siat:recepcionDocumentoAjuste>
                    </soapenv:Body>
                </soapenv:Envelope>`;
        return this.soapRequestService.callService<RecepcionFacturaResponse>(
          urlService,
            xml,
            ebSystemDto.token.token,
        );
    }

    recepcionPaqueteFactura(ebPackageBillDto:EbPackageBillDto, ebSystemDto: EbSystemDto, cuis:string, archive:string, hash:string, urlService:string):Promise<RecepcionPaqueteFacturaResponse>{
      return null;
    }
    validacionRecepcionPaqueteFactura(ebPackageBillDto:EbPackageBillDto,  ebSystemDto: EbSystemDto, cuis:string, urlService:string):Promise<ValidacionRecepcionPaqueteFacturaResponse>{
      return null;
    }
    anulacionFactura(ebBillDto:EbBillDto, ebSystemDto: EbSystemDto, cuis:string, cufd:string, urlService:string ):Promise<AnulacionFacturaResponse> {
        const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:siat="https://siat.impuestos.gob.bo/">
                      <soapenv:Header/>
                      <soapenv:Body>
                        <siat:anulacionDocumentoAjuste>
                            <SolicitudServicioAnulacionDocumentoAjuste>
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
                              <codigoMotivo>${ebBillDto.modalityCode}</codigoMotivo>
                              <cuf>${ebBillDto.cuf}</cuf>
                          </SolicitudServicioAnulacionDocumentoAjuste>
                        </siat:anulacionDocumentoAjuste>
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
                          <siat:verificacionEstadoDocumentoAjuste>
                              <SolicitudServicioVerificacionEstadoDocumentoAjuste>
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
                              </SolicitudServicioVerificacionEstadoDocumentoAjuste>
                          </siat:verificacionEstadoDocumentoAjuste>
                        </soapenv:Body>
                    </soapenv:Envelope>`;
        return this.soapRequestService.callService<VerificacionEstadoFacturaResponse >(
          urlService,
            xml,
            ebSystemDto.token.token,
        );
    }

    recepcionMasivaFactura(ebPackageBillDto:EbPackageBillDto, ebSystemDto: EbSystemDto, cuis:string, archive:string, hash:string, urlService:string):Promise<RecepcionPaqueteFacturaResponse>{
      return null;
    }

    validacionRecepcionMasivaFactura(ebPackageBillDto:EbPackageBillDto,  ebSystemDto: EbSystemDto, cuis:string, urlService:string):Promise<ValidacionRecepcionPaqueteFacturaResponse>{
      return null;
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
      return null;
    }

    reversionAnulacionFactura(ebBillDto:EbBillDto,ebSystemDto: EbSystemDto,cufd:string, cuis:string, urlService:string):Promise<ReversionAnulacionFacturaResponse>  {
      const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:siat="https://siat.impuestos.gob.bo/">
                    <soapenv:Header/>
                    <soapenv:Body>
                      <siat:reversionAnulacionDocumentoAjuste>
                          <SolicitudServicioReversionAnulacionDocumentoAjuste>
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
                          </SolicitudServicioReversionAnulacionDocumentoAjuste>
                      </siat:reversionAnulacionDocumentoAjuste>
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