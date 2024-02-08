import { EbHotelDto } from "src/model/dto/ebHotel.dto";
import { EbSucursalDto } from "../model/dto/ebSucursal.dto";
import { EbCommercialServiceExportDto } from "src/model/dto/ebCommercialServiceExport.dto";
export class FacturaHotel {
  static facturaElectronicaHotel(
    data: EbHotelDto,
    ebSucursalDto: EbSucursalDto
  ): string {
    let dateEmiite = data.dateEmiite.toISOString();
    dateEmiite = dateEmiite.replace("Z", "");

    const xml = `
    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <facturaElectronicaHotel xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                             xsi:noNamespaceSchemaLocation="facturaElectronicaHotel.xsd">
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
            <cantidadHuespedes>${data.quantityGuests}</cantidadHuespedes>
            <cantidadHabitaciones>${data.quantityRooms}</cantidadHabitaciones>
            <cantidadMayores>${data.quantityMajors}</cantidadMayores>
            <cantidadMenores>${data.quantityMinors}</cantidadMenores>
            <fechaIngresoHospedaje>${
              data.AccommodationEntryDate
            }</fechaIngresoHospedaje>
            <codigoMetodoPago>${data.paymentMethod}</codigoMetodoPago>
                ${
                  data.cardNumber
                    ? `<numeroTarjeta>${data.cardNumber}</numeroTarjeta>`
                    : '<numeroTarjeta xsi:nil="true"/>'
                }
                  <montoTotal>${data.amount}</montoTotal>
                  <montoTotalSujetoIva>${data.amountIva}</montoTotalSujetoIva>
                  <codigoMoneda>${data.coinCode}</codigoMoneda>
                  <tipoCambio>${data.exchangeRate}</tipoCambio>
                  <montoTotalMoneda>${
                    data.amount * data.exchangeRate
                  }</montoTotalMoneda>
            ${
              data.amountGifCard
                ? `<montoGiftCard>${data.amountGifCard}</montoGiftCard>`
                : '<montoGiftCard xsi:nil="true"/>'
            }
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
                        <actividadEconomica>${
                          item.economicActivity
                        }</actividadEconomica>
                        <codigoProductoSin>${
                          item.productCodeSin
                        }</codigoProductoSin>
                        <codigoProducto>${item.productCode}</codigoProducto>
                        <codigoTipoHabitacion>${
                          item.codeTypeRoom
                        }</codigoTipoHabitacion>
                        <descripcion>${item.description}</descripcion>
                        <cantidad>${item.quantity}</cantidad>
                        <unidadMedida>${item.measureCode}</unidadMedida>
                        <precioUnitario>${item.unitPrice}</precioUnitario>
                        <montoDescuento>${item.amountDiscount}</montoDescuento>
                        <subTotal>${item.subtotal}</subTotal>

                        ${
                          item.detailGuests
                            ? `<detalleHuespedes>${item.detailGuests}</detalleHuespedes>`
                            : '<detalleHuespedes xsi:nil="true"/>'
                        }
                   </detalle>`;
        }).join(`
            `)}        
    </facturaElectronicaHotel>
    `;
    return xml;
  }

  static facturaComputarizadaHotel(
    data: EbHotelDto,
    ebSucursalDto: EbSucursalDto
  ): string {
    let dateEmiite = data.dateEmiite.toISOString();
    dateEmiite = dateEmiite.replace("Z", "");

    const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <facturaComputarizadaHotel xsi:noNamespaceSchemaLocation="facturaComputarizadaHotel.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
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
            <codigoCliente>51158891</codigoCliente>
            <cantidadHuespedes>${data.quantityGuests}</cantidadHuespedes>
            <cantidadHabitaciones>${data.quantityRooms}</cantidadHabitaciones>
            <cantidadMayores>${data.quantityMajors}</cantidadMayores>
            <cantidadMenores>${data.quantityMinors}</cantidadMenores>
            <fechaIngresoHospedaje>${
              data.AccommodationEntryDate
            }</fechaIngresoHospedaje>
            <codigoMetodoPago>${data.paymentMethod}</codigoMetodoPago>
                ${
                  data.cardNumber
                    ? `<numeroTarjeta>${data.cardNumber}</numeroTarjeta>`
                    : '<numeroTarjeta xsi:nil="true"/>'
                }
                <montoTotal>${data.amount}</montoTotal>
                <montoTotalSujetoIva>${data.amountIva}</montoTotalSujetoIva>
                <codigoMoneda>${data.coinCode}</codigoMoneda>
                <tipoCambio>${data.exchangeRate}</tipoCambio>
                <montoTotalMoneda>${
                  data.amount * data.exchangeRate
                }</montoTotalMoneda>
            ${
              data.amountGifCard
                ? `<montoGiftCard>${data.amountGifCard}</montoGiftCard>`
                : '<montoGiftCard xsi:nil="true"/>'
            }
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
                        <actividadEconomica>${
                          item.economicActivity
                        }</actividadEconomica>
                        <codigoProductoSin>${
                          item.productCodeSin
                        }</codigoProductoSin>
                        <codigoProducto>${item.productCode}</codigoProducto>
                        <codigoTipoHabitacion>${
                          item.codeTypeRoom
                        }</codigoTipoHabitacion>
                        <descripcion>${item.description}</descripcion>
                        <cantidad>${item.quantity}</cantidad>
                        <unidadMedida>${item.measureCode}</unidadMedida>
                        <precioUnitario>${item.unitPrice}</precioUnitario>
                        <montoDescuento>${item.amountDiscount}</montoDescuento>
                        <subTotal>${item.subtotal}</subTotal>

                        ${
                          item.detailGuests
                            ? `<detalleHuespedes>${item.detailGuests}</detalleHuespedes>`
                            : '<detalleHuespedes xsi:nil="true"/>'
                        }
                </detalle>`;
        }).join(`
            `)}        
    </facturaComputarizadaHotel> 
    `;
    return xml;
  }
}
