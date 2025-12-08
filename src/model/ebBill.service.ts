import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EbBillDto } from './dto/ebBill.dto';
import { ebBill, ebBillDetail } from '@prisma/client';
import { EbBillDetailService } from './ebBillDetail.service';
import { EbBillDetailDto } from './dto/ebBillDetail.dto';
import { EbSystemDto } from './dto/ebSystem.dto';
import { BillPageOptionsDto } from 'src/bill/dto/billPageOptions.dto';
import { PageMetaDto } from 'src/common/dto/pageMeta.dto';
import { PageDto } from 'src/common/dto/page.dto';

@Injectable()
export class EbBillService {
  constructor(
    private prismaService: PrismaService,
    private ebBillDetailService: EbBillDetailService,
  ) {}

  async create(ebBillDto: EbBillDto): Promise<EbBillDto> {
   
    if (ebBillDto.billId != null) {
      try{
        const tmp = await this.findById(ebBillDto.billId);
        if (tmp != null) return this.update(ebBillDto);
      }
      catch(error){}
    }
    if(ebBillDto.cuf){
      const tmp = await this.findByCuf(ebBillDto.cuf);
      if (tmp != null) throw new ConflictException("Duplicate CUF");
    }
        
    const ebBill = await this.prismaService.ebBill.create({
      data: {
        systemCode: ebBillDto.systemCode,
        cuf: ebBillDto.cuf,
        cufd: ebBillDto.cufd,
        billNumber: ebBillDto.billNumber,
        nitEmitter: ebBillDto.nitEmitter,
        sucursalCode: ebBillDto.sucursalCode,
        salePointCode: ebBillDto.salePointCode,
        dateEmitte: ebBillDto.dateEmitte,
        billName: ebBillDto.billName,
        documentType: ebBillDto.documentType,
        billDocument: ebBillDto.billDocument,
        billComplement: ebBillDto.billComplement,
        address: ebBillDto.address,
        clientCode: ebBillDto.clientCode,
        paymentMethod: ebBillDto.paymentMethod,
        cardNumber: ebBillDto.cardNumber,
        amount: ebBillDto.amount,
        amountIva: ebBillDto.amountIva,
        amountDiscount: ebBillDto.amountDiscount,
        amountGiftCard: ebBillDto.amountGiftCard,
        coinCode: "" + ebBillDto.coinCode,
        exchangeRate: ebBillDto.exchangeRate,
        legend: ebBillDto.legend,
        sectorDocumentCode: ebBillDto.sectorDocumentCode,
        modalityCode: ebBillDto.modalityCode,
        emitteType: ebBillDto.emitteType,
        documentTaxCode: ebBillDto.documentTaxCode,
        exceptionDocument: ebBillDto.exceptionDocument,
        billExternalCode: ebBillDto.billExternalCode,
        billedPeriod: ebBillDto.billedPeriod,
        consumptionPeriod: ebBillDto.consumptionPeriod,
        billNameEmitter: ebBillDto.billNameEmitter,
        municipality: ebBillDto.municipality,
        receptionCode: ebBillDto.receptionCode,
        statusCode: ebBillDto.statusCode,
        statusDescription: ebBillDto.statusDescription,
        reasonAnnulationCode: ebBillDto.reasonAnnulationCode,
        cafc: ebBillDto.cafc,
        email: ebBillDto.email,
        qr: ebBillDto.qr,
        note: ebBillDto.note,
        eventId: ebBillDto.eventId,
        addressBuyer: ebBillDto.addressBuyer,
        placeDestination: ebBillDto.placeDestination,
        codeCountry: ebBillDto.codeCountry,
        additionalInformation: ebBillDto.additionalInformation,
        billNumberRef:  ebBillDto.billNumberRef,
        cufRef: ebBillDto.cufRef ,
        dateEmitteRef: ebBillDto.dateEmitteRef,
        amountTotalOriginal: ebBillDto.amountTotalOriginal,
        amountTotalReturned: ebBillDto.amountTotalReturned,
        amountDiscountCreditDebit: ebBillDto.amountDiscountCreditDebit,
        amountEffectiveCreditDebit: ebBillDto.amountEffectiveCreditDebit,
        billIdRef: ebBillDto.billIdRef,
        user: ebBillDto.user,
        meterNumber:ebBillDto.meterNumber,
        beneficiarioLey1886:ebBillDto.beneficiarioLey1886,
        montoDescuentoLey1886:ebBillDto.montoDescuentoLey1886,
        montoDescuentoTarifaDignidad:ebBillDto.montoDescuentoTarifaDignidad,
        tasaAseo:ebBillDto.tasaAseo,
        tasaAlumbrado:ebBillDto.tasaAlumbrado,
        otrasTasas:ebBillDto.otrasTasas,
        studentName: ebBillDto.studentName,
        year: ebBillDto.year,
        month: ebBillDto.month,
        package: {connect: { packageId: ebBillDto.packageId? ebBillDto.packageId: -1 }},
        billStatus: { connect: { billStatusId: ebBillDto.billStatusId? ebBillDto.billStatusId: 0  }}
      },
    });

    let details: EbBillDetailDto[] = null;
    let numberDetail = 0;
    if (ebBillDto.details != null) { 
      details = await Promise.all( ebBillDto.details.map( async (item) => {
        numberDetail++;
        item.order = numberDetail;
        item.billId = Number(ebBill.billId);
        return  await this.ebBillDetailService.create(item);
      }));
    }

    if (ebBillDto.detailsNotInclude != null) {
      details = await Promise.all( ebBillDto.detailsNotInclude.map( async (item) => {
        numberDetail++;
        item.order = numberDetail;
        item.billId = Number(ebBill.billId);
        return  await this.ebBillDetailService.create(item);
      }));
    }

    return this.mapEbBillDto(ebBill, null);
  }

