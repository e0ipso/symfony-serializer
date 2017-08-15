const sinon = require('sinon');
const XmlDecode = require('../../../src/encoder/XmlDecode');

module.exports = {
  setUp(cb) {
    this.sut = new XmlDecode();
    cb();
  },
  testDecodeFail(test) {
    test.expect(1);
    // Decoding invalid XML.
    this.sut.decode('foo baz="oof"/foo>')
      .catch((err) => {
        test.notEqual(typeof err, 'undefined');
        test.done();
      });
  },
  testDecode(test) {
    test.expect(1);
    this.sut.decode('<foo baz="oof">bar</foo>')
      .then((res) => {
        test.deepEqual(res, { foo: { _: 'bar', $: { baz: 'oof' } } });
        test.done();
      });
  },
  testSupportDecoding(test) {
    test.expect(2);
    test.ok(!this.sut.supportsDecoding('foo'));
    test.ok(this.sut.supportsDecoding('fooxml'));
    test.done();
  },
};
