/**
 * @overview 个人主页
 * @author qingtong
 * @date 1/18/17
 */

const bios = require('store/bios');
const util = require('lib/util');
const url = require('url');
const _ = require('lodash');
const HomeService = require('services/home');

module.exports = function*() {

	const platform = util.getPlatform(this);
	const isQianTang = util.isQiantang(this);
	const uid = this.query.uid;

	const homeService = new HomeService(this);

	const data = yield Promise.resolve().then(() => {
		if (!uid) {
            return Promise.reject();
        }

		return Promise.props({
			personal: homeService.homePage(uid).then((ret) => {
				return ret.data;
			}).catch((err) => {
				this.log.error(err);
			})
		})
	}).then((ret) => {
		const personal = ret.personal;

		if (!personal) {
            return Promise.reject();
        }

		// 简介处理
		if (!personal.bio) {
			personal.bio = bios[Math.floor(util.randomRange(0, bios.length - 1))];
		}

		// 数字转换
		personal.fansCount = util.number2W(personal.fansCount);
		personal.postCount = personal.postCount > 99 ? '99+' : personal.postCount;
		personal.tagCount = personal.tagCount > 99 ? '99+' : personal.tagCount;  
		// 判断类型
		ret.isBBSApp = isQianTang;
		ret.platform = platform;
		// 用户大图
		const parsed = url.parse(personal.headImgUrl).pathname;
        personal.headImgUrlOrig = parsed;

		// 时间处理
		if (personal.posts.length) {
			personal.posts.forEach((post) => {
				// 这里postTime保存的是s,需要转换成ms
				post.friendTime = util.friendlyTime(post.postTime*1000);
				post.uid = personal.uid;
				post.likes = util.number2W(post.likes);
                post.replies = util.number2W(post.replies);

				// 区分无标题和有标题展示区别
				if (!post.subject) {
					post.lineClamp = 2;
				} else {
					post.lineClamp = 1;
				}
			});
		}

		const lastPost = personal.posts.slice(-1)[0] || {};

		ret.INIT_STATE = {
			lastPostTime: lastPost.postTime
		};

		return ret;
	});

	yield this.render('home/index', data);

};