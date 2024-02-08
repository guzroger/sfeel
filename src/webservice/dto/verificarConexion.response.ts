export interface VerificarComunicacionResponse {
  'ns2:verificarComunicacionResponse': Ns2VerificarComunicacionResponse;
}

export interface Ns2VerificarComunicacionResponse {
  $: GeneratedType;
  RespuestaComunicacion: RespuestaComunicacion;
}

export interface GeneratedType {
  'xmlns:ns2': string;
}

export interface RespuestaComunicacion {
  mensajesList: MensajesList;
  transaccion: string;
}

export interface MensajesList {
  codigo: string;
  descripcion: string;
}
