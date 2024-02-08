import { Module } from '@nestjs/common';
import { BillController } from './bill.controller';
import { BillingService } from 'src/billing/billing.service';
import { BillingCodeService } from 'src/billing/billingCode.service';
import { CataloqueController } from './catalogue.controller';
import { SynCatalogueService } from 'src/model/synCatalogue.service';
import { CataloguqeService } from './catalogue.service';
import { MapperService } from './dto/mapper.service';
import { ContingencyController } from './contingency.controller';
import { ContingencyService } from './contingency.service';
import { PackageBillingService } from 'src/billing/packageBilling.service';
import { PackageController } from './package.controller';

@Module({
  imports: [],
  controllers: [BillController, CataloqueController, ContingencyController, PackageController],
  providers: [BillingService, BillingCodeService , SynCatalogueService, CataloguqeService, MapperService, ContingencyService,  PackageBillingService],
  exports: [MapperService],
})
export class BillModule {}
