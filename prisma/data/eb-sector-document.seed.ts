
export const EbSectorDocumentSeed = [
  {
    sectorCode: '1',
    description: 'Factura Compra Venta',
    urlWsFe: 'https://pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionCompraVenta?wsdl',
    urlWsFec: 'https://pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionCompraVenta?wsdl',
    methodFe: 'facturaElectronicaCompraVenta',
    methodFec: 'facturaComputarizadaCompraVenta',
    serviceFe: 'wsFacturacionCompraVentaService',
    serviceFec: 'wsFacturacionCompraVentaService',
    documentTaxCode: 1
  },

  {
    sectorCode: '28',
    description: 'Factura Comercial de Exportación de Servicios',
    urlWsFe: 'https://pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionElectronica?wsdl',
    urlWsFec: 'https://pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionComputarizada?wsdl',
    methodFe: 'facturaElectronicaComercialExportacionServicio',
    methodFec: 'facturaComputarizadaComercialExportacionServicio',
    serviceFe: 'wsFacturacionElectronicaService',
    serviceFec: 'wsFacturacionElectronicaService',
    documentTaxCode: 2
  },

  {
    sectorCode: '13',
    description: 'Factura de Servicios Basicos',
    urlWsFe: 'https://pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionServicioBasico?wsdl',
    urlWsFec: 'https://pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionServicioBasico?wsdl',
    methodFe: 'facturaElectronicaServiciosBasicos',
    methodFec: 'facturaComputarizadaServiciosBasicos',
    serviceFe: 'wsFacturacionServiciosBasicos',
    serviceFec: 'wsFacturacionServiciosBasicos',
    documentTaxCode: 1
  },

  {
    sectorCode: '11',
    description: 'Factura Sector Educativos',
    urlWsFe: 'https://pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionElectronica?wsdl',
    urlWsFec: 'https://pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionComputarizada?wsdl	]',
    methodFe: 'facturaElectronicaEducacion',
    methodFec: 'facturaComputarizadaEducacion',
    serviceFe: 'wsFacturacionElectronicaService',
    serviceFec: 'wsFacturacionElectronicaService',
    documentTaxCode: 1
  },
  {
    sectorCode: '24',
    description: 'Nota de Crédito - Débito',
    urlWsFe: 'https://pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionDocumentoAjuste?wsdl',
    urlWsFec: 'https://pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionDocumentoAjuste?wsdl',
    methodFe: 'notaElectronicaDebitoCredito',
    methodFec: 'notaComputarizadaDebitoCredito',
    serviceFe: 'wsFacturacionDocumentoAjusteService',
    serviceFec: 'wsFacturacionDocumentoAjusteService',
    documentTaxCode: 3
  },
  {
    sectorCode: '47',
    description: 'Nota Crédito Débito Descuentos',
    urlWsFe: 'https://pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionDocumentoAjuste?wsdl',
    urlWsFec: 'https://pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionDocumentoAjuste?wsdl',
    methodFe: 'notaElectronicaDebitoCreditoDescuento',
    methodFec: 'notaComputarizadaDebitoCreditoDescuento',
    serviceFe: 'wsFacturacionDocumentoAjusteService',
    serviceFec: 'wsFacturacionDocumentoAjusteService',
    documentTaxCode: 3
  },
]

