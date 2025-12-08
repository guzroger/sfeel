import { PrismaClient } from "@prisma/client";
import { GeConstantSeed } from "./data/ge-constant.seed";
import { EbPackageBillSeed } from "./data/eb-package-bill.seed";
import { EbSectorDocumentSeed } from "./data/eb-sector-document.seed";
import { EbSystemDto } from "src/model/dto/ebSystem.dto";
import { EbSystemSeed } from "./data/eb-system.seed";
import { GeConstantGroupSeed } from "./data/ge-constant-group.seed";
import { EbBillStatusSedd } from "./data/eb-bill-status.seed";

const prisma = new PrismaClient();

async function main(){
  await prisma.geConstantGroup.createMany({
    data: GeConstantGroupSeed
  });
  
  await prisma.geConstant.createMany({
    data: GeConstantSeed
  });

  await prisma.ebBillStatus.createMany({
    data: EbBillStatusSedd
  });

  await prisma.ebPackageBill.createMany({
    data: EbPackageBillSeed
  });

  await prisma.ebSectorDocument.createMany({
    data: EbSectorDocumentSeed
  });

  prisma.ebSystem.createMany({
    data: EbSystemSeed
  });
}

main().catch((e)=> {
  console.error(e);
  process.exit(1);
})
.finally( async() => {
  await prisma.$disconnect();
} );