/**
 * 活跃之星
 * @qingtong
 */

'use strict';

const StarService = require('services/event/star');

module.exports = function*() {

	const starInstance = new StarService(this);
	const index = this.query.index;

	const data = yield Promise.resolve().then(() => {
		if (!index) {
			return Promise.reject('期数不存在');
		}

		return starInstance.getStarInfo(index);
	}).then((ret) => {

		var intros = ret.rewardExplain.split('/r/n').filter((ele) => {
			if (!!ele) {
				return ele;
			}
		})

		return {
			data: Object.assign({}, ret, {
				intros: intros
			})
		};
	});

	yield this.render('event/star/index', data);
};