import { EbBillDto } from "src/model/dto/ebBill.dto";
import { SendBillDto } from "../bill/dto/sendBill.dto";
import { EbBillDetailDto } from "src/model/dto/ebBillDetail.dto";
import { BillDetail } from '../bill/dto/sendBill.dto';
import { EbSystemDto } from "src/model/dto/ebSystem.dto";
import { ConflictException, Injectable } from "@nestjs/common";
import { SynProductServiceService } from "src/model/synProductService.service";
import { ParameterService } from "src/common/parameter.service";
import { SynInvoiceLegendService } from "src/model/synInvoiceLegend.service";
import { Parameters } from "src/common/tools/parameters";
import { SendNoteDto } from "../bill/dto/sendNote.dto";
import { SynInvoiceLegendDto } from "src/model/dto/synInvoiceLegend.dto";
import { SynCatalogueService } from "src/model/synCatalogue.service";
import { Constants } from "./enum/constants.enum";
import { EbHomologationCatalogueService } from "src/model/ebHomologationCatalogue.service";
import { DataType } from "@prisma/client";


@Injectable()
export class MapperService {
    constructor(private synProductServiceService:SynProductServiceService, 
        private synInvoiceLegendService:SynInvoiceLegendService,
        private synCatalogueService:SynCatalogueService,
        private ebHomologationCatalogueService: EbHomologationCatalogueService,
        private parameterService:ParameterService) {}

