import { EbBillDto } from "../model/dto/ebBill.dto";
import { EbSucursalDto } from "../model/dto/ebSucursal.dto";
export class FacturaPrevaloradaSDCF {
  static facturaElectronicaPrevaloradaSDCF(
    data: EbBillDto,
    ebSucursalDto: EbSucursalDto
  ): string {
    let dateEmiite = data.dateEmitte.toISOString();
    dateEmiite = dateEmiite.replace("Z", "");

    const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <facturaElectronicaPrevaloradaSD xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                                   xsi:noNamespaceSchemaLocation="facturaElectronicaPrevaloradaSD.xsd">
        <cabecera>
            <nitEmisor>${data.nitEmitter}</nitEmisor>
            <razonSocialEmisor>${data.billNameEmitter}</razonSocialEmisor>
            <municipio>${ebSucursalDto.municipality}</municipio>
            <telefono>${ebSucursalDto.phone}</telefono>
            <numeroFactura>${data.billNumber}</numeroFactura>
            <cuf>${data.cuf}</cuf>
            <cufd>${data.cufd}</cufd>
            <codigoSucursal>${data.sucursalCode}</codigoSucursal>
            <direccion>${ebSucursalDto.address}</direccion>
            ${
              data.salePointCode != null
                ? `<codigoPuntoVenta>${data.salePointCode}</codigoPuntoVenta>`
                : '<codigoPuntoVenta xsi:nil="true"/>'
            }
            <fechaEmision>${dateEmiite}</fechaEmision>
            <nombreRazonSocial>${data.billName}</nombreRazonSocial>
            <codigoTipoDocumentoIdentidad>${
              data.documentType
            }</codigoTipoDocumentoIdentidad>
            <numeroDocumento>${data.billDocument}</numeroDocumento>
            <codigoCliente>${data.clientCode}</codigoCliente>
            <codigoMetodoPago>${data.paymentMethod}</codigoMetodoPago>
            ${
              data.cardNumber
                ? `<numeroTarjeta>${data.cardNumber}</numeroTarjeta>`
                : '<numeroTarjeta xsi:nil="true"/>'
            }
            <montoTotal>${data.amount.toFixed(2)}</montoTotal>
            <montoTotalSujetoIva>${data.amountIva.toFixed(2)}</montoTotalSujetoIva>
            <codigoMoneda>${data.coinCode}</codigoMoneda>
            <tipoCambio>${data.exchangeRate.toFixed(2)}</tipoCambio>
            <montoTotalMoneda>${
              (data.amount / data.exchangeRate).toFixed(2)
            }</montoTotalMoneda>
            <leyenda>${data.legend}</leyenda>
            <usuario>${data.user}</usuario>
            <codigoDocumentoSector>${
              data.sectorDocumentCode
            }</codigoDocumentoSector>
        </cabecera>
        ${data.details.map((item) => {
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
    </facturaElectronicaPrevaloradaSD>
    `;

    return xml;
  }

  static facturaComputarizadaPrevaloradaSDCF(
    data: EbBillDto,
    ebSucursalDto: EbSucursalDto
  ): string {
    let dateEmiite = data.dateEmitte.toISOString();
    dateEmiite = dateEmiite.replace("Z", "");

    const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <facturaComputarizadaPrevaloradaSD xsi:noNamespaceSchemaLocation="facturaComputarizadaPrevaloradaSD.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <cabecera>
        <nitEmisor>${data.nitEmitter}</nitEmisor>
        <razonSocialEmisor>${data.billNameEmitter}</razonSocialEmisor>
        <municipio>${ebSucursalDto.municipality}</municipio>
        <telefono>${ebSucursalDto.phone}</telefono>
        <numeroFactura>${data.billNumber}</numeroFactura>
        <cuf>${data.cuf}</cuf>
        <cufd>${data.cufd}</cufd>
        <codigoSucursal>${data.sucursalCode}</codigoSucursal>
        <direccion>${ebSucursalDto.address}</direccion>
        ${
          data.salePointCode != null
            ? `<codigoPuntoVenta>${data.salePointCode}</codigoPuntoVenta>`
            : '<codigoPuntoVenta xsi:nil="true"/>'
        }
        <fechaEmision>${dateEmiite}</fechaEmision>
        <nombreRazonSocial>${data.billName}</nombreRazonSocial>
        <codigoTipoDocumentoIdentidad>${
          data.documentType
        }</codigoTipoDocumentoIdentidad>
        <numeroDocumento>${data.billDocument}</numeroDocumento>
        <codigoCliente>${data.clientCode}</codigoCliente>
        <codigoMetodoPago>${data.paymentMethod}</codigoMetodoPago>
        ${
          data.cardNumber
            ? `<numeroTarjeta>${data.cardNumber}</numeroTarjeta>`
            : '<numeroTarjeta xsi:nil="true"/>'
        }
        <montoTotal>${data.amount.toFixed(2)}</montoTotal>
        <montoTotalSujetoIva>${data.amountIva.toFixed(2)}</montoTotalSujetoIva>
        <codigoMoneda>${data.coinCode}</codigoMoneda>
        <tipoCambio>${data.exchangeRate.toFixed(2)}</tipoCambio>
        <montoTotalMoneda>${(data.amount / data.exchangeRate).toFixed(2)}</montoTotalMoneda>
        <leyenda>${data.legend}</leyenda>
        <usuario>${data.user}</usuario>
        <codigoDocumentoSector>${
          data.sectorDocumentCode
        }</codigoDocumentoSector>
   </cabecera>
${data.details.map((item) => {
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
    </facturaComputarizadaPrevaloradaSD>    
  `;
    return xml;
  }
}
