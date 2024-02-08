export class AppCertificateDto {
  id: number;
  systemCode: string;
  nit: number;
  certificate: Buffer;
  certificateType: string;
  typeStorage: string;
  status: string;
  createdAt: Date;
  expirationAt: Date;
  idRef: number;
}
