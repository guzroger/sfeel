import { EbBillDto } from "../model/dto/ebBill.dto";
import { EbSucursalDto } from "../model/dto/ebSucursal.dto";
export class FacturaServiciosBasicos {

    static facturaElectronicaServiciosBasicos(ebBillDto: EbBillDto, ebSucursalDto:EbSucursalDto):string{
        let dateEmiite = ebBillDto.dateEmitte.toISOString();
        dateEmiite= dateEmiite.replace('Z', '');
    
    const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
                <facturaElectronicaServicioBasico xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                          xsi:noNamespaceSchemaLocation="facturaElectronicaServicioBasico.xsd">
                  <cabecera>
                  <nitEmisor>${ebBillDto.nitEmitter}</nitEmisor>
                  <razonSocialEmisor>${ebBillDto.billNameEmitter}</razonSocialEmisor>
                  <municipio>${ebSucursalDto.municipality}</municipio>
                  <telefono>${ebSucursalDto.phone}</telefono>
                  <numeroFactura>${ebBillDto.billNumber}</numeroFactura>
                  <cuf>${ebBillDto.cuf}</cuf>
                  <cufd>${ebBillDto.cufd}</cufd>
                  <codigoSucursal>${ebBillDto.sucursalCode}</codigoSucursal>
                  <direccion>${ebSucursalDto.address}</direccion>
                  ${
                    ebBillDto.salePointCode != null
                      ? `<codigoPuntoVenta>${ebBillDto.salePointCode}</codigoPuntoVenta>`
                      : '<codigoPuntoVenta xsi:nil="true"/>'
                  }
                  <mes xsi:nil="true"/>
                  <gestion xsi:nil="true"/>
                  <ciudad xsi:nil="true"/>
                  <zona xsi:nil="true"/>
                  <numeroMedidor>${ebBillDto.meterNumber}</numeroMedidor>            
                  <fechaEmision>${dateEmiite}</fechaEmision>
                  <nombreRazonSocial>${ebBillDto.billName}</nombreRazonSocial>
                  <domicilioCliente>${ebBillDto.address}</domicilioCliente>
                  <codigoTipoDocumentoIdentidad>${ebBillDto.documentType}</codigoTipoDocumentoIdentidad>
                  <numeroDocumento>${ebBillDto.billDocument.trim()}</numeroDocumento>
                  ${
                    ebBillDto.billComplement != null &&
                    ebBillDto.billComplement.length > 0
                      ? `<complemento>${ebBillDto.billComplement}</complemento>`
                      : '<complemento xsi:nil="true"/>'
                  }
                  <codigoCliente>${ebBillDto.clientCode}</codigoCliente>
                  <codigoMetodoPago>${ebBillDto.paymentMethod}</codigoMetodoPago>
                  ${
                    ebBillDto.cardNumber != null &&
                    ebBillDto.cardNumber.length
                      ? `<numeroTarjeta>${ebBillDto.cardNumber}</numeroTarjeta>`
                      : '<numeroTarjeta xsi:nil="true"/>'
                  }
                  <montoTotal>${ebBillDto.amount.toFixed(2)}</montoTotal>
                  <montoTotalSujetoIva>${ebBillDto.amountIva.toFixed(2)}</montoTotalSujetoIva>
                  ${
                    ebBillDto.billedPeriod != null
                      ? `<consumoPeriodo>${ebBillDto.billedPeriod}</consumoPeriodo>`
                      : '<consumoPeriodo xsi:nil="true"/>'
                  }
                  ${
                    ebBillDto.beneficiarioLey1886 != null
                      ? `<beneficiarioLey1886>${ebBillDto.beneficiarioLey1886}</beneficiarioLey1886>`
                      : '<beneficiarioLey1886 xsi:nil="true"/>'
                  }
                  ${
                    ebBillDto.montoDescuentoLey1886 != null
                      ? `<montoDescuentoLey1886>${ebBillDto.montoDescuentoLey1886}</montoDescuentoLey1886>`
                      : '<montoDescuentoLey1886 xsi:nil="true"/>'
                  }
                  ${
                    ebBillDto.montoDescuentoTarifaDignidad != null
                      ? `<montoDescuentoTarifaDignidad>${ebBillDto.montoDescuentoTarifaDignidad}</montoDescuentoTarifaDignidad>`
                      : '<montoDescuentoTarifaDignidad xsi:nil="true"/>'
                  }
                  ${ebBillDto.tasaAseo != null? `<tasaAseo>${ebBillDto.tasaAseo}</tasaAseo>` : '<tasaAseo xsi:nil="true"/>'}
                  ${ebBillDto.tasaAlumbrado != null? `<tasaAlumbrado>${ebBillDto.tasaAlumbrado}</tasaAlumbrado>` : '<tasaAlumbrado xsi:nil="true"/>'}
                  ${ebBillDto.ajusteNoSujetoIva != null? `<ajusteNoSujetoIva>${ebBillDto.ajusteNoSujetoIva}</ajusteNoSujetoIva>` : '<ajusteNoSujetoIva xsi:nil="true"/>'}
                  ${ebBillDto.detalleAjusteNoSujetoIva != null? `<detalleAjusteNoSujetoIva>${ebBillDto.detalleAjusteNoSujetoIva}</detalleAjusteNoSujetoIva>` : '<detalleAjusteNoSujetoIva xsi:nil="true"/>'}
                  ${ebBillDto.ajusteSujetoIva != null? `<ajusteSujetoIva>${ebBillDto.ajusteSujetoIva}</ajusteSujetoIva>` : '<ajusteSujetoIva xsi:nil="true"/>'}
                  ${ebBillDto.detalleAjusteSujetoIva != null? `<detalleAjusteSujetoIva>${ebBillDto.detalleAjusteSujetoIva}</detalleAjusteSujetoIva>` : '<detalleAjusteSujetoIva xsi:nil="true"/>'}
                  ${ebBillDto.otrosPagosNoSujetoIva != null? `<otrosPagosNoSujetoIva>${ebBillDto.otrosPagosNoSujetoIva}</otrosPagosNoSujetoIva>` : '<otrosPagosNoSujetoIva xsi:nil="true"/>'}
                  ${ebBillDto.detlleOtrosPagosNoSujetoIva != null? `<detalleOtrosPagosNoSujetoIva>${ebBillDto.detlleOtrosPagosNoSujetoIva}</detalleOtrosPagosNoSujetoIva>` : '<detalleOtrosPagosNoSujetoIva xsi:nil="true"/>'}
                  ${ebBillDto.otrasTasas != null? `<otrasTasas>${ebBillDto.otrasTasas}</otrasTasas>` : '<otrasTasas xsi:nil="true"/>'}
                  <codigoMoneda>${ebBillDto.coinCode}</codigoMoneda>
                  <tipoCambio>${ebBillDto.exchangeRate.toFixed(2)}</tipoCambio>
                  <montoTotalMoneda>${
                    (ebBillDto.amount / ebBillDto.exchangeRate).toFixed(2)
                  }</montoTotalMoneda>
                  <descuentoAdicional>${
                    ebBillDto.amountDiscount.toFixed(2)
                  }</descuentoAdicional>
                  ${
                    ebBillDto.exceptionDocument != null &&
                    ebBillDto.exceptionDocument > 0
                      ? `<codigoExcepcion>${ebBillDto.exceptionDocument}</codigoExcepcion>`
                      : '<codigoExcepcion xsi:nil="true"/>'
                  }
                  ${
                    ebBillDto.cafc != null && ebBillDto.cafc.length > 0
                      ? `<cafc>${ebBillDto.cafc}</cafc>`
                      : '<cafc xsi:nil="true"/>'
                  }
                  <leyenda>${ebBillDto.legend}</leyenda>
                  <usuario>${ebBillDto.user}</usuario>
                  <codigoDocumentoSector>13</codigoDocumentoSector>
                </cabecera>
                ${ebBillDto.details.map((item) => {
                  return `<detalle>
                                <actividadEconomica>${item.economicActivity}</actividadEconomica>
                                <codigoProductoSin>${item.productCodeSin}</codigoProductoSin>
                                <codigoProducto>${item.productCode}</codigoProducto>
                                <descripcion>${item.description}</descripcion>
                                <cantidad>${item.quantity.toFixed(2)}</cantidad>
                                <unidadMedida>${item.measureCode}</unidadMedida>
                                <precioUnitario>${item.unitPrice.toFixed(2)}</precioUnitario>
                                <montoDescuento>${item.amountDiscount.toFixed(2)}</montoDescuento>
                                <subTotal>${item.subTotal.toFixed(2)}</subTotal>
                    </detalle>`;
                  }).join(`
                  `)}   
            </facturaElectronicaServicioBasico>`;
    return xml;
  }

    static facturaComputarizadaServiciosBasicos(ebBillDto: EbBillDto, ebSucursalDto:EbSucursalDto):string{
        let dateEmiite = ebBillDto.dateEmitte.toISOString();
        dateEmiite= dateEmiite.replace('Z', '');

        const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <facturaComputarizadaServicioBasico xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                                    xsi:noNamespaceSchemaLocation="facturaComputarizadaServicioBasico.xsd">
              <cabecera>
              <nitEmisor>${ebBillDto.nitEmitter}</nitEmisor>
              <razonSocialEmisor>${ebBillDto.billNameEmitter}</razonSocialEmisor>
              <municipio>${ebSucursalDto.municipality}</municipio>
              <telefono>${ebSucursalDto.phone}</telefono>
              <numeroFactura>${ebBillDto.billNumber}</numeroFactura>
              <cuf>${ebBillDto.cuf}</cuf>
              <cufd>${ebBillDto.cufd}</cufd>
              <codigoSucursal>${ebBillDto.sucursalCode}</codigoSucursal>
              <direccion>${ebSucursalDto.address}</direccion>
              ${
                ebBillDto.salePointCode != null
                  ? `<codigoPuntoVenta>${ebBillDto.salePointCode}</codigoPuntoVenta>`
                  : '<codigoPuntoVenta xsi:nil="true"/>'
              }              
              <numeroMedidor>${ebBillDto.meterNumber}</numeroMedidor>
              <fechaEmision>${dateEmiite}</fechaEmision>
              <nombreRazonSocial>${ebBillDto.billName}</nombreRazonSocial>
              <domicilioCliente>${ebBillDto.address}</domicilioCliente>
              <codigoTipoDocumentoIdentidad>${ebBillDto.documentType}</codigoTipoDocumentoIdentidad>
              <numeroDocumento>${ebBillDto.billDocument.trim()}</numeroDocumento>
              ${
                ebBillDto.billComplement != null &&
                ebBillDto.billComplement.length > 0
                  ? `<complemento>${ebBillDto.billComplement}</complemento>`
                  : '<complemento xsi:nil="true"/>'
              }
              <codigoCliente>${ebBillDto.clientCode}</codigoCliente>
              <codigoMetodoPago>${ebBillDto.paymentMethod}</codigoMetodoPago>
              ${
                ebBillDto.cardNumber != null &&
                ebBillDto.cardNumber.length
                  ? `<numeroTarjeta>${ebBillDto.cardNumber}</numeroTarjeta>`
                  : '<numeroTarjeta xsi:nil="true"/>'
              }
              <montoTotal>${ebBillDto.amount.toFixed(2)}</montoTotal>
              <montoTotalSujetoIva>${ebBillDto.amountIva.toFixed(2)}</montoTotalSujetoIva>
              ${
                ebBillDto.billedPeriod != null
                  ? `<consumoPeriodo>${ebBillDto.billedPeriod}</consumoPeriodo>`
                  : '<consumoPeriodo xsi:nil="true"/>'
              }
              ${
                ebBillDto.beneficiarioLey1886 != null
                  ? `<beneficiarioLey1886>${ebBillDto.beneficiarioLey1886}</beneficiarioLey1886>`
                  : '<beneficiarioLey1886 xsi:nil="true"/>'
              }
              ${
                ebBillDto.montoDescuentoLey1886 != null
                  ? `<montoDescuentoLey1886>${ebBillDto.montoDescuentoLey1886}</montoDescuentoLey1886>`
                  : '<montoDescuentoLey1886 xsi:nil="true"/>'
              }
              ${
                ebBillDto.montoDescuentoTarifaDignidad != null
                  ? `<montoDescuentoTarifaDignidad>${ebBillDto.montoDescuentoTarifaDignidad}</montoDescuentoTarifaDignidad>`
                  : '<montoDescuentoTarifaDignidad xsi:nil="true"/>'
              }
              ${ebBillDto.tasaAseo != null? `<tasaAseo>${ebBillDto.tasaAseo}</tasaAseo>` : '<tasaAseo xsi:nil="true"/>'}
              ${ebBillDto.tasaAlumbrado != null? `<tasaAlumbrado>${ebBillDto.tasaAlumbrado}</tasaAlumbrado>` : '<tasaAlumbrado xsi:nil="true"/>'}
              ${ebBillDto.ajusteNoSujetoIva != null? `<ajusteNoSujetoIva>${ebBillDto.ajusteNoSujetoIva}</ajusteNoSujetoIva>` : '<ajusteNoSujetoIva xsi:nil="true"/>'}
              ${ebBillDto.detalleAjusteNoSujetoIva != null? `<detalleAjusteNoSujetoIva>${ebBillDto.detalleAjusteNoSujetoIva}</detalleAjusteNoSujetoIva>` : '<detalleAjusteNoSujetoIva xsi:nil="true"/>'}
              ${ebBillDto.ajusteSujetoIva != null? `<ajusteSujetoIva>${ebBillDto.ajusteSujetoIva}</ajusteSujetoIva>` : '<ajusteSujetoIva xsi:nil="true"/>'}
              ${ebBillDto.detalleAjusteSujetoIva != null? `<detalleAjusteSujetoIva>${ebBillDto.detalleAjusteSujetoIva}</detalleAjusteSujetoIva>` : '<detalleAjusteSujetoIva xsi:nil="true"/>'}
              ${ebBillDto.otrosPagosNoSujetoIva != null? `<otrosPagosNoSujetoIva>${ebBillDto.otrosPagosNoSujetoIva}</otrosPagosNoSujetoIva>` : '<otrosPagosNoSujetoIva xsi:nil="true"/>'}
              ${ebBillDto.detlleOtrosPagosNoSujetoIva != null? `<detalleOtrosPagosNoSujetoIva>${ebBillDto.detlleOtrosPagosNoSujetoIva}</detalleOtrosPagosNoSujetoIva>` : '<detalleOtrosPagosNoSujetoIva xsi:nil="true"/>'}
              ${ebBillDto.otrasTasas != null? `<otrasTasas>${ebBillDto.otrasTasas}</otrasTasas>` : '<otrasTasas xsi:nil="true"/>'}
              <codigoMoneda>${ebBillDto.coinCode}</codigoMoneda>
              <tipoCambio>${ebBillDto.exchangeRate.toFixed(2)}</tipoCambio>
              <montoTotalMoneda>${
                (ebBillDto.amount / ebBillDto.exchangeRate).toFixed(2)
              }</montoTotalMoneda>
              <descuentoAdicional>${
                ebBillDto.amountDiscount.toFixed(2)
              }</descuentoAdicional>
              ${
                ebBillDto.exceptionDocument != null &&
                ebBillDto.exceptionDocument > 0
                  ? `<codigoExcepcion>${ebBillDto.exceptionDocument}</codigoExcepcion>`
                  : '<codigoExcepcion xsi:nil="true"/>'
              }
              ${
                ebBillDto.cafc != null && ebBillDto.cafc.length > 0
                  ? `<cafc>${ebBillDto.cafc}</cafc>`
                  : '<cafc xsi:nil="true"/>'
              }
              <leyenda>${ebBillDto.legend}</leyenda>
              <usuario>${ebBillDto.user}</usuario>
              <codigoDocumentoSector>13</codigoDocumentoSector>
            </cabecera>
            ${ebBillDto.details.map((item) => {
              return `<detalle>
                            <actividadEconomica>${item.economicActivity}</actividadEconomica>
                            <codigoProductoSin>${item.productCodeSin}</codigoProductoSin>
                            <codigoProducto>${item.productCode}</codigoProducto>
                            <descripcion>${item.description}</descripcion>
                            <cantidad>${item.quantity.toFixed(2)}</cantidad>
                            <unidadMedida>${item.measureCode}</unidadMedida>
                            <precioUnitario>${item.unitPrice.toFixed(2)}</precioUnitario>
                            <montoDescuento>${item.amountDiscount.toFixed(2)}</montoDescuento>
                            <subTotal>${item.subTotal.toFixed(2)}</subTotal>
                </detalle>`;
              }).join(`
              `)}                     
        </facturaComputarizadaServicioBasico>`;
    return xml;
  }
}
