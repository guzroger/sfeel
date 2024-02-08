export interface CuisResponse {
  'ns2:cuisResponse': Ns2CuisResponse;
}

export interface Ns2CuisResponse {
  $: GeneratedType;
  RespuestaCuis: RespuestaCuis;
}

export interface GeneratedType {
  'xmlns:ns2': string;
}

export interface RespuestaCuis {
  codigo: string;
  fechaVigencia: string;
  mensajesList: MensajesList;
  transaccion: string;
}

export interface MensajesList {
  codigo: string;
  descripcion: string;
}
