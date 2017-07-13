/**
 * @overview 新人引导--选择用户
 * @author longyun
 * @date 7/28/16
 */
'use strict';

const GuideService = require('services/guide');
const _ = require('lodash');

module.exports = function*() {
    const data = yield Promise.resolve().then(() => {
        const guideService = new GuideService(this);

        return Promise.props({
            'official' : guideService.getRecommendOfficial(),
            'users' : guideService.getRecommendUser().then((ret) => {

                ret.data = _.sampleSize(ret.data, 6);

                return ret.data;
            }).catch((e) => {
                this.log.error(e);
            })
        });
    });
    yield this.render('guide/follow/index', data);
};
