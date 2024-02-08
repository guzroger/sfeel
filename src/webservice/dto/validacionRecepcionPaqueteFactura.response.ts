import { WsResponse } from "./ws.response"

export interface ValidacionRecepcionPaqueteFacturaResponse extends WsResponse {
    "ns2:validacionRecepcionPaqueteFacturaResponse": Ns2ValidacionRecepcionPaqueteFacturaResponse
  }
  
  export interface Ns2ValidacionRecepcionPaqueteFacturaResponse {
    $: GeneratedType
    RespuestaServicioFacturacion: RespuestaServicioFacturacion
  }
  
  export interface GeneratedType {
    "xmlns:ns2": string
  }
  
  export interface RespuestaServicioFacturacion {
    codigoDescripcion: string
    codigoEstado: string
    mensajesList: MensajesList
    transaccion: string
  }
  
  export interface MensajesList {
    codigo: string;
    descripcion: string;
    numeroArchivo:string;
    advertencia:string;
    billId:number;
  }