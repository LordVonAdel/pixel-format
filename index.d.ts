interface ColorValue {

  /**
   * Name of the placeholder variable
   */
  variable: string;

  /**
   * Normalized component value from 0-1
   */
  value: number;
}

/**
 * A color format. Stores the component names, sizes and offsets
 */
export declare class PixelFormat {

  /**
   * Returns number of bytes a color needs. (Rounded up)
   */
  getSize(): number;

  /**
   * Extracts the components from an integer using this format
   * @param integer Integer to get the components of
   */
  parseInteger(integer: number): [ColorValue];

  /**
   * Creates an interger with this format
   * @param values Component values
   */
  makeInteger(values: [ColorValue]): number;

  /**
   * Parses a single color from an 8 bit array. Used for colors with a higher resolution than the js limit of integers
   * @param array Source array
   * @param offset Offset index of start color
   */
  parseArraySegment(array: Array<number>, offset: number): ColorValue;

  /**
   * Writes a color at a specified position in an array
   * @param array Target array
   * @param offset Byte offset to start writing
   * @param values Component values
   */
  writeArraySegment(array: Array<number>, offset: number, values: ColorValue): void;
}

/**
 * Converts an integer from one format to another
 * @param number Source number
 * @param from Source format
 * @param to Target format
 * @exmaple 
 * convertInteger(0xAABBCC, "R8G8B8", "R5G6B5")
 */
export declare function convertInteger(number: number, from: PixelFormat | string, to: PixelFormat | string);

/**
 * Converts an array containing colors from one format to another and returns them as a new Uint8Array
 * @param number Source array
 * @param from Source format
 * @param to Target format
 */
export declare function convertArray(source: Array<number> | ArrayLike<number>, from: PixelFormat | string, to: PixelFormat | string): Uint8Array;
