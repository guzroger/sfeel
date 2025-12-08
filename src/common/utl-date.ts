export class UtlDate {
  static parseDate(txtDate: string): Date {
    const date = new Date(txtDate);
    const localOffset = new Date().getTimezoneOffset() * 60 * 1000;

    const dateLocal = new Date(date.getTime() - localOffset);
    console.log(dateLocal);
    return dateLocal;
  }

  static getNow(): Date {
    /*const date = new Date();
    const localOffset = new Date().getTimezoneOffset() * 60 * 1000;

    const dateLocal = new Date(date.getTime() - localOffset);

    return dateLocal;*/
    return new Date();
  }

  static fixDate(date:Date){
    if(date) {
      /*const localOffset = new Date().getTimezoneOffset() * 60 * 1000;
      const dateLocal = new Date(date.getTime() - localOffset);
      return dateLocal;*/

      return new Date(date.toISOString().replace('Z', ''));

    }
    else
      return this.getNow();
  }

  static getDateInfinity():Date {
    const date = new Date('2222-12-31T23:59:59.000');    

    return date;
  }

  static parseDateBegin(txt:string){
    return new Date(txt + "T00:00:00.000" )
  }

  static parseDateEnd(txt:string){
    return new Date(txt + "T23:59:59.000" )
  }
}