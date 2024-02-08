import { Injectable } from '@nestjs/common';
import { SoapRequestService } from '../common/soapRequest.service';
import { ParameterService } from '../common/parameter.service';
import { PrismaService } from '../prisma/prisma.service';
import { EbSystemDto } from 'src/model/dto/ebSystem.dto';
import { SincronizarFehaHoraResponse } from './dto/sincronizarFechaHora.response';
import { SincronizarActividadesResponse } from './dto/sincronizarActividades.response';
import { SincronizarListaActividadesDocumentoSectorResponse } from './dto/sincronizarListaActividadesDocumentoSector.response';
import { SincronizarListaLeyendasFacturaResponse } from './dto/sincronizarListaLeyendasFactura.response';
import { SincronizarListaProductosServiciosResponse } from './dto/sincronizarListaProductosServicios.response';
import { RespuestaListaParametricas } from './dto/respuestaListaParametricas.response';
import { Parameters } from 'src/common/parameters';

@Injectable()
export class WsFacturacionSincronizacionService {
  private URL_WS_FS =
    'https://pilotosiatservicios.impuestos.gob.bo/v2/FacturacionSincronizacion?wsdl';

  constructor(
    private soapRequestService: SoapRequestService,
    private parameterService: ParameterService,
    private prismaService: PrismaService,
  ) {
    this.init();
  }

  init(): void {
    this.prismaService.geConstant
      .findUnique({
        where: {
          code_codeGroup: {
            code: 'SINCRONIZACION_CATALOGOS',
            codeGroup: 'WS_URL',
          },
        },
      })
      .then((data) => {
        if (data != null) {
          console.log(data.value);
          this.URL_WS_FS = data.value;
        }
      });
  }

  async sincronizarFechaHora(
    ebSystemDto: EbSystemDto,
    codigoSucursal: number,
    cuis: string, salePointCode:number=null
  ): Promise<SincronizarFehaHoraResponse> {
    const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:siat="https://siat.impuestos.gob.bo/">
                <soapenv:Header/>
                <soapenv:Body>
                <siat:sincronizarFechaHora>
                    <SolicitudSincronizacion>
                        <codigoAmbiente>${Parameters.ambiente}</codigoAmbiente>
                        <codigoSistema>${ebSystemDto.systemCode}</codigoSistema>
                        <codigoSucursal>${codigoSucursal}</codigoSucursal>
                        <cuis>${cuis}</cuis>
                        <nit>${ebSystemDto.nit}</nit>
                        ${ (salePointCode!=null)? `<codigoPuntoVenta>${salePointCode}</codigoPuntoVenta>` : '' }
                    </SolicitudSincronizacion>
                </siat:sincronizarFechaHora>
                </soapenv:Body>
            </soapenv:Envelope>`;

    return this.soapRequestService.callService(
      this.URL_WS_FS,
      xml,
      ebSystemDto.token.token,
    );
  }

  async sincronizarActividades(
    ebSystemDto: EbSystemDto,
    codigoSucursal: number,
    cuis: string,salePointCode:number=null
  ): Promise<SincronizarActividadesResponse> {
    const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:siat="https://siat.impuestos.gob.bo/">
                  <soapenv:Header/>
                  <soapenv:Body>
                    <siat:sincronizarActividades>
                        <SolicitudSincronizacion>
                          <codigoAmbiente>${Parameters.ambiente}</codigoAmbiente>
                          <codigoSistema>${ebSystemDto.systemCode}</codigoSistema>
                          <codigoSucursal>${codigoSucursal}</codigoSucursal>
                          <cuis>${cuis}</cuis>
                          <nit>${ebSystemDto.nit}</nit>
                          ${ (salePointCode!=null)? `<codigoPuntoVenta>${salePointCode}</codigoPuntoVenta>` : '' }
                        </SolicitudSincronizacion>
                    </siat:sincronizarActividades>
                  </soapenv:Body>
              </soapenv:Envelope>`;

    return this.soapRequestService.callService(
      this.URL_WS_FS,
      xml,
      ebSystemDto.token.token,
    );
  }

