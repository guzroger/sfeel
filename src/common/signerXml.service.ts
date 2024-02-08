import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { EbSystemDto } from "src/model/dto/ebSystem.dto";
import { CertificateType } from "@prisma/client";
import { SignedXml } from "xml-crypto";
import { AppCertificateService } from "src/model/appCertificate.service";
import { AppCertificateDto } from "src/model/dto/appCertificate.dto";

@Injectable()
export class SignerXmlService {
  constructor(
    private prismaService: PrismaService,
    private appCertificateService: AppCertificateService
  ) {}

  async signerBillXml(xml: string, ebSystemDto: EbSystemDto): Promise<string> {
    
    const primaryKey = await this.appCertificateService.getValidCertificate(
      ebSystemDto.systemCode,
      ebSystemDto.nit,
      CertificateType.PRIMARY_KEY
    );
    
    const publicKey = await this.appCertificateService.getValidCertificate(
      ebSystemDto.systemCode,
      ebSystemDto.nit,
      CertificateType.PUBLIC_KEY
    );
    
    const sig = new SignedXml({
      privateKey: primaryKey.certificate,
      publicCert: publicKey.certificate,
      signatureAlgorithm: "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256",
    });

    sig.signatureAlgorithm =
      "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";
    sig.canonicalizationAlgorithm =
      "http://www.w3.org/TR/2001/REC-xml-c14n-20010315";

    sig.addReference({
      xpath: "/*",
      transforms: [
        "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
        "http://www.w3.org/TR/2001/REC-xml-c14n-20010315#WithComments",
      ],
      digestAlgorithm: "http://www.w3.org/2001/04/xmlenc#sha256",
      isEmptyUri: true,
    });
    
    sig.computeSignature(xml);
    const xmlSigned = sig.getSignedXml();

    return xmlSigned;
  }

  signerBillXmlWithCert(xml: string, ebSystemDto: EbSystemDto, primaryKey:AppCertificateDto, publicKey:AppCertificateDto): string {
    
    
    const sig = new SignedXml({
      privateKey: primaryKey.certificate,
      publicCert: publicKey.certificate,
      signatureAlgorithm: "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256",
    });
    
    sig.signatureAlgorithm =
      "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";
    sig.canonicalizationAlgorithm =
      "http://www.w3.org/TR/2001/REC-xml-c14n-20010315";

    sig.addReference({
      xpath: "/*",
      transforms: [
        "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
        "http://www.w3.org/TR/2001/REC-xml-c14n-20010315#WithComments",
      ],
      digestAlgorithm: "http://www.w3.org/2001/04/xmlenc#sha256",
      isEmptyUri: true,
    });
    sig.computeSignature(xml);
    const xmlSigned = sig.getSignedXml();
    
    return xmlSigned;
  }

}
