import { createHash } from "crypto";

export class Algorithm {
  static getCuf(
    nit: number,
    dateEmitter: Date,
    sucursalCode: number,
    salePointCode: number,
    modalityCode: number,
    emitterType: number,
    sectorDocumentCode: string,
    documentTaxCode: number,
    billNumber: number,
  ): string {
    let cadena = '';
    cadena += nit.toString().padStart(13, '0');
    cadena += this.dateToString(dateEmitter);
    cadena += sucursalCode.toString().padStart(4, '0');
    cadena += modalityCode.toString().padStart(1, '0');
    cadena += emitterType.toString().padStart(1, '0');
    cadena += documentTaxCode.toString().padStart(1, '0');
    cadena += sectorDocumentCode.padStart(2, '0');
    cadena += billNumber.toString().padStart(10, '0');

    if (salePointCode != null)
      cadena += salePointCode.toString().padStart(4, '0');
    else cadena += ''.padStart(4, '0');

    cadena += this.mod11(cadena, 1, 9, false);

    cadena = this.base16(cadena);
    return cadena;
  }

  static dateToString(date: Date): string {
    const dateString: string =
      date.getUTCFullYear() +
      (date.getUTCMonth() + 1).toString().padStart(2, '0') +
      date.getUTCDate().toString().padStart(2, '0') +
      date.getUTCHours().toString().padStart(2, '0') +
      date.getUTCMinutes().toString().padStart(2, '0') +
      date.getUTCSeconds().toString().padStart(2, '0') +
      date.getUTCMilliseconds().toString().padStart(3, '0');
   
    return dateString;
  }

  static mod11(
    dado: string,
    numDig: number,
    limMult: number,
    x10: boolean,
  ): string {
    let soma = 0;
    let mult = 0;
    let dig = 0;
    if (!x10) numDig = 1;
    for (let n = 1; n <= numDig; n++) {
      soma = 0;
      mult = 2;
      for (let i = dado.length - 1; i >= 0; i--) {
        soma += mult * Number(dado.substring(i, i + 1));
        if (++mult > limMult) mult = 2;
      }
      if (x10) {
        dig = ((soma * 10) % 11) % 10;
      } else {
        dig = soma % 11;
      }
      if (x10) {
        dig = ((soma * 10) % 11) % 10;
      } else {
        dig = soma % 11;
      }

      if (dig == 10) {
        dado += '1';
      }
      if (dig == 11) {
        dado += '0';
      }
      if (dig < 10) {
        dado += dig.toString();
      }
    }
    return dado.substring(dado.length - numDig, dado.length);
  }

  static base16(txt: string) {
    const num = BigInt(txt);
    return num.toString(16).toLocaleUpperCase();
  }

  static algoritmoHash(buffer:Buffer): string{
    return createHash("sha256").update(buffer).digest("hex");
  }
}
