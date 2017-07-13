/**
 * @overview
 * @author longyun
 * @date 7/25/16
 */

var RecommendService = require('services/recommend');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
        const query = this.query;
        const lastTime = query.lastTime;

        if (!lastTime) {
            return Promise.reject();
        }

        const recommendService = new RecommendService(this);
        return recommendService.getRecommendList(query);
    });
};