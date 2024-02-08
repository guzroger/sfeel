import { EbSucursalDto } from "../model/dto/ebSucursal.dto";
import { EbGamblingDto } from "src/model/dto/ebGambling";
export class FacturaHotel {
  static facturaElectronicaJuegosAzar(
    data: EbGamblingDto,
    ebSucursalDto: EbSucursalDto
  ): string {
    let dateEmiite = data.dateEmiite.toISOString();
    dateEmiite = dateEmiite.replace("Z", "");

    const xml = `
    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <facturaElectronicaJuegoAzar xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                                 xsi:noNamespaceSchemaLocation="facturaElectronicaJuegoAzar.xsd">
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
            <codigoCliente>${data.clientCode}</codigoCliente>
            <codigoMetodoPago>${data.paymentMethod}</codigoMetodoPago>
            ${
              data.cardNumber
                ? `<numeroTarjeta>${data.cardNumber}</numeroTarjeta>`
                : '<numeroTarjeta xsi:nil="true"/>'
            }
            <montoTotal>${data.amount}</montoTotal>
            <montoTotalIj>${data.amountTotalIj}</montoTotalIj>
            <montoTotalSujetoIpj>${
              data.IpjSubjectTotalAmount
            }</montoTotalSujetoIpj>
            <montoTotalSujetoIva>${data.amountIva}</montoTotalSujetoIva>
            <codigoMoneda>${data.coinCode}</codigoMoneda>
            <tipoCambio>${data.exchangeRate}</tipoCambio>
            <montoTotalMoneda>${
              data.amount * data.exchangeRate
            }</montoTotalMoneda>
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
    </facturaElectronicaJuegoAzar>
    `;
    return xml;
  }

  static facturaComputarizadaJuegosAzar(
    data: EbGamblingDto,
    ebSucursalDto: EbSucursalDto
  ): string {
    let dateEmiite = data.dateEmiite.toISOString();
    dateEmiite = dateEmiite.replace("Z", "");

    const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <facturaComputarizadaJuegoAzar xsi:noNamespaceSchemaLocation="facturaComputarizadaJuegoAzar.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
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
        <codigoCliente>${data.clientCode}</codigoCliente>
        <codigoMetodoPago>${data.paymentMethod}</codigoMetodoPago>
        ${
          data.cardNumber
            ? `<numeroTarjeta>${data.cardNumber}</numeroTarjeta>`
            : '<numeroTarjeta xsi:nil="true"/>'
        }
        <montoTotal>${data.amount}</montoTotal>
        <montoTotalIj>${data.amountTotalIj}</montoTotalIj>
        <montoTotalSujetoIpj>${data.IpjSubjectTotalAmount}</montoTotalSujetoIpj>
        <montoTotalSujetoIva>${data.amountIva}</montoTotalSujetoIva>
        <codigoMoneda>${data.coinCode}</codigoMoneda>
        <tipoCambio>${data.exchangeRate}</tipoCambio>
        <montoTotalMoneda>${data.amount * data.exchangeRate}</montoTotalMoneda>
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
    </facturaComputarizadaJuegoAzar>
    `;
    return xml;
  }
}
