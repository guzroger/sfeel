import { Module } from "@nestjs/common";
import { CommonModule } from "./common/common.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { WebServiceModule } from "./webservice/webservice.module";
import { ModelModule } from "./model/model.module";
import { BillModule } from "./bill/bill.module";
import { ManagerModule } from "./manager/manager.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CommonModule,
    WebServiceModule,
    PrismaModule,
    ModelModule,
    BillModule,
    ManagerModule,
    AuthModule
  ],
  providers: []
})
export class AppModule {}
