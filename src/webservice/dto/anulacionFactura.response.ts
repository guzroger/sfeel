import { WsResponse } from "./ws.response"

export interface AnulacionFacturaResponse extends WsResponse {
    "ns2:anulacionFacturaResponse": Ns2AnulacionFacturaResponse
  }
  
  export interface Ns2AnulacionFacturaResponse {
    $: GeneratedType
    RespuestaServicioFacturacion: RespuestaServicioFacturacion
  }
  
  export interface GeneratedType {
    "xmlns:ns2": string
  }
  
  export interface RespuestaServicioFacturacion {
    codigoDescripcion: string
    codigoEstado: string
    transaccion: string
    mensajesList: MensajesList
  }

  export interface MensajesList {
    codigo: string
    descripcion: string
  }