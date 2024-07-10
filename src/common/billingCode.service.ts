import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EbCuisDto } from '../model/dto/ebCuis.dto';
import { WsFacturacionCodigosService } from 'src/webservice/wsFacturacionCodigos.service';
import { EbCuisService } from '../model/ebCuis.service';
import { EbCufdDto } from 'src/model/dto/ebCufd.dto';
import { EbCufdService } from '../model/ebCufd.service';
import { EbSystemService } from '../model/ebSystem.service';
import { EbSystemDto } from 'src/model/dto/ebSystem.dto';
import { ParameterService } from './parameter.service';

@Injectable()
export class BillingCodeService {
  constructor(
    private wsFacturacionCodigosService: WsFacturacionCodigosService,
    private ebCuisService: EbCuisService,
    private ebCufdService: EbCufdService,
    private ebSystemService: EbSystemService,
    private parameterService: ParameterService,
  ) {}

  async verificarComunicacion(ebSystemDto: EbSystemDto): Promise<boolean> {
    const verificarComunicaion =
      await this.wsFacturacionCodigosService.verificarComunicacion(ebSystemDto);

    if (
      verificarComunicaion['ns2:verificarComunicacionResponse']
        .RespuestaComunicacion.mensajesList.codigo == '926'
    )
      return true;
    else return false;
  }

  async getCuisFromSIN(
    ebSystemDto: EbSystemDto,
    codigoSucursal: number,
    codigoPuntoVenta: number,
    codigoModalidad: number,
  ): Promise<EbCuisDto> {
    const verificarComunicaion = await this.verificarComunicacion(ebSystemDto);

    if (!verificarComunicaion) {
      throw new Error('Error Conexión');
    }

    //Get the cuis from SIN
    const cuisResponse = await this.wsFacturacionCodigosService.cuis(
      ebSystemDto,
      codigoSucursal,
      codigoPuntoVenta,
      codigoModalidad,
    );
    let ebCuisDto = new EbCuisDto();

    const expirationAt = this.parameterService.parseDate(
      cuisResponse['ns2:cuisResponse'].RespuestaCuis.fechaVigencia,
    );

    ebCuisDto.cuis = cuisResponse['ns2:cuisResponse'].RespuestaCuis.codigo;
    ebCuisDto.expirationAt = expirationAt;
    ebCuisDto.systemCode = ebSystemDto.systemCode;
    ebCuisDto.nit = ebSystemDto.nit;
    ebCuisDto.sucursalCode = codigoSucursal;
    ebCuisDto.salePointCode = codigoPuntoVenta;

    ebCuisDto = await this.ebCuisService.create(ebCuisDto);

    return ebCuisDto;
  }
  
  async getCuis( ebSystemDto: EbSystemDto,  codigoSucursal: number,  codigoPuntoVenta: number, codigoModalidad: number,  outputDate: Date, ): Promise<EbCuisDto> {
    const ebCuisDto = await this.ebCuisService.findByExpirationDate(ebSystemDto, codigoSucursal,codigoPuntoVenta,  outputDate);
    
    if (ebCuisDto != null) return ebCuisDto;
    else
      return await this.getCuisFromSIN(
        ebSystemDto,
        codigoSucursal,
        codigoPuntoVenta,
        codigoModalidad,
      );
  }

  async getCufdFromSIN(
    ebSystemDto: EbSystemDto,
    codigoSucursal: number,
    codigoPuntoVenta: number,
    codigoModalidad: number,
    cuis: string,
  ): Promise<EbCufdDto> {
    const verificarComunicaion = await this.verificarComunicacion(ebSystemDto);

    if (!verificarComunicaion) {
      throw new Error('Error Conexión');
    }
    const cufdResponse = await this.wsFacturacionCodigosService.cufd(
      ebSystemDto,
      codigoSucursal,
      codigoPuntoVenta,
      codigoModalidad,
      cuis,
    );
    let ebCufdDto = new EbCufdDto();

    if (cufdResponse['ns2:cufdResponse'].RespuestaCufd.codigo != null) {
      const expirationAt = this.parameterService.parseDate(
        cufdResponse['ns2:cufdResponse'].RespuestaCufd.fechaVigencia,
      );

      ebCufdDto.cufd = cufdResponse['ns2:cufdResponse'].RespuestaCufd.codigo;
      ebCufdDto.expirationAt = expirationAt;
      ebCufdDto.systemCode = ebSystemDto.systemCode;
      ebCufdDto.nit = ebSystemDto.nit;
      ebCufdDto.sucursalCode = codigoSucursal;
      ebCufdDto.salePointCode = codigoPuntoVenta;
      ebCufdDto.controlCode =
        cufdResponse['ns2:cufdResponse'].RespuestaCufd.codigoControl;

      ebCufdDto = await this.ebCufdService.create(ebCufdDto);

      return ebCufdDto;
    } else {
      if (
        Array.isArray(
          cufdResponse['ns2:cufdResponse'].RespuestaCufd.mensajesList,
        )
      ) {
        let message = ""
        cufdResponse['ns2:cufdResponse'].RespuestaCufd.mensajesList.map(
          (item) => {
            message = message + item.codigo + ' - ' + item.descripcion + ", ";
          },
        );
        throw new HttpException(message, HttpStatus.CONFLICT);
      } else {
        
        throw new HttpException(cufdResponse['ns2:cufdResponse'].RespuestaCufd.mensajesList.codigo + ' - ' + cufdResponse['ns2:cufdResponse'].RespuestaCufd.mensajesList.descripcion, HttpStatus.CONFLICT);
      }

    }
  }
  async getCufdById(cufd:string):Promise<EbCufdDto> {
    return await this.ebCufdService.findByCufd(cufd);
  }
  async getCufd(
    ebSystemDto: EbSystemDto,
    codigoSucursal: number,
    codigoPuntoVenta: number,
    codigoModalidad: number,
    outputDate: Date,
    cuis: string,
    force:boolean = false,
  ): Promise<EbCufdDto> {
    
    if(!force){
      const ebCufdDto = await this.ebCufdService.findByExpirationDate(ebSystemDto, codigoSucursal,codigoPuntoVenta,  outputDate);

      if (ebCufdDto != null) return ebCufdDto;
    }
    return this.getCufdFromSIN(
      ebSystemDto,
      codigoSucursal,
      codigoPuntoVenta,
      codigoModalidad,
      cuis,
    );
  }

  async verificarNit(
    ebSystemDto,
    codigoSucursal: number,
    codigoModalidad: number,
    cuis: string,
    nitVerificar: string,
  ): Promise<boolean> {
    const verificarNitResponse = await this.wsFacturacionCodigosService.verificarNit(ebSystemDto, codigoSucursal, codigoModalidad,cuis,nitVerificar);
    console.log(verificarNitResponse);
    if (verificarNitResponse['ns2:verificarNitResponse'].RespuestaVerificarNit.mensajesList.codigo === '986')
      return true;
    return false;
  }
}
