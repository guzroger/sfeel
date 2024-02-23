import { EbSucursalDto } from "../model/dto/ebSucursal.dto";
import { EbBillDto } from "../model/dto/ebBill.dto";
export class FacturaExportacionServicio {
  static facturaElectronicaComercialExportacionServicio(
    data: EbBillDto,
    ebSucursalDto: EbSucursalDto
  ): string {
    let dateEmiite = data.dateEmitte.toISOString();
    dateEmiite = dateEmiite.replace("Z", "");

    const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <facturaElectronicaComercialExportacionServicio xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                                                    xsi:noNamespaceSchemaLocation="facturaElectronicaComercialExportacionServicio.xsd">
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
              <numeroDocumento>${data.billDocument.trim()}</numeroDocumento>
              ${
                data.billComplement
                  ? `<complemento>${data.billComplement}</complemento>`
                  : '<complemento xsi:nil="true"/>'
              }
                <direccionComprador>${data.addressBuyer}</direccionComprador>
                <codigoCliente>${data.clientCode}</codigoCliente>
                <lugarDestino>${data.placeDestination}</lugarDestino>
                <codigoPais>${data.codeCountry}</codigoPais>
                <codigoMetodoPago>${data.paymentMethod}</codigoMetodoPago>
                ${
                  data.cardNumber != null && data.cardNumber != ''
                    ? `<numeroTarjeta>${data.cardNumber}</numeroTarjeta>`
                    : '<numeroTarjeta xsi:nil="true"/>'
                }
                  <montoTotal>${(data.amount * data.exchangeRate).toFixed(2)}</montoTotal>
                  <montoTotalSujetoIva>${data.amountIva.toFixed(2)}</montoTotalSujetoIva>
                  <codigoMoneda>${data.coinCode}</codigoMoneda>
                  <tipoCambio>${data.exchangeRate.toFixed(5)}</tipoCambio>
                  <montoTotalMoneda>${
                    data.amount.toFixed(2)
                  }</montoTotalMoneda>
                <informacionAdicional>${
                  data.additionalInformation?data.additionalInformation:''
                }</informacionAdicional>
                ${
                  data.amountDiscount
                    ? `  <descuentoAdicional>${data.amountDiscount}</descuentoAdicional>`
                    : '<descuentoAdicional xsi:nil="true"/>'
                }
                ${
                  data.exceptionDocument
                    ? `<codigoExcepcion>${data.exceptionDocument}</codigoExcepcion>`
                    : '<codigoExcepcion xsi:nil="true"/>'
                }
                ${
                  data.cafc != null && data.cafc.length > 0
                    ? `<cafc>${data.cafc}</cafc>`
                    : '<cafc xsi:nil="true"/>'
                }
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
                      <cantidad>${item.quantity}</cantidad>
                      <unidadMedida>${item.measureCode}</unidadMedida>
                      <precioUnitario>${item.unitPrice.toFixed(5)}</precioUnitario>
                      <montoDescuento>${item.amountDiscount.toFixed(5)}</montoDescuento>
                      <subTotal>${item.subTotal.toFixed(5)}</subTotal>
                 </detalle>`;
        }).join(`
          `)}        
    </facturaElectronicaComercialExportacionServicio>
    `;
    return xml;
  }

  static facturaComputarizadaComercialExportacionServicio(
    data: EbBillDto,
    ebSucursalDto: EbSucursalDto
  ): string {
    let dateEmiite = data.dateEmitte.toISOString();
    dateEmiite = dateEmiite.replace("Z", "");

    const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <facturaComputarizadaComercialExportacionServicio xsi:noNamespaceSchemaLocation="facturaComputarizadaComercialExportacionServicio.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
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
      <numeroDocumento>${data.billDocument.trim()}</numeroDocumento>
      ${
        data.billComplement
          ? `<complemento>${data.billComplement}</complemento>`
          : '<complemento xsi:nil="true"/>'
      }
        <direccionComprador>${data.addressBuyer}</direccionComprador>
        <codigoCliente>${data.clientCode}</codigoCliente>
        <lugarDestino>${data.placeDestination}</lugarDestino>
        <codigoPais>${data.codeCountry}</codigoPais>
        <codigoMetodoPago>${data.paymentMethod}</codigoMetodoPago>
        ${
          data.cardNumber != null && data.cardNumber != ''
            ? `<numeroTarjeta>${data.cardNumber}</numeroTarjeta>`
            : '<numeroTarjeta xsi:nil="true"/>'
        }
          <montoTotal>${data.amount.toFixed(2)}</montoTotal>
          <montoTotalSujetoIva>${data.amountIva.toFixed(2)}</montoTotalSujetoIva>
          <codigoMoneda>${data.coinCode}</codigoMoneda>
          <tipoCambio>${data.exchangeRate.toFixed(5)}</tipoCambio>
          <montoTotalMoneda>${
            (data.amount / data.exchangeRate).toFixed(2)
          }</montoTotalMoneda>
        <informacionAdicional>${
          data.additionalInformation
        }</informacionAdicional>
        ${
          data.amountDiscount
            ? `  <descuentoAdicional>${data.amountDiscount}</descuentoAdicional>`
            : '<descuentoAdicional xsi:nil="true"/>'
        }
        ${
          data.exceptionDocument
            ? `<codigoExcepcion>${data.exceptionDocument}</codigoExcepcion>`
            : '<codigoExcepcion xsi:nil="true"/>'
        }
        ${
          data.cafc != null && data.cafc.length > 0
            ? `<cafc>${data.cafc}</cafc>`
            : '<cafc xsi:nil="true"/>'
        }
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
              <cantidad>${item.quantity}</cantidad>
              <unidadMedida>${item.measureCode}</unidadMedida>
              <precioUnitario>${item.unitPrice.toFixed(5)}</precioUnitario>
              <montoDescuento>${item.amountDiscount.toFixed(5)}</montoDescuento>
              <subTotal>${item.subTotal.toFixed(5)}</subTotal>
         </detalle>`;
}).join(`
  `)}   
    </facturaComputarizadaComercialExportacionServicio>    
    `;
    return xml;
  }
}
