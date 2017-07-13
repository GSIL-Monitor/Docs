/**
 * @overview 消息数量
 * @author langkun
 * @date 7/25/16
 */

var RecommendService = require('services/recommend');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {

        const recommendService = new RecommendService(this);
        return recommendService.getMiscData();
    });
};