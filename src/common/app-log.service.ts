import { Injectable } from "@nestjs/common";
import { appLog } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AppLogService {
  constructor(
    private prismaService: PrismaService
  ){}

  async create(service:string, paramIn:string, paramOut:string,
                tranId:number, userId:number, errorId:number, 
                message:string, ipClient:string
  ){
    return this.prismaService.appLog.create({
      data: {
        service: service,
        paramIn: paramIn,
        paramOut: paramOut,
        dateTran: new Date(),
        tranId: tranId,
        userId:  userId ,
        errorId: errorId,
        message: message,
        ipClient: ipClient
      }
    });
  }

  async update(appLog: appLog){
      return this.prismaService.appLog.update({
        where: { logId: appLog.logId},
        data: {
          service: appLog.service,
          paramIn: appLog.paramIn,
          paramOut: appLog.paramOut,
          dateTran: new Date(),
          tranId: appLog.tranId,
          userId:  appLog.userId ,
          errorId: appLog.errorId,
          message: appLog.message,
          ipClient: appLog.ipClient
        }
      });
  }
}