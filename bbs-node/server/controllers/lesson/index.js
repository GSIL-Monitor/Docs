/**
 * 公开课
 * @zanghong
 */

'use strict';
const LessonService = require('services/lesson');
const urlParse = require('url').parse;

module.exports = function*() {

    const platform = this.query.platform || 71;
    const type=30; //banner类型 30是社区公开课
    const num=3;//公开课首页，每个课程类别展示的数目
    const data = yield Promise.resolve().then(() => {
    	const lessonService = new LessonService(this);
    	return Promise.props({
            banners: lessonService.getBanners(platform,type).then((ret) => {
                return ret.banners;
            }).catch((e) => {
                this.log.error(e);
            }),
            index_list: lessonService.getIndexList(num).then((ret) => {
                return ret;
            }).catch((e) => {
                this.log.error(e);
            })
        });
    }).then((ret) => {
        //截断标题
        ret.index_list.data.lesson.forEach((lessonListObj) => {
            lessonListObj.lessonList.forEach((list)=>{
                if (list.title.length > 14) {
                    list.lineClamp = 2;
                } else {
                    list.lineClamp = 1;
                }
            });
        });
        // 取前3条banner
        if (ret.banners && ret.banners.length > 3) {
            ret.banners = ret.banners.slice(0, 3).map((banner) => {
                // 统一添加 popup=1
                const parsed = urlParse(banner.url, true, true);
                
                if (parsed.host === 'sites.wacai.com') {
                    parsed.protocol = 'http';
                }

                parsed.query.popup = 1;
                delete parsed.search;

                banner.url = parsed.format();

                return banner;
            });
        }
        return ret;
    });

	yield this.render('lesson/index', data);
};