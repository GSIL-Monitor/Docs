const constants = require('./lib/constants');
const platform = require('./lib/platform');
const formatter = require('./lib/formatter');
const version = require('./lib/version');

module.exports = Object.assign({}, constants, platform, formatter,version);
