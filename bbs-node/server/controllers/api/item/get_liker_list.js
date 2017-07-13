/**
 * 动态获取点赞人数
 * @qingtong
 */

const PostService = require('services/post');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
		const tid = parseInt(this.request.body.tid, 10);
		const lastId = parseInt(this.request.body.lastId, 10);
		const pageSize = parseInt(this.request.body.pageSize, 10);

        if (!tid) {
            return Promise.reject();
        }

        const postService = new PostService(this);
        return postService.getlikeList(tid, lastId, pageSize).then((ret) => {
			return ret;
		})
    });
};