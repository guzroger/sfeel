import { Injectable } from "@nestjs/common";
import { ParameterService } from "src/common/parameter.service";
import { SoapRequestService } from "src/common/soapRequest.service";
import { EbEventDto } from "src/model/dto/ebEvent.dto";
import { EbSystemDto } from "src/model/dto/ebSystem.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { ConsultaEventoSignificativoResponse } from "./dto/consultaEventoSignificativo.response";
import { RegistroEventoSignificativoResponse } from "./dto/registroEventoSignificativo.response";
import { Parameters } from "src/common/parameters";

@Injectable()
export class WsEventosSignificativos {
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

    async registroEventoSignificativo(ebSystemDto: EbSystemDto, ebEventDto:EbEventDto, cuis:string, cufd:string):Promise<RegistroEventoSignificativoResponse>{
        let beginAt = ebEventDto.beginAt.toISOString();
        beginAt= beginAt.replace('Z', '');

        let endAt = ebEventDto.endAt.toISOString();
        endAt= endAt.replace('Z', '');
        
        const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:siat="https://siat.impuestos.gob.bo/">
                        <soapenv:Header/>
                        <soapenv:Body>
                        <siat:registroEventoSignificativo>
                            <SolicitudEventoSignificativo>
                                <codigoAmbiente>${Parameters.ambiente}</codigoAmbiente>
                                <codigoMotivoEvento>${ebEventDto.eventType}</codigoMotivoEvento>
                                ${ (ebEventDto.salePointCode!=null || ebEventDto.salePointCode>0)? `<codigoPuntoVenta>${ebEventDto.salePointCode}</codigoPuntoVenta>` : '' }
                                <codigoSistema>${ebSystemDto.systemCode}</codigoSistema>
                                <codigoSucursal>${ebEventDto.sucursalCode}</codigoSucursal>
                                <cufd>${cufd}</cufd>
                                <cufdEvento>${ebEventDto.cufdEvent}</cufdEvento>
                                <cuis>${cuis}</cuis>
                                <descripcion>${ebEventDto.description}</descripcion>
                                <fechaHoraInicioEvento>${beginAt}</fechaHoraInicioEvento>
                                <fechaHoraFinEvento>${endAt}</fechaHoraFinEvento>                                
                                <nit>${ebSystemDto.nit}</nit>
                            </SolicitudEventoSignificativo>
                        </siat:registroEventoSignificativo>
                        </soapenv:Body>
                    </soapenv:Envelope>`;
        return this.soapRequestService.callService(
            this.URL_WS_FS,
            xml,
            ebSystemDto.token.token,
        );
    }


    async consultaEventoSignificativo( dateEvent:Date, ebSystemDto: EbSystemDto, sucursalCode:number, salePointCode:number , cuis:string, cufd:string):Promise<ConsultaEventoSignificativoResponse>{
        let date = dateEvent.toISOString();
        date= date.replace('Z', '');
   
        const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:siat="https://siat.impuestos.gob.bo/">
                        <soapenv:Header/>
                        <soapenv:Body>
                        <siat:consultaEventoSignificativo>
                            <SolicitudConsultaEvento>
                                <codigoAmbiente>${Parameters.ambiente}</codigoAmbiente>
                                ${ (salePointCode!=null)? `<codigoPuntoVenta>${salePointCode}</codigoPuntoVenta>` : '' }
                                <codigoSistema>${ebSystemDto.systemCode}</codigoSistema>
                                <codigoSucursal>${sucursalCode}</codigoSucursal>
                                <cufd>${cufd}</cufd>
                                <cuis>${cuis}</cuis>
                                <fechaEvento>${date}</fechaEvento>
                                <nit>${ebSystemDto.nit}</nit>
                            </SolicitudConsultaEvento>
                        </siat:consultaEventoSignificativo>
                        </soapenv:Body>
                    </soapenv:Envelope>`;
        return this.soapRequestService.callService(
            this.URL_WS_FS,
            xml,
            ebSystemDto.token.token,
        );
    }
    
}