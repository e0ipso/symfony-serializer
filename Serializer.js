'use strict';

const _ = require('lodash');
const EventEmitter = require('events');
const JsonEncode = require('./encoder/JsonEncode');
const JsonDecode = require('./encoder/JsonDecode');
const util = require('util');

/**
 * Main class to normalize/denormalize or serialize/deserialize.
 *
 * This class will be initialized by all the normalizers in the application so
 * it can find the appropriate (de)normalizer to use in every moment.
 */
class Serializer extends EventEmitter {

  /**
   * Construct the serializer object.
   *
   * @param {Array} normalizers
   *   The list of supported normalizers sorted by priority.
   */
  constructor(normalizers) {
    super();
    // If the normalizer is aware of the serializer, then set it.
    normalizers
      .filter(normalizer => typeof normalizer.setSerializer === 'function')
      .forEach((normalizer) => {
        normalizer.setSerializer(this);
        // Re-emit any error or info event.
        normalizer.on('error', event => this.emit('error', event));
        normalizer.on('info', event => this.emit('info', event));
      });
    this.normalizers = normalizers;

    // At the moment we only support JSON encoding.
    this.encoder = new JsonEncode();
    this.decoder = new JsonDecode();
  }

  /**
   * Serializes data in the appropriate format.
   *
   * @param {*} data
   *   Any data.
   * @param {string} format
   *   Format name.
   * @param {Object} context
   *   Options normalizers/encoders have access to.
   *
   * @return {Promise<string>}
   *   The serialized object.
   */
  serialize(data, format, context) {
    return Promise.resolve()
      .then(() => {
        if (!this.supportsEncoding(format)) {
          throw new Error(`Serialization for the format ${format} is not supported`);
        }
        return this.encoder.needsNormalization(format) ?
          this.normalize(data, format, context) :
          data;
      })
      .then(normalized => this.encode(normalized, format, context));
  }

