import { ApiProperty } from "@nestjs/swagger";

export class Business {
    @ApiProperty()
    sucursalCode: number;
    @ApiProperty()
    salePointCode: number;
    @ApiProperty()
    nit: number;
  }

export class NoteDetail {
    @ApiProperty()
    productCode: string;
    @ApiProperty()
    productCodeSin: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    quantity: number;
    @ApiProperty()
    measureCode: string;
    @ApiProperty()
    unitPrice: number;
    @ApiProperty()
    subTotal: number;
    @ApiProperty()
    order: number;
    @ApiProperty()
    amountDiscount: number;
    
}

export class NoteData {
    @ApiProperty()
    billIdRef:number;
    @ApiProperty()
    noteNumber:number;
    @ApiProperty()
    amountDiscount:number;
    @ApiProperty({ type: [NoteDetail] })
    noteDetail: NoteDetail[];
    
}

export class SendNoteDto {
    @ApiProperty({ type: Business })
    business: Business;
    @ApiProperty({ type: NoteData })
    noteData: NoteData;
    
}