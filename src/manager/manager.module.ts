import { Module } from "@nestjs/common";
import { ManagerController } from "./manager.controller";
import { ParameterService } from "src/common/parameter.service";
import { BillingCodeService } from "src/billing/billingCode.service";
import { SynchronizationService } from "src/billing/synchronization.service";
import { ManagerService } from "./manager.service";
import { PackageBillingService } from "src/billing/packageBilling.service";
import { ContingencyService } from "src/bill/contingency.service";
import { MapperService } from "src/bill/dto/mapper.service";
import { BillingService } from "src/billing/billing.service";

@Module({
    imports:[],
    controllers:[ManagerController],
    providers:[ParameterService, BillingCodeService, SynchronizationService, ManagerService, PackageBillingService, ContingencyService, MapperService, BillingService],
    exports:[ParameterService]
})
export class ManagerModule {

}