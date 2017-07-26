/**
 * Decoder class for the json format. This parses a JSON string into an object.
 */
class JsonDecode {
  /**
   * Constructs a JsonDecode object.
   */
  constructor() {
    this.format = 'json';
  }

  /**
   * Decodes an input string into an structured object.
   *
   * @param {string} input
   *   The input string.
   *
   * @return {Object}
   *   The parsed data.
   */
  decode(input) {
    return JSON.parse(input);
  }

  /**
   * Checks if the provided format is supported by this decoder.
   *
   * @param {string} format
   *   The format name.
   *
   * @return {boolean}
   *   TRUE if the format is supported. FALSE otherwise.
   */
  supportsDecoding(format) {
    return format.indexOf(this.format) !== -1;
  }
}

module.exports = JsonDecode;
