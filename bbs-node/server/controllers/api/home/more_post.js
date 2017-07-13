/**
 * @overview
 * @author qingtong
 * @date 1/24/17
 */

const HomeService = require('services/home');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
        const query = this.query;
        const lastPostTime = query.lastPostTime;

        if (!lastPostTime) {
            return Promise.reject();
        }

        const homeService = new HomeService(this);
        return homeService.getMorePost(query);
    });
};