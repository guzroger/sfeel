import { HttpException } from "@nestjs/common";

export class SoapFilterException extends HttpException {
    constructor(message:string, status:number){
        super(message, status);
    }
}