export interface VerificarNitResponse {
  'ns2:verificarNitResponse': Ns2VerificarNitResponse;
}

export interface Ns2VerificarNitResponse {
  $: GeneratedType;
  RespuestaVerificarNit: RespuestaVerificarNit;
}

export interface GeneratedType {
  'xmlns:ns2': string;
}

export interface RespuestaVerificarNit {
  mensajesList: MensajesList;
  transaccion: string;
}

export interface MensajesList {
  codigo: string;
  descripcion: string;
}
