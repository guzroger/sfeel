export interface SincronizarListaLeyendasFacturaResponse {
  'ns2:sincronizarListaLeyendasFacturaResponse': Ns2SincronizarListaLeyendasFacturaResponse;
}

export interface Ns2SincronizarListaLeyendasFacturaResponse {
  $: GeneratedType;
  RespuestaListaParametricasLeyendas: RespuestaListaParametricasLeyendas;
}

export interface GeneratedType {
  'xmlns:ns2': string;
}

export interface RespuestaListaParametricasLeyendas {
  transaccion: string;
  listaLeyendas: ListaLeyenda[];
}

export interface ListaLeyenda {
  codigoActividad: string;
  descripcionLeyenda: string;
}
