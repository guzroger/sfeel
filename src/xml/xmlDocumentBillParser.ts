import { EbBillDto } from "src/model/dto/ebBill.dto";
import { FacturaCompraVenta } from "./facturaCompraVenta";
import { EbSucursalDto } from "src/model/dto/ebSucursal.dto";
import { FacturaAlquilerBienInmueble } from "./facturaAlquilerBienInmueble";
import { FacturaPrevalorada } from "./facturaPrevalorada";
import { FacturaPrevaloradaSDCF } from "./facturaPrevaloradaSDCF";
import { FacturaExportacionServicio } from "./facturaComercialExportacionServicio";
import { NotaDebitoCredito } from "./notaDebitoCredito";
import { NotaDebitoCreditoDescuento } from "./notaDebitoCreditoDescuento";
import { FacturaServiciosBasicos } from "./facturaServiciosBasicos";
import { FacturaSectorEducativo } from "./facturaSectorEducativo";

export class XmlDocumentBillParser {
    static facturaElectronicaCompraVenta(ebBillDto: EbBillDto, ebSucursalDto:EbSucursalDto):string{
        return FacturaCompraVenta.facturaElectronicaCompraVenta(ebBillDto, ebSucursalDto);
    }

    static facturaComputarizadaCompraVenta(ebBillDto: EbBillDto, ebSucursalDto:EbSucursalDto):string{
        return FacturaCompraVenta.facturaComputarizadaCompraVenta(ebBillDto, ebSucursalDto);
    }

    static facturaElectronicaAlquilerBienInmueble(ebBillDto: EbBillDto, ebSucursalDto:EbSucursalDto):string{
        return FacturaAlquilerBienInmueble.facturaElectronicaAlquilerBienInmueble(ebBillDto, ebSucursalDto);
    }

    static facturaComputarizadaAlquilerBienInmueble(ebBillDto: EbBillDto, ebSucursalDto:EbSucursalDto):string{
        return FacturaAlquilerBienInmueble.facturaComputarizadaAlquilerBienInmueble(ebBillDto, ebSucursalDto);
    }

    static facturaElectronicaComercialExportacionServicio(ebBillDto: EbBillDto, ebSucursalDto:EbSucursalDto):string{
        return FacturaExportacionServicio.facturaElectronicaComercialExportacionServicio(ebBillDto, ebSucursalDto);
    }

    static facturaComputarizadaComercialExportacionServicio(ebBillDto: EbBillDto, ebSucursalDto:EbSucursalDto):string{
        return FacturaExportacionServicio.facturaComputarizadaComercialExportacionServicio(ebBillDto, ebSucursalDto);
    }


    static facturaElectronicaPrevalorada(ebBillDto: EbBillDto, ebSucursalDto:EbSucursalDto):string{
        return   FacturaPrevalorada.facturaElectronicaPrevalorada(ebBillDto, ebSucursalDto);
    }

    static facturaComputarizadaPrevalorada(ebBillDto: EbBillDto, ebSucursalDto:EbSucursalDto):string{
        return FacturaPrevalorada.facturaComputarizadaPrevalorada(ebBillDto, ebSucursalDto);
    }


    static facturaElectronicaPrevaloradaSDCF(ebBillDto: EbBillDto, ebSucursalDto:EbSucursalDto):string{
        return   FacturaPrevaloradaSDCF.facturaElectronicaPrevaloradaSDCF(ebBillDto, ebSucursalDto);
    }

    static facturaComputarizadaPrevaloradaSDCF(ebBillDto: EbBillDto, ebSucursalDto:EbSucursalDto):string{
        return FacturaPrevaloradaSDCF.facturaComputarizadaPrevaloradaSDCF(ebBillDto, ebSucursalDto);
    }

    static notaElectronicaDebitoCredito(ebBillDto: EbBillDto, ebSucursalDto:EbSucursalDto):string{
        return   NotaDebitoCredito.notaDebitoCreditoElectronica(ebBillDto, ebSucursalDto);
    }

    static notaComputarizadaDebitoCredito(ebBillDto: EbBillDto, ebSucursalDto:EbSucursalDto):string{
        return NotaDebitoCredito.notaDebitoCreditoComputarizada(ebBillDto, ebSucursalDto);
    }

    static notaElectronicaDebitoCreditoDescuento(ebBillDto: EbBillDto, ebSucursalDto:EbSucursalDto):string{
        return   NotaDebitoCreditoDescuento.notaDebitoCreditoElectronica(ebBillDto, ebSucursalDto);
    }

