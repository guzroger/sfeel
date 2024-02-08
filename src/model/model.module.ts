import { Global, Module } from "@nestjs/common";
import { EbCuisService } from "./ebCuis.service";
import { EbCufdService } from "./ebCufd.service";
import { EbSystemService } from "./ebSystem.service";
import { SynDateHourService } from "./synDateHour.service";
import { SynCatalogueService } from "./synCatalogue.service";
import { SynInvoiceLegendService } from "./synInvoiceLegend.service";
import { SynActivityService } from "./synActivity.service";
import { SynProductServiceService } from "./synProductService.service";
import { EbSectorDocumentService } from "./ebSectorDocument.service";
import { EbSucursalService } from "./ebSucursal.service";
import { EbSalePointService } from "./ebSalePoint.service";
import { EbBillService } from "./ebBill.service";
import { EbBillDetailService } from "./ebBillDetail.service";
import { AppCertificateService } from "./appCertificate.service";
import { EbEventService } from "./ebEvent.service";
import { GeConstantService } from "./geConstant.service";
import { EbTransactionService } from "./ebTransaction.service";
import { EbTransactionMessageService } from "./ebTransactionMessage.service";
import { EbPackageBillService } from "./ebPackageBill.service";
import { EbBillFileService } from "./ebBillFile.service";
import { EbPackageFileService } from "./ebPackageFile.service";
import { EbDosificationService } from "./ebDosification.service";

@Global()
@Module({
  imports: [],
  providers: [
    EbCuisService,
    EbCufdService,
    EbSystemService,
    SynDateHourService,
    SynCatalogueService,
    SynInvoiceLegendService,
    SynActivityService,
    SynProductServiceService,
    EbSectorDocumentService,
    EbSucursalService,
    EbSalePointService,
    AppCertificateService,
    EbBillService,
    EbBillDetailService,
    EbEventService,
    GeConstantService,
    EbTransactionService,
    EbTransactionMessageService,
    EbPackageBillService,
    EbBillFileService,
    EbPackageFileService,
    EbDosificationService
  ],
  exports: [
    EbCuisService,
    EbCufdService,
    EbSystemService,
    SynDateHourService,
    SynCatalogueService,
    SynInvoiceLegendService,
    SynActivityService,
    SynProductServiceService,
    EbSectorDocumentService,
    EbSucursalService,
    EbSalePointService,
    AppCertificateService,
    EbBillService,
    EbBillDetailService,
    EbEventService,
    GeConstantService,
    EbTransactionService,
    EbPackageBillService,
    EbBillFileService,
    EbPackageFileService,
    EbDosificationService
  ],
})
export class ModelModule {}
