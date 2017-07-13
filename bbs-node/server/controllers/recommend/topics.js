/**
 * @overview 推荐页
 * @author longyun
 * @date 7/21/16
 */
'use strict';

const RecommendService = require('services/recommend');
const util = require('lib/util');

module.exports = function*() {
    const platform = util.getPlatform(this);

    const data = yield Promise.resolve().then(() => {
        const recommendService = new RecommendService(this);
        return recommendService.getTopics(platform);
    }).then((ret) => {
        return ret.data;
    });

    yield this.render('recommend/topics', { topics: data });
};
