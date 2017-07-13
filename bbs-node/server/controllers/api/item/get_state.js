/**
 * @overview
 * @author cisong
 * @date 6/5/16
 */

const PostService = require('services/post');
const ForumService = require('services/forum');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
        const tid = parseInt(this.query.tid, 10);
        const fid = parseInt(this.query.fid, 10);

        // 微博不显示板块
        const isWeiboFid = fid === 16735;

        if (!tid || !fid) {
            return Promise.reject();
        }

        const postService = new PostService(this);
        const forumService = new ForumService(this);

        return Promise.props({
            stats: postService.getPostStat(tid).then((ret) => {
                return ret.data;
            }),
            forum: isWeiboFid ? Promise.resolve({
                fid: null
            }) : forumService.getForumDetail(fid).then((ret) => {
                return ret.data;
            }),
            replies: postService.queryHotReply(tid).then((ret) => {
                return ret.data;
            })
        });
    }).then((ret) => {
        return {
            code: 0,
            data: ret
        };
    }).catch((err) => {
        this.log.error(err);
    });
};
