export interface SincronizarListaActividadesDocumentoSectorResponse {
  'ns2:sincronizarListaActividadesDocumentoSectorResponse': Ns2SincronizarListaActividadesDocumentoSectorResponse;
}

export interface Ns2SincronizarListaActividadesDocumentoSectorResponse {
  $: GeneratedType;
  RespuestaListaActividadesDocumentoSector: RespuestaListaActividadesDocumentoSector;
}

export interface GeneratedType {
  'xmlns:ns2': string;
}

export interface RespuestaListaActividadesDocumentoSector {
  transaccion: string;
  listaActividadesDocumentoSector: ListaActividadesDocumentoSector[];
}

export interface ListaActividadesDocumentoSector {
  codigoActividad: string;
  codigoDocumentoSector: string;
  tipoDocumentoSector: string;
}
