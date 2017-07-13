/**
 * @overview
 * @author cisong
 * @date 9/20/16
 */

const TagService = require('../../../services/tag');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
        const query = this.query;
        const tagId = parseInt(query.tagId, 10);

        if (!tagId) {
            return Promise.reject('缺少 tagId');
        }

        const tagService = new TagService(this);

        return tagService.queryPostList({
            pageSize: 20,
            tagId: tagId,
            type: query.tabType,
            orderBy: query.orderBy,
            lastTime: query.lastTime
        });
    });
};
