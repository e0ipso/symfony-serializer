const { parseString } = require('xml2js');

/**
 * Decoder class for the json format. This parses a JSON string into an object.
 */
class XmlDecode {
  /**
   * Constructs a XmlDecode object.
   */
  constructor() {
    this.format = 'xml';
  }

  /**
   * Decodes an input string into an structured object.
   *
   * @param {string} input
   *   The input string.
   *
   * @return {Promise<Object>}
   *   The parsed data.
   */
  decode(input) {
    return new Promise((resolve, reject) => {
      parseString(input, (err, res) => (err ? reject(err) : resolve(res)));
    });
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

module.exports = XmlDecode;
