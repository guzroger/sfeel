import { Module } from "@nestjs/common";
import { ManagerController } from "./manager.controller";
import { ParameterService } from "src/common/parameter.service";
import { ManagerService } from "./manager.service";
import { BillModule } from "src/bill/bill.module";
import { PackageBillingModule } from "src/package-billing/package-billing.module";
import { ContingencyModule } from "src/contingency/contingency.module";

@Module({
    imports:[PackageBillingModule, ContingencyModule],
    controllers:[ManagerController],
    providers:[ManagerService],
    exports:[]
})
export class ManagerModule {

}