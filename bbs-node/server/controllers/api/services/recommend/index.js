/**
 * 推荐页对外开放的数据接口
 * @qingtong
 * 1/12/2017
 */

'use strict';

const RecommendService = require('model/recommend');
const util = require('lib/util');

module.exports = function*() {
    const platform = util.getPlatform(this) || 70;
    // 首页锦囊提问分页数
    const { v2, jinnangSize = 3 } = this.query;
    const data = yield RecommendService(this, platform, {v2, jinnangSize});
    this.body = data;
};

