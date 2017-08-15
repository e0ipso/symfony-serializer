const ChainEncoder = require('../../../src/encoder/ChainEncoder');
const sinon = require('sinon');

module.exports = {
  setUp(cb) {
    this.fakeEncoder = {
      encode: sinon.stub().returns('foo'),
      supportsEncoding: sinon.stub().withArgs('the format').returns(true),
    };
    this.sut = new ChainEncoder([this.fakeEncoder]);
    this.stubs.push(this.fakeEncoder.encode);
    cb();
  },
  testEncode(test) {
    test.expect(1);
    this.sut.encode({}, 'the format', {});
    test.ok(this.fakeEncoder.encode.called);
    test.done();
  },
  testSupportsEncoding(test) {
    test.expect(2);
    const sut = new ChainEncoder([]);
    // Even if there is no decoder, the JsonEncode is used as a default.
    test.ok(sut.supportsEncoding('the format'));
    test.ok(this.sut.supportsEncoding('the format'));
    test.done();
  },
  testNeedsNormalization(test) {
    test.expect(3);
    test.ok(this.sut.needsNormalization('the format'));
    this.fakeEncoder.normalize = () => {};
    test.ok(!this.sut.needsNormalization('the format'));
    this.fakeEncoder.getEncoder = () => {};
    this.fakeEncoder.needsNormalization = sinon.stub().returns('lorem');
    this.stubs.push(this.fakeEncoder.needsNormalization);
    test.equal(this.sut.needsNormalization('the format'), 'lorem');
    delete this.fakeEncoder.normalize;
    delete this.fakeEncoder.getEncoder;
    test.done();
  },
  testGetEncoder(test) {
    test.expect(3);
    const sut = new ChainEncoder([]);
    test.equal(sut.getEncoder('the format').constructor.name, 'JsonEncode');
    test.equal(this.sut.getEncoder('the format').constructor.name, 'Object');
    this.sut.getEncoder('the format');
    test.notEqual(
      typeof this.sut.encoders[this.sut.encoderByFormat['the format']],
      'undefined'
    );
    test.done();
  },
};
