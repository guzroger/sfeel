import { Module } from "@nestjs/common";
import { CataloqueController } from "./catalogue.controller";
import { CatalogueService } from "./catalogue.service";

@Module({
  controllers:[CataloqueController],
  imports: [],
  providers:[CatalogueService],
  exports: [CatalogueService]
})
export class CatalogueModule{}