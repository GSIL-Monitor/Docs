/**
 * @overview
 * @author zanghong
 * @date 1/9/17
 */

const TagService = require('../../../services/tag');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {

        const tagService = new TagService(this);

        return tagService.getMyTagList();
    });
};