import { DataType } from "@prisma/client";

export class EbHomologationCatalogueDto {
  code:string;
  type:string;
  systemCode:string;
  nit:number;
  codeHomologated:string;
  description:string;
  createdAt:Date;
  validateType:DataType
}