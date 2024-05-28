import { Global, Module } from '@nestjs/common';
import { SoapRequestService } from './soapRequest.service';
import { ParameterService } from './parameter.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoggerInterceptor } from './logger.interceptor';
import { SignerXmlService } from './signerXml.service';
import { TerminusModule } from '@nestjs/terminus';
import { HealthService } from './health.service';
import { HttpModule } from '@nestjs/axios';
import { MailerService } from './mailer.service';


@Global()
@Module({
  imports: [PrismaModule, TerminusModule, HttpModule],
  providers: [
    SoapRequestService,
    ParameterService,
    PrismaService,
    LoggerInterceptor,
    SignerXmlService,
    HealthService,
    MailerService
  ],
  exports: [SoapRequestService, ParameterService, LoggerInterceptor, SignerXmlService, HealthService, MailerService],
})
export class CommonModule {}
