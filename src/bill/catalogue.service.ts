import { ConflictException, Injectable } from "@nestjs/common";
import { SynCatalogueService } from '../model/synCatalogue.service';
import { EbSystemService } from '../model/ebSystem.service';
import { ParameterService } from '../common/parameter.service';
import { SynCatalogueDto } from "src/model/dto/synCatalogue.dto";
import { SynProductServiceService } from '../model/synProductService.service';
import { Parameters } from "src/common/parameters";
import { EbHomologationCatalogueService } from "src/model/ebHomologationCatalogue.service";
import { EbHomologationProductServiceService } from "src/model/ebHomologationProductService.service";
import { EbHomologationCatalogueDto } from "src/model/dto/ebHomologationCatalogue.dto";
import { EbHomologationProductServiceDto } from "src/model/dto/ebHomologationProductService.dto";
import { SynProductServiceDto } from "src/model/dto/synProductService.dto";

@Injectable()
export class CataloguqeService {
    constructor(private synCatalogueService:SynCatalogueService, 
        private ebSystemService:EbSystemService, 
        private parameterService:ParameterService, 
        private synProductServiceService:SynProductServiceService,
        private ebHomologationCatalogueService: EbHomologationCatalogueService,
        private ebHomologationProductServiceService: EbHomologationProductServiceService){}

    async getCatalogue(nit:number, type:string):Promise<SynCatalogueDto[]> {
        const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit(Parameters.codigoSistema, nit);
        const list = await this.synCatalogueService.findByTypeSystemCodeNitVisible(type, ebSystemDto.systemCode, nit)

        return list;
    }

    async getCatalogueHomologate(nit:number, type:string):Promise<EbHomologationCatalogueDto[]> {
        const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit(Parameters.codigoSistema, nit);
        const list = await this.ebHomologationCatalogueService.findByTypeSystemCodeNit(type, ebSystemDto.systemCode, nit)

        return list;
    }

    async getCatalogueType(){
        return this.synCatalogueService.listTypes();
    }

    async getProductService(nit:number){
        return this.synProductServiceService.findBySystemCodeNit(Parameters.codigoSistema, nit);
    }

    async getProductServiceHomologate(nit:number){
        return this.ebHomologationProductServiceService.findBySystemCodeNit(Parameters.codigoSistema, nit);
    }

    async homologateCatalogue(nit:number, type:string, code:string, codeHomologated:string, description:string){
        const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit(Parameters.codigoSistema, nit);

        const tmp = await this.ebHomologationCatalogueService.findById(code, ebSystemDto.systemCode, ebSystemDto.nit, type);
        const ebHomologationCatalogueDto  = new EbHomologationCatalogueDto();
        ebHomologationCatalogueDto.code = code;
        ebHomologationCatalogueDto.systemCode = ebSystemDto.systemCode;
        ebHomologationCatalogueDto.nit = ebSystemDto.nit,
        ebHomologationCatalogueDto.type = type;
        ebHomologationCatalogueDto.codeHomologated = codeHomologated;
        ebHomologationCatalogueDto.description = description;

        if(!tmp){
            const synCatalogueDto = new SynCatalogueDto(); 
            synCatalogueDto.code = code;
            synCatalogueDto.type = type;
            synCatalogueDto.systemCode = ebSystemDto.systemCode;
            synCatalogueDto.nit = ebSystemDto.nit;
            
            const t = await this.synCatalogueService.findById(synCatalogueDto);
            if(!t)
                throw new ConflictException("Catalog not found");

            return this.ebHomologationCatalogueService.create(ebHomologationCatalogueDto);
        }
        else
            return this.ebHomologationCatalogueService.update(ebHomologationCatalogueDto);

    }

    async homologateProductService(nit:number, activityCode:string, productCode:string, codeHomologated:string, description:string){
        const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit(Parameters.codigoSistema, nit);

        const tmp = await this.ebHomologationProductServiceService.findById(productCode, ebSystemDto.systemCode, ebSystemDto.nit, activityCode);

        const ebHomologationProductServiceDto = new EbHomologationProductServiceDto();
        ebHomologationProductServiceDto.productCode = productCode;
        ebHomologationProductServiceDto.systemCode = ebSystemDto.systemCode;
        ebHomologationProductServiceDto.nit = ebSystemDto.nit;
        ebHomologationProductServiceDto.activityCode = activityCode;
        ebHomologationProductServiceDto.codeHomologated = codeHomologated;
        ebHomologationProductServiceDto.description = description;

        if(!tmp){
            const synProductServiceDto = new SynProductServiceDto();
            synProductServiceDto.productCode = productCode;
            synProductServiceDto.systemCode = ebSystemDto.systemCode;
            synProductServiceDto.nit = ebSystemDto.nit;
            synProductServiceDto.activityCode = activityCode;

            const t = await this.synProductServiceService.findById(synProductServiceDto);


            if(!t)
                throw new ConflictException("ProductService not found");


            return this.ebHomologationProductServiceService.create(ebHomologationProductServiceDto);
        }
        else
            return this.ebHomologationProductServiceService.update(ebHomologationProductServiceDto);

    }

    async deleteHomologateProductService(nit:number,  codeHomologated:string){
        const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit(Parameters.codigoSistema, nit);

        this.ebHomologationProductServiceService.delete( ebSystemDto.systemCode, ebSystemDto.nit, codeHomologated);
    }


    async deleteHomologateCatalogue(nit:number, codeHomologated:string, type:string){
        const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit(Parameters.codigoSistema, nit);
        this.ebHomologationCatalogueService.delete(codeHomologated, ebSystemDto.systemCode, ebSystemDto.nit, type);
    }
}