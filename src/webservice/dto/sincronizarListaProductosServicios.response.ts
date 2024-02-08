export interface SincronizarListaProductosServiciosResponse {
  'ns2:sincronizarListaProductosServiciosResponse': Ns2SincronizarListaProductosServiciosResponse;
}

export interface Ns2SincronizarListaProductosServiciosResponse {
  $: GeneratedType;
  RespuestaListaProductos: RespuestaListaProductos;
}

export interface GeneratedType {
  'xmlns:ns2': string;
}

export interface RespuestaListaProductos {
  transaccion: string;
  listaCodigos: ListaCodigo[];
}

export interface ListaCodigo {
  codigoActividad: string;
  codigoProducto: string;
  descripcionProducto: string;
  nandina?: string;
}
