/**
 * @overview
 * @author cisong
 * @date 6/5/16
 */

const PostService = require('services/post');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
        const query = this.query;
        const tid = parseInt(query.tid, 10);

        if (!tid) {
            return Promise.reject();
        }

        const postService = new PostService(this);

        return postService.queryReply(query);
    });
};
