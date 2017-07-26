'use strict';

/**
 * Encoder class for the json format. This turns any object into a JSON string.
 */
class JsonEncode {

  /**
   * Constructs a JsonEncode object.
   */
  constructor() {
    this.format = 'json';
  }

  /**
   * Encodes an object to a string.
   *
   * @param {*} data
   *   The structured data to encode.
   *
   * @return {string}
   *   The encoded string.
   */
  encode(data) {
    return JSON.stringify(data);
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

module.exports = JsonEncode;
