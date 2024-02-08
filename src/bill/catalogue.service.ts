import { Injectable } from "@nestjs/common";
import { SynCatalogueService } from '../model/synCatalogue.service';
import { EbSystemService } from '../model/ebSystem.service';
import { ParameterService } from '../common/parameter.service';
import { SynCatalogueDto } from "src/model/dto/synCatalogue.dto";
import { SynProductServiceService } from '../model/synProductService.service';
import { Parameters } from "src/common/parameters";

@Injectable()
export class CataloguqeService {
    constructor(private synCatalogueService:SynCatalogueService, 
        private ebSystemService:EbSystemService, 
        private parameterService:ParameterService, 
        private synProductServiceService:SynProductServiceService){}

    async getCatalogue(nit:number, type:string):Promise<SynCatalogueDto[]> {
        const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit(Parameters.codigoSistema, nit);
        const list = await this.synCatalogueService.findByTypeSystemCodeNitVisible(type, ebSystemDto.systemCode, nit)

        return list;
    }

    async getCatalogueType(){
        return this.synCatalogueService.listTypes();
    }

    async getProductService(nit:number){
        return this.synProductServiceService.findBySystemCodeNit(Parameters.codigoSistema, nit);
    }
}