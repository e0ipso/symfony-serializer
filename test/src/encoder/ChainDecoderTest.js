const ChainDecoder = require('../../../src/encoder/ChainDecoder');
const sinon = require('sinon');

module.exports = {
  setUp(cb) {
    this.fakeDecoder = {
      decode: sinon.stub().returns('foo'),
      supportsDecoding: sinon.stub().withArgs('the format').returns(true),
    };
    this.sut = new ChainDecoder([this.fakeDecoder]);
    this.stubs.push(this.fakeDecoder.decode);
    cb();
  },
  testDecode(test) {
    test.expect(1);
    this.sut.decode({}, 'the format', {});
    test.ok(this.fakeDecoder.decode.called);
    test.done();
  },
  testSupportsDecoding(test) {
    test.expect(2);
    const sut = new ChainDecoder([]);
    // Even if there is no decoder, the JsonDecode is used as a default.
    test.ok(sut.supportsDecoding('the format'));
    test.ok(this.sut.supportsDecoding('the format'));
    test.done();
  },
  testGetDecoder(test) {
    test.expect(3);
    const sut = new ChainDecoder([]);
    test.equal(sut.getDecoder('the format').constructor.name, 'JsonDecode');
    test.equal(this.sut.getDecoder('the format').constructor.name, 'Object');
    this.sut.getDecoder('the format');
    test.notEqual(
      typeof this.sut.decoders[this.sut.decoderByFormat['the format']],
      'undefined'
    );
    test.done();
  },
};
