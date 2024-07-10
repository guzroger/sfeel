import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { EbEventDto } from "./dto/ebEvent.dto";
import { ebEvent } from "@prisma/client";
import { ParameterService } from '../common/parameter.service';
import { Constants } from "src/common/enum/constants.enum";

@Injectable()
export class EbEventService {
    constructor(private prismaService:PrismaService, private parameterService:ParameterService){}

    async create(ebEventDto:EbEventDto):Promise<EbEventDto>{
        const ebEvent =  await this.prismaService.ebEvent.create({
                            data: {
                                systemCode: ebEventDto.systemCode,
                                nit: ebEventDto.nit,
                                description: ebEventDto.description,
                                eventType: ebEventDto.eventType,
                                sucursalCode: ebEventDto.sucursalCode,
                                salePointCode: ebEventDto.salePointCode,
                                sectorDocumentCode: ebEventDto.sectorDocumentCode?ebEventDto.sectorDocumentCode:"0",
                                beginAt: ebEventDto.beginAt,
                                endAt: ebEventDto.endAt?ebEventDto.endAt:this.parameterService.getDateInfinity(),
                                cufdEvent: ebEventDto.cufdEvent,
                                recepcionCode: ebEventDto.recepcionCode,
                                cafc: ebEventDto.cafc,
                                selfManageable: ebEventDto.selfManageable,
                                eventStatusId: Number(Constants.EventStatusNew)                
                            }
        });

        if(ebEvent!=null)
            return this.mapEbEvent(ebEvent);
        return null;
    }

    async update(ebEventDto:EbEventDto):Promise<EbEventDto> {
        const ebEvent =  await this.prismaService.ebEvent.update({
            where:{
                eventId:ebEventDto.eventId,
            },
            data: {
                
                systemCode: ebEventDto.systemCode,
                nit: ebEventDto.nit,
                description: ebEventDto.description,
                eventType: ebEventDto.eventType,
                sucursalCode: ebEventDto.sucursalCode,
                salePointCode: ebEventDto.salePointCode,
                sectorDocumentCode: ebEventDto.sectorDocumentCode?ebEventDto.sectorDocumentCode:"0",
                beginAt: ebEventDto.beginAt,
                endAt: ebEventDto.endAt?ebEventDto.endAt:this.parameterService.getDateInfinity(),
                cufdEvent: ebEventDto.cufdEvent,
                recepcionCode: ebEventDto.recepcionCode,
                cafc: ebEventDto.cafc,
                selfManageable: ebEventDto.selfManageable,
                eventStatusId: ebEventDto.eventStatusId
            }
        });

        if(ebEvent!=null)
            return this.mapEbEvent(ebEvent);

        return null;
    } 

    async findById(eventId:number) {
        const ebEvent = await this.prismaService.ebEvent.findUnique({
            where: {
                eventId:eventId,
            }
        });

        if(ebEvent!=null)
            return this.mapEbEvent(ebEvent);
        else
            throw new NotFoundException('Event data not found');
    }

    async findEventByStatus(systemCode:string, nit:number, statusId:number): Promise<EbEventDto[]>{
        const list = await this.prismaService.ebEvent.findMany(
                        {
                            where: {
                                systemCode: systemCode,
                                nit: nit,
                                eventStatusId: statusId                                
                            }
                        }
                    );
        return list.map( item => {
                return this.mapEbEvent(item);
            });
    }

    async findEvent(systemCode:string, nit:number, sucursalCode:number, salePointCode:number, sectorDocumentCode:string, dateEmitter:Date): Promise<EbEventDto[]> {
        
        const list = await this.prismaService.ebEvent.findMany(
            {
                where: {
                    systemCode: systemCode,
                    nit: nit,
                    beginAt: { lte: dateEmitter },
                    endAt: { gte: dateEmitter },
                    sucursalCode:  sucursalCode,
                    salePointCode: salePointCode,
                    OR: [ {sectorDocumentCode:  sectorDocumentCode} , { sectorDocumentCode:"0"}]
                },
                orderBy: [ { beginAt: 'desc'}]
            }
        );
        return list.map( item => {
            return this.mapEbEvent(item);
        });
    }

    async findEventsOpen(systemCode:string, nit:number, sucursalCode:number, salePointCode:number): Promise<EbEventDto[]> {
        const list = await this.prismaService.ebEvent.findMany(
            {
                where: {
                    systemCode: systemCode,
                    nit: nit,
                    sucursalCode:  sucursalCode,
                    salePointCode: salePointCode,
                    OR: [ {endAt:  this.parameterService.getDateInfinity()} , { eventStatusId : 0 }]
                },
                orderBy: [ { beginAt: 'desc'}]
            }
        );
        return list.map( item => {
            return this.mapEbEvent(item);
        });
    }

    async findEvents(systemCode:string, nit:number, sucursalCode:number, salePointCode:number, dateBegin:Date, dateEnd:Date): Promise<EbEventDto[]> {
        let list = null;
        if(salePointCode!=null)
        {
            list = await this.prismaService.ebEvent.findMany(
                {
                    where: {
                        systemCode: systemCode,
                        nit: nit,
                        beginAt: { gte: dateBegin,  lte: dateEnd },
                        sucursalCode:  sucursalCode,
                        salePointCode: Number(salePointCode),                    
                    },
                    orderBy: [ { beginAt: 'desc'}]
                }
            );
        }
        else {
            list = await this.prismaService.ebEvent.findMany(
                {
                    where: {
                        systemCode: systemCode,
                        nit: nit,
                        beginAt: { gte: dateBegin,  lte: dateEnd },
                        sucursalCode:  sucursalCode,
                    },
                    orderBy: [ { beginAt: 'desc'}]
                }
            );
        }
        
        return list.map( item => {
            return this.mapEbEvent(item);
        });
    }

    async findEvnetByEventCode(systemCode:string, nit:number,  eventCode:string):Promise<EbEventDto> {
        const event = await this.prismaService.ebEvent.findFirst(
            {
                where: {
                    systemCode: systemCode,
                    nit: nit,
                    recepcionCode: eventCode,
                },
                orderBy: [ { beginAt: 'desc'}]
            }
        );
        return this.mapEbEvent(event);
    }

    mapEbEvent(ebEvent: ebEvent): EbEventDto {
        const ebEventDto = new EbEventDto();

        ebEventDto.eventId = ebEvent.eventId;
        ebEventDto.systemCode = ebEvent.systemCode;
        ebEventDto.nit = Number(ebEvent.nit);
        ebEventDto.description = ebEvent.description;
        ebEventDto.eventType = ebEvent.eventType;
        ebEventDto.sucursalCode = ebEvent.sucursalCode;
        ebEventDto.salePointCode = ebEvent.salePointCode;
        ebEventDto.sectorDocumentCode = ebEvent.sectorDocumentCode;
        ebEventDto.beginAt = ebEvent.beginAt;
        ebEventDto.endAt = ebEvent.endAt;
        ebEventDto.cufdEvent = ebEvent.cufdEvent;
        ebEventDto.eventStatusId = ebEvent.eventStatusId;
        ebEventDto.recepcionCode = ebEvent.recepcionCode;
        ebEventDto.cafc = ebEvent.cafc;
        ebEventDto.selfManageable = ebEvent.selfManageable;

        return ebEventDto;
    }
}