  async sincronizarListaActividadesDocumentoSector(
    ebSystemDto: EbSystemDto,
    codigoSucursal: number,
    cuis: string, salePointCode:number=null
  ): Promise<SincronizarListaActividadesDocumentoSectorResponse> {
    const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:siat="https://siat.impuestos.gob.bo/">
                  <soapenv:Header/>
                  <soapenv:Body>
                    <siat:sincronizarListaActividadesDocumentoSector>
                        <SolicitudSincronizacion>
                          <codigoAmbiente>${Parameters.ambiente}</codigoAmbiente>                       
                          <codigoSistema>${ebSystemDto.systemCode}</codigoSistema>
                          <codigoSucursal>${codigoSucursal}</codigoSucursal>
                          <cuis>${cuis}</cuis>
                          <nit>${ebSystemDto.nit}</nit>
                          ${ (salePointCode!=null)? `<codigoPuntoVenta>${salePointCode}</codigoPuntoVenta>` : '' }
                        </SolicitudSincronizacion>
                    </siat:sincronizarListaActividadesDocumentoSector>
                  </soapenv:Body>
              </soapenv:Envelope>`;

    return this.soapRequestService.callService(
      this.URL_WS_FS,
      xml,
      ebSystemDto.token.token,
    );
  }

  async sincronizarListaLeyendasFactura(
    ebSystemDto: EbSystemDto,
    codigoSucursal: number,
    cuis: string, salePointCode:number=null
  ): Promise<SincronizarListaLeyendasFacturaResponse> {
    const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:siat="https://siat.impuestos.gob.bo/">
                  <soapenv:Header/>
                  <soapenv:Body>
                    <siat:sincronizarListaLeyendasFactura>
                        <SolicitudSincronizacion>
                          <codigoAmbiente>${Parameters.ambiente}</codigoAmbiente>                       
                          <codigoSistema>${ebSystemDto.systemCode}</codigoSistema>
                          <codigoSucursal>${codigoSucursal}</codigoSucursal>
                          <cuis>${cuis}</cuis>
                          <nit>${ebSystemDto.nit}</nit>
                          ${ (salePointCode!=null)? `<codigoPuntoVenta>${salePointCode}</codigoPuntoVenta>` : '' }
                        </SolicitudSincronizacion>
                    </siat:sincronizarListaLeyendasFactura>
                  </soapenv:Body>
              </soapenv:Envelope>`;

    return this.soapRequestService.callService(
      this.URL_WS_FS,
      xml,
      ebSystemDto.token.token,
    );
  }

  async sincronizarListaProductosServicios(
    ebSystemDto: EbSystemDto,
    codigoSucursal: number,
    cuis: string, salePointCode:number=null
  ): Promise<SincronizarListaProductosServiciosResponse> {
    const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:siat="https://siat.impuestos.gob.bo/">
                  <soapenv:Header/>
                  <soapenv:Body>
                    <siat:sincronizarListaProductosServicios>
                        <SolicitudSincronizacion>
                          <codigoAmbiente>${Parameters.ambiente}</codigoAmbiente>                       
                          <codigoSistema>${ebSystemDto.systemCode}</codigoSistema>
                          <codigoSucursal>${codigoSucursal}</codigoSucursal>
                          <cuis>${cuis}</cuis>
                          <nit>${ebSystemDto.nit}</nit>
                          ${ (salePointCode!=null)? `<codigoPuntoVenta>${salePointCode}</codigoPuntoVenta>` : '' }
                        </SolicitudSincronizacion>
                    </siat:sincronizarListaProductosServicios>
                  </soapenv:Body>
              </soapenv:Envelope>`;

    return this.soapRequestService.callService(
      this.URL_WS_FS,
      xml,
      ebSystemDto.token.token,
    );
  }

  async sincronizarParametrica(
    ebSystemDto: EbSystemDto,
    codigoSucursal: number,
    cuis: string,
    service: string, salePointCode:number=null
  ): Promise<RespuestaListaParametricas> {
    const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:siat="https://siat.impuestos.gob.bo/">
                      <soapenv:Header/>
                      <soapenv:Body>
                        <siat:${service}>
                            <SolicitudSincronizacion>
                              <codigoAmbiente>${Parameters.ambiente}</codigoAmbiente>                       
                              <codigoSistema>${ebSystemDto.systemCode}</codigoSistema>
                              <codigoSucursal>${codigoSucursal}</codigoSucursal>
                              <cuis>${cuis}</cuis>
                              <nit>${ebSystemDto.nit}</nit>
                              ${ (salePointCode!=null)? `<codigoPuntoVenta>${salePointCode}</codigoPuntoVenta>` : '' }
                            </SolicitudSincronizacion>
                        </siat:${service}>
                      </soapenv:Body>
                  </soapenv:Envelope>`;

    const response = await this.soapRequestService.callService(
      this.URL_WS_FS,
      xml,
      ebSystemDto.token.token,
    );

    return response['ns2:' + service + 'Response'].RespuestaListaParametricas;
  }

