import { Module } from "@nestjs/common";
import { ManagerController } from "./manager.controller";
import { ParameterService } from "src/common/parameter.service";
import { ManagerService } from "./manager.service";
import { MapperService } from "src/bill/dto/mapper.service";
import { BillingModule } from "src/billing/billing.module";
import { BillModule } from "src/bill/bill.module";
import { CommonModule } from "src/common/common.module";

@Module({
    imports:[BillingModule, BillModule, CommonModule],
    controllers:[ManagerController],
    providers:[ManagerService],
    exports:[]
})
export class ManagerModule {

}