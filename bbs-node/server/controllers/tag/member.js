/**
 * 标签订阅用户列表
 * Created by L3au on 9/22/16.
 */
'use strict';

const TagService = require('../../services/tag');
const util = require('lib/util');

module.exports = function*() {
    const tagId = this.query.tagId;
    const navTitle = this.query.nav;

    const data = yield Promise.resolve().then(() => {
        if (!tagId) {
            return Promise.reject('标签不存在');
        }

        const tagService = new TagService(this);

        return tagService.queryTagSubscriber({
            tagId: tagId,
            pageSize: 20
        });
    }).then((ret) => {
        return {
            pageTitle: navTitle,
            users: ret.data || []
        }
    });

    yield this.render('tag-member/index', data);
};