  async sincronizarParametricaEventosSignificativos(
    ebSystemDto: EbSystemDto,
    codigoSucursal: number,
    cuis: string,
  ): Promise<RespuestaListaParametricas> {
    return this.sincronizarParametrica(
      ebSystemDto,
      codigoSucursal,
      cuis,
      'sincronizarParametricaEventosSignificativos',
    );
  }

  async sincronizarListaMensajesServicios(
    ebSystemDto: EbSystemDto,
    codigoSucursal: number,
    cuis: string,
  ): Promise<RespuestaListaParametricas> {
    return this.sincronizarParametrica(
      ebSystemDto,
      codigoSucursal,
      cuis,
      'sincronizarListaMensajesServicios',
    );
  }

  async sincronizarParametricaMotivoAnulacion(
    ebSystemDto: EbSystemDto,
    codigoSucursal: number,
    cuis: string,
  ): Promise<RespuestaListaParametricas> {
    return this.sincronizarParametrica(
      ebSystemDto,
      codigoSucursal,
      cuis,
      'sincronizarParametricaMotivoAnulacion',
    );
  }

  async sincronizarParametricaPaisOrigen(
    ebSystemDto: EbSystemDto,
    codigoSucursal: number,
    cuis: string,
  ): Promise<RespuestaListaParametricas> {
    return this.sincronizarParametrica(
      ebSystemDto,
      codigoSucursal,
      cuis,
      'sincronizarParametricaPaisOrigen',
    );
  }

  async sincronizarParametricaTipoDocumentoIdentidad(
    ebSystemDto: EbSystemDto,
    codigoSucursal: number,
    cuis: string,
  ): Promise<RespuestaListaParametricas> {
    return this.sincronizarParametrica(
      ebSystemDto,
      codigoSucursal,
      cuis,
      'sincronizarParametricaTipoDocumentoIdentidad',
    );
  }

  async sincronizarParametricaTipoDocumentoSector(
    ebSystemDto: EbSystemDto,
    codigoSucursal: number,
    cuis: string,
  ): Promise<RespuestaListaParametricas> {
    return this.sincronizarParametrica(
      ebSystemDto,
      codigoSucursal,
      cuis,
      'sincronizarParametricaTipoDocumentoSector',
    );
  }

  async sincronizarParametricaTipoHabitacion(
    ebSystemDto: EbSystemDto,
    codigoSucursal: number,
    cuis: string,
  ): Promise<RespuestaListaParametricas> {
    return this.sincronizarParametrica(
      ebSystemDto,
      codigoSucursal,
      cuis,
      'sincronizarParametricaTipoHabitacion',
    );
  }

  async sincronizarParametricaTipoMetodoPago(
    ebSystemDto: EbSystemDto,
    codigoSucursal: number,
    cuis: string,
  ): Promise<RespuestaListaParametricas> {
    return this.sincronizarParametrica(
      ebSystemDto,
      codigoSucursal,
      cuis,
      'sincronizarParametricaTipoMetodoPago',
    );
  }
  async sincronizarParametricaTipoMoneda(
    ebSystemDto: EbSystemDto,
    codigoSucursal: number,
    cuis: string,
  ): Promise<RespuestaListaParametricas> {
    return this.sincronizarParametrica(
      ebSystemDto,
      codigoSucursal,
      cuis,
      'sincronizarParametricaTipoMoneda',
    );
  }

  async sincronizarParametricaTipoPuntoVenta(
    ebSystemDto: EbSystemDto,
    codigoSucursal: number,
    cuis: string,
  ): Promise<RespuestaListaParametricas> {
    return this.sincronizarParametrica(
      ebSystemDto,
      codigoSucursal,
      cuis,
      'sincronizarParametricaTipoPuntoVenta',
    );
  }

  async sincronizarParametricaTiposFactura(
    ebSystemDto: EbSystemDto,
    codigoSucursal: number,
    cuis: string,
  ): Promise<RespuestaListaParametricas> {
    return this.sincronizarParametrica(
      ebSystemDto,
      codigoSucursal,
      cuis,
      'sincronizarParametricaTiposFactura',
    );
  }

  async sincronizarParametricaUnidadMedida(
    ebSystemDto: EbSystemDto,
    codigoSucursal: number,
    cuis: string,
  ): Promise<RespuestaListaParametricas> {
    return this.sincronizarParametrica(
      ebSystemDto,
      codigoSucursal,
      cuis,
      'sincronizarParametricaUnidadMedida',
    );
  }
}
