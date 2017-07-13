/**
 * 发帖中的投票
 * @zanghong
 */

'use strict';
const util = require('lib/util');

module.exports = function*() {
	const platform = util.getPlatform(this);
 	const deviceid = this.headers['x-deviceid'] || '';
 	const ret = {};
 	ret.platform = platform;
    ret.deviceid = deviceid;
    yield this.render('vote-in-post/index',{INIT_DATA:ret});
};