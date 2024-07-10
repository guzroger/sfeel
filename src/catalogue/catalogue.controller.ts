import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { CatalogueService } from './catalogue.service';
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ParameterService } from "src/common/parameter.service";
import { HealthService } from '../common/health.service';

@ApiTags('cat')
@Controller("cat")
export class CataloqueController {
    constructor(private catalogueService:CatalogueService,
         private parameterService:ParameterService,
        private healthService:HealthService ){}
    
    
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
                return this.catalogueService.getProductServiceHomologate(params.nit);
            
            return this.catalogueService.getCatalogueHomologate(params.nit, params.type);
        }
        else{
            if(params.type==='ProductService')
                return this.catalogueService.getProductService(params.nit);
            
            return this.catalogueService.getCatalogue(params.nit, params.type);
        }
        
    }

    @Get('catalogueType')
    @ApiOperation({
        summary: 'Get List Type Catalogue available',
        description: 'Get List Type Catalogue available',
    })
    async catalogueType(){
        let types = await this.catalogueService.getCatalogueType();
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
            return this.catalogueService.homologateProductService(params.nit, body.activityCode, body.code, body.codeHomologated, body.description);
        
        return this.catalogueService.homologateCatalogue(params.nit, params.type, body.code, body.codeHomologated, body.description);
    }


    @ApiParam({ name : "type"})
    @ApiParam({ name : "nit"})
    @ApiParam({ name : "id"})
    @Delete('catalogue/:type/:nit/homologated/:id')
    async deleteHomologacion(@Param() params: any) {
        if(params.type==='ProductService')
            return this.catalogueService.deleteHomologateProductService(params.nit, params.id);
        
        return this.catalogueService.deleteHomologateCatalogue(params.nit, params.id, params.type);
    }

    

}