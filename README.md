# pixel-format
Convert from one pixel format to another

## Installation
Install using [npm](https://www.npmjs.com/)
```
npm i pixel-format
```

## Examples
```js
const PixelFormat = require("pixel-format");

// Convert a number from RGB888 to RGBA5551
// "A" will default to 1
const converted = PixelFormat.convertInteger(0xA16942, "RGB888", "RGBA5551");
converted.toString(16); // => a351

// Convert a full array of pixel data
const arr = PixelFormat.convertArray([1, 2, 3, 4, 5, 6], "ABC888", "CBA888")); 
arr; // => [3, 2, 1, 6, 5, 4]

// Extract components of a color
const components = (new PixelFormat.Format("RGB888")).parseInteger(0xA1B2C3);
components; // => 
// [ { value: 0.7647058823529411, variable: 'B' },
//   { value: 0.6980392156862745, variable: 'G' },
//   { value: 0.6313725490196078, variable: 'R' } ]
```

## Formats
A format can be defined in the form `RGB888` (All variables followed by numbers of bits for each individual) or `R8G8B8` (Variable names with the number of bits followed immediately). Any character can be used as a variable name. If the target format contains a value that is not defined in the source, it will default to the maximum possible.

## Limitations
* Individual pixels in an array must start at a full byte offset. 7 bit colors will have an padding bit at the end.
* Parts with more than 9 bit resolution can't be formatted as "RGB161616" and must be specified as "R16G16B16"

## License
MIT