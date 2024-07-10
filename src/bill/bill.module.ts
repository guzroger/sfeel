import { Module } from '@nestjs/common';
import { BillController } from './bill.controller';

import { MapperService } from '../common/mapper.service';
import { ContingencyService } from '../contingency/contingency.service';
import { ModelModule } from 'src/model/model.module';
import { BillService } from './bill.service';
import { CatalogueModule } from 'src/catalogue/catalogue.module';
import { CommonModule } from 'src/common/common.module';
import { ContingencyModule } from 'src/contingency/contingency.module';

@Module({
  imports: [ModelModule,  CommonModule, ContingencyModule],
  controllers: [BillController],
  providers: [BillService]
})
export class BillModule {}
