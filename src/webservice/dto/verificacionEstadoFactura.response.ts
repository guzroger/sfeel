import { WsResponse } from "./ws.response"

export interface VerificacionEstadoFacturaResponse extends WsResponse {
    "ns2:verificacionEstadoFacturaResponse": Ns2VerificacionEstadoFacturaResponse
  }
  
  export interface Ns2VerificacionEstadoFacturaResponse {
    $: GeneratedType
    RespuestaServicioFacturacion: RespuestaServicioFacturacion
  }
  
  export interface GeneratedType {
    "xmlns:ns2": string
  }
  
  export interface RespuestaServicioFacturacion {
    codigoDescripcion: string
    codigoEstado: string
    codigoRecepcion: string
    mensajesList: MensajesList
    transaccion: string
  }
  
  export interface MensajesList {
    codigo: string
    descripcion: string
  }