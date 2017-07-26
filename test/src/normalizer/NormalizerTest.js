const Normalizer = require('../../../src/normalizer/Normalizer');

/**
 * Tests that
 * @param {{methods: string[], staticMethods: string[], getters: []}} names
 *   A list of methods and getters.
 * @param {*} fakeInterface
 *   The fake interface to test.
 * @param {Object} test
 *   The nodeunit test object.
 *
 * @return {void}
 */
const tester = (names, fakeInterface, test) => {
  names.methods.forEach(name => test.throws(
    () => fakeInterface[name](),
    Error,
    'Abstract method did not trow.'
  ));
  names.staticMethods.forEach(name => test.throws(
    () => fakeInterface.constructor[name](),
    Error,
    'Abstract static method did not trow.'
  ));
  names.getters.forEach(name => test.throws(
    () => fakeInterface[name],
    Error,
    'Abstract getter did not trow.'
  ));
};

module.exports = {
  testError(test) {
    test.expect();
    const methods = [
      'normalize',
      'supportsNormalization',
      'denormalize',
      'supportsDenormalization',
    ];
    const getters = [];
    const staticMethods = [];
    tester({
      methods,
      staticMethods,
      getters,
    }, new Normalizer(), test);
    test.done();
  },
};
