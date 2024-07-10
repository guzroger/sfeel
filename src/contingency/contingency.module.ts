import { Module } from "@nestjs/common";
import { CommonModule } from "src/common/common.module";
import { ContingencyService } from "./contingency.service";
import { ContingencyController } from "./contingency.controller";

@Module({
  controllers:[ContingencyController],
  imports: [CommonModule],
  providers:[ContingencyService],
  exports: [ContingencyService]
})
export class ContingencyModule {}