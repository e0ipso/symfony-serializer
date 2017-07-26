const EventEmitter = require('events');

/**
 * Base class for normalization.
 *
 * Normalizer objects can either normalize and denormalize, depending on the
 * implemented methods. A normalizer will implement the
 * supports(De)Normalization methods to include/exclude themselves during the
 * serialization process.
 */
class Normalizer extends EventEmitter {
  /**
   * Normalizes an object into a set of arrays, plain objects and scalars.
   *
   * @param {*} data
   *   The typed object to normalize.
   * @param {string} format
   *   Format name.
   * @param {Object} context
   *   Options normalizers/encoders have access to.
   *
   * @return {Promise<*>}
   *   The set of arrays, plain objects and scalars.
   */
  normalize(data, format, context) { // eslint-disable-line no-unused-vars
    return this.constructor._methodNotImplented();
  }

  /**
   * Checks if we can normalize the given object.
   *
   * @param {*} data
   *   The object to normalize.
   * @param {string} format
   *   The format name.
   *
   * @return {boolean}
   *   TRUE if the object can be normalized. FALSE otherwise.
   */
  supportsNormalization(data, format) { // eslint-disable-line no-unused-vars
    return this.constructor._methodNotImplented();
  }

  /**
   * Denormalizes data back into an object of the given class.
   *
   * @param {*} data
   *   The data to restore.
   * @param {Function} type
   *   The class of the desired object.
   * @param {string} format
   *   The format name.
   * @param {Object} context
   *   Options normalizers/encoders have access to.
   *
   * @return {Promise<*>}
   *   The restored object.
   */
  denormalize(data, type, format, context) { // eslint-disable-line no-unused-vars
    return this.constructor._methodNotImplented();
  }

  /**
   * Checks if the serializer can normalize the given object.
   *
   * @param {*} data
   *   The object to normalize.
   * @param {Function} type
   *   The class of the desired object.
   * @param {string} format
   *   The format name.
   *
   * @return {boolean}
   *   TRUE if the object can be normalized. FALSE otherwise.
   */
  supportsDenormalization(data, type, format) { // eslint-disable-line no-unused-vars
    return this.constructor._methodNotImplented();
  }

  /**
   * Helper method to throw an exception for every abstract method.
   *
   * @return {void}
   *
   * @private
   */
  static _methodNotImplented() {
    throw new Error('This method is not implemented.');
  }
}

module.exports = Normalizer;
