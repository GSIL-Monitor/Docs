/**
 * 锦囊对外开放的推荐提问(RN)
 * @qingtong
 * 6/23/2017
 */

'use strict';

const JinnangService = require('services/jinnang');

module.exports = function*() {
	this.body = yield Promise.resolve().then(() => {
        const jinnangService = new JinnangService(this);

        return jinnangService.getRecommendQuestion();
    });
};