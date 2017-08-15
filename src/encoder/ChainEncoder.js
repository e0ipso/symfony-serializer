const JsonEncode = require('./JsonEncode');

/**
 * Finds the correct encoder and gets the job done.
 */
class ChainEncoder {
  /**
   * Constructs a new ChainEncoder.
   *
   * @param {Array} encoders
   *   The list of supported encoders.
   */
  constructor(encoders) {
    this.encoders = encoders;
    // Holds the index in the array of encoders of each supported format.
    this.encoderByFormat = {};
  }

  /**
   * Encodes data into the given format.
   *
   * @param {*} data
   *   Data to encode
   * @param {string} format
   *   Format name
   * @param {Object} context
   *   Options that normalizers/encoders have access to
   *
   * @return {string}
   *   The encoded value.
   *
   * @throws Error
   *   When there is no supported encoder.
   */
  encode(data, format, context) {
    return this.getEncoder(format).encode(data, format, context);
  }

  /**
   * Checks whether the serializer can encode to given format.
   *
   * @param {string} format
   *   format name
   *
   * @return {boolean}
   *   TRUE if the format is supported. FALSE otherwise.
   */
  supportsEncoding(format) {
    return !!this.getEncoder(format);
  }

  /**
   * Checks whether the normalization is needed for the given format.
   *
   * @param {string} format
   *   The format name
   *
   * @return {boolean}
   *   TRUE if normalization is needed. FALSE otherwise.
   */
  needsNormalization(format) {
    const encoder = this.getEncoder(format);

    // If the encoder already knows how to normalize, we won't need normalizers.
    if (typeof encoder.normalize !== 'function') {
      return true;
    }

    // If the encoder is another chain encoder, then defer the results.
    if (typeof encoder.getEncoder === 'function') {
      return encoder.needsNormalization(format);
    }

    return false;
  }

  /**
   * Gets the encoder supporting the format.
   *
   * @param {string} format
   *   The format name.
   *
   * @return {Encoder}
   *   The encoder.
   *
   * @throws Error
   *   If no encoder can be found.
   */
  getEncoder(format) {
    // See if we already found this encoder in the past. If so, return it.
    if (
      typeof this.encoderByFormat[format] !== 'undefined' &&
      typeof this.encoders[this.encoderByFormat[format]] !== 'undefined'
    ) {
      return this.encoders[this.encoderByFormat[format]];
    }
    // Get the position in the array this encoder is in.
    const index = this.encoders.findIndex(
      encoder => encoder.supportsEncoding(format)
    );
    if (index === -1) {
      // If no encoder can be found, default to JSON encoding.
      return new JsonEncode();
    }
    this.encoderByFormat[format] = index;
    return this.encoders[index];
  }
}

module.exports = ChainEncoder;
