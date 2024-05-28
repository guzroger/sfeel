import { Module } from '@nestjs/common';
import { BillingCodeService } from './billingCode.service';
import { PackageBillingService } from './packageBilling.service'
import { DocumentBillService } from './document-bill.service';
import { MapperService } from 'src/bill/dto/mapper.service';
import { BillingService } from './billing.service';
import { ContingencyService } from 'src/bill/contingency.service';
import { SynchronizationService } from './synchronization.service';

@Module({
  imports: [],
  providers: [BillingCodeService, PackageBillingService, DocumentBillService, MapperService, BillingService,  ContingencyService, SynchronizationService, DocumentBillService],
  exports: [BillingCodeService, PackageBillingService, BillingService, SynchronizationService, DocumentBillService], 
})
export class BillingModule {}
