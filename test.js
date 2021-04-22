function executeTest(name, test) {
  console.log(name, test() ? "\x1b[32mSuccess!" : "\x1b[31mFailed!", "\x1b[37m");
}

const index = require("./index.js");

executeTest("Parses format string RGB539", () => JSON.stringify((new index.Format("RGB539")).elements) == `[{"variable":"R","bits":5},{"variable":"G","bits":3},{"variable":"B","bits":9}]` );
executeTest("Format RGB539 size", () => (new index.Format("RGB539")).getSize() == 3);
executeTest("Swap bytes", () => index.convertInteger(0xA1B2, "A8B8", "BA88").toString(16) == "b2a1");
executeTest("Use max value for missing", () => index.convertInteger(0xAABB, "R8G8", "R8G8A8").toString(16) == "aabbff");
executeTest("16 bit values", () => index.convertInteger(0xA1B2C3D4, "U16V16", "U8V8") == 41411);
executeTest("Convert array", () => index.convertArray([1, 2, 3, 4, 5, 6], "A8B8C8", "C8B8A8").join("") == "321654");
executeTest("Parse array segment", () => (new index.Format("ABC484")).parseArraySegment([0b11001010, 0b10101100, 0b11010010], 1)[1].value.toString().startsWith("0.803921"));
