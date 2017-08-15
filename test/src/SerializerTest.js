const Serializer = require('../../src/Serializer');

module.exports = {
  setUp(cb) {
    this.sut = new Serializer([]);
    cb();
  },
};
