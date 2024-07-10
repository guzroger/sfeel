import { Injectable } from "@nestjs/common";
import { EbBillDto } from "src/model/dto/ebBill.dto";
import { EbSectorDocumentDto } from "src/model/dto/ebSectorDocument.dto";
import { EbSucursalDto } from "src/model/dto/ebSucursal.dto";
import { EbSystemDto } from "src/model/dto/ebSystem.dto";
import { Constants } from "./enum/constants.enum";
import { XmlDocumentBillParser } from "src/xml/xmlDocumentBillParser";
import { SignerXmlService } from "./signerXml.service";

@Injectable()
export class BillXmlService {
  
  constructor(private signerXmlService: SignerXmlService){}
  
  async createBillXml(ebSystemDto:EbSystemDto,  ebBillDto:EbBillDto, ebSectorDocumentDto:EbSectorDocumentDto, ebSucursalDto: EbSucursalDto){
    //1)  Generate  XML file associated with the envoice according to the economic activity.
    let xml = '';
    if(ebBillDto.modalityCode === Constants.ComputerizedOnlineBilling)
    {
      xml = XmlDocumentBillParser[ebSectorDocumentDto.methodFec]( ebBillDto, ebSucursalDto, );
    }
    else{
      xml = XmlDocumentBillParser[ebSectorDocumentDto.methodFe]( ebBillDto, ebSucursalDto,);
    }    
    //2)     Firmar el archivo obtenido conforme estándar XMLDSig (sólo en el caso de la Modalidad Electrónica en Línea).
    if(ebBillDto.modalityCode === Constants.ElectronicOnlineBilling)
    {
      xml = await this.signerXmlService.signerBillXml( xml, ebSystemDto,);
    }
    
    return xml;
  }
}