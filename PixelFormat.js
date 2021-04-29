class PixelFormat {

  constructor(formatString) {
    this.elements = [];

    if (isNaN(formatString[1])) {
      this.elements = PixelFormat.parseFormatRGB888(formatString);
    } else {
      this.elements = PixelFormat.parseFormatR8G8B8(formatString);
    }
  }

  getSize() {
    return Math.ceil(this.elements.reduce((acc, element) => acc + element.bits, 0) / 8);
  }

  parseInteger(integer) {
    let bitOffset = 0;
    let values = [];
    for (let i = this.elements.length - 1; i >= 0; i--) {
      let element = this.elements[i];
      let maxValue = (1 << element.bits) - 1;
      let mask = maxValue;

      let value = ((integer >> bitOffset) & mask) / maxValue;

      values.push({
        value,
        variable: element.variable
      });

      bitOffset += element.bits;
    }
    return values;
  }

  makeInteger(values) {
    let out = 0;
    let bitOffset = 0;

    for (let i = this.elements.length - 1; i >= 0; i--) {
      let element = this.elements[i];
      let maxValue = (1 << element.bits) - 1;
      let mask = maxValue;
      let value = values.find(val => val.variable == element.variable);
      value = value ? value.value : 1;
      
      out |= Math.round(value * maxValue) << bitOffset;
      bitOffset += element.bits;
    }

    return out;
  }

  parseArraySegment(array, offset = 0) {
    let bitOffset = 0;
    let values = [];
    for (let i = 0; i < this.elements.length; i++) {
      let element = this.elements[i];
      let maxValue = (1 << element.bits) - 1;
      let value = 0;
      for (let j = 0; j < element.bits; j++) {
        let boff = bitOffset + j;
        let byte = array[Math.floor(boff / 8) + offset];
        let bit = (byte >> (7 - (boff % 8))) & 1;
        value |= (bit) << ((element.bits - 1) - j);
      }

      values.push({
        value: Number(value) / Number(maxValue),
        variable: element.variable
      });

      bitOffset += element.bits;
    }
    return values;
  }

  writeArraySegment(array, offset = 0, values) {
    let bitOffset = 0;

    for (let i = 0; i < this.getSize(); i++) {
      array[offset + i] = 0;
    }

    for (let i = 0; i < this.elements.length; i++) {
      let element = this.elements[i];
      let value = values.find(val => val.variable == element.variable);
      let maxValue = (1n << BigInt(element.bits)) - 1n;
      value = value ? value.value : 1;

      let absoluteValue = Math.round(value * Number(maxValue));
      for (let j = 0; j < element.bits; j++) {
        let localBit = bitOffset % 8;
        let byte = offset + Math.floor(bitOffset / 8);

        let srcBit = +((absoluteValue & (1 << (element.bits - 1 - j))) > 0);

        array[byte] |= (1 << (7 - localBit)) * srcBit;
        bitOffset++;
      }
    }
  }

  static parseFormatRGB888(formatString) {

    let out = [];
    let numberIndex = 0;
    for (let char of formatString) {
      let isNumber = !isNaN(+char);
  
      if (isNumber) break;
      out.push({variable: char});
    }
  
    let charsLeft = formatString.length - out.length;
    if (charsLeft % out.length) throw new Error("Malformed format string: " + formatString);
    let charsPerVar = charsLeft / out.length;
  
    for (let i = 0; i < charsLeft / charsPerVar; i ++) {
      out[i].bits = +formatString.substr(out.length + i * charsPerVar, charsPerVar);
      if (isNaN(out[i].bits)) throw new Error("Malformed format string: " + formatString);
    }
  
    return out;
  }

  static parseFormatR8G8B8(formatString) {
    let lastType = null;
    let out = [];
  
    let currentNumber = "";
    let currentVariable = "";
  
    for (let char of formatString) {
      let isNumber = !isNaN(+char);
  
      if (lastType == true && isNumber == false) {
        out.push({variable: currentVariable, bits: +currentNumber});
        currentNumber = "";
        currentVariable = "";
      }
  
      if (isNumber) {
        currentNumber += char;
      } else {
        currentVariable += char;
      }
  
      lastType = isNumber;
    }
    out.push({variable: currentVariable, bits: +currentNumber});
  
    return out;
  }
}

module.exports = PixelFormat;
