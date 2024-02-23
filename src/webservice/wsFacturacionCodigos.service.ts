import { ParameterService } from 'src/common/parameter.service';
import { SoapRequestService } from 'src/common/soapRequest.service';
import { PrismaService } from '../prisma/prisma.service';
import { VerificarComunicacionResponse } from './dto/verificarConexion.response';
import { CuisResponse } from './dto/cuis.response';
import { CufdResponse } from './dto/cufd.response';
import { EbSystemDto } from '../model/dto/ebSystem.dto';
import { VerificarNitResponse } from './dto/verificarNit.response';
import { Injectable } from '@nestjs/common';
import { Parameters } from 'src/common/parameters';

@Injectable()
export class WsFacturacionCodigosService {
  private URL_WS_FS =
    'https://pilotosiatservicios.impuestos.gob.bo/v2/FacturacionCodigos?wsdl';

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
          code_codeGroup: { code: 'SOLICITUD_CODIGOS', codeGroup: 'WS_URL' },
        },
      })
      .then((data) => {
        if (data != null) {
          console.log(data.value);
          this.URL_WS_FS = data.value;
        }
      });
  }

  async cuis(
    ebSystemDto: EbSystemDto,
    codigoSucursal: number,
    codigoPuntoVenta: number,
    codigoModalidad: number,
  ): Promise<CuisResponse> {
    const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:siat="https://siat.impuestos.gob.bo/">
            <soapenv:Header/>
            <soapenv:Body>
            <siat:cuis>
                <SolicitudCuis>
                    <codigoAmbiente>${Parameters.ambiente}</codigoAmbiente>
                    <codigoModalidad>${codigoModalidad}</codigoModalidad>
                    <codigoPuntoVenta>${codigoPuntoVenta}</codigoPuntoVenta>
                    <codigoSistema>${ebSystemDto.systemCode}</codigoSistema>
                    <codigoSucursal>${codigoSucursal}</codigoSucursal>
                    <nit>${ebSystemDto.nit}</nit>
                </SolicitudCuis>
            </siat:cuis>
            </soapenv:Body>
        </soapenv:Envelope>`;
        
    return this.soapRequestService.callService(
      this.URL_WS_FS,
      xml,
      ebSystemDto.token.token,
    );
  }
  async verificarComunicacion(
    ebSystemDto: EbSystemDto,
  ): Promise<VerificarComunicacionResponse> {
    let xml =
      '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:siat="https://siat.impuestos.gob.bo/">';
    xml = xml + '<soapenv:Header/>';
    xml = xml + '<soapenv:Body>';
    xml = xml + '<siat:verificarComunicacion/>';
    xml = xml + '</soapenv:Body>';
    xml = xml + '</soapenv:Envelope>';

    return this.soapRequestService.callService(
      this.URL_WS_FS,
      xml,
      ebSystemDto.token.token,
    );
  }
  async cufd(
    ebSystemDto: EbSystemDto,
    codigoSucursal: number,
    codigoPuntoVenta: number,
    codigoModalidad: number,
    cuis: string,
  ): Promise<CufdResponse> {
    const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:siat="https://siat.impuestos.gob.bo/">
                <soapenv:Header/>
                <soapenv:Body>
                  <siat:cufd>
                      <SolicitudCufd>
                        <codigoAmbiente>${Parameters.ambiente}</codigoAmbiente>
                        <codigoModalidad>${codigoModalidad}</codigoModalidad>
                        <codigoPuntoVenta>${codigoPuntoVenta}</codigoPuntoVenta>
                        <codigoSistema>${ebSystemDto.systemCode}</codigoSistema>
                        <codigoSucursal>${codigoSucursal}</codigoSucursal>
                        <nit>${ebSystemDto.nit}</nit>
                        <cuis>${cuis}</cuis>
                      </SolicitudCufd>
                  </siat:cufd>
                </soapenv:Body>
            </soapenv:Envelope>`;
            
    return this.soapRequestService.callService(
      this.URL_WS_FS,
      xml,
      ebSystemDto.token.token,
    );
  }

  async verificarNit(
    ebSystemDto: EbSystemDto,
    codigoSucursal: number,
    codigoModalidad: number,
    cuis: string,
    nitVerificar: string,
  ): Promise<VerificarNitResponse> {
    const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:siat="https://siat.impuestos.gob.bo/">
                <soapenv:Header/>
                <soapenv:Body>
                  <siat:verificarNit>
                      <SolicitudVerificarNit>
                        <codigoAmbiente>${Parameters.ambiente}</codigoAmbiente>
                        <codigoModalidad>${codigoModalidad}</codigoModalidad>
                        <codigoSistema>${ebSystemDto.systemCode}</codigoSistema>
                        <codigoSucursal>${codigoSucursal}</codigoSucursal>
                        <cuis>${cuis}</cuis>
                        <nit>${ebSystemDto.nit}</nit>
                        <nitParaVerificacion>${nitVerificar}</nitParaVerificacion>
                      </SolicitudVerificarNit>
                  </siat:verificarNit>
                </soapenv:Body>
            </soapenv:Envelope>`;

    return this.soapRequestService.callService(
      this.URL_WS_FS,
      xml,
      ebSystemDto.token.token,
    );
  }
}
