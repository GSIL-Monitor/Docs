/**
 * 帖子详情页的投票接口
 * @zanghong
 */

const PostService = require('services/post');


module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
      
        let form = this.request.body;       

        const postService = new PostService(this);
        return postService.doVoteOption(form).then((ret) => {
			return ret;
		})		
    });
};