  async update(ebBillDto: EbBillDto): Promise<EbBillDto> {
    
    const tmp = this.findById(ebBillDto.billId);
    if (tmp == null) return null;

    /*const tmp1 = await this.findByCuf(ebBillDto.cuf);
    if (tmp1 != null) console.log(ebBillDto.billId);*/

    const ebBill = await this.prismaService.ebBill.update({
      where: {
        billId: Number(ebBillDto.billId),
      },
      data: {
        systemCode: ebBillDto.systemCode,
        cuf: ebBillDto.cuf,
        cufd: ebBillDto.cufd,
        billNumber: ebBillDto.billNumber,
        nitEmitter: Number(ebBillDto.nitEmitter),
        sucursalCode: ebBillDto.sucursalCode,
        salePointCode: ebBillDto.salePointCode,
        dateEmitte: ebBillDto.dateEmitte,
        billName: ebBillDto.billName,
        documentType: ebBillDto.documentType,
        billDocument: ebBillDto.billDocument,
        billComplement: ebBillDto.billComplement,
        address: ebBillDto.address,
        clientCode: ebBillDto.clientCode,
        paymentMethod: ebBillDto.paymentMethod,
        cardNumber: ebBillDto.cardNumber,
        amount: ebBillDto.amount,
        amountIva: ebBillDto.amountIva,
        amountDiscount: ebBillDto.amountDiscount,
        amountGiftCard: ebBillDto.amountGiftCard,
        coinCode: ebBillDto.coinCode,
        exchangeRate: ebBillDto.exchangeRate,
        legend: ebBillDto.legend,
        sectorDocumentCode: ebBillDto.sectorDocumentCode,
        modalityCode: ebBillDto.modalityCode,
        emitteType: ebBillDto.emitteType,
        documentTaxCode: ebBillDto.documentTaxCode,
        exceptionDocument: ebBillDto.exceptionDocument,
        billExternalCode: ebBillDto.billExternalCode,
        billedPeriod: ebBillDto.billedPeriod,        
        consumptionPeriod: ebBillDto.consumptionPeriod,  
        billNameEmitter: ebBillDto.billNameEmitter,
        municipality: ebBillDto.municipality,
        receptionCode: ebBillDto.receptionCode,
        statusCode: ebBillDto.statusCode,
        statusDescription: ebBillDto.statusDescription,
        reasonAnnulationCode: ebBillDto.reasonAnnulationCode,
        cafc: ebBillDto.cafc,
        email: ebBillDto.email,
        qr: ebBillDto.qr,
        note: ebBillDto.note,
        eventId: ebBillDto.eventId,
        addressBuyer: ebBillDto.addressBuyer,
        placeDestination: ebBillDto.placeDestination,
        codeCountry: ebBillDto.codeCountry,
        additionalInformation: ebBillDto.additionalInformation,
        billNumberRef:  ebBillDto.billNumberRef,
        cufRef: ebBillDto.cufRef ,
        dateEmitteRef: ebBillDto.dateEmitteRef,
        amountTotalOriginal: ebBillDto.amountTotalOriginal,
        amountTotalReturned: ebBillDto.amountTotalReturned,
        amountDiscountCreditDebit: ebBillDto.amountDiscountCreditDebit,
        amountEffectiveCreditDebit: ebBillDto.amountEffectiveCreditDebit,
        billIdRef: ebBillDto.billIdRef,
        user: ebBillDto.user,
        meterNumber:ebBillDto.meterNumber,
        beneficiarioLey1886:ebBillDto.beneficiarioLey1886,
        montoDescuentoLey1886:ebBillDto.montoDescuentoLey1886,
        montoDescuentoTarifaDignidad:ebBillDto.montoDescuentoTarifaDignidad,
        tasaAseo:ebBillDto.tasaAseo,
        tasaAlumbrado:ebBillDto.tasaAlumbrado,
        otrasTasas:ebBillDto.otrasTasas,
        studentName: ebBillDto.studentName,
        year: ebBillDto.year,
        month: ebBillDto.month,
        annulled: ebBillDto.annulled,
        package: {connect: { packageId: Number(ebBillDto.packageId) }},
        billStatus: { connect: { billStatusId: ebBillDto.billStatusId }}

      },
    });

    if (ebBillDto.details != null) {
      let numberDetail = ebBillDto.details.length;
      ebBillDto.details.map((item) => {
        if (item.order != null) return this.ebBillDetailService.update(item);
        else {
          numberDetail++;
          item.order = numberDetail;
          return this.ebBillDetailService.create(item);
        }
      });
    }
    const details: ebBillDetail[] = null;
    return this.mapEbBillDto(ebBill, details);
  }

