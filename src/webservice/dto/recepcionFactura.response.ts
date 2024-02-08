import { WsResponse } from "./ws.response";

export interface RecepcionFacturaResponse extends WsResponse {
  'ns2:recepcionFacturaResponse': Ns2RecepcionFacturaResponse;
}

export interface Ns2RecepcionFacturaResponse {
  $: GeneratedType;
  RespuestaServicioFacturacion: RespuestaServicioFacturacion;
}

export interface GeneratedType {
  'xmlns:ns2': string;
}

export interface RespuestaServicioFacturacion {
  codigoDescripcion: string;
  codigoEstado: string;
  codigoRecepcion: string;
  transaccion: string;
  mensajesList: MensajesList[];
}

export interface MensajesList {
  codigo: string;
  descripcion: string;
  numeroArchivo:string;
  billId:number;
}
