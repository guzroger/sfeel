export class NumberToLetters {
  static units(num){

    switch(num)
    {
        case 1: return 'Un'; break;
        case 2: return 'Dos'; break;
        case 3: return 'Tres'; break;
        case 4: return 'Cuatro'; break;
        case 5: return 'Cinco'; break;
        case 6: return 'Seis'; break;
        case 7: return 'Siete'; break;
        case 8: return 'Ocho'; break;
        case 9: return 'Nueve'; break;
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
                case 0: return 'Diez'; break;
                case 1: return 'Once'; break;
                case 2: return 'Doce'; break;
                case 3: return 'Trece'; break;
                case 4: return 'Catorce'; break;
                case 5: return 'Quince'; break;
                default: return 'Dieci' + this.units(unit).toLowerCase();
            }
        case 2:
            switch(unit)
            {
                case 0: return 'Veinte'; break;
                default: return 'Veinti' + this.units(unit).toLowerCase(); break;
            }
        case 3: return this.tensAnd('Treinta', unit); break;
        case 4: return this.tensAnd('Cuarenta', unit); break;
        case 5: return this.tensAnd('Cincuenta', unit); break;
        case 6: return this.tensAnd('Sesenta', unit); break;
        case 7: return this.tensAnd('Setenta', unit); break;
        case 8: return this.tensAnd('Ochenta', unit); break;
        case 9: return this.tensAnd('Noventa', unit); break;
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
                return 'Ciento ' + this.tens(tens);
            return 'Cien'; break;
        case 2: return 'Doscientos ' + this.tens(tens).toLowerCase(); break;
        case 3: return 'Trescientos ' + this.tens(tens).toLowerCase(); break;
        case 4: return 'Cuatrocientos ' + this.tens(tens).toLowerCase(); break;
        case 5: return 'Quinientos ' + this.tens(tens).toLowerCase(); break;
        case 6: return 'Seiscientos ' + this.tens(tens).toLowerCase(); break;
        case 7: return 'Setecientos ' + this.tens(tens).toLowerCase(); break;
        case 8: return 'Ochocientos ' + this.tens(tens).toLowerCase(); break;
        case 9: return 'Novecientos ' + this.tens(tens).toLowerCase(); break;
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

    let strThousands = this.section(num, divider, 'Un mill', 'Mil');
    let strHundreds = this.hundreds(rest);

    if(strThousands == '')
        return strHundreds;

    return strThousands + ' ' + strHundreds;
}

  static millions(num) {
    const divider = 1000000;
    const hundreds = Math.floor(num / divider)
    const rest = num - (hundreds * divider)

    let strMillions = this.section(num, divider, 'Un millon de', 'Millones de');
    let strThousands = this.thousands(rest);

      if(strMillions == '')
          return strThousands;

      return strMillions + ' ' + strThousands.toLowerCase();
  }

  static numberToLetters(num) {
    const data = { numero: num, integers: Math.floor(num),
        cents: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
        lettersCents: '',
        lettersCurrencyPlural: 'Bolivianos.',
        lettersCurrencySingular: 'Bolivianos.',
        lettersCurrencyCents: '/100'
    };

    if (data.cents > 0) {
        data.lettersCents =  (function (obj){
            //return data.cents.toFixed(2) + data.lettersCurrencyCents;
            //return  data.cents  + data.lettersCurrencyCents;
            if (data.cents < 10)
                return '0' + data.cents + data.lettersCurrencyCents;
            else
                return data.cents  + data.lettersCurrencyCents;
            
            })(this);
    }
    else {
      data.lettersCents = '00' + data.lettersCurrencyCents;
    }

    if(data.integers == 0)
        return 'Cero ' + ' ' + data.lettersCents  + data.lettersCurrencyPlural;
    if (data.integers == 1)
        return this.millions(data.integers)  + ' ' + data.lettersCents + ' ' + data.lettersCurrencySingular;
    else
        return this.millions(data.integers)  + ' ' + data.lettersCents + ' ' + data.lettersCurrencyPlural;
  }
}

