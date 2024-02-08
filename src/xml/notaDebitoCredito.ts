import { EbBillDto } from "src/model/dto/ebBill.dto";
import { EbSucursalDto } from "../model/dto/ebSucursal.dto";
export class NotaDebitoCredito {

    static notaDebitoCreditoElectronica(ebBillDto: EbBillDto, ebSucursalDto:EbSucursalDto):string{
        let dateEmiite = ebBillDto.dateEmitte.toISOString();
        dateEmiite= dateEmiite.replace('Z', '');

        let dateEmiiteRef = ebBillDto.dateEmitteRef.toISOString();
        dateEmiiteRef= dateEmiiteRef.replace('Z', '');

        const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <notaFiscalElectronicaCreditoDebito xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                                            xsi:noNamespaceSchemaLocation="notaElectronicaCreditoDebito.xsd">
            <cabecera>
                <nitEmisor>${ebBillDto.nitEmitter}</nitEmisor>
                <razonSocialEmisor>${ebBillDto.billNameEmitter}</razonSocialEmisor>
                <municipio>${ebSucursalDto.municipality}</municipio>
                <telefono>${ebSucursalDto.phone}</telefono>
                <numeroNotaCreditoDebito>${ebBillDto.billNumber}</numeroNotaCreditoDebito>
                <cuf>${ebBillDto.cuf}</cuf>
                <cufd>${ebBillDto.cufd}</cufd>
                <codigoSucursal>${ebBillDto.sucursalCode}</codigoSucursal>
                <direccion>${ebSucursalDto.address}</direccion>
                ${
                    ebBillDto.salePointCode != null
                      ? `<codigoPuntoVenta>${ebBillDto.salePointCode}</codigoPuntoVenta>`
                      : '<codigoPuntoVenta xsi:nil="true"/>'
                  }
                <fechaEmision>${dateEmiite}</fechaEmision>
                <nombreRazonSocial>${ebBillDto.billName}</nombreRazonSocial>
                <codigoTipoDocumentoIdentidad>${ebBillDto.documentType}</codigoTipoDocumentoIdentidad>
                <numeroDocumento>${ebBillDto.billDocument}</numeroDocumento>
                ${
                    ebBillDto.billComplement != null &&
                    ebBillDto.billComplement.length > 0
                      ? `<complemento>${ebBillDto.billComplement}</complemento>`
                      : '<complemento xsi:nil="true"/>'
                  }
                <codigoCliente>${ebBillDto.clientCode}</codigoCliente>
                <numeroFactura>${ebBillDto.billNumberRef}</numeroFactura>
                <numeroAutorizacionCuf>${ebBillDto.cufRef}</numeroAutorizacionCuf>
                <fechaEmisionFactura>${dateEmiiteRef}</fechaEmisionFactura>
                <montoTotalOriginal>${ebBillDto.amountTotalOriginal.toFixed(2)}</montoTotalOriginal>
                <montoTotalDevuelto>${ebBillDto.amountTotalReturned.toFixed(2)}</montoTotalDevuelto>                
                ${
                  ebBillDto.amountDiscountCreditDebit != null &&
                  ebBillDto.amountDiscountCreditDebit > 0
                    ? `<montoDescuentoCreditoDebito>${ebBillDto.amountDiscountCreditDebit.toFixed(2)}</montoDescuentoCreditoDebito>`
                    : '<montoDescuentoCreditoDebito xsi:nil="true"/>'
                }
                ${
                  ebBillDto.amountEffectiveCreditDebit != null &&
                  ebBillDto.amountEffectiveCreditDebit > 0
                    ? `<montoEfectivoCreditoDebito>${ebBillDto.amountEffectiveCreditDebit.toFixed(2)}</montoEfectivoCreditoDebito>`
                    : '<montoEfectivoCreditoDebito xsi:nil="true"/>'
                }

                ${
                    ebBillDto.exceptionDocument != null &&
                    ebBillDto.exceptionDocument > 0
                      ? `<codigoExcepcion>${ebBillDto.exceptionDocument}</codigoExcepcion>`
                      : '<codigoExcepcion xsi:nil="true"/>'
                  }
                <leyenda>${ebBillDto.legend}</leyenda>
                <usuario>${ebBillDto.user}</usuario>
                <codigoDocumentoSector>24</codigoDocumentoSector>
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
                            ${ item.amountDiscount !=null && item.amountDiscount>0
                              ? `<montoDescuento>${item.amountDiscount.toFixed(2)}</montoDescuento>` 
                              : `<montoDescuento xsi:nil="true"/>` }
                            <subTotal>${item.subTotal}</subTotal>
                            <codigoDetalleTransaccion>${item.codeTransactionDetail}</codigoDetalleTransaccion>                                                
                  </detalle>`;
                }).join(`
                `)}    
            
        </notaFiscalElectronicaCreditoDebito>`;

    return xml;
  }

