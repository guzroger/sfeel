import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreatePackagesDto } from "./dto/createPackages.dto";
import { Parameters } from "src/common/parameters";
import { SendPackage } from "./dto/sendPackage.dto";
import { PackageBillingService } from "src/billing/packageBilling.service";
import { EbSystemService } from "src/model/ebSystem.service";

@ApiTags('package')
@Controller('package')
export class PackageController {
    
    constructor(
        private ebSystemService: EbSystemService,    
        private packageBillingService:PackageBillingService,){}
    
    @ApiOperation({
        summary: 'Create package by list bills',
        description: 'Method for create packages from a list of bills',
    })
    @Post('create')
    @ApiBody({ type: CreatePackagesDto, description: 'Body' })
    async createPackages( @Body()  createPackagesDto:CreatePackagesDto){
        const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit( Parameters.codigoSistema,createPackagesDto.nit,);
        const listPackages = this.packageBillingService.createPackages(ebSystemDto, createPackagesDto.sucursalCode, createPackagesDto.salePointCode, 
            createPackagesDto.emitteType, createPackagesDto.sectorDocumentCode);
        if(Array.isArray(listPackages) && listPackages.length>0)
            return { "statusCode": 200, "message": "OK", "packagesId": listPackages }

        return { "statusCode": 200, "message": "OK" }
    }

    @ApiOperation({
        summary: 'Send package to SIN',
        description: 'Method for send package by packageId to SIN',
    })
    @Post('send')
    @ApiBody({ type: SendPackage, description: 'Body' })
    async sendPackage( @Body()  sendPackage:SendPackage){
        const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit( Parameters.codigoSistema,sendPackage.nit,);
        return this.packageBillingService.sendPackage(ebSystemDto, sendPackage.packageId);
    }

    @ApiOperation({
    summary: 'Validate package sent to SIN',
    description: 'Method for validate package sent to SIN',
    })
    @Post('validate')
    @ApiBody({ type: SendPackage, description: 'Body' })
        async validatePackage( @Body()  sendPackage:SendPackage){
        const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit( Parameters.codigoSistema,sendPackage.nit,);
        return this.packageBillingService.validatePackage(ebSystemDto, sendPackage.packageId);
    }

    @ApiOperation({
    summary: 'Create, Send and Validate packages',
    description: 'Method for create, send and validate packages',
    })
    @Post('sendCycle')
    @ApiBody({ type: CreatePackagesDto, description: 'Body' })
    async sendPackagesCycle( @Body()  createPackagesDto:CreatePackagesDto){
        const ebSystemDto = await this.ebSystemService.findBySystemCodeAndNit( Parameters.codigoSistema,createPackagesDto.nit,);
        const list = await this.packageBillingService.sendPackageCompleteCycle(ebSystemDto, createPackagesDto.sucursalCode, createPackagesDto.salePointCode, 
            createPackagesDto.emitteType, createPackagesDto.sectorDocumentCode);
        
        if(Array.isArray(list) && list.length>0)
            return { "statusCode": 200, "message": "OK", "result": list }

        return { "statusCode": 200, "message": "OK" }


    }
}