    static notaComputarizadaDebitoCreditoDescuento(ebBillDto: EbBillDto, ebSucursalDto:EbSucursalDto):string{
        return NotaDebitoCreditoDescuento.notaDebitoCreditoComputarizada(ebBillDto, ebSucursalDto);
    }

    static facturaElectronicaEducacion(ebBillDto: EbBillDto, ebSucursalDto:EbSucursalDto):string{
        return FacturaSectorEducativo.facturaElectronicaEducacion(ebBillDto, ebSucursalDto);
    }

    static facturaComputarizadaEducacion(ebBillDto: EbBillDto, ebSucursalDto:EbSucursalDto):string{
        return FacturaSectorEducativo.facturaComputarizadaEducacion(ebBillDto, ebSucursalDto);
    }

    static facturaElectronicaServiciosBasicos(ebBillDto: EbBillDto, ebSucursalDto:EbSucursalDto):string{
        
        ebBillDto = this.fixedEbBillDto(ebBillDto);
        return FacturaServiciosBasicos.facturaElectronicaServiciosBasicos(ebBillDto, ebSucursalDto);
    }

    static facturaComputarizadaServiciosBasicos(ebBillDto: EbBillDto, ebSucursalDto:EbSucursalDto):string{
        ebBillDto = this.fixedEbBillDto(ebBillDto);
        return FacturaServiciosBasicos.facturaComputarizadaServiciosBasicos(ebBillDto, ebSucursalDto);
    }

    private static fixedEbBillDto(ebBillDto: EbBillDto){
        const ebBillDetail = Array();
        let ajusteNoSujetoIva = 0;
        let detalleAjusteNoSujetoIva = "";
        let ajusteSujetoIva = 0;
        let detalleAjusteSujetoIva = "";
        let otrosPagosNoSujetoIva = 0;
        let detlleOtrosPagosNoSujetoIva = "";
        ebBillDto.details.forEach((item) => {
            if((item.taxable || item.taxable === 'Y') && !item.typeDetail){
                ebBillDetail.push(item);
            }
            else if(item.typeDetail === 'AJUSTE_NO_SUJETO_IVA') {
                ajusteNoSujetoIva = ajusteNoSujetoIva + item.subTotal;
                if(detalleAjusteNoSujetoIva.length>0)
                    detalleAjusteNoSujetoIva= detalleAjusteNoSujetoIva + ',';
                detalleAjusteNoSujetoIva = detalleAjusteNoSujetoIva + '"' + item.description + '":' + item.subTotal;
            }
            else if(item.typeDetail === 'AJUSTE_SUJETO_IVA') {
                ajusteSujetoIva = ajusteSujetoIva + item.subTotal;
                if(detalleAjusteSujetoIva.length>0)
                    detalleAjusteSujetoIva= detalleAjusteSujetoIva + ',';
                detalleAjusteSujetoIva = detalleAjusteSujetoIva + '"' + item.description + '":' + item.subTotal;
            }
            else if(item.typeDetail === 'OTROS_PAGOS_NO_SUJETO_IVA') {
                otrosPagosNoSujetoIva = otrosPagosNoSujetoIva + item.subTotal;
                if(detlleOtrosPagosNoSujetoIva.length>0)
                    detlleOtrosPagosNoSujetoIva= detlleOtrosPagosNoSujetoIva + ',';
                detlleOtrosPagosNoSujetoIva = detlleOtrosPagosNoSujetoIva + '"' + item.description + '":' + item.subTotal;
            }
        });
        ebBillDto.details = ebBillDetail;
        ebBillDto.ajusteNoSujetoIva = ajusteNoSujetoIva;
        if(detalleAjusteNoSujetoIva.length>0)
            ebBillDto.detalleAjusteNoSujetoIva = '{' + detalleAjusteNoSujetoIva + '}';
        ebBillDto.ajusteSujetoIva = ajusteSujetoIva;
        if(detalleAjusteSujetoIva.length>0)
            ebBillDto.detalleAjusteSujetoIva = '{' + detalleAjusteSujetoIva + '}';
        ebBillDto.otrosPagosNoSujetoIva = otrosPagosNoSujetoIva;
        if(detlleOtrosPagosNoSujetoIva.length>0)
            ebBillDto.detlleOtrosPagosNoSujetoIva = '{' + detlleOtrosPagosNoSujetoIva + '}';

        return ebBillDto;
    }

}