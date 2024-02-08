import { Injectable } from '@nestjs/common';
import { WsFacturacionSincronizacionService } from '../webservice/wsFacturacionSincronizacion.service';
import { EbSystemDto } from 'src/model/dto/ebSystem.dto';
import { SynDateHourService } from '../model/synDateHour.service';
import { SynDateHourDto } from 'src/model/dto/synDateHour.dto';
import { ParameterService } from '../common/parameter.service';
import { SynCatalogueDto } from 'src/model/dto/synCatalogue.dto';
import { SynCatalogueService } from '../model/synCatalogue.service';
import { Constants } from 'src/common/constants.enum';
import { SynProductServiceDto } from 'src/model/dto/synProductService.dto';
import { SynInvoiceLegendDto } from 'src/model/dto/synInvoiceLegend.dto';
import { SynActivityDto } from 'src/model/dto/synActivity.dto';
import { SynProductServiceService } from '../model/synProductService.service';
import { SynActivityService } from '../model/synActivity.service';
import { SynInvoiceLegendService } from '../model/synInvoiceLegend.service';
import { EbSystemService } from 'src/model/ebSystem.service';
import { BillingService } from './billing.service';
import { BillingCodeService } from './billingCode.service';
import { Parameters } from 'src/common/parameters';

@Injectable()
export class SynchronizationService {
  constructor(
    private wsFacturacionSincronizacionService: WsFacturacionSincronizacionService,
    private synDateHourService: SynDateHourService,
    private synCatalogueService: SynCatalogueService,
    private synProductServiceService: SynProductServiceService,
    private synActivityService: SynActivityService,
    private synInvoiceLegendService: SynInvoiceLegendService,
    private parameterService: ParameterService,
    private ebSystemService: EbSystemService,
    private billingCodeService: BillingCodeService,
  ) {}

  async sincronizarFechaHora(ebSystemDto: EbSystemDto, cuis: string, salePoint:number) {
    const sincronizarFehaHoraResponse =
      await this.wsFacturacionSincronizacionService.sincronizarFechaHora(
        ebSystemDto,
        0,
        cuis, salePoint
      );

    const dateSin = this.parameterService.parseDate(
      sincronizarFehaHoraResponse['ns2:sincronizarFechaHoraResponse']
        .RespuestaFechaHora.fechaHora,
    );

    const synDateHourDto = new SynDateHourDto();
    synDateHourDto.dateSystem = this.parameterService.getNow();
    synDateHourDto.dateSin = dateSin;
    synDateHourDto.systemCode = ebSystemDto.systemCode;
    synDateHourDto.nit = ebSystemDto.nit;

    const sisdate = await this.synDateHourService.sisdate(
      ebSystemDto.systemCode,
      ebSystemDto.nit,
    );
    

    return this.synDateHourService.create(synDateHourDto);
  }

  async sincronizarCatalogoGeneric(
    ebSystemDto: EbSystemDto,
    cuis: string,
    syncronizacionProcess: string,
    type: string,
    salePoint: number
  ) {
    const catalogo =
      await this.wsFacturacionSincronizacionService.sincronizarParametrica(
        ebSystemDto,
        0,
        cuis,
        syncronizacionProcess, salePoint
      );

    catalogo.listaCodigos.map((item) => {
      const synCatalogueDto = new SynCatalogueDto();

      synCatalogueDto.code = item.codigoClasificador;
      synCatalogueDto.type = type;
      synCatalogueDto.systemCode = ebSystemDto.systemCode;
      synCatalogueDto.nit = ebSystemDto.nit;
      synCatalogueDto.description = item.descripcion;

      this.synCatalogueService.create(synCatalogueDto);
    });
  }

