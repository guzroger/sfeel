import { Module } from "@nestjs/common";
import { CommonModule } from "./common/common.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { WebServiceModule } from "./webservice/webservice.module";
import { ModelModule } from "./model/model.module";
import { BillModule } from "./bill/bill.module";
import { ManagerModule } from "./manager/manager.module";
import { AuthModule } from "./auth/auth.module";
import { ContingencyModule } from "./contingency/contingency.module";
import { PackageBillingModule } from "./package-billing/package-billing.module";
import { SynchronizationModule } from "./synchronization/synchronization.module";
import { CatalogueModule } from "./catalogue/catalogue.module";
import { SucursalModule } from "./sucursal/sucursal.module";
import { SystemModule } from "./system/system.module";
import { TokenModule } from "./token/token.module";
import { CertificateModule } from "./certificate/certificate.module";


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CommonModule,
    WebServiceModule,
    PrismaModule,
    ModelModule,
    BillModule,
    ManagerModule,
    AuthModule,
    
    ContingencyModule,
    PackageBillingModule,
    SynchronizationModule,
    CatalogueModule,

    SucursalModule,
    SystemModule,
    TokenModule,
    CertificateModule
  ],
  providers: []
})
export class AppModule {}
