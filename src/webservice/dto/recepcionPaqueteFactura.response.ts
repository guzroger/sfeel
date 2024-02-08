import { WsResponse } from "./ws.response"

export interface RecepcionPaqueteFacturaResponse extends WsResponse  {
    "ns2:recepcionPaqueteFacturaResponse": Ns2RecepcionPaqueteFacturaResponse
  }
  
  export interface Ns2RecepcionPaqueteFacturaResponse {
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
    transaccion: string,
    mensajesList: MensajesList[];
  }
  
  export interface MensajesList {
    codigo: string;
    descripcion: string;
  }