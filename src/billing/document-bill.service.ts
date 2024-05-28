import { Injectable } from "@nestjs/common";
import { EbBillDto } from "src/model/dto/ebBill.dto";
import { EbSucursalDto } from "src/model/dto/ebSucursal.dto";
import { EbSystemDto } from "src/model/dto/ebSystem.dto";
import puppeteer from "puppeteer";

@Injectable()
export class DocumentBillService {
  
    
    constructor(){}

    async getBillPdf(ebBillDto:EbBillDto, ebSystemDto:EbSystemDto, ebSucursalDto: EbSucursalDto){
    const documentHml = this.getTemplateBill(ebBillDto, ebSystemDto, ebSucursalDto);

    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: false,
        });
    const page = await browser.newPage();

    await page.setContent(documentHml);
    const buffer = await page.pdf({ format: "Legal" });
    
    const base64 = buffer.toString('base64');
    
    await browser.close();

    return { bill:  base64 };
  }
  
  
  getTemplateBill( ebBillDto:EbBillDto, ebSystemDto:EbSystemDto, ebSucursalDto: EbSucursalDto){
    let dateEmiite = ebBillDto.dateEmitte.toISOString();
        dateEmiite= dateEmiite.replace('Z', '');
        dateEmiite= dateEmiite.replace('T', ' ');
        
        const xml = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Sale Note</title>
            <link href="css/bootstrap.css" rel="stylesheet" />
            
        </head>
        <body>
                <div class="container">
                    <div class="row">
                    
                <div class="col-xs-6">
                    <h3>${ebSystemDto.business}</h3>
                </div>
                <div class="col-xs-6 text-right">
                                    <div class="panel panel-default">
                                    <div class="panel-heading">
                                            <h5>NIT : ${ebSystemDto.nit}</h5>
                                    </div>
                                </div>
                            </div>
                    <hr />
                        <h3 style="text-align: center;">NOTA DE VENTA</h3> 
                        <div class="row">
                            <div class="col-xs-12">
                                <div class="panel panel-default">
                                        <div class="panel-heading">Fecha: ${dateEmiite}</div>
                                <div class="panel-body">Comprador : ${ebBillDto.billName} 
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            NIT/CI : ${ebBillDto.billDocument}
                                </div>
                                </div>
                            </div>
                            
                        </div>
        <pre></pre>
        <table class="table table-bordered">
            <thead >
                <tr >
                    <th style="text-align: center;">
                        <b>Cantidad</b>
                    </th>
                    <th style="text-align: center;">
                        <b>Concepto</b>
                    </th>
                    <th style="text-align: center;">
                        <b>Precio unitario</b>
                    </th>
                    <th style="text-align: center;">
                        <b>Descuento</b>
                    </th>
                    <th style="text-align: center;">
                        <b>Total</b>
                    </th>
                    
                </tr>
            </thead>
            <tbody>
            ${ebBillDto.details.map( (item)=> {
                return `<tr>
                    <td style="text-align: center;">${item.quantity}</td>
                    <td>${item.description}</td>
                    <td class=" text-right ">${item.unitPrice}</td>
                    <td class=" text-right ">${item.amountDiscount}</td>
                    <td class=" text-right ">${item.subTotal}</td>
                    
                </tr>`
            } ).join(``)  }
                
                <tr>
                    <td>&nbsp;</td>
                    <td> &nbsp;</td>
                    <td class="text-right">&nbsp;</td>
                    <td class="text-right">&nbsp;</td>
                    <td class="text-right ">&nbsp;</td>
                    
                </tr>
                <tr >
                    <td colspan="4" style="text-align: right;">Total Bs.</td>
                    <td style="text-align: right;">${ebBillDto.amount}</td>
                    
                    
                </tr>
               
            </tbody>
        </table>
        <pre></pre>
                
        
            <div class="row">
                    
                    <div class="col-xs-8">
                    
                        <div class="panel panel-info"  style="text-align: right;">
                            <h6> "GRACIAS POR SU COMPRA"</h6>
                        </div>
                    
                </div>
            </div>
        </div>
        </div>
        
        </body>
        </html>`;

        return xml;
  }
}