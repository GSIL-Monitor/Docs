/**
 * @overview 粉丝和关注
 * @author qingtong
 * @date 3/9/17
 */
'use strict';

const HomeService = require('services/home');

module.exports = function*() {

    const homeService = new HomeService(this);
	const {uid, fans, follow} = this.query;

	// const data = yield Promise.resolve().then(() => {
 //        // if (!uid) {
 //        //     return Promise.reject();
 //        // }

 //        return Promise.props({
 //            personal: homeService.homePage(uid).then((ret) => {
 //                return ret.data;
 //            }).catch((err) => {
 //                this.log.error(err);
 //            })
 //        })
 //    }).then((ret) => {
 //        const personal = ret.personal;
 //        const {fansCount, followCount} = ret.personal;

 //        personal.fansCount = personal.fansCount > 99 ? '99+' : personal.fansCount;
 //        personal.followCount = personal.followCount > 99 ? '99+' : personal.followCount;
        
 //        ret.INIT_DATA = {
 //            uid,
 //            fans,
 //            follow
 //        }

 //        return ret;
 //    })

    const data = {
        INIT_DATA: {
            uid,
            fans,
            follow
        }
    }

    yield this.render('follow/index', data);
};

