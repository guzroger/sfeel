import { ApiPropertyOptional } from "@nestjs/swagger";

import { IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";
import { Type } from "class-transformer";
import { Order } from "../enum/order.enum";

export class PageOptionsDto{
    
    @ApiPropertyOptional({
        minimum: 1,
        default: 1,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    readonly page?: number = 1;

    @ApiPropertyOptional({
        minimum: 1,
        maximum: 1000,
        default: 10,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    @IsOptional()
    readonly take?: number = 10;

    @ApiPropertyOptional()
    orderBy?:any;

    @ApiPropertyOptional({ enum: Order, default: Order.asc })
    @IsEnum(Order)
    @IsOptional()
    readonly order?: Order = Order.asc;


    get skip(): number {
        return (this.page - 1) * this.take;
    }
}