    async mapSendNoteDtoToEbBillDto(sendNoteDto: SendNoteDto, ebBillDtoOriginal:EbBillDto, ebSystemDto:EbSystemDto):Promise<EbBillDto> {
        
        const ebBillDto = new EbBillDto();
        
        ebBillDto.billNumber = sendNoteDto.noteData.noteNumber;
        ebBillDto.nitEmitter = sendNoteDto.business.nit;
        ebBillDto.billNameEmitter = ebSystemDto.business;
        ebBillDto.sucursalCode = sendNoteDto.business.sucursalCode;
        ebBillDto.salePointCode = sendNoteDto.business.salePointCode;        
        
        ebBillDto.billName = ebBillDtoOriginal.billName;
        ebBillDto.documentType = ebBillDtoOriginal.documentType;
        ebBillDto.billDocument = ebBillDtoOriginal.billDocument;
        ebBillDto.billComplement =  ebBillDtoOriginal.billComplement;
        ebBillDto.address = ebBillDtoOriginal.address;
        ebBillDto.clientCode = ebBillDtoOriginal.clientCode;
        ebBillDto.paymentMethod =  ebBillDtoOriginal.paymentMethod;
        ebBillDto.cardNumber =  ebBillDtoOriginal.cardNumber;
        ebBillDto.amount = 0;
        ebBillDto.amountIva = 0;
        ebBillDto.amount = ebBillDtoOriginal.amount;
        ebBillDto.amountIva = ebBillDtoOriginal.amountIva;
        ebBillDto.coinCode = ebBillDtoOriginal.coinCode;
        ebBillDto.amountGiftCard = 0;
        ebBillDto.exchangeRate = ebBillDtoOriginal.exchangeRate;

        /*if(sendNoteDto.noteData.amountDiscount)
            ebBillDto.amountDiscount = sendNoteDto.noteData.amountDiscount;
        else
            ebBillDto.amountDiscount = 0;*/

        if(ebBillDtoOriginal.amountDiscount)
            ebBillDto.amountDiscount = ebBillDtoOriginal.amountDiscount;
        else
            ebBillDto.amountDiscount = 0;

        if(ebBillDto.amountDiscount && ebBillDto.amountDiscount>0)
            ebBillDto.sectorDocumentCode = "47";
        else
            ebBillDto.sectorDocumentCode = "24";
        
        ebBillDto.emitteType = 1;
        //ebBillDto.documentTaxCode:number;
        //ebBillDto.exceptionDocument:number;
        ebBillDto.billExternalCode = ebBillDtoOriginal.billExternalCode;
        ebBillDto.billedPeriod = ebBillDtoOriginal.billedPeriod;
        ebBillDto.email =  ebBillDtoOriginal.email;
        
        ebBillDto.billNumberRef = ebBillDtoOriginal.billNumber;
        ebBillDto.cufRef = ebBillDtoOriginal.cuf;
        ebBillDto.dateEmitteRef = ebBillDtoOriginal.dateEmitte;

        ebBillDto.amountTotalOriginal  =  ebBillDtoOriginal.amount + ((ebBillDtoOriginal.amountDiscount && ebBillDtoOriginal.amountDiscount>0)?ebBillDtoOriginal.amountDiscount:0);
        ebBillDto.amountTotalReturned = 0;
        ebBillDto.amountDiscountCreditDebit  = 0;
        ebBillDto.amountEffectiveCreditDebit  = 0;

        const detail = Array();
        let ajusteSujetoIva = 0;
        let otrosPagosNoSujetoIva = 0;
        let ajusteNoSujetoIva = 0;

        ebBillDtoOriginal.details.map( item => {
            if(!item.typeDetail){
                const ebBillDetailDto = new EbBillDetailDto;

                ebBillDetailDto.economicActivity = item.economicActivity;
                ebBillDetailDto.productCodeSin = item.productCodeSin;
                ebBillDetailDto.productCode = item.productCode;
                ebBillDetailDto.description = item.description;
                ebBillDetailDto.quantity = item.quantity;
                ebBillDetailDto.measureCode = item.measureCode;
                ebBillDetailDto.unitPrice = item.unitPrice;
                ebBillDetailDto.amountDiscount = item.amountDiscount;
                ebBillDetailDto.subTotal = item.subTotal;
                ebBillDetailDto.codeTransactionDetail = 1;
                ebBillDetailDto.numberItem = item.order;
                ebBillDetailDto.taxable = item.taxable;
                ebBillDetailDto.typeDetail = item.typeDetail;
                
                detail.push(ebBillDetailDto);

            }
            else
            {
                if(item.typeDetail === 'AJUSTE_NO_SUJETO_IVA')
                    ajusteNoSujetoIva = ajusteNoSujetoIva + item.subTotal;
                else if(item.typeDetail === 'AJUSTE_SUJETO_IVA')
                    ajusteSujetoIva = ajusteSujetoIva + item.subTotal;
                else if(item.typeDetail === 'OTROS_PAGOS_NO_SUJETO_IVA')
                    otrosPagosNoSujetoIva = otrosPagosNoSujetoIva + item.subTotal;
            }
               
        });
        ebBillDto.details = detail;

        ebBillDto.amountTotalOriginal = ebBillDto.amountTotalOriginal - otrosPagosNoSujetoIva - ajusteSujetoIva;
        
        let prorrateo = 0;
        
        await Promise.all( sendNoteDto.noteData.noteDetail.map(  async item =>  {
            const productService = await this.synProductServiceService.findByProductCode(item.productCodeSin,Parameters.codigoSistema , ebBillDtoOriginal.nitEmitter);
            
            let detailOriginal = null;
            ebBillDtoOriginal.details.map( tmp => {
                if(tmp.order == item.order)
                {
                    detailOriginal = tmp;
                }
            });


            const ebBillDetailDto = new EbBillDetailDto;

            ebBillDetailDto.economicActivity =  productService.activityCode;
            ebBillDetailDto.productCodeSin = item.productCodeSin;
            ebBillDetailDto.productCode = item.productCode;
            ebBillDetailDto.description = item.description;
            ebBillDetailDto.quantity = item.quantity;
            ebBillDetailDto.measureCode = item.measureCode;
            ebBillDetailDto.unitPrice = item.unitPrice;
            ebBillDetailDto.amountDiscount = item.amountDiscount;
            ebBillDetailDto.subTotal = item.subTotal;
            ebBillDetailDto.codeTransactionDetail = 2;
            ebBillDetailDto.numberItem = item.order;
            
            ebBillDto.amountTotalReturned = ebBillDto.amountTotalReturned + ebBillDetailDto.subTotal ;
            /*if(detailOriginal && detailOriginal.amountDiscount>0)
                ebBillDto.amountTotalReturned = ebBillDto.amountTotalReturned + detailOriginal.amountDiscount;*/

            if(detailOriginal && ebBillDtoOriginal.amountDiscount && ebBillDtoOriginal.amountDiscount>0)
            {
                prorrateo = prorrateo + ebBillDtoOriginal.amountDiscount*(detailOriginal.subTotal/(ebBillDtoOriginal.amount+ebBillDtoOriginal.amountDiscount))
            }
            
            ebBillDto.details.push(ebBillDetailDto);

        }));

        

        let isTotal = false;
        if(ebBillDto.amountTotalReturned == ebBillDto.amountTotalOriginal)
        {
            ebBillDto.amountDiscountCreditDebit = ebBillDto.amountDiscount;
            ebBillDto.amountTotalReturned = ebBillDto.amountIva;
            isTotal = true;
        }
        else
            ebBillDto.amountDiscountCreditDebit = prorrateo;

        if(ebBillDto.amountIva==0){
            throw new ConflictException("Invalid document to return credit debit");
        }

        if(ebBillDto.amountTotalReturned > ebBillDto.amountIva ){
            throw new ConflictException("The amount returned not include discount y/o gifcards");
        }

        

        if(!isTotal && ebBillDto.amountDiscountCreditDebit!=null && ebBillDto.amountDiscountCreditDebit>0)
        {
            let tmp= ebBillDto.amountTotalReturned - ebBillDto.amountDiscountCreditDebit;
            if(tmp>0)
                ebBillDto.amountTotalReturned = tmp;
            else
                ebBillDto.amountDiscountCreditDebit  = ebBillDto.amountTotalReturned;
        }

        ebBillDto.amountEffectiveCreditDebit = ebBillDto.amountTotalReturned*0.13;
        //ebBillDto.amountDiscount = 0;

        let economicActivity = '';
        ebBillDto.details.map( item => {
            economicActivity = item.economicActivity;
        });

        //we get a random legend by economic activity
        const synInvoiceLegendDto = await this.synInvoiceLegendService.getRandomLegeng( ebSystemDto.systemCode, ebSystemDto.nit, economicActivity, );
        if (synInvoiceLegendDto != null)
            ebBillDto.legend = synInvoiceLegendDto.description;


        return ebBillDto;
    }

