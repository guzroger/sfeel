import { Module } from '@nestjs/common';
import { BillController } from './bill.controller';
import { CataloqueController } from './catalogue.controller';
import { CataloguqeService } from './catalogue.service';
import { MapperService } from './dto/mapper.service';
import { ContingencyController } from './contingency.controller';
import { ContingencyService } from './contingency.service';
import { PackageController } from './package.controller';
import { BillingModule } from 'src/billing/billing.module';
import { ModelModule } from 'src/model/model.module';

@Module({
  imports: [BillingModule, ModelModule],
  controllers: [BillController, CataloqueController, ContingencyController, PackageController],
  providers: [CataloguqeService, MapperService, ContingencyService, MapperService],
  exports: [MapperService, ContingencyService],
})
export class BillModule {}
