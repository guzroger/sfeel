import { EbBillDto } from "src/model/dto/ebBill.dto";
import { TemplatePdf } from "./template-pdf.interface";
import { EbSystemDto } from "src/model/dto/ebSystem.dto";
import { EbSucursalDto } from "src/model/dto/ebSucursal.dto";
import { NumberToLetters } from "../tools/number-to-letters";

export class TemplatePdfNote implements TemplatePdf {
  letter(ebBillDto:EbBillDto, ebSystemDto:EbSystemDto, ebSucursalDto: EbSucursalDto, qr:string) {
    let dateEmiite = ebBillDto.dateEmitte.toISOString();
        dateEmiite= dateEmiite.replace('Z', '');
        dateEmiite= dateEmiite.replace('T', ' ');

        let dateEmitteRef = ebBillDto.dateEmitteRef.toISOString();
        dateEmitteRef= dateEmitteRef.replace('Z', '');
        dateEmitteRef= dateEmitteRef.replace('T', ' ');
    
    let amountTotal = 0;

    const template = `<!DOCTYPE html>
    <html lang="en, id">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>
          FACTURA
        </title>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <style>
          @import "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap";
          * {
            margin: 0 auto;
            padding: 0 auto;
            user-select: none;
          }
          
          body {
            font-size: 12px;
          }
          
          .wrapper-invoice {
            display: flex;
            justify-content: center;
          }
          .wrapper-invoice .invoice {
            height: auto;
            background: #fff;
            padding: 3vh;
            margin-top: 0.1vh;
            max-width: 110vh;
            width: 100%;
            box-sizing: border-box;
            border: 1px solid #dcdcdc;
          }
          .wrapper-invoice .invoice .invoice-information {
            float: right;
            text-align: right;
          }
          .wrapper-invoice .invoice .invoice-information b {
            color: "#0F172A";
          }
          .wrapper-invoice .invoice .invoice-information p {

            color: gray;
          }
          .wrapper-invoice .invoice .invoice-logo-brand h2 {
            text-transform: uppercase;
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

            color: "#0F172A";
          }
          .wrapper-invoice .invoice .invoice-logo-brand img {
            max-width: 100px;
            width: 100%;
            object-fit: fill;
          }
          .wrapper-invoice .invoice .invoice-head {
            display: flex;
            margin-top: 1vh;
          }
          .wrapper-invoice .invoice .invoice-head .head {
            width: 100%;
            box-sizing: border-box;
          }
          .wrapper-invoice .invoice .invoice-head .client-info {
            text-align: left;
          }
          .wrapper-invoice .invoice .invoice-head .client-info h2 {
            font-weight: 500;
            letter-spacing: 0.3px;
            
            color: "#0F172A";
          }
          .wrapper-invoice .invoice .invoice-head .client-info p {
            
            color: gray;
          }
          .wrapper-invoice .invoice .invoice-head .client-data {
            text-align: right;
          }
          .wrapper-invoice .invoice .invoice-head .client-data h2 {
            font-weight: 500;
            letter-spacing: 0.3px;
            
            color: "#0F172A";
          }
          .wrapper-invoice .invoice .invoice-head .client-data p {
            
            color: gray;
          }
          .wrapper-invoice .invoice .invoice-body {
            margin-top: 1vh;
          }
          
          .tablelittle tr td {
            border-collapse: collapse;            
            border: none;
            font-size: 8px;
            padding: 0vh;
          }
          .wrapper-invoice .invoice .invoice-body .table {
            border-collapse: collapse;
            width: 100%;
          }
          .wrapper-invoice .invoice .invoice-body .table thead tr th {
            
            border: 1px solid #dcdcdc;
            text-align: left;
            padding: 0.5vh;
            background-color: #eeeeee;
          }
          .wrapper-invoice .invoice .invoice-body .table tbody tr td {
            
            border: 1px solid #dcdcdc;
            text-align: left;
            padding: 0.2vh;
            background-color: #fff;
          }
          .wrapper-invoice .invoice .invoice-body .table tbody tr td:nth-child(n+2) {
            text-align: right;
          }
          .wrapper-invoice .invoice .invoice-body .flex-table {
            display: flex;
          }
          .wrapper-invoice .invoice .invoice-body .flex-table .flex-column {
            width: 100%;
            box-sizing: border-box;
          }
          .wrapper-invoice .invoice .invoice-body .flex-table .flex-column .table-subtotal {
            border-collapse: collapse;
            box-sizing: border-box;
            width: 100%;
          }
          .wrapper-invoice .invoice .invoice-body .flex-table .flex-column .table-subtotal tbody tr td {
            
            border-bottom: 1px solid #dcdcdc;
            text-align: left;
            padding: 0.2vh;
            background-color: #fff;
          }
          .wrapper-invoice .invoice .invoice-body .flex-table .flex-column .table-subtotal tbody tr td:nth-child(2) {
            text-align: right;
          }
          .wrapper-invoice .invoice .invoice-body .invoice-total-amount {
            margin-top: 1rem;
          }
          .wrapper-invoice .invoice .invoice-body .invoice-total-amount p {
           
            color: "#0F172A";
            text-align: right;
            
          }
          .wrapper-invoice .invoice .invoice-footer {
            margin-top: 4vh;
            text-align: center;
          }
          .wrapper-invoice .invoice .invoice-footer p {
            
            color: gray;
          }
          
          .copyright {
            margin-top: 2rem;
            text-align: center;
          }
          .copyright p {
            color: gray;
            
          }
          
          @media print {
            .table thead tr th {
              -webkit-print-color-adjust: exact;
              background-color: #eeeeee !important;
            }
          
            .copyright {
              display: none;
            }
          }
          .rtl {
            direction: rtl;
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
          }
          .rtl .invoice-information {
            float: left !important;
            text-align: left !important;
          }
          .rtl .invoice-head .client-info {
            text-align: right !important;
          }
          .rtl .invoice-head .client-data {
            text-align: left !important;
          }
          .rtl .invoice-body .table thead tr th {
            text-align: right !important;
          }
          .rtl .invoice-body .table tbody tr td {
            text-align: right !important;
          }
          .rtl .invoice-body .table tbody tr td:nth-child(2) {
            text-align: left !important;
          }
          .rtl .invoice-body .flex-table .flex-column .table-subtotal tbody tr td {
            text-align: right !important;
          }
          .rtl .invoice-body .flex-table .flex-column .table-subtotal tbody tr td:nth-child(2) {
            text-align: left !important;
          }
          .rtl .invoice-body .invoice-total-amount p {
            text-align: left !important;
          }

          .title-document {
            text-align: center !important;
          }
            #background{
              position:absolute;
              z-index:1;
              left: 0; 
              right: 0; 
              margin-left: auto; 
              margin-right: auto; 
          }
          #bg-text
          {
              color:red;
              font-size:100px;
              transform:rotate(300deg);
              -webkit-transform:rotate(300deg);
          }
        </style>

      </head>
      <body>
      ${ebBillDto.statusCode==='905'? `<div id="background">
        <p id="bg-text">Anulado</p>
      </div>`: ``}
        <section class="wrapper-invoice">
          <div class="invoice">
            <div class="invoice-information">
              <p><b>NIT </b> :  ${ebBillDto.nitEmitter}</p>
              <p><b>FACTURA N° </b> :  ${ebBillDto.billNumber}</p>
              <p><b>COD. AUTORIZACIÓN</b>: ${ebBillDto.cuf.substring(1, 17)}</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  ${ebBillDto.cuf.substring(18, 35)}</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  ${ebBillDto.cuf.substring(36)}</p>
            </div>
            <!-- logo brand invoice -->
            <div class="invoice-logo-brand">
              <p><b>${ebSystemDto.business}</b></p>
              <p>CASA MATRIZ</p>
              <p>No. Punto de Venta ${ebBillDto.salePointCode}</p>
              <p>${ebBillDto.municipality}</p>
            </div>
            <div>&nbsp;</div>
            <div class="title-document"><b>NOTA CRÉDITO - DÉBITO</b></div>
            <!-- invoice head -->
            <div class="invoice-head">
            
              <div class="head client-info">
                <p><b>Fecha:</b> ${dateEmiite}</p>
                <p><b>Nombre/Razón Social :</b> ${ebBillDto.billName}</p>
                <p><b>N° Factura:</b> ${ebBillDto.billNumberRef}</p>
              </div>
              <div class="head client-data">
                <p><b>NIT/CI/CEX:</b> ${ebBillDto.billDocument} ${ebBillDto.billComplement??''}</p>
                <p><b>Cod. Cliente:</b> ${ebBillDto.clientCode}</p>
                <p><b>Fecha Factura:</b> ${dateEmitteRef}</p>
                <p><b>Cod. Autorización</b>: ${ebBillDto.cufRef.substring(1, 17)}</p>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  ${ebBillDto.cufRef.substring(18, 35)}</p>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  ${ebBillDto.cufRef.substring(36)}</p>
              </div>
            </div>
            <!-- invoice body-->
            <div class="invoice-body">
              <p><b>DATOS FACTURA ORIGINAL:</b></p>
              <table class="table">
                <thead>
                  <tr>
                    <th>Descripcion</th>
                    <th>Cantidad</th>
                    <th>Preceio Unitario</th>
                    <th>Descuento</th>
                    <th>SubTotal</th>
                  </tr>
                </thead>
                <tbody>
                  
                ${ebBillDto.details.map( (item)=> {
                  
                  return `${item.codeTransactionDetail===1?  `<tr>
                      <td>${item.description}</td>
                      <td>${item.quantity??0}</td>
                      <td>${item.unitPrice??0}</td>
                      <td>${item.amountDiscount??0}</td>
                      <td>${item.subTotal??0}</td>                          
                      </tr>`: ``} `
                  } ).join(``)  }

                </tbody>
              </table>
              <div class="flex-table">
                <div class="flex-column">
                 
                </div>
                <div class="flex-column">
                  <table class="table-subtotal">
                    <tbody>
                      <tr>
                          <td>Monto Total Original</td>
                          <td>${Number(ebBillDto.amountTotalOriginal??0).toFixed(2)}</td>
                        </tr>
                      ${ebBillDto.sectorDocumentCode==='47'?  `<tr>
                          <td>Descuento Adicional</td>
                          <td>${Number(ebBillDto.amountDiscountCreditDebit??0).toFixed(2)}</td>
                        </tr>
                      <tr>
                          <td>Monto Total a Pagar</td>
                          <td>${Number((ebBillDto.amountTotalOriginal??0) - (ebBillDto.amountDiscountCreditDebit??0)).toFixed(2)}</td>
                        </tr>`:``}
                          
                                 
                    </tbody>
                  </table>
                </div>
              </div>  

              <p><b>DATOS DE LA DEVOLUCIÓN O RESCISIÓN:</b></p>
              <table class="table">
                <thead>
                  <tr>
                    <th>Descripcion</th>
                    <th>Cantidad</th>
                    <th>Preceio Unitario</th>
                    <th>Descuento</th>
                    <th>SubTotal</th>
                  </tr>
                </thead>
                <tbody>
                  
                  ${ebBillDto.details.map( (item)=> {
                      if(item.codeTransactionDetail===2)
                        amountTotal=(amountTotal +item.subTotal);

                      return `${item.codeTransactionDetail===2?  `<tr>
                          <td>${item.description}</td>
                          <td>${item.quantity??0}</td>
                          <td>${item.unitPrice??0}</td>
                          <td>${item.amountDiscount??0}</td>
                          <td>${item.subTotal??0}</td>                          
                          </tr>`: ``} `
                      } ).join(``)  }

                </tbody>
              </table>
              <div class="flex-table">
                <div class="flex-column">
                   <br>   
                  <img src="${qr}" alt="QR Code" height="120px" /><br>    
                  Son: ${NumberToLetters.numberToLetters(amountTotal - ebBillDto.amountDiscountCreditDebit)}
                </div>
                <div class="flex-column">
                  <table class="table-subtotal">
                    <tbody>
                        ${ebBillDto.sectorDocumentCode==='47'?  `<tr>
                            <td>SubTotal</td>
                            <td>${Number((amountTotal??0)).toFixed(2)}</td>
                          </tr>
                        <tr>
                            <td>Monto Descuento Debito Credito</td>
                            <td>${Number(ebBillDto.amountDiscountCreditDebit??0).toFixed(2)}</td>
                          </tr>`:``}
                          <tr>
                            <td>Monto Total Devuelto</td>
                            <td>${Number((amountTotal??0) - (ebBillDto.amountDiscountCreditDebit??0)).toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td>Monto Efectivo Debito Credito</td>
                            <td>${Number(ebBillDto.amountEffectiveCreditDebit??0).toFixed(2)}</td>
                          </tr>                                   
                    </tbody>
                  </table>
                </div>
              </div>              
            </div>
            
            <!-- invoice footer -->
            <div class="invoice-footer">
              <p>ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PAÍS, EL USO ILÍCITO SERÁ SANCIONADO PENALMENTE DE ACUERDO LEY</p>  
              <p>${ebBillDto.legend}</p>
              <p>${ebBillDto.note}</p>
            </div>
          </div>
        </section>
        <div class="copyright">
          <p></p>
        </div>
      </body>
    </html>`;
    
    return template;
  }
  
  roll(ebBillDto:EbBillDto, ebSystemDto:EbSystemDto, ebSucursalDto: EbSucursalDto, qr:string) {
    const template = ``;
    return template;
  }
  
}