    async mapEbBillDto(sendBillDto: SendBillDto, ebSystemDto:EbSystemDto):Promise<EbBillDto> {
        
        const ebHomologationCatalogue = await this.ebHomologationCatalogueService.findById(sendBillDto.customer.documentType, ebSystemDto.systemCode, ebSystemDto.nit, Constants.TipoDocumentoIdentidad);
        if(ebHomologationCatalogue && ebHomologationCatalogue.validateType){
            if(ebHomologationCatalogue.validateType===DataType.NUMBER){
                //!/[a-zA-Z]/.test('12.33?');
                if(! /^\d+$/.test(sendBillDto.customer.document))
                    throw new ConflictException("The document should only have numbers");
            }
        }
        
        const ebBillDto = new EbBillDto();
        
        ebBillDto.billNumber = sendBillDto.bill.billNumber;
        ebBillDto.nitEmitter = sendBillDto.business.nit;
        ebBillDto.billNameEmitter = ebSystemDto.business;
        ebBillDto.sucursalCode = sendBillDto.business.sucursalCode;
        ebBillDto.salePointCode = sendBillDto.business.salePointCode;
        if(sendBillDto.bill.billDate)
            ebBillDto.dateEmitte = new Date(sendBillDto.bill.billDate + ".000Z");
        
        ebBillDto.billName = sendBillDto.customer.name;
        ebBillDto.documentType = sendBillDto.customer.documentType;
        ebBillDto.billDocument = sendBillDto.customer.document;
        ebBillDto.billComplement = sendBillDto.customer.documentComplement;
        ebBillDto.address = sendBillDto.customer.address;
        ebBillDto.clientCode = sendBillDto.customer.customerCode;
        ebBillDto.paymentMethod = sendBillDto.billData.paymentMethod;
        ebBillDto.cardNumber = sendBillDto.billData.cardNumber;
        ebBillDto.amount = sendBillDto.bill.totalAmount;
        ebBillDto.amountIva = sendBillDto.bill.totalAmountIva;
        ebBillDto.amountDiscount = sendBillDto.bill.totalDiscountAmount;
        ebBillDto.amountGiftCard = sendBillDto.bill.amountGiftCard;
        ebBillDto.coinCode = sendBillDto.bill.coinType;
        ebBillDto.exchangeRate = sendBillDto.bill.currencyChange;
        ebBillDto.sectorDocumentCode = sendBillDto.billData.sectorDocumentCode;
        ebBillDto.emitteType = sendBillDto.billData.emitteType;
        //ebBillDto.documentTaxCode:number;
        //ebBillDto.exceptionDocument:number;
        ebBillDto.billExternalCode = sendBillDto.billData.externalCode;
        ebBillDto.billedPeriod = sendBillDto.billData.billedPeriod;
        ebBillDto.consumptionPeriod = sendBillDto.billData.consumptionPeriod;
        ebBillDto.cafc = sendBillDto.billData.cafc;
        ebBillDto.email = sendBillDto.customer.email;
        ebBillDto.user = sendBillDto.billData.user;
        ebBillDto.studentName = sendBillDto.billData.studentName;
        ebBillDto.year = sendBillDto.billData.year;
        ebBillDto.month = sendBillDto.billData.month;

        if(!ebBillDto.billedPeriod)
            ebBillDto.billedPeriod = sendBillDto.billData.year + '-' + sendBillDto.billData.month;

        if(ebBillDto.amount==0)
            throw new ConflictException("El total de la factura no puede ser 0");
        

        if(sendBillDto.billDataAditional){
            ebBillDto.addressBuyer = sendBillDto.billDataAditional.addressBuyer;
            ebBillDto.placeDestination = sendBillDto.billDataAditional.placeDestination;
            ebBillDto.codeCountry = sendBillDto.billDataAditional.codeCountry;
            ebBillDto.additionalInformation = sendBillDto.billDataAditional.additionalInformation;     
            
            ebBillDto.meterNumber = sendBillDto.billDataAditional.meterNumber;
            ebBillDto.beneficiarioLey1886 = sendBillDto.billDataAditional.beneficiarioLey1886;
            ebBillDto.montoDescuentoLey1886 =sendBillDto.billDataAditional.montoDescuentoLey1886;
            ebBillDto.montoDescuentoTarifaDignidad =sendBillDto.billDataAditional.montoDescuentoTarifaDignidad;
            ebBillDto.tasaAseo = sendBillDto.billDataAditional.tasaAseo;
            ebBillDto.tasaAlumbrado = sendBillDto.billDataAditional.tasaAlumbrado;
            ebBillDto.otrasTasas = sendBillDto.billDataAditional.otrasTasas;
        }
        

        ebBillDto.details =  await Promise.all( sendBillDto.bill.billDetail.map(  async item =>  {
            
            if(item.typeDetail)    
            {
                const ebBillDetailDto = new EbBillDetailDto;
                ebBillDetailDto.economicActivity = '-1';
                ebBillDetailDto.productCodeSin = '-1';
                ebBillDetailDto.productCode = '-1';
                ebBillDetailDto.description = item.description;
                ebBillDetailDto.quantity = 1;
                ebBillDetailDto.measureCode = '-1';
                ebBillDetailDto.unitPrice = item.subTotal;
                ebBillDetailDto.amountDiscount = 0;
                ebBillDetailDto.subTotal = item.subTotal;
                ebBillDetailDto.typeDetail = item.typeDetail;

                if( item.typeDetail==='AJUSTE_SUJETO_IVA')
                    ebBillDetailDto.taxable = 'Y';
                else
                    ebBillDetailDto.taxable = 'N';    

                return ebBillDetailDto;
            }
            else{
                const productService = await this.synProductServiceService.findByProductCode(item.productCodeSin,Parameters.codigoSistema , sendBillDto.business.nit );
                const unidadMedida = await this.synCatalogueService.findById({
                    code: item.measureCode,
                    type: "" + Constants.UnidadMedida,
                    systemCode: Parameters.codigoSistema,
                    nit: Number(ebBillDto.nitEmitter),
                    description: "",
                    visible: ""
                });
                item.measure = unidadMedida.description;
                return  this.mapEbBillDetailDto(item, productService.activityCode);
            }

            
        }));
        
        this.setLegend(ebBillDto, ebSystemDto);

        /*let economicActivity = '';
        ebBillDto.details.map( item => {
            economicActivity = item.economicActivity;
        });

        //we get a random legend by economic activity
        const synInvoiceLegendDto = await this.synInvoiceLegendService.getRandomLegeng( ebSystemDto.systemCode, ebSystemDto.nit, economicActivity, );
        if (synInvoiceLegendDto != null)
            ebBillDto.legend = synInvoiceLegendDto.description;
        */

        return ebBillDto;

    }

