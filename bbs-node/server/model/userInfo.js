/**
 * 用户中心数据model
 * @author qingtong
 * @date 1/20/17
 */

const UserInfoService = require('services/userInfo');

function* Service(ctx, uid) {
	const userInfoService = new UserInfoService(ctx);

	const data = yield Promise.resolve().then(() => {
			return Promise.props({
				profile: userInfoService.getUserProfile(uid)
			}).then((ret) => {
				return ret.profile.users;
			}).catch((err) => {
				ctx.log.error(err);
				return {};
			});
	})

	return {
		code: 0,
		data
	};
}

module.exports = Service;