  /**
   * Deserializes data into the given type.
   *
   * @param {string} data
   *   Input data.
   * @param {Function} type
   *   The class of the desired object.
   * @param {string} format
   *   Format name.
   * @param {Object} context
   *   Options denormalizers/decoders have access to.
   *
   * @return {Promise<*>}
   *   An object of the provided type.
   */
  deserialize(data, type, format, context) {
    return Promise.resolve()
      .then(() => {
        if (!this.supportsDecoding(format)) {
          throw new Error(`Deserialization for the format ${format} is not supported`);
        }

        const decoded = this.decode(data, format, context);

        return this.denormalize(decoded, type, format, context);
      });
  }

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
  normalize(data, format, context) {
    return Promise.resolve()
      .then(() => {
        // If a normalizer supports the given data, use it
        const normalizer = this.getNormalizer(data, format);
        if (normalizer) {
          return normalizer.normalize(data, format, context || {});
        }

        // If it's null or an scalar.
        if (data === null || (/boolean|number|string/).test(typeof data)) {
          return data;
        }

        // Call recursively for arrays and plain objects.
        if (Array.isArray(data)) {
          // We don't need to resequence, since Promise.all keeps the same order
          // in the output that we had in the input.
          return Promise.all(
            data.map(datum => this.normalize(datum, format, context))
          );
        }
        if (data.constructor.name === 'Object') {
          return Promise.all(
            Object.keys(data).map(key => this.normalize(data[key], format, context))
          )
          // Put back together the object keys and the normalized values.
            .then(values => _.zipObject(Object.keys(data), values));
        }

        // Typed objects should have been normalized at the beginning.
        if (typeof data === 'object') {
          if (!this.normalizers.length) {
            throw new Error('You must register at least one normalizer to be able to normalize objects.');
          }

          throw new Error(`Could not normalize object of type ${data.constructor.name}, no supporting normalizer found.`);
        }

        const roughSerialization = util.inspect(
          data,
          { depth: null, maxArrayLength: null, breakLength: Infinity }
        );
        throw new Error(`An unexpected value could not be normalized: ${roughSerialization}`);
      });
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
  denormalize(data, type, format, context) {
    return Promise.resolve()
      .then(() => {
        if (!this.normalizers.length) {
          throw new Error('You must register at least one normalizer to be able to denormalize objects.');
        }

        const normalizer = this.getDenormalizer(data, type, format);
        if (normalizer) {
          return normalizer.denormalize(data, type, format, context || {});
        }

        throw new Error(`Could not denormalize object of type ${type.name}, no supporting denormalizer found.`);
      });
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
  supportsNormalization(data, format) {
    return this.getNormalizer(data, format) !== null;
  }

  /**
   * Checks if the serializer can denormalize the given object.
   *
   * @param {*} data
   *   The object to denormalize.
   * @param {Function} type
   *   The class of the desired object.
   * @param {string} format
   *   The format name.
   *
   * @return {boolean}
   *   TRUE if the object can be denormalized. FALSE otherwise.
   */
  supportsDenormalization(data, type, format) {
    return this.getDenormalizer(data, type, format) !== null;
  }

  /**
   * Finds the normalizer to use with the provided data.
   *
   * @param {*} data
   *   The typed object to normalize.
   * @param {string} format
   *   The format name.
   *
   * @return {Normalizer|undefined}
   *   A normalizer object or undefined if none can be found.
   */
  getNormalizer(data, format) {
    const normalizer = this.normalizers.find((nrmlzr) => {
      this.emit('silly', {
        message: `Checking if ${nrmlzr.constructor.name} supports normalization`,
        format,
      });
      return nrmlzr.supportsNormalization(data, format);
    });
    if (normalizer) {
      this.emit('silly', {
        message: `Normalizer found: ${normalizer.constructor.name}`,
        format,
      });
    }

    return normalizer;
  }

  /**
   * Finds the denormalizer to use with the provided data to instantiate an
   * object of the provided type.
   *
   * @param {*} data
   *   The typed object to denormalize.
   * @param {Function} type
   *   The class of the desired object.
   * @param {string} format
   *   The format name.
   *
   * @return {Normalizer|undefined}
   *   A denormalizer object or undefined if none can be found.
   */
  getDenormalizer(data, type, format) {
    const denormalizer = this.normalizers.find((dnrmlzr) => {
      try {
        this.emit('silly', {
          message: `Checking if ${dnrmlzr.constructor.name} supports denormalization`,
          format,
          type: type.name,
        });
        return dnrmlzr.supportsDenormalization(data, type, format);
      }
      catch (e) {
        // Return false.
      }
      return false;
    });
    if (denormalizer) {
      this.emit('silly', {
        message: `Normalizer found: ${denormalizer.constructor.name}`,
        format,
      });
    }

    return denormalizer;
  }

  /**
   * Transforms a set of arrays, plain objects and scalars into an string.
   *
   * @param {*} data
   *   The set of arrays, plain objects and scalars.
   * @param {string} format
   *   The format name.
   * @param {Object} context
   *   Options normalizers/encoders have access to.
   *
   * @return {string}
   *   The encoded string.
   */
  encode(data, format, context) {
    return this.encoder.encode(data, format, context);
  }

  /**
   * Transforms a string into a set of arrays, plain objects and scalars.
   *
   * @param {string} data
   *   The input string.
   * @param {string} format
   *   The format name.
   * @param {Object} context
   *   Options denormalizers/decoders have access to.
   *
   * @return {*}
   *   The set of arrays, plain objects and scalars.
   */
  decode(data, format, context) {
    return this.decoder.decode(data, format, context);
  }

  /**
   * Checks if the current encoder can do the job for this format.
   *
   * @param {string} format
   *   The format name.
   *
   * @return {boolean}
   *   TRUE if encoding is supported. FALSE otherwise.
   */
  supportsEncoding(format) {
    return this.encoder.supportsEncoding(format);
  }

  /**
   * Checks if the current encoder can do the job for this format.
   *
   * @param {string} format
   *   The format name.
   *
   * @return {boolean}
   *   TRUE if decoding is supported. FALSE otherwise.
   */
  supportsDecoding(format) {
    return this.decoder.supportsDecoding(format);
  }

}

module.exports = Serializer;
