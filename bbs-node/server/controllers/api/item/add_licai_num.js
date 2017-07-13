/**
 * 增加福利人数
 * @qingtong
 */

const PostService = require('services/post');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
       
        const postService = new PostService(this);

        return postService.addLicaiCount();
    });
};