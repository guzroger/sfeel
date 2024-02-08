import { WsResponse } from "./ws.response";

export interface ResgistroPuntoVentaResponse extends WsResponse {
    "ns2:registroPuntoVentaResponse": Ns2RegistroPuntoVentaResponse
}

  
  export interface Ns2RegistroPuntoVentaResponse {
    $: GeneratedType
    RespuestaRegistroPuntoVenta: RespuestaRegistroPuntoVenta
  }
  
  export interface GeneratedType {
    "xmlns:ns2": string
  }
  
  export interface RespuestaRegistroPuntoVenta {
    codigoPuntoVenta: string
    mensajesList: MensajesList
    transaccion: string
  }
  
  export interface MensajesList {
    codigo: string
    descripcion: string
  }