  async updatePackageId(billId:number, packageId:number){
    const ebBill = await this.prismaService.ebBill.update({
      where: { billId: billId },
      data:{ packageId: packageId}
    });

    if (ebBill != null) {
      return this.mapEbBillDto(ebBill, null);
    }

    return null;
  }

  async findById(billId: number,includeDetail: boolean = false,): Promise<EbBillDto> {
    const ebBill = await this.prismaService.ebBill.findUnique({
      where: {
        billId: BigInt(billId),
      },
      include: {
        details: includeDetail,
      },
    });
    
    if (ebBill) {
      return this.mapEbBillDto(ebBill, ebBill.details);
    }
    else
      throw new NotFoundException("Bill not found");

  }

  async findByCuf(
    cuf: string,
    includeDetail: boolean = false,
  ): Promise<EbBillDto> {
    const ebBill = await this.prismaService.ebBill.findUnique({
      where: {
        cuf: cuf,
      },
      include: {
        details: includeDetail,
      },
    });

    if (ebBill != null) {
      return this.mapEbBillDto(ebBill, ebBill.details);
    }

    return null;
  }

  async findByCufAndNumber( cuf: string, billNumber:number, nit:number, includeDetail: boolean = false,  ): Promise<EbBillDto> {
    const ebBill = await this.prismaService.ebBill.findUnique({
      where: {
        cuf: cuf,
        billNumber: billNumber,
        nitEmitter: nit
      },
      include: {
        details: includeDetail,
      },
    });

    if (ebBill != null) {
      return this.mapEbBillDto(ebBill, ebBill.details);
    }
    else
      throw new NotFoundException("Bill not found");
  }

  async findByDateEmitter(ebSystemDto:EbSystemDto, sucursalCode:number, salePointCode:number, dateBegin:Date, dateEnd:Date){
    let list = null;
    if(salePointCode!=null){
      list = await this.prismaService.ebBill.findMany({
        where: {
          systemCode: ebSystemDto.systemCode,
          nitEmitter: ebSystemDto.nit,
          sucursalCode: sucursalCode,
          salePointCode: salePointCode,
          AND: [ { dateEmitte: { gte: dateBegin } }, {  dateEmitte: { lte: dateEnd } } ] ,
         
        },
        orderBy: [{ dateEmitte: 'desc' } ]
      });
    }
    else {
      list = await this.prismaService.ebBill.findMany({
        where: {
          systemCode: ebSystemDto.systemCode,
          nitEmitter: ebSystemDto.nit,
          sucursalCode: sucursalCode,
          AND: [ { dateEmitte: { gte: dateBegin } }, {  dateEmitte: { lte: dateEnd } } ] ,
         
        }
      });
    }
    
    if(list)
      return list.map(item => {
          return this.mapEbBillDto(item, null);
       })
  }

