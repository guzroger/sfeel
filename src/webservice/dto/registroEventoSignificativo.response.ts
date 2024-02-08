import { WsResponse } from "./ws.response"

export interface RegistroEventoSignificativoResponse extends WsResponse {
    "ns2:registroEventoSignificativoResponse": Ns2RegistroEventoSignificativoResponse
  }
  
  export interface Ns2RegistroEventoSignificativoResponse {
    $: GeneratedType
    RespuestaListaEventos: RespuestaListaEventos
  }
  
  export interface GeneratedType {
    "xmlns:ns2": string
  }
  
  export interface RespuestaListaEventos {
    codigoRecepcionEventoSignificativo: string
    transaccion: string
    mensajesList: MensajesList[];
  }

  export interface MensajesList {
    codigo: string;
    descripcion: string;
  }