import { EbBillDto } from "src/model/dto/ebBill.dto";
import { RecepcionFacturaResponse } from "./dto/recepcionFactura.response";
import { EbSystemDto } from "src/model/dto/ebSystem.dto";
import { RecepcionPaqueteFacturaResponse } from "./dto/recepcionPaqueteFactura.response";
import { EbPackageBillDto } from "src/model/dto/ebPackageBill.dto";
import { ValidacionRecepcionPaqueteFacturaResponse } from "./dto/validacionRecepcionPaqueteFactura.response";
import { AnulacionFacturaResponse } from "./dto/anulacionFactura.response";
import { VerificacionEstadoFacturaResponse } from "./dto/verificacionEstadoFactura.response";
import { ReversionAnulacionFacturaResponse } from "./dto/reversionAnulacionFactura.response";

export interface WsFacturacionService {
    recepcionFactura(ebBillDto:EbBillDto, ebSystemDto: EbSystemDto, cuis:string, xmlBill:string, hash:string, urlService:string):Promise<RecepcionFacturaResponse>;
    recepcionPaqueteFactura(ebPackageBillDto:EbPackageBillDto, ebSystemDto: EbSystemDto, cuis:string, archive:string, hash:string, urlService:string):Promise<RecepcionPaqueteFacturaResponse>;
    validacionRecepcionPaqueteFactura(ebPackageBillDto:EbPackageBillDto,  ebSystemDto: EbSystemDto, cuis:string, urlService:string):Promise<ValidacionRecepcionPaqueteFacturaResponse>;
    anulacionFactura(ebBillDto:EbBillDto, ebSystemDto: EbSystemDto, cuis:string, cufd:string, urlService:string ):Promise<AnulacionFacturaResponse>;
    verificacionEstadoFactura(ebBillDto:EbBillDto, ebSystemDto: EbSystemDto, cuis:string, cufd:string, urlService:string ): Promise<VerificacionEstadoFacturaResponse>
    recepcionMasivaFactura(ebPackageBillDto:EbPackageBillDto, ebSystemDto: EbSystemDto, cuis:string, archive:string, hash:string, urlService:string):Promise<RecepcionPaqueteFacturaResponse>;
    validacionRecepcionMasivaFactura(ebPackageBillDto:EbPackageBillDto,  ebSystemDto: EbSystemDto, cuis:string, urlService:string):Promise<ValidacionRecepcionPaqueteFacturaResponse>;
    verificarComunicacion(ebSystemDto: EbSystemDto, urlService:string);

    recepcionAnexos(ebBillDto:EbBillDto, ebSystemDto: EbSystemDto, cuis:string, xmlBill:string, hash:string, urlService:string);

    reversionAnulacionFactura(ebBillDto:EbBillDto,ebSystemDto: EbSystemDto,cufd:string, cuis:string, urlService:string) : Promise<ReversionAnulacionFacturaResponse>;

    recepcionAnexosSuministroEnergia(ebBillDto:EbBillDto, ebSystemDto: EbSystemDto, cuis:string, xmlBill:string, hash:string, urlService:string);
}