  async getBillWithoutPackageSector(ebSystemDto:EbSystemDto, sucursalCode:number, salePointCode:number,     
    emitteType:number, packageId:number, sectorDocumentCode:string){
      
     const list =  await this.prismaService.ebBill.findMany({
        where:{
            systemCode: ebSystemDto.systemCode,
            nitEmitter: ebSystemDto.nit,
            sucursalCode: sucursalCode,
            salePointCode: salePointCode,
            emitteType:emitteType,
            packageId:packageId,
            sectorDocumentCode:sectorDocumentCode
        }
    });
    if(list)
      return list.map(item => {
          return this.mapEbBillDto(item, null);
       })

    return null;
}

async getBillWithoutPackage(ebSystemDto:EbSystemDto, sucursalCode:number, salePointCode:number,     
    emitteType:number, packageId:number){
    
   const list =  await this.prismaService.ebBill.findMany({
      where:{
          systemCode: ebSystemDto.systemCode,
          nitEmitter: ebSystemDto.nit,
          sucursalCode: sucursalCode,
          salePointCode: salePointCode,
          emitteType:emitteType,
          packageId:packageId,
      }
  });

  if(list)
    return list.map(item => {
        return this.mapEbBillDto(item, null);
     })

  return null;
}

async findAll(pageOptionsDto:BillPageOptionsDto, ebSystemDto:EbSystemDto) {
  
  let where = {};

  if(pageOptionsDto.billId)
    where = { billId: BigInt(pageOptionsDto.billId), }

  else if(pageOptionsDto.cuf)
    where = { cuf: pageOptionsDto.cuf }
  else {
    where = {systemCode: ebSystemDto.systemCode,
      nitEmitter: ebSystemDto.nit,
      sucursalCode: +pageOptionsDto.sucursalCode,
      salePointCode: +pageOptionsDto.salePointCode,};

    if(pageOptionsDto.dateBegin && pageOptionsDto.dateEnd)
    {
    const dateBegin = new Date(pageOptionsDto.dateBegin + "T00:00:00.000Z");
    const dateEnd = new Date(pageOptionsDto.dateEnd + "T00:00:00.000Z");
    where['AND'] = [ { dateEmitte: { gte: dateBegin } }, {  dateEmitte: { lte: dateEnd } } ];
    }

    if(pageOptionsDto.number)
    where['billNumber'] = pageOptionsDto.number;
  }
  
  const itemCount = await this.prismaService.ebBill.count({
    where: where
  });
  const bills = await this.prismaService.ebBill.findMany({
    skip: pageOptionsDto.skip,
    take: +pageOptionsDto.take,
    orderBy: { [pageOptionsDto.orderBy]: pageOptionsDto.order },
    where: where,
    include: {details: true }
  });

  const ebBillsDto = bills.map( item => { return this.mapEbBillDto( item, item.details)  });

  const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
  return new PageDto(ebBillsDto, pageMetaDto);
}

