import { Injectable } from "@nestjs/common";
import { EbBillDto } from "src/model/dto/ebBill.dto";
import { EbSucursalDto } from "src/model/dto/ebSucursal.dto";
import { EbSystemDto } from "src/model/dto/ebSystem.dto";
import puppeteer from "puppeteer";
import { TemplatePdf } from './template/template-pdf.interface';
import { TemplatePdfBill } from "src/common/template/template-pdf-bill";
import { TemplatePdfNote } from "src/common/template/template-pdf-note";
import * as qrcode from 'qrcode';
import { XmlDocumentBillParser } from "src/xml/xmlDocumentBillParser";
import { TemplatePdfBillService } from "src/common/template/tempate-pdf-bill-service";

import { SynCatalogueService } from "src/model/synCatalogue.service";
import { ParameterService } from "src/common/parameter.service";
import { Parameters } from "src/common/tools/parameters";
import { SynCatalogueDto } from "src/model/dto/synCatalogue.dto";
import { Constants } from "src/common/enum/constants.enum";

@Injectable()
export class DocumentBillService {
  
    
    constructor(private synCatalogueService: SynCatalogueService){}

    async getBillPdf(ebBillDto:EbBillDto, ebSystemDto:EbSystemDto, ebSucursalDto: EbSucursalDto, type:string){
        
        let templatePdf:TemplatePdf = null;
        
        
        if(ebBillDto.documentTaxCode===1 || ebBillDto.documentTaxCode===2)
        {
            XmlDocumentBillParser.fixedEbBillDto(ebBillDto);
            if(ebBillDto.sectorDocumentCode==='28')
            {
                templatePdf = new TemplatePdfBillService();

                const synCatalogueDto = new SynCatalogueDto();
                synCatalogueDto.code = ebBillDto.coinCode;
                synCatalogueDto.systemCode = Parameters.codigoSistema;
                synCatalogueDto.type = Constants.TipoMoneda;
                synCatalogueDto.nit = ebBillDto.nitEmitter;

                const catalogue =  await this.synCatalogueService.findById(synCatalogueDto );
                if(catalogue)
                    ebBillDto.coin = catalogue.description;

            }
            else
                templatePdf = new TemplatePdfBill();

                console.log(templatePdf);
        }
        else if(ebBillDto.documentTaxCode===3)
            templatePdf = new TemplatePdfNote();        
        
        const qr = await this.getQrCode(ebBillDto.qr);

        let documentHml = '';

        if(type && type=='2')
            documentHml = templatePdf.roll(ebBillDto, ebSystemDto, ebSucursalDto, qr);
        else
            documentHml = templatePdf.letter(ebBillDto, ebSystemDto, ebSucursalDto, qr);

        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            headless: true,
            });
        const page = await browser.newPage();

        await page.setContent(documentHml);
        const buffer = await page.pdf({ format: "Letter" });
        
        const base64 = buffer.toString('base64');
        
        await browser.close();

        return { bill:  base64 };
    }
    
    async getQrCode(qr:string):Promise<string>{
        const QRbase64 =await new Promise((resolve, reject) => {

            qrcode.toDataURL(qr, (err, code) => {
                if (err) {
                    reject(reject);
                    return;
                }
                resolve(code);
            } );
        });

        return QRbase64 as string;
    }
  

}