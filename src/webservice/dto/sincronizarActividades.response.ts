export interface SincronizarActividadesResponse {
  'ns2:sincronizarActividadesResponse': Ns2SincronizarActividadesResponse;
}

export interface Ns2SincronizarActividadesResponse {
  $: GeneratedType;
  RespuestaListaActividades: RespuestaListaActividades;
}

export interface GeneratedType {
  'xmlns:ns2': string;
}

export interface RespuestaListaActividades {
  transaccion: string;
  listaActividades: ListaActividade[];
}

export interface ListaActividade {
  codigoCaeb: string;
  descripcion: string;
  tipoActividad: string;
}
