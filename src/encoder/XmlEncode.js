const { Builder } = require('xml2js');

/**
 * Encoder class for the json format. This turns any object into a JSON string.
 */
class XmlEncode {
  /**
   * Constructs a XmlEncode object.
   */
  constructor() {
    this.format = 'xml';
  }

  /**
   * Encodes an object to a string.
   *
   * @param {*} data
   *   The structured data to encode.
   * @param {string} format
   *   The data format.
   * @param {Object} context
   *   An object to pass state around.
   *
   * @return {string}
   *   The encoded string.
   */
  encode(data, format, context = {}) {
    const options = Object.assign(
      // Some default options to generate pretty XML.
      { explicitRoot: false, renderOpts: { pretty: true } },
      context.xmlEncoder || {}
    );
    const xmlBuilder = new Builder(options);
    return xmlBuilder.buildObject(data);
  }

  /**
   * Checks if the provided format is supported by this encoder.
   *
   * @param {string} format
   *   The format name.
   *
   * @return {boolean}
   *   TRUE if the format is supported. FALSE otherwise.
   */
  supportsEncoding(format) {
    return format.indexOf(this.format) !== -1;
  }

  /**
   *
   * @param {string} format
   *   The format name.
   *
   * @return {boolean}
   *   TRUE, the JSON encoder needs normalized data to work.
   */
  needsNormalization(format) { // eslint-disable-line no-unused-vars
    return true;
  }
}

module.exports = XmlEncode;
