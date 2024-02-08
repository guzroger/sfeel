export interface RespuestaListaParametricas {
  transaccion: string;
  listaCodigos: ListaCodigo[];
}

export interface ListaCodigo {
  codigoClasificador: string;
  descripcion: string;
}
