export interface ReversionAnulacionFacturaResponse {
    "ns2:reversionAnulacionFacturaResponse": Ns2ReversionAnulacionFacturaResponse
    soapResponse: string
    soapRequest: string
  }
  
  export interface Ns2ReversionAnulacionFacturaResponse {
    $: GeneratedType
    RespuestaServicioFacturacion: RespuestaServicioFacturacion
  }
  
  export interface GeneratedType {
    "xmlns:ns2": string
  }
  
  export interface RespuestaServicioFacturacion {
    codigoDescripcion: string
    codigoEstado: string
    transaccion: string
  }
  