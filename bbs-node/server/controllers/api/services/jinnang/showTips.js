/**
 * 锦囊对外开放的数据接口
 * @qingtong
 * 4/11/2017
 */

'use strict';

const JinnangService = require('model/jinnang');
const util = require('lib/util');

module.exports = function*() {
    const platform = util.getPlatform(this) || 70;
    const data = yield JinnangService(this, platform);
    this.body = data;
};

