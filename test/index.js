const Serializer = require('./src/SerializerTest');
const JsonDecode = require('./src/encoder/JsonDecodeTest');
const JsonEncode = require('./src/encoder/JsonEncodeTest');
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
  Normalizer,
};
