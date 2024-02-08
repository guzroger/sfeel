import { EbBillDto } from "../model/dto/ebBill.dto";
import { EbSucursalDto } from "../model/dto/ebSucursal.dto";
export class FacturaCompraVenta {

    static facturaElectronicaCompraVenta(ebBillDto: EbBillDto, ebSucursalDto:EbSucursalDto):string{
        let dateEmiite = ebBillDto.dateEmitte.toISOString();
        dateEmiite= dateEmiite.replace('Z', '');
    
    const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
                <facturaElectronicaCompraVenta xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                                            xsi:noNamespaceSchemaLocation="facturaElectronicaCompraVenta.xsd">
                    <cabecera>
                        <nitEmisor>${ebBillDto.nitEmitter}</nitEmisor>
                        <razonSocialEmisor>${
                          ebBillDto.billNameEmitter
                        }</razonSocialEmisor>
                        <municipio>${ebSucursalDto.municipality}</municipio>
                        <telefono>${ebSucursalDto.phone}</telefono>
                        <numeroFactura>${ebBillDto.billNumber}</numeroFactura>
                        <cuf>${ebBillDto.cuf}</cuf>
                        <cufd>${ebBillDto.cufd}</cufd>
                        <codigoSucursal>${
                          ebBillDto.sucursalCode
                        }</codigoSucursal>
                        <direccion>${ebSucursalDto.address}</direccion>
                        ${
                          ebBillDto.salePointCode != null
                            ? `<codigoPuntoVenta>${ebBillDto.salePointCode}</codigoPuntoVenta>`
                            : '<codigoPuntoVenta xsi:nil="true"/>'
                        }
                        <fechaEmision>${dateEmiite}</fechaEmision>
                        <nombreRazonSocial>${
                          ebBillDto.billName
                        }</nombreRazonSocial>
                        <codigoTipoDocumentoIdentidad>${
                          ebBillDto.documentType
                        }</codigoTipoDocumentoIdentidad>
                        <numeroDocumento>${
                          ebBillDto.billDocument
                        }</numeroDocumento>
                        ${
                          ebBillDto.billComplement != null &&
                          ebBillDto.billComplement.length > 0
                            ? `<complemento>${ebBillDto.billComplement}</complemento>`
                            : '<complemento xsi:nil="true"/>'
                        }
                        <codigoCliente>${ebBillDto.clientCode}</codigoCliente>
                        <codigoMetodoPago>${
                          ebBillDto.paymentMethod
                        }</codigoMetodoPago>
                        ${
                          ebBillDto.cardNumber != null &&
                          ebBillDto.cardNumber.length
                            ? `<numeroTarjeta>${ebBillDto.cardNumber}</numeroTarjeta>`
                            : '<numeroTarjeta xsi:nil="true"/>'
                        }
                        <montoTotal>${ebBillDto.amount.toFixed(2)}</montoTotal>
                        <montoTotalSujetoIva>${
                          ebBillDto.amountIva.toFixed(2)
                        }</montoTotalSujetoIva>
                        <codigoMoneda>${ebBillDto.coinCode}</codigoMoneda>
                        <tipoCambio>${ebBillDto.exchangeRate.toFixed(2)}</tipoCambio>
                        <montoTotalMoneda>${
                          (ebBillDto.amount / ebBillDto.exchangeRate).toFixed(2)
                        }</montoTotalMoneda>
                        ${
                          ebBillDto.amountGiftCard != null &&
                          ebBillDto.amountGiftCard > 0
                            ? `<montoGiftCard>${ebBillDto.amountGiftCard.toFixed(2)}</montoGiftCard>`
                            : '<montoGiftCard xsi:nil="true"/>'
                        }
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
                        <codigoDocumentoSector>1</codigoDocumentoSector>
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
                                    <numeroSerie>${item.serieNumber?item.serieNumber:`` }</numeroSerie>
                                    <numeroImei>${item.imeiNumber?item.imeiNumber:``}</numeroImei>                   
                        </detalle>`;
                      }).join(`
                      `)}     
                </facturaElectronicaCompraVenta>`;
    return xml;
  }

