import { Controller, Get, Param } from "@nestjs/common";
import { CataloguqeService } from './catalogue.service';
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ParameterService } from "src/common/parameter.service";
import { HealthService } from '../common/health.service';

@ApiTags('cat')
@Controller("cat")
export class CataloqueController {
    constructor(private cataloguqeService:CataloguqeService, private parameterService:ParameterService, private healthService:HealthService ){}
    
    
    @ApiOperation({
        summary: 'Get List Catalogue by type',
        description: 'Get List Catalogue by type',
    })
    @ApiParam({ name : "type"})
    @ApiParam({ name : "nit"})
    @Get('catalogue/:type/:nit')
    async catalogue(@Param() params: any){
        if(params.type==='ProductService')
            return this.cataloguqeService.getProductService(params.nit);
        
        return this.cataloguqeService.getCatalogue(params.nit, params.type);
    }

    @Get('catalogueType')
    @ApiOperation({
        summary: 'Get List Type Catalogue available',
        description: 'Get List Type Catalogue available',
    })
    async catalogueType(){
        let types = await this.cataloguqeService.getCatalogueType();
        types.push("ProductService");
        return  { "type": types };
    }
    
    @Get('test')
    async test(){
        return this.healthService.isConnectionOnLine();
    }

}