    async setLegend(ebBillDto:EbBillDto, ebSystemDto:EbSystemDto): Promise<EbBillDto> {
        if(!ebBillDto.legend){
            let economicActivity = '';
            ebBillDto.details.map( item => {
                if(item.economicActivity && item.economicActivity!="-1" )
                    economicActivity = item.economicActivity;
            });
            const synInvoiceLegendDto = await this.synInvoiceLegendService.getRandomLegeng( ebSystemDto.systemCode, ebSystemDto.nit, economicActivity, );
            if (synInvoiceLegendDto != null)
                ebBillDto.legend = synInvoiceLegendDto.description;
        }
        
        return ebBillDto;
    }
    
    getLegendList(ebBillDto:EbBillDto, ebSystemDto:EbSystemDto): Promise<SynInvoiceLegendDto[]>  {
        let economicActivity = '';
        ebBillDto.details.map( item => {
            economicActivity = item.economicActivity;
        });
        return this.synInvoiceLegendService.findBySystemCodeNitActivityCode(ebSystemDto.systemCode, ebSystemDto.nit, economicActivity,);
    }

    mapEbBillDetailDto(billDetail:BillDetail, economicActivity:string): EbBillDetailDto {
        const ebBillDetailDto = new EbBillDetailDto;

        
        ebBillDetailDto.economicActivity = economicActivity;
        ebBillDetailDto.productCodeSin = billDetail.productCodeSin;
        ebBillDetailDto.productCode = billDetail.productCode;
        ebBillDetailDto.description = billDetail.description;
        ebBillDetailDto.quantity = billDetail.quantity;
        ebBillDetailDto.measureCode = billDetail.measureCode;
        ebBillDetailDto.measure = billDetail.measure;
        ebBillDetailDto.unitPrice = billDetail.unitPrice;
        ebBillDetailDto.amountDiscount = billDetail.amountDiscount;
        ebBillDetailDto.subTotal = billDetail.subTotal;
        //ebBillDetailDto.serieNumber = billDetail;
        //ebBillDetailDto.imeiNumber:string

        if(billDetail.taxable)
            ebBillDetailDto.taxable = billDetail.taxable;
        else
            ebBillDetailDto.taxable = 'Y';

        if(billDetail.typeDetail)
            ebBillDetailDto.typeDetail = billDetail.typeDetail;

        return ebBillDetailDto;
    }
}