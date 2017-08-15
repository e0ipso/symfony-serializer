const Serializer = require('./src/SerializerTest');
const JsonDecode = require('./src/encoder/JsonDecodeTest');
const JsonEncode = require('./src/encoder/JsonEncodeTest');
const XmlDecode = require('./src/encoder/XmlDecodeTest');
const XmlEncode = require('./src/encoder/XmlEncodeTest');
const ChainDecoder = require('./src/encoder/ChainDecoderTest');
const ChainEncoder = require('./src/encoder/ChainEncoderTest');
const Normalizer = require('./src/normalizer/NormalizerTest');

const sinon = require('sinon');

module.exports = {
  setUp(cb) {
    this.stubs = [];

    this.stubWithPromise = (objToStub, functionName) => {
      const stub = sinon.stub(objToStub, functionName);
      stub.returns(Promise.resolve());
      this.stubs.push(stub);
    };

    cb();
  },

  tearDown(cb) {
    this.stubs.forEach((stub) => {
      if (typeof stub.restore === 'function') {
        stub.restore();
      }
    });
    this.stubs = [];

    cb();
  },
  Serializer,
  JsonDecode,
  JsonEncode,
  XmlDecode,
  XmlEncode,
  ChainDecoder,
  ChainEncoder,
  Normalizer,
};
