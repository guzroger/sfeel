import { ParameterService } from "src/common/parameter.service";
import { Parameters } from "src/common/parameters";
import { SoapRequestService } from "src/common/soapRequest.service";
import { PrismaService } from "src/prisma/prisma.service";
import { EbSalePointDto } from '../model/dto/ebSalePoint.dto';
import { EbSystemDto } from "src/model/dto/ebSystem.dto";
import { Injectable } from "@nestjs/common";
import { ResgistroPuntoVentaResponse } from "./dto/registroPuntoVenta.response";
import { ConsultaPuntoVentaResponse } from "./dto/consultaPuntoVenta.response";

@Injectable()
export class WsFacturacionOperacionesService {
    private URL_WS_FS = 'https://pilotosiatservicios.impuestos.gob.bo/v2/FacturacionOperaciones?wsdl';
    constructor(
        private soapRequestService: SoapRequestService,
        private parameterService: ParameterService,
        private prismaService: PrismaService,
      ){

        this.init();
      }
    init(): void {

    this.prismaService.geConstant
        .findUnique({
        where: {
            code_codeGroup: { code: 'FACTURACION_OPERACIONES', codeGroup: 'WS_URL' },
        },
        })
        .then((data) => {
        if (data != null) {
            console.log(data.value);
            this.URL_WS_FS = data.value;
        }
        });
    }

    async registroPuntoVenta(ebSystemDto: EbSystemDto, ebSalePointDto:EbSalePointDto,  cuis:string):Promise<ResgistroPuntoVentaResponse>{
        
        const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:siat="https://siat.impuestos.gob.bo/">
                        <soapenv:Header/>
                        <soapenv:Body>
                        <siat:registroPuntoVenta>
                            <SolicitudRegistroPuntoVenta>
                                <codigoAmbiente>${Parameters.ambiente}</codigoAmbiente>
                                <codigoModalidad>${ebSalePointDto.modalityCode}</codigoModalidad>
                                <codigoSistema>${ebSystemDto.systemCode}</codigoSistema>
                                <codigoSucursal>${ebSalePointDto.sucursalCode }</codigoSucursal>
                                <codigoTipoPuntoVenta>${ebSalePointDto.typeSalePoint}</codigoTipoPuntoVenta>
                                <cuis>${cuis}</cuis>
                                <descripcion>${ebSalePointDto.description}</descripcion>
                                <nit>${ebSystemDto.nit}</nit>
                                <nombrePuntoVenta>${ebSalePointDto.description}</nombrePuntoVenta>
                            </SolicitudRegistroPuntoVenta>
                        </siat:registroPuntoVenta>
                        </soapenv:Body>
                    </soapenv:Envelope>`;

                    console.log(xml);
        return this.soapRequestService.callService(
            this.URL_WS_FS,
            xml,
            ebSystemDto.token.token,
        );
    }

    async consultaPuntoVenta(ebSystemDto: EbSystemDto, sucursalCode:number,  cuis:string):Promise<ConsultaPuntoVentaResponse>{
        
        const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:siat="https://siat.impuestos.gob.bo/">
                        <soapenv:Header/>
                        <soapenv:Body>
                        <siat:consultaPuntoVenta>
                            <SolicitudConsultaPuntoVenta>
                                <codigoAmbiente>${Parameters.ambiente}</codigoAmbiente>
                                <codigoSistema>${ebSystemDto.systemCode}</codigoSistema>
                                <codigoSucursal>${sucursalCode}</codigoSucursal>
                                <cuis>${cuis}</cuis>
                                <nit>${ebSystemDto.nit}</nit>
                            </SolicitudConsultaPuntoVenta>
                        </siat:consultaPuntoVenta>
                        </soapenv:Body>
                    </soapenv:Envelope>`;

                    console.log(xml);
        return this.soapRequestService.callService(
            this.URL_WS_FS,
            xml,
            ebSystemDto.token.token,
        );
    }
}