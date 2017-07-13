/**
 * @overview 个性化推荐不感兴趣
 * @author longyun
 * @date 7/25/16
 */

var RecommendService = require('services/recommend');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {

        const recommendService = new RecommendService(this);
        return recommendService.clearMsg();
    });
};