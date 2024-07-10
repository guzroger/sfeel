import { Module } from "@nestjs/common";
import { PackageController } from "./package.controller";
import { PackageBillingService } from "./packageBilling.service";

@Module({
  controllers:[PackageController],
  imports:[],
  providers:[PackageBillingService],
  exports: [PackageBillingService]
})
export class PackageBillingModule {}