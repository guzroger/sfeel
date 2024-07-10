import { Module } from "@nestjs/common";
import { SynchronizationService } from "./synchronization.service";
import { SynchronizationController } from "./synchronization.controller";

@Module({
  controllers:[SynchronizationController],
  imports:[],
  providers:[SynchronizationService],
  exports: [SynchronizationService]
})
export class SynchronizationModule{}