  async sincronizarCatalogo(nit:number, sucursalCode:number, salePoint:number, modalityCode:number) {
    
    const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit(
      Parameters.codigoSistema,
      nit,
    );
    const ebCuisDto = await this.billingCodeService.getCuis(
      ebSystemDto,
      sucursalCode,
      salePoint,
      modalityCode,
      new Date(),
    );
    
    
    this.sincronizarFechaHora(
      ebSystemDto,
      ebCuisDto.cuis, salePoint
    );

    await this.sincronizarCatalogoGeneric(
      ebSystemDto,
      ebCuisDto.cuis,
      Constants.SincronizarEventosSignificativos,
      Constants.EventosSignificativos,
      salePoint
    );
    await this.sincronizarCatalogoGeneric(
      ebSystemDto,
      ebCuisDto.cuis,
      Constants.SincronizarListaMensajesServicios,
      Constants.MensajesServicios,
      salePoint
    );
    await this.sincronizarCatalogoGeneric(
      ebSystemDto,
      ebCuisDto.cuis,
      Constants.SincronizarParametricaMotivoAnulacion,
      Constants.MotivoAnulacion,
      salePoint
    );
    await this.sincronizarCatalogoGeneric(
      ebSystemDto,
      ebCuisDto.cuis,
      Constants.SincronizarParametricaPaisOrigen,
      Constants.PaisOrigen,
      salePoint
    );
    await this.sincronizarCatalogoGeneric(
      ebSystemDto,
      ebCuisDto.cuis,
      Constants.SincronizarParametricaTipoDocumentoIdentidad,
      Constants.TipoDocumentoIdentidad,
      salePoint
    );
    await this.sincronizarCatalogoGeneric(
      ebSystemDto,
      ebCuisDto.cuis,
      Constants.SincronizarParametricaTipoDocumentoSector,
      Constants.TipoDocumentoSector,
      salePoint
    );
    await this.sincronizarCatalogoGeneric(
      ebSystemDto,
      ebCuisDto.cuis,
      Constants.SincronizarParametricaTipoHabitacion,
      Constants.TipoHabitacion,
      salePoint
    );
    await this.sincronizarCatalogoGeneric(
      ebSystemDto,
      ebCuisDto.cuis,
      Constants.SincronizarParametricaTipoMetodoPago,
      Constants.TipoMetodoPago,
      salePoint
    );
    await this.sincronizarCatalogoGeneric(
      ebSystemDto,
      ebCuisDto.cuis,
      Constants.SincronizarParametricaTipoMoneda,
      Constants.TipoMoneda,
      salePoint
    );
    await this.sincronizarCatalogoGeneric(
      ebSystemDto,
      ebCuisDto.cuis,
      Constants.SincronizarParametricaTipoPuntoVenta,
      Constants.TipoPuntoVenta,
      salePoint
    );
    await this.sincronizarCatalogoGeneric(
      ebSystemDto,
      ebCuisDto.cuis,
      Constants.SincronizarParametricaTiposFactura,
      Constants.TiposFactura,
      salePoint
    );
    await this.sincronizarCatalogoGeneric(
      ebSystemDto,
      ebCuisDto.cuis,
      Constants.SincronizarParametricaUnidadMedida,
      Constants.UnidadMedida,
      salePoint
    );

    await this.sincronizarCatalogoGeneric(
      ebSystemDto,
      ebCuisDto.cuis,
      Constants.SincronizarParametricaTipoEmision,
      Constants.UnidadMedida,
      salePoint
    );

    const listProductos =
      await this.wsFacturacionSincronizacionService.sincronizarListaProductosServicios(
        ebSystemDto,
        0,
        ebCuisDto.cuis, salePoint
      );

    listProductos[
      'ns2:sincronizarListaProductosServiciosResponse'
    ].RespuestaListaProductos.listaCodigos.map((item) => {
      const synProductServiceDto = new SynProductServiceDto();

      synProductServiceDto.productCode = item.codigoProducto;
      synProductServiceDto.systemCode = ebSystemDto.systemCode;
      synProductServiceDto.activityCode = item.codigoActividad;
      synProductServiceDto.nit = ebSystemDto.nit;
      synProductServiceDto.description = item.descripcionProducto;
      //synProductServiceDto.nandina = item.nandina;

      this.synProductServiceService.create(synProductServiceDto);
    });

    const listaLeyenda =
      await this.wsFacturacionSincronizacionService.sincronizarListaLeyendasFactura(
        ebSystemDto,
        0,
        ebCuisDto.cuis, salePoint
      );

    listaLeyenda[
      'ns2:sincronizarListaLeyendasFacturaResponse'
    ].RespuestaListaParametricasLeyendas.listaLeyendas.map((item) => {
      const synInvoiceLegendDto = new SynInvoiceLegendDto();

      synInvoiceLegendDto.activityCode = item.codigoActividad;
      synInvoiceLegendDto.description = item.descripcionLeyenda;
      synInvoiceLegendDto.systemCode = ebSystemDto.systemCode;
      synInvoiceLegendDto.nit = ebSystemDto.nit;

      this.synInvoiceLegendService.create(synInvoiceLegendDto);
    });
    const listActividadesSector =
      await this.wsFacturacionSincronizacionService.sincronizarListaActividadesDocumentoSector(
        ebSystemDto,
        0,
        ebCuisDto.cuis, salePoint
      );
    listActividadesSector[
      'ns2:sincronizarListaActividadesDocumentoSectorResponse'
    ].RespuestaListaActividadesDocumentoSector.listaActividadesDocumentoSector.map(
      (item) => {
        const synActivityDto = new SynActivityDto();

        synActivityDto.activityCode = item.codigoActividad;
        synActivityDto.activityType = Constants.ActivitiesDocumentSector;
        synActivityDto.systemCode = ebSystemDto.systemCode;
        synActivityDto.nit = ebSystemDto.nit;
        synActivityDto.description = item.tipoDocumentoSector;
        synActivityDto.sectorDocumentCode = item.tipoDocumentoSector;

        this.synActivityService.create(synActivityDto);
      },
    );

    const listActividades =
      await this.wsFacturacionSincronizacionService.sincronizarActividades(
        ebSystemDto,
        0,
        ebCuisDto.cuis, salePoint
      );

    listActividades[
      'ns2:sincronizarActividadesResponse'
    ].RespuestaListaActividades.listaActividades.map((item) => {
      const synActivityDto = new SynActivityDto();

      synActivityDto.activityCode = item.codigoCaeb;
      synActivityDto.activityType = item.tipoActividad;
      synActivityDto.systemCode = ebSystemDto.systemCode;
      synActivityDto.nit = ebSystemDto.nit;
      synActivityDto.description = item.descripcion;
      synActivityDto.sectorDocumentCode = '0';

      this.synActivityService.create(synActivityDto);
    });

    return { "statusCode": 200, "statusDescription": "OK" };

    //return sincronizarCatalogo;
  }
}
