const PixelFormat = require("./PixelFormat.js");

function convertInteger(number, from, to) {
  if (isNaN(number)) throw new Error("Value is not a number.", number);

  let formatFrom = (typeof from == "string") ? new PixelFormat(from) : from;
  let formatTo = (typeof from == "string") ? new PixelFormat(to) : to;

  return formatTo.makeInteger(formatFrom.parseInteger(number));
}

function convertArray(source, from, to) {
  let formatFrom = (typeof from == "string") ? new PixelFormat(from) : from;
  let formatTo = (typeof from == "string") ? new PixelFormat(to) : to;

  let srcSize = formatFrom.getSize();
  let targetSize = formatTo.getSize();

  if (source.length % srcSize != 0) throw new Error("Source data has not the correct length. Must be a multiple of " + srcSize);
  let elements = source.length / srcSize;
  let target = new Uint8Array(elements * targetSize);

  if (srcSize > 4 || targetSize > 4) { // High resolution for more than 32 bit numbers
    for (let i = 0; i < elements; i++) {
      let srcOffset = i * srcSize;
      let targetOffset = i * targetSize;
      let values = from.parseArraySegment(source, srcOffset);
      to.writeArraySegment(target, targetOffset, values);
    }
  } else { // Lower resolution colors
    for (let i = 0; i < elements; i++) {
      let srcOffset = i * srcSize;
      let targetOffset = i * targetSize;

      let srcValue = 0;
      for (let j = 0; j < srcSize; j++) {
        srcValue |= source[srcOffset + j] << (j * 8)
      }

      let targetValue = convertInteger(srcValue, formatFrom, formatTo);

      for (let j = 0; j < targetSize; j++) {
        target[targetOffset + j] = (targetValue >> (j * 8)) & 0xFF;
      }
    }
  }

  return target;
}

module.exports = {
  Format: PixelFormat,
  convertInteger,
  convertArray
}
