/**
 * 公开课列表页
 * @zanghong
 */

'use strict';
const LessonService = require('services/lesson');


module.exports = function*() {
    const cid=parseInt(this.query.cid, 10);
    const page=1;
    const query={page:page,cid:cid};
	const data = yield Promise.resolve().then(() => {
	    const lessonService = new LessonService(this);
	    return lessonService.getList(query);
	}).then((ret) => {
		ret.INIT_STATE={
			page:page,
			cid:cid
		};
	    ret.data.lessonList.forEach((list)=>{
	        if (list.title.length > 14) {
	            list.lineClamp = 2;
	        } else {
	            list.lineClamp = 1;
	        }
	    });
		return ret;
	});
	yield this.render('lesson/lessonlist', data);
};