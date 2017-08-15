const JsonDecode = require('../../../src/encoder/JsonDecode');

module.exports = {
  setUp(cb) {
    this.sut = new JsonDecode();
    cb();
  },
  testDecode(test) {
    test.expect(1);
    test.deepEqual(this.sut.decode('{"foo":"bar"}'), { foo: 'bar' });
    test.done();
  },
  testSupportDecoding(test) {
    test.expect(2);
    test.ok(!this.sut.supportsDecoding('foo'));
    test.ok(this.sut.supportsDecoding('foojson'));
    test.done();
  },
};
