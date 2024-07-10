import { Global, Module } from '@nestjs/common';
import { SoapRequestService } from './soapRequest.service';
import { ParameterService } from './parameter.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoggerInterceptor } from './interceptor/logger.interceptor';
import { SignerXmlService } from './signerXml.service';
import { TerminusModule } from '@nestjs/terminus';
import { HealthService } from './health.service';
import { HttpModule } from '@nestjs/axios';
import { MailerService } from './mailer.service';
import { BillingCodeService } from './billingCode.service';
import { DocumentBillService } from './document-bill.service';
import { MapperService } from './mapper.service';
import { BillXmlService } from './bill-xml.service';
import { CommonController } from './common.controller';


@Global()
@Module({
  controllers: [CommonController],
  imports: [PrismaModule, TerminusModule, HttpModule],
  providers: [
    SoapRequestService,
    ParameterService,
    PrismaService,
    LoggerInterceptor,
    SignerXmlService,
    HealthService,
    MailerService,
    BillingCodeService,
    DocumentBillService,
    MapperService,
    BillXmlService
  ],
  exports: [SoapRequestService, ParameterService, LoggerInterceptor, 
    SignerXmlService, HealthService, MailerService, BillingCodeService, DocumentBillService, MapperService, BillXmlService],
})
export class CommonModule {}
