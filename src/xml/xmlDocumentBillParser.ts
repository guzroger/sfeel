import { EbBillDto } from "src/model/dto/ebBill.dto";
import { FacturaCompraVenta } from "./facturaCompraVenta";
import { EbSucursalDto } from "src/model/dto/ebSucursal.dto";
import { FacturaAlquilerBienInmueble } from "./facturaAlquilerBienInmueble";
import { FacturaPrevalorada } from "./facturaPrevalorada";
import { FacturaPrevaloradaSDCF } from "./facturaPrevaloradaSDCF";
import { FacturaExportacionServicio } from "./facturaComercialExportacionServicio";
import { NotaDebitoCredito } from "./notaDebitoCredito";
import { NotaDebitoCreditoDescuento } from "./notaDebitoCreditoDescuento";

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


}