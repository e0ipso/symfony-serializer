const JsonDecode = require('./JsonDecode');

/**
 * Finds the correct decoder and gets the job done.
 */
class ChainDecoder {
  /**
   * Constructs a new ChainDecoder.
   *
   * @param {Array} decoders
   *   The list of supported decoders.
   */
  constructor(decoders) {
    this.decoders = decoders;
    // Holds the index in the array of decoders of each supported format.
    this.decoderByFormat = {};
  }

  /**
   * Decodes a string into JS data.
   *
   * The format parameter specifies which format the data is in; valid values
   * depend on the specific implementation. Authors implementing this interface
   * are encouraged to document which formats they support in a non-inherited
   * jsdoc comment.
   *
   * @param {*} data
   *   Data to decode
   * @param {string} format
   *   Format name
   * @param {Object} context
   *   Options that normalizers/decoders have access to
   *
   * @return {string}
   *   The decoded value.
   *
   * @throws Error
   *   When there is no supported decoder.
   */
  decode(data, format, context) {
    return this.getDecoder(format).decode(data, format, context);
  }

  /**
   * Checks whether the deserializer can decode from given format.
   *
   * @param {string} format
   *   format name
   *
   * @return {boolean}
   *   TRUE if the format is supported. FALSE otherwise.
   */
  supportsDecoding(format) {
    return !!this.getDecoder(format);
  }

  /**
   * Gets the decoder supporting the format.
   *
   * @param {string} format
   *   The format name.
   *
   * @return {decoder}
   *   The decoder.
   *
   * @throws Error
   *   If no decoder can be found.
   */
  getDecoder(format) {
    // See if we already found this decoder in the past. If so, return it.
    if (
      typeof this.decoderByFormat[format] !== 'undefined' &&
      typeof this.decoders[this.decoderByFormat[format]] !== 'undefined'
    ) {
      return this.decoders[this.decoderByFormat[format]];
    }
    // Get the position in the array this decoder is in.
    const index = this.decoders.findIndex(
      decoder => decoder.supportsDecoding(format)
    );
    if (index === -1) {
      // If no decoder was found use the JsonDecode.
      return new JsonDecode();
    }
    this.decoderByFormat[format] = index;
    return this.decoders[index];
  }
}

module.exports = ChainDecoder;
