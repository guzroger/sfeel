import { BadGatewayException, ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { response } from 'express';
import { SoapException } from 'src/utils/exception/soapException.exception';
import { parseString } from 'xml2js';

@Injectable()
export class SoapRequestService {
  constructor() {}

  async callServiceSoap<T>(
    url: string,
    xml: string,
    token: string,
  ): Promise<T> {
    return await new Promise((resolve, reject) => {
      axios.post<T>(url, xml, {
          headers: {
            'Content-Type': 'text/xml',
            SOAPAction: '',
            apiKey: 'TokenApi ' + token,
          },
        })
        .then((response) => {
          parseString(
            response.data,
            { explicitArray: false },
            function (err, results) {
              const data = JSON.stringify(results);
              const jsonData = JSON.parse(data);
              //we set data of soap.
              jsonData['soap:Envelope']['soap:Body']['soapResponse'] = response.data
              jsonData['soap:Envelope']['soap:Body']['soapRequest'] = xml
              resolve(jsonData['soap:Envelope']['soap:Body']);
            },
          );
        })
        .catch((err) => {
          if(err.response)
          {
            parseString(
              err.response.data,
              { explicitArray: false },
              function (err, results) {
                if(typeof results !== 'undefined'){
                  const data = JSON.stringify(results);
                  const jsonData = JSON.parse(data);
                  
                  jsonData['soapResponse'] = results;
                  jsonData['soapRequest'] = xml;
                  resolve(jsonData);
                }
                else{
                  reject( new HttpException("SoapException: " + err, 502));
                }
                
                
              },
            );
          }
          else
          {
            if(err.cause && err.cause.code==='ENOTFOUND')
            {
              reject( new HttpException("SoapException: " + err.cause.code, 502));
            }

          }
          
        });
    });
  }

  async callService<T>(url: string, xml: string, token: string): Promise<T> {
      const resp: T = await this.callServiceSoap<T>(url, xml, token);

      if (!resp['soap:Envelope']) return resp;

      if (resp['soap:Envelope']['soap:Body']['soap:Fault']){
        /*throw new SoapException(
          resp['soap:Envelope']['soap:Body']['soap:Fault']['faultstring'],
          HttpStatus.CONFLICT,
        );*/
        throw new ConflictException("SoapException: " + resp['soap:Envelope']['soap:Body']['soap:Fault']['faultstring']);
      }

      return resp;
  }
}
