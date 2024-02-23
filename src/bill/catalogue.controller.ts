import { Body, Controller, Get, Param, Post } from "@nestjs/common";
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
    @Get(['catalogue/:type/:nit', 'catalogue/:type/:nit/:homologated'])
    async catalogue(@Param() params: any){
        if(params.homologated && params.homologated==='homologated'){
            if(params.type==='ProductService')
                return this.cataloguqeService.getProductServiceHomologate(params.nit);
            
            return this.cataloguqeService.getCatalogueHomologate(params.nit, params.type);
        }
        else{
            if(params.type==='ProductService')
                return this.cataloguqeService.getProductService(params.nit);
            
            return this.cataloguqeService.getCatalogue(params.nit, params.type);
        }
        
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

    @ApiParam({ name : "type"})
    @ApiParam({ name : "nit"})
    @Post('catalogue/:type/:nit/homologacion')
    async catalogueHomologacion(@Param() params: any, @Body() body:any ){
        if(params.type==='ProductService')
            return this.cataloguqeService.homologateProductService(params.nit, body.activityCode, body.code, body.codeHomologated, body.description);
        
        return this.cataloguqeService.homologateCatalogue(params.nit, params.type, body.code, body.codeHomologated, body.description);
    }

}