export interface SincronizarFehaHoraResponse {
  'ns2:sincronizarFechaHoraResponse': Ns2SincronizarFechaHoraResponse;
}

export interface Ns2SincronizarFechaHoraResponse {
  $: GeneratedType;
  RespuestaFechaHora: RespuestaFechaHora;
}

export interface GeneratedType {
  'xmlns:ns2': string;
}

export interface RespuestaFechaHora {
  transaccion: string;
  fechaHora: string;
}
