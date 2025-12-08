import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EbBillDetailDto } from './dto/ebBillDetail.dto';
//import { EbBillDto } from './dto/ebBill.dto';
import { ebBillDetail } from '@prisma/client';

@Injectable()
export class EbBillDetailService {
  constructor(private prismaService: PrismaService) {}

  async create(ebBillDetailDto: EbBillDetailDto): Promise<EbBillDetailDto> {
    if (ebBillDetailDto.billId == null || ebBillDetailDto.order == null) {
      return null;
    }

    const tmp = await this.findById(
      ebBillDetailDto.billId,
      ebBillDetailDto.order,
    );
    if (tmp != null) return tmp;
    
    const ebBillDetail = await this.prismaService.ebBillDetail.create({
      data: {
        billId: Number(ebBillDetailDto.billId),
        economicActivity: ebBillDetailDto.economicActivity,
        productCodeSin: ebBillDetailDto.productCodeSin,
        productCode: ebBillDetailDto.productCode,
        description: ebBillDetailDto.description,
        quantity: ebBillDetailDto.quantity,
        measureCode: ebBillDetailDto.measureCode,
        measure: ebBillDetailDto.measure,
        unitPrice: ebBillDetailDto.unitPrice,
        amountDiscount: ebBillDetailDto.amountDiscount,
        subtotal: ebBillDetailDto.subTotal,
        order: ebBillDetailDto.order,
        serieNumber: ebBillDetailDto.serieNumber,
        imeiNumber: ebBillDetailDto.imeiNumber,
        codeTransactionDetail: ebBillDetailDto.codeTransactionDetail,
        numberItem:ebBillDetailDto.numberItem,
        taxable:ebBillDetailDto.taxable,
        typeDetail:ebBillDetailDto.typeDetail
      },
    });

    return this.mapEbBillDetailDto(ebBillDetail);
  }

  async update(ebBillDetailDto: EbBillDetailDto): Promise<EbBillDetailDto> {
    if (ebBillDetailDto.billId != null && ebBillDetailDto.order != null) {
      const tmp = await this.findById(
        ebBillDetailDto.billId,
        ebBillDetailDto.order,
      );
      if (tmp == null) return null;
    }

    const ebBillDetail = await this.prismaService.ebBillDetail.update({
      where: {
        billId_order: {
          billId: Number(ebBillDetailDto.billId),
          order: ebBillDetailDto.order,
        },
      },
      data: {
        economicActivity: ebBillDetailDto.economicActivity,
        productCodeSin: ebBillDetailDto.productCodeSin,
        productCode: ebBillDetailDto.productCode,
        description: ebBillDetailDto.description,
        quantity: ebBillDetailDto.quantity,
        measureCode: ebBillDetailDto.measureCode,
        measure: ebBillDetailDto.measure,
        unitPrice: ebBillDetailDto.unitPrice,
        amountDiscount: ebBillDetailDto.amountDiscount,
        subtotal: ebBillDetailDto.subTotal,
        serieNumber: ebBillDetailDto.serieNumber,
        imeiNumber: ebBillDetailDto.imeiNumber,
        codeTransactionDetail: ebBillDetailDto.codeTransactionDetail,
        numberItem:ebBillDetailDto.numberItem,
        taxable:ebBillDetailDto.taxable,
        typeDetail:ebBillDetailDto.typeDetail
      },
    });

    return this.mapEbBillDetailDto(ebBillDetail);
  }

  async findById(billId: number, order: number): Promise<EbBillDetailDto> {
    const ebBillDetail = await this.prismaService.ebBillDetail.findUnique({
      where: {
        billId_order: { billId: Number(billId), order: order },
      },
    });

    if (ebBillDetail != null) return this.mapEbBillDetailDto(ebBillDetail);

    return null;
  }
  async findByBillId(billId: number): Promise<EbBillDetailDto[]> {
    const list = await this.prismaService.ebBillDetail.findMany({
      where: {
        billId: Number(billId),
      },
    });

    if (list != null) {
      return list.map((item) => {
        return this.mapEbBillDetailDto(item);
      });
    }

    return null;
  }

  mapEbBillDetailDto(ebBillDetail: ebBillDetail): EbBillDetailDto {
    const ebBillDetailDto = new EbBillDetailDto();

    ebBillDetailDto.billId = Number(ebBillDetail.billId);
    ebBillDetailDto.productCodeSin = ebBillDetail.productCodeSin;
    ebBillDetailDto.productCode = ebBillDetail.productCode;
    ebBillDetailDto.description = ebBillDetail.description;
    ebBillDetailDto.quantity = ebBillDetail.quantity;
    ebBillDetailDto.measureCode = ebBillDetail.measureCode;
    ebBillDetailDto.measure = ebBillDetail.measure;

    ebBillDetailDto.measure = ebBillDetail.measure;
    ebBillDetailDto.unitPrice = ebBillDetail.unitPrice;
    ebBillDetailDto.amountDiscount = ebBillDetail.amountDiscount;
    ebBillDetailDto.subTotal = ebBillDetail.subtotal;
    ebBillDetailDto.order = ebBillDetail.order;
    ebBillDetailDto.economicActivity = ebBillDetail.economicActivity;
    ebBillDetailDto.serieNumber = ebBillDetail.serieNumber;
    ebBillDetailDto.imeiNumber = ebBillDetail.imeiNumber;

    ebBillDetailDto.codeTransactionDetail = ebBillDetail.codeTransactionDetail;
    ebBillDetailDto.numberItem = ebBillDetail.numberItem;
    ebBillDetailDto.taxable = ebBillDetail.taxable;
    ebBillDetailDto.typeDetail = ebBillDetail.typeDetail;

    return ebBillDetailDto;
  }
}
