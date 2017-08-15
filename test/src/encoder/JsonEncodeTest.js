const JsonEncode = require('../../../src/encoder/JsonEncode');

module.exports = {
  setUp(cb) {
    this.sut = new JsonEncode();
    cb();
  },
  testEncode(test) {
    test.expect(1);
    test.deepEqual(this.sut.encode({ foo: 'bar' }), '{"foo":"bar"}');
    test.done();
  },
  testNeedsNormalization(test) {
    test.expect(1);
    test.ok(this.sut.needsNormalization());
    test.done();
  },
  testSupportEncoding(test) {
    test.expect(2);
    test.ok(!this.sut.supportsEncoding('foo'));
    test.ok(this.sut.supportsEncoding('foojson'));
    test.done();
  },
};