    static facturaComputarizadaCompraVenta(ebBillDto: EbBillDto, ebSucursalDto:EbSucursalDto):string{
        const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <facturaComputarizadaCompraVenta xsi:noNamespaceSchemaLocation="facturaComputarizadaCompraVenta.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                <cabecera>
                <nitEmisor>${ebBillDto.nitEmitter}</nitEmisor>
                <razonSocialEmisor>${
                  ebBillDto.billNameEmitter
                }</razonSocialEmisor>
                <municipio>${ebSucursalDto.municipality}</municipio>
                <telefono>${ebSucursalDto.phone}</telefono>
                <numeroFactura>${ebBillDto.billName}</numeroFactura>
                <cuf>${ebBillDto.cuf}</cuf>
                <cufd>${ebBillDto.cufd}</cufd>
                <codigoSucursal>${ebBillDto.sucursalCode}</codigoSucursal>
                <direccion>${ebSucursalDto.address}</direccion>
                ${
                  ebBillDto.salePointCode != null
                    ? `<codigoPuntoVenta>${ebBillDto.salePointCode}</codigoPuntoVenta>`
                    : '<codigoPuntoVenta xsi:nil="true"/>'
                }
                <fechaEmision>2021-10-07T09:01:24.178</fechaEmision>
                <nombreRazonSocial>${ebBillDto.billName}</nombreRazonSocial>
                <codigoTipoDocumentoIdentidad>${
                  ebBillDto.documentType
                }</codigoTipoDocumentoIdentidad>
                <numeroDocumento>${ebBillDto.billDocument}</numeroDocumento>
                ${
                  ebBillDto.billComplement != null
                    ? `<complemento>${ebBillDto.billComplement}</complemento>`
                    : '<complemento xsi:nil="true"/>'
                }
                <codigoCliente>${ebBillDto.clientCode}</codigoCliente>
                <codigoMetodoPago>${ebBillDto.paymentMethod}</codigoMetodoPago>
                ${
                  ebBillDto.cardNumber != null
                    ? `<numeroTarjeta>${ebBillDto.cardNumber}</numeroTarjeta>`
                    : '<numeroTarjeta xsi:nil="true"/>'
                }
                <montoTotal>${ebBillDto.amount.toFixed(2)}</montoTotal>
                <montoTotalSujetoIva>${
                  ebBillDto.amountIva.toFixed(2)
                }</montoTotalSujetoIva>
                <codigoMoneda>${ebBillDto.coinCode}</codigoMoneda>
                <tipoCambio>${ebBillDto.exchangeRate.toFixed(2)}</tipoCambio>
                <montoTotalMoneda>${
                  (ebBillDto.amount / ebBillDto.exchangeRate).toFixed(2)
                }</montoTotalMoneda>
                ${
                  ebBillDto.amountGiftCard != null &&
                  ebBillDto.amountGiftCard > 0
                    ? `<montoGiftCard>${ebBillDto.amountGiftCard.toFixed(2)}</montoGiftCard>`
                    : '<montoGiftCard xsi:nil="true"/>'
                }
                <descuentoAdicional>${
                  ebBillDto.amountDiscount
                }</descuentoAdicional>
                ${
                  ebBillDto.exceptionDocument != null
                    ? `<codigoExcepcion>${ebBillDto.exceptionDocument}</codigoExcepcion>`
                    : '<codigoExcepcion xsi:nil="true"/>'
                }
                ${
                  ebBillDto.cafc != null
                    ? `<cafc>${ebBillDto.cafc}</cafc>`
                    : '<cafc xsi:nil="true"/>'
                }
                <leyenda>${ebBillDto.legend}</leyenda>
                <usuario>${ebBillDto.user}</usuario>
                <codigoDocumentoSector>1</codigoDocumentoSector>
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
                            <numeroSerie>${item.serieNumber?item.serieNumber:`` }</numeroSerie>
                            <numeroImei>${item.imeiNumber?item.imeiNumber:``}</numeroImei>                   
                      </detalle>`;
                }).join(`
                `)}                        
        </facturaComputarizadaCompraVenta>`;
    return xml;
  }
}