  mapEbBillDto(ebBill: ebBill, details: ebBillDetail[]): EbBillDto {
    const ebBillDto = new EbBillDto();

    ebBillDto.billId = Number(ebBill.billId);
    ebBillDto.systemCode = ebBill.systemCode;
    ebBillDto.cuf = ebBill.cuf;
    ebBillDto.cufd = ebBill.cufd;
    ebBillDto.billNumber = ebBill.billNumber;
    ebBillDto.nitEmitter = Number(ebBill.nitEmitter);
    ebBillDto.sucursalCode = ebBill.sucursalCode;
    ebBillDto.salePointCode = ebBill.salePointCode;
    ebBillDto.dateEmitte = ebBill.dateEmitte;
    ebBillDto.billName = ebBill.billName;
    ebBillDto.documentType = ebBill.documentType;
    ebBillDto.billDocument = ebBill.billDocument;
    ebBillDto.billComplement = ebBill.billComplement;
    ebBillDto.address = ebBill.address;
    ebBillDto.clientCode = ebBill.clientCode;
    ebBillDto.paymentMethod = ebBill.paymentMethod;
    ebBillDto.cardNumber = ebBill.cardNumber;
    ebBillDto.amount = ebBill.amount;
    ebBillDto.amountIva = ebBill.amountIva;
    ebBillDto.amountDiscount = ebBill.amountDiscount;
    ebBillDto.amountGiftCard = ebBill.amountGiftCard;
    ebBillDto.coinCode = ebBill.coinCode;
    ebBillDto.exchangeRate = ebBill.exchangeRate;
    ebBillDto.legend = ebBill.legend;
    ebBillDto.sectorDocumentCode = ebBill.sectorDocumentCode;
    ebBillDto.modalityCode = ebBill.modalityCode;
    ebBillDto.emitteType = ebBill.emitteType;
    ebBillDto.documentTaxCode = ebBill.documentTaxCode;
    ebBillDto.exceptionDocument = ebBill.exceptionDocument;
    ebBillDto.billExternalCode = ebBill.billExternalCode;
    ebBillDto.billedPeriod = ebBill.billedPeriod;
    ebBillDto.consumptionPeriod = ebBill.consumptionPeriod;
    ebBillDto.billStatusId = ebBill.billStatusId;
    ebBillDto.packageId = Number(ebBill.packageId);
    ebBillDto.billNameEmitter = ebBill.billNameEmitter;
    ebBillDto.municipality = ebBill.municipality;
    ebBillDto.receptionCode = ebBill.receptionCode;
    ebBillDto.statusCode = ebBill.statusCode;
    ebBillDto.statusDescription = ebBill.statusDescription;
    ebBillDto.reasonAnnulationCode = ebBill.reasonAnnulationCode;
    ebBillDto.cafc = ebBill.cafc;
    ebBillDto.email = ebBill.email;
    ebBillDto.qr = ebBill.qr;
    ebBillDto.eventId = ebBill.eventId;
    ebBillDto.createdAt = ebBill.createdAt;
    ebBillDto.note = ebBill.note;

    ebBillDto.addressBuyer = ebBill.addressBuyer;
    ebBillDto.placeDestination = ebBill.placeDestination ;
    ebBillDto.codeCountry = ebBill.codeCountry ;
    ebBillDto.additionalInformation = ebBill.additionalInformation ;

    ebBillDto.billNumberRef = ebBill.billNumberRef ;
    ebBillDto.cufRef = ebBill.cufRef ;
    ebBillDto.dateEmitteRef = ebBill.dateEmitteRef ;
    ebBillDto.billIdRef = Number(ebBill.billIdRef);
    ebBillDto.amountTotalOriginal = ebBill.amountTotalOriginal ;
    ebBillDto.amountTotalReturned = ebBill.amountTotalReturned ;
    ebBillDto.amountDiscountCreditDebit = ebBill.amountDiscountCreditDebit ;
    ebBillDto.amountEffectiveCreditDebit = ebBill.amountEffectiveCreditDebit ;
    ebBillDto.user = ebBill.user;

    ebBillDto.meterNumber = ebBill.meterNumber;
    ebBillDto.beneficiarioLey1886 = ebBill.beneficiarioLey1886;
    ebBillDto.montoDescuentoLey1886 =ebBill.montoDescuentoLey1886;
    ebBillDto.montoDescuentoTarifaDignidad =ebBill.montoDescuentoTarifaDignidad;
    ebBillDto.tasaAseo = ebBill.tasaAseo;
    ebBillDto.tasaAlumbrado = ebBill.tasaAlumbrado;
    ebBillDto.otrasTasas = ebBill.otrasTasas;
    ebBillDto.studentName = ebBill.studentName;
    ebBillDto.year = ebBill.year;
    ebBillDto.month = ebBill.month;
    ebBillDto.annulled = ebBill.annulled;

    if (details != null && details.length > 0) {
      ebBillDto.details = details.map((item) => {
        return this.ebBillDetailService.mapEbBillDetailDto(item);
      });
    }

    return ebBillDto;
  }
}
