import { EbBillDto } from "src/model/dto/ebBill.dto";
import { TemplatePdf } from "./template-pdf.interface";
import { EbSystemDto } from "src/model/dto/ebSystem.dto";
import { EbSucursalDto } from "src/model/dto/ebSucursal.dto";
import { NumberToLetters } from "../tools/number-to-letters";

export class TemplatePdfBill implements TemplatePdf {
  letter(ebBillDto:EbBillDto, ebSystemDto:EbSystemDto, ebSucursalDto: EbSucursalDto, qr:string) {
    let dateEmiite = ebBillDto.dateEmitte.toISOString();
        dateEmiite= dateEmiite.replace('Z', '');
        dateEmiite= dateEmiite.replace('T', ' ');


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
          .wrapper-invoice .invoice .invoice-body .table tbody tr td:nth-child(n+5) {
            text-align: right;
          }

          .wrapper-invoice .invoice .invoice-body .table tbody tr td:nth-child(2) {
            text-align: left !important;
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
          .rtl .invoice-body .table tbody tr td:nth-child(4) {
            text-align: left !important;
          }
          .rtl .invoice-body .flex-table .flex-column .table-subtotal tbody tr td {
            text-align: right !important;
          }
          .rtl .invoice-body .flex-table .flex-column .table-subtotal tbody tr td:nth-child(4) {
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
              <p>${ebSucursalDto.address}</p>
              <p>Telefono: ${ebSucursalDto.phone}</p>
              <p>${ebBillDto.municipality}</p>
            </div>
            <div>&nbsp;</div>
            <div class="title-document"><b>FACTURA</b></div>
            <div class="title-document">(Con Derecho a Credito Fiscal)</div>
            <!-- invoice head -->
            <div class="invoice-head">
            
              <div class="head client-info">
                <p><b>Fecha:</b> ${dateEmiite}</p>
                <p><b>Nombre/Razón Social :</b> ${ebBillDto.billName}</p>
                ${ebBillDto.sectorDocumentCode==='13'? `<p><b>Dirección:</b> ${ebBillDto.address}</p>`: ``}
                ${ebBillDto.sectorDocumentCode==='13'? `<p><b>Consumo Periodo:</b> ${ebBillDto.billedPeriod}</p>`: ``}
                ${ebBillDto.sectorDocumentCode==='11'? `<p><b>Nombre Estudiante:</b> ${ebBillDto.studentName}</p>`: ``}
              </div>
              <div class="head client-data">
                <p><b>NIT/CI/CEX:</b> ${ebBillDto.billDocument} ${ebBillDto.billComplement??''}</p>
                <p><b>Cod. Cliente:</b> ${ebBillDto.clientCode}</p>
                ${ebBillDto.sectorDocumentCode==='13'? `<p><b>Nro Meditor:</b> ${ebBillDto.meterNumber}</p>`: ``}
                ${ebBillDto.sectorDocumentCode==='11'? `<p><b>Periodo Facturado:</b> ${ebBillDto.billedPeriod}</p>`: ``}
              </div>
            </div>
            <!-- invoice body-->
            <div class="invoice-body">
              <table class="table">
                <thead>
                  <tr>
                    <th>Codigo</th>
                    <th>Cantidad</th>
                    <th>Unidad de Medida</th>
                    <th>Descripcion</th>
                    <th>Precio Unitario</th>
                    <th>Descuento</th>
                    <th>SubTotal</th>
                  </tr>
                </thead>
                <tbody>
                  
                  ${ebBillDto.details.map( (item)=> {
                      return `<tr>
                          <td>${item.productCodeSin}</td>
                          <td style="text-right ">${item.quantity??0}</td>
                          <td>${item.measure}</td>
                          <td>${item.description}</td>
                          <td>${item.unitPrice??0}</td>
                          <td>${item.amountDiscount??0}</td>
                          <td>${item.subTotal??0}</td>
                          
                      </tr>`
                  } ).join(``)  }
                    
                      ${ebBillDto.sectorDocumentCode==='13'?  `<tr>
                      <td style="text-right "></td>  
                      <td style="text-right "></td>
                      <td style="text-right "></td>  
                      <td>Ajustes Sujetos a IVA 
                              ${ebBillDto.detalleAjusteSujetoIva?Object.keys(JSON.parse(ebBillDto.detalleAjusteSujetoIva)).map( (item)=> {
                                return `<br>
                                      <span style="font-size: 9px">${item}</span>
                                      <span style="text-right; font-size: 9px;">${JSON.parse(ebBillDto.detalleAjusteSujetoIva)[item]}</span>`
                              } ).join(``) : ``}
                          </td>                          
                          <td style="text-right "></td>
                          <td style="text-right "></td>
                          <td style="text-right ">${ebBillDto.ajusteSujetoIva}</td>
                          
                      </tr><tr>
                        <td style="text-right "></td>
                        <td style=" text-right "></td>
                        <td style=" text-right "></td>
                        <td>Tasa Aseo Urbano</td>                        
                        <td style=" text-right "></td>
                        <td style="text-right "></td>
                        <td style=" text-right ">${ebBillDto.tasaAseo??0}</td>
                        
                    </tr><tr>
                          <td style="text-right "></td>
                          <td style=" text-right "></td>
                          <td style=" text-right "></td>
                          <td>Tasa Alumbrado</td>
                          <td style=" text-right "></td>
                          <td style="text-right "></td>
                          <td style=" text-right ">${ebBillDto.tasaAlumbrado??0}</td>
                          
                      </tr><tr>
                        <td style=" text-right "></td>
                        <td style=" text-right "></td>
                        <td style="text-right "></td>  
                        <td>Otras Tasas</td>
                        <td style=" text-right "></td>
                        <td style="text-right "></td>
                        <td style=" text-right ">${ebBillDto.otrasTasas??0}</td>                        
                    </tr><tr>
                      <td style="text-right "></td>
                      <td style="text-right "></td>
                      <td style="text-right "></td>
                      <td>Otros Pagos No Sujetos a IVA
                          ${ebBillDto.detlleOtrosPagosNoSujetoIva?Object.keys(JSON.parse(ebBillDto.detlleOtrosPagosNoSujetoIva)).map( (item)=> {
                            return `<br>
                                      <span style="font-size: 9px">${item}</span>
                                      <span style="text-right; font-size: 9px;">${JSON.parse(ebBillDto.detlleOtrosPagosNoSujetoIva)[item]}</span>`
                          } ).join(``): ``  }
                      </td>
                      <td style="text-right "></td>
                      <td style="text-right "></td>
                      <td style="text-right ">${ebBillDto.otrosPagosNoSujetoIva}</td>
                      
                   </tr>`:``}
                   </tbody>
              </table>
              <div class="flex-table">
                <div class="flex-column">
                  <img src="${qr}" alt="QR Code" height="120px" /><br>
                  ${ebBillDto.sectorDocumentCode==='13'?`Son: ${NumberToLetters.numberToLetters((ebBillDto.amount??0) -  (ebBillDto.ajusteNoSujetoIva??0))}`: 
                    `Son: ${NumberToLetters.numberToLetters(ebBillDto.amountIva)}`}
                  
                </div>
                <div class="flex-column">
                  <table class="table-subtotal">
                    <tbody>
                      ${ebBillDto.sectorDocumentCode==='13'?  `<tr>
                            <td>Total</td>
                            <td>${(ebBillDto.amount??0) + (ebBillDto.amountDiscount??0)}</td>
                          </tr>
                          <tr>
                            <td>(-) Descuento</td>
                            <td>${ebBillDto.amountDiscount??0}</td>
                          </tr>
                          <tr>
                            <td>SubTotal  a Pagar</td>
                            <td>${ebBillDto.amount??0}</td>
                          </tr>
                          <tr>
                            <td>(-) Ajustes No Sujetos a IVA</td>
                            <td>${ebBillDto.ajusteNoSujetoIva??0}</td>
                          </tr>
                          <tr>
                            <td>Monto Total a Pagar</td>
                            <td>${(ebBillDto.amount??0) -  (ebBillDto.ajusteNoSujetoIva??0)}</td>
                          </tr>
                          <tr>
                            <td>(-) Tasas</td>
                            <td>${(ebBillDto.tasaAseo??0) + (ebBillDto.tasaAlumbrado??0)+ (ebBillDto.otrasTasas??0)}</td>
                          </tr>
                          <tr>
                            <td>(-) Otros Pagos no Sujetos a IVA</td>
                            <td>${ebBillDto.otrosPagosNoSujetoIva??0}</td>
                          </tr>
                          <tr>
                            <td>(+) Ajustes No Sujetos a IVA</td>
                            <td>${ebBillDto.ajusteNoSujetoIva??0}</td>
                          </tr>
                          <tr>
                            <td>Importe Credito Fiscal</td>
                            <td>${(ebBillDto.amountIva) }</td>
                          </tr>`: `<tr>
                                      <td>Subtotal</td>
                                      <td>${(ebBillDto.amount??0) + (ebBillDto.amountDiscount??0)}</td>
                                    </tr>
                                    <tr>
                                      <td>(-) Descuento</td>
                                      <td>${ebBillDto.amountDiscount??0}</td>
                                    </tr>
                                    <tr>
                                      <td>Total</td>
                                      <td>${ebBillDto.amount??0}</td>
                                    </tr>                                                              
                                    <tr>
                                      <td>Monto Gift Card</td>
                                      <td>${ebBillDto.amountGiftCard??0}</td>
                                    </tr>
                                    <tr>
                                      <td>Monto a Pagar</td>
                                      <td>${(ebBillDto.amount??0) - (ebBillDto.amountGiftCard??0)}</td>
                                    </tr>
                                    <tr>
                                      <td>Importe Base Credito Fiscal</td>
                                      <td>${ebBillDto.amountIva??0}</td>
                                    </tr>` }
                                          
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
    let dateEmiite = ebBillDto.dateEmitte.toISOString();
        dateEmiite= dateEmiite.replace('Z', '');
        dateEmiite= dateEmiite.replace('T', ' ');

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
            margin: 0;
            padding: 0;
            user-select: none;
          }
          
          body {
            font-size: 12px;
            text-align: center !important;
          }
          
          .wrapper-invoice {
            display: flex;
            justify-content: left;
          }
          .wrapper-invoice .invoice {
            height: auto;
            background: #fff;
            padding: 3mm;
            margin-top: 0.1vh;
            width: 80mm;
            box-sizing: border-box;
            border: 1px solid #dcdcdc;
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
            
          }
          .wrapper-invoice .invoice .invoice-body .table thead tr th {            
            border: 1px solid #dcdcdc;
            text-align: left;
            padding: 0.5vh;
            
          }
          .wrapper-invoice .invoice .invoice-body .table tbody tr td {
            
            border: 1px solid #dcdcdc;
            text-align: left;
            padding: 0.2vh;
            background-color: #fff;
          }
          .wrapper-invoice .invoice .invoice-body .table tbody tr td:nth-child(n+5) {
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
          
          .rtl .invoice-body .table tbody tr td:nth-child(2) {
            text-align: left !important;
          }
          
          .title-document {
            text-align: center !important;
          }
        </style>

      </head>
      <body>
        <section class="wrapper-invoice">
          <div class="invoice">
            <!-- logo brand invoice -->
            <div class="invoice-logo-brand">
              <p><b>${ebSystemDto.business}</b></p>
              <p>CASA MATRIZ</p>
              <p>No. Punto de Venta ${ebBillDto.salePointCode}</p>
              <p>${ebBillDto.municipality}</p>
            </div>
            <div>&nbsp;</div>
            <div class="title-document"><b>FACTURA</b></div>
            <div class="title-document">(Con Derecho a Credito Fiscal)</div>

            <div class="invoice-information">
              <p><b>NIT:</b> </p>
              <p>${ebBillDto.nitEmitter}</p>
              <p><b>FACTURA N° </b> </p>
              <p>${ebBillDto.billNumber}</p>
              <p><b>COD. AUTORIZACIÓN</b></p>
              <p>${ebBillDto.cuf.substring(1, 28)}</p>
              <p>${ebBillDto.cuf.substring(29)}</p>
            </div>
            
            <div>&nbsp;</div>

            <div class="invoice-head">            
              <div class="head client-info">
                <p><b>Fecha:</b> ${dateEmiite}</p>
                <p><b>Nombre/Razón Social :</b> ${ebBillDto.billName}</p>
                ${ebBillDto.sectorDocumentCode==='11'? `<p><b>Nombre Estudiante:</b> ${ebBillDto.studentName}</p>`: ``}
                <p><b>NIT/CI/CEX:</b> ${ebBillDto.billDocument} ${ebBillDto.billComplement??''}</p>
                <p><b>Cod. Cliente:</b> ${ebBillDto.clientCode}</p>
                ${ebBillDto.sectorDocumentCode==='11'? `<p><b>Periodo Facturado:</b> ${ebBillDto.billedPeriod}</p>`: ``}
              </div>
              
            </div>
            <!-- invoice body-->
             
            <div class="invoice-body">
              <hr>
              <div class="flex-table"> 
                <span style="font-weight: bold;">Descripcion</span>
              </div>
              <div class="flex-table"> 
                <p><b>Cantidad</b></p><p><b>P. Unit</b></p><p><b>Desc.</b></p><p> <b>SubTotal.</b></p>
              </div>
              <hr>
              <div class="invoide-detail-body">                
                ${ebBillDto.details.map( (item)=> {
                  return `<div class="flex-table"> 
                      ${item.description}</div>
                      <div class="flex-table"> 
                      <p>${item.quantity??0}</p>
                      <p>${item.unitPrice??0}</p>
                      <p>${item.amountDiscount??0}</p>
                      <p>${item.subTotal??0}</p>
                    </div>`} ).join(``)  }
              </div>              
              <hr>
              <div class="flex-table">                
                <div class="flex-column">
                  <table class="table-subtotal">                    
                    <tbody>
                      <tr>
                          <td>Subtotal</td>
                          <td>${(ebBillDto.amount??0) + (ebBillDto.amountDiscount??0)}</td>
                        </tr>
                        <tr>
                          <td>(-) Descuento</td>
                          <td>${ebBillDto.amountDiscount??0}</td>
                        </tr>
                        <tr>
                          <td>Total</td>
                          <td>${ebBillDto.amount??0}</td>
                        </tr>                                                              
                        <tr>
                          <td>Monto Gift Card</td>
                          <td>${ebBillDto.amountGiftCard??0}</td>
                        </tr>
                        <tr>
                          <td>Monto a Pagar</td>
                          <td>${(ebBillDto.amount??0) - (ebBillDto.amountGiftCard??0)}</td>
                        </tr>
                        <tr>
                          <td>Importe Base Credito Fiscal</td>
                          <td>${ebBillDto.amountIva??0}</td>
                        </tr>
                                          
                    </tbody>
                  </table>
                </div>                
              </div>  
              <div>&nbsp;</div>
              <div >
                <p>Son: ${NumberToLetters.numberToLetters(ebBillDto.amount)}</p><br>
                <img src="${qr}" alt="QR Code" />                
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
      </body>
    </html>`;
    return template;
  }
  
}