/**
 * @overview 新人引导--选择标签
 * @author longyun
 * @date 7/28/16
 */
'use strict';

const GuideService = require('services/guide');

module.exports = function*() {
    const guideService = new GuideService(this);

    const data = yield Promise.resolve().then(() => {
        return guideService.getLabels();
    }).then((ret) => {
        return {
            labels: ret
        };
    });

    yield this.render('guide/label/index', data);
};
