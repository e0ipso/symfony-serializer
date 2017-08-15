const XmlEncode = require('../../../src/encoder/XmlEncode');

module.exports = {
  setUp(cb) {
    this.sut = new XmlEncode();
    cb();
  },
  testEncode(test) {
    test.expect(1);
    const actual = this.sut.encode({ foo: { _: 'bar', $: { baz: 'oof' } } });
    const expected = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<foo baz="oof">bar</foo>';
    test.equal(actual, expected);
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
    test.ok(this.sut.supportsEncoding('fooxml'));
    test.done();
  },
};
