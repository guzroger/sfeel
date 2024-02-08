import { Injectable } from '@nestjs/common';
import { GeConstantService } from '../model/geConstant.service';
import { Parameters } from './parameters';

@Injectable()
export class ParameterService {
  

  constructor(private geConstantService:GeConstantService) {
    this.init();
  }

  async init(): Promise<void> {
    console.log('Call constructor from ParameterService');

    this.geConstantService.findById('AMBIENTE', 'APP_CONFIG').then( (data) => {
      if (data != null) {
        Parameters.ambiente = data.value;
      }
    });

    this.geConstantService.findById('CODIGO_SISTEMA', 'APP_CONFIG').then( (data) => {
      if (data != null) {
        Parameters.codigoSistema = data.value;
      }
    });

    this.geConstantService.findById('URL_QR', 'APP_CONFIG').then( (data) => {
      if (data != null) {
        Parameters.urlQr = data.value;
      }
    });
  
    this.geConstantService.findById('NOTE_ONLINE', 'APP_CONFIG').then( (data) => {
      if (data != null) {
        Parameters.noteOnLine = data.value;
      }
    });

    this.geConstantService.findById('NOTE_OFFLINE', 'APP_CONFIG').then( (data) => {
      if (data != null) {
        Parameters.noteOffLine = data.value;
      }
    });

    this.geConstantService.findById('URL_PING_SIN', 'APP_CONFIG').then( (data) => {
      if (data != null) {
        Parameters.urlPingSin = data.value;
      }
    });

    this.geConstantService.findById('URL_PING_INTERNET', 'APP_CONFIG').then( (data) => {
      if (data != null) {
        Parameters.urlPingInternet = data.value;
      }
    });
  
  }

  parseDate(txtDate: string): Date {
    const date = new Date(txtDate);
    const localOffset = new Date().getTimezoneOffset() * 60 * 1000;

    const dateLocal = new Date(date.getTime() - localOffset);

    return dateLocal;
  }

  getNow(): Date {
    const date = new Date();
    const localOffset = new Date().getTimezoneOffset() * 60 * 1000;

    const dateLocal = new Date(date.getTime() - localOffset);

    return dateLocal;
  }

  getDateInfinity():Date {
    const date = new Date('2222-12-31T23:59:59.000Z');    

    return date;
  }
  
}
