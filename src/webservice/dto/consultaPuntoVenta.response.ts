import { WsResponse } from "./ws.response"

export interface ConsultaPuntoVentaResponse extends WsResponse {
    "ns2:consultaPuntoVentaResponse": Ns2ConsultaPuntoVentaResponse
}


  
export interface Ns2ConsultaPuntoVentaResponse {
    $: GeneratedType
    RespuestaConsultaPuntoVenta: RespuestaConsultaPuntoVenta
}

export interface GeneratedType {
    "xmlns:ns2": string
}

export interface RespuestaConsultaPuntoVenta {
    listaPuntosVentas: ListaPuntosVenta[]
    transaccion: string
}

export interface ListaPuntosVenta {
    codigoPuntoVenta: string
    nombrePuntoVenta: string
    tipoPuntoVenta: string
}
  