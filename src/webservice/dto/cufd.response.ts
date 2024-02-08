export interface CufdResponse {
  'ns2:cufdResponse': Ns2CufdResponse;
}
export interface Ns2CufdResponse {
  $: GeneratedType;
  RespuestaCufd: RespuestaCufd;
}

export interface GeneratedType {
  'xmlns:ns2': string;
}

export interface RespuestaCufd {
  codigo: string;
  codigoControl: string;
  direccion: string;
  fechaVigencia: string;
  transaccion: string;
  mensajesList: MensajesList | MensajesList[];
}

export interface MensajesList {
  codigo: string;
  descripcion: string;
}
