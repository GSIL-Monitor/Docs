/**
 * @overview
 * @author cisong
 * @date 6/13/16
 */

const PostService = require('services/post');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
        const tid = parseInt(this.request.body.tid, 10);

        if (!tid) {
            return Promise.reject();
        }

        const postService = new PostService(this);

        return postService.favOpt(tid);
    });
};
