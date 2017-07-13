/**
 * @overview
 * @author cisong
 * @date 4/18/16
 */

const CommonService = require('services/common');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
        const commonService = new CommonService(this);

        return commonService.getRecommendPost();
    });
};