    static notaDebitoCreditoComputarizada(ebBillDto: EbBillDto, ebSucursalDto:EbSucursalDto):string{
        let dateEmiite = ebBillDto.dateEmitte.toISOString();
        dateEmiite= dateEmiite.replace('Z', '');

        let dateEmiiteRef = ebBillDto.dateEmitteRef.toISOString();
        dateEmiiteRef= dateEmiiteRef.replace('Z', '');

        const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <notaFiscalComputarizadaCreditoDebito xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                                            xsi:noNamespaceSchemaLocation="notaElectronicaCreditoDebito.xsd">
            <cabecera>
                <nitEmisor>${ebBillDto.nitEmitter}</nitEmisor>
                <razonSocialEmisor>${ebBillDto.billNameEmitter}</razonSocialEmisor>
                <municipio>${ebSucursalDto.municipality}</municipio>
                <telefono>${ebSucursalDto.phone}</telefono>
                <numeroNotaCreditoDebito>${ebBillDto.billNumber}</numeroNotaCreditoDebito>
                <cuf>${ebBillDto.cuf}</cuf>
                <cufd>${ebBillDto.cufd}</cufd>
                <codigoSucursal>${ebBillDto.sucursalCode}</codigoSucursal>
                <direccion>${ebSucursalDto.address}</direccion>
                ${
                    ebBillDto.salePointCode != null
                      ? `<codigoPuntoVenta>${ebBillDto.salePointCode}</codigoPuntoVenta>`
                      : '<codigoPuntoVenta xsi:nil="true"/>'
                  }
                <fechaEmision>${dateEmiite}</fechaEmision>
                <nombreRazonSocial>${ebBillDto.billName}</nombreRazonSocial>
                <codigoTipoDocumentoIdentidad>${ebBillDto.documentType}</codigoTipoDocumentoIdentidad>
                <numeroDocumento>${ebBillDto.billDocument}</numeroDocumento>
                ${
                    ebBillDto.billComplement != null &&
                    ebBillDto.billComplement.length > 0
                      ? `<complemento>${ebBillDto.billComplement}</complemento>`
                      : '<complemento xsi:nil="true"/>'
                  }
                <codigoCliente>${ebBillDto.clientCode}</codigoCliente>
                <numeroFactura>${ebBillDto.billNumberRef}</numeroFactura>
                <numeroAutorizacionCuf>${ebBillDto.cufRef}</numeroAutorizacionCuf>
                <fechaEmisionFactura>${dateEmiiteRef}</fechaEmisionFactura>
                <montoTotalOriginal>${ebBillDto.amountTotalOriginal.toFixed(2)}</montoTotalOriginal>
                <montoTotalDevuelto>${ebBillDto.amountTotalReturned.toFixed(2)}</montoTotalDevuelto>                
                ${
                  ebBillDto.amountDiscountCreditDebit != null &&
                  ebBillDto.amountDiscountCreditDebit > 0
                    ? `<montoDescuentoCreditoDebito>${ebBillDto.amountDiscountCreditDebit.toFixed(2)}</montoDescuentoCreditoDebito>`
                    : '<montoDescuentoCreditoDebito xsi:nil="true"/>'
                }
                ${
                  ebBillDto.amountEffectiveCreditDebit != null &&
                  ebBillDto.amountEffectiveCreditDebit > 0
                    ? `<montoEfectivoCreditoDebito>${ebBillDto.amountEffectiveCreditDebit.toFixed(2)}</montoEfectivoCreditoDebito>`
                    : '<montoEfectivoCreditoDebito xsi:nil="true"/>'
                }
                ${
                    ebBillDto.exceptionDocument != null &&
                    ebBillDto.exceptionDocument > 0
                      ? `<codigoExcepcion>${ebBillDto.exceptionDocument}</codigoExcepcion>`
                      : '<codigoExcepcion xsi:nil="true"/>'
                  }
                <leyenda>${ebBillDto.legend}</leyenda>
                <usuario>${ebBillDto.user}</usuario>
                <codigoDocumentoSector>24</codigoDocumentoSector>
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
                            ${ item.amountDiscount !=null 
                              ? `<montoDescuento>${item.amountDiscount.toFixed(2)}</montoDescuento>` 
                              : `<montoDescuento xsi:nil="true"/>` }
                            <subTotal>${item.subTotal}</subTotal>
                            <codigoDetalleTransaccion>${item.codeTransactionDetail}</codigoDetalleTransaccion>
                                                
                  </detalle>`;
                }).join(`
                `)}    
            
        </notaFiscalComputarizadaCreditoDebito>`;
    return xml;
  }
}
