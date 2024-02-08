import { EbSucursalDto } from "../model/dto/ebSucursal.dto";
import { EbCommercialExportDto } from "src/model/dto/ebComertialExport.dto";
export class FacturaCommercialExport {
  static facturaElectronicaComercialExportacion(
    data: EbCommercialExportDto,
    ebSucursalDto: EbSucursalDto
  ): string {
    let dateEmiite = data.dateEmiite.toISOString();
    dateEmiite = dateEmiite.replace("Z", "");

    const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <facturaElectronicaComercialExportacion xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                                            xsi:noNamespaceSchemaLocation="facturaElectronicaComercialExportacion.xsd">
        <cabecera>
            <nitEmisor>${data.nitEmitter}</nitEmisor>
            <razonSocialEmisor>${data.billNameEmitter}</razonSocialEmisor>
            <municipio>${ebSucursalDto.municipality}</municipio>
            <telefono>${ebSucursalDto.phone}</telefono>
            <numeroFactura>${data.billNumber}</numeroFactura>
            <cuf>${data.cuf}</cuf>
            <cufd>${data.cufd}</cufd>
            <codigoSucursal>${data.sucursalCode}</codigoSucursal>
            <direccion>${data.address}</direccion>
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
              ${
                data.billComplement
                  ? `<complemento>${data.billComplement}</complemento>`
                  : '<complemento xsi:nil="true"/>'
              }
            <direccionComprador>${data.addressBuyer}</direccionComprador>
            <codigoCliente>${data.clientCode}</codigoCliente>
            <incoterm>${data.incoterm}</incoterm>
            <incotermDetalle>${data.incotermDetail}</incotermDetalle>
            <puertoDestino>${data.destinationPort}</puertoDestino>
            <lugarDestino>${data.destinationPlace}</lugarDestino>
            <codigoPais>${data.countrycode}</codigoPais>
            <codigoMetodoPago>${data.paymentMethod}</codigoMetodoPago>
            ${
              data.cardNumber
                ? `<numeroTarjeta>${data.cardNumber}</numeroTarjeta>`
                : '<numeroTarjeta xsi:nil="true"/>'
            }
              <montoTotal>${data.amount}</montoTotal>
            <costosGastosNacionales>${
              data.nationalExpensesCosts
            }</costosGastosNacionales>
            <totalGastosNacionalesFob>${
              data.totalNationalExpensesFob
            }</totalGastosNacionalesFob>
            <costosGastosInternacionales>${
              data.costsInternationalExpenses
            }</costosGastosInternacionales>
            <totalGastosInternacionales>${
              data.totalInternationalExpenses
            }</totalGastosInternacionales>
            <montoDetalle>${data.amountDetail}</montoDetalle>
            <montoTotalSujetoIva>${data.amountIva}</montoTotalSujetoIva>
            <codigoMoneda>${data.coinCode}</codigoMoneda>
            <tipoCambio>${data.exchangeRate}</tipoCambio>
            <montoTotalMoneda>${
              data.amount / data.exchangeRate
            }</montoTotalMoneda>

            <numeroDescripcionPaquetesBultos>${
              data.numberPackageDescriptionPackages
            }</numeroDescripcionPaquetesBultos>
            <informacionAdicional>${
              data.additionalinformation
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
                        <precioUnitario>${item.unitPrice}</precioUnitario>
                        <montoDescuento>${item.amountDiscount}</montoDescuento>
                        <subTotal>${item.subtotal}</subTotal>           
                  </detalle>`;
        }).join(`
        `)}        
    </facturaElectronicaComercialExportacion>
    `;
    return xml;
  }

  static facturaComputarizadaComercialExportacion(
    data: EbCommercialExportDto,
    ebSucursalDto: EbSucursalDto
  ): string {
    let dateEmiite = data.dateEmiite.toISOString();
    dateEmiite = dateEmiite.replace("Z", "");

    const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <facturaElectronicaComercialExportacion xsi:noNamespaceSchemaLocation="facturaComputarizadaAlquilerBienInmueble.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <cabecera>
        <nitEmisor>${data.nitEmitter}</nitEmisor>
        <razonSocialEmisor>${data.billNameEmitter}</razonSocialEmisor>
        <municipio>${ebSucursalDto.municipality}</municipio>
        <telefono>${ebSucursalDto.phone}</telefono>
        <numeroFactura>${data.billNumber}</numeroFactura>
        <cuf>${data.cuf}</cuf>
        <cufd>${data.cufd}</cufd>
        <codigoSucursal>${data.sucursalCode}</codigoSucursal>
        <direccion>${data.address}</direccion>
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
          ${
            data.billComplement
              ? `<complemento>${data.billComplement}</complemento>`
              : '<complemento xsi:nil="true"/>'
          }
        <direccionComprador>${data.addressBuyer}</direccionComprador>
        <codigoCliente>${data.clientCode}</codigoCliente>
        <incoterm>${data.incoterm}</incoterm>
        <incotermDetalle>${data.incotermDetail}</incotermDetalle>
        <puertoDestino>${data.destinationPort}</puertoDestino>
        <lugarDestino>${data.destinationPlace}</lugarDestino>
        <codigoPais>${data.countrycode}</codigoPais>
        <codigoMetodoPago>${data.paymentMethod}</codigoMetodoPago>
        ${
          data.cardNumber
            ? `<numeroTarjeta>${data.cardNumber}</numeroTarjeta>`
            : '<numeroTarjeta xsi:nil="true"/>'
        }
          <montoTotal>${data.amount}</montoTotal>
        <costosGastosNacionales>${
          data.nationalExpensesCosts
        }</costosGastosNacionales>
        <totalGastosNacionalesFob>${
          data.totalNationalExpensesFob
        }</totalGastosNacionalesFob>
        <costosGastosInternacionales>${
          data.costsInternationalExpenses
        }</costosGastosInternacionales>
        <totalGastosInternacionales>${
          data.totalInternationalExpenses
        }</totalGastosInternacionales>
        <montoDetalle>${data.amountDetail}</montoDetalle>
        <montoTotalSujetoIva>${data.amountIva}</montoTotalSujetoIva>
        <codigoMoneda>${data.coinCode}</codigoMoneda>
        <tipoCambio>${data.exchangeRate}</tipoCambio>
        <montoTotalMoneda>${data.amount / data.exchangeRate}</montoTotalMoneda>

        <numeroDescripcionPaquetesBultos>${
          data.numberPackageDescriptionPackages
        }</numeroDescripcionPaquetesBultos>
        <informacionAdicional>${
          data.additionalinformation
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
                    <precioUnitario>${item.unitPrice}</precioUnitario>
                    <montoDescuento>${item.amountDiscount}</montoDescuento>
                    <subTotal>${item.subtotal}</subTotal>           
              </detalle>`;
    }).join(`
    `)}
    </facturaElectronicaComercialExportacion>`;
    return xml;
  }
}
