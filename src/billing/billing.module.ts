import { Module } from '@nestjs/common';
import { BillingCodeService } from './billingCode.service';
import { PackageBillingService } from './packageBilling.service'
import { ManagerService } from 'src/manager/manager.service';

@Module({
  imports: [ManagerService],
  providers: [BillingCodeService, PackageBillingService, ManagerService],
  exports: [BillingCodeService, PackageBillingService, ManagerService ],
})
export class BillingModule {}
