import { BadGatewayException, BadRequestException, Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { ContingencyService } from './contingency.service';
import { CreateEventDto } from './dto/createEvent.dto';
import { CloseEventDto } from "./dto/closeEvent.dto";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@ApiTags('event')
@Controller('event')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class ContingencyController {
    constructor(private contingencyService:ContingencyService){}


    @ApiOperation({
        summary: 'Register a Event',
        description: 'Register a Event',
    })
    @Post('')
    async createEvent(@Body() createEventDto:CreateEventDto){
        return this.contingencyService.createEvent(createEventDto);
    }

    @ApiOperation({
        summary: 'Close a Event registered',
        description: 'Close a Event registered',
    })
    @Post('close')
    async closeEvent(@Body() closeEventDto:CloseEventDto) {
        return this.contingencyService.closeEvent(closeEventDto.eventId, closeEventDto.nit);
    }


    @ApiOperation({
        summary: 'Query events registered in SIN',
        description: 'Query events registered in SIN',
    })
    @ApiQuery({ name : "date", required: true})
    @ApiQuery({ name : "sucursalCode", required: true})
    @ApiQuery({ name : "salePointCode", required: false})
    @ApiQuery({ name : "nit", required: true})
    @Get('SIN')
    async queryEventSIN(@Query() query:any){
        if(!query.date || !query.sucursalCode || !query.nit)
            throw new BadRequestException();
        
        if(query.sucursalCode && query.salePointCode && query.date )
            return this.contingencyService.queryEventsSIN(new Date(query.date + "T00:00:00.000Z"), Number(query.sucursalCode) , Number(query.salePointCode), query.nit);

        throw new BadGatewayException();
    }

    @ApiOperation({
        summary: 'Query events registered',
        description: 'Query events registered',
    })
    @ApiQuery({ name : "date", required: true})
    @ApiQuery({ name : "sucursalCode", required: true})
    @ApiQuery({ name : "salePointCode", required: false})
    @ApiQuery({ name : "nit", required: true})
    @Get('')
    async queryEvent(@Query() query:any){
        if(!query.date || !query.sucursalCode || !query.nit)
            throw new BadRequestException();
        
        if(query.sucursalCode && query.nit && query.date )
            return this.contingencyService.queryEvents(new Date(query.date + "T00:00:00.000Z"), new Date(query.date + "T23:59:59.000Z"),
                 Number(query.sucursalCode) , query.salePointCode, query.nit);

        throw new BadGatewayException();
    }

}