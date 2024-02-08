import { WsResponse } from "./ws.response"


export interface ConsultaEventoSignificativoResponse extends WsResponse {
    "ns2:consultaEventoSignificativoResponse": Ns2ConsultaEventoSignificativoResponse
  }
  
  export interface Ns2ConsultaEventoSignificativoResponse {
    $: GeneratedType
    RespuestaListaEventos: RespuestaListaEventos
  }
  
  export interface GeneratedType {
    "xmlns:ns2": string
  }
  
  export interface RespuestaListaEventos {
    listaCodigos: ListaCodigos[]
    transaccion: string
  }
  
  export interface ListaCodigos {
    codigoEvento: string
    codigoRecepcionEventoSignificativo: string
    descripcion: string
    fechaFin: string
    fechaInicio: string
  }