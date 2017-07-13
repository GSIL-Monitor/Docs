/**
 * @overview 订阅标签用户列表接口
 * @author cisong
 * @date 10/10/16
 */

const TagService = require('../../../services/tag');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
        const query = this.query;
        const lastIndexId = query.lastIndexId;
        const tagId = parseInt(query.tagId, 10);

        if (!tagId) {
            return Promise.reject('缺少 tagId');
        }

        const tagService = new TagService(this);

        return tagService.queryTagSubscriber({
            tagId: tagId,
            lastIndexId: lastIndexId,
            pageSize: 20
        });
    });
};
