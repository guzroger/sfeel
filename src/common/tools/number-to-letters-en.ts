export class NumberToLettersEn {
  static units(num){

    switch(num)
    {
        case 1: return 'One'; break;
        case 2: return 'Two'; break;
        case 3: return 'Tree'; break;
        case 4: return 'Four'; break;
        case 5: return 'Five'; break;
        case 6: return 'Six'; break;
        case 7: return 'Seven'; break;
        case 8: return 'Eight'; break;
        case 9: return 'Nine'; break;
    }

    return "";
  }

  static tens(num){

    let ten = Math.floor(num/10);
    let unit = num - (ten * 10);

    switch(ten)
    {
        case 1:
            switch(unit)
            {
                case 0: return 'Ten'; break;
                case 1: return 'Eleven'; break;
                case 2: return 'Twelve'; break;
                case 3: return 'Thirteen'; break;
                case 4: return 'Fourteen'; break;
                case 5: return 'Fifteen'; break;
                case 6: return 'Sixteen'; break;
                case 7: return 'Seventeen'; break;
                case 8: return 'Eighteen'; break;
                case 9: return 'Nineteen'; break;
                
            }
        case 2:
            switch(unit)
            {
                case 0: return 'Twenty'; break;
                default: return 'Twenty' + this.units(unit).toLowerCase(); break;
            }
        case 3: return this.tensAnd('Thirty', unit); break;
        case 4: return this.tensAnd('Forty', unit); break;
        case 5: return this.tensAnd('Fifty', unit); break;
        case 6: return this.tensAnd('Sixty', unit); break;
        case 7: return this.tensAnd('Seventy', unit); break;
        case 8: return this.tensAnd('Eighty', unit); break;
        case 9: return this.tensAnd('Ninety', unit); break;
        case 0: return this.units(unit); break;
    }
  }

  static tensAnd(strSin, numUnidades) {
    if (numUnidades > 0)
    return strSin + ' y ' + this.units(numUnidades).toLowerCase();

    return strSin;
  }

  static hundreds(num) {
    let hundreds = Math.floor(num / 100);
    let tens = num - (hundreds * 100);

    switch(hundreds)
    {
        case 1:
            if (tens > 0)
                return 'One Hundred ' + this.tens(tens);
            return 'Hundred'; break;
        case 2: return 'Two hundred ' + this.tens(tens).toLowerCase(); break;
        case 3: return 'Tree hundred ' + this.tens(tens).toLowerCase(); break;
        case 4: return 'Four hundred ' + this.tens(tens).toLowerCase(); break;
        case 5: return 'Five hundred ' + this.tens(tens).toLowerCase(); break;
        case 6: return 'Six hundred ' + this.tens(tens).toLowerCase(); break;
        case 7: return 'Seven hundred ' + this.tens(tens).toLowerCase(); break;
        case 8: return 'Eight hundred ' + this.tens(tens).toLowerCase(); break;
        case 9: return 'Nine hundred ' + this.tens(tens).toLowerCase(); break;
    }

    return this.tens(tens);
  }

  static section(num, divisor, strSingular, strPlural) {
    let hundreds = Math.floor(num / divisor)
    let rest = num - (hundreds * divisor)

    let letter = "";

    if (hundreds > 0)
        if (hundreds > 1)
          letter = this.hundreds(hundreds) + ' ' + strPlural;
        else
          letter = strSingular;

    if (rest > 0)
      letter += '';

    return letter;
}

  static thousands(num) {
    const divider = 1000;
    const hundreds = Math.floor(num / divider)
    const rest = num - (hundreds * divider)

    let strThousands = this.section(num, divider, 'One thousand', 'thousand');
    let strHundreds = this.hundreds(rest);

    if(strThousands == '')
        return strHundreds;

    return strThousands + ' ' + strHundreds;
}

  static millions(num) {
    const divider = 1000000;
    const hundreds = Math.floor(num / divider)
    const rest = num - (hundreds * divider)

    let strMillions = this.section(num, divider, 'One million of', 'Million of');
    let strThousands = this.thousands(rest);

      if(strMillions == '')
          return strThousands;

      return strMillions + ' ' + strThousands.toLowerCase();
  }

  static numberToLetters(num) {
    const data = { numero: num, integers: Math.floor(num),
        cents: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
        lettersCents: '',
        lettersCurrencyPlural: 'Sus.',
        lettersCurrencySingular: 'Sus.',
        lettersCurrencyCents: '/100'
    };

    if (data.cents > 0) {
        data.lettersCents =  (function (obj){
            return data.cents + data.lettersCurrencyCents;
            /*if (data.cents == 1)
                return obj.millions(data.cents) + data.lettersCurrencyCents;
            else
                return obj.millions(data.cents)  + data.lettersCurrencyCents;
            */
            })(this);
    }
    else {
      data.lettersCents = '0' + data.lettersCurrencyCents;
    }

    if(data.integers == 0)
        return 'Cero ' + ' ' + data.lettersCents  + data.lettersCurrencyPlural;
    if (data.integers == 1)
        return this.millions(data.integers)  + ' ' + data.lettersCents + ' ' + data.lettersCurrencySingular;
    else
        return this.millions(data.integers)  + ' ' + data.lettersCents + ' ' + data.lettersCurrencyPlural;
  }
}

