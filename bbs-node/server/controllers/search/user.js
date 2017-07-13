/**
 * @overview
 * @author cisong
 * @date 3/23/16
 */

'use strict';

const escape = require('escape-html');
const SearchService = require('services/search');

module.exports = function*() {
    const keyword = this.query.keyword;

    const data = yield Promise.resolve().then(() => {
        if (!keyword || keyword.length > 100) {
            return Promise.reject();
        }

        const searchService = new SearchService(this);

        return searchService.searchUserV1(escape(keyword), 1);
    }).then((ret) => {
        return {
            page: 'user',
            keyword: keyword,
            users: ret.data
        };
    }).catch(e => e);

    yield this.render('search